import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

import { useReducedMotion } from '../../../core/hooks';
import { create } from '../../../utils/create';
import type { EtPieChartProps } from './api/types';
import { usePieChartConfig, usePieChartSegments } from './hooks';
import { Segment, SegmentLegend, SegmentLegendItem } from './subcomponents';

/**
 * Entrance sweep duration. The animation draws a full 360° arc, so it needs
 * noticeably longer than a typical fade/slide to be legible — at a few hundred ms
 * the donut appears to simply pop in.
 */
const DEFAULT_ANIMATION_DURATION = 900;

/**
 * Decelerating curve for the sweep. Reanimated's default (`inOut(quad)`) eases in
 * as well, which wastes the opening frames on an arc that's still near-zero length;
 * starting at full speed and settling reads as a deliberate reveal.
 */
const SWEEP_EASING = Easing.out(Easing.cubic);

/**
 * EtPieChart — a themeable donut chart for the eToro UI kit.
 *
 * Renders a hollow ring of gapless arcs starting at 12 o'clock and proceeding
 * clockwise. Segment values are relative shares (normalized by their sum), so the
 * arcs always fill the circle and a muted track is drawn only when there is no
 * data. Overflow beyond `maxSegments` folds into a single "Other" arc. An optional
 * decorative dashed outer ring matches the Figma "Dashed line" variant.
 *
 * Segment colors may be translucent — they composite against whatever surface the
 * chart sits on, never against a track.
 *
 * Colors default to the DS accent palette (A→G) and adapt to light/dark theme;
 * consumers may override per segment via `data[].color`.
 *
 * The legend is exposed as sibling compound components so it can be placed
 * freely relative to the chart:
 *
 * @example Donut only
 * ```tsx
 * <EtPieChart data={[{ key: 'Stocks', value: 60 }, { key: 'Crypto', value: 40 }]} />
 * ```
 *
 * @example With legend
 * ```tsx
 * <EtPieChart data={segments} size="large" />
 * <EtPieChart.SegmentLegend>
 *   {segments.map((s) => (
 *     <EtPieChart.SegmentLegendItem key={s.key} dotColor={s.color} label={s.key} value={`${s.value}%`} showChevron />
 *   ))}
 * </EtPieChart.SegmentLegend>
 * ```
 */
function EtPieChartBase({
  data = [],
  size = 'small',
  innerRadius,
  maxSegments = 7,
  showOuterRing = false,
  enableAnimation = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  style,
  testID,
  accessibilityLabel,
}: EtPieChartProps) {
  const config = usePieChartConfig({ size, innerRadius, showOuterRing });
  const segments = usePieChartSegments({ data, maxSegments, circumference: config.circumference });

  const reducedMotion = useReducedMotion();
  const shouldAnimate = enableAnimation && !reducedMotion;

  const progress = useSharedValue(shouldAnimate ? 0 : 1);

  useEffect(() => {
    if (shouldAnimate) {
      progress.set(0);
      progress.set(withTiming(1, { duration: animationDuration, easing: SWEEP_EASING }));
    } else {
      progress.set(1);
    }
  }, [segments, shouldAnimate, animationDuration, progress]);

  const { px, viewBoxSize, center } = config;
  // Arcs always normalize to a full circle, so the track is only ever exposed by
  // the empty state. Leaving it behind filled arcs would tint any translucent
  // segment color instead of letting it composite against the surface.
  const trackColor = segments.length > 0 ? 'transparent' : config.trackColor;
  // Center the (possibly larger) SVG viewBox over the `px × px` layout container.
  // Offset is 0 when `showOuterRing` is off (viewBoxSize === px); negative when on,
  // so the dashed ring overflows into the Figma `-5%` inset region.
  const svgOffset = (px - viewBoxSize) / 2;

  return (
    <View
      style={[styles.container, { width: px, height: px }, style]}
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `Pie chart with ${segments.length} segments`}
    >
      <Svg
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        // `top`/`left` are dynamic (depend on `svgOffset`) so they stay inline;
        // the static `position` lives in the stylesheet to satisfy no-inline-styles.
        style={[styles.svg, { top: svgOffset, left: svgOffset }]}
      >
        <G rotation={-90} origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={config.radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={config.strokeWidth}
            testID={testID ? `${testID}-track` : undefined}
          />
          {segments.map((segment, index) => (
            <Segment
              key={`${segment.key}-${index}`}
              center={center}
              radius={config.radius}
              strokeWidth={config.strokeWidth}
              circumference={config.circumference}
              color={segment.color}
              startFraction={segment.startFraction}
              fraction={segment.fraction}
              dashOffset={segment.dashOffset}
              progress={progress}
              testID={testID ? `${testID}-segment-${index}` : undefined}
            />
          ))}
        </G>
        {config.outerRing && (
          <Circle
            cx={center}
            cy={center}
            r={config.outerRing.radius}
            fill="none"
            stroke={config.outerRing.color}
            strokeWidth={config.outerRing.strokeWidth}
            strokeDasharray={config.outerRing.dashArray}
            testID={testID ? `${testID}-outer-ring` : undefined}
          />
        )}
      </Svg>
    </View>
  );
}

const EtPieChartMemo = create(EtPieChartBase, 'EtPieChart');

/**
 * Compound export: the donut plus its sibling legend building blocks.
 */
export const EtPieChart = Object.assign(EtPieChartMemo, {
  SegmentLegend,
  SegmentLegendItem,
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // The outer dashed ring, when enabled, renders outside the `px × px` box
    // (matching Figma's `-5%` inset). Keep overflow visible so it isn't clipped.
    overflow: 'visible',
  },
  svg: {
    // Centered over the `px × px` container; `top`/`left` offsets are applied
    // inline since they're derived from the (dynamic) viewBox size.
    position: 'absolute',
  },
});
