import { KEYPAD_EDGE_STROKE_WIDTH, KEYPAD_TOP_RADIUS } from '../constants';

const INSET = KEYPAD_EDGE_STROKE_WIDTH / 2;

/** Corner radius clamped so narrow widths never invert the top segment. */
export function edgeRadius(width: number): number {
  return Math.min(KEYPAD_TOP_RADIUS, width / 2 - INSET);
}

/**
 * Right half of the panel's rounded-top outline: from the top-center, across to
 * the top-right corner, around it, and straight down the right side to `height`.
 * Drawn (via strokeDashoffset) it reveals outward from the center. Open-ended so
 * a vertical fade gradient can dissolve the descending side rail.
 *
 * Drawn in a `0 0 {width} {height}` viewBox.
 */
export function buildTopEdgeRightPath(width: number, height: number): string {
  const r = edgeRadius(width);
  const cx = width / 2;
  const right = width - INSET;

  return `M${cx} ${INSET} L${right - r} ${INSET} A${r} ${r} 0 0 1 ${right} ${r} L${right} ${height}`;
}

/**
 * Left half of the outline — mirror of {@link buildTopEdgeRightPath} for the
 * symmetric center-out draw: top-center to the top-left corner and down the left side.
 */
export function buildTopEdgeLeftPath(width: number, height: number): string {
  const r = edgeRadius(width);
  const cx = width / 2;

  return `M${cx} ${INSET} L${INSET + r} ${INSET} A${r} ${r} 0 0 0 ${INSET} ${r} L${INSET} ${height}`;
}
