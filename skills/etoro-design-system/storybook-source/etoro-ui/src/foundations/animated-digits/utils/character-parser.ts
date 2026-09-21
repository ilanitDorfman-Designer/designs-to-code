// ==============================================
// Character Parsing Utilities
// ==============================================

import type { ParsedCharacter } from '../api';

/**
 * Parses a number or string into individual characters with metadata
 * about whether each character is a digit or formatting character.
 *
 * Each character also gets a stable `place` (distance from the decimal point:
 * `anchorIndex - index`, where `anchorIndex` is the decimal index or the string
 * length when there is none). The units digit is `place` 1, tens 2, the decimal
 * point 0, the first fractional digit -1, and so on. This lets callers key
 * characters by place so a digit keeps its identity when the value's length
 * changes (e.g. 999 -> 1,000) instead of reshuffling by left-to-right index.
 *
 * @param number - The number or string to parse
 * @param decimalSeparator - Locale decimal separator to anchor on (default: '.'). Pass ',' for
 *   comma-decimal locales so the thousands separator is not mistaken for the decimal point.
 * @returns Array of parsed characters with type and place information
 *
 * @example
 * parseCharacters("1,234.56") // Returns:
 * // [
 * //   { char: "1", isDigit: true, digit: 1, place: 5 },
 * //   { char: ",", isDigit: false, digit: 0, place: 4 },
 * //   { char: "2", isDigit: true, digit: 2, place: 3 },
 * //   // ... etc
 * // ]
 */
export function parseCharacters(number: number | string, decimalSeparator = '.'): ParsedCharacter[] {
  const str = typeof number === 'number' ? number.toString() : number;
  const separatorIndex = str.indexOf(decimalSeparator);
  const anchorIndex = separatorIndex === -1 ? str.length : separatorIndex;

  return str.split('').map((char, index) => {
    const parsed = parseInt(char, 10);
    return {
      char,
      isDigit: !isNaN(parsed),
      digit: !isNaN(parsed) ? parsed : 0,
      place: anchorIndex - index,
    };
  });
}

/**
 * Resolves the decimal separator for a locale (e.g. '.' for en-US, ',' for de-DE) so numeric
 * places anchor on the real decimal point rather than a thousands separator.
 *
 * @param locale - BCP-47 locale tag used to format the value
 * @returns The locale's decimal separator, falling back to '.'
 */
export function getDecimalSeparator(locale: string): string {
  return (1.1).toLocaleString(locale).replace(/[0-9]/g, '') || '.';
}

/**
 * Validates if a character can be displayed by the animated count component
 *
 * @param char - Character to validate
 * @returns True if the character is supported (digit or common formatting)
 */
export function isValidCharacter(char: string): boolean {
  // Support digits, common punctuation, currency symbols, and percentage
  const validPattern = /^[0-9.,$€£¥%\s-]$/;
  return validPattern.test(char);
}

/**
 * Sanitizes input to remove unsupported characters
 *
 * @param input - Input number or string
 * @returns Sanitized string with only supported characters
 */
export function sanitizeInput(input: number | string): string {
  const str = typeof input === 'number' ? input.toString() : input;
  return str.split('').filter(isValidCharacter).join('');
}
