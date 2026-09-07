import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { KEYPAD_DISMISS_DISTANCE, KEYPAD_DISMISS_FALLBACK_HEIGHT, KEYPAD_DISMISS_VELOCITY, KEYPAD_SNAPBACK_SPRING } from './constants';

/**
 * Drawer-style drag-to-dismiss for the keypad panel (UI thread). Tracks a downward
 * pan on the top band, commits the dismiss mid-drag the instant either the distance
 * or fling-velocity threshold is met, and springs back to rest otherwise. Returns
 * the pan gesture, the container's translate/fade style, and its layout handler.
 */
export function useKeypadDragDismiss(onTopBandSwipeDown?: () => void) {
  const dragY = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const hasDismissed = useSharedValue(false);

  const handleRootLayout = (event: LayoutChangeEvent) => {
    contentHeight.set(event.nativeEvent.layout.height);
  };

  const panGesture = Gesture.Pan()
    .enabled(!!onTopBandSwipeDown)
    .activeOffsetY(8)
    .onBegin(() => {
      'worklet';
      // Fresh gesture: clear the mid-drag dismiss latch so a snapped-back band can be dragged again.
      hasDismissed.set(false);
    })
    .onUpdate((event) => {
      'worklet';
      dragY.set(event.translationY > 0 ? event.translationY : event.translationY * 0.15);
      // Commit the dismiss mid-drag the instant EITHER the distance OR the fling-velocity
      // threshold is met, so a quick downward sweep swaps to the modules panel continuously
      // — no pause at release waiting to "realize" the threshold was passed.
      const shouldDismiss = event.translationY > KEYPAD_DISMISS_DISTANCE || event.velocityY > KEYPAD_DISMISS_VELOCITY;
      if (onTopBandSwipeDown && !hasDismissed.get() && shouldDismiss) {
        hasDismissed.set(true);
        runOnJS(onTopBandSwipeDown)();
      }
    })
    .onEnd(() => {
      'worklet';
      // Already dismissed mid-drag, or released before any threshold → spring back to rest.
      if (hasDismissed.get()) return;
      dragY.set(withSpring(0, KEYPAD_SNAPBACK_SPRING));
    });

  const dragStyle = useAnimatedStyle(() => {
    const target = contentHeight.get() || KEYPAD_DISMISS_FALLBACK_HEIGHT;
    return {
      transform: [{ translateY: dragY.get() }],
      opacity: interpolate(dragY.get(), [0, target * 0.9], [1, 0], Extrapolation.CLAMP),
    };
  });

  return { panGesture, dragStyle, handleRootLayout };
}
