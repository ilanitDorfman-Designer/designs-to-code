import { useEtoroTheme } from '../../../core/hooks';
import { IconName } from '../api';
import { getIconMetadata } from '../utils';

interface UseIconThemeProps {
  iconName: IconName;
  color?: string;
}

/**
 * Custom hook for theme-aware icon styling
 * @param props Icon theme props
 * @returns Theme-aware icon styles and metadata
 */
export function useIconTheme({ iconName, color }: UseIconThemeProps) {
  const { colors } = useEtoroTheme();
  const metadata = getIconMetadata(iconName);

  // Get theme-appropriate variants for brand icons
  const getThemeAwareIconName = (name: IconName): IconName => {
    // Use dark variants when they exist
    switch (name) {
      case 'apple':
        return 'appleDark';
      default:
        return name;
    }
  };

  // Get context-aware colors for specific icon types
  const getContextualColor = (name: IconName): string => {
    if (color) return color; // Explicit color takes precedence

    // Special colors for specific icons
    switch (name) {
      case 'gainers':
        return colors.verdictPositive600 || '#10B981';
      case 'losers':
        return colors.verdictNegative600 || '#EF4444';
      case 'btc':
        return '#F7931A'; // Bitcoin orange
      case 'heart':
      case 'like':
        return colors.verdictNegative600 || '#EF4444';
      case 'notification':
        return '#F59E0B'; // Warning color
      case 'torii':
        return colors.primary600 || '#00C896'; // eToro brand color
      default:
        return colors.carbon900;
    }
  };

  const themeAwareIconName = getThemeAwareIconName(iconName);
  const contextualColor = getContextualColor(iconName);

  return {
    iconName: themeAwareIconName,
    color: contextualColor,
    metadata,
    theme: colors,
  };
}
