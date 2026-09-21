/**
 * useChartData Hook
 *
 * Memoizes expensive chart calculations including geometry.
 * Uses context for stable values, receives reactive data as parameter.
 */

import { ChartDataApiEquity } from '@etoro/common/types';
import { useMemo } from 'react';

import { useLineChartContext } from '../api';
import { ChartGeometry, computeChartGeometry, getLatestEquity } from '../utils';

// ============================================================================
// Types
// ============================================================================

export interface ChartDataParams {
  /** Chart data array */
  data: ChartDataApiEquity[];
  /** Whether to show baseline (not used in hook, kept for API compatibility) */
  showBaseline: boolean;
}

export interface ChartData {
  /** Chart geometry (scales, paths, etc.) */
  geometry: ChartGeometry;
  /** Latest equity value from data */
  latestEquity: number;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Computes and memoizes chart data including geometry and latest equity.
 * Reads dimensions from context.
 */
export function useChartData({ data }: ChartDataParams): ChartData {
  const { config } = useLineChartContext();
  const { width, height, marginVertical } = config;

  // Memoize chart geometry (expensive for large datasets)
  const geometry = useMemo(() => computeChartGeometry(data, width, height, marginVertical), [data, width, height, marginVertical]);

  // Memoize latest equity value
  const latestEquity = useMemo(() => getLatestEquity(data), [data]);

  return {
    geometry,
    latestEquity,
  };
}
