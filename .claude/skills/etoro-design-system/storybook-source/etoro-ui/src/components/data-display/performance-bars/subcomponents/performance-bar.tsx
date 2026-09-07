import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import type { EtPerformanceBarsLayout, PerformanceBarsDataItem } from '../api';

const BACKGROUND_GRADIENT_OPACITY = 0.2;
const GHOST_TRACK_TRANSPARENT = 'transparent';
/** Fade duration (ms) when the muted (grey) overlay reveals/hides colour after a height morph. */
const MUTED_FADE_DURATION = 200;

const BAR_GRADIENT_START = { x: 0.5, y: 0 };
const BAR_GRADIENT_END = { x: 0.5, y: 1 };
const TOP_GRADIENT_START = { x: 0.5, y: 1 };
const TOP_GRADIENT_END = { x: 0.5, y: 0 };
const BOTTOM_GRADIENT_START = { x: 0.5, y: 0 };
const BOTTOM_GRADIENT_END = { x: 0.5, y: 1 };
// Slot background fade: full carbon at the center line, transparent by the half-way point of each
// half (rather than linearly across the whole half), so the grey stays concentrated near center.
const SLOT_BACKGROUND_FADE_LOCATIONS = [0, 0.5] as const;

export type BarConfig = {
  item: PerformanceBarsDataItem | null;
  hasBar: boolean;
  isPressable: boolean;
  isPositive: boolean;
  isGhostTrack: boolean;
  barHeight: number;
  index: number;
  /** Whether the bar's data point is muted (e.g. back-tested / simulated) — drives the grey overlay. */
  isMuted: boolean;
  barGradientColors: [string, string];
  /** True sign gradient shown while the (centered) bar sits above the axis. */
  positiveGradientColors: [string, string];
  /** True sign gradient shown while the (centered) bar sits below the axis. */
  negativeGradientColors: [string, string];
  /** Neutral gradient layered on top when muted; omitted when the scheme has no `mutedBar`. */
  mutedGradientColors?: [string, string];
  topBackgroundColors: [string, string];
  bottomBackgroundColors: [string, string];
  ghostTrackColors: [string, string];
  barOpacity: number;
  layout?: EtPerformanceBarsLayout;
};

export interface PerformanceBarProps {
  config: BarConfig;
  onBarPress: (index: number) => void;
  height: number;
  barGap: number;
  barBorderRadius: number;
  animated?: boolean;
  animationDuration?: number;
  animationStagger?: number;
  testID?: string;
}

/** Centered slot background: grey gradient concentrated near the center line (PE-202 fade locations). */
const SlotBackgroundGradients = memo(function SlotBackgroundGradients({
  height: slotHeight,
  topColors,
  bottomColors,
}: {
  height: number;
  topColors: [string, string];
  bottomColors: [string, string];
}) {
  const slotHalfHeight = slotHeight / 2;

  return (
    <View style={[styles.slotBackground, { height: slotHeight }]}>
      <View style={[styles.slotBackgroundHalf, { height: slotHalfHeight }]}>
        <LinearGradient
          colors={topColors}
          locations={SLOT_BACKGROUND_FADE_LOCATIONS}
          start={TOP_GRADIENT_START}
          end={TOP_GRADIENT_END}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={[styles.slotBackgroundHalf, { top: slotHalfHeight, height: slotHalfHeight }]}>
        <LinearGradient
          colors={bottomColors}
          locations={SLOT_BACKGROUND_FADE_LOCATIONS}
          start={BOTTOM_GRADIENT_START}
          end={BOTTOM_GRADIENT_END}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
});

/** Bottom-up empty months: slot gradients, faded out toward the top. */
const BottomUpGhostTrackGradient = memo(function BottomUpGhostTrackGradient({
  height: trackHeight,
  colors: trackColors,
}: {
  height: number;
  colors: [string, string];
}) {
  const trackHalfHeight = trackHeight / 2;

  return (
    <View style={[styles.slotBackground, { height: trackHeight }]}>
      <View style={[styles.slotBackgroundHalf, { height: trackHalfHeight }]}>
        <LinearGradient
          colors={[GHOST_TRACK_TRANSPARENT, trackColors[0]]}
          start={TOP_GRADIENT_END}
          end={TOP_GRADIENT_START}
          style={[StyleSheet.absoluteFill, { opacity: BACKGROUND_GRADIENT_OPACITY }]}
        />
      </View>
      <View style={[styles.slotBackgroundHalf, { top: trackHalfHeight, height: trackHalfHeight }]}>
        <LinearGradient
          colors={trackColors}
          start={BOTTOM_GRADIENT_START}
          end={BOTTOM_GRADIENT_END}
          style={[StyleSheet.absoluteFill, { opacity: BACKGROUND_GRADIENT_OPACITY }]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  ghostTrackAnchor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
  },
  slotBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    overflow: 'hidden',
  },
  slotBackgroundHalf: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
  },
  halfSectionTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    overflow: 'hidden',
  },
  positiveBar: {
    position: 'absolute',
    bottom: 0,
  },
  // Centered (signed) bar: absolutely positioned by the animated `top`/`height` so it can hang above
  // or below the center line and morph across it.
  centeredBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
  },
});

