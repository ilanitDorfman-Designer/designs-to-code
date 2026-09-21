import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface EtAppLayoutProps {
  /** SideMenu | TopPanel | Main | Aside slot children. */
  children: ReactNode;
  /** Applied to the root row. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Hosts the shell's composed `EtSideMenu` — wiring stays app-side (kit-dumb / shell-smart). */
export interface EtAppLayoutSideMenuProps {
  children: ReactNode;
  /**
   * Label for the `navigation` landmark the skeleton stamps on this slot
   * (`EtSideMenu` itself carries no landmark — nesting two would double it
   * up in the AT landmark list). Defaults to 'Main navigation'; the shell
   * passes translated copy.
   */
  accessibilityLabel?: string;
}

/** Hosts the shell's composed `EtTopPanel`. */
export interface EtAppLayoutTopPanelProps {
  children: ReactNode;
}

/** The navigator / screen — the one required slot. */
export interface EtAppLayoutMainProps {
  children: ReactNode;
}

/**
 * What caused an aside `onExpandedChange` (analytics routing; the shell adds
 * `breakpoint-default` itself). Mirrors the side menu's `SideMenuCloseReason` —
 * a keyboard dismiss is not a button press and must not be reported as one.
 */
export type AppLayoutAsideTrigger = 'button' | 'rail' | 'escape';

/**
 * The controlled rail/panel machine. `children` is the whole content-injection
 * contract — the kit stays content-agnostic. The kit senses its own geometry
 * (width tier, overlay/inline mode, sub-768 self-suppression) via breakpoint
 * hooks; the shell owns state, analytics, and the 1440 breakpoint-default
 * effect (`expanded := isInline` on every crossing — the kit's snap-on-crossing
 * relies on that reset).
 */
export interface EtAppLayoutAsideProps {
  children: ReactNode;
  /** Fully controlled — the kit holds no expanded state. */
  expanded: boolean;
  /** Fires from the toggle button (both directions), a rail-body press (expand only), or Escape (close only). */
  onExpandedChange: (expanded: boolean, trigger: AppLayoutAsideTrigger) => void;
  /** Toggle + rail labels; default 'Expand panel' / 'Collapse panel'. */
  toggleAccessibilityLabels?: { expand?: string; collapse?: string };
  /** Emitted on the placeholder; suffixed `-surface` / `-rail` / `-panel` / `-toggle` on the machine parts. */
  testID?: string;
}

// ========== Internal contracts (not part of the public surface) ==========

/** `__SLOT_TYPE` static values. */
export type AppLayoutSlotType = 'side-menu' | 'top-panel' | 'main' | 'aside';

/** Result of `useAppLayoutChildren` slot classification. */
export interface AppLayoutChildrenSlots {
  sideMenuChild: ReactNode | undefined;
  topPanelChild: ReactNode | undefined;
  mainChild: ReactNode | undefined;
  asideChild: ReactNode | undefined;
}

export interface UseAsideAnimationOptions {
  expanded: boolean;
  /** `useBreakpoint(BREAKPOINT_ASIDE_INLINE)` — a flip snaps geometry instead of animating. */
  isInline: boolean;
  railHovered: boolean;
  reducedMotion: boolean;
}

export interface UseAsideAnimationResult {
  /** 0 rail … 1 panel — the single animation driver. */
  progress: SharedValue<number>;
  /** Reduced-motion 80ms fade driver. */
  crossfade: SharedValue<number>;
  /** 1 expanding / 0 collapsing — worklets pick direction-aware windows by it. */
  isExpanding: SharedValue<number>;
  /** Closed-rail surface width 60 ↔ 68 (hover affordance; never reflows main). */
  hoverWidth: SharedValue<number>;
  /** Measured surface height (root `onLayout`) — vertical anchor for the toggle's rail-centered position. */
  surfaceHeight: SharedValue<number>;
}
