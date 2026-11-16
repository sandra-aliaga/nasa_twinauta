"""Compose a reproducible 30-second instrumental cue without external samples."""

import subprocess
import wave
from pathlib import Path

import numpy as np

RATE = 48000
DURATION = 30
BEAT = 60 / 96
OUTPUT = Path("output/playwright")
mix = np.zeros((RATE * DURATION, 2), dtype=np.float64)


def add(signal, start, level, pan=0.0):
    offset = int(start * RATE)
    size = min(len(signal), len(mix) - offset)
    if size <= 0:
        return
    gains = np.sqrt([(1 - pan) / 2, (1 + pan) / 2])
    mix[offset : offset + size] += signal[:size, None] * gains * level


def tone(note, duration, soft=False):
    time = np.arange(int(RATE * duration)) / RATE
    frequency = 440 * 2 ** ((note - 69) / 12)
    if soft:
        sound = (
            sum(
                np.sin(2 * np.pi * frequency * detune * time)
                for detune in (0.9985, 1.0, 1.0015)
            )
            / 3
        )
        envelope = np.minimum(time / 0.7, 1) * np.minimum((duration - time) / 1.2, 1)
    else:
        sound = sum(
            weight * np.sin(2 * np.pi * frequency * harmonic * time)
            for harmonic, weight in ((1, 1), (2, 0.18), (3, 0.035))
        )
        envelope = (1 - np.exp(-time * 180)) * np.exp(-time * 2.3)
        envelope *= np.minimum((duration - time) / 0.15, 1)
    return sound * np.maximum(envelope, 0)


# Twelve bars at 96 BPM: tension, exploration, then a quieter resolution.
chords = [(52, 59, 66, 67), (48, 55, 62, 64), (43, 55, 59, 62), (50, 57, 62, 66)]
for bar in range(12):
    chord = chords[bar % 4] if bar < 11 else chords[0]
    start = bar * 4 * BEAT
    for index, note in enumerate(chord):
        add(tone(note, 3.6, soft=True), start, 0.052, (index - 1.5) * 0.3)
    if 2 <= bar <= 9:
        for step in range(8):
            note = chord[(step + bar) % 4] + 12
            add(tone(note, 1.5), start + step * BEAT / 2, 0.022, 0.35)

melody = [
    (5.0, 76),
    (6.25, 71),
    (7.5, 74),
    (8.75, 71),
    (10.0, 74),
    (11.25, 79),
    (12.5, 78),
    (13.75, 74),
    (15.0, 76),
    (15.9375, 79),
    (16.875, 83),
    (18.125, 81),
    (19.375, 79),
    (20.625, 78),
    (21.875, 74),
    (23.75, 76),
    (25.0, 71),
    (26.25, 67),
    (27.5, 76),
]
for index, (start, note) in enumerate(melody):
    add(tone(note, 2.5), start, 0.09, -0.2 if index % 2 else 0.2)

# Quiet stereo echoes provide space without spoken or sampled material.
dry = mix.copy()
for delay, level in ((0.1875, 0.14), (0.375, 0.10), (0.75, 0.06)):
    shift = int(delay * RATE)
    mix[shift:] += dry[:-shift, ::-1] * level

time = np.arange(len(mix)) / RATE
fade = np.minimum(time / 1.5, 1) * np.minimum((DURATION - time) / 2, 1)
mix *= fade[:, None]
mix *= 0.7 / max(np.max(np.abs(mix)), 0.001)
OUTPUT.mkdir(parents=True, exist_ok=True)
raw = OUTPUT / "twinnauta-score-source.wav"
with wave.open(str(raw), "wb") as audio:
    audio.setnchannels(2)
    audio.setsampwidth(2)
    audio.setframerate(RATE)
    audio.writeframes((mix * 32767).astype("<i2").tobytes())

subprocess.run(
    [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(raw),
        "-af",
        "loudnorm=I=-24:TP=-2:LRA=9",
        "-ar",
        str(RATE),
        str(OUTPUT / "twinnauta-score.wav"),
    ],
    check=True,
)
subprocess.run(
    [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(OUTPUT / "twinnauta-score.wav"),
        "-codec:a",
        "libmp3lame",
        "-q:a",
        "2",
        str(OUTPUT / "twinnauta-score.mp3"),
    ],
    check=True,
)
