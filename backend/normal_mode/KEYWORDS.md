# Keyword trigger (offline, Vosk) — terminal only

Streams your **computer microphone** through **Vosk** (fully offline speech-to-text),
converts speech to text, and runs each transcript chunk through
`detectKeywordTrigger(transcript)`. On a match it prints:

```
KEYWORD TRIGGER DETECTED
Mode: suspicious
Matched phrase: <phrase>
Category: <category>
Transcript: <transcript>
```

No cloud, no paid API (no Deepgram / OpenAI / Google / AWS), no website, no audio
stored or uploaded. Stop with **Ctrl+C**.

```bash
cd backend/normal_mode
npm run monitor-keywords
```

## How it works

```
mic ─▶ sox/rec (16kHz mono 16-bit PCM) ─▶ stt_vosk.py (Vosk) ─▶ transcript
    ─▶ detectKeywordTrigger() ─▶ print on match
```

Node orchestrates and does the keyword matching; Vosk runs as a small **Python**
STT subprocess. This is deliberate: the Node `vosk` package depends on
`ffi-napi`, which will not compile on current macOS toolchains (clang 21 / SDK 26
/ Node 23+). Python's Vosk ships prebuilt wheels, so there is **nothing to
compile and no Node-native dependency** — the Node side runs on your normal Node.

## Files (new — not the pushed audio-spike engine)

| File | What it is |
| --- | --- |
| `keywordTriggerEngine.js` | Pure phrase matching: `detectKeywordTrigger()` + hardcoded `KEYWORDS`. |
| `monitorKeywords.js` | Terminal runner: spawns sox + Python, pipes audio, prints triggers. |
| `stt_vosk.py` | Vosk STT bridge: raw PCM on stdin → transcript lines on stdout. |
| `package.json` | Defines `npm run monitor-keywords` (no Node dependencies). |

All of these live in `backend/normal_mode/`.

## Flagged phrases

Hardcoded in `keywordTriggerEngine.js`, with categories `boundary`, `distress`,
`threat`. Both apostrophe and no-apostrophe spellings are included because
offline STT usually drops apostrophes (`don't` → `dont`). Overlapping variants
(e.g. `ill hurt you` inside `i will hurt you`) collapse to a single match.

## Setup

### 1. SoX (microphone capture)

```bash
brew install sox     # macOS (Homebrew)
rec --version        # confirm it's on your PATH
```

### 2. Vosk (Python — prebuilt wheel, no compiling)

```bash
python3 -m pip install vosk
```

### 3. Download an English Vosk model

```bash
cd backend/normal_mode
curl -LO https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip
mv vosk-model-small-en-us-0.15 model
```

The runner looks for `backend/normal_mode/model/`, then
`backend/normal_mode/vosk-model-small-en-us-0.15/`, or `$VOSK_MODEL_PATH` if set.
(`model/` and `node_modules/` are gitignored.)

### 4. Run

```bash
cd backend/normal_mode
npm run monitor-keywords
```

Speak a flagged phrase (e.g. "help", "leave me alone", "i will hurt you"). Each
non-matching utterance is echoed with a `·` prefix so you can see it's listening.
First run, macOS will ask to allow microphone access for your terminal — allow it
(System Settings → Privacy & Security → Microphone).

## Test the matcher without a mic

`detectKeywordTrigger` is pure and runs on any Node version (from
`backend/normal_mode`):

```bash
node --input-type=module -e '
import { detectKeywordTrigger } from "./keywordTriggerEngine.js";
console.log(detectKeywordTrigger("please just leave me alone"));
console.log(detectKeywordTrigger("the weather is nice"));
'
```

You can also exercise the whole STT chain with synthesized speech (macOS `say`):

```bash
say -o /tmp/kw.aiff "i will hurt you"
sox /tmp/kw.aiff -q -r 16000 -c 1 -b 16 -e signed-integer -t raw - | python3 stt_vosk.py
```

## Troubleshooting

- **`rec`/SoX not found** → `brew install sox` and make sure `/opt/homebrew/bin`
  is on your PATH.
- **`python3` not found / STT exits immediately** → install Python 3 and
  `python3 -m pip install vosk`.
- **No transcripts appear** → check mic permission under
  System Settings → Privacy & Security → Microphone.
- **`MODEL_NOT_FOUND`** → you haven't downloaded the model (step 3) or
  `$VOSK_MODEL_PATH` is wrong.
