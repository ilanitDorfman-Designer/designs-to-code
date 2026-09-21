// ==============================================
// Character Key Builder
// ==============================================

import type { DigitAnchor, ParsedCharacter } from '../api';

/**
 * Builds a stable React key per parsed character so the digit slots keep their identity (and so
 * only the genuinely-changed slots animate) as the value changes.
 *
 * - `'decimal'` (default): keys are anchored to the decimal point (`pos-${place}`). Best for
 *   live-updating magnitudes (prices, balances): the units digit is always the same slot, so a
 *   growing value adds a new most-significant slot on the left while the rest roll (odometer).
 * - `'leading'`: digits are keyed by their order from the left (`dig-${n}`), the decimal point is
 *   `dot`, and other separators are `sep-${m}`. Best for left-to-right typed input: existing digits
 *   keep their identity (no roll) while a newly typed digit is a new slot on the right and commas
 *   simply reflow.
 *
 * @example
 * // 'leading': "34,055" -> "340,555" keeps dig-0..dig-4 and adds dig-5 (no roll)
 */
export function buildCharacterKeys(characters: ParsedCharacter[], anchor: DigitAnchor = 'decimal'): string[] {
  if (anchor === 'decimal') {
    return characters.map((character) => `pos-${character.place}`);
  }

  let digitIndex = 0;
  let separatorIndex = 0;
  return characters.map((character) => {
    if (character.isDigit) {
      return `dig-${digitIndex++}`;
    }
    if (character.char === '.') {
      return 'dot';
    }
    return `sep-${separatorIndex++}`;
  });
}
