import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, type SharedValue, withSpring } from 'react-native-reanimated';

import { SWIPE_SPRING_CONFIG } from '../animations/configs';
import { TOAST_ANIMATION } from '../api/types';

interface UseSwipeToDismissParams {
  /** Whether the gesture is enabled */
  enabled: boolean;
  /** Shared value for vertical translation */
  translateY: SharedValue<number>;
  /** Shared value tracking exit state */
  isExiting: SharedValue<boolean>;
  /** Callback when swipe threshold is reached */
  onSwipeDismiss: (currentY: number) => void;
  /**
   * Direction that dismisses the toast: `+1` swipe down (bottom-anchored),
   * `-1` swipe up (top-anchored).
   * @default 1
   */
  exitSign?: 1 | -1;
}

/**
 * Creates a pan gesture for swipe-to-dismiss functionality
 *
 * - Only allows swipes away from the anchored edge (down for bottom-anchored
 *   toasts, up for top-anchored ones)
 * - Springs back if threshold not reached
 * - Triggers dismiss callback when threshold exceeded
 */
export function useSwipeToDismiss({
  enabled,
  translateY,
  isExiting,
  onSwipeDismiss,
  exitSign = 1,
}: UseSwipeToDismissParams): ReturnType<typeof Gesture.Pan> {
  return Gesture.Pan()
    .enabled(enabled)
    .onUpdate((event) => {
      // Don't process while exiting
      if (isExiting.value) return;

      // Only track movement away from the anchored edge
      if (event.translationY * exitSign > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Don't process if already exiting
      if (isExiting.value) return;

      if (event.translationY * exitSign > TOAST_ANIMATION.SWIPE_THRESHOLD) {
        // Threshold reached - trigger dismiss
        runOnJS(onSwipeDismiss)(event.translationY);
      } else {
        // Spring back to original position
        translateY.value = withSpring(0, SWIPE_SPRING_CONFIG);
        // Note: opacity is not modified during swipe, so no need to reset it
      }
    });
}
