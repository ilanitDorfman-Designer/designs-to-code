import { BREAKPOINT_DESKTOP, BREAKPOINT_DESKTOP_L, BREAKPOINT_DESKTOP_M, BREAKPOINT_DESKTOP_S } from '../../../core/styles/breakpoints';
import { X2, X3, X4, X5, X6, X8, X9, X15, X17 } from '../../../core/styles/spacing';

// ========== Aside geometry ==========

/**
 * Width tiers for the open aside panel, consumed via
 * `useBreakpointTier(ASIDE_WIDTH_TIERS)` — kit-internal, NOT `SHELL_TIERS`
 * (that array index-couples to the shipped `SideMenuTier` API).
 */
export const ASIDE_WIDTH_TIERS = [BREAKPOINT_DESKTOP, BREAKPOINT_DESKTOP_S, BREAKPOINT_DESKTOP_M, BREAKPOINT_DESKTOP_L] as const;

/** Open-panel width per tier from `useBreakpointTier(ASIDE_WIDTH_TIERS)`, offset +1 (tier -1 = 768–1023). Design constants, not tokenized. */
export const PANEL_WIDTH_BY_TIER = [344, 360, 368, 376, 384] as const;
export const panelWidthForTier = (tier: number): number => PANEL_WIDTH_BY_TIER[tier + 1];

export const RAIL_WIDTH = X15; // 60 — closed rail, all tiers
export const RAIL_HOVER_WIDTH = X17; // 68 — hover widens the surface only (never reflows main)

/** Gap main ↔ aside, keyed to the overlay/inline flip at `BREAKPOINT_ASIDE_INLINE`. */
export const ASIDE_GAP_OVERLAY = X2; // 8
export const ASIDE_GAP_INLINE = X3; // 12

/**
 * How much width the frame's own columns take out of the window: the side-menu
 * rail plus the aside's in-flow placeholder and its gap.
 *
 * The frame is the only thing that knows these numbers, so it is the only thing
 * that should do this subtraction — a screen that measures the window instead is
 * 140–156px out at 1024–1439 and up to ~480px out at ≥1440. Mirrors
 * `useAsidePlaceholderStyle`: the placeholder is the rail width until the aside
 * goes in-flow and opens.
 */
export function frameOccupiedWidth(options: {
  /** Side-menu rail width for the current tier — `railWidthForTier(tier)`, 0 where the rail is hidden. */
  railWidth: number;
  /** Absent when the route has no aside; the frame's slot is then empty. */
  aside: 'absent' | 'collapsed' | 'expanded';
  /** At/above `BREAKPOINT_ASIDE_INLINE` the open aside sits in flow and main reflows around it. */
  asideInline: boolean;
  /** Open-panel width for the current aside tier — `panelWidthForTier(useBreakpointTier(ASIDE_WIDTH_TIERS))`. */
  asidePanelWidth: number;
}): number {
  const { railWidth, aside, asideInline, asidePanelWidth } = options;
  if (aside === 'absent') return railWidth;
  const asideWidth = asideInline && aside === 'expanded' ? asidePanelWidth : RAIL_WIDTH;
  return railWidth + (asideInline ? ASIDE_GAP_INLINE : ASIDE_GAP_OVERLAY) + asideWidth;
}

// ========== Surface chrome ==========

/** Start corners only — end corners square, flush to the viewport end edge; identical in every state. */
export const PANEL_START_RADIUS = X4; // 16
export const PANEL_PADDING = X8; // 32 — open-panel content frame, all sides
/** Elevation cast over main content in EVERY state (Figma); the x-offset sign follows layout direction. */
export const surfaceShadow = (dirSign: number): string => `${dirSign * -4}px 14px 20px rgba(0, 0, 0, 0.24)`;

// ========== Toggle ==========

export const TOGGLE_SIZE = X9; // 36 — EtButton Ghost/Small box per Figma Code Connect
export const TOGGLE_ICON_SIZE = X5; // 20 — glyph inside the toggle
export const TOGGLE_RAIL_END = (RAIL_WIDTH - TOGGLE_SIZE) / 2; // 12 — centered in the closed rail
export const TOGGLE_OPEN_TOP = X6; // 24 — open-panel position, off the X8 padding grid in Figma
export const TOGGLE_OPEN_END = 21; // off-scale, hardcoded in Figma (360 − 303 − 36)

/** Kit a11y fallbacks for the rail AND the toggle — one source so the two can never announce differently. */
export const DEFAULT_TOGGLE_LABELS = { collapse: 'Collapse panel', expand: 'Expand panel' } as const;

/** Landmark label for the SideMenu slot; the shell overrides it with translated copy. */
export const DEFAULT_SIDE_MENU_LANDMARK_LABEL = 'Main navigation';

// ========== Animation ==========
// Mirrors the left menu exactly (design contract). side-menu keeps its
// animation constants family-internal, so values are duplicated, not imported
// cross-family; the constants parity test locks them together.

export const EXPAND_MS = 280;
export const COLLAPSE_MS = 200;
export const HOVER_IN_MS = 80;
export const HOVER_OUT_MS = 160;
export const REDUCED_MOTION_FADE_MS = 80;
// Curves (Reanimated Easing.bezier)
export const EASE_DECELERATE = [0.2, 0, 0, 1] as const; // expand
export const EASE_ACCELERATE = [0.4, 0, 1, 1] as const; // collapse
