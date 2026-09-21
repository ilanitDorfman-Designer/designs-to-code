import { RiskScoreValue, RiskScoreVariant } from '../api/types';

/** Total number of arc segments displayed around the circle */
export const TOTAL_SEGMENTS = 10;

/**
 * The arc spans 240° — from 8 o'clock through the top to 4 o'clock —
 * leaving a 120° open gap at the bottom.
 * 12 o'clock sits exactly at the midpoint between segment 5 and segment 6.
 */
const ARC_SPAN_DEGREES = 240;

/** Degrees of empty space between consecutive segments */
const GAP_DEGREES = 12;

/** Degrees of arc each visible segment occupies */
const SEGMENT_DEGREES = (ARC_SPAN_DEGREES - (TOTAL_SEGMENTS - 1) * GAP_DEGREES) / TOTAL_SEGMENTS;

/** Degrees from one segment's start to the next segment's start */
const STEP_DEGREES = SEGMENT_DEGREES + GAP_DEGREES;

/**
 * SVG angle offset so that segment 0 starts at 8 o'clock.
 *
 * SVG circles begin their stroke at 3 o'clock (0°).
 * 8 o'clock = 150° SVG (clockwise from 3 o'clock).
 * A positive strokeDashoffset shifts the dash counterclockwise, so
 * to reach 8 o'clock we offset by (360° − 150°) = 210° of circumference.
 */
const START_OFFSET_DEGREES = 210;

/**
 * Returns the color for a specific segment based on the score value and variant.
 *
 * All active segments share the same color — the resolved score color.
 * For example, score 3 colors segments 0–2 with the color for risk level 3.
 *
 * @param segmentIndex - 0-based segment index (0 = first segment at 8 o'clock)
 * @param value - The current risk score value (1-10)
 * @param variant - Display variant ('multi' or 'single')
 * @param scoreColor - Theme-resolved color for the current score value
 * @param inactiveColor - Color to use for inactive segments
 * @returns The color string for this segment
 */
export function getSegmentColor(
  segmentIndex: number,
  value: RiskScoreValue,
  variant: RiskScoreVariant,
  scoreColor: string,
  inactiveColor: string,
): string {
  // Defensive bounds check — bail out for out-of-range indices or values
  if (!Number.isFinite(segmentIndex) || segmentIndex < 0 || segmentIndex >= TOTAL_SEGMENTS) {
    return inactiveColor;
  }

  if (!Number.isFinite(value) || value < 1 || value > TOTAL_SEGMENTS) {
    return inactiveColor;
  }

  if (variant === 'multi') {
    // All segments up to the score value share the score's color
    if (segmentIndex < value) {
      return scoreColor;
    }
    return inactiveColor;
  }

  // 'single' variant: only the segment at position (value - 1) is colored
  const targetSegment = value - 1;
  if (segmentIndex === targetSegment) {
    return scoreColor;
  }
  return inactiveColor;
}

/**
 * Calculates the SVG strokeDasharray for a segment arc.
 *
 * @param circumference - The full circumference of the circle
 * @returns The strokeDasharray value as [dashLength, gapLength]
 */
export function getSegmentDashArray(circumference = 0): [number, number] {
  if (circumference <= 0) {
    return [0, Math.max(0, circumference)];
  }

  const segmentLength = circumference * (SEGMENT_DEGREES / 360);
  return [segmentLength, circumference - segmentLength];
}

/**
 * Calculates the SVG strokeDashoffset for a segment to position it correctly.
 *
 * Segments start at 8 o'clock and proceed clockwise through the top
 * to 4 o'clock. 12 o'clock is the exact midpoint between segments 5 and 6.
 *
 * @param segmentIndex - 0-based segment index
 * @param circumference - The full circumference of the circle
 * @returns The strokeDashoffset value
 */
export function getSegmentDashOffset(segmentIndex: number, circumference: number): number {
  // Guard: circumference must be a positive number
  if (!Number.isFinite(circumference) || circumference <= 0) {
    return 0;
  }

  // Coerce segmentIndex to an integer and clamp to the valid range
  const maxSegments = Math.floor(360 / STEP_DEGREES);
  const clampedIndex = Math.max(0, Math.min(Math.trunc(segmentIndex), maxSegments - 1));

  const stepLength = circumference * (STEP_DEGREES / 360);
  // Start at 8 o'clock (210° counterclockwise from the SVG default 3 o'clock)
  return circumference * (START_OFFSET_DEGREES / 360) - clampedIndex * stepLength;
}
