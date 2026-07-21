#!/usr/bin/env python3
"""Create deterministic audio-reactive and transcript timing data.

The current TTS response has no word timestamps. For this clean, known transcript,
the preprocessor distributes words by phonetic weight inside verified phrase
windows, then snaps boundaries toward nearby low-energy points in the narration.
The generated file records the method so it can later be replaced by a dedicated
forced aligner without changing the frontend contract.
"""
import argparse
import json
import math
import re
from pathlib import Path

import numpy as np
from scipy.io import wavfile


def resolve(base: Path, value: str) -> Path:
    return (base / value).resolve()


def mono_float(path: Path):
    rate, audio = wavfile.read(path)
    audio = np.asarray(audio)
    if audio.ndim == 2:
        audio = audio.mean(axis=1)
    if np.issubdtype(audio.dtype, np.integer):
        audio = audio.astype(np.float32) / max(abs(np.iinfo(audio.dtype).min), np.iinfo(audio.dtype).max)
    else:
        audio = audio.astype(np.float32)
    return rate, audio


def rms_envelope(audio, rate, hz=100):
    hop = max(1, rate // hz)
    count = math.ceil(len(audio) / hop)
    padded = np.pad(audio, (0, count * hop - len(audio)))
    env = np.sqrt(np.mean(padded.reshape(count, hop) ** 2, axis=1) + 1e-12)
    kernel = np.ones(5, dtype=np.float32) / 5
    return np.convolve(env, kernel, mode='same'), hz


def word_weight(token):
    clean = re.sub(r"[^A-Za-z']", '', token).lower()
    vowel_groups = len(re.findall(r'[aeiouy]+', clean))
    return max(0.65, 0.34 * len(clean) + 0.70 * max(1, vowel_groups))


def snap_to_valley(target, low, high, env, env_hz, radius=0.11):
    a = max(low, target - radius)
    b = min(high, target + radius)
    ia = max(0, int(a * env_hz))
    ib = min(len(env), int(b * env_hz) + 1)
    if ib <= ia + 1:
        return target
    section = env[ia:ib]
    floor = float(np.percentile(section, 35))
    candidates = np.where(section <= floor)[0]
    if not len(candidates):
        return target
    times = (candidates + ia) / env_hz
    return float(times[np.argmin(np.abs(times - target))])


def align_caption(cue, env, env_hz):
    tokens = cue['text'].split()
    weights = np.array([word_weight(t) for t in tokens], dtype=np.float64)
    start, end = float(cue['start']), float(cue['end'])
    usable = max(0.05, end - start)
    raw = start + np.cumsum(weights) / weights.sum() * usable
    boundaries = [start]
    for target in raw[:-1]:
        lower = boundaries[-1] + 0.045
        upper = end - 0.045 * (len(tokens) - len(boundaries))
        boundaries.append(max(lower, min(upper, snap_to_valley(float(target), lower, upper, env, env_hz))))
    boundaries.append(end)
    words = []
    for i, token in enumerate(tokens):
        words.append({'text': token, 'start': round(boundaries[i], 4), 'end': round(boundaries[i + 1], 4)})
    return {**cue, 'words': words}


def frame_waveform(audio, rate, fps, duration):
    hop = rate / fps
    values = []
    for frame in range(math.ceil(duration * fps)):
        a = int(frame * hop)
        b = min(len(audio), int((frame + 1) * hop))
        chunk = audio[a:b]
        values.append(float(np.sqrt(np.mean(chunk * chunk) + 1e-12)) if len(chunk) else 0.0)
    arr = np.array(values, dtype=np.float32)
    ceiling = max(float(np.percentile(arr, 97)), 1e-6)
    arr = np.clip(arr / ceiling, 0, 1)
    return [round(float(x), 4) for x in arr]


def run(project_path: Path, output_path: Path):
    project = json.loads(project_path.read_text())
    audio_path = resolve(project_path.parent, project['audio'])
    rate, audio = mono_float(audio_path)
    env, env_hz = rms_envelope(audio, rate)
    captions = [align_caption(c, env, env_hz) for c in project['captions']]
    fmt = project['format']
    data = {
        'project_id': project['project_id'],
        'alignment_method': 'verified-cue-audio-valley-v1',
        'sample_rate': rate,
        'fps': fmt['fps'],
        'duration': fmt['duration'],
        'waveform': frame_waveform(audio, rate, fmt['fps'], fmt['duration']),
        'captions': captions,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, indent=2) + '\n')
    print(output_path)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('project', type=Path)
    ap.add_argument('output', type=Path)
    args = ap.parse_args()
    run(args.project.resolve(), args.output.resolve())
