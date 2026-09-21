import { useEffect } from 'react';
import { type SharedValue, withSpring } from 'react-native-reanimated';

import { STACK_SPRING_CONFIG } from './configs';

interface UseStackAnimationParams {
  /** Target Y offset for this toast (negative = moves up, away from the edge) */
  stackOffset: number;
  /** Target depth scale (1 = front toast, smaller as it recedes) */
  stackScale: number;
  /** Target stack opacity (0 when stacked deeper than the visible count) */
  stackTargetOpacity: number;
  /** Shared value for the stack Y translation */
  stackOffsetY: SharedValue<number>;
  /** Shared value for the depth scale */
  stackScaleValue: SharedValue<number>;
  /** Shared value for the stack opacity (multiplied with entry/hold opacity) */
  stackOpacity: SharedValue<number>;
}

/**
 * Drives the Sonner-style stack transition (ported from `expo-dynamic-toast`).
 *
 * When toasts are added/removed or the stack expands/collapses, every toast
 * springs to its new depth — translating up into a peeking pile, scaling down
 * as it recedes, and fading out once it is stacked deeper than the visible
 * count. Uses transforms + opacity only (no layout writes) for UI-thread perf.
 */
export function useStackAnimation({
  stackOffset,
  stackScale,
  stackTargetOpacity,
  stackOffsetY,
  stackScaleValue,
  stackOpacity,
}: UseStackAnimationParams): void {
  useEffect(() => {
    stackOffsetY.set(withSpring(stackOffset, STACK_SPRING_CONFIG));
    stackScaleValue.set(withSpring(stackScale, STACK_SPRING_CONFIG));
    stackOpacity.set(withSpring(stackTargetOpacity, STACK_SPRING_CONFIG));
  }, [stackOffset, stackScale, stackTargetOpacity, stackOffsetY, stackScaleValue, stackOpacity]);
}
