import type { eToroTheme } from '../../../../core/styles/colors';
import { X1, X2, X3 } from '../../../../core/styles/spacing';
import type { ArrowPosition, PopoverDirection } from '../api/types';

const BORDER_RADIUS = X2;
const SHADOW_COLOR = '#000000';
const SHADOW_OPACITY = 0.03;
const SHADOW_RADIUS = X3;

/**
 * Get popover colors based on theme
 * The popover always uses inverted colors (opposite of app theme):
 * - Light mode app: dark popover background, light text
 * - Dark mode app: light popover background, dark text
 *
 * Uses semantic tokens that naturally invert:
 * - textPrimaryNeutral: dark in light mode, white in dark mode
 * - textInvertedPrimaryNeutral: white in light mode, dark in dark mode
 */
export function getPopoverColors(colors: eToroTheme['colors']) {
  // The tokens naturally provide inverted colors:
  // - textPrimaryNeutral gives us the "opposite" background color
  // - textInvertedPrimaryNeutral gives us the "opposite" text color
  return {
    backgroundColor: colors.textPrimaryNeutral,
    textColor: colors.textInvertedPrimaryNeutral,
    iconColor: colors.textInvertedPrimaryNeutral,
  };
}

/**
 * Get the container flex direction based on arrow position
 *
 * Arrow position determines where the arrow appears on the popover:
 * - "bottom": Arrow at bottom edge → column layout (body on top, arrow below)
 * - "top": Arrow at top edge → column-reverse layout (arrow on top, body below)
 * - "left": Arrow at left edge → row-reverse layout (arrow on left, body on right)
 * - "right": Arrow at right edge → row layout (body on left, arrow on right)
 */
export function getContainerDirection(arrowPosition: ArrowPosition) {
  switch (arrowPosition) {
    case 'bottom':
      return 'column' as const;
    case 'top':
      return 'column-reverse' as const;
    case 'left':
      return 'row-reverse' as const;
    case 'right':
      return 'row' as const;
  }
}

/**
 * Popover body styles
 */
export const popoverBodyStyles = {
  borderRadius: BORDER_RADIUS,
  shadowColor: SHADOW_COLOR,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: SHADOW_OPACITY,
  shadowRadius: SHADOW_RADIUS,
  elevation: X1,
};

/**
 * Get the arrow position based on popover direction
 *
 * The arrow is placed on the opposite side of the popover direction:
 * - popoverDirection="above" → arrow at bottom, pointing down toward target
 * - popoverDirection="below" → arrow at top, pointing up toward target
 * - popoverDirection="left" → arrow on right, pointing right toward target
 * - popoverDirection="right" → arrow on left, pointing left toward target
 */
export function getArrowPositionFromDirection(direction: PopoverDirection): ArrowPosition {
  switch (direction) {
    case 'above':
      return 'bottom';
    case 'below':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
}
