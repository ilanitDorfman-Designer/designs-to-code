import { X1, X2, X3, X4, X5, X9, X12 } from '../../../core/styles/spacing';

// ============================================================================
// Geometry constants
// ============================================================================

/** Diameter of a single neighbour dot in the collapsed pill. */
export const DOT_SIZE = 6;
/** Gap between neighbour dots in the collapsed pill. */
export const DOT_GAP = X2;
/** How many neighbour dots are shown on each side of the focused avatar. */
export const DOTS_PER_SIDE = 3;

/** Avatar diameter in the collapsed pill (matches EtAvatar `medium`). */
export const COLLAPSED_AVATAR_SIZE = X9; // 36
/** Base avatar diameter for a rail item (matches EtAvatar `large`). */
export const RAIL_AVATAR_SIZE = X12; // 48
/** Scale applied to the focused (centered) rail item. */
export const RAIL_FOCUSED_SCALE = 1.25;
/** Scale applied to non-focused rail items so the focused one stands out. */
export const RAIL_UNFOCUSED_SCALE = 0.5;
/**
 * Per-item horizontal stride in the rail. Tightened to match the small
 * unselected avatars so neighbours sit close — a dense, premium carousel with
 * no dead air between the (shrunken) unselected items. Also the slot width.
 */
export const SNAP_INTERVAL = 40;
/**
 * Extra horizontal push (px) applied to rail items away from the center via a
 * saturating `tanh`, so the focused item keeps distinct breathing room even
 * with the tighter stride, while distant items stay packed close together.
 */
export const RAIL_CENTER_SPREAD = 20;
/** Softness of the center spread falloff — smaller = sharper gap at the focus. */
export const SPREAD_SIGMA = 0.9;

/** Inner padding of the collapsed pill. */
export const COLLAPSED_PADDING_X = X4;
export const COLLAPSED_PADDING_Y = X1;

/** Inner padding of the expanded island. */
export const EXPANDED_PADDING_X = X5;
export const EXPANDED_PADDING_TOP = X3;
export const EXPANDED_PADDING_BOTTOM = X2;

/** Height of the focused-label row beneath the rail. */
export const LABEL_HEIGHT = 20;
/** Gap between the rail and the label. */
export const LABEL_GAP = X1;

/** Upper bound on the expanded island width so it stays an "island", never a full-width panel. */
export const MAX_EXPANDED_WIDTH = 300;

/** Extra room the glow canvas reserves around the shell so the blur never clips. */
export const GLOW_CANVAS_INFLATE = 40;

// ============================================================================
// Pure layout helpers
// ============================================================================

/** Width of the collapsed pill: avatar + dots on both sides + paddings. */
export function getCollapsedWidth(dotsPerSide: number = DOTS_PER_SIDE): number {
  const sideWidth = dotsPerSide * DOT_SIZE + Math.max(0, dotsPerSide - 1) * DOT_GAP;
  const innerGap = X4; // gap between the dot clusters and the avatar
  return COLLAPSED_PADDING_X * 2 + sideWidth * 2 + innerGap * 2 + COLLAPSED_AVATAR_SIZE;
}

/** Height of the collapsed pill. */
export function getCollapsedHeight(): number {
  return COLLAPSED_AVATAR_SIZE + COLLAPSED_PADDING_Y * 2;
}

/** Height of the expanded island (rail at focused scale + label + paddings). */
export function getExpandedHeight(): number {
  const railHeight = RAIL_AVATAR_SIZE * RAIL_FOCUSED_SCALE;
  return EXPANDED_PADDING_TOP + railHeight + LABEL_GAP + LABEL_HEIGHT + EXPANDED_PADDING_BOTTOM;
}

/** Corner radius of the collapsed pill (always a full capsule). */
export function getCollapsedRadius(): number {
  return getCollapsedHeight() / 2;
}

/**
 * Clamp an index into the valid `[0, count - 1]` range.
 * Returns `0` for an empty list.
 */
export function clampIndex(index: number, count: number): number {
  'worklet';
  if (count <= 0) return 0;
  if (index < 0) return 0;
  if (index > count - 1) return count - 1;
  return index;
}

/**
 * Resolve the nearest item index for a horizontal scroll offset, given the
 * per-item snap interval. Used by the rail to derive the focused item.
 */
export function nearestIndexForOffset(offsetX: number, snapInterval: number, count: number): number {
  if (snapInterval <= 0) return 0;
  return clampIndex(Math.round(offsetX / snapInterval), count);
}
