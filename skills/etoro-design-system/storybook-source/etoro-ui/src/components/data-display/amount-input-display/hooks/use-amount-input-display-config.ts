import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import type { EtAmountInputDisplayProps } from '../api/types';
import {
  DEFAULT_AFFIX_FONT_SIZE,
  DEFAULT_CURRENCY_FONT_SIZE,
  DEFAULT_DIGIT_ANCHOR,
  DEFAULT_DIGIT_HEIGHT,
  DEFAULT_DIGIT_WIDTH,
  DEFAULT_FONT_SIZE,
  DEFAULT_WEIGHT,
} from '../constants';
import type { AmountInputDisplayConfigContextValue } from '../context';

/**
 * Resolves props + theme into the geometry/color config shared with subcomponents (logic-only).
 * Memoized so the static config context stays referentially stable across value keystrokes.
 */
export function useAmountInputDisplayConfig(props: EtAmountInputDisplayProps): AmountInputDisplayConfigContextValue {
  const { colors } = useEtoroTheme();

  const {
    fontSize,
    digitWidth,
    digitHeight,
    affixFontSize,
    currencyFontSize,
    weight,
    digitAnchor,
    numberColor,
    affixColor,
    currencyColor,
    caretColor,
  } = props;

  return useMemo(
    () => ({
      fontSize: fontSize ?? DEFAULT_FONT_SIZE,
      digitWidth: digitWidth ?? DEFAULT_DIGIT_WIDTH,
      digitHeight: digitHeight ?? DEFAULT_DIGIT_HEIGHT,
      affixFontSize: affixFontSize ?? DEFAULT_AFFIX_FONT_SIZE,
      currencyFontSize: currencyFontSize ?? DEFAULT_CURRENCY_FONT_SIZE,
      weight: weight ?? DEFAULT_WEIGHT,
      digitAnchor: digitAnchor ?? DEFAULT_DIGIT_ANCHOR,
      numberColor: numberColor ?? colors.textPrimaryNeutral,
      affixColor: affixColor ?? colors.textSecondaryNeutral,
      currencyColor: currencyColor ?? colors.carbon600,
      caretColor: caretColor ?? colors.statusPositive,
    }),
    [
      fontSize,
      digitWidth,
      digitHeight,
      affixFontSize,
      currencyFontSize,
      weight,
      digitAnchor,
      numberColor,
      affixColor,
      currencyColor,
      caretColor,
      colors.textPrimaryNeutral,
      colors.textSecondaryNeutral,
      colors.carbon300,
      colors.statusPositive,
    ],
  );
}
