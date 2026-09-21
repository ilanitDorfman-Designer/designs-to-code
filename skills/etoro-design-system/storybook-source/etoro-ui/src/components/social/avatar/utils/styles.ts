import { HALF, X1, X2, X3, X4, X6, X9, X12, X15 } from '../../../../core/styles/spacing';
import type { AvatarShape, AvatarSize, BadgePosition, SizeConfig } from './types';

/**
 * Size configurations for each avatar size
 * Based on Figma design specs
 */
export const SIZE_CONFIGS: Record<AvatarSize, SizeConfig> = {
  xsmall: {
    size: X4, // 16px - used by grouped avatars
    squareRadius: X1, // 4px
  },
  small: {
    size: X6, // 24px
    squareRadius: X1, // 4px
  },
  medium: {
    size: X9, // 36px
    squareRadius: X2, // 8px
  },
  large: {
    size: X12, // 48px
    squareRadius: X2, // 8px
  },
};

/**
 * Get border radius based on shape and size
 */
export function getBorderRadius(size: AvatarSize, shape: AvatarShape): number {
  const config = SIZE_CONFIGS[size];
  if (shape === 'circle') {
    return config.size / 2; // 50% for circle
  }
  return config.squareRadius;
}

/**
 * Get size value in pixels
 */
export function getSizeValue(size: AvatarSize): number {
  return SIZE_CONFIGS[size].size;
}

/**
 * Fixed size for the market-open indicator dot
 */
export const MARKET_OPEN_DOT_SIZE = 8;

/**
 * Padding between the market-open dot and its bgBase ring container
 */
export const MARKET_OPEN_DOT_PADDING = 3;

export const MARKET_OPEN_DOT_CONFIGS: Record<AvatarSize, { dotSize: number; padding: number }> = {
  xsmall: {
    dotSize: 6,
    padding: 2,
  },
  small: {
    dotSize: 6,
    padding: 2,
  },
  medium: {
    dotSize: MARKET_OPEN_DOT_SIZE,
    padding: MARKET_OPEN_DOT_PADDING,
  },
  large: {
    dotSize: MARKET_OPEN_DOT_SIZE,
    padding: MARKET_OPEN_DOT_PADDING,
  },
};

/**
 * Avatar group styles
 */
export const GROUP_STYLES = {
  overlap: -X2,
  containerPaddingLeft: X1,
  containerPaddingRight: X3,
  containerPaddingVertical: X1,
  containerRadius: X15, // X15 - pill shape
};

/**
 * Overlap margin between grouped avatars, tuned per size.
 * Smaller avatars use a tighter overlap so the stack stays balanced.
 */
export const GROUP_OVERLAP_BY_SIZE: Record<AvatarSize, number> = {
  xsmall: -X1, // -4px
  small: -X2, // -8px
  medium: -X2, // -8px
  large: -X2, // -8px
};

/**
 * `+N` count-bubble text config per avatar size.
 * The bubble grows horizontally to fit its text (pill), while `fontSize` and
 * `paddingHorizontal` are tuned so the count stays legible and centered at
 * every size — including `xsmall` (16px).
 */
export const GROUP_COUNT_CONFIGS: Record<AvatarSize, { fontSize: number; paddingHorizontal: number }> = {
  xsmall: { fontSize: 10, paddingHorizontal: X1 }, // 16px bubble
  small: { fontSize: 12, paddingHorizontal: X1 + HALF }, // 24px bubble
  medium: { fontSize: 14, paddingHorizontal: X2 }, // 36px bubble
  large: { fontSize: 16, paddingHorizontal: X2 + HALF }, // 48px bubble
};

/**
 * Gap between the last avatar and the `+N` count bubble.
 * A small positive gap (instead of the avatar overlap) keeps the leading `+`
 * fully visible rather than tucked under the preceding avatar.
 */
export const GROUP_COUNT_GAP = HALF; // 2px

/**
 * Badge position offsets for square shape
 */
export const BADGE_POSITIONS_SQUARE = {
  topLeft: { top: -X1, left: -X1 },
  topRight: { top: -X1, right: -X1 },
  bottomLeft: { bottom: -X1, left: -X1 },
  bottomRight: { bottom: -X1, right: -X1 },
};

/**
 * Badge position offsets for circle shape
 * Positioned along the circle edge (roughly 45-degree angles)
 */
export const BADGE_POSITIONS_CIRCLE = {
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
};

/**
 * Badge position offset type derived from the position constants
 */
export type BadgePositionOffset =
  | (typeof BADGE_POSITIONS_CIRCLE)[keyof typeof BADGE_POSITIONS_CIRCLE]
  | (typeof BADGE_POSITIONS_SQUARE)[keyof typeof BADGE_POSITIONS_SQUARE];

/**
 * Get badge position based on shape
 */
export function getBadgePosition(position: BadgePosition, shape: AvatarShape): BadgePositionOffset {
  return shape === 'circle' ? BADGE_POSITIONS_CIRCLE[position] : BADGE_POSITIONS_SQUARE[position];
}

/**
 * Size of the circular container when Badge is used in icon mode
 */
export const BADGE_ICON_SIZES: Record<AvatarSize, number> = {
  xsmall: 14,
  small: 16,
  medium: 20,
  large: 24,
};

const RTL_FLIP: Record<BadgePosition, BadgePosition> = {
  topLeft: 'topRight',
  topRight: 'topLeft',
  bottomLeft: 'bottomRight',
  bottomRight: 'bottomLeft',
};

/**
 * Flips a badge position horizontally when in an RTL layout.
 */
export function resolveRTLPosition(position: BadgePosition, isRTL: boolean): BadgePosition {
  return isRTL ? RTL_FLIP[position] : position;
}
