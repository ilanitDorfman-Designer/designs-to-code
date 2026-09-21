import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { GLYPH_PRESSED_SCALE, PRESS_SPRING } from './constants';

interface UseClearKeyPressAnimationParams {
  disabled: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

/**
 * Drives the "C" (clear) key's inversion animation: at rest the hexagonal badge is
 * an outline; on press it fills with the foreground color while the stroke + glyph
 * switch to the inverted color. Returns the per-layer animated styles and a gesture
 * that composes a long-press "clear-all" with the plain tap delete.
 */
export function useClearKeyPressAnimation({ disabled, onPress, onLongPress }: UseClearKeyPressAnimationParams) {
  const pressProgress = useSharedValue(0);

  const fillStyle = useAnimatedStyle(() => ({ opacity: pressProgress.get() }));
  const outlineStyle = useAnimatedStyle(() => ({ opacity: 1 - pressProgress.get() }));
  const glyphScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - (1 - GLYPH_PRESSED_SCALE) * pressProgress.get() }],
  }));
  const restGlyphStyle = useAnimatedStyle(() => ({ opacity: 1 - pressProgress.get() }));
  const invertedGlyphStyle = useAnimatedStyle(() => ({ opacity: pressProgress.get() }));

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      pressProgress.set(withSpring(1, PRESS_SPRING));
    })
    .onFinalize(() => {
      'worklet';
      pressProgress.set(withSpring(0, PRESS_SPRING));
    })
    .onEnd((_, success) => {
      'worklet';
      if (success) {
        runOnJS(onPress)();
      }
    });

  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .onStart(() => {
      'worklet';
      if (onLongPress) runOnJS(onLongPress)();
    });

  const gesture = Gesture.Exclusive(longPressGesture, tapGesture);

  return { fillStyle, outlineStyle, glyphScaleStyle, restGlyphStyle, invertedGlyphStyle, gesture };
}
