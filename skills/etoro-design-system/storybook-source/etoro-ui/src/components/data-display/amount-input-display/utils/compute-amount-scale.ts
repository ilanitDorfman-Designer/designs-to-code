import { getAnimatedCountWidth } from './get-animated-count-width';

export interface ComputeAmountScaleParams {
  /** Formatted value string (e.g. "1,234.56") that drives the shrink. */
  value: string;
  /** Measured width of the container the row must fit within. */
  availableWidth: number;
  /** Combined width of everything around the number (currency, unit, caret, gaps). */
  affixWidth?: number;
  /** Digit slot width used by `EtAnimatedCount` (mirrors its geometry). */
  digitWidth: number;
  /** Per-character spacing used by `EtAnimatedCount`. */
  spacing?: number;
  /** Digit count above which the progressive shrink begins (default 5 -> shrinks from the 6th digit). */
  shrinkStartDigits?: number;
  /** Scale removed per digit beyond the threshold (default 0.08). */
  shrinkStepPerDigit?: number;
  /** Floor for the progressive term (default 0.5). */
  progressiveMinScale?: number;
  /** Floor for the overflow guard for extreme values (default 0.3). */
  overflowMinScale?: number;
}

/**
 * Deterministic fit-to-width + progressive shrink scale for an animated amount row. Combines an
 * early character-count shrink with the overflow guard, taking the smaller so the value shrinks
 * ahead of overflow yet is still guaranteed to fit extreme lengths.
 */
export function computeAmountScale(params: ComputeAmountScaleParams): number {
  const {
    value,
    availableWidth,
    affixWidth = 0,
    digitWidth,
    spacing = 0,
    shrinkStartDigits = 5,
    shrinkStepPerDigit = 0.08,
    progressiveMinScale = 0.5,
    overflowMinScale = 0.3,
  } = params;

  const progressiveScale = getProgressiveScale(value, shrinkStartDigits, shrinkStepPerDigit, progressiveMinScale);
  const overflowScale = getOverflowScale(value, availableWidth, affixWidth, digitWidth, spacing, overflowMinScale);
  return Math.min(progressiveScale, overflowScale);
}

/** Shrink driven purely by how many digits have been typed. */
function getProgressiveScale(value: string, startDigits: number, step: number, minScale: number): number {
  const extraDigits = Math.max(0, countDigits(value) - startDigits);
  return Math.min(1, Math.max(minScale, 1 - extraDigits * step));
}

/** Shrink that only engages once the row would overflow the container. */
function getOverflowScale(value: string, availableWidth: number, affixWidth: number, digitWidth: number, spacing: number, minScale: number): number {
  const contentWidth = affixWidth + getAnimatedCountWidth(value, digitWidth, spacing);
  if (availableWidth <= 0 || contentWidth <= availableWidth) {
    return 1;
  }
  return Math.max(availableWidth / contentWidth, minScale);
}

/** Counts numeric glyphs only (separators/decimal are ignored so grouping commas don't skew the threshold). */
function countDigits(value: string): number {
  let count = 0;
  for (const char of value) {
    if (char >= '0' && char <= '9') {
      count += 1;
    }
  }
  return count;
}
