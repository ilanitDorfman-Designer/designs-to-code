import type { PieChartColor } from '../api/types';

/**
 * Resolves a segment's `color` prop to a single solid stroke color.
 *
 * - `[from, to]` tuple → the second (primary) value, so consumers can reuse the
 *   same gradient tuples they pass to `EtBreakdownChart` while arcs stay solid.
 * - `string` → used as-is.
 * - `undefined` → the provided `fallback` (typically a DS accent palette color).
 *
 * @param color - The raw color prop
 * @param fallback - Color to use when `color` is undefined
 * @returns A solid color string
 */
export function resolveSegmentColor(color: PieChartColor | undefined, fallback: string): string {
  if (Array.isArray(color)) {
    // Treat empty-string tuple entries as invalid (mirrors the solid-color check
    // below) so `['#aaa', '']` resolves to `#aaa` rather than an invalid stroke.
    return color[1] || color[0] || fallback;
  }
  if (typeof color === 'string' && color.length > 0) {
    return color;
  }
  return fallback;
}
