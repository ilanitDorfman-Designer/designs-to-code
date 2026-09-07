/**
 * SVG dash geometry for a single donut arc.
 *
 * Arcs are drawn as full `Circle`s with a `[dash, gap]` `strokeDasharray` and a
 * `strokeDashoffset` that positions the dash's start at the segment's cumulative
 * offset. Combined with a `-90°` group rotation (start at 12 o'clock) and
 * `strokeLinecap="butt"`, consecutive arcs render clockwise and gapless.
 */
export type SegmentDashGeometry = {
  /** `[dashLength, gapLength]` covering exactly one full turn */
  dashArray: [number, number];
  /** `strokeDashoffset` placing the dash start at the segment's cumulative offset */
  dashOffset: number;
};

/**
 * Arc length (in circumference units) that a segment of the given `fraction`
 * occupies. Non-finite / out-of-range fractions clamp to `[0, 1]`.
 */
export function getSegmentArcLength(fraction: number, circumference: number): number {
  if (!Number.isFinite(fraction) || !Number.isFinite(circumference) || circumference <= 0) {
    return 0;
  }
  const clamped = Math.min(Math.max(fraction, 0), 1);
  return clamped * circumference;
}

/**
 * Computes the static dash geometry for a segment.
 *
 * @param fraction - This segment's share of the whole (0–1)
 * @param cumulativeFraction - Sum of preceding segments' fractions (0–1)
 * @param circumference - Full circle circumference
 */
export function getSegmentDashGeometry(fraction: number, cumulativeFraction: number, circumference: number): SegmentDashGeometry {
  if (!Number.isFinite(circumference) || circumference <= 0) {
    return { dashArray: [0, 0], dashOffset: 0 };
  }

  const arcLength = getSegmentArcLength(fraction, circumference);
  const startLength = getSegmentArcLength(cumulativeFraction, circumference);

  return {
    dashArray: [arcLength, circumference - arcLength],
    // Dash start position along the path == (circumference - dashOffset) mod circumference.
    // We want it at `startLength`, so dashOffset = circumference - startLength.
    dashOffset: circumference - startLength,
  };
}
