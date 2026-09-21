import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { FlashListProps } from '@shopify/flash-list';
import React, { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { EntryOrExitLayoutType, SharedValue } from 'react-native-reanimated';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

import type { EtButtonProps } from '../../button/utils/types';

// ============================================================================
// Animation Types
// ============================================================================

export type HeaderAnimationType = 'fade' | 'collapse' | 'none';

// ============================================================================
// TopBar Configuration
// ============================================================================

/**
 * Animation options for scroll-driven TopBar animations.
 */
export interface TopBarAnimationOptions {
  /**
   * Minimum scroll distance in pixels to trigger direction change.
   * Higher values prevent micro-bounces but feel less responsive.
   * @default 5
   */
  threshold?: number;
  /**
   * Duration of direction-based animations in milliseconds.
   * @default 300
   */
  animationDuration?: number;
  /**
   * Minimum scroll position before animations start.
   * Ensures the header stays expanded when at the top of the content.
   * @default 10
   */
  minScrollPosition?: number;
  /**
   * Enable direction tracking for custom child animations.
   * @default true
   */
  enableDirectionTracking?: boolean;
}

/**
 * Props for EtScreen.TopBar configuration.
 *
 * Slot names (start, end) align with EtTopbar's compound component API.
 *
 * The TopBar has three main sections:
 * - **Start**: Leading content (back button for inner screens, menu for root screens)
 * - **Middle**: Centered content (typically a title)
 * - **End**: Trailing content (action buttons)
 */
export interface EtScreenTopBarProps {
  // ============================================================================
  // Screen Type
  // ============================================================================

  /**
   * Whether this is an inner/detail screen.
   *
   * Controls the default left content when no custom `left` is provided:
   * - `true`: Shows back button (navigates back)
   * - `false`: Shows menu button (opens drawer)
   *
   * @default false
   */
  isInnerScreen?: boolean;

  // ============================================================================
  // Slots (aligned with EtTopbar.Start / EtTopbar.Middle / EtTopbar.End)
  // ============================================================================

  /**
   * Custom content for the start (leading) side of the TopBar.
   * When not provided, a default button is shown based on `isInnerScreen`.
   */
  start?: React.ReactNode;

  /**
   * Centered content between Start and End (typically a title).
   * Absolutely positioned and centered, so it won't push Start/End apart.
   */
  middle?: React.ReactNode;

  /**
   * Custom content for the end (trailing) side of the TopBar.
   */
  end?: React.ReactNode;

  // ============================================================================
  // Visual Settings
  // ============================================================================

  /**
   * Whether to apply blur effect to the TopBar background.
   * @default true
   */
  blurEffect?: boolean;

  /**
   * Whether the TopBar background should be transparent.
   * Useful for screens with halo/gradient backgrounds where the header should blend in.
   * @default false
   */
  transparent?: boolean;

  /**
   * Bottom sheet reference for advanced modal interactions.
   */
  bottomSheetRef?: React.RefObject<BottomSheetModal>;

  // ============================================================================
  // Animation Settings (only applies when inside EtScreen.ScrollView)
  // ============================================================================

  /**
   * Animation type for the top bar during scroll.
   * - 'collapse': Top bar slides up/down based on scroll direction
   * - 'fade': Top bar fades in/out based on scroll direction
   * - 'none': No animation, top bar remains static
   * @default 'collapse'
   */
  animation?: HeaderAnimationType;

  /**
   * Animation options for scroll-driven animations.
   */
  animationOptions?: TopBarAnimationOptions;

  /**
   * External scroll position shared value for syncing animations.
   */
  externalScrollY?: SharedValue<number>;

  /**
   * Optional style overrides applied to the TopBar container.
   * Useful for customising the background color or padding for a single screen.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * When `true`, the topbar is rendered as raw content ({@link rawContent}) instead of being
   * composed via {@link start} / {@link middle} / {@link end}.
   * Set by `<EtScreen.TopBar raw>` — consumers should not set this directly.
   * @default false
   */
  raw?: boolean;

  /**
   * Raw body of the topbar when {@link raw} is `true`. Rendered directly inside the
   * absolute, status-bar-padded header strip. Useful for host-owned nav bars (e.g. the
   * app's `<TopNavBar />`).
   */
  rawContent?: React.ReactNode;
}

// ============================================================================
// EtScreen Props (Root Container)
// ============================================================================

/**
 * Props for EtScreen - The root screen container.
 *
 * Extends SafeAreaViewProps for full native API access.
 *
 * @example Basic usage
 * ```tsx
 * <EtScreen gradient>
 *   <EtScreen.TopBar />
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 */
export interface EtScreenProps extends SafeAreaViewProps {
  /** Children - typically EtScreen.TopBar, EtScreen.ScrollView, or EtScreen.View */
  children: ReactNode;
  /** Whether to apply gradient background */
  gradient?: boolean;
  /** Animation configuration for entering */
  entering?: EntryOrExitLayoutType;
  /** Animation configuration for exiting */
  exiting?: EntryOrExitLayoutType;
  /**
   * Whether to animate the halo background based on scroll position.
   * Syncs with global scroll context for drawer integration.
   */
  animateHalo?: boolean;
}

// ============================================================================
// EtScreen.ScrollView Props
// ============================================================================

/** Props for `EtScreen.ScrollView`. See `screen/AGENTS.md` for usage. */
export interface EtScreenScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  /**
   * Auto-scroll the focused `TextInput` above the soft keyboard.
   * Requires `<KeyboardProvider>` higher in the tree.
   * @default false
   */
  keyboardAware?: boolean;
  /**
   * Distance (px) between the focused input and the keyboard. Ignored when `keyboardAware` is false.
   * @default 24
   */
  keyboardBottomOffset?: number;
  /**
   * Forwarded to the underlying scroll view (React 19 ref-as-prop). Lets callers
   * drive imperative scrolls on the host surface (e.g. a Reanimated `scrollTo`
   * via `useAnimatedRef`). Additive — ref-less consumers are unaffected.
   */
  ref?: React.Ref<ScrollView>;
}

