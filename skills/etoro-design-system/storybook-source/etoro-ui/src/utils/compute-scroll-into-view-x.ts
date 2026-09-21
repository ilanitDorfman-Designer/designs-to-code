/** Horizontal padding (px) kept between a scrolled-into-view chip and the viewport edge. */
export const SCROLL_EDGE_PADDING = 8;

export interface ScrollIntoViewInput {
  /** Selected chip's x offset within the scroll content. */
  chipX: number;
  /** Selected chip's width. */
  chipWidth: number;
  /** Visible viewport width of the scroll container. */
  viewportWidth: number;
  /** Current horizontal scroll offset. */
  scrollX: number;
  /** Edge padding to leave when scrolling into view (default {@link SCROLL_EDGE_PADDING}). */
  edgePadding?: number;
}

/**
 * Computes the horizontal scroll offset needed to bring a chip fully into view,
 * or `null` when it is already visible (no scroll needed). Clamped to >= 0.
 *
 * - Chip clipped on the left  → align its left edge (minus padding).
 * - Chip clipped on the right → align its right edge (plus padding) to the viewport.
 */
export function computeScrollIntoViewX({
  chipX,
  chipWidth,
  viewportWidth,
  scrollX,
  edgePadding = SCROLL_EDGE_PADDING,
}: ScrollIntoViewInput): number | null {
  const chipLeft = chipX;
  const chipRight = chipX + chipWidth;
  const visibleLeft = scrollX;
  const visibleRight = scrollX + viewportWidth;

  if (chipLeft < visibleLeft) {
    return Math.max(0, chipLeft - edgePadding);
  }
  if (chipRight > visibleRight) {
    return Math.max(0, chipRight - viewportWidth + edgePadding);
  }
  return null;
}
