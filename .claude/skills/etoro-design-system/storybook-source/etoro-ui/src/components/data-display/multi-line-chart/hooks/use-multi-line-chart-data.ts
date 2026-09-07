/**
 * useMultiLineChartData Hook
 *
 * Computes one geometry per series on a unified y-domain so all lines share
 * the same yScale. Reads chart dimensions from the LineChart context.
 */

import { useMemo } from 'react';

import { useLineChartContext } from '../../line-chart/api';
import { ChartGeometry, computeChartGeometry, computeUnifiedYDomain, getLatestEquity } from '../../line-chart/utils';
import { MultiLineChartSeries } from '../api';

export interface MultiLineChartDataParams {
  /** Line series — the first entry is the primary series */
  series: MultiLineChartSeries[];
}

export interface MultiLineChartData {
  /** Geometry per series, index-aligned with `series` */
  geometries: ChartGeometry[];
  /** Geometry of the primary (first) series — safe sentinel when `series` is empty */
  primaryGeometry: ChartGeometry;
  /** Latest equity value of the primary series */
  latestEquity: number;
}

/**
 * Computes and memoizes per-series geometries on a unified y-domain.
 */
export function useMultiLineChartData({ series }: MultiLineChartDataParams): MultiLineChartData {
  const { config } = useLineChartContext();
  const { width, height, marginVertical } = config;

  // One min/max across every series so all lines share the same yScale
  const yDomain = useMemo<[number, number] | undefined>(
    () => computeUnifiedYDomain(series.map((entry) => entry.data)) ?? undefined,
    [series],
  );

  const geometries = useMemo(
    () => series.map((entry) => computeChartGeometry(entry.data, width, height, marginVertical, yDomain)),
    [series, width, height, marginVertical, yDomain],
  );

  const primaryGeometry = useMemo(
    () => geometries[0] ?? computeChartGeometry([], width, height, marginVertical),
    [geometries, width, height, marginVertical],
  );

  const latestEquity = useMemo(() => getLatestEquity(series[0]?.data ?? []), [series]);

  return {
    geometries,
    primaryGeometry,
    latestEquity,
  };
}
