import { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { EtMotionSwapProps } from './api/types';
import { buildMotionSwapLayerStyle } from './utils/build-motion-swap-layer-style';

const DEFAULT_DISTANCE = 14;
const DEFAULT_TIMING: NonNullable<EtMotionSwapProps['timingConfig']> = { duration: 220 };

/**
 * Crossfades two permanently-mounted content layers on the UI thread.
 *
 * A single `progress` shared value (0 = first visible, 1 = second visible)
 * drives opacity (and optionally a directional translate) for each layer.
 * No mount/unmount occurs during a swap, keeping React's reconciler out of
 * the animation hot path.
 */
export function EtMotionSwap({
  showSecond,
  axis,
  distance = DEFAULT_DISTANCE,
  opacityOnly = false,
  rasterizeLayers = false,
  first,
  second,
  timingConfig = DEFAULT_TIMING,
  style,
  testID,
}: EtMotionSwapProps) {
  const progress = useSharedValue(showSecond ? 1 : 0);

  useLayoutEffect(() => {
    progress.set(withTiming(showSecond ? 1 : 0, timingConfig));
  }, [showSecond, progress, timingConfig]);

  const rasterizeProps = rasterizeLayers
    ? {
        shouldRasterizeIOS: true as const,
        renderToHardwareTextureAndroid: true as const,
      }
    : {};

  const firstStyle = useAnimatedStyle(() => {
    'worklet';
    return buildMotionSwapLayerStyle(progress.get(), axis, distance, 'first', opacityOnly);
  });

  const secondStyle = useAnimatedStyle(() => {
    'worklet';
    return buildMotionSwapLayerStyle(progress.get(), axis, distance, 'second', opacityOnly);
  });

  const overlayPointerEvents = showSecond ? 'auto' : 'none';

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Animated.View
        style={firstStyle}
        pointerEvents={showSecond ? 'none' : 'auto'}
        accessibilityElementsHidden={showSecond}
        importantForAccessibility={showSecond ? 'no-hide-descendants' : 'auto'}
        collapsable={false}
        {...rasterizeProps}
      >
        {first}
      </Animated.View>
      <Animated.View
        style={[StyleSheet.absoluteFill, secondStyle]}
        pointerEvents={overlayPointerEvents}
        accessibilityElementsHidden={!showSecond}
        importantForAccessibility={showSecond ? 'auto' : 'no-hide-descendants'}
        collapsable={false}
        {...rasterizeProps}
      >
        {second}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
});
