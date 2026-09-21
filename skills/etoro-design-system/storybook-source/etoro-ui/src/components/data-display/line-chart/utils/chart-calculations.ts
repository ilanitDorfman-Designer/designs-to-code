/**
 * Chart Calculation Utilities
 *
 * Pure functions for computing chart geometry, scales, and paths.
 */

import { ChartDataApiEquity } from '@etoro/common/types';
import { Skia } from '@shopify/react-native-skia';
import { scaleLinear, scalePoint } from 'd3-scale';
import { curveMonotoneX, line } from 'd3-shape';
import { getYForX, parse } from 'react-native-redash';

import { ChartMarker } from '../api/types';
import { LINE_STROKE_WIDTH } from '../constants';

// ============================================================================
// Types
// ============================================================================

export interface ChartGeometry {
  /** X-axis scale function */
  xScale: ReturnType<typeof scalePoint<string>>;
  /** Y-axis scale function */
  yScale: ReturnType<typeof scaleLinear<number>>;
  /** Step size between data points on x-axis */
  stepX: number;
  /** SVG path string for the curved line */
  curvedLine: string;
  /** Skia path object for rendering */
  linePath: ReturnType<typeof Skia.Path.MakeFromSVGString>;
  /** Parsed path for cursor position calculations */
  parsedPath: ReturnType<typeof parse>;
}

// ============================================================================
// Chart Geometry Calculations
// ============================================================================

/**
 * Creates a safe empty/sentinel geometry for edge cases.
 */
function createEmptyGeometry(width: number, height: number, marginVertical: number): ChartGeometry {
  const xScale = scalePoint<string>().domain([]).range([0, width]).padding(0);
  const yScale = scaleLinear()
    .domain([0, 1])
    .range([height - marginVertical - LINE_STROKE_WIDTH / 2, marginVertical + LINE_STROKE_WIDTH / 2]);
  const emptyPath = Skia.Path.Make();

  return {
    xScale,
    yScale,
    stepX: 0,
    curvedLine: '',
    linePath: emptyPath,
    parsedPath: parse('M0,0'),
  };
}

/**
 * Computes the unified y-domain across multiple series so all lines share one
 * yScale and stay visually comparable (see EtMultiLineChart).
 * Pads a flat domain (min === max) by ±1, mirroring the single-series logic
 * in `computeChartGeometry`. Returns null when every series is empty.
 */
