import { computeScrollIntoViewX, SCROLL_EDGE_PADDING } from './compute-scroll-into-view-x';

describe('computeScrollIntoViewX', () => {
  const viewportWidth = 200;

  it('returns null when the chip is fully visible', () => {
    expect(computeScrollIntoViewX({ chipX: 50, chipWidth: 40, viewportWidth, scrollX: 0 })).toBeNull();
    // flush against both edges is still "visible"
    expect(computeScrollIntoViewX({ chipX: 0, chipWidth: viewportWidth, viewportWidth, scrollX: 0 })).toBeNull();
  });

  it('scrolls left to reveal a chip clipped on the left (minus edge padding, clamped to 0)', () => {
    // chip at x=100 but scrolled past it to 150 → chipLeft(100) < visibleLeft(150)
    expect(computeScrollIntoViewX({ chipX: 100, chipWidth: 40, viewportWidth, scrollX: 150 })).toBe(100 - SCROLL_EDGE_PADDING);
    // never returns a negative offset
    expect(computeScrollIntoViewX({ chipX: 2, chipWidth: 40, viewportWidth, scrollX: 50 })).toBe(0);
  });

  it('scrolls right to reveal a chip clipped on the right (plus edge padding)', () => {
    // chip right edge at 340 exceeds visibleRight(0+200) → align right edge + padding
    const result = computeScrollIntoViewX({ chipX: 300, chipWidth: 40, viewportWidth, scrollX: 0 });
    expect(result).toBe(340 - viewportWidth + SCROLL_EDGE_PADDING); // 148
  });

  it('honours a custom edge padding', () => {
    expect(computeScrollIntoViewX({ chipX: 100, chipWidth: 40, viewportWidth, scrollX: 150, edgePadding: 0 })).toBe(100);
  });
});
