import { useMemo } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { TextVariant } from '../../../foundations/text/utils';

export interface ReadMoreTextConfig {
  textColor: string;
  actionTextColor: string;
  entityTextColor: string;
  textVariant: TextVariant;
  actionTextVariant: TextVariant;
  maxLines: number;
  showMoreText: string;
  showLessText: string;
}

/**
 * Processes props into component configuration.
 * Resolves theme colors and default values.
 */
export function useReadMoreTextConfig({
  textVariant = 'body-secondary-regular',
  actionTextVariant = 'body-secondary-semibold',
  maxLines = 4,
  showMoreText = 'Show More',
  showLessText = 'Show Less',
}: {
  textVariant?: TextVariant;
  actionTextVariant?: TextVariant;
  maxLines?: number;
  showMoreText?: string;
  showLessText?: string;
}): ReadMoreTextConfig {
  const { colors } = useEtoroTheme();

  return useMemo(
    () => ({
      textColor: colors.textPrimaryNeutral,
      actionTextColor: colors.textPrimaryNeutral,
      entityTextColor: colors.actionBrandText,
      textVariant,
      actionTextVariant,
      maxLines,
      showMoreText,
      showLessText,
    }),
    [colors.textPrimaryNeutral, colors.actionBrandText, textVariant, actionTextVariant, maxLines, showMoreText, showLessText],
  );
}
