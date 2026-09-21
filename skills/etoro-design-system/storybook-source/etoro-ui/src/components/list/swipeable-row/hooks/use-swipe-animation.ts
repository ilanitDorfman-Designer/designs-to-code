import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import type { ViewProps } from 'react-native';
import { Gesture, PanGesture } from 'react-native-gesture-handler';
import {
  type AnimatedProps,
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SNAP_VELOCITY_THRESHOLD = 300;
const SPRING_CONFIG = { damping: 50, stiffness: 300, overshootClamping: true };
/**
 * Animation used when the row collapses on its own — i.e. the user taps the open row to
 * dismiss it, or opens a sibling row which auto-closes this one. A stiff spring front-loads
 * the motion and reads as an abrupt snap in those cases, so we use an even, eased glide that
 * stays visibly animated even while a sibling row is being dragged open at the same time.
 */
const CLOSE_ANIMATION = { duration: 240, easing: Easing.out(Easing.cubic) };
/**
 * The user can drag slightly past the actions when full-swipe is disabled (rubber-band feel),
 * but never further than this many pixels beyond `totalSwipeWidth`.
 */
const RUBBER_BAND_OVERSHOOT = 24;
/** Duration of the smooth takeover animation (last action grows / siblings fade out). */
const TAKEOVER_DURATION_MS = 220;

type UseGesturePanInput = {
  /** Sum of all action widths in pixels. Used as the base "open" snap distance. */
  totalSwipeWidth: number;
  /** Live measured width of the full row. Drives the full-swipe threshold and the commit snap. */
  rowWidth: SharedValue<number>;
  /** Whether the full-swipe shortcut is enabled. */
  enableFullSwipe: boolean;
  /**
   * Fraction of `rowWidth` past which a release commits the full-swipe.
   * Must be in (0, 1]. Defaults are enforced by the calling component.
   */
  fullSwipeThreshold: number;
  onSwipeStart?: (closeSwipe: () => void) => void;
  /**
   * Called on the JS thread when a full-swipe gesture has been committed.
   * The hook has already snapped translateX to -rowWidth and is ready for
   * the row-collapse step before the consumer's onPress fires.
   */
  onFullSwipeCommit?: () => void;
};

type UseGesturePanOutput = {
  isOpen: SharedValue<boolean>;
  /** Live horizontal translation (negative when actions are revealed). */
  translateX: SharedValue<number>;
  /** Pixel threshold past which release will commit the full-swipe. */
  fullSwipeThresholdPx: SharedValue<number>;
  /**
   * Smooth 0->1 progress of the full-swipe takeover. Driven by an animated reaction:
   * animates to 1 (220ms ease-out) the moment the user drags past the threshold and back
   * to 0 if they retreat. Read by Action subcomponents to drive the last-action width
   * expansion and the sibling shrink/fade.
   */
  takeover: SharedValue<number>;
  /** True between the start of a commit and the end of all commit animations. */
  isCommitting: SharedValue<boolean>;
  animatedGesture: PanGesture;
  animatedStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
  closeSwipe: () => void;
  /**
   * Clears the post-commit "frozen" state and springs the row back to its closed position.
   * Used by the non-collapse commit path so the gesture can fire its callback and let the
   * row visually reset (instead of staying covered by the expanded last action).
   */
  resetCommit: () => void;
};

/**
 * Hook to handle the swipe animation for the swipeable row.
 *
 * Owns:
 * - the live `translateX` shared value (read by Action subcomponents for per-action fade)
 * - the `isOpen` SharedValue<boolean> reflecting whether the row is currently snapped open
 *   (call `.get()` to read; consumers can use it via context to implement collapse-on-click)
 * - the full-swipe threshold and the once-per-gesture haptic on threshold crossing
 * - the commit branch in `onEnd` that snaps the row fully open and notifies the JS thread
 *
 * The actual height-collapse + last-action `onPress` chain is wired up by `EtSwipeableRow`
 * via the `onFullSwipeCommit` callback.
 */
export function useSwipeAnimation({
  totalSwipeWidth,
  rowWidth,
  enableFullSwipe,
  fullSwipeThreshold,
  onSwipeStart,
  onFullSwipeCommit,
}: UseGesturePanInput): UseGesturePanOutput {
  const isOpen = useSharedValue(false);
  const isCommitting = useSharedValue(false);
  const hasFiredHaptic = useSharedValue(false);

  const translateX = useSharedValue(0);
  const fullSwipeThresholdPx = useSharedValue(0);
  const takeover = useSharedValue(0);

  // Smoothly tween `takeover` between 0 and 1 whenever the user crosses the threshold.
  // Using useAnimatedReaction means the animation runs on the UI thread without prop deps.
  useAnimatedReaction(
    () => fullSwipeThresholdPx.get() > 0 && -translateX.get() > fullSwipeThresholdPx.get(),
    (isPast, prev) => {
      if (isPast === prev) return;
      takeover.set(withTiming(isPast ? 1 : 0, { duration: TAKEOVER_DURATION_MS, easing: Easing.out(Easing.cubic) }));
    },
  );

  const closeSwipe = useCallback(() => {
    translateX.set(withTiming(0, CLOSE_ANIMATION));
    isOpen.set(false);
  }, [translateX, isOpen]);

  const resetCommit = useCallback(() => {
    // Clear the commit guard so the next gesture can run, then spring back to closed.
    // The takeover SV will tween back to 0 on its own via the existing useAnimatedReaction
    // as -translateX falls below the threshold.
    isCommitting.set(false);
    isOpen.set(false);
    translateX.set(withSpring(0, SPRING_CONFIG));
  }, [isCommitting, isOpen, translateX]);

  const onSwipeStartJS = useCallback(() => {
    onSwipeStart?.(closeSwipe);
  }, [onSwipeStart, closeSwipe]);

  const fireHapticJS = useCallback(() => {
    // Haptics can fail on simulators / unsupported devices; silently swallow.
    try {
      const result = Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (result && typeof (result as Promise<void>).catch === 'function') {
        (result as Promise<void>).catch(() => undefined);
      }
    } catch {
      // no-op
    }
  }, []);

  const onCommitJS = useCallback(() => {
    onFullSwipeCommit?.();
  }, [onFullSwipeCommit]);

  const animatedGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-5, 5])
        .failOffsetY([-10, 10])
        .onBegin(() => {
          'worklet';
          if (isCommitting.get()) return;
          hasFiredHaptic.set(false);
          // Hard-reset takeover (no animation) so an interrupted prior commit can't leak in.
          takeover.set(0);
          if (!isOpen.get()) {
            scheduleOnRN(onSwipeStartJS);
          }
        })
        .onUpdate((event) => {
          'worklet';
          if (isCommitting.get()) return;

          const fullThresholdPx = enableFullSwipe ? rowWidth.get() * fullSwipeThreshold : Infinity;
          fullSwipeThresholdPx.set(enableFullSwipe ? fullThresholdPx : 0);

          const base = isOpen.get() ? -totalSwipeWidth : 0;
          const proposed = base + event.translationX;

          // Allow the user to drag all the way to -rowWidth when full-swipe is on; otherwise
          // clamp to a small rubber-band overshoot beyond the actions.
          const lowerBound = enableFullSwipe ? -rowWidth.get() : -(totalSwipeWidth + RUBBER_BAND_OVERSHOOT);
          const next = Math.max(lowerBound, Math.min(0, proposed));
          translateX.set(next);

          // Fire a single haptic the first time we cross the threshold during this gesture.
          if (enableFullSwipe && -next >= fullThresholdPx && !hasFiredHaptic.get()) {
            hasFiredHaptic.set(true);
            scheduleOnRN(fireHapticJS);
          }
        })
        .onEnd((event) => {
          'worklet';
          if (isCommitting.get()) return;

          const tx = translateX.get();
          const fullThresholdPx = enableFullSwipe ? rowWidth.get() * fullSwipeThreshold : Infinity;

          // ── Full-swipe commit ────────────────────────────────────────
          if (enableFullSwipe && -tx >= fullThresholdPx) {
            isCommitting.set(true);
            isOpen.set(true);
            translateX.set(
              withSpring(-rowWidth.get(), SPRING_CONFIG, (finished) => {
                if (finished) {
                  scheduleOnRN(onCommitJS);
                }
              }),
            );
            return;
          }

          // ── Existing snap behavior ────────────────────────────────────
          const shouldOpen = totalSwipeWidth > 0 && (event.velocityX < -SNAP_VELOCITY_THRESHOLD || tx < -totalSwipeWidth / 2);
          translateX.set(withSpring(shouldOpen ? -totalSwipeWidth : 0, SPRING_CONFIG));
          isOpen.set(shouldOpen);
        }),
    [
      totalSwipeWidth,
      translateX,
      isOpen,
      isCommitting,
      hasFiredHaptic,
      takeover,
      fullSwipeThresholdPx,
      enableFullSwipe,
      fullSwipeThreshold,
      rowWidth,
      onSwipeStartJS,
      fireHapticJS,
      onCommitJS,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }],
  }));

  return {
    isOpen,
    translateX,
    fullSwipeThresholdPx,
    takeover,
    isCommitting,
    animatedGesture,
    animatedStyle,
    closeSwipe,
    resetCommit,
  };
}
