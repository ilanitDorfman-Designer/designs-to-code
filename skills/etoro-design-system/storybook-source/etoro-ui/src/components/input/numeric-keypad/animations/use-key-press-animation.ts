import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import type { NumericKeyValue } from '../api/types';
import { GLYPH_PRESSED_SCALE, PRESS_CIRCLE_REST_SCALE, PRESS_PULSE_IN, PRESS_PULSE_OUT } from './constants';

interface UseKeyPressAnimationParams {
  value: NumericKeyValue;
  disabled: boolean;
  onPress: (value: NumericKeyValue) => void;
}

/**
 * Drives a digit / decimal-point key's press feedback: a grey circle that plays a
 * single fixed grow-in / fade-out pulse (plus a matching glyph scale) on every tap.
 * The pulse is driven by a `withSequence` fired on press-in, so it always runs its
 * full cycle — a quick tap and a long hold produce the exact same, distinct feedback.
 * Returns the animated styles and the tap gesture (which invokes `onPress` only on a
 * successful tap).
 */
export function useKeyPressAnimation({ value, disabled, onPress }: UseKeyPressAnimationParams) {
  const pressProgress = useSharedValue(0);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: pressProgress.get(),
    transform: [{ scale: PRESS_CIRCLE_REST_SCALE + (1 - PRESS_CIRCLE_REST_SCALE) * pressProgress.get() }],
  }));

  const glyphStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - (1 - GLYPH_PRESSED_SCALE) * pressProgress.get() }],
  }));

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      pressProgress.set(0);
      pressProgress.set(withSequence(withTiming(1, PRESS_PULSE_IN), withTiming(0, PRESS_PULSE_OUT)));
    })
    .onEnd((_, success) => {
      'worklet';
      if (success) {
        runOnJS(onPress)(value);
      }
    });

  return { circleStyle, glyphStyle, gesture };
}
