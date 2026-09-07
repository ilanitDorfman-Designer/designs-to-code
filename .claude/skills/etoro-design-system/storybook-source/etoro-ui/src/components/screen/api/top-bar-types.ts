import { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { TopBarAnimationOptions } from './types';

// ============================================================================
// TopBar Compound Component Types
// ============================================================================

/**
 * Props for EtScreen.TopBar root component.
 * Container that manages TopBar subcomponents via context.
 */
export interface EtScreenTopBarRootProps {
  /** Child subcomponents (Start, Middle, End) — OR, when {@link raw} is `true`, the entire TopBar
   * body rendered directly inside the screen's header strip (e.g. a host `<TopNavBar />`). */
  children?: ReactNode;
  /** Whether this is an inner/detail screen (affects default leading button) */
  isInnerScreen?: boolean;
  /** Animation type for the top bar during scroll */
  animation?: 'fade' | 'collapse' | 'none';
  /** Animation options for scroll-driven animations */
  animationOptions?: TopBarAnimationOptions;
  /** Whether to apply blur effect to the TopBar background */
  blurEffect?: boolean;
  /** Whether the TopBar background should be transparent */
  transparent?: boolean;
  /** Optional style overrides applied to the TopBar container (e.g. backgroundColor). */
  style?: StyleProp<ViewStyle>;
  /**
   * Escape hatch: when `true`, children are rendered directly inside the topbar strip
   * (status-bar-padded, absolutely-positioned wrapper) instead of being composed via the
   * Start/Middle/End slots + `EtTopbar`. Use for host-owned nav bars that already render
   * their own `EtTopbar` (e.g. the app's `<TopNavBar />`) and want to live inside the V2
   * screen shell so overlays + safe-area edges behave correctly.
   *
   * When set, the slot-based `Start/Middle/End` subcomponents are ignored.
   * @default false
   */
  raw?: boolean;
}

/**
 * Props for EtScreen.TopBar.Start subcomponent.
 * Registers content for the leading (start) side of the TopBar.
 * When not provided, a default back button (inner screens) or menu button
 * (root screens) is shown based on the `isInnerScreen` prop.
 */
export interface TopBarStartProps {
  children: ReactNode;
}

/**
 * Props for EtScreen.TopBar.Middle subcomponent.
 * Registers centered content (typically a title) between Start and End slots.
 */
export interface TopBarMiddleProps {
  children: ReactNode;
}

/**
 * Props for EtScreen.TopBar.End subcomponent.
 * Registers content for the trailing (end) side of the TopBar.
 */
export interface TopBarEndProps {
  children: ReactNode;
}

// ============================================================================
// TopBar Context Types
// ============================================================================

/**
 * State portion of TopBar context.
 * Contains registered components that can trigger re-renders.
 */
export interface TopBarStateContextValue {
  /** Registered start slot content */
  start: ReactNode | null;
  /** Registered middle slot content */
  middle: ReactNode | null;
  /** Registered end slot content */
  end: ReactNode | null;
}

/**
 * Actions portion of TopBar context.
 * Stable functions that don't trigger re-renders.
 */
export interface TopBarActionsContextValue {
  registerStart: (component: ReactNode) => void;
  registerMiddle: (component: ReactNode) => void;
  registerEnd: (component: ReactNode) => void;

  unregisterStart: () => void;
  unregisterMiddle: () => void;
  unregisterEnd: () => void;
}

/**
 * Combined TopBar context value (for legacy compatibility).
 * Prefer using TopBarStateContextValue and TopBarActionsContextValue separately.
 */
export interface TopBarContextValue extends TopBarStateContextValue, TopBarActionsContextValue {}
