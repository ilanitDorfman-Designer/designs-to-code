import { KEYPAD_EDGE_STROKE_WIDTH, KEYPAD_TOP_RADIUS } from '../constants';
import { buildTopEdgeLeftPath, buildTopEdgeRightPath, edgeRadius } from './build-top-edge-path';

describe('build-top-edge-path', () => {
  const inset = KEYPAD_EDGE_STROKE_WIDTH / 2;
  const width = 400;
  const height = 112;

  it('both halves start at the top-center apex', () => {
    const cx = width / 2;
    expect(buildTopEdgeLeftPath(width, height).startsWith(`M${cx} ${inset}`)).toBe(true);
    expect(buildTopEdgeRightPath(width, height).startsWith(`M${cx} ${inset}`)).toBe(true);
  });

  it('both halves end at the bottom so the outline is open (for the fade)', () => {
    expect(buildTopEdgeLeftPath(width, height).endsWith(`${height}`)).toBe(true);
    expect(buildTopEdgeRightPath(width, height).endsWith(`${height}`)).toBe(true);
  });

  it('rounds the corners with an arc at the configured radius', () => {
    expect(buildTopEdgeLeftPath(width, height)).toContain(`A${KEYPAD_TOP_RADIUS} ${KEYPAD_TOP_RADIUS}`);
    expect(buildTopEdgeRightPath(width, height)).toContain(`A${KEYPAD_TOP_RADIUS} ${KEYPAD_TOP_RADIUS}`);
  });

  it('clamps the radius so narrow widths never invert the top segment', () => {
    expect(edgeRadius(20)).toBeLessThanOrEqual(20 / 2 - inset);
    expect(edgeRadius(400)).toBe(KEYPAD_TOP_RADIUS);
  });
});
