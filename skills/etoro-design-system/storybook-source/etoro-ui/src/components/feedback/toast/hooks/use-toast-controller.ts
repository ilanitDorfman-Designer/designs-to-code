import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { type AnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useEntryAnimation, useExitAnimation, useStackAnimation, useToastAnimatedStyle } from '../animations';
import type { ToastPosition } from '../api/types';
import { DEFAULT_TOAST_POSITION, TOAST_ANIMATION, toastExitSign } from '../api/types';
import { useAutoDismissTimer, useHoldToPause, useSwipeToDismiss } from '../gestures';

interface UseToastControllerParams {
  /** Duration before auto-dismiss in ms */
  duration: number;
  /** Callback when toast should be removed from state */
  onDismissComplete: () => void;
  /** Pre-computed Y offset for stack positioning (negative = moves up) */
  stackOffset: number;
  /** Pre-computed depth scale (1 = front toast, smaller as it recedes) */
  stackScale: number;
  /** Pre-computed stack opacity (0 when stacked deeper than the visible count) */
  stackTargetOpacity: number;
  /** Whether gestures are enabled */
  gesturesEnabled?: boolean;
  /** Screen edge the toast is anchored to — flips every directional animation. @default 'top' */
  position?: ToastPosition;
  /** Holds the auto-dismiss timer open (the stack is expanded for reading). @default false */
  timerPaused?: boolean;
}

interface UseToastControllerResult {
  /** Animated style to apply to the toast container */
  animatedStyle: AnimatedStyle<StyleProp<ViewStyle>>;
  /** Combined gesture handler for the toast */
  gesture: ReturnType<typeof Gesture.Simultaneous>;
}

/**
 * Main controller hook for toast behavior
 *
 * Orchestrates:
 * - Entry animation (slide up, fade in)
 * - Exit animation (slide down, fade out)
 * - Stack transition: depth offset + scale + fade (via transform/opacity)
 * - Swipe-to-dismiss gesture
 * - Hold-to-pause gesture (opacity animated on UI thread)
 * - Auto-dismiss timer, frozen while the toast is held or the stack is expanded
 */
export function useToastController({
  duration,
  onDismissComplete,
  stackOffset,
  stackScale,
  stackTargetOpacity,
  gesturesEnabled = true,
  position = DEFAULT_TOAST_POSITION,
  timerPaused = false,
}: UseToastControllerParams): UseToastControllerResult {
  // `+1` travels toward the bottom edge, `-1` toward the top, so a top-anchored
  // toast starts (and later exits) above the screen instead of below it.
  const exitSign = toastExitSign(position);

  // Shared animation values
  const translateY = useSharedValue(exitSign * TOAST_ANIMATION.SLIDE_DISTANCE);
  const opacity = useSharedValue(0);
  const isExiting = useSharedValue(false);
  const stackOffsetY = useSharedValue(stackOffset);
  const stackScaleValue = useSharedValue(stackScale);
  const stackOpacity = useSharedValue(stackTargetOpacity);

  // Entry animation (runs on mount)
  useEntryAnimation({ translateY, opacity });

  // Stack transition (runs when depth/expanded state changes)
  useStackAnimation({
    stackOffset,
    stackScale,
    stackTargetOpacity,
    stackOffsetY,
    stackScaleValue,
    stackOpacity,
  });

  // Exit animation triggers
  const { triggerExit, triggerExitFromPosition } = useExitAnimation({
    translateY,
    opacity,
    isExiting,
    onExitComplete: onDismissComplete,
    exitSign,
  });

  // Auto-dismiss timer
  const { pauseTimer, resumeTimer, setRemainingTime } = useAutoDismissTimer({
    duration,
    onExpire: triggerExit,
  });

  // Two independent things can hold the timer: the hold gesture and an
  // expanded stack. Whichever is released first must not restart the countdown
  // while the other is still active, so both are tracked and OR-ed.
  const isHeldRef = useRef(false);
  const wasTimerPausedRef = useRef(timerPaused);

  useEffect(() => {
    if (timerPaused) {
      pauseTimer();
    } else if (wasTimerPausedRef.current) {
      // Left a user-expanded read: they've already seen the pile, so swap any
      // leftover original duration for a short grace period. `duration: 0`
      // (manual dismiss) must stay infinite.
      if (duration > 0) {
        setRemainingTime(TOAST_ANIMATION.POST_READ_DISMISS_DURATION);
      }
      if (!isHeldRef.current) {
        resumeTimer();
      }
    } else if (!isHeldRef.current) {
      resumeTimer();
    }
    wasTimerPausedRef.current = timerPaused;
  }, [timerPaused, duration, pauseTimer, resumeTimer, setRemainingTime]);

  const handleHoldStart = useCallback(() => {
    isHeldRef.current = true;
    pauseTimer();
  }, [pauseTimer]);

  const handleHoldEnd = useCallback(() => {
    isHeldRef.current = false;
    if (!timerPaused) {
      resumeTimer();
    }
  }, [resumeTimer, timerPaused]);

  // Swipe-to-dismiss gesture
  const swipeGesture = useSwipeToDismiss({
    enabled: gesturesEnabled,
    translateY,
    isExiting,
    onSwipeDismiss: triggerExitFromPosition,
    exitSign,
  });

  // Hold-to-pause gesture (animates opacity on UI thread, no React re-render)
  const holdGesture = useHoldToPause({
    enabled: gesturesEnabled,
    onHoldStart: handleHoldStart,
    onHoldEnd: handleHoldEnd,
    opacity,
  });

  // Combined gesture (memoized to avoid recreation on every render)
  const gesture = useMemo(() => Gesture.Simultaneous(swipeGesture, holdGesture), [swipeGesture, holdGesture]);

  // Animated style combining all values (transforms + opacity only, no layout writes)
  const animatedStyle = useToastAnimatedStyle({
    translateY,
    stackOffsetY,
    stackScale: stackScaleValue,
    opacity,
    stackOpacity,
  });

  return {
    animatedStyle,
    gesture,
  };
}
