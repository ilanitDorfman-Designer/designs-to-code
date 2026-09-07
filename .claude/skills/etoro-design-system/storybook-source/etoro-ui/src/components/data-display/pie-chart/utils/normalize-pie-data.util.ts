import type { PieChartColor, PieChartData } from '../api/types';

/** Default label/key used for the folded overflow segment. */
export const OTHER_SEGMENT_KEY = 'Other';

/**
 * A pie segment after cleaning + Other-folding, enriched with its normalized
 * fraction of the whole (0–1). Fractions always sum to 1 for a non-empty result.
 */
export type NormalizedPieSegment = {
  key: string;
  value: number;
  color?: PieChartColor;
  /** Share of the total circumference (0–1) */
  fraction: number;
  /** True only for the synthetic overflow bucket created by folding */
  isOther: boolean;
};

/**
 * Cleans, folds and normalizes raw pie data.
 *
 * Rules (mirroring `EtBreakdownChart`'s Other-fold behavior):
 * - Drops entries whose `value` is not a finite number `> 0`.
 * - When more than `maxSegments` valid entries remain, keeps the first
 *   `maxSegments - 1` (by input order) and folds the rest into a single
 *   `"Other"` segment, yielding exactly `maxSegments` segments.
 * - Computes each segment's `fraction` from the post-fold value sum.
 *
 * Pure + side-effect free.
 *
 * @param data - Raw segments (may be undefined)
 * @param maxSegments - Max visible segments (default 7 — the DS maximum)
 * @returns Normalized segments; empty array when there is no positive data
 */
export function normalizePieData(data: PieChartData[] = [], maxSegments = 7): NormalizedPieSegment[] {
  const valid = data.filter((item) => Number.isFinite(item.value) && item.value > 0);

  if (valid.length === 0) {
    return [];
  }

  // Guard non-finite `maxSegments` (NaN / Infinity) which would otherwise make
  // `limit` non-finite and silently disable folding; fall back to the DS default.
  const safeMaxSegments = Number.isFinite(maxSegments) ? maxSegments : 7;
  const limit = Math.max(1, Math.trunc(safeMaxSegments));

  // Weight scale keeps aggregates finite even for extreme finite inputs (e.g.
  // several `Number.MAX_VALUE`, whose raw sum overflows to `Infinity` and would
  // zero out every fraction). When the raw total is finite the scale is 1, so
  // fractions are computed with the exact same arithmetic as before.
  const rawTotal = valid.reduce((sum, item) => sum + item.value, 0);
  const scale = Number.isFinite(rawTotal) ? 1 : valid.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  type FoldedSegment = Pick<PieChartData, 'key' | 'value' | 'color'> & { weight: number; isOther: boolean };

  let folded: FoldedSegment[];
  if (valid.length > limit) {
    const mainItems: FoldedSegment[] = valid.slice(0, limit - 1).map((item) => ({ ...item, weight: item.value / scale, isOther: false }));
    const otherItems = valid.slice(limit - 1);
    const otherValue = otherItems.reduce((sum, item) => sum + item.value, 0);
    const otherWeight = otherItems.reduce((sum, item) => sum + item.value / scale, 0);
    folded = [...mainItems, { key: OTHER_SEGMENT_KEY, value: otherValue, weight: otherWeight, isOther: true }];
  } else {
    folded = valid.map((item) => ({ ...item, weight: item.value / scale, isOther: false }));
  }

  const totalWeight = folded.reduce((sum, item) => sum + item.weight, 0);

  return folded.map((item) => ({
    key: item.key,
    value: item.value,
    color: item.color,
    fraction: totalWeight > 0 ? item.weight / totalWeight : 0,
    isOther: item.isOther,
  }));
}
