import type { ReactNode, RefObject } from 'react';
import type { StyleProp, View, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { IconName } from '../../../et-icon-v2/api/types';

/** Shell breakpoint tier from `useBreakpointTier(SHELL_TIERS)`: -1 hidden, 0/1/2 visible rail widths. */
export type SideMenuTier = -1 | 0 | 1 | 2;

/** What caused the expanded panel to close (analytics + focus-restore routing). */
export type SideMenuCloseReason = 'toggle' | 'outside' | 'escape' | 'focusout' | 'item';

export interface EtSideMenuProps {
  /** From `useBreakpointTier(SHELL_TIERS)` — the kit never measures the window itself. */
  tier: SideMenuTier;
  /** Fully controlled — the kit holds no expanded state. */
  expanded: boolean;
  onExpandedChange: (expanded: boolean, reason: SideMenuCloseReason | 'open') => void;
  activeItemId?: string;
  onItemPress?: (id: string) => void;
  /** Header | Profile | Tile | Section | Footer slot children. */
  children: ReactNode;
  /** Applied to the in-flow placeholder root only. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface EtSideMenuHeaderProps {
  /** Shell passes `<EtoroWordmark size={WORDMARK_GLYPH_HEIGHT} />` (exported constant). */
  logo?: ReactNode;
  /** Per-instance toggle labels; default 'Expand menu' (rail) / 'Collapse menu' (panel). */
  toggleAccessibilityLabels?: { expand?: string; collapse?: string };
  /** Emitted layer-suffixed: `{testID}-rail` (rail toggle) / `{testID}-panel` (panel row). */
  testID?: string;
}

export interface EtSideMenuProfileProps {
  /** Shell passes `<EtAvatar size="medium" shape="square" …>`. */
  avatar: ReactNode;
  name?: string;
  handle?: string;
  /** No-op in v1 by design. */
  onPress?: () => void;
  /** Rendered in both layers — emitted as `{testID}-rail` / `{testID}-panel`. */
  testID?: string;
}

export interface EtSideMenuSectionProps {
  /** "More" — rendered only when `secondary` and expanded. */
  label?: string;
  /** Secondary ⇒ hidden in rail, 40px icon+label rows in panel. */
  secondary?: boolean;
  /** `EtSideMenu.Item` elements. */
  children: ReactNode;
  /** Rendered in both layers — emitted as `{testID}-rail` / `{testID}-panel`. */
  testID?: string;
}

export interface EtSideMenuItemProps {
  id: string;
  /** ALWAYS required — the rail cell uses it as accessibility label. */
  label: string;
  /** Rail cells, secondary rows and the footer; expanded primary rows are text-only regardless. */
  icon?: IconName;
  /** Optional icon tint; defaults to `carbon900`. */
  iconColor?: string;
  /** Future counters slot; renders after the label in the panel. */
  badge?: ReactNode;
  disabled?: boolean;
  /** Rendered in both layers — emitted as `{testID}-rail` / `{testID}-panel`. */
  testID?: string;
}

export interface EtSideMenuFooterProps {
  children: ReactNode;
  testID?: string;
}

export interface EtSideMenuTileProps {
  /** Leading glyph on the title line (e.g. `star` for the Club tile). */
  icon?: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  /** Renders the tile's skeleton footprint instead of content. */
  loading?: boolean;
  /** Emitted as `{testID}-panel` (`{testID}-skeleton` while loading); invisible in the rail. */
  testID?: string;
}

export interface EtSideMenuTriggerProps {
  onPress: () => void;
  /** Defaults to 'Open menu'. */
  accessibilityLabel?: string;
  testID?: string;
}

// ========== Contexts (internal — not part of the public surface) ==========

/** Minimal focusable handle (web DOM node behind an RNW ref). */
export interface SideMenuFocusHandle {
  focus?: () => void;
}

/** Static per-mount configuration (rare re-renders). */
export interface SideMenuConfigContextValue {
  tier: SideMenuTier;
  /** `railWidthForTier(tier)`. */
  railWidth: number;
  activeItemId?: string;
  onItemPress?: (id: string) => void;
  reducedMotion: boolean;
  /**
   * Registers the panel-layer Header toggle as the focus-on-open target (web
   * only); call with `null` to clear. A setter (not a raw ref) so consumers
   * never mutate context-provided objects (react-compiler contract).
   */
  setInitialFocus: (handle: SideMenuFocusHandle | null) => void;
}

/** Dynamic state (changes on toggle interaction). */
export interface SideMenuStateContextValue {
  expanded: boolean;
  /** 0 rail … 1 panel — the single animation driver. */
  progress: SharedValue<number>;
  /** Reduced-motion 80ms fade driver. */
  crossfade: SharedValue<number>;
  /** 1 expanding / 0 collapsing — worklets pick direction-aware windows by it. */
  isExpanding: SharedValue<number>;
  toggle: () => void;
  requestClose: (reason: SideMenuCloseReason) => void;
}

/** Which mounted layer a subtree renders in (children are rendered twice). */
export type SideMenuLayer = 'rail' | 'panel';

// ========== Internal contracts for root / subcomponents / hooks (next stage) ==========

/** `__SLOT_TYPE` static values (`Item` carries none — classified by its parent Section). */
export type SideMenuSlotType = 'header' | 'profile' | 'tile' | 'section' | 'footer';

/** Result of `useSideMenuChildren` slot classification. */
export interface SideMenuChildrenSlots {
  headerChild: ReactNode | undefined;
  profileChild: ReactNode | undefined;
  tileChild: ReactNode | undefined;
  sectionChildren: ReactNode[];
  footerChild: ReactNode | undefined;
}

export interface UseSideMenuAnimationOptions {
  expanded: boolean;
  tier: SideMenuTier;
  reducedMotion: boolean;
}

export interface UseSideMenuAnimationResult {
  progress: SharedValue<number>;
  crossfade: SharedValue<number>;
  isExpanding: SharedValue<number>;
}

export interface UseSideMenuWebCloseOptions {
  expanded: boolean;
  surfaceRef: RefObject<View | null>;
  requestClose: (reason: SideMenuCloseReason) => void;
  /** Panel-layer Header toggle handle — focused on open; the opener is captured/restored around it. */
  initialFocusRef: { current: SideMenuFocusHandle | null };
}
