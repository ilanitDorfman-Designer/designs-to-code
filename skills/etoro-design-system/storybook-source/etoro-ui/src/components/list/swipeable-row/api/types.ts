import type { ReactNode } from 'react';
import type { AccessibilityRole, StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Props for `EtSwipeableRow.Action` subcomponent.
 * Each action is revealed when the row is swiped left.
 *
 * The last action also serves as the "full-swipe" action — when the user drags the row past
 * `fullSwipeThreshold` and releases, `EtSwipeableRow` expands the last action across the entire
 * row and then invokes its `onPress` (or `onFullSwipeCommit` if the parent provides it).
 *
 * Whether the row collapses (height → 0) before the callback fires depends on
 * `collapseOnLastAction` on the parent `EtSwipeableRow`:
 * - `false` (default): the callback fires immediately and the row springs back to its closed
 *   state. Direct presses on the last action also fire `onPress` synchronously without
 *   collapsing.
 * - `true`: the row first animates its height to 0, then the callback fires. Both full-swipe
 *   commits and direct presses of the last action collapse the row.
 *
 * Non-last actions are unaffected by `collapseOnLastAction`; they always fire `onPress`
 * synchronously without collapsing.
 */
export interface EtSwipeableActionProps {
  /** Content rendered inside the action button (icon, text, etc.) */
  children: ReactNode;
  /** Called when the action is tapped. The swipe actions do not close after press. */
  onPress: () => void;
  /**
   * Width of this action in pixels. Affects total snap distance.
   * @default 70
   */
  width?: number;
  /** Style for the action container. Use backgroundColor to color the action. */
  style?: StyleProp<ViewStyle>;
  /** Stable automation identifier forwarded to the underlying press target. */
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
  disabled?: boolean;
}

/**
 * Internal props injected by EtSwipeableRow into each EtSwipeableRow.Action via cloneElement.
 * Consumers should not set these directly.
 *
 * @internal
 */
export interface EtSwipeableActionInternalProps {
  /** Position of this action in the action list (0-based). Injected by the parent. */
  _index?: number;
  /** Total number of actions on this row. Injected by the parent. */
  _actionsCount?: number;
}

/**
 * Context value shared between EtSwipeableRow and its Action subcomponents.
 *
 * Action subcomponents read shared values from this context to drive per-action opacity
 * (staggered fade-in) and the last-action width expansion during the full-swipe gesture.
 */
export interface SwipeableRowContextValue {
  /** Programmatically close the swipe animation */
  closeSwipe: () => void;
  /** Fallback width applied to actions without an explicit width prop */
  defaultButtonWidth: number;
  /** SharedValue indicating if the row is currently expanded (actions visible). Call `.get()` to read the value. */
  isOpen: SharedValue<boolean>;
  /** Live horizontal translation of the content (negative when actions are revealed) */
  translateX: SharedValue<number>;
  /** Live measured width of the row in pixels (updated via onLayout) */
  rowWidth: SharedValue<number>;
  /** Sum of all action widths */
  totalActionsWidth: number;
  /** Pixel threshold past which a release commits the full-swipe action */
  fullSwipeThresholdPx: SharedValue<number>;
  /**
   * Smooth 0->1 progress of the full-swipe takeover animation.
   * Animates to 1 (over ~220ms) the moment the user crosses the threshold, and back to 0
   * if they retreat. Drives the last-action width expansion and the sibling shrink/fade.
   */
  takeover: SharedValue<number>;
  /** True while EtSwipeableRow is animating the commit (last action expand + height collapse) */
  isCommitting: SharedValue<boolean>;
  /** Whether the full-swipe behavior is enabled for this row */
  enableFullSwipe: boolean;
  /**
   * Whether the row should collapse to 0 height before firing the last action's callback.
   * Read by the action subcomponent to wrap the LAST action's onPress with a collapse step.
   */
  collapseOnLastAction: boolean;
  /** JS-thread function that animates the row height to 0. Resolves when the animation completes. */
  runCollapse: () => Promise<void>;
}

/**
 * Props for EtSwipeableRow.
 *
 * @example Single action
 * ```tsx
 * <EtSwipeableRow>
 *   <EtListItemV2 size="large">...</EtListItemV2>
 *   <EtSwipeableRow.Action onPress={handleDelete} style={{ backgroundColor: colors.statusNegative }}>
 *     <EtIconV2 name="trash" size="lg" color={colors.textBright} />
 *   </EtSwipeableRow.Action>
 * </EtSwipeableRow>
 * ```
 *
 * @example Multiple actions (the LAST one is auto-triggered on full swipe)
 * ```tsx
 * <EtSwipeableRow onSwipeStart={handleSwipeStart}>
 *   <EtListItemV2 size="large">...</EtListItemV2>
 *   <EtSwipeableRow.Action onPress={handleTrade} style={{ backgroundColor: colors.bgNeutralSecondary }}>
 *     <EtIconV2 name="trade" size="lg" color={colors.textBright} />
 *   </EtSwipeableRow.Action>
 *   <EtSwipeableRow.Action onPress={handleDelete} style={{ backgroundColor: colors.statusNegative }}>
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
export interface EtSwipeableRowProps {
  children: ReactNode;
  /** Whether the parent list is currently dragging (closes swipe) */
  isDragging?: boolean;
  /**
   * Identity of the rendered item. In recycling lists (FlashList) the row INSTANCE survives
   * being rebound to a different item, so pass the item's key here: when it changes, the swipe
   * snaps closed instantly instead of the new item inheriting the old item's open swipe.
   */
  resetKey?: string;
  /** Called when swipe starts; receives a close function */
  onSwipeStart?: (closeSwipe: () => void) => void;
  /**
   * Style applied to the sliding content container.
   * Defaults to backgroundColor: colors.bgNeutralPrimary, which acts as an opaque
   * mask over the action buttons. Override with the matching surface color when
   * rendering on non-neutral backgrounds.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Telegram/WhatsApp-style "swipe all the way" shortcut. When the user drags past
   * `fullSwipeThreshold` and releases, EtSwipeableRow:
   * 1. Animates the LAST action so its background fills the entire row.
   * 2. Collapses the row height to 0 (smoothly closes the gap).
   * 3. Calls the last action's `onPress` (or `onFullSwipeCommit` if provided).
   *
   * A medium impact haptic fires once when the user crosses the threshold during the gesture.
   *
   * @default true
   */
  enableFullSwipe?: boolean;
  /**
   * Fraction of the row width past which a release commits the full-swipe action.
   * Must be in (0, 1]. Lower values trigger sooner.
   *
   * @default 0.6
   */
  fullSwipeThreshold?: number;
  /**
   * Optional override called instead of the last action's `onPress` when a full-swipe commits.
   * Fires immediately on commit by default; if `collapseOnLastAction` is true, fires AFTER
   * the row-collapse animation completes so the row is already visually gone.
   */
  onFullSwipeCommit?: () => void;
  /**
   * When true, both a full-swipe commit AND a press of the LAST action will animate the row's
   * height to 0 before invoking the action callback. Use for "destructive" rows like archive
   * or delete where the row should visually disappear in lockstep with the action firing.
   * The consumer is still responsible for removing the item from its data source.
   *
   * When false (default), a full-swipe just fires the callback and the row springs back to its
   * closed state; pressing the last action just fires `onPress` with no collapse animation.
   *
   * @default false
   */
  collapseOnLastAction?: boolean;
}