export const PerformanceBar = memo(function PerformanceBar({
  config,
  onBarPress,
  height,
  barGap,
  barBorderRadius,
  animated = false,
  animationDuration = 320,
  animationStagger = 60,
  testID,
}: PerformanceBarProps) {
  const {
    item,
    hasBar,
    isPressable = hasBar,
    isPositive,
    barHeight,
    index,
    isMuted,
    barGradientColors,
    positiveGradientColors,
    negativeGradientColors,
    mutedGradientColors,
    topBackgroundColors,
    bottomBackgroundColors,
    ghostTrackColors,
    isGhostTrack,
    barOpacity,
    layout = 'centered',
  } = config;

  const halfHeight = height / 2;
  const isBottomUp = layout === 'bottom-up';

  // Signed bar extent: positive bars sit above the center line (+), negative below (−). Bottom-up
  // charts are non-negative, so their extent is always ≥ 0. Animating this *signed* value lets a bar
  // morph across the center line when its sign changes between datasets, instead of snapping between
  // the top/bottom halves.
  const signedTarget = isBottomUp || isPositive ? barHeight : -barHeight;
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;
  const signedHeight = useSharedValue(shouldAnimate ? 0 : signedTarget);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) {
      signedHeight.value = signedTarget;
      hasEnteredRef.current = true;
      return;
    }
    if (!hasEnteredRef.current) {
      // Initial mount: grow out from the anchor with a left-to-right stagger.
      signedHeight.value = withDelay(index * animationStagger, withTiming(signedTarget, { duration: animationDuration }));
      hasEnteredRef.current = true;
      return;
    }
    // Data change (e.g. switching year): morph from the previous slot's signed height to the new one.
    // Because the value is signed, a slot that flips sign animates through the center line into the
    // opposite half rather than jumping.
    signedHeight.value = withTiming(signedTarget, { duration: animationDuration });
  }, [shouldAnimate, signedTarget, index, animationStagger, animationDuration, signedHeight]);

  // Bottom-up bars grow from the floor: only the magnitude matters.
  const bottomUpBarStyle = useAnimatedStyle(() => ({ height: Math.abs(signedHeight.value) }));

  // Centered bars are positioned by the signed value: height = |value|, anchored on the center line
  // (hanging upward for positive, downward for negative). The rounded corners follow the tip's
  // current side so they stay correct while a bar crosses zero.
  const centeredBarStyle = useAnimatedStyle(() => {
    const value = signedHeight.value;
    const isAbove = value >= 0;
    return {
      height: Math.abs(value),
      top: halfHeight - Math.max(value, 0),
      borderTopLeftRadius: isAbove ? barBorderRadius : 0,
      borderTopRightRadius: isAbove ? barBorderRadius : 0,
      borderBottomLeftRadius: isAbove ? 0 : barBorderRadius,
      borderBottomRightRadius: isAbove ? 0 : barBorderRadius,
    };
  });

  // Grey (muted) overlay sits on top of the sign colours. A muted→coloured bar holds grey through the
  // height morph and only reveals colour once it has settled. Every other case snaps to the target:
  // coloured→muted greys out immediately (grey is the only colour we'll end on anyway), and
  // unchanged / first-render / reduce-motion states just take the target directly.
  const mutedOpacity = useSharedValue(isMuted ? 1 : 0);
  const prevMutedRef = useRef<boolean | null>(null);

  useEffect(() => {
    const target = isMuted ? 1 : 0;
    const prev = prevMutedRef.current;
    prevMutedRef.current = isMuted;

    const isMutedToColoured = shouldAnimate && prev === true && !isMuted;
    if (!isMutedToColoured) {
      mutedOpacity.value = target;
      return;
    }
    mutedOpacity.value = 1;
    mutedOpacity.value = withDelay(animationDuration, withTiming(target, { duration: MUTED_FADE_DURATION }));
  }, [isMuted, shouldAnimate, animationDuration, mutedOpacity]);

  // Sign colour follows the bar's animated side of the axis (green above, red below), flipping at
  // zero. When a muted overlay exists, fade the fills out as the grey fades in (× (1 − mutedOpacity))
  // rather than relying on the grey to occlude them: occlusion breaks on Android when the bar is
  // dimmed (opacity applies per-child), bleeding colour through. Without a `mutedBar` colour the
  // fills keep their plain sign opacity (that fallback bar must stay visible).
  const hasMutedOverlay = mutedGradientColors != null;
  const positiveFillStyle = useAnimatedStyle(() => {
    const signOpacity = signedHeight.value >= 0 ? 1 : 0;
    return { opacity: hasMutedOverlay ? signOpacity * (1 - mutedOpacity.value) : signOpacity };
  });
  const negativeFillStyle = useAnimatedStyle(() => {
    const signOpacity = signedHeight.value < 0 ? 1 : 0;
    return { opacity: hasMutedOverlay ? signOpacity * (1 - mutedOpacity.value) : signOpacity };
  });

  const mutedOverlayStyle = useAnimatedStyle(() => ({ opacity: mutedOpacity.value }));

  const handlePress = useCallback(() => onBarPress(index), [onBarPress, index]);

  return (
    <Pressable
      style={[styles.barWrapper, { marginHorizontal: barGap / 2, height }]}
      onPress={isPressable ? handlePress : undefined}
      pointerEvents={isPressable ? 'auto' : 'none'}
      accessible={isPressable}
      accessibilityRole={isPressable ? 'button' : undefined}
      accessibilityLabel={isPressable && item ? `Performance bar ${index + 1}, ${item.value >= 0 ? '+' : ''}${item.value}%` : undefined}
      testID={testID}
    >
      {!isBottomUp ? <SlotBackgroundGradients height={height} topColors={topBackgroundColors} bottomColors={bottomBackgroundColors} /> : null}
      {isBottomUp && isGhostTrack ? (
        <View
          style={[
            styles.ghostTrackAnchor,
            {
              height: halfHeight,
              borderTopLeftRadius: barBorderRadius,
              borderTopRightRadius: barBorderRadius,
            },
          ]}
        >
          <BottomUpGhostTrackGradient height={halfHeight} colors={ghostTrackColors} />
        </View>
      ) : null}
      {hasBar && isBottomUp && isPositive && (
        <View style={[styles.halfSectionTop, { height }]}>
          <Animated.View
            style={[
              styles.bar,
              styles.positiveBar,
              {
                borderTopLeftRadius: barBorderRadius,
                borderTopRightRadius: barBorderRadius,
                opacity: barOpacity,
              },
              bottomUpBarStyle,
            ]}
          >
            <LinearGradient colors={barGradientColors} start={BAR_GRADIENT_START} end={BAR_GRADIENT_END} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </View>
      )}
      {hasBar && !isBottomUp && (
        <Animated.View style={[styles.centeredBar, { opacity: barOpacity }, centeredBarStyle]}>
          <Animated.View style={[StyleSheet.absoluteFill, positiveFillStyle]}>
            <LinearGradient colors={positiveGradientColors} start={BAR_GRADIENT_START} end={BAR_GRADIENT_END} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, negativeFillStyle]}>
            <LinearGradient colors={negativeGradientColors} start={BAR_GRADIENT_START} end={BAR_GRADIENT_END} style={StyleSheet.absoluteFill} />
          </Animated.View>
          {mutedGradientColors ? (
            <Animated.View style={[StyleSheet.absoluteFill, mutedOverlayStyle]}>
              <LinearGradient colors={mutedGradientColors} start={BAR_GRADIENT_START} end={BAR_GRADIENT_END} style={StyleSheet.absoluteFill} />
            </Animated.View>
          ) : null}
        </Animated.View>
      )}
    </Pressable>
  );
});

PerformanceBar.displayName = 'EtPerformanceBars.PerformanceBar';
