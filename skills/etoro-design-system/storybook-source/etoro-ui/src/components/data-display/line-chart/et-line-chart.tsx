/**
 * EtLineChart Component
 *
 * An interactive line chart with cursor tracking, haptic feedback,
 * and smooth animations. Supports long-press activation for focus mode.
 */

import { useTheme } from '@react-navigation/native';
import { AnimatedProp, DashPathEffect, Group, Line, LinearGradient, Mask, Path, PathDef, Rect } from '@shopify/react-native-skia';
import { scaleLinear } from 'd3-scale';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { EtCanvas, retrySkiaRuntime, useEtoroTheme, useSkiaRuntime } from '../../../core/hooks';
import { X5 } from '../../../core/styles';
import { EtText } from '../../../foundations/text';
import { ChartMarker, LineChartProps, LineChartProvider, useLineChartContext } from './api';
import { ChartMarkers } from './components/chart-markers';
import { Cursor } from './components/cursor';
import { GraphGradient } from './components/graph-gradient';
import { YAxisLabels } from './components/y-axis-labels';
import { CURSOR_DOT_OVERFLOW, CURSOR_NEEDLE_EXTENSION, LINE_STROKE_WIDTH } from './constants';
import { useAnimateGraph, useChartData, useChartGesture } from './hooks';
import { computeMarkerPositions, MarkerPosition } from './utils';

// ============================================================================
// Chart Canvas (Consumes Context)
// ============================================================================

interface ChartCanvasProps {
  /** Chart data */
  data: LineChartProps['data'];
  /** Selected value shared value */
  selectedValue: LineChartProps['selectedValue'];
  /** Balance type for coloring */
  balance: LineChartProps['balance'];
  /** Whether to show baseline dots */
  showBaseline: boolean;
  /** Y-axis labels (manual override) */
  yAxisLabels?: LineChartProps['yAxisLabels'];
  /** Whether to hide y-axis labels without unmounting them */
  yAxisLabelsHidden?: LineChartProps['yAxisLabelsHidden'];
  /** Number of auto-computed y-axis ticks */
  yAxisTickCount?: LineChartProps['yAxisTickCount'];
  /** Formatter for auto-computed tick values */
  yAxisTickFormat?: LineChartProps['yAxisTickFormat'];
  /** Left axis content */
  leftAxisContent?: LineChartProps['leftAxisContent'];
  /** Markers rendered as dots on the chart line */
  markers?: ChartMarker[];
  /** Whether to show markers (false = transparent but still interactive) */
  showMarkers?: boolean;
  /** Optional color override for marker dots */
  markerColor?: string;
  /** Override the positive line color */
  lineColor?: string;
  /** Override the cursor stroke + dot color */
  cursorColor?: string;
  /** Surface colour the chart sits on — used to dim the scrub overlay (defaults to backgroundBase) */
  surfaceColor?: LineChartProps['surfaceColor'];
  /** Override the positive fade-mask gradient colors */
  maskGradientColors?: [string, string];
  /** Skia Path opacity for the gradient fill */
  gradientOpacity?: number;
  /** Override Skia LinearGradient colors */
  gradientColors?: LineChartProps['gradientColors'];
  /** Multiplier for the vertical gradient fade distance */
  gradientFadeEndMultiplier?: LineChartProps['gradientFadeEndMultiplier'];
  /** Y-axis end position */
  yAxisEnd?: number;
  /** Y-axis distribution mode */
  yAxisDistribution?: 'space-around' | 'space-between';
  /** Re-draw trigger — bump to redraw the chart (see LineChartProps). */
  redrawKey?: LineChartProps['redrawKey'];
  /** Whether a redrawKey change animates the draw-in (default) or snaps (see LineChartProps). */
  animateOnRedraw?: LineChartProps['animateOnRedraw'];
}

/**
 * Internal canvas component that consumes the LineChart context.
 * Memoized to prevent unnecessary re-renders when parent updates.
 */
