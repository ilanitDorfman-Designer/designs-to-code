import { useEffect } from 'react';
import { cancelAnimation, Easing, makeMutable, type SharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/**
 * Single app-wide pulse clock.
 *
 * Every skeleton in the app reads this one shared value to derive its opacity
 * pulse (0 → 1 → 0, looping), instead of each instance owning its own
 * `withRepeat` loop. This keeps all skeletons phase-synced and means N atoms
 * cost exactly ONE timing animation on the UI thread (not N).
 *
 * The loop is reference-counted: it starts when the first skeleton mounts and
 * is cancelled when the last one unmounts, so it never runs when nothing is on
 * screen.
 */
const PULSE_DURATION_MS = 800;

// Progress 0 → 1, auto-reversing (0→1→0→1…). Lives at module scope so it is a
// true singleton shared across every skeleton instance.
const shimmerClock: SharedValue<number> =
  typeof makeMutable === 'function'
    ? makeMutable(0)
    : ({
        value: 0,
        get: () => 0,
        set(nextValue: number) {
          this.value = nextValue;
        },
      } as SharedValue<number>);

let consumerCount = 0;

function startClock() {
  shimmerClock.set(withRepeat(withTiming(1, { duration: PULSE_DURATION_MS, easing: Easing.inOut(Easing.ease) }), -1, true));
}

function stopClock() {
  cancelAnimation(shimmerClock);
  shimmerClock.set(0);
}

/**
 * Subscribes a skeleton to the shared shimmer clock for its lifetime and
 * returns the shared progress value to read inside worklets.
 */
export function useShimmerClock() {
  useEffect(() => {
    consumerCount += 1;
    if (consumerCount === 1) startClock();

    return () => {
      consumerCount -= 1;
      if (consumerCount === 0) stopClock();
    };
  }, []);

  return shimmerClock;
}
