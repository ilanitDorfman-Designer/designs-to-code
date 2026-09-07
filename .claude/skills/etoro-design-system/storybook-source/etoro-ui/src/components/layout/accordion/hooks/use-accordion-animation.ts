import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { ANIMATION_DURATION, SPRING_CONFIG } from '../utils';

interface UseAccordionAnimationParams {
  isExpanded: boolean;
}

interface UseAccordionAnimationReturn {
  /**
   * Animated style for chevron rotation
   */
  chevronAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
}

/**
 * Hook for managing accordion chevron animation
 * Uses spring (bounce) when opening, smooth timing when closing
 */
export function useAccordionAnimation({ isExpanded }: UseAccordionAnimationParams): UseAccordionAnimationReturn {
  const rotation = useSharedValue(isExpanded ? 180 : 0);

  useEffect(() => {
    if (isExpanded) {
      rotation.value = withSpring(180, SPRING_CONFIG);
    } else {
      rotation.value = withTiming(0, { duration: ANIMATION_DURATION });
    }
  }, [isExpanded, rotation]);

  // Animated style for chevron rotation
  const chevronAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  return {
    chevronAnimatedStyle,
  };
}
