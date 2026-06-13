#!/usr/bin/env python3
"""
stt_vosk.py — offline speech-to-text bridge for Sixth Sense.

Reads raw 16kHz mono signed-16-bit PCM from stdin (piped in by the Node runner
from the microphone via SoX), runs it through Vosk locally, and prints each
final transcript segment as a line of plain text on stdout.

This is the ONLY job of this file: PCM bytes -> transcript text. All keyword
matching lives in keywordTriggerEngine.js on the Node side. Nothing is uploaded,
stored, or sent to any cloud/AI service.
"""

import json
import os
import sys
import warnings

warnings.filterwarnings("ignore")  # silence harmless transitive-dep warnings

from vosk import Model, KaldiRecognizer, SetLogLevel

SetLogLevel(-1)  # silence Vosk's internal logging
SAMPLE_RATE = 16000
CHUNK_BYTES = 4000


def resolve_model_path():
    """$VOSK_MODEL_PATH, else ./model, else ./vosk-model-small-en-us-0.15."""
    env = os.environ.get("VOSK_MODEL_PATH")
    if env:
        return env
    here = os.path.dirname(os.path.abspath(__file__))
    for name in ("model", "vosk-model-small-en-us-0.15"):
        candidate = os.path.join(here, name)
        if os.path.isdir(candidate):
            return candidate
    return os.path.join(here, "model")


def main():
    model_path = resolve_model_path()
    if not os.path.isdir(model_path):
        # The Node side watches stderr for this marker and prints instructions.
        sys.stderr.write("MODEL_NOT_FOUND:%s\n" % model_path)
        sys.stderr.flush()
        return 2

    model = Model(model_path)
    recognizer = KaldiRecognizer(model, SAMPLE_RATE)

    stdin = sys.stdin.buffer
    while True:
        data = stdin.read(CHUNK_BYTES)
        if not data:
            break
        if recognizer.AcceptWaveform(data):
            text = json.loads(recognizer.Result()).get("text", "")
            if text:
                print(text, flush=True)

    # Flush any trailing buffered audio on shutdown.
    text = json.loads(recognizer.FinalResult()).get("text", "")
    if text:
        print(text, flush=True)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (KeyboardInterrupt, BrokenPipeError):
        sys.exit(0)
