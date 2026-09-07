import { X1, X2, X3, X4, X5, X6, X8, X9, X10, X11, X15, X16 } from '../../../core/styles/spacing';
import type { SideMenuTier } from './api/types';

// ========== Rail ==========

/** Rail width per visible tier index from `useBreakpointTier(SHELL_TIERS)` (X18 / X20 / X21). */
export const RAIL_WIDTH_BY_TIER = [72, 80, 84] as const;

/** 0 at the hidden tier (-1), otherwise the tier's rail width. */
export const railWidthForTier = (tier: SideMenuTier): number => (tier === -1 ? 0 : RAIL_WIDTH_BY_TIER[tier]);

// ========== Panel ==========

/** Fixed expanded-panel width, all tiers (design constant, not tokenized). */
export const PANEL_WIDTH = 280;
/** Top/bottom END-corner radius of the expanded surface; hardcoded in Figma (not a token). */
export const PANEL_END_RADIUS = 32;

// ========== Shared geometry ==========

export const MENU_VERTICAL_PADDING = X6; // 24 — rail AND panel top/bottom
export const MENU_HORIZONTAL_PADDING = X8; // 32 — panel rows/header/divider
export const RAIL_ITEM_HEIGHT = X15; // 60 — rail cell (width = railWidth)
export const PRIMARY_ROW_HEIGHT = X10; // 40 — expanded L rows (text-only)
export const SECONDARY_ROW_HEIGHT = X10; // 40 — expanded S rows (icon + label)
export const ICON_SIZE = X5; // 20 — rail cells and secondary rows
export const ICON_LABEL_GAP = X1; // 4 — secondary rows (primary rows have no icon)
export const AVATAR_TEXT_GAP = X3; // 12
/** 64 — logo↔avatar in the rail AND header-row↔profile-row in the panel. */
export const HEADER_PROFILE_GAP = X16;
export const TOGGLE_SIZE = X9; // 36 — header control box (rail logo-toggle & panel collapse)
/** 24 — the arrow draws ~15px of its 24 grid, so the nominal 20 box read too small in the 36 button. */
export const TOGGLE_ICON_SIZE = X6;
export const RAIL_LOGO_SIZE = X9; // 36 — the <e> mark at rest in the rail toggle
export const AVATAR_SIZE = X9; // 36 — matches EtAvatar size="medium"
/** 8 — the profile row's hover band overhangs the 36px row so it reads taller than the avatar. */
export const PROFILE_HOVER_OVERHANG = X2;
export const DIVIDER_PADDING_TOP = X5; // 20 — "More" row
export const DIVIDER_PADDING_BOTTOM = X2; // 8
export const HEADER_ROW_HEIGHT = X9; // 36 — expanded header & user row
/** 24 — profile→tile→menu gaps in the panel (Figma Sidebar column gap X6). */
export const PANEL_BLOCK_GAP = X6;
export const TRIGGER_SIZE = X11; // 44 — EtSideMenuTrigger box (top-panel design)
/**
 * 71×22 Figma box has 19.76% vertical inset → glyph 71×13.3;
 * `EtoroWordmark` size = glyph height (aspect 5.348:1 → width ≈ 71.1).
 */
export const WORDMARK_GLYPH_HEIGHT = 13.3;

// ========== Active item (band + accent bar) ==========

/** Full-row `carbon900` tint behind the active item — same 3% layer Figma uses for hover. */
export const ACTIVE_TINT_OPACITY = 0.03;
export const ACTIVE_BAR_WIDTH = 2; // flush to the surface's start edge
export const ACTIVE_BAR_RADIUS = 4; // hardcoded in the Figma prefix component (not a token)

// ========== Club tile ==========

export const TILE_GUTTER = X6; // 24 — inset from the panel edges (rows use 32)
export const TILE_PADDING = X4; // 16
export const TILE_RADIUS = X2; // 8
export const TILE_ICON_SIZE = X5; // 20
export const TILE_ICON_TITLE_GAP = X1; // 4
export const TILE_CHEVRON_SIZE = X5; // 20
export const TILE_MIN_HEIGHT = X10; // 40 content box (~72 with padding)

// ========== Hover ==========

export const HOVER_OPACITY = 0.03; // carbon900 @ 3%
export const HOVER_IN_MS = 80;
export const HOVER_OUT_MS = 160;

// ========== Animation ==========

export const EXPAND_MS = 280;
export const COLLAPSE_MS = 200;
export const HIDDEN_EXPAND_MS = 300; // tier -1: clip-reveal from the edge
export const HIDDEN_COLLAPSE_MS = 220;
export const STAGGER_STEP_MS = 12;
export const REDUCED_MOTION_FADE_MS = 80;
// Curves (Reanimated Easing.bezier)
export const EASE_DECELERATE = [0.2, 0, 0, 1] as const; // expand
export const EASE_ACCELERATE = [0.4, 0, 1, 1] as const; // collapse
