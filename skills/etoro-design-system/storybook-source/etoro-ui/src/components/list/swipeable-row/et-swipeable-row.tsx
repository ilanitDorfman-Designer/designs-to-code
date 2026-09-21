import { useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import type { EtSwipeableActionProps, EtSwipeableRowProps } from './api/types';
import { SwipeableRowContext } from './context/swipeable-row-context';
import { useRowCollapse, useSwipeableRow, useSwipeableRowChildren } from './hooks';
import { SwipeableAction } from './subcomponents/swipeable-action';

const DEFAULT_FULL_SWIPE_THRESHOLD = 0.6;

function clampFullSwipeThreshold(value: number): number {
  if (Number.isFinite(value) && value > 0 && value <= 1) {
    return value;
  }
  if (__DEV__) {
    console.warn(`EtSwipeableRow: fullSwipeThreshold must be in (0, 1]. Received ${value}; falling back to ${DEFAULT_FULL_SWIPE_THRESHOLD}.`);
  }
  return DEFAULT_FULL_SWIPE_THRESHOLD;
}

/**
 * EtSwipeableRow - A component that allows horizontal swiping to reveal action buttons,
 * plus a Telegram/WhatsApp-style "swipe all the way" shortcut that auto-triggers the LAST action.
 *
 * Wrap any content with EtSwipeableRow and compose EtSwipeableRow.Action subcomponents
 * as siblings before or after the content to reveal on left swipe. All action icons fade in
 * uniformly as the row is dragged open.
 *
 * Child components can use `useSwipeableRowContext()` to check if expanded (`isOpen.get()`)
 * and collapse (`closeSwipe()`), enabling collapse-on-click behavior.
 *
 * Full-swipe behavior (enabled by default):
 * - As the user drags past `fullSwipeThreshold` of the row width, a single medium haptic fires.
 * - Past the threshold, the last action's background smoothly expands to fill the entire row.
 * - On release past the threshold, EtSwipeableRow invokes the last action's `onPress` (or
 *   `onFullSwipeCommit` if provided) and springs the row back to its closed state.
 *
 * Set `collapseOnLastAction` to make the row visually disappear (height collapses to 0) before
 * the callback fires — both for full-swipe commits AND for direct presses of the last action.
 * Use this for destructive rows like archive/delete; the consumer must still remove the item
 * from its data source.
 *
 * @example
 * ```tsx
 * function MyRow() {
 *   const { isOpen, closeSwipe } = useSwipeableRowContext();
 *   const handlePress = () => {
 *     if (isOpen.get()) {
 *       closeSwipe(); // Collapse if expanded
 *       return;
 *     }
 *     navigate(); // Default action when collapsed
 *   };
 *   return <Pressable onPress={handlePress}>...</Pressable>;
 * }
 *
 * <EtSwipeableRow>
 *   <MyRow />
 *   <EtSwipeableRow.Action onPress={handleDelete}>
 *     <EtIconV2 name="trash" />
 *   </EtSwipeableRow.Action>
 * </EtSwipeableRow>
 * ```
 *
 * @example Destructive row (animates the row away before firing onPress)
 * ```tsx
 * <EtSwipeableRow collapseOnLastAction>
 *   <EtListItemV2 size="large">...</EtListItemV2>
 *   <EtSwipeableRow.Action onPress={removeItemFromList} style={{ backgroundColor: colors.statusNegative }}>
 *     <EtIconV2 name="trash" size="lg" color={colors.textBright} />
 *   </EtSwipeableRow.Action>
 * </EtSwipeableRow>
 * ```
 *
 * @example Disable the full-swipe shortcut
 * ```tsx
 * <EtSwipeableRow enableFullSwipe={false}>...</EtSwipeableRow>
 * ```
 */
function EtSwipeableRowBase({
  children,
  isDragging,
  resetKey,
  contentContainerStyle,
  onSwipeStart,
  enableFullSwipe = true,
  fullSwipeThreshold = DEFAULT_FULL_SWIPE_THRESHOLD,
  onFullSwipeCommit,
  collapseOnLastAction = false,
}: EtSwipeableRowProps) {
  const { colors } = useEtoroTheme();

  const { actionElements, contentChildren, actionWidths } = useSwipeableRowChildren(children);

  // Stable ref to the last action so the commit handler can call its onPress without
  // re-creating the gesture on every render.
  const lastActionPressRef = useRef<(() => void) | null>(null);
  lastActionPressRef.current = (() => {
    if (actionElements.length === 0) return null;
    const last = actionElements[actionElements.length - 1] as { props: EtSwipeableActionProps };
    return last.props.onPress;
  })();

  const { onLayout: onCollapseLayout, isCollapsing, animatedHeightStyle, runCollapse } = useRowCollapse();

  // The non-collapse path needs to spring the row back to its closed state (and clear the
  // commit guard) AFTER it fires the consumer's callback. We declare a ref that the commit
  // handler reads from so the gesture memo doesn't have to be re-bound when resetCommit
  // identity shifts upstream.
  const resetCommitRef = useRef<(() => void) | null>(null);

  const handleCommit = useCallback(async () => {
    const fireCallback = () => {
      if (onFullSwipeCommit) {
        onFullSwipeCommit();
      } else {
        lastActionPressRef.current?.();
      }
    };

    if (collapseOnLastAction) {
      // Destructive path: hide the row first, then notify the consumer. The row stays
      // hidden after the callback (consumer is expected to remove the item), so we don't
      // reset the commit guard here — leaving it to its natural unmount cleanup.
      await runCollapse();
      try {
        fireCallback();
      } catch (error) {
        if (__DEV__) {
          console.error('EtSwipeableRow: onFullSwipeCommit / last action onPress threw.', error);
        }
        throw error;
      }
      return;
    }

    // Default path: fire the callback immediately so the consumer can react with no
    // animation delay, then visually undo the commit (spring back to closed state).
    // Always run the reset in `finally` so a thrown consumer doesn't leave the row latched
    // in the committed state.
    try {
      fireCallback();
    } finally {
      resetCommitRef.current?.();
    }
  }, [collapseOnLastAction, runCollapse, onFullSwipeCommit]);

  const {
    rowWidth,
    totalSwipeWidth,
    defaultButtonWidth,
    translateX,
    fullSwipeThresholdPx,
    takeover,
    isCommitting,
    animatedGesture,
    animatedStyle,
    closeSwipe,
    resetCommit,
    isOpen,
  } = useSwipeableRow({
    actionWidths,
    isDragging,
    resetKey,
    onSwipeStart,
    onFullSwipeCommit: handleCommit,
    enableFullSwipe,
    fullSwipeThreshold: clampFullSwipeThreshold(fullSwipeThreshold),
  });

  resetCommitRef.current = resetCommit;

  const handleRowLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (width > 0) {
        rowWidth.set(width);
      }
      onCollapseLayout(event);
    },
    [rowWidth, onCollapseLayout],
  );

  const contextValue = useMemo(
    () => ({
      closeSwipe,
      defaultButtonWidth,
      isOpen,
      translateX,
      rowWidth,
      totalActionsWidth: totalSwipeWidth,
      fullSwipeThresholdPx,
      takeover,
      isCommitting,
      enableFullSwipe,
      collapseOnLastAction,
      runCollapse,
    }),
    [
      closeSwipe,
      defaultButtonWidth,
      isOpen,
      translateX,
      rowWidth,
      totalSwipeWidth,
      fullSwipeThresholdPx,
      takeover,
      isCommitting,
      enableFullSwipe,
      collapseOnLastAction,
      runCollapse,
    ],
  );

  // Drag-in: anchor the actions container to the trailing edge of the content. The container
  // sits flush against the row's right edge (offset by exactly `totalSwipeWidth` so the children
  // are off-screen at rest) and slides leftward in lockstep with the content's translateX.
  // Once the user has revealed all actions we clamp so the container doesn't keep flying off,
  // letting the takeover animation drive the rest of the visual change.
  const actionsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: Math.max(translateX.get(), -totalSwipeWidth) }],
  }));

  // We always render `Animated.View` (not a conditional `View`/`Animated.View`) so React
  // never has to unmount/remount the entire swipe subtree the moment the collapse starts.
  // `animatedHeightStyle` is a no-op before commit (collapseProgress starts at 1 and
  // measuredHeight only contributes once the wrapper opts into the animated height),
  // so unconditionally including it has no visual effect on the open/closed states.
  const wrapperStyle = useMemo(
    () => (isCollapsing ? [styles.container, styles.containerCollapsing, animatedHeightStyle] : styles.container),
    [isCollapsing, animatedHeightStyle],
  );

  return (
    <SwipeableRowContext.Provider value={contextValue}>
      <Animated.View style={wrapperStyle} onLayout={handleRowLayout}>
        <Animated.View
          testID="et-swipeable-row-actions-container"
          style={[styles.actionsContainer, { right: -totalSwipeWidth }, actionsAnimatedStyle]}
        >
          {actionElements}
        </Animated.View>
        <GestureDetector gesture={animatedGesture}>
          <Animated.View style={[styles.content, { backgroundColor: colors.backgroundBase }, contentContainerStyle, animatedStyle]}>
            {contentChildren}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </SwipeableRowContext.Provider>
  );
}

EtSwipeableRowBase.displayName = 'EtSwipeableRow';

/**
 * EtSwipeableRow with compound components attached.
 *
 * - EtSwipeableRow.Action - Action button revealed on left swipe. The LAST action is also
 *   the auto-triggered "full-swipe" action when the user drags past the threshold.
 */
export const EtSwipeableRow = Object.assign(EtSwipeableRowBase, {
  Action: SwipeableAction,
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  containerCollapsing: {
    // Once we start animating height, switch off the natural layout so the animated
    // value drives the box height. `overflow: hidden` is already inherited from `container`.
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  content: {
    width: '100%',
  },
});
