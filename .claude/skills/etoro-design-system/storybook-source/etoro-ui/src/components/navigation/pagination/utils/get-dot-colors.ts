import { eToroTheme } from '../../../../core/styles/colors';
import { PaginationColor } from '../api';

interface DotColors {
  selectedColor: string;
  defaultColor: string;
}

/**
 * Get dot colors based on the color variant
 */
export function getDotColors(color: PaginationColor, themeColors: eToroTheme['colors']): DotColors {
  const defaultColor = themeColors.dividerTertiary;

  switch (color) {
    case 'primary':
      return {
        selectedColor: themeColors.actionBrandText,
        defaultColor,
      };
    case 'neutral':
    default:
      return {
        selectedColor: themeColors.textPrimaryNeutral,
        defaultColor,
      };
  }
}
