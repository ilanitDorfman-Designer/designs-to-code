import { getSegmentArcLength, getSegmentDashGeometry } from './pie-segment-geometry.util';

const CIRC = 100;

describe('getSegmentArcLength', () => {
  it('scales the fraction by the circumference', () => {
    expect(getSegmentArcLength(0.25, CIRC)).toBe(25);
    expect(getSegmentArcLength(1, CIRC)).toBe(100);
  });

  it('clamps fractions to [0, 1]', () => {
    expect(getSegmentArcLength(-0.5, CIRC)).toBe(0);
    expect(getSegmentArcLength(2, CIRC)).toBe(100);
  });

  it('returns 0 for invalid circumference or fraction', () => {
    expect(getSegmentArcLength(0.5, 0)).toBe(0);
    expect(getSegmentArcLength(0.5, -10)).toBe(0);
    expect(getSegmentArcLength(Number.NaN, CIRC)).toBe(0);
  });
});

describe('getSegmentDashGeometry', () => {
  it('builds a [dash, gap] pair covering one full turn', () => {
    const { dashArray } = getSegmentDashGeometry(0.25, 0, CIRC);
    expect(dashArray).toEqual([25, 75]);
    expect(dashArray[0] + dashArray[1]).toBe(CIRC);
  });

  it('offsets the first segment by the full circumference (== top start)', () => {
    const { dashOffset } = getSegmentDashGeometry(0.25, 0, CIRC);
    expect(dashOffset).toBe(CIRC);
  });

  it('positions later segments at their cumulative start', () => {
    // Second segment starts after a 0.25 turn -> startLength 25 -> offset 75
    const { dashArray, dashOffset } = getSegmentDashGeometry(0.5, 0.25, CIRC);
    expect(dashArray).toEqual([50, 50]);
    expect(dashOffset).toBe(75);
  });

  it('returns a zero geometry for invalid circumference', () => {
    expect(getSegmentDashGeometry(0.5, 0, 0)).toEqual({ dashArray: [0, 0], dashOffset: 0 });
  });
});
