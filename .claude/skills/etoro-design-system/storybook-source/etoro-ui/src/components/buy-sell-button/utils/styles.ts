import type { eToroTheme } from '../../../core/styles/colors';
import { X1, X2, X3, X4 } from '../../../core/styles/spacing';
import type { ButtonVisualState, BuySellButtonSize, BuySellButtonType, SizeConfig } from '../api';

/**
 * Divider dimensions
 */
export const DIVIDER_WIDTH = 1;
export const DIVIDER_HEIGHT = X3; // 12px

/**
 * Border radius for all button sizes (pill shape)
 */
export const BUTTON_BORDER_RADIUS = 50;

/**
 * Size configurations for each button size
 * Using spacing constants from etoro-ui/core/styles/spacing
 */
const SIZE_CONFIGS: Record<BuySellButtonSize, SizeConfig> = {
  tiny: {
    borderRadius: BUTTON_BORDER_RADIUS,
    paddingVertical: X1, // 4px
    paddingHorizontal: X3, // 12px
    gap: X2, // 8px
  },
  small: {
    borderRadius: BUTTON_BORDER_RADIUS,
    paddingVertical: X1, // 4px
    paddingHorizontal: X3, // 12px
    gap: X2, // 8px
  },
  medium: {
    borderRadius: BUTTON_BORDER_RADIUS,
    paddingVertical: X2, // 8px
    paddingHorizontal: X3, // 12px
    gap: X2, // 8px
  },
  large: {
    borderRadius: BUTTON_BORDER_RADIUS,
    paddingVertical: X2, // 8px
    paddingHorizontal: X4, // 16px
    gap: X3, // 12px
  },
};

/**
 * Get size configuration for a button size
 */
export function getSizeConfig(size: BuySellButtonSize): SizeConfig {
  return SIZE_CONFIGS[size] ?? SIZE_CONFIGS.medium;
}

/**
 * Style configuration for a visual state
 */
export interface StateStyleConfig {
  backgroundColor: string;
  letterColor: string;
  dividerColor: string;
  priceColor: string;
  borderColor: string;
  borderWidth: number;
}

/**
 * Resolve the visual state based on props
 * Priority: disabled > positiveIndication > negativeIndication > oneClickTrading > default
 */
export function resolveVisualState(props: {
  disabled?: boolean;
  positiveIndication?: boolean;
  negativeIndication?: boolean;
  oneClickTrading?: boolean;
  pressed?: boolean;
}): ButtonVisualState {
  const { disabled = false, positiveIndication = false, negativeIndication = false, oneClickTrading = false, pressed = false } = props ?? {};

  if (disabled) {
    return 'disabled';
  }

  if (positiveIndication) {
    return 'positiveIndication';
  }

  if (negativeIndication) {
    return 'negativeIndication';
  }

  if (oneClickTrading) {
    return pressed ? 'oneClickTradingPressed' : 'oneClickTrading';
  }

  return pressed ? 'pressed' : 'default';
}

/**
 * Get style configuration for a given visual state and button type
 *
 * State color mappings:
 * - Default: border=dividerTertiary, bg=bgNeutralPrimary, letter=actionBrandText (buy) / actionBrandVarText (sell)
 * - Pressed: border=actionBrandText (buy) / actionBrandVarText (sell), bg=bgNeutralPrimary (only border changes)
 * - One-click: bg=bgActionInfo, all text=textInvertedPrimaryNeutral
 * - One-click pressed: bg=bgActionInfoHover, all text=textInvertedPrimaryNeutral
 * - Positive: bg=bgActionBrand, all text=textInvertedPrimaryNeutral
 * - Negative: bg=bgActionBrandVar, all text=textInvertedPrimaryNeutral
 * - Disabled: bg=bgActionDisabled, all text=actionDisabledText
 */
export function getStateStyles(colors: eToroTheme['colors'], state: ButtonVisualState, type: BuySellButtonType): StateStyleConfig {
  // Type-specific colors for default/pressed states
  // Buy: actionBrandText (green), Sell: actionBrandVarText (red)
  const typeLetterColor = type === 'buy' ? colors.actionBrandText : colors.actionBrandVarText;

  switch (state) {
    case 'default':
      return {
        backgroundColor: colors.bgNeutralPrimary,
        letterColor: typeLetterColor,
        dividerColor: colors.dividerTertiary,
        priceColor: colors.textPrimaryNeutral,
        borderColor: colors.dividerTertiary,
        borderWidth: 1,
      };

    case 'pressed':
      // On press, show border with type-specific color
      // Green (actionBrandText) for buy, Red (actionBrandVarText) for sell
      return {
        backgroundColor: colors.bgNeutralPrimary,
        letterColor: typeLetterColor,
        dividerColor: colors.dividerTertiary,
        priceColor: colors.textPrimaryNeutral,
        borderColor: typeLetterColor,
        borderWidth: 1,
      };

    case 'oneClickTrading':
      return {
        backgroundColor: colors.bgActionInfo,
        letterColor: colors.textInvertedPrimaryNeutral,
        dividerColor: colors.textInvertedPrimaryNeutral,
        priceColor: colors.textInvertedPrimaryNeutral,
        borderColor: 'transparent',
        borderWidth: 1,
      };

    case 'oneClickTradingPressed':
      return {
        backgroundColor: colors.bgActionInfoHover,
        letterColor: colors.textInvertedPrimaryNeutral,
        dividerColor: colors.textInvertedPrimaryNeutral,
        priceColor: colors.textInvertedPrimaryNeutral,
        borderColor: 'transparent',
        borderWidth: 1,
      };

    case 'positiveIndication':
      return {
        backgroundColor: colors.bgActionBrand,
        letterColor: colors.textInvertedPrimaryNeutral,
        dividerColor: colors.textInvertedPrimaryNeutral,
        priceColor: colors.textInvertedPrimaryNeutral,
        borderColor: 'transparent',
        borderWidth: 1,
      };

    case 'negativeIndication':
      return {
        backgroundColor: colors.bgActionBrandVar,
        letterColor: colors.textInvertedPrimaryNeutral,
        dividerColor: colors.textInvertedPrimaryNeutral,
        priceColor: colors.textInvertedPrimaryNeutral,
        borderColor: 'transparent',
        borderWidth: 1,
      };

    case 'disabled':
      return {
        backgroundColor: colors.bgActionDisabled,
        letterColor: colors.actionDisabledText,
        dividerColor: colors.actionDisabledText,
        priceColor: colors.actionDisabledText,
        borderColor: 'transparent',
        borderWidth: 1,
      };

    default:
      // Fallback for any unexpected state — use default styling
      return {
        backgroundColor: colors.bgNeutralPrimary,
        letterColor: typeLetterColor,
        dividerColor: colors.dividerTertiary,
        priceColor: colors.textPrimaryNeutral,
        borderColor: colors.dividerTertiary,
        borderWidth: 1,
      };
  }
}

/**
 * Format price with 2 decimal places
 */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return '--';
  }
  return price.toFixed(2);
}
