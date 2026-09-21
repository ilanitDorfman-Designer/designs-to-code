import type { eToroTheme } from '../../../../core/styles';
import type { ChangeSentiment } from '../api';

/**
 * Color pair (background + foreground) for an `EtAssetItem.RateChip`.
 */
export interface RateChipColors {
  bg: string;
  fg: string;
}

/**
 * Resolves the background and text color for an `EtAssetItem.RateChip` from the
 * active theme based on its sentiment.
 *
 * - `'positive'` → 15% green tint (`verdictPositive600Opacity15`), `verdictPositive600` text.
 * - `'negative'` → 15% red tint (`verdictNegative600Opacity15`), `verdictNegative600` text.
 * - `'neutral'`  → translucent `carbon900` 5% overlay, `carbon900` text.
 *
 * @param sentiment - The chip sentiment (`positive`, `negative`, `neutral`).
 * @param colors - The active theme color palette (from `useEtoroTheme`).
 */
export function getRateChipColors(sentiment: ChangeSentiment | undefined, colors: eToroTheme['colors']): RateChipColors {
  switch (sentiment) {
    case 'positive':
      return { bg: colors.verdictPositive600Opacity15, fg: colors.verdictPositive600 };
    case 'negative':
      return { bg: colors.verdictNegative600Opacity15, fg: colors.verdictNegative600 };
    default:
      return { bg: `${colors.carbon900}0D`, fg: colors.carbon900 };
  }
}
