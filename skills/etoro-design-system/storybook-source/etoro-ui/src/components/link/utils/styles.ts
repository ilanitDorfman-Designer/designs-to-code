import type { eToroTheme } from '../../../core/styles/colors';
import type { LinkSize, LinkVariant, LinkVariantStyleConfig } from '../api/types';

/**
 * Size configurations for link icons
 */
export const ICON_SIZES: Record<LinkSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

/**
 * Cache for variant styles per theme colors object
 * WeakMap ensures automatic cleanup when theme is garbage collected
 */
const variantStylesCache = new WeakMap<eToroTheme['colors'], Record<LinkVariant, LinkVariantStyleConfig>>();

function buildVariantConfigs(colors: eToroTheme['colors']): Record<LinkVariant, LinkVariantStyleConfig> {
  return {
    primary: {
      textColor: colors.primary600,
      iconColor: colors.primary600,
      pressedTextColor: colors.primary500,
      pressedIconColor: colors.primary500,
      disabledTextColor: colors.carbon300,
    },
    negative: {
      textColor: colors.verdictNegative600,
      iconColor: colors.verdictNegative600,
      pressedTextColor: colors.verdictNegative500,
      pressedIconColor: colors.verdictNegative500,
      disabledTextColor: colors.carbon300,
    },
    info: {
      textColor: colors.carbon900,
      iconColor: colors.carbon900,
      pressedTextColor: colors.carbon800,
      pressedIconColor: colors.carbon800,
      disabledTextColor: colors.carbon300,
    },
  };
}

/**
 * Get variant styles based on theme colors
 * Memoized per colors object to avoid recreating configs on every call
 */
export function getVariantStyles(colors: eToroTheme['colors'], variant: LinkVariant): LinkVariantStyleConfig {
  let configs = variantStylesCache.get(colors);
  if (!configs) {
    configs = buildVariantConfigs(colors);
    variantStylesCache.set(colors, configs);
  }
  return configs[variant];
}

/**
 * Compute colors based on variant styles, pressed, and disabled states
 */
export function getComputedColors(variantStyles: LinkVariantStyleConfig, pressed: boolean, disabled: boolean) {
  const textColor = disabled ? variantStyles.disabledTextColor : pressed ? variantStyles.pressedTextColor : variantStyles.textColor;

  const iconColor = disabled ? variantStyles.disabledTextColor : pressed ? variantStyles.pressedIconColor : variantStyles.iconColor;

  return {
    textColor,
    iconColor,
  };
}
