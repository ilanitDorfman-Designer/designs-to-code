import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefObject } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { BackdropConfig, EtBottomSheetChildren } from './common.types';

// ============================================================================
// Animation Types
// ============================================================================

/** Spring animation style for open/close/snap transitions. */
export type EtBottomSheetAnimationPreset = 'smooth' | 'bouncy' | 'fast';

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Props for EtBottomSheet v2
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet bottomSheetRef={sheetRef}>
 *   <EtBottomSheet.Header>
 *     <EtBottomSheet.Header.Title>Select Option</EtBottomSheet.Header.Title>
 *     <EtBottomSheet.Header.Action onPress={handleClose} accessibilityLabel="Close">
 *       <EtoroIcon icon={{ iconName: 'close' }} />
 *     </EtBottomSheet.Header.Action>
 *   </EtBottomSheet.Header>
 *   <EtBottomSheet.Content>
 *     <YourContent />
 *   </EtBottomSheet.Content>
 *   <EtBottomSheet.Footer>
 *     <EtButton stretch onPress={handleConfirm}>Confirm</EtButton>
 *   </EtBottomSheet.Footer>
 * </EtBottomSheet>
 * ```
 */
export interface EtBottomSheetProps {
  /** Reference to the bottom sheet modal for imperative control */
  bottomSheetRef: RefObject<BottomSheetModal | null>;

  /**
   * Forces a full native `BottomSheetModal` remount on every `present()` call.
   *
   * `@gorhom/bottom-sheet`'s `BottomSheetModal` can silently stop responding to `.present()`
   * after a present/dismiss cycle on a **reused** instance: its internal `statusRef`/`mount`
   * bookkeeping can be left in an in-flight state from a still-settling previous cycle, and
   * several imperative methods early-return with no error when that happens — so `present()`
   * appears to succeed (valid ref, no throw) but the sheet never visually reopens.
   *
   * When `true`, `EtBottomSheet` owns `bottomSheetRef.current` itself and exposes a wrapper
   * whose `present()` forces React to fully unmount and recreate the underlying
   * `BottomSheetModal` (via a changing `key`) before re-presenting, sidestepping the stuck
   * internal state instead of relying on it recovering on its own. All other methods
   * (`dismiss`, `snapToIndex`, etc.) behave exactly as before.
   *
   * Opt-in — default `false`, so existing consumers are unaffected. Turn this on for sheets
   * that must reliably reopen after being dismissed via a path that doesn't guarantee a clean
   * `close()` handshake (e.g. opened imperatively from multiple, independent trigger sites).
   */
  remountOnPresent?: boolean;

  /**
   * Sheet content - use compound components:
   * - EtBottomSheet.Header (with .Title and .Action subcomponents)
   * - EtBottomSheet.Content (optional)
   * - EtBottomSheet.Footer (optional)
   */
  children: EtBottomSheetChildren;

  // ============================================================================
  // Sizing Configuration
  // ============================================================================

  /**
   * Points for the bottom sheet to snap to. Points should be sorted from bottom to top.
   * Accepts array of numbers (pixels) or strings (percentages).
   * When provided, disables dynamic sizing.
   * @example snapPoints={['25%', '50%', '90%']}
   */
  snapPoints?: (number | string)[];

  /**
   * Enable dynamic sizing based on content height.
   * Default: true (sheet sizes to fit content)
   */
  enableDynamicSizing?: boolean;

  /**
   * Maximum height for dynamic content sizing (in pixels).
   * Prevents sheet from exceeding this height when using dynamic sizing.
   * Useful for scrollable content to cap the sheet height.
   */
  maxDynamicContentSize?: number;

  /**
   * Top inset to be added to the bottom sheet container.
   * Useful when you have a navigation header.
   */
  topInset?: number;

  /**
   * Bottom inset to be added to the bottom sheet container.
   * Useful when you have a tab bar.
   */
  bottomInset?: number;

  // ============================================================================
  // Behavior Configuration
  // ============================================================================

  /**
   * Callback when sheet is opened (presented).
   * Called once when the sheet transitions from closed to open state.
   */
  onOpen?: () => void;

  /**
   * Callback when sheet is closed (dismissed).
   * Called once when the sheet transitions from open to closed state,
   * AFTER the dismiss animation completes.
   */
  onClose?: () => void;

  /**
   * Callback fired when close is triggered but BEFORE dismiss animation starts.
   * Use this for confirmation dialogs or preventing accidental close.
   *
   * @returns `false` to prevent close, `true` or `void` to proceed
   *
   * @example Confirmation dialog
   * ```tsx
   * <EtBottomSheet
   *   onBeforeClose={() => {
   *     if (hasUnsavedChanges) {
   *       showConfirmation();
   *       return false; // Prevent close
   *     }
   *     return true; // Allow close
   *   }}
   * />
   * ```
   */
  onBeforeClose?: () => boolean | void;

  /**
   * Callback when the sheet snap point changes.
   * Called on every snap point change, including open/close.
   * @param index - Current snap point index (-1 when closed)
   */
  onChange?: (index: number) => void;

  /** Close sheet when backdrop is tapped. Default: true */
  closeOnBackdrop?: boolean;

  /** Enable swipe down to close. Default: true */
  enablePanDownToClose?: boolean;

  /**
   * Dismiss the sheet when Android hardware back or predictive back is pressed.
   * When `true` (default), the back event is consumed while the sheet is open so
   * navigation does not pop underneath. Respects `onBeforeClose` — return `false`
   * there to block dismiss while still consuming the event. iOS no-op.
   * Default: true
   */
  dismissOnAndroidBack?: boolean;

  /**
   * Spring animation style for open/close/snap transitions.
   * - `'bouncy'` (default): slight overshoot on settle — matches v1 default feel
   * - `'smooth'`: subtle spring with minimal bounce
   * - `'fast'`: snappy, overdamped transition
   *
   * Overridden by reduced-motion accessibility preference.
   */
  animationPreset?: EtBottomSheetAnimationPreset;

  /**
   * Behavior when presenting this sheet while another modal is already presented.
   * - `'switch'` (default): minimize the previous modal (slides off-screen) and
   *   restore it when this one dismisses. Suited to sheet-to-sheet navigation
   *   where the second sheet replaces the first in the user's focus.
   * - `'push'`: stack on top of the previous modal without minimizing it; the
   *   underlying sheet stays presented (visible behind the backdrop). Use this
   *   for tooltip / info sub-sheets opened from within another sheet — keeps
   *   the parent sheet's state untouched and avoids spurious dismiss events.
   * - `'replace'`: fully dismiss the previous modal before presenting this one.
   *   The previous sheet's `onClose` fires; it is not restored on dismiss.
   *
   * Default: `'switch'` (matches `@gorhom/bottom-sheet` default).
   */
  stackBehavior?: 'replace' | 'push' | 'switch';

  /**
   * @deprecated No longer needed. On iOS the sheet now renders inside
   * `FullWindowOverlay` by default, so it already presents above native stack
   * `fullScreenModal` screens. Kept for backwards compatibility; passing it has
   * no additional effect. Use `disableFullWindowOverlay` to opt out.
   */
  presentAboveNativeModals?: boolean;

  /**
   * iOS escape hatch: when true, the gorhom portal uses the default container
   * instead of `FullWindowOverlay`. No-op on Android.
   *
   * By default the sheet renders inside `FullWindowOverlay` on iOS, which keeps
   * it above native modals AND avoids the New Architecture (Fabric) crash
   * `RCTComponentViewRegistry: Attempt to recycle a mounted view` that occurs
   * when another animated overlay (a visible toast/BlurView or a second stacked
   * sheet) mounts in the same transaction.
   *
   * Only set this if you have a concrete reason (e.g. inspecting the sheet with
   * the RN dev inspector, which renders beneath `FullWindowOverlay`).
   * Default: false.
   */
  disableFullWindowOverlay?: boolean;

  /** Enable content panning gesture interaction. Default: true */
  enableContentPanningGesture?: boolean;

  /** Enable handle panning gesture interaction. Default: true */
  enableHandlePanningGesture?: boolean;

  /**
   * Enable over-dragging the sheet beyond its snap points.
   * When true, user can drag past the top/bottom limits with resistance.
   * Provides a more natural, elastic feel.
   * Default: true
   */
  enableOverDrag?: boolean;

  /**
   * Resistance factor when over-dragging beyond snap points.
   * Higher values = more resistance (harder to over-drag).
   * Lower values = less resistance (easier to over-drag).
   * Default: 2.5
   */
  overDragResistanceFactor?: number;

  /**
   * Detach the sheet from the bottom of the screen.
   * When true, creates a floating modal that can be positioned anywhere.
   * Useful for centered dialogs or custom positioning.
   * Default: false
   */
  detached?: boolean;

  /**
   * Callback fired when the sheet is about to animate to a new position.
   * Useful for coordinating other UI animations with sheet movement.
   *
   * @param fromIndex - Starting snap point index
   * @param toIndex - Target snap point index
   * @param fromPosition - Starting position in pixels (useful for custom animations)
   * @param toPosition - Target position in pixels (useful for custom animations)
   *
   * @example Coordinate header opacity with sheet position
   * ```tsx
   * onAnimate={(fromIndex, toIndex, fromPosition, toPosition) => {
   *   // Use position values for smooth parallax effects
   *   console.log(`Animating from ${fromPosition}px to ${toPosition}px`);
   * }}
   * ```
   */
  onAnimate?: (fromIndex: number, toIndex: number, fromPosition: number, toPosition: number) => void;

  // ============================================================================
  // Animation Shared Values (Advanced)
  // ============================================================================

  /**
   * Animated shared value representing the current snap point index.
   * Use this to coordinate external animations with sheet movement.
   *
   * @example Fade header based on snap point
   * ```tsx
   * const animatedIndex = useSharedValue(0);
   * const headerStyle = useAnimatedStyle(() => ({
   *   opacity: interpolate(animatedIndex.value, [-1, 0, 1], [0, 0.5, 1]),
   * }));
   *
   * <EtBottomSheet animatedIndex={animatedIndex} ... />
   * <Animated.View style={headerStyle}>...</Animated.View>
   * ```
   */
  animatedIndex?: SharedValue<number>;

  /**
   * Animated shared value representing the current position in pixels.
   * Use this for precise position-based animations like parallax effects.
   *
   * @example Parallax background effect
   * ```tsx
   * const animatedPosition = useSharedValue(0);
   * const backgroundStyle = useAnimatedStyle(() => ({
   *   transform: [{ translateY: animatedPosition.value * 0.5 }],
   * }));
   *
   * <EtBottomSheet animatedPosition={animatedPosition} ... />
   * <Animated.View style={backgroundStyle}>...</Animated.View>
   * ```
   */
  animatedPosition?: SharedValue<number>;

  /**
   * Scroll handler forwarded to the underlying `BottomSheetScrollView` when the content is
   * scrollable (`EtBottomSheet.Content` composed with a scrollable child). No-op for static or
   * virtualized-list content.
   *
   * Must be a **plain JS callback**, not a Reanimated `useAnimatedScrollHandler` worklet —
   * `BottomSheetScrollView` always invokes this via `runOnJS` internally (see gorhom's
   * `useScrollHandler`), so passing a worklet handler throws
   * `[Worklets] Attempted to extract from an Object that wasn't converted to a Serializable`.
   * Reanimated `SharedValue`s can still be updated from inside this plain callback (`.value = ...`
   * works from the JS thread too); it just won't run on the UI thread like a true worklet handler.
   *
   * @example Drive a footer fade from remaining scroll distance
   * ```tsx
   * const footerShadow = useSharedValue(0);
   * const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
   *   const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent;
   *   footerShadow.value = Math.max(contentSize.height - layoutMeasurement.height - contentOffset.y, 0);
   * };
   *
   * <EtBottomSheet bottomSheetRef={ref} onScroll={handleScroll}>
   *   <EtBottomSheet.Content scrollable>...</EtBottomSheet.Content>
   *   <EtScrollHeaderFade edge="top" scrollY={footerShadow} />
   *   <EtBottomSheet.Footer>...</EtBottomSheet.Footer>
   * </EtBottomSheet>
   * ```
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /**
   * Forwarded to the underlying `BottomSheetScrollView.onContentSizeChange` (plain `ScrollView`
   * prop, not intercepted by gorhom like `onScroll` is). Fires as soon as the scrollable content
   * mounts/resizes — use together with `onScrollViewLayout` to compute an initial "remaining
   * scroll distance" (e.g. for `EtScrollHeaderFade`) without waiting for the user's first scroll.
   * No-op for static or virtualized-list content.
   */
  onContentSizeChange?: (width: number, height: number) => void;

  /**
   * Forwarded to the underlying `BottomSheetScrollView.onLayout` — reports the scroll viewport's
   * own size (not the content's; use `onContentSizeChange` for that). See `onContentSizeChange`.
   * No-op for static or virtualized-list content.
   */
  onScrollViewLayout?: (event: LayoutChangeEvent) => void;

  // ============================================================================
  // Keyboard Configuration
  // ============================================================================

  /**
   * Defines the keyboard appearance behavior.
   * - 'extend': extend the sheet to its maximum snap point
   * - 'fillParent': extend the sheet to fill the parent view
   * - 'interactive': offset the sheet by the size of the keyboard (default)
   */
  keyboardBehavior?: 'extend' | 'fillParent' | 'interactive';

  /**
   * Defines the keyboard blur behavior.
   * - 'none': do nothing (default)
   * - 'restore': restore sheet position
   */
  keyboardBlurBehavior?: 'none' | 'restore';

  /**
   * Automatically dismiss keyboard when user starts dragging the sheet.
   * Improves UX by hiding keyboard during gesture interactions.
   * Default: false
   */
  enableBlurKeyboardOnGesture?: boolean;

  /**
   * Android-only: Defines how the window adjusts when keyboard appears.
   * - 'adjustPan': pan the window to keep focused input visible (default)
   * - 'adjustResize': resize the window to make room for keyboard
   * Default: 'adjustPan'
   */
  android_keyboardInputMode?: 'adjustPan' | 'adjustResize';

  // ============================================================================
  // Appearance Configuration
  // ============================================================================

  /** Show drag handle indicator at top. Default: true */
  showHandle?: boolean;

  /**
   * Backdrop configuration.
   * The backdrop is **enabled by default** even when this prop is undefined.
   * To disable the backdrop, pass `{ enabled: false }`.
   *
   * @example Disable backdrop
   * ```tsx
   * <EtBottomSheet backdrop={{ enabled: false }} ... />
   * ```
   *
   * @example Custom backdrop press handler
   * ```tsx
   * <EtBottomSheet backdrop={{ onPress: () => console.log('Backdrop pressed') }} ... />
   * ```
   */
  backdrop?: BackdropConfig;

  /**
   * Custom style for the sheet container.
   * Useful for adding shadows.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the sheet background.
   * Use with caution - prefer theme colors.
   */
  backgroundStyle?: StyleProp<ViewStyle>;

  /**
   * Overrides the sheet surface color. Applied consistently to the background fill,
   * the rounded handle top, and the sticky footer so there is no visible seam.
   * Defaults to the `bgNeutralTertiary` theme token. Has no effect on `variant="glass"`.
   * Prefer a theme token (e.g. `colors.backgroundShell`) over a raw hex value.
   */
  backgroundColor?: string;

  // ============================================================================
  // State Configuration
  // ============================================================================

  /**
   * Visual variant of the sheet.
   * - `'default'`: Solid opaque background (default).
   * - `'glass'`: Frosted glass effect using BlurView, transparent handle.
   */
  variant?: 'default' | 'glass';

  /** Show loading spinner in content area */
  loading?: boolean;

  // ============================================================================
  // Accessibility Configuration
  // ============================================================================

  /** Accessibility label for the sheet */
  accessibilityLabel?: string;

  /**
   * Whether the sheet container is a single accessibility element.
   * Gorhom defaults this to `true` (Adjustable), which collapses footer CTAs
   * into non-hittable children on iOS. Pass `false` when the sheet has its own
   * interactive controls that must remain individually accessible / tappable.
   */
  accessible?: boolean;

  /**
   * Test ID for testing.
   * Applied to the content container (BottomSheetView or BottomSheetScrollView),
   * not the modal wrapper itself.
   *
   * @default 'et-bottom-sheet'
   */
  testID?: string;
}
