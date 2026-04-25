/**
 * Lightweight visitor-info extractors.
 *
 * Pure functions over a single visitor message. Used by the agents
 * runner to backfill `support_sessions.visitor_*` columns when a visitor
 * types contact info into chat instead of providing it via the widget's
 * pre-fill fields.
 *
 * Each extractor returns `null` when no confident match is found —
 * callers must distinguish "no match" from "empty string".
 */

/**
 * Extract a US phone number and normalize to E.164 (`+1XXXXXXXXXX`).
 *
 * Recognized shapes (in priority order):
 *   1. E.164: +1XXXXXXXXXX
 *   2. Separator: \(?XXX\)?[-.\s]XXX[-.\s]XXXX  (with optional 1- prefix)
 *   3. Bare 10 digits, surrounded by non-digits (so "20240501123" misses)
 *
 * Anti-patterns we deliberately reject so we never confuse stats-speak
 * for a phone number:
 *   "200 calls/week", "20-35%", "in 2024", "$1500/month"
 */
export function extractPhone(text: string): string | null {
  if (!text) return null;

  // 1. E.164 — anchor on word boundary so "+1949555014299" isn't truncated.
  const e164 = /\+1(\d{10})(?!\d)/.exec(text);
  if (e164) return `+1${e164[1]}`;

  // 2. Separator-based US shape. Optional leading "1-" or "1." or "1 ".
  //    Each separator is required so "200 calls/week" never matches.
  const sep =
    /(?:^|[^\d])(?:1[-.\s])?\(?(\d{3})\)?[-.\s](\d{3})[-.\s](\d{4})(?!\d)/.exec(
      text
    );
  if (sep) return `+1${sep[1]}${sep[2]}${sep[3]}`;

  // 3. Bare 10 digits — must be word-bounded by non-digits on both sides
  //    so "20240501123" (11 in a row) doesn't false-positive.
  const bare = /(?:^|[^\d])(\d{10})(?!\d)/.exec(text);
  if (bare) return `+1${bare[1]}`;

  return null;
}

/**
 * Extract a single email address.
 *
 * Standard practical regex — not RFC 5322 perfect, but covers the
 * shapes humans actually type into chat.
 */
export function extractEmail(text: string): string | null {
  if (!text) return null;
  const m = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/.exec(text);
  return m ? m[1] : null;
}

/**
 * Extract a personal name.
 *
 * Heuristics (capitalize-aware to avoid catching common verbs/adjectives):
 *   - "I'm <Name>" / "I am <Name>"
 *   - "my name is <Name>"
 *   - "this is <Name>"
 *   - leading "<First> <Last>," at the start of a message
 *
 * <Name> is one capitalized word, optionally followed by a second
 * capitalized word (handles "Sarah" and "Sarah Mendez" but rejects
 * "running a med spa" because "running" is lowercase).
 */
export function extractName(text: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();

  const NAME = /([A-Z][a-zA-Z'\-]+(?:\s+[A-Z][a-zA-Z'\-]+)?)/;

  // Leading "First Last," at the start of a message — require two
  // capitalized words so "Hi, I'm Sarah" doesn't return "Hi".
  const leading = /^([A-Z][a-zA-Z'\-]+\s+[A-Z][a-zA-Z'\-]+),/.exec(trimmed);
  if (leading) return leading[1];

  // Intro patterns are written with explicit case variants instead of
  // the /i flag so the NAME group stays capitalize-aware ([A-Z] must
  // be a real uppercase letter, otherwise "this is sarah from the spa"
  // would catch "from" too).
  const introPatterns = [
    /\bI(?:'m| am)\s+/,
    /\b[Mm]y name is\s+/,
    /\b[Tt]his is\s+/,
    /\b[Nn]ame'?s\s+/,
  ];
  for (const intro of introPatterns) {
    const re = new RegExp(intro.source + NAME.source);
    const m = re.exec(trimmed);
    if (m) return m[1];
  }

  return null;
}
