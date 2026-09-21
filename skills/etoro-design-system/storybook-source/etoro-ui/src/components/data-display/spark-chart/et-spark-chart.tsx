import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { area as d3area, curveMonotoneX, line as d3line } from 'd3-shape';
import { memo, useId, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, G, Line, LinearGradient, Mask, Path, Rect, Stop } from 'react-native-svg';

import { useEtoroTheme } from '../../../core/hooks';
import type { EtSparkChartProps } from './api';

const DOMAIN_PADDING_RATIO = 0.01;

/**
 * Memoized: rendered once per list row and otherwise re-rendered by live-rate ticks on the
 * parent. The d3 geometry is pure in `(data, width, height, margin, referenceValue)` and the
 * component is wrapped in `memo`, so a stable `data` reference + unchanged `balance`/`referenceValue`
 * skips both the d3 recompute and the SVG reconciliation entirely.
 */
function EtSparkChartImpl({
  data,
  referenceValue,
  fadeRightEdge = true,
  width = 80,
  height = 24,
  margin = 1,
  balance = 'positive',
  showBaseline = true,
}: EtSparkChartProps) {
  const { colors } = useEtoroTheme();
  const lineColor = balance === 'positive' ? colors.verdictPositive600 : colors.verdictNegative600;

  // Unique gradient/mask ids per instance so cloned charts (e.g. inside the Discover ticker
  // marquee, which mounts ~5 copies of every sparkline card) do not alias each other's defs.
  // `react-native-svg` looks defs up by id, and the first one wins — without this, negative-trend
  // charts would paint with a positive-trend chart's gradient.
  //
  // `useId` output is not id-safe and its format is version-dependent: React 18 emitted `:r0:`,
  // React 19 emits `«r0»`. Neither `:` nor the guillemets are valid XML name characters, so we
  // reduce to `[A-Za-z0-9_-]` rather than stripping one known delimiter — that keeps the id valid
  // regardless of which format the installed React produces.
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const areaGradientId = `spark-area-${reactId}`;
  const fadeGradientId = `spark-fade-grad-${reactId}`;
  const fadeMaskId = `spark-fade-mask-${reactId}`;

  // Geometry depends only on the data + dimensions + reference value (not theme/colors), so
  // memoizing it keeps live-rate-driven row re-renders from re-running d3 and rebuilding the
  // SVG path strings.
  const geometry = useMemo(() => {
    if (!data || data.length === 0) return null;

    const chartData = data.map((d, i) => ({ index: i, value: d.equity }));
    // Baseline on: include `referenceValue` in the domain so the dashed line sits inside the plot.
    // Baseline off: first sample is the only domain reference; do not expand for `referenceValue`.
    const domainReference = showBaseline ? (referenceValue ?? chartData[0].value) : chartData[0].value;
    const refValue = domainReference;

    const yValues = chartData.map((d) => d.value);
    const rawYMax = max(yValues) ?? 0;
    const rawYMin = min(yValues) ?? 0;

    let domainMin = Math.min(rawYMin, domainReference);
    let domainMax = Math.max(rawYMax, domainReference);

    if (domainMin === domainMax) {
      // Math.abs(0) * ratio = 0 (falsy); || 1 ensures a non-empty domain when
      // domainMin === domainMax === 0 (e.g. all-zero equity series or free assets).
      const pad = Math.abs(domainMin) * DOMAIN_PADDING_RATIO || 1;
      domainMin -= pad;
      domainMax += pad;
    }

    const xScale = scaleLinear()
      .domain([0, Math.max(data.length - 1, 1)])
      .range([margin, width - margin]);
    const yScale = scaleLinear()
      .domain([domainMin, domainMax])
      .range([height - margin, margin]);

    const refY = yScale(refValue);

    // Single data point: there's no line/area to draw, just the reference baseline.
    if (data.length === 1) {
      return {
        isSinglePoint: true as const,
        refY,
        linePath: '',
        areaPath: '',
      };
    }

    const line = d3line<(typeof chartData)[number]>()
      .x((d) => xScale(d.index))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);
    const area = d3area<(typeof chartData)[number]>()
      .x((d) => xScale(d.index))
      .y0(yScale(domainMin))
      .y1((d) => yScale(d.value))
      .curve(curveMonotoneX);

    return {
      isSinglePoint: false as const,
      refY,
      linePath: line(chartData) ?? '',
      areaPath: area(chartData) ?? '',
    };
  }, [data, width, height, margin, referenceValue, showBaseline]);

  if (!geometry) {
    return <View style={[styles.container, { width, height }]} />;
  }

  const { isSinglePoint, refY, linePath, areaPath } = geometry;
  const fadeEdgeOffset = Math.min(0.35, 12 / width);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopOpacity="0.45" stopColor={lineColor} />
            <Stop offset="0.2" stopOpacity="0.15" stopColor={lineColor} />
            <Stop offset="0.5" stopOpacity="0.1" stopColor={lineColor} />
            <Stop offset="0.95" stopOpacity="0" stopColor={lineColor} />
          </LinearGradient>
          <LinearGradient id={fadeGradientId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="black" stopOpacity="0" />
            <Stop offset={fadeEdgeOffset} stopColor="white" stopOpacity="1" />
            <Stop offset={fadeRightEdge ? 1 - fadeEdgeOffset : 1} stopColor="white" stopOpacity="1" />
            <Stop offset="1" stopColor={fadeRightEdge ? 'black' : 'white'} stopOpacity={fadeRightEdge ? 0 : 1} />
          </LinearGradient>
          <Mask id={fadeMaskId} x="0" y="0" width={width} height={height}>
            <Rect width={width} height={height} fill={`url(#${fadeGradientId})`} />
          </Mask>
        </Defs>

        <G mask={`url(#${fadeMaskId})`}>
          {/* Area gradient (skipped for a single point — no series to fill). */}
          {!isSinglePoint && <Path d={areaPath} fill={`url(#${areaGradientId})`} />}

          {/* Dotted baseline drawn at the reference value. One dashed line (round caps ≈ dots)
              instead of ~20 individual <Circle> nodes — far cheaper to mount per row.
              Opt out with `showBaseline={false}` on dense card surfaces. */}
          {showBaseline && (
            <Line
              x1={margin}
              y1={refY}
              x2={width - margin}
              y2={refY}
              stroke={colors.actionDisabledText}
              strokeWidth={1}
              strokeLinecap="round"
              strokeDasharray="0.5 3.5"
            />
          )}

          {/* Main chart line (skipped for a single point). */}
          {!isSinglePoint && <Path d={linePath} stroke={lineColor} strokeWidth={0.7} strokeLinecap="round" fill="none" />}
        </G>
      </Svg>
    </View>
  );
}

export const EtSparkChart = memo(EtSparkChartImpl);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});
