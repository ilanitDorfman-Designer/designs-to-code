import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import { type AnimatedProps, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const COLLAPSE_DURATION_MS = 220;

type UseRowCollapseOutput = {
  /** Set this on the outermost View to capture the row height. */
  onLayout: (event: LayoutChangeEvent) => void;
  /** True after `runCollapse` has been invoked. Drives the animated height wrapper. */
  isCollapsing: boolean;
  /** Animated style yielding `{ height }` while `isCollapsing` is true; ignored before. */
  animatedHeightStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
  /**
   * Animates the row height from its measured value down to 0.
   * Resolves once the timing animation settles (whether or not it ran to completion),
   * so awaiting callers never deadlock if the animation is interrupted.
   */
  runCollapse: () => Promise<void>;
};

/**
 * Hook owning the row's height-collapse animation used after a full-swipe commit.
 *
 * The hook keeps the wrapper at its natural (intrinsic) height until `runCollapse` is invoked.
 * Once invoked, it freezes the height at the measured value and animates it to 0 over
 * ~220ms with an ease-in-out curve, returning a promise that resolves on completion.
 *
 * Keeping the height undefined before commit avoids pinning the layout to a stale measurement
 * if the row's content changes size.
 */
export function useRowCollapse(): UseRowCollapseOutput {
  const measuredHeight = useSharedValue(0);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const collapseProgress = useSharedValue(1);

  // Mirror `isCollapsing` in a ref so `onLayout` can read the latest value without
  // taking it as a dependency — keeping the callback identity stable across renders
  // (consumers wrap it in their own `useCallback` and we don't want needless churn).
  const isCollapsingRef = useRef(false);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      // Freeze the captured height once a collapse animation is in flight. A
      // mid-animation re-layout (keyboard, parent reflow, font scale, etc.) would
      // otherwise overwrite `measuredHeight` and cause the animated height to jump,
      // since `animatedHeightStyle` reads `measuredHeight.get() * collapseProgress.get()`
      // on every UI-thread frame.
      if (isCollapsingRef.current) return;
      const { height } = event.nativeEvent.layout;
      if (height > 0) {
        measuredHeight.set(height);
      }
    },
    [measuredHeight],
  );

  const animatedHeightStyle = useAnimatedStyle(() => ({
    height: measuredHeight.get() * collapseProgress.get(),
    opacity: collapseProgress.get(),
  }));

  const runCollapse = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (measuredHeight.get() <= 0) {
        resolve();
        return;
      }

      isCollapsingRef.current = true;
      setIsCollapsing(true);

      // Defer to the next frame so the animated style takes effect before we drive
      // the value. Without this, the wrapper might briefly switch to height: 0 because
      // collapseProgress could be read before isCollapsing flips on.
      requestAnimationFrame(() => {
        collapseProgress.set(
          withTiming(0, { duration: COLLAPSE_DURATION_MS, easing: Easing.inOut(Easing.ease) }, () => {
            // Resolve regardless of `finished` so awaiting callers (e.g. handleCommit)
            // never hang when the animation is interrupted (e.g. by a sibling
            // animation or unmount).
            scheduleOnRN(resolve);
          }),
        );
      });
    });
  }, [collapseProgress, measuredHeight]);

  return {
    onLayout,
    isCollapsing,
    animatedHeightStyle,
    runCollapse,
  };
}
