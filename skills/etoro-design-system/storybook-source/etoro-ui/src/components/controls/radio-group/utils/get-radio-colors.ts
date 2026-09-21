import { eToroTheme } from '../../../../core/styles';

export interface RadioColors {
  /** Border color for unselected state */
  unchecked: string;
  /** Border color for selected state */
  selectedBorder: string;
  /** Inner circle fill color when selected */
  selectedFill: string;
  /** Border color for error state */
  error: string;
  /** Background color for disabled state */
  disabledBackground: string;
  /** Border color for disabled state */
  disabledBorder: string;
}

/**
 * Returns radio button colors based on theme.
 */
export const getRadioColors = (themeColors: eToroTheme['colors']): RadioColors => {
  return {
    unchecked: themeColors.carbon400,
    selectedBorder: themeColors.carbon600,
    selectedFill: themeColors.primary600,
    error: themeColors.verdictNegative600,
    disabledBackground: themeColors.carbon050,
    disabledBorder: themeColors.carbon400,
  };
};
