import { eToroTheme } from '../../../../core/styles';

export interface CheckboxColors {
  unchecked: string;
  checked: string;
  icon: string;
  error: string;
}

/**
 * Returns checkbox colors based on theme.
 * Error border color is handled separately in the animated style.
 */
export const getCheckboxColors = (themeColors: eToroTheme['colors']): CheckboxColors => {
  return {
    unchecked: themeColors.carbon400,
    checked: themeColors.primary600,
    icon: themeColors.carbon050,
    error: themeColors.verdictNegative600,
  };
};
