import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { type SharedValue, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

import { SHAKE_KICK, SHAKE_OFFSET, SHAKE_SETTLE } from './constants';

/**
 * Returns a `translateX` shared value that performs a single horizontal "error shake" and fires an
 * error haptic each time `trigger` changes to a new value. A monotonic nonce (rather than a boolean
 * edge) is used on purpose so the shake re-fires on every offending event - e.g. repeatedly deleting
 * while already at zero, or hitting an input cap - even though the underlying condition stays true.
 *
 * Adapted from the EtButton `useErrorShakeAnimation` (boolean) on
 * `feature/PAH-000-ui-kit-et-button-enhancements`.
 */
export function useShakeAnimation(trigger: number): SharedValue<number> {
  const shakeX = useSharedValue(0);
  const primed = useRef(false);

  useEffect(() => {
    // Skip the mount run so the value doesn't shake when it first renders at its initial trigger.
    if (!primed.current) {
      primed.current = true;
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    shakeX.value = withSequence(withSpring(-SHAKE_OFFSET, SHAKE_KICK), withSpring(0, SHAKE_SETTLE));
  }, [trigger, shakeX]);

  return shakeX;
}
