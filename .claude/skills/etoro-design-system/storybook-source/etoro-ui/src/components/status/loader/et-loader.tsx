import React, { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import type { EtLoaderProps } from './api/types';
import { useLoaderConfig } from './hooks/use-loader-config';
import { getArcPath } from './utils/get-arc-path';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

// On RNW a reanimated style on <Svg> crashes, so web animates a wrapping Animated.View; native applies it to <Svg>.
const IS_WEB = Platform.OS === 'web';

function EtLoaderBase(props: EtLoaderProps) {
  const { style, testID, accessibilityLabel } = props;

  // Get all configuration from hook
  const config = useLoaderConfig(props);
  const { containerSize, strokeWidth, radius, center, trackColor, progressColor, duration, isIndeterminate, clampedProgress } = config;

  // Calculate the arc path for the progress indicator
  // For indeterminate: 25% arc, for determinate: based on progress value
  const arcProgress = isIndeterminate ? 0.25 : clampedProgress;
  const arcPath = getArcPath(center, radius, arcProgress);

  // Memoized values to avoid inline object creation
  const sizeStyle = useMemo<ViewStyle>(() => ({ width: containerSize, height: containerSize }), [containerSize]);
  const viewBox = useMemo(() => `0 0 ${containerSize} ${containerSize}`, [containerSize]);
  const accessibilityValue = useMemo(
    () => (isIndeterminate ? { text: 'Loading' } : { min: 0, max: 100, now: Math.round(clampedProgress * 100) }),
    [isIndeterminate, clampedProgress],
  );

  // Rotation animation for indeterminate state
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isIndeterminate) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration,
          easing: Easing.linear,
        }),
        -1, // Infinite repeat
        false, // Don't reverse
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [isIndeterminate, duration, rotation]);

  // Animated style for rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // SVG content is identical across platforms; only the animation target differs.
  const svgChildren = (
    <>
      {/* Track circle (background) */}
      <Circle cx={center} cy={center} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />

      {/* Progress indicator */}
      {arcPath === null ? (
        // Full circle (progress = 100%) - use Circle to avoid linecap overlap artifact
        <Circle cx={center} cy={center} r={radius} stroke={progressColor} strokeWidth={strokeWidth} fill="none" />
      ) : arcPath ? (
        // Partial arc - use Path with rounded linecaps
        <Path d={arcPath} stroke={progressColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
      ) : null}
    </>
  );

  return (
    <View
      style={[styles.container, sizeStyle, style]}
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? 'Loading'}
      accessibilityValue={accessibilityValue}
    >
      {IS_WEB ? (
        // Web: animate a wrapping Animated.View around a plain <Svg>.
        <Animated.View style={isIndeterminate ? animatedStyle : undefined}>
          <Svg width={containerSize} height={containerSize} viewBox={viewBox}>
            {svgChildren}
          </Svg>
        </Animated.View>
      ) : (
        // Native: animated style applied directly to the <Svg>.
        <AnimatedSvg width={containerSize} height={containerSize} viewBox={viewBox} style={isIndeterminate ? animatedStyle : undefined}>
          {svgChildren}
        </AnimatedSvg>
      )}
    </View>
  );
}

EtLoaderBase.displayName = 'EtLoader';

/**
 * Circular loading indicator with indeterminate and determinate states.
 *
 * **States:**
 * - `indeterminate` - Spinning animation for unknown progress (default)
 * - `determinate` - Shows specific progress (0-1)
 *
 * **Preset sizes:** tiny (12px), xs (16px), small (20px), medium (24px), large (30px), xl (36px)
 *
 * @example
 * ```tsx
 * // Basic spinning loader
 * <EtLoader />
 *
 * // Large preset size
 * <EtLoader size="large" />
 *
 * // Determinate with 75% progress
 * <EtLoader state="determinate" progress={0.75} />
 *
 * // Custom colors
 * <EtLoader trackColor="#E3F2FD" progressColor="#1976D2" />
 * ```
 */
export const EtLoader = React.memo(EtLoaderBase);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
