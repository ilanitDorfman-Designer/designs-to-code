import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import type { EtSwipeableRowProps } from '../api/types';
import { useSwipeAnimation } from './use-swipe-animation';
import { useTotalSwipeWidth } from './use-total-swipe-width';

type UseSwipeableRowInput = Pick<EtSwipeableRowProps, 'isDragging' | 'resetKey' | 'onSwipeStart' | 'onFullSwipeCommit'> & {
  actionWidths: Array<{ width?: number }>;
  enableFullSwipe: boolean;
  fullSwipeThreshold: number;
};

/**
 * Composition hook for EtSwipeableRow. Wires together:
 * - swipe-distance math (`useTotalSwipeWidth`)
 * - the gesture + translate animation (`useSwipeAnimation`)
 * - the auto-close-on-parent-drag behavior
 *
 * Exposes a measured `rowWidth` shared value for the caller to update via `onLayout`,
 * along with everything the action subcomponents need via context — including `isOpen`
 * (a `SharedValue<boolean>`; call `.get()` to read), so children can implement
 * collapse-on-click behavior via `useSwipeableRowContext()`.
 */
export function useSwipeableRow({
  actionWidths,
  isDragging,
  resetKey,
  onSwipeStart,
  onFullSwipeCommit,
  enableFullSwipe,
  fullSwipeThreshold,
}: UseSwipeableRowInput) {
  const { totalSwipeWidth, defaultButtonWidth } = useTotalSwipeWidth(actionWidths);
  const rowWidth = useSharedValue(0);

  const { isOpen, translateX, fullSwipeThresholdPx, takeover, isCommitting, animatedGesture, animatedStyle, closeSwipe, resetCommit } =
    useSwipeAnimation({
      totalSwipeWidth,
      rowWidth,
      enableFullSwipe,
      fullSwipeThreshold,
      onSwipeStart,
      onFullSwipeCommit,
    });

  useEffect(() => {
    if (isDragging && isOpen.get()) {
      closeSwipe();
    }
  }, [isDragging, isOpen, closeSwipe]);

  // Recycling lists rebind this component INSTANCE to a different item; the swipe shared values
  // survive that, so without a snap-close the new item inherits the old item's open swipe
  // (destructive actions exposed on a row the user never swiped). Instant, not animated: the
  // new item must never be seen mid-close. Layout effect, not effect: a passive effect runs
  // after the recycled content paints (later still under JS-thread load), leaving frames where
  // the new item shows the old offset — this queues the reset before that first paint.
  const previousResetKeyRef = useRef(resetKey);
  useLayoutEffect(() => {
    if (previousResetKeyRef.current === resetKey) return;
    previousResetKeyRef.current = resetKey;
    translateX.set(0);
    isOpen.set(false);
    isCommitting.set(false);
    takeover.set(0);
  }, [isCommitting, isOpen, resetKey, takeover, translateX]);

  return {
    totalSwipeWidth,
    defaultButtonWidth,
    rowWidth,
    translateX,
    fullSwipeThresholdPx,
    takeover,
    isCommitting,
    animatedGesture,
    animatedStyle,
    closeSwipe,
    resetCommit,
    isOpen,
  };
}
