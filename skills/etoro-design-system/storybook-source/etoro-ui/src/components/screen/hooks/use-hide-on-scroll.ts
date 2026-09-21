import { useEffect } from 'react';
import { type SharedValue, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

/** Don't hide on tiny scrolls near the top — prevents jitter on bounce. */
const MIN_HIDE_Y = 24;
/** EMA weight for new scroll deltas. Lower = smoother but laggier. 0.35 gives ~3-frame settle. */
const VELOCITY_SMOOTHING = 0.35;
/** Minimum smoothed velocity (px/frame) considered a real direction. Below this is jitter/noise. */
const MIN_VELOCITY = 1.5;
/** Downward smoothed-velocity-distance before hiding the chrome. */
const HIDE_DISTANCE = 28;
/** Upward smoothed-velocity-distance before revealing again. Larger than hide for hysteresis. */
const SHOW_DISTANCE = 64;
/** Enter the bottom reveal lock when close enough for end-of-list rubber-band bounce. */
const BOTTOM_REVEAL_GUARD_DISTANCE = 96;
/** Release the bottom reveal lock only after the user scrolls meaningfully away from the end. */
const BOTTOM_REVEAL_UNLOCK_DISTANCE = 320;
/** Opposite-direction accumulator decay on each frame in the new direction.
 *  Avoids the reset-to-zero failure mode where brief reversals wipe genuine intent. */
const OPPOSITE_DECAY = 0.5;
/** Cooldown after each visibility flip — long enough to outlast finger micro-reversals during
 *  slow drags, so an in-flight reveal animation never sees an opposite re-target. Consumers
 *  driving an animation off the returned flag should keep their timing below this value. */
export const HIDE_ON_SCROLL_TOGGLE_LOCK_MS = 320;

/** Inputs for {@link useHideOnScroll}. */
export interface UseHideOnScrollOptions {
  /** Per-screen scroll position to react to (from `EtScreenV2`'s `useScrollHandlers()`/context). */
  scrollY: SharedValue<number>;
  /** Remaining scrollable distance to the end of the scroll owner. Used to suppress bottom bounce reveals. */
  scrollBottomDistance?: SharedValue<number>;
  /** When false, the flag stays `true` (visible) and scroll is ignored. */
  enabled: boolean;
  /** When true, keep the current flag stable and ignore scroll-driven flips. */
  freeze?: boolean;
}

/**
 * Hide-on-scroll-down / show-on-scroll-up visibility flag derived entirely on the UI thread from
 * smoothed scroll velocity. Returns a `SharedValue<boolean>` (`true` = visible) that scroll-driven
 * chrome (screen headers, the bottom tab bar) reads inside worklets, so siblings never re-render
 * React on scroll.
 *
 * A scroll owner can also provide `scrollBottomDistance`; when it does, upward rubber-band velocity
 * near the end of the list is ignored so bottom bounce does not reveal hidden chrome.
 *
 * Shared by {@link useCollapsibleHeaderModel} and the bottom-tab-bar hide hook so both pieces of
 * chrome reveal/hide with identical thresholds and feel, in lock-step on the same scroll.
 */
export function useHideOnScroll({ scrollY, scrollBottomDistance, enabled, freeze = false }: UseHideOnScrollOptions): SharedValue<boolean> {
  const enabledSV = useSharedValue(enabled);
  const freezeSV = useSharedValue(freeze);

  useEffect(() => {
    enabledSV.value = enabled;
  }, [enabled, enabledSV]);

  useEffect(() => {
    freezeSV.value = freeze;
  }, [freeze, freezeSV]);

  const isVisible = useSharedValue(true);
  const lastScrollY = useSharedValue(0);
  const downwardDistance = useSharedValue(0);
  const upwardDistance = useSharedValue(0);
  /** EMA-smoothed scroll velocity (px/frame). Stable signal even when raw deltas are noisy. */
  const smoothedVelocity = useSharedValue(0);
  /** Latches once the list reaches the bottom zone, so fast rebound frames cannot reveal chrome. */
  const isBottomRevealLocked = useSharedValue(false);
  /** Worklet-clock timestamp (ms, from `performance.now()`) until which scroll-driven toggles are
   *  frozen — prevents Android slow-scroll bounce. Only ever compared against `performance.now()`,
   *  so its arbitrary epoch is irrelevant. */
  const lockedUntil = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      if (!enabledSV.value) {
        isVisible.value = true;
        downwardDistance.value = 0;
        upwardDistance.value = 0;
        smoothedVelocity.value = 0;
        isBottomRevealLocked.value = false;
        lastScrollY.value = y;
        return;
      }

      const rawDelta = y - lastScrollY.value;
      lastScrollY.value = y;

      if (freezeSV.value) {
        downwardDistance.value = 0;
        upwardDistance.value = 0;
        smoothedVelocity.value = 0;
        return;
      }

      // Always update the velocity EMA so the signal is fresh when the lock expires —
      // otherwise the post-lock first frame would react to a stale delta.
      smoothedVelocity.value = smoothedVelocity.value * (1 - VELOCITY_SMOOTHING) + rawDelta * VELOCITY_SMOOTHING;

      // Toggle cooldown: ignore scroll-driven flips while a reveal animation is in flight.
      if (performance.now() < lockedUntil.value) return;

      if (scrollBottomDistance != null) {
        if (scrollBottomDistance.value <= BOTTOM_REVEAL_GUARD_DISTANCE) {
          isBottomRevealLocked.value = true;
        } else if (scrollBottomDistance.value >= BOTTOM_REVEAL_UNLOCK_DISTANCE) {
          isBottomRevealLocked.value = false;
        }
      }

      const v = smoothedVelocity.value;
      if (y <= 0) {
        if (!isVisible.value) {
          isVisible.value = true;
          lockedUntil.value = performance.now() + HIDE_ON_SCROLL_TOGGLE_LOCK_MS;
        }
        downwardDistance.value = 0;
        upwardDistance.value = 0;
        smoothedVelocity.value = 0;
      } else if (v > MIN_VELOCITY) {
        downwardDistance.value += v;
        // Decay (don't reset) the opposite accumulator so brief reversals don't wipe genuine intent.
        upwardDistance.value *= OPPOSITE_DECAY;
        if (isVisible.value && y > MIN_HIDE_Y && downwardDistance.value >= HIDE_DISTANCE) {
          isVisible.value = false;
          downwardDistance.value = 0;
          upwardDistance.value = 0;
          lockedUntil.value = performance.now() + HIDE_ON_SCROLL_TOGGLE_LOCK_MS;
        }
      } else if (v < -MIN_VELOCITY) {
        if (isBottomRevealLocked.value) {
          upwardDistance.value = 0;
          downwardDistance.value *= OPPOSITE_DECAY;
          smoothedVelocity.value = 0;
          return;
        }

        upwardDistance.value += -v;
        downwardDistance.value *= OPPOSITE_DECAY;
        if (!isVisible.value && upwardDistance.value >= SHOW_DISTANCE) {
          isVisible.value = true;
          downwardDistance.value = 0;
          upwardDistance.value = 0;
          lockedUntil.value = performance.now() + HIDE_ON_SCROLL_TOGGLE_LOCK_MS;
        }
      }
    },
  );

  return isVisible;
}
