import type { StyleProp, ViewStyle } from 'react-native';
import { type AnimatedStyle, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface UseToastAnimatedStyleParams {
  /** Shared value for vertical translation (entry/exit animation + swipe) */
  translateY: SharedValue<number>;
  /** Shared value for stack offset translation (depth position in the pile) */
  stackOffsetY: SharedValue<number>;
  /** Shared value for depth scale (1 = front, smaller as it recedes) */
  stackScale: SharedValue<number>;
  /** Shared value for opacity (entry + held state) */
  opacity: SharedValue<number>;
  /** Shared value for stack opacity (faded out when stacked too deep) */
  stackOpacity: SharedValue<number>;
}

/**
 * Combines all animated values into a single animated style.
 *
 * Uses transform + opacity only (no layout writes) for UI-thread perf:
 * - translateY: Entry/exit animation and swipe gesture
 * - stackOffsetY: Depth position within the collapsed/expanded pile
 * - stackScale: Depth scaling (toasts further back look smaller)
 * - opacity * stackOpacity: Visibility (held state × depth fade)
 */
export function useToastAnimatedStyle({
  translateY,
  stackOffsetY,
  stackScale,
  opacity,
  stackOpacity,
}: UseToastAnimatedStyleParams): AnimatedStyle<StyleProp<ViewStyle>> {
  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + stackOffsetY.value }, { scale: stackScale.value }],
    opacity: opacity.value * stackOpacity.value,
  }));
}
