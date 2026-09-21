// ============================================================================
// Text Link Parser
// ============================================================================
// Detects HTTP/HTTPS URLs in plain text and splits the string into typed
// segments for rendering. Used by EtReadMoreText for auto-link detection.
// ============================================================================

/** Segment types that can appear within parsed text */
export type TextSegmentType = 'text' | 'link';

/** A single segment of parsed text */
export interface TextSegment {
  /** Segment type */
  type: TextSegmentType;
  /** The segment text content */
  content: string;
  /** The extracted value (same as content for text; full URL for links) */
  value: string;
}

// ── Regex Pattern ──────────────────────────────────────────────────────────

/**
 * HTTP/HTTPS URLs — simplified version (no configurable TLD list).
 * Matches standard http(s) URLs, stopping at whitespace or closing
 * punctuation that is unlikely to be part of the URL.
 */
const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/gi;

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Parses a plain text string and returns an array of typed segments.
 *
 * Detected entity types:
 * - `'link'` — HTTP/HTTPS URLs
 * - `'text'` — plain text between links
 *
 * @example
 * ```ts
 * parseTextLinks('Visit https://example.com today');
 * // => [
 * //   { type: 'text', content: 'Visit ',                value: 'Visit ' },
 * //   { type: 'link', content: 'https://example.com',   value: 'https://example.com' },
 * //   { type: 'text', content: ' today',                value: ' today' },
 * // ]
 * ```
 */
export function parseTextLinks(text: string): TextSegment[] {
  if (!text) return [];

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    // Strip trailing sentence punctuation that is unlikely part of the URL
    const url = match[0].replace(/[.,!?;:]+$/, '');
    const start = match.index;

    // Plain text before this URL
    if (start > cursor) {
      const plain = text.slice(cursor, start);
      segments.push({ type: 'text', content: plain, value: plain });
    }

    // The URL itself
    segments.push({ type: 'link', content: url, value: url });

    cursor = start + url.length;
  }

  // Fast path: no URLs found
  if (segments.length === 0) {
    return [{ type: 'text', content: text, value: text }];
  }

  // Trailing plain text
  if (cursor < text.length) {
    const trailing = text.slice(cursor);
    segments.push({ type: 'text', content: trailing, value: trailing });
  }

  return segments;
}
