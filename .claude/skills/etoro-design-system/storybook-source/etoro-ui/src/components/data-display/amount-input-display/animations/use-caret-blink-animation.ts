import { useEffect } from 'react';
import { cancelAnimation, type SharedValue, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { CARET_FADE_MS, CARET_HOLD_MS } from './constants';

/**
 * Returns a shared opacity value that blinks a caret while `showCursor` is true (fades between 0 and 1
 * with a hold at each end so it breathes) and holds at 0 otherwise. Runs entirely on the UI thread.
 */
export function useCaretBlinkAnimation(showCursor: boolean): SharedValue<number> {
  const caretOpacity = useSharedValue(0);

  useEffect(() => {
    if (!showCursor) {
      cancelAnimation(caretOpacity);
      caretOpacity.set(0);
      return;
    }
    caretOpacity.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: CARET_FADE_MS }),
          withDelay(CARET_HOLD_MS, withTiming(0, { duration: CARET_FADE_MS })),
          withDelay(CARET_HOLD_MS, withTiming(0, { duration: 0 })),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(caretOpacity);
  }, [caretOpacity, showCursor]);

  return caretOpacity;
}
