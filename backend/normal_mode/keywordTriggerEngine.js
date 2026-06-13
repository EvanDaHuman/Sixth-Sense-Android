// keywordTriggerEngine.js
//
// Sixth Sense — offline keyword trigger matching.
//
// Pure, dependency-free phrase matching: given a transcript string (from Vosk),
// return whether any flagged phrase appears, with its category. No AI, no
// network. This file holds ONLY the matching logic so it can be unit-tested
// without a microphone or Vosk.

/**
 * Hardcoded flagged phrases and their category.
 * Multiple spellings (with/without apostrophes) are included because offline
 * STT often drops apostrophes ("don't" -> "dont", "i'm" -> "im").
 */
export const KEYWORDS = [
  { phrase: 'leave me alone', category: 'boundary' },
  { phrase: "don't touch me", category: 'boundary' },
  { phrase: 'dont touch me', category: 'boundary' },
  { phrase: 'help', category: 'distress' },
  { phrase: 'get out', category: 'boundary' },
  { phrase: "i'm scared", category: 'distress' },
  { phrase: 'im scared', category: 'distress' },
  { phrase: "i'll hurt you", category: 'threat' },
  { phrase: 'ill hurt you', category: 'threat' },
  { phrase: 'i will hurt you', category: 'threat' },
  { phrase: "i'm going to hurt you", category: 'threat' },
  { phrase: 'im going to hurt you', category: 'threat' },
  { phrase: "i'll kill you", category: 'threat' },
  { phrase: 'ill kill you', category: 'threat' },
  { phrase: 'i will kill you', category: 'threat' },
];

/**
 * Normalize text for matching: lowercase, drop apostrophes (so "don't" and
 * "dont" both become "dont"), turn other punctuation into spaces, and collapse
 * whitespace.
 */
function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/['’`]/g, '') // drop apostrophes
    .replace(/[^a-z0-9\s]/g, ' ') // other punctuation -> space
    .replace(/\s+/g, ' ')
    .trim();
}

// Precompute the normalized form of every keyword once.
const NORMALIZED_KEYWORDS = KEYWORDS.map((k) => ({
  ...k,
  normalized: normalize(k.phrase),
}));

/**
 * Check a transcript chunk for any flagged phrase.
 *
 * @param {string} transcript raw transcript text from Vosk
 * @returns {{
 *   matched: boolean,
 *   mode: 'normal' | 'suspicious',
 *   phrase?: string,
 *   category?: string,
 *   matches: Array<{ phrase: string, category: string }>,
 *   transcript: string,
 * }}
 */
export function detectKeywordTrigger(transcript) {
  const text = normalize(transcript);

  // All flagged phrases present in the transcript.
  let found = text
    ? NORMALIZED_KEYWORDS.filter((k) => text.includes(k.normalized))
    : [];

  // Collapse overlapping variants: drop any match whose normalized phrase is a
  // substring of another, longer matched phrase (e.g. "ill hurt you" inside
  // "i will hurt you"), then dedupe identical normalized forms. Genuinely
  // distinct phrases (e.g. "help" and "leave me alone") are kept separate.
  const seen = new Set();
  const matches = found
    .filter(
      (k) =>
        !found.some(
          (o) =>
            o.normalized.length > k.normalized.length &&
            o.normalized.includes(k.normalized),
        ),
    )
    .filter((k) => (seen.has(k.normalized) ? false : seen.add(k.normalized)))
    .map((k) => ({ phrase: k.phrase, category: k.category }));

  if (matches.length === 0) {
    return { matched: false, mode: 'normal', matches: [], transcript };
  }

  // The first match drives the headline output; `matches` carries the rest.
  return {
    matched: true,
    mode: 'suspicious',
    phrase: matches[0].phrase,
    category: matches[0].category,
    matches,
    transcript,
  };
}
