import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import type { EtPieChartProps } from '../api/types';
import { getSegmentDashGeometry, normalizePieData, resolveSegmentColor } from '../utils';

/** A fully-resolved segment descriptor, ready for SVG rendering. */
export type PieChartSegment = {
  /** Segment key (from data, or "Other") */
  key: string;
  /** Resolved solid stroke color */
  color: string;
  /** Share of the whole (0–1) */
  fraction: number;
  /** Cumulative fraction of preceding segments (0–1) — sweep start */
  startFraction: number;
  /** `[dash, gap]` for the static (fully-drawn) arc */
  dashArray: [number, number];
  /** `strokeDashoffset` positioning the arc start */
  dashOffset: number;
};

type UsePieChartSegmentsParams = Pick<EtPieChartProps, 'data' | 'maxSegments'> & {
  /** Full circumference of the donut centerline circle */
  circumference: number;
};

/**
 * Returns the DS accent palette (A→G) resolved for the active theme. These are
 * the default segment colors matching the Figma "Breakdown chart" spec.
 */
function useDefaultPalette(): string[] {
  const { colors } = useEtoroTheme();
  return useMemo(
    () => [colors.accentA700, colors.accentB700, colors.accentC700, colors.accentD700, colors.accentE700, colors.accentF700, colors.accentG700],
    [colors.accentA700, colors.accentB700, colors.accentC700, colors.accentD700, colors.accentE700, colors.accentF700, colors.accentG700],
  );
}

/**
 * Normalizes data, folds overflow into "Other", resolves colors from the DS
 * accent palette (or the consumer's overrides) and precomputes dash geometry.
 *
 * @param params - Raw `data`, `maxSegments`, and the donut `circumference`
 * @returns Render-ready segment descriptors (empty when there is no positive data)
 */
export function usePieChartSegments({ data, maxSegments = 7, circumference }: UsePieChartSegmentsParams): PieChartSegment[] {
  const palette = useDefaultPalette();
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const normalized = normalizePieData(data, maxSegments);

    return normalized.map((segment, index) => {
      // Prefix-sum of preceding fractions (n ≤ maxSegments, so O(n²) is negligible)
      // and avoids a render-time mutable accumulator (react-compiler).
      const startFraction = normalized.slice(0, index).reduce((sum, prev) => sum + prev.fraction, 0);

      const fallback = segment.isOther ? colors.otherPrimary : palette[index % palette.length];
      const { dashArray, dashOffset } = getSegmentDashGeometry(segment.fraction, startFraction, circumference);

      return {
        key: segment.key,
        color: resolveSegmentColor(segment.color, fallback),
        fraction: segment.fraction,
        startFraction,
        dashArray,
        dashOffset,
      };
    });
  }, [data, maxSegments, circumference, palette, colors.otherPrimary]);
}
