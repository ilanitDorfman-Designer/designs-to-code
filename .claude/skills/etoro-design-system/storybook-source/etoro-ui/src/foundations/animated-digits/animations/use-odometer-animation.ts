// ==============================================
// EtAnimatedCount odometer animation hook
// ==============================================

import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { AnimatedDigitProps } from '../api';
import { ANIMATION_CONFIG } from './constants';

/**
 * Drives the odometer strip: a 10-cell 0-9 column pinned to the target digit that springs on value change.
 * Returns the animated transform style applied to the strip.
 */
export function useOdometerAnimation(digit: number, height: number, springConfig?: AnimatedDigitProps['springConfig']) {
  const translateY = useSharedValue(-height * digit);

  useEffect(() => {
    const config = springConfig ?? ANIMATION_CONFIG.SPRING_CONFIG;
    translateY.set(withSpring(-height * digit, config));
  }, [digit, height, springConfig, translateY]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));
}
