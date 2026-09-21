import { X1, X3, X4, X5, X6, X9, X10, X11, X19, X21 } from '../../../core/styles/spacing';

// ========== Heights ==========

/** 76 (X19) = 16+44+16 — below `BREAKPOINT_DESKTOP_S`. */
export const TOP_PANEL_HEIGHT_REGULAR = X19;
/** 84 (X21) = 20+44+20 — at ≥`BREAKPOINT_DESKTOP_S`; the 44px bar row stays, vertical padding grows. */
export const TOP_PANEL_HEIGHT_TALL = X21;

// ========== Pixel table (Figma DS "Top bar" symbol 64911:413329) ==========
//
// | Element        | Value            | Figma binding                        |
// | -------------- | ---------------- | ------------------------------------ |
// | Panel height   | 76 / 84          | X19 (≤1060) / X21 (≥1280)            |
// | Start padding  | 24               | X6                                   |
// | End padding    | 40               | X10                                  |
// | Leading slot   | 44×44            | opener at tier -1; gone when empty   |
// | Search pill    | 280×40, r 100    | DS Search Field rest state           |
// | Pill bg        | carbon900 @ 8%   | dedicated fill layer, node opacity   |
// | Pill padding-x | 12               | X3                                   |
// | Search icon    | 16, gap 4 (X1)   |                                      |
// | Clear icon     | 20, carbon400    | xmark-circle-fill, rest-visible (D5) |
// | Search↔badge   | 10               | off-scale in Figma (between X2/X3)   |
// | Tori badge     | h 40, r 100      | accentE100 fill, px 12, py 4, gap 4  |
// | Tori logo      | 24               | fixed-gradient registry icon         |
// | Actions        | hug ×44, pad 4   | 36×36 slots: hand-up (opt) + bell    |

export const TOP_PANEL_PADDING_START = X6; // 24
export const TOP_PANEL_PADDING_END = X10; // 40
export const LEADING_SLOT_SIZE = X11; // 44
export const SEARCH_PILL_WIDTH = 280;
export const SEARCH_PILL_HEIGHT = X10; // 40
export const SEARCH_PILL_RADIUS = 100; // full pill per Figma
export const SEARCH_PILL_PADDING_HORIZONTAL = X3; // 12
export const SEARCH_PILL_BG_OPACITY = 0.08; // carbon900 fill layer at 8%
export const SEARCH_ICON_SIZE = X4; // 16
export const SEARCH_ICON_TEXT_GAP = X1; // 4
export const SEARCH_CLEAR_ICON_SIZE = X5; // 20
// Off-scale on purpose — Figma draws 10 between the pill and the Tori badge.
export const SEARCH_GROUP_GAP = 10;
export const TORI_BADGE_HEIGHT = X10; // 40
export const TORI_BADGE_RADIUS = 100; // full pill per Figma
export const TORI_BADGE_PADDING_HORIZONTAL = X3; // 12
export const TORI_BADGE_PADDING_VERTICAL = X1; // 4
export const TORI_BADGE_GAP = X1; // 4
export const TORI_LOGO_SIZE = X6; // 24
/**
 * The label is ONE gradient run, not two solid spans: carbon900 → verdictPositive600,
 * left to right, fully green from 35.577% of the text width (Figma's raw text fill).
 * Both stops are theme tokens, so the run flips with dark/light automatically.
 */
export const TORI_LABEL_GRADIENT_STOP = 0.35577;
/** Skeleton mirrors the rendered badge footprint ("Ask Tori" at 14/20). */
export const TORI_BADGE_SKELETON_WIDTH = 104;
export const ACTIONS_PADDING = X1; // 4 — keeps the 36px slots on the 44px bar row
export const ACTION_SLOT_SIZE = X9; // 36