export function computeUnifiedYDomain(seriesList: ChartDataApiEquity[][]): [number, number] | null {
  let min = Infinity;
  let max = -Infinity;

  for (const series of seriesList) {
    for (const point of series) {
      if (point.equity < min) min = point.equity;
      if (point.equity > max) max = point.equity;
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  if (min === max) {
    return [min - 1, max + 1];
  }

  return [min, max];
}

/**
 * Computes all chart geometry including scales, paths, and step values.
 * Memoize this at the component level for performance.
 * Returns safe sentinel geometry for empty or malformed data.
 *
 * `yDomain` overrides the y-scale domain computed from `data` — used to share
 * one domain across multiple series (see `computeUnifiedYDomain`).
 */
export function computeChartGeometry(
  data: ChartDataApiEquity[],
  width: number,
  height: number,
  marginVertical: number,
  yDomain?: [number, number],
): ChartGeometry {
  // Handle empty data
  if (data.length === 0) {
    return createEmptyGeometry(width, height, marginVertical);
  }

  // d3 `scalePoint().domain(...)` deduplicates its domain, so adjacent
  // points sharing a timestamp collapse onto one slot. The BFF emits
  // exactly that at the start of every performance series
  // (`[{ ts: T, equity: 0 }, { ts: T, equity: <first move> }, …]`), which
  // would leave the chart with `n - 1` slots and make every cursor lookup
  // off-by-one (EI-1643). Disambiguate the colliding keys with an index
  // suffix; consumers never see these because we only use them for the
  // scale lookup, not as timestamps.
  const xKeys = data.map((d, i) => (i > 0 && data[i - 1].timestamp === d.timestamp ? `${d.timestamp}#${i}` : d.timestamp));
  const xRange = [0, width];
  const xScale = scalePoint<string>().domain(xKeys).range(xRange).padding(0);
  const stepX = xScale.step();

  // Y-axis setup with safe defaults for edge cases
  // Use reduce instead of Math.min/max with spread to avoid stack overflow on large datasets
  let { min, max } = data.reduce(
    (acc, d) => ({
      min: d.equity < acc.min ? d.equity : acc.min,
      max: d.equity > acc.max ? d.equity : acc.max,
    }),
    { min: data[0].equity, max: data[0].equity },
  );

  // Handle single value or flat data (min === max)
  if (min === max) {
    min = min - 1;
    max = max + 1;
  }

  // Shared-domain override (already padded by computeUnifiedYDomain)
  if (yDomain) {
    [min, max] = yDomain;
  }

  const yScale = scaleLinear()
    .domain([min, max])
    .range([height - marginVertical - LINE_STROKE_WIDTH / 2, marginVertical + LINE_STROKE_WIDTH / 2]);

  // Address the scale by `xKeys[i]` rather than the row's own timestamp so
  // the duplicate-baseline disambiguation above is honoured.
  const curvedLineResult = line<ChartDataApiEquity>()
    .x((_d, i) => xScale(xKeys[i]) ?? 0)
    .y((d) => yScale(d.equity))
    .curve(curveMonotoneX)(data);

  // Handle path generation failure
  if (!curvedLineResult) {
    return createEmptyGeometry(width, height, marginVertical);
  }

  const curvedLine = curvedLineResult;

  // Create Skia path for rendering
  const linePath = Skia.Path.MakeFromSVGString(curvedLine);
  if (!linePath) {
    return createEmptyGeometry(width, height, marginVertical);
  }

  // Parse path for cursor tracking
  const parsedPath = parse(linePath.toSVGString());

  return {
    xScale,
    yScale,
    stepX,
    curvedLine,
    linePath,
    parsedPath,
  };
}

/**
 * Gets the latest equity value from chart data.
 * Returns the last data point's equity (not sum) for consistent display.
 */
export function getLatestEquity(data: ChartDataApiEquity[]): number {
  if (data.length === 0) {
    return 0;
  }
  return data[data.length - 1].equity;
}

// ============================================================================
// Y-Axis Tick Positions
// ============================================================================

/**
 * Computes the vertical pixel position of each y-axis tick within the chart
 * height. Single source of truth for both the y-axis label chips and the
 * horizontal gridlines so they always stay aligned.
 */
export function computeYAxisTickPositions(
  count: number,
  chartHeight: number,
  distribution: 'space-around' | 'space-between' = 'space-around',
): number[] {
  if (count <= 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    if (distribution === 'space-between') {
      return count <= 1 ? 0 : (index / (count - 1)) * chartHeight;
    }
    return ((2 * index + 1) / (2 * count)) * chartHeight;
  });
}

// ============================================================================
// Marker Position Calculations
// ============================================================================

export interface MarkerPosition {
  x: number;
  y: number;
}

/**
 * Computes pixel positions for markers by finding the nearest chart data point
 * and reading the y position from the path.
 *
 * Since deposit timestamps have precise times but equity data is daily snapshots,
 * we find the closest data point by date.
 */
export function computeMarkerPositions(markers: ChartMarker[], geometry: ChartGeometry, chartData: ChartDataApiEquity[]): MarkerPosition[] {
  if (markers.length === 0 || !geometry.curvedLine || chartData.length === 0) {
    return [];
  }

  // Precompute chart data timestamps once to avoid repeated conversions
  const chartTimestamps = chartData.map((data) => new Date(data.timestamp).getTime());

  const positions: MarkerPosition[] = [];
  const seenX = new Set<number>();

  for (const marker of markers) {
    const markerTime = new Date(marker.timestamp).getTime();

    // Skip invalid timestamps
    if (!Number.isFinite(markerTime)) {
      continue;
    }

    // Find the nearest chart data point by timestamp
    let nearestData = chartData[0];
    let minDiff = Math.abs(chartTimestamps[0] - markerTime);

    for (let i = 1; i < chartData.length; i++) {
      const diff = Math.abs(chartTimestamps[i] - markerTime);
      if (diff < minDiff) {
        minDiff = diff;
        nearestData = chartData[i];
      }
    }

    // Get x position using the nearest data point's timestamp
    const x = geometry.xScale(nearestData.timestamp);
    if (x == null) {
      continue;
    }

    // Skip if we already have a marker at this x position (deduplication)
    if (seenX.has(x)) {
      continue;
    }

    const y = getYForX(geometry.parsedPath, x);
    if (y == null) {
      continue;
    }

    seenX.add(x);
    positions.push({ x, y });
  }

  return positions;
}

/**
 * Finds the nearest marker position within a hit buffer distance.
 * Returns the marker's x position if found, otherwise null.
 * Marked as worklet for UI thread compatibility.
 */
export function findNearestMarkerX(xPos: number, markerPositions: MarkerPosition[], hitBuffer: number): number | null {
  'worklet';
  if (markerPositions.length === 0) {
    return null;
  }

  let nearestMarker: MarkerPosition | null = null;
  let minDistance = hitBuffer;

  for (const marker of markerPositions) {
    const distance = Math.abs(marker.x - xPos);

    if (distance <= minDistance) {
      minDistance = distance;
      nearestMarker = marker;
    }
  }

  return nearestMarker ? nearestMarker.x : null;
}

/**
 * Finds the data point index at a given x position.
 * Marked as worklet to be callable from UI thread gesture handlers.
 * Handles edge cases: empty data, zero stepX, single data point.
 */
export function findDataIndexAtPosition(xPos: number, stepX: number, dataLength: number): number {
  'worklet';
  // Handle edge cases: no data or single point
  if (dataLength <= 1 || stepX === 0) {
    return Math.max(0, dataLength - 1);
  }

  const iFloat = xPos / stepX;
  const nearestIndex = Math.round(iFloat);

  // Single clamp operation
  return Math.max(0, Math.min(nearestIndex, dataLength - 1));
}
