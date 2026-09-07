import { eToroTheme } from '../../../core/styles/colors';
import { PositionCardVariant } from '../api/types';

/**
 * Returns the appropriate background color for the invisible handle state.
 *
 * @param themeColors - Theme color palette
 * @param isDarkMode - Whether dark mode is active
 * @param variant - Sentiment: 'positive', 'negative', or 'neutral'
 */
export function getInvisibleHandleColor(themeColors: eToroTheme['colors'], isDarkMode: boolean, variant: PositionCardVariant) {
  // In dark mode, always use neutral card surface
  if (isDarkMode) {
    return themeColors.cardDefault;
  }

  // In light mode, match the card background based on sentiment
  switch (variant) {
    case 'positive':
      return themeColors.cardPositive;
    case 'negative':
      return themeColors.cardNegative;
    default:
      return themeColors.cardDefault; // neutral
  }
}
