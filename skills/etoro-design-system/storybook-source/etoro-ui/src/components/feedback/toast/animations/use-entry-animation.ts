import { useEffect } from 'react';
import { Easing, type SharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { TOAST_ANIMATION } from '../api/types';
import { ENTRY_SPRING_CONFIG } from './configs';

interface UseEntryAnimationParams {
  /** Shared value for vertical translation */
  translateY: SharedValue<number>;
  /** Shared value for opacity */
  opacity: SharedValue<number>;
}

/**
 * Handles the toast entry animation
 *
 * - Slides up from off-screen with spring
 * - Fades in with eased timing
 */
export function useEntryAnimation({ translateY, opacity }: UseEntryAnimationParams): void {
  useEffect(() => {
    const updateValue = (sharedValue: SharedValue<number>, newValue: number) => {
      sharedValue.value = newValue;
    };

    // Slide up with spring
    updateValue(translateY, withSpring(0, ENTRY_SPRING_CONFIG));

    // Fade in
    updateValue(
      opacity,
      withTiming(1, {
        duration: TOAST_ANIMATION.ENTRY_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [translateY, opacity]);
}
