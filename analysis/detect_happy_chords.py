#!/usr/bin/env python3
import sys
import wave

import numpy as np

from analyze_music import chroma_for_audio


CHORDS = {
    "F7": [5, 9, 0, 3],
    "Fm7": [5, 8, 0, 3],
    "Bb": [10, 2, 5],
    "C": [0, 4, 7],
    "Bb7": [10, 2, 5, 8],
    "Dbmaj7": [1, 5, 8, 0],
    "Cm7": [0, 3, 7, 10],
}


def load(path):
    with wave.open(path, "rb") as wav:
        rate = wav.getframerate()
        channels = wav.getnchannels()
        samples = np.frombuffer(wav.readframes(wav.getnframes()), dtype="<i2").astype(np.float32)
    return rate, samples.reshape(-1, channels).mean(axis=1) / 32768.0


def template(notes):
    value = np.full(12, -0.18, dtype=np.float64)
    weights = [1.0, 0.82, 0.82, 0.56]
    for index, pitch in enumerate(notes):
        value[pitch] = weights[min(index, len(weights) - 1)]
    return value / np.linalg.norm(value)


def main():
    rate, audio = load(sys.argv[1])
    output = sys.argv[2]
    bpm = 160.0
    bar_seconds = 4.0 * 60.0 / bpm
    first_downbeat = 0.16125
    labels = list(CHORDS)
    templates = np.stack([template(CHORDS[label]) for label in labels])
    scores = []
    starts = []
    start = first_downbeat
    while start < len(audio) / rate:
        left = int(start * rate)
        right = min(len(audio), int((start + bar_seconds) * rate))
        if right - left < 4096:
            break
        chroma = chroma_for_audio(rate, audio[left:right])
        scores.append(templates @ chroma)
        starts.append(start)
        start += bar_seconds
    scores = np.asarray(scores)

    # Viterbi smoothing: prefer continuity while still allowing clear harmonic changes.
    count, states = scores.shape
    dp = np.full((count, states), -1e9)
    back = np.zeros((count, states), dtype=np.int32)
    dp[0] = scores[0]
    for bar_index in range(1, count):
        for state in range(states):
            transitions = dp[bar_index - 1] - 0.035
            transitions[state] += 0.055
            previous = int(np.argmax(transitions))
            dp[bar_index, state] = transitions[previous] + scores[bar_index, state]
            back[bar_index, state] = previous
    path = [int(np.argmax(dp[-1]))]
    for bar_index in range(count - 1, 0, -1):
        path.append(int(back[bar_index, path[-1]]))
    path.reverse()

    with open(output, "w", encoding="utf-8") as handle:
        handle.write("bar,start_seconds,chord,confidence\n")
        for index, state in enumerate(path):
            ordered = np.argsort(scores[index])[::-1]
            confidence = scores[index, ordered[0]] - scores[index, ordered[1]]
            handle.write(f"{index + 1},{starts[index]:.6f},{labels[state]},{confidence:.6f}\n")

    for index, state in enumerate(path):
        if index % 8 == 0:
            print()
            print(f"{starts[index]:7.2f}s:", end=" ")
        print(f"{labels[state]:7s}", end=" ")
    print()


if __name__ == "__main__":
    main()