const ChartCanvas = memo(function ChartCanvas({
  data,
  selectedValue,
  balance = 'positive',
  showBaseline,
  yAxisLabels,
  yAxisLabelsHidden,
  yAxisTickCount,
  yAxisTickFormat,
  leftAxisContent,
  markers,
  showMarkers = true,
  markerColor,
  lineColor: lineColorProp,
  cursorColor,
  surfaceColor,
  maskGradientColors,
  gradientOpacity,
  gradientColors,
  gradientFadeEndMultiplier,
  yAxisEnd,
  yAxisDistribution,
  redrawKey,
  animateOnRedraw,
}: ChartCanvasProps) {
  const { dark: isDarkMode } = useTheme();
  const { colors } = useEtoroTheme();
  const { sharedValues, config, showCursor } = useLineChartContext();

  const { width, height, marginVertical, isInteractive } = config;
  const { cx, cy, overlayWidth, overlayOpacity, cursorOpacity, animationLine, animationGradient } = sharedValues;

  // ---------------------------------------------------------------------------
  // Chart Data & Calculations
  // ---------------------------------------------------------------------------

  const { geometry, latestEquity } = useChartData({
    data,
    showBaseline,
  });
  const animationKey = useMemo(() => {
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];

    return `${data.length}:${firstPoint?.timestamp ?? ''}:${lastPoint?.timestamp ?? ''}`;
  }, [data]);

  const markerPositions: MarkerPosition[] = markers?.length ? computeMarkerPositions(markers, geometry, data) : [];

  // ---------------------------------------------------------------------------
  // Gesture Handling
  // ---------------------------------------------------------------------------

  const gesture = useChartGesture({
    geometry,
    data,
    latestEquity,
    selectedValue,
    markerPositions,
  });

  // ---------------------------------------------------------------------------
  // Animations
  // ---------------------------------------------------------------------------

  useAnimateGraph({ data, animationKey, selectedValue, gradientFadeEndMultiplier, redrawKey, animateOnRedraw });

  // ---------------------------------------------------------------------------
  // Y-Axis Labels (manual override > auto-computed via d3-scale > none)
  // ---------------------------------------------------------------------------

  const resolvedYAxisLabels = useMemo<string[] | undefined>(() => {
    if (yAxisLabels) return yAxisLabels;
    if (!yAxisTickCount || data.length === 0) return undefined;

    const [min, max] = geometry.yScale.domain();
    if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;

    // Use d3-scale `.nice()` to round the domain outward to nice boundaries
    // (e.g. [-38, 6] → [-40, 10]), then subdivide into exactly
    // `yAxisTickCount` evenly-spaced ticks. d3's `.ticks()` is approximate
    // (it picks the step from {1, 2, 5, 10, 20, …}), so for a fixed label
    // count we need to subdivide ourselves.
    const [niceMin, niceMax] = scaleLinear().domain([min, max]).nice(yAxisTickCount).domain();
    const step = (niceMax - niceMin) / (yAxisTickCount - 1);
    const format = yAxisTickFormat ?? String;
    return Array.from({ length: yAxisTickCount }, (_, i) => format(niceMax - i * step));
  }, [yAxisLabels, yAxisTickCount, yAxisTickFormat, data.length, geometry.yScale]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const lineColor = lineColorProp ?? (balance === 'positive' ? colors.verdictPositive600 : colors.verdictNegative600);

  // Extend the Skia canvas vertically so the cursor dot's halo isn't clipped
  // when the line is at the top/bottom edge. The drawn content is translated
  // back down by the same amount so the chart line area stays at `height` and
  // the layout footprint (via negative marginVertical) is unchanged.
  const canvasOverflow = isInteractive ? CURSOR_DOT_OVERFLOW + CURSOR_NEEDLE_EXTENSION : 0;
  const canvasHeight = height + 2 * canvasOverflow;

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <EtCanvas style={[styles.container, { width, height: canvasHeight, marginVertical: -canvasOverflow }]}>
          <Group transform={[{ translateY: canvasOverflow }]}>
            {/* Chart Line with Mask for Fade Effect */}
            <Mask
              mode="alpha"
              mask={
                <Rect x={0} y={0} width={width} height={height}>
                  <LinearGradient
                    mode="clamp"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 50, y: 0 }}
                    colors={maskGradientColors ?? [colors.verdictPositive600Opacity50, colors.verdictPositive600]}
                  />
                </Rect>
              }
            >
              <GraphGradient
                chartHeight={height}
                chartWidth={width}
                chartMarginVertical={marginVertical}
                animationGradient={animationGradient}
                curvedLine={geometry.curvedLine}
                colors={colors}
                balance={balance}
                opacity={gradientOpacity}
                gradientColors={gradientColors}
              />
              <Path
                style="stroke"
                path={geometry.linePath as AnimatedProp<PathDef>}
                strokeWidth={LINE_STROKE_WIDTH}
                color={lineColor}
                start={0}
                end={animationLine}
                strokeCap="round"
              />
            </Mask>

            {/* Chart Markers */}
            {markerPositions.length > 0 && (
              <ChartMarkers
                positions={markerPositions}
                animationProgress={animationLine}
                color={markerColor ?? colors.carbon400}
                transparent={!showMarkers}
              />
            )}

            {/* Baseline dotted line */}
            {showBaseline && (
              <Line
                p1={{ x: 0, y: height / 2 }}
                p2={{ x: width, y: height / 2 }}
                color={colors.actionDisabledText}
                style="stroke"
                strokeWidth={1}
                strokeCap="round"
              >
                <DashPathEffect intervals={[0.5, 3.5]} />
              </Line>
            )}

            {/* Cursor Overlay */}
            {isInteractive && (
              <Rect x={cx} y={0} width={overlayWidth} height={height} color={surfaceColor ?? colors.backgroundBase} opacity={overlayOpacity} />
            )}

            {/* Cursor */}
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
                color={cursorColor}
              />
            )}
          </Group>
        </EtCanvas>
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

      {/* Left Axis Content */}
      {leftAxisContent}
    </View>
  );
});

ChartCanvas.displayName = 'EtLineChart.Canvas';

// ============================================================================
// Root Component
// ============================================================================

