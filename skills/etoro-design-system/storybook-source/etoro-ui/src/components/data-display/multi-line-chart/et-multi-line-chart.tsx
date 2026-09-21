/**
 * EtMultiLineChart Component
 *
 * The UI kit's compare chart: renders multiple line series on one unified
 * y-domain so the lines are visually comparable. Per the DS multi-line design
 * every series is stroke-only (no area gradient) and horizontal gridlines mark
 * each y-axis tick. All series draw in together; the first one is the primary
 * one — it drives the scrub cursor.
 *
 * Composes the EtLineChart building blocks (provider, cursor, gesture and
 * animation hooks, y-axis labels, geometry utils) rather than duplicating them.
 */

import { useTheme } from '@react-navigation/native';
import { AnimatedProp, Canvas, Group, Path, PathDef, Rect } from '@shopify/react-native-skia';
import { scaleLinear } from 'd3-scale';
import { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { useEtoroTheme } from '../../../core/hooks';
import { X5 } from '../../../core/styles';
import { LineChartProvider, useLineChartContext } from '../line-chart/api';
import { Cursor } from '../line-chart/components/cursor';
import { YAxisLabels } from '../line-chart/components/y-axis-labels';
import { CURSOR_DOT_OVERFLOW, CURSOR_NEEDLE_EXTENSION, LINE_STROKE_WIDTH } from '../line-chart/constants';
import { useAnimateGraph, useChartGesture } from '../line-chart/hooks';
import { MultiLineChartProps } from './api';
import { Gridlines } from './components/gridlines';
import { SeriesCursorDot } from './components/series-cursor-dot';
import { useMultiLineChartData } from './hooks';

// ============================================================================
// Chart Canvas (Consumes Context)
// ============================================================================

interface MultiLineChartCanvasProps {
  series: MultiLineChartProps['series'];
  selectedValue: MultiLineChartProps['selectedValue'];
  showGridlines: boolean;
  gridlineColor?: MultiLineChartProps['gridlineColor'];
  yAxisLabels?: MultiLineChartProps['yAxisLabels'];
  yAxisLabelsHidden?: MultiLineChartProps['yAxisLabelsHidden'];
  yAxisTickCount?: MultiLineChartProps['yAxisTickCount'];
  yAxisTickFormat?: MultiLineChartProps['yAxisTickFormat'];
  yAxisEnd?: MultiLineChartProps['yAxisEnd'];
  yAxisDistribution?: MultiLineChartProps['yAxisDistribution'];
  cursorColor?: MultiLineChartProps['cursorColor'];
  needleColor?: MultiLineChartProps['needleColor'];
  surfaceColor?: MultiLineChartProps['surfaceColor'];
  redrawKey?: MultiLineChartProps['redrawKey'];
  animateOnRedraw?: MultiLineChartProps['animateOnRedraw'];
}

/**
 * Internal canvas component that consumes the LineChart context.
 */
const MultiLineChartCanvas = memo(function MultiLineChartCanvas({
  series,
  selectedValue,
  showGridlines,
  gridlineColor,
  yAxisLabels,
  yAxisLabelsHidden,
  yAxisTickCount,
  yAxisTickFormat,
  yAxisEnd,
  yAxisDistribution,
  cursorColor,
  needleColor,
  surfaceColor,
  redrawKey,
  animateOnRedraw,
}: MultiLineChartCanvasProps) {
  const { dark: isDarkMode } = useTheme();
  const { colors } = useEtoroTheme();
  const { sharedValues, config, showCursor } = useLineChartContext();

  const { width, height, isInteractive } = config;
  const { cx, cy, overlayWidth, overlayOpacity, cursorOpacity, animationLine } = sharedValues;

  // ---------------------------------------------------------------------------
  // Chart Data & Calculations
  // ---------------------------------------------------------------------------

  const primaryData = useMemo(() => series[0]?.data ?? [], [series]);
  const { geometries, primaryGeometry, latestEquity } = useMultiLineChartData({ series });

  const animationKey = useMemo(() => {
    const firstPoint = primaryData[0];
    const lastPoint = primaryData[primaryData.length - 1];

    return `${primaryData.length}:${firstPoint?.timestamp ?? ''}:${lastPoint?.timestamp ?? ''}`;
  }, [primaryData]);

  // ---------------------------------------------------------------------------
  // Gesture Handling & Animations (primary-series driven)
  // ---------------------------------------------------------------------------

  const gesture = useChartGesture({
    geometry: primaryGeometry,
    data: primaryData,
    latestEquity,
    selectedValue,
    markerPositions: [],
  });

  useAnimateGraph({ data: primaryData, animationKey, selectedValue, redrawKey, animateOnRedraw });

  // ---------------------------------------------------------------------------
  // Y-Axis Labels (manual override > auto-computed via d3-scale > none)
  // ---------------------------------------------------------------------------

  const resolvedYAxisLabels = useMemo<string[] | undefined>(() => {
    if (yAxisLabels) return yAxisLabels;
    if (!yAxisTickCount || primaryData.length === 0) return undefined;

    const [min, max] = primaryGeometry.yScale.domain();
    if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;

    // Round the unified domain outward to nice boundaries, then subdivide into
    // exactly `yAxisTickCount` evenly-spaced ticks (see EtLineChart).
    const [niceMin, niceMax] = scaleLinear().domain([min, max]).nice(yAxisTickCount).domain();
    const step = (niceMax - niceMin) / (yAxisTickCount - 1);
    const format = yAxisTickFormat ?? String;
    return Array.from({ length: yAxisTickCount }, (_, i) => format(niceMax - i * step));
  }, [yAxisLabels, yAxisTickCount, yAxisTickFormat, primaryData.length, primaryGeometry.yScale]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Extend the Skia canvas vertically so the cursor dot's halo isn't clipped
  // when a line is at the top/bottom edge (see EtLineChart).
  const canvasOverflow = isInteractive ? CURSOR_DOT_OVERFLOW + CURSOR_NEEDLE_EXTENSION : 0;
  const canvasHeight = height + 2 * canvasOverflow;

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <Canvas style={[styles.container, { width, height: canvasHeight, marginVertical: -canvasOverflow }]}>
          <Group transform={[{ translateY: canvasOverflow }]}>
            {/* Horizontal gridlines (painted first so every line sits above them) */}
            {showGridlines && resolvedYAxisLabels && resolvedYAxisLabels.length > 0 && (
              <Gridlines
                count={resolvedYAxisLabels.length}
                chartWidth={width}
                chartHeight={height}
                color={gridlineColor ?? colors.carbonSecondaryDivider}
                distribution={yAxisDistribution}
              />
            )}

            {/* Secondary series — beneath the primary line, drawing in with it.
                All series share the primary's x timestamps, so the one
                `animationLine` progress keeps them in lockstep. */}
            {geometries.slice(1).map((geometry, index) => (
              <Path
                key={`series-line-${index + 1}`}
                style="stroke"
                path={geometry.linePath as AnimatedProp<PathDef>}
                strokeWidth={LINE_STROKE_WIDTH}
                color={series[index + 1]?.color}
                start={0}
                end={animationLine}
                strokeCap="round"
              />
            ))}

            {/* Primary series — animated draw-in, on top */}
            {series.length > 0 && (
              <Path
                style="stroke"
                path={primaryGeometry.linePath as AnimatedProp<PathDef>}
                strokeWidth={LINE_STROKE_WIDTH}
                color={series[0].color}
                start={0}
                end={animationLine}
                strokeCap="round"
              />
            )}

            {/* Cursor Overlay */}
            {isInteractive && (
              <Rect x={cx} y={0} width={overlayWidth} height={height} color={surfaceColor ?? colors.backgroundBase} opacity={overlayOpacity} />
            )}

            {/* Cursor — one needle + a dot on every series at the cursor x. The
                needle and primary dot come from the shared Cursor (primary cy is
                gesture-driven); secondary dots ride their own series paths. */}
            {isInteractive &&
              geometries.map((geometry, index) =>
                index > 0 && series[index] && series[index].data.length > 0 ? (
                  <SeriesCursorDot
                    key={`series-cursor-dot-${index}`}
                    cx={cx}
                    parsedPath={geometry.parsedPath}
                    color={series[index].color}
                    opacity={cursorOpacity}
                  />
                ) : null,
              )}
            {isInteractive && (
              <Cursor
                cx={cx}
                cy={cy}
                chartHeight={height}
                colors={colors}
                isDarkMode={isDarkMode}
                showCursor={showCursor}
                opacity={cursorOpacity}
                needleExtension={CURSOR_NEEDLE_EXTENSION}
                color={cursorColor ?? series[0]?.color}
                needleColor={needleColor ?? colors.carbon500}
              />
            )}
          </Group>
        </Canvas>
      </GestureDetector>

      {/* Y-Axis Labels */}
      {resolvedYAxisLabels && (
        <YAxisLabels
          labels={resolvedYAxisLabels}
          chartHeight={height}
          colors={colors}
          hidden={yAxisLabelsHidden}
          end={yAxisEnd}
          distribution={yAxisDistribution}
        />
      )}
    </View>
  );
});

MultiLineChartCanvas.displayName = 'EtMultiLineChart.Canvas';

// ============================================================================
// Root Component
// ============================================================================

/**
 * EtMultiLineChart - Compare chart with multiple stroke-only line series on a
 * unified y-domain, per-tick gridlines and a primary-series scrub cursor.
 *
 * @example
 * ```tsx
 * const selectedValue = useSharedValue(0);
 *
 * <EtMultiLineChart
 *   series={[
 *     { data: primarySeries, color: colors.verdictPositive600 },
 *     { data: benchmarkSeries, color: colors.accentB700 },
 *     { data: peerSeries, color: colors.accentD700 },
 *   ]}
 *   selectedValue={selectedValue}
 *   yAxisTickCount={4}
 *   yAxisTickFormat={(value) => `${Math.round(value)}%`}
 * />
 * ```
 */
function MultiLineChartComponent({
  series,
  width = Dimensions.get('window').width,
  height = 150,
  marginVertical = 10,
  isInteractive = true,
  selectedValue,
  showGridlines = true,
  gridlineColor,
  yAxisLabels,
  yAxisLabelsHidden,
  yAxisTickCount,
  yAxisTickFormat,
  yAxisEnd,
  yAxisDistribution,
  cursorColor,
  needleColor,
  surfaceColor,
  redrawKey,
  animateOnRedraw,
  onFocusModeChange,
  onCursorDataChange,
}: MultiLineChartProps) {
  return (
    <LineChartProvider
      width={width}
      height={height}
      marginVertical={marginVertical}
      isInteractive={isInteractive}
      onFocusModeChange={onFocusModeChange}
      onCursorDataChange={onCursorDataChange}
    >
      <MultiLineChartCanvas
        series={series}
        selectedValue={selectedValue}
        showGridlines={showGridlines}
        gridlineColor={gridlineColor}
        yAxisLabels={yAxisLabels}
        yAxisLabelsHidden={yAxisLabelsHidden}
        yAxisTickCount={yAxisTickCount}
        yAxisTickFormat={yAxisTickFormat}
        yAxisEnd={yAxisEnd}
        yAxisDistribution={yAxisDistribution}
        cursorColor={cursorColor}
        needleColor={needleColor}
        surfaceColor={surfaceColor}
        redrawKey={redrawKey}
        animateOnRedraw={animateOnRedraw}
      />
    </LineChartProvider>
  );
}

// ============================================================================
// Export with Memo
// ============================================================================

/**
 * Memoized EtMultiLineChart component.
 */
export const EtMultiLineChart = memo(MultiLineChartComponent);
EtMultiLineChart.displayName = 'EtMultiLineChart';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginTop: X5,
  },
  container: {
    alignSelf: 'center',
    overflow: 'visible',
  },
});
