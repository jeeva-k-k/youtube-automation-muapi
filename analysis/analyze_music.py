#!/usr/bin/env python3
import sys
import wave

import numpy as np


def load_mono_pcm16(path):
    with wave.open(path, "rb") as wav:
        rate = wav.getframerate()
        channels = wav.getnchannels()
        data = np.frombuffer(wav.readframes(wav.getnframes()), dtype="<i2").astype(np.float32)
    data = data.reshape(-1, channels).mean(axis=1) / 32768.0
    return rate, data


def estimate_key(rate, audio):
    frame = 4096
    hop = 2048
    window = np.hanning(frame)
    freqs = np.fft.rfftfreq(frame, 1.0 / rate)
    valid = (freqs >= 55.0) & (freqs <= 3000.0)
    midi = np.rint(69.0 + 12.0 * np.log2(np.maximum(freqs, 1e-9) / 440.0)).astype(int)
    chroma = np.zeros(12, dtype=np.float64)
    for start in range(0, max(1, len(audio) - frame), hop):
        spectrum = np.abs(np.fft.rfft(audio[start:start + frame] * window)) ** 2
        weights = np.log1p(spectrum[valid])
        for pitch_class in range(12):
            chroma[pitch_class] += weights[(midi[valid] % 12) == pitch_class].sum()
    chroma /= np.linalg.norm(chroma) + 1e-12

    major = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
    minor = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    scores = []
    for root in range(12):
        scores.append((np.corrcoef(chroma, np.roll(major, root))[0, 1], f"{names[root]} major"))
        scores.append((np.corrcoef(chroma, np.roll(minor, root))[0, 1], f"{names[root]} minor"))
    return sorted(scores, reverse=True)[:5], chroma


def estimate_tempo(rate, audio):
    frame = 2048
    hop = 512
    window = np.hanning(frame)
    previous = None
    flux = []
    for start in range(0, max(1, len(audio) - frame), hop):
        spectrum = np.abs(np.fft.rfft(audio[start:start + frame] * window))
        spectrum /= spectrum.sum() + 1e-12
        flux.append(0.0 if previous is None else np.maximum(spectrum - previous, 0.0).sum())
        previous = spectrum
    envelope = np.asarray(flux)
    envelope = np.maximum(envelope - np.median(envelope), 0.0)
    envelope -= envelope.mean()
    corr = np.correlate(envelope, envelope, mode="full")[len(envelope) - 1:]
    bpms = np.arange(60.0, 201.0, 0.25)
    lags = np.rint((60.0 * rate) / (bpms * hop)).astype(int)
    raw = corr[np.clip(lags, 1, len(corr) - 1)]
    best = np.argsort(raw)[-8:][::-1]
    return [(float(bpms[i]), float(raw[i])) for i in best]


def estimate_beat_phase(rate, audio, bpm=160.0):
    frame = 2048
    hop = 512
    window = np.hanning(frame)
    previous = None
    flux = []
    for start in range(0, max(1, len(audio) - frame), hop):
        spectrum = np.abs(np.fft.rfft(audio[start:start + frame] * window))
        spectrum /= spectrum.sum() + 1e-12
        flux.append(0.0 if previous is None else np.maximum(spectrum - previous, 0.0).sum())
        previous = spectrum
    envelope = np.asarray(flux)
    envelope = np.maximum(envelope - np.median(envelope), 0.0)
    times = (np.arange(len(envelope)) * hop + frame / 2) / rate
    period = 60.0 / bpm
    phases = np.linspace(0.0, period, 400, endpoint=False)
    scores = []
    for phase in phases:
        grid = np.arange(phase, times[-1], period)
        scores.append(np.interp(grid, times, envelope).sum())
    return float(phases[int(np.argmax(scores))])


def chroma_for_audio(rate, audio):
    frame = 4096
    hop = 1024
    window = np.hanning(frame)
    freqs = np.fft.rfftfreq(frame, 1.0 / rate)
    valid = (freqs >= 55.0) & (freqs <= 2500.0)
    midi = np.rint(69.0 + 12.0 * np.log2(np.maximum(freqs, 1e-9) / 440.0)).astype(int)
    chroma = np.zeros(12, dtype=np.float64)
    for start in range(0, max(1, len(audio) - frame), hop):
        spectrum = np.abs(np.fft.rfft(audio[start:start + frame] * window)) ** 2
        weights = np.log1p(spectrum[valid])
        for pitch_class in range(12):
            chroma[pitch_class] += weights[(midi[valid] % 12) == pitch_class].sum()
    return chroma / (np.linalg.norm(chroma) + 1e-12)


def estimate_chords(rate, audio, start_seconds, bars, bpm=160.0):
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    templates = {
        "maj": [(0, 1.0), (4, 0.8), (7, 0.8)],
        "min": [(0, 1.0), (3, 0.8), (7, 0.8)],
        "7": [(0, 1.0), (4, 0.75), (7, 0.75), (10, 0.55)],
        "m7": [(0, 1.0), (3, 0.75), (7, 0.75), (10, 0.55)],
    }
    bar_seconds = 4.0 * 60.0 / bpm
    result = []
    for bar in range(bars):
        left = int((start_seconds + bar * bar_seconds) * rate)
        right = int((start_seconds + (bar + 1) * bar_seconds) * rate)
        chroma = chroma_for_audio(rate, audio[left:right])
        candidates = []
        for root in range(12):
            for quality, tones in templates.items():
                template = np.full(12, -0.15)
                for interval, weight in tones:
                    template[(root + interval) % 12] = weight
                template /= np.linalg.norm(template)
                candidates.append((float(np.dot(chroma, template)), f"{names[root]}{quality}"))
        result.append(sorted(candidates, reverse=True)[:3])
    return result


if __name__ == "__main__":
    sample_rate, samples = load_mono_pcm16(sys.argv[1])
    key_scores, chroma = estimate_key(sample_rate, samples)
    tempos = estimate_tempo(sample_rate, samples)
    phase = estimate_beat_phase(sample_rate, samples, 160.0)
    print("key_candidates:")
    for score, name in key_scores:
        print(f"  {name}: {score:.4f}")
    print("tempo_candidates:")
    for bpm, score in tempos:
        print(f"  {bpm:.2f}: {score:.6f}")
    print(f"beat_phase_at_160_bpm: {phase:.6f} seconds from analysis-file start")
    if len(sys.argv) >= 4:
        chord_start = float(sys.argv[2])
        chord_bars = int(sys.argv[3])
        print(f"chords_from_{chord_start:.6f}:")
        for number, candidates in enumerate(estimate_chords(sample_rate, samples, chord_start, chord_bars), 1):
            rendered = ", ".join(f"{name}:{score:.3f}" for score, name in candidates)
            print(f"  bar {number:02d}: {rendered}")
