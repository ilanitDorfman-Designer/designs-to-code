import type { eToroTheme } from '../../../core/styles/colors';
import { X2, X4, X5, X9 } from '../../../core/styles/spacing';
import type { ButtonSize, ButtonVariant, SizeConfig, VariantStyleConfig } from './types';

/**
 * Size configurations for each button size
 * Based on Figma design specs
 */
export const SIZE_CONFIGS: Record<ButtonSize, SizeConfig> = {
  tiny: {
    height: 32,
    minWidth: 72,
    paddingHorizontal: X4,
    paddingVertical: X2,
    borderRadius: X9,
    iconSize: 20,
  },
  small: {
    height: 36,
    minWidth: 78,
    paddingHorizontal: X5,
    paddingVertical: X2,
    borderRadius: X9,
    iconSize: 20,
  },
  medium: {
    height: 44,
    minWidth: 86,
    paddingHorizontal: X5,
    paddingVertical: X2,
    borderRadius: X9,
    iconSize: 20,
  },
  large: {
    height: 56,
    minWidth: 90,
    paddingHorizontal: X5,
    paddingVertical: X2,
    borderRadius: X9,
    iconSize: 20,
  },
};

/**
 * Cache for variant styles per theme colors object
 * WeakMap ensures automatic cleanup when theme is garbage collected
 */
const variantStylesCache = new WeakMap<eToroTheme['colors'], Record<ButtonVariant, VariantStyleConfig>>();

function buildVariantConfigs(colors: eToroTheme['colors']): Record<ButtonVariant, VariantStyleConfig> {
  return {
    // Filled variants
    'primary-filled': {
      backgroundColor: colors.primary600,
      textColor: colors.carbon050,
      iconColor: colors.carbon050,
      pressedBackgroundColor: colors.primary500,
      disabledBackgroundColor: colors.carbon200,
      disabledTextColor: colors.carbon400,
    },
    'negative-filled': {
      backgroundColor: colors.verdictNegative600,
      textColor: colors.carbon050,
      iconColor: colors.carbon050,
      pressedBackgroundColor: colors.verdictNegative500,
      disabledBackgroundColor: colors.carbon200,
      disabledTextColor: colors.carbon400,
    },
    'info-filled': {
      backgroundColor: colors.carbon900,
      textColor: colors.carbon050,
      iconColor: colors.carbon050,
      pressedBackgroundColor: colors.carbon800,
      disabledBackgroundColor: colors.carbon200,
      disabledTextColor: colors.carbon400,
    },

    // Subtle variants use tinted backgrounds only; buttons do not render borders.
    'primary-subtle': {
      backgroundColor: `${colors.primary600}17`,
      textColor: colors.primary600,
      iconColor: colors.primary600,
      pressedTextColor: colors.primary500,
      pressedIconColor: colors.primary500,
      disabledBackgroundColor: colors.carbon100,
      disabledTextColor: colors.carbon300,
    },
    'negative-subtle': {
      backgroundColor: `${colors.verdictNegative600}17`,
      textColor: colors.verdictNegative600,
      iconColor: colors.verdictNegative600,
      pressedTextColor: colors.verdictNegative500,
      pressedIconColor: colors.verdictNegative500,
      disabledBackgroundColor: colors.carbon100,
      disabledTextColor: colors.carbon300,
    },
    'info-subtle': {
      backgroundColor: `${colors.carbon600}17`,
      textColor: colors.carbon900,
      iconColor: colors.carbon900,
      pressedTextColor: colors.carbon800,
      pressedIconColor: colors.carbon800,
      disabledBackgroundColor: colors.carbon100,
      disabledTextColor: colors.carbon300,
    },

    // Ghost variants (no background, no border) - on press, text changes to hover color
    'primary-ghost': {
      backgroundColor: 'transparent',
      textColor: colors.primary600,
      iconColor: colors.primary600,
      pressedTextColor: colors.primary500,
      pressedIconColor: colors.primary500,
      disabledBackgroundColor: 'transparent',
      disabledTextColor: colors.carbon300,
    },
    'negative-ghost': {
      backgroundColor: 'transparent',
      textColor: colors.verdictNegative600,
      iconColor: colors.verdictNegative600,
      pressedTextColor: colors.verdictNegative500,
      pressedIconColor: colors.verdictNegative500,
      disabledBackgroundColor: 'transparent',
      disabledTextColor: colors.carbon300,
    },
    'info-ghost': {
      backgroundColor: 'transparent',
      textColor: colors.carbon900,
      iconColor: colors.carbon900,
      pressedTextColor: colors.carbon800,
      pressedIconColor: colors.carbon800,
      disabledBackgroundColor: 'transparent',
      disabledTextColor: colors.carbon300,
    },
  };
}

/**
 * Get variant styles based on theme colors
 * Memoized per colors object to avoid recreating configs on every call
 */
export function getVariantStyles(colors: eToroTheme['colors'], variant: ButtonVariant): VariantStyleConfig {
  let configs = variantStylesCache.get(colors);
  if (!configs) {
    configs = buildVariantConfigs(colors);
    variantStylesCache.set(colors, configs);
  }
  return configs[variant];
}

/**
 * Get size configuration for a button size
 */
export function getSizeConfig(size: ButtonSize): SizeConfig {
  return SIZE_CONFIGS[size];
}

/**
 * Compute colors based on variant styles and disabled state
 */
export function getComputedColors(variantStyles: VariantStyleConfig, disabled: boolean) {
  const textColor = disabled ? (variantStyles.disabledTextColor ?? variantStyles.textColor) : variantStyles.textColor;

  const iconColor = disabled ? (variantStyles.disabledTextColor ?? variantStyles.iconColor) : variantStyles.iconColor;

  const backgroundColor = disabled ? (variantStyles.disabledBackgroundColor ?? variantStyles.backgroundColor) : variantStyles.backgroundColor;

  const pressedBackgroundColor = variantStyles.pressedBackgroundColor ?? backgroundColor;

  const pressedTextColor = disabled ? textColor : (variantStyles.pressedTextColor ?? textColor);

  const pressedIconColor = disabled ? iconColor : (variantStyles.pressedIconColor ?? iconColor);

  return {
    textColor,
    iconColor,
    backgroundColor,
    pressedBackgroundColor,
    pressedTextColor,
    pressedIconColor,
  };
}
