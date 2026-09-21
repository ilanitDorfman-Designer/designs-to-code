/**
 * Returns a fully-transparent version of a color, preserving its RGB channels so a gradient can
 * fade *to nothing* instead of toward black. Fading to the literal `'transparent'` keyword
 * interpolates through black-at-low-alpha, which looks muddy on light backgrounds — use this for
 * any color→transparent gradient stop.
 *
 * Handles hex (3/4/6/8 digit), rgb/rgba, and falls back to appending `00` for other hex forms.
 */
export function makeTransparent(color: string): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    // 3-digit (#RGB) or 4-digit (#RGBA) → expand RGB to 6 digits + 00 alpha
    if (hex.length === 3 || hex.length === 4) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}00`;
    }
    // 6-digit (#RRGGBB) → append 00 alpha
    if (hex.length === 6) {
      return `${color}00`;
    }
    // 8-digit (#RRGGBBAA) → replace alpha with 00
    if (hex.length === 8) {
      return `#${hex.slice(0, 6)}00`;
    }
  }

  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0)`;
  }

  return `${color}00`;
}

/**
 * Append an alpha channel to a 6-digit hex colour (`#RRGGBB` → `#RRGGBBAA`). Prefer this over
 * hand-written hex concatenation (e.g. `` `${color}14` ``) so opacity reads as an intent (0–1)
 * rather than a magic two-char suffix. `alpha` is clamped to 0–1; inputs that aren't 6-digit hex
 * are returned unchanged so a styling miss can never throw.
 */
export function withAlpha(color: string, alpha: number): string {
  if (typeof color !== 'string' || !color.startsWith('#') || color.length !== 7) return color;
  const channel = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  return `${color}${channel}`;
}
