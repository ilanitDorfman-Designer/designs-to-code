import type { eToroTheme } from '../../../../core/styles';
import type { ChangeSentiment } from '../api';

/**
 * Resolves the text color for an asset change indicator from the active theme.
 *
 * @param sentiment - The change sentiment (`positive`, `negative`, `neutral`).
 * @param colors - The active theme color palette (from `useEtoroTheme`).
 */
export function getChangeColor(sentiment: ChangeSentiment | undefined, colors: eToroTheme['colors']): string {
  switch (sentiment) {
    case 'positive':
      return colors.verdictPositive600;
    case 'negative':
      return colors.verdictNegative600;
    default:
      return colors.carbon900;
  }
}
