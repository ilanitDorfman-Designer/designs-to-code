/**
 * Computes the natural (unscaled) width an `EtAnimatedCount` will occupy for a formatted string,
 * mirroring its slot geometry: each digit slot is `digitWidth + spacing`, and each separator slot
 * (comma, decimal point, etc.) is `digitWidth / 2 + spacing`.
 *
 * This lets a consumer derive a fit-to-width scale deterministically from the value itself, instead
 * of measuring the rendered row (which RN clamps to the parent width and would truncate long values).
 */
export function getAnimatedCountWidth(formatted: string, digitWidth: number, spacing = 0): number {
  let width = 0;
  for (const char of formatted) {
    const isDigit = char >= '0' && char <= '9';
    width += (isDigit ? digitWidth : digitWidth / 2) + spacing;
  }
  return width;
}