// ============================================================================
// EtScreen.View Props
// ============================================================================

/**
 * Props for EtScreen.View - Static content container.
 *
 * Extends ViewProps for full native API access.
 * Use this for screens with their own custom scrollable content.
 * For virtualized lists, prefer EtScreen.FlashList instead.
 */
export interface EtScreenViewProps extends ViewProps {
  children: ReactNode;
}

// ============================================================================
// EtScreen.FlashList Props
// ============================================================================

/**
 * Props for EtScreen.FlashList - Virtualized list container.
 *
 * Extends FlashListProps for full @shopify/flash-list API access.
 * Automatically handles scroll tracking for TopBar animations and header padding.
 *
 * `renderScrollComponent` is omitted because EtScreen.FlashList injects
 * Reanimated's Animated.ScrollView internally when TopBar animations are active.
 */
export type EtScreenFlashListProps<T> = Omit<FlashListProps<T>, 'renderScrollComponent'>;

// ============================================================================
// EtScreen.Content — Scrollable content layout with slots
// ============================================================================

export type EtScreenContentProps = ViewProps;

export type EtScreenContentAlignment = 'left' | 'center' | 'right';

export type EtScreenContentAlignedItemProps = {
  alignment?: EtScreenContentAlignment;
  style?: StyleProp<ViewStyle>;
};

export type EtScreenContentTitleProps = EtScreenContentAlignedItemProps & {
  children: string;
  /** Text variant for the title. Defaults to `display-main` (28px); use `display-compact` for 24px titles. */
  variant?: 'display-main' | 'display-compact';
};

export type EtScreenContentSubtitleProps = EtScreenContentAlignedItemProps & {
  children: string;
};

export type EtScreenContentDisclaimerProps = EtScreenContentAlignedItemProps & {
  children: string;
};

export type EtScreenContentBodyProps = EtScreenContentAlignedItemProps & {
  children?: ReactNode;
};

// ============================================================================
// EtScreen.Footer — Footer with button presets (inline by default, sticky opt-in)
// ============================================================================

export type EtScreenFooterProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * When true, wraps the footer in SafeAreaView for sticky bottom placement.
   * Use as a sibling of EtScreen.ScrollView when the footer must stay pinned.
   * When false (default), renders inline without SafeAreaView — suitable for
   * placement inside EtScreen.ScrollView where the footer scrolls with content.
   * @default false
   */
  sticky?: boolean;
};

export type EtScreenFooterButtonProps = EtButtonProps & {
  /**
   * Optional reanimated entering animation. When provided (or `exiting`), the
   * button is wrapped in an `Animated.View` so the animation can play.
   */
  entering?: EntryOrExitLayoutType;
  /**
   * Optional reanimated exiting animation. When provided (or `entering`), the
   * button is wrapped in an `Animated.View` so the animation can play.
   */
  exiting?: EntryOrExitLayoutType;
};

// ============================================================================
// Context Types
// ============================================================================

/**
 * Internal context value for EtScreen compound component.
 */
export interface ScreenContextValue {
  // TopBar state (set by EtScreen.TopBar)
  topBarConfig: EtScreenTopBarProps | null;
  registerTopBar: (config: EtScreenTopBarProps) => void;
  unregisterTopBar: () => void;

  // Header state (set by EtScreen.Header)
  headerContent: ReactNode | null;
  registerHeader: (content: ReactNode) => void;
  unregisterHeader: () => void;

  // TopBar-only height (EtTopbar + safe area insets, without extended header)
  topBarHeight: number;
  topBarHeightShared: SharedValue<number>;
  setTopBarHeight: (height: number) => void;

  // Combined header area height (TopBar + extended header)
  headerAreaHeight: number;
  headerAreaHeightShared: SharedValue<number>;
  setHeaderAreaHeight: (height: number) => void;

  // Whether the extended header should collapse with the TopBar
  collapseHeaderWithTopBar: boolean;
  setCollapseHeaderWithTopBar: (value: boolean) => void;

  // Scroll state (set by EtScreen.ScrollView)
  scrollY: SharedValue<number>;
  scrollBottomDistance: SharedValue<number>;
  direction: SharedValue<number>;

  // Animation settings
  animateHalo: boolean;

  // Computed values
  shouldShowTopBar: boolean;
  hasScrollView: boolean;
  setHasScrollView: (value: boolean) => void;

  /**
   * Whether the screen has a registered `<EtScreenOverlay>` child. Used by the screen
   * container to drop the top safe-area edge (so the overlay can reach the physical screen top)
   * and by {@link EtScreenV2Inner} to substitute a status-bar inset when no topbar is registered.
   *
   * This is a coarse mount/unmount toggle on purpose. The live overlay node lives on a separate
   * internal context (`OverlayContentContext`) so its identity churn does not invalidate this
   * value — that separation is what prevents the registration loop on screens that consume both
   * `useScreenContext()` and the overlay slot (e.g. portfolio, watchlist).
   */
  hasOverlay: boolean;

  registerOverlay: (content: ReactNode) => void;
  unregisterOverlay: () => void;
}
