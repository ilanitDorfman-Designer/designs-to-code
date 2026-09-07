import type { NetworkQuality } from '@etoro/common/infra/network-status';
import { useEffect, useRef } from 'react';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import { cancelAnimation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const ANIMATION_DURATION = 300;

interface UseNetworkStatusIndicatorProps {
  quality: NetworkQuality;
}

interface UseNetworkStatusIndicatorResult {
  animatedStyle: AnimatedStyle<ViewStyle>;
}

/**
 * Model hook for NetworkStatusIndicator.
 * Handles animation logic for showing/hiding the indicator.
 *
 * The Animated.View stays mounted to avoid race conditions with Reanimated's
 * worklet system. Visibility is controlled purely through opacity animation.
 */
export function useNetworkStatusIndicator({ quality }: UseNetworkStatusIndicatorProps): UseNetworkStatusIndicatorResult {
  const opacity = useSharedValue(0);
  const shouldShow = quality === 'offline' || quality === 'slow';
  const wasShowingRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  useEffect(() => {
    if (shouldShow && !wasShowingRef.current) {
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
      wasShowingRef.current = true;
    } else if (!shouldShow && wasShowingRef.current) {
      opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      wasShowingRef.current = false;
    }
  }, [shouldShow, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: interpolate(opacity.value, [0, 1], [0.8, 1]) }],
  }));

  return {
    animatedStyle,
  };
}
