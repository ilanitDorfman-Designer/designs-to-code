import { useCallback } from 'react';
import { Easing, runOnJS, type SharedValue, withTiming } from 'react-native-reanimated';

import { TOAST_ANIMATION } from '../api/types';

// Local constant to avoid literal type issues
const SLIDE_DISTANCE = TOAST_ANIMATION.SLIDE_DISTANCE as number;

interface UseExitAnimationParams {
  /** Shared value for vertical translation */
  translateY: SharedValue<number>;
  /** Shared value for opacity */
  opacity: SharedValue<number>;
  /** Shared value tracking exit state */
  isExiting: SharedValue<boolean>;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
  /**
   * Direction the toast leaves the screen: `+1` exits downward (bottom-anchored),
   * `-1` exits upward (top-anchored).
   * @default 1
   */
  exitSign?: 1 | -1;
}

interface UseExitAnimationResult {
  /** Trigger the standard exit animation */
  triggerExit: () => void;
  /** Trigger exit from a specific Y position (for swipe dismiss) */
  triggerExitFromPosition: (currentY: number) => void;
}

// Helper to update SharedValue without triggering param-reassign lint
function updateSharedValue<T>(sharedValue: SharedValue<T>, newValue: T): void {
  sharedValue.value = newValue;
}

/**
 * Handles toast exit animations
 *
 * - Standard exit: slides down and fades out
 * - Swipe exit: continues from current position
 */
export function useExitAnimation({ translateY, opacity, isExiting, onExitComplete, exitSign = 1 }: UseExitAnimationParams): UseExitAnimationResult {
  const exitTarget = exitSign * SLIDE_DISTANCE;

  const triggerExit = useCallback(() => {
    // Guard against multiple triggers
    if (isExiting.value) return;
    updateSharedValue(isExiting, true);

    updateSharedValue(
      translateY,
      withTiming(
        exitTarget,
        {
          duration: TOAST_ANIMATION.EXIT_DURATION,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished && onExitComplete) {
            runOnJS(onExitComplete)();
          }
        },
      ),
    );

    updateSharedValue(
      opacity,
      withTiming(0, {
        duration: TOAST_ANIMATION.EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
      }),
    );
  }, [translateY, opacity, isExiting, onExitComplete, exitTarget]);

  const triggerExitFromPosition = useCallback(
    (currentY: number) => {
      // Guard against multiple triggers
      if (isExiting.value) return;
      updateSharedValue(isExiting, true);

      // Continue from current swipe position
      updateSharedValue(
        translateY,
        withTiming(
          // Keep moving away from the anchored edge — furthest of the current
          // swipe position and the full slide distance, in the exit direction.
          exitSign === 1 ? Math.max(currentY, exitTarget) : Math.min(currentY, exitTarget),
          {
            duration: TOAST_ANIMATION.EXIT_DURATION,
            easing: Easing.out(Easing.cubic),
          },
          (finished) => {
            if (finished && onExitComplete) {
              runOnJS(onExitComplete)();
            }
          },
        ),
      );

      updateSharedValue(
        opacity,
        withTiming(0, {
          duration: TOAST_ANIMATION.EXIT_DURATION,
          easing: Easing.in(Easing.cubic),
        }),
      );
    },
    [translateY, opacity, isExiting, onExitComplete, exitSign, exitTarget],
  );

  return { triggerExit, triggerExitFromPosition };
}