/**
 * EtLineChart - Interactive line chart with cursor tracking.
 *
 * Uses a provider/consumer pattern for efficient state management.
 * SharedValues ensure smooth animations without React re-renders.
 *
 * @example
 * ```tsx
 * const selectedValue = useSharedValue(0);
 *
 * <EtLineChart
 *   data={chartData}
 *   selectedValue={selectedValue}
 *   balance="positive"
 *   onFocusModeChange={(focused) => console.log('Focus:', focused)}
 *   onCursorDataChange={(cursorData) => console.log('Cursor:', cursorData)}
 * />
 * ```
 */
function LineChartComponent({
  data,
  width = Dimensions.get('window').width,
  height = 150,
  marginVertical = 10,
  balance = 'positive',
  isInteractive = true,
  selectedValue,
  yAxisLabels,
  yAxisLabelsHidden,
  yAxisTickCount,
  yAxisTickFormat,
  leftAxisContent,
  showBaseline = false,
  markers,
  showMarkers = true,
  markerColor,
  lineColor,
  cursorColor,
  surfaceColor,
  maskGradientColors,
  gradientOpacity,
  gradientColors,
  gradientFadeEndMultiplier,
  yAxisEnd,
  yAxisDistribution,
  redrawKey,
  animateOnRedraw,
  onFocusModeChange,
  onCursorDataChange,
}: LineChartProps) {
  return (
    <LineChartProvider
      width={width}
      height={height}
      marginVertical={marginVertical}
      isInteractive={isInteractive}
      onFocusModeChange={onFocusModeChange}
      onCursorDataChange={onCursorDataChange}
    >
      <ChartCanvas
        data={data}
        selectedValue={selectedValue}
        balance={balance}
        showBaseline={showBaseline}
        yAxisLabels={yAxisLabels}
        yAxisLabelsHidden={yAxisLabelsHidden}
        yAxisTickCount={yAxisTickCount}
        yAxisTickFormat={yAxisTickFormat}
        leftAxisContent={leftAxisContent}
        markers={markers}
        showMarkers={showMarkers}
        markerColor={markerColor}
        lineColor={lineColor}
        cursorColor={cursorColor}
        surfaceColor={surfaceColor}
        maskGradientColors={maskGradientColors}
        gradientOpacity={gradientOpacity}
        gradientColors={gradientColors}
        gradientFadeEndMultiplier={gradientFadeEndMultiplier}
        yAxisEnd={yAxisEnd}
        yAxisDistribution={yAxisDistribution}
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
 * On web, CanvasKit is fetched in parallel with app boot (see index.js), so a chart may
 * mount before it lands. `useSkiaReady()` is `true` immediately on native and flips on web
 * once CanvasKit is usable — until then we render an inert, same-size placeholder and
 * repaint into the real chart the moment it's ready (no permanent blank).
 */
/**
 * The first mounted Skia surface requests CanvasKit on demand (see skia-ready).
 * The runtime hook is immediately ready on native and reports web loading/failure
 * state until CanvasKit is usable — until then we render a same-size placeholder
 * (or a retry/unsupported message) and repaint into the real chart when the shared
 * single-flight request succeeds.
 */
function LineChartWithSkiaGuard(props: LineChartProps) {
  const runtime = useSkiaRuntime();
  const { t } = useTranslation('uiKit');
  if (runtime.status !== 'ready') {
    const width = props.width ?? Dimensions.get('window').width;
    const height = props.height ?? 150;
    if (runtime.status === 'unsupported') {
      return (
        <View
          accessible
          accessibilityRole="alert"
          testID={props.testID ? `${props.testID}-skia-unsupported` : 'skia-runtime-unsupported'}
          style={[styles.skiaFallback, { width, height }]}
        >
          <EtText variant="caption-regular">{t('skiaRuntime.unsupported')}</EtText>
        </View>
      );
    }
    if (runtime.status === 'failed') {
      return (
        <View testID={props.testID ? `${props.testID}-skia-failed` : 'skia-runtime-failed'} style={[styles.skiaFallback, { width, height }]}>
          <EtText variant="caption-regular">{t('skiaRuntime.unavailable')}</EtText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('skiaRuntime.retryAccessibility')}
            testID="skia-runtime-retry"
            onPress={() => void retrySkiaRuntime().catch(() => undefined)}
          >
            <EtText variant="caption-medium">{t('skiaRuntime.retry')}</EtText>
          </Pressable>
        </View>
      );
    }
    return <View pointerEvents="none" testID={props.testID ? `${props.testID}-skia-placeholder` : undefined} style={{ width, height }} />;
  }
  return <LineChartComponent {...props} />;
}

/**
 * Memoized EtLineChart component.
 * Prevents unnecessary re-renders when parent component updates.
 */
export const EtLineChart = memo(LineChartWithSkiaGuard);
EtLineChart.displayName = 'EtLineChart';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  skiaFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    position: 'relative',
    marginTop: X5,
    // Plot math (d3 scales, Skia paths, fill close, scrub) is physical left→right.
    // Lock LTR so RTL left/right swap can't desync the area fill from the stroke.
    direction: 'ltr',
  },
  container: {
    alignSelf: 'center',
    overflow: 'visible',
  },
});
