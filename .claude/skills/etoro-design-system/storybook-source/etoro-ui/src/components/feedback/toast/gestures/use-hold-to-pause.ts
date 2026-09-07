import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, type SharedValue, withTiming } from 'react-native-reanimated';

/** Minimum duration to recognize as a long press */
const LONG_PRESS_MIN_DURATION = 200;

/** Opacity when toast is held */
const HELD_OPACITY = 0.95;

/** Normal opacity */
const NORMAL_OPACITY = 1;

/** Opacity transition duration */
const OPACITY_DURATION = 150;

interface UseHoldToPauseParams {
  /** Whether the gesture is enabled */
  enabled: boolean;
  /** Callback when hold starts (pause timer) */
  onHoldStart: () => void;
  /** Callback when hold ends (resume timer) */
  onHoldEnd: () => void;
  /** Shared value for opacity (to animate held state on UI thread) */
  opacity: SharedValue<number>;
}

/**
 * Creates a long press gesture for hold-to-pause functionality
 *
 * - Pauses auto-dismiss timer when user holds the toast
 * - Resumes timer when released
 * - Animates opacity on UI thread (no React re-render)
 */
export function useHoldToPause({ enabled, onHoldStart, onHoldEnd, opacity }: UseHoldToPauseParams): ReturnType<typeof Gesture.LongPress> {
  return Gesture.LongPress()
    .enabled(enabled)
    .minDuration(LONG_PRESS_MIN_DURATION)
    .onStart(() => {
      'worklet';
      // Animate opacity on UI thread
      opacity.value = withTiming(HELD_OPACITY, { duration: OPACITY_DURATION });
      // Pause timer on JS thread
      runOnJS(onHoldStart)();
    })
    .onEnd(() => {
      'worklet';
      // Restore opacity on UI thread
      opacity.value = withTiming(NORMAL_OPACITY, { duration: OPACITY_DURATION });
      // Resume timer on JS thread
      runOnJS(onHoldEnd)();
    });
}
