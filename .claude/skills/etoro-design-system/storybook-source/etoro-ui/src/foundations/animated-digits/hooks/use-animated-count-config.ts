// ==============================================
// EtAnimatedCount configuration hook (derivation only)
// ==============================================

import { getFinancialNumberLocale } from '@etoro/common/infra/translations';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useEtoroTheme } from '../../../core/hooks';
import type { EtAnimatedCountProps, ParsedCharacter, ProcessedAnimatedCountProps } from '../api';
import { buildCharacterKeys, getDecimalSeparator, initProps, parseCharacters } from '../utils';

export interface AnimatedCountConfig {
  processedProps: ProcessedAnimatedCountProps;
  disableAnimation: boolean;
  enterFromBlank: boolean;
  characters: ParsedCharacter[];
  keys: string[];
  /** Index of the trailing digit (the just-typed digit in leading mode); -1 when there are no digits. */
  lastDigitIndex: number;
  textStyle: { color: string; fontSize: number; lineHeight?: number };
}

/**
 * Resolves all derived rendering configuration from props: processed defaults, the formatted string,
 * parsed characters with stable keys, the trailing-digit index, and the text style. Pure derivation
 * (no local state, no side effects).
 */
export function useAnimatedCountConfig(props: EtAnimatedCountProps): AnimatedCountConfig {
  const { i18n } = useTranslation();
  const { colors } = useEtoroTheme();
  const financialNumberLocale = getFinancialNumberLocale(i18n.language);

  const processedProps = initProps(props, financialNumberLocale);

  const disableAnimation = props.disableAnimation ?? false;
  const digitAnchor = props.digitAnchor ?? 'decimal';
  const enterFromBlank = digitAnchor === 'leading';

  const formattedNumber = useMemo(() => {
    const num = processedProps.number;
    if (typeof num === 'string') {
      return num;
    }
    return num.toLocaleString(processedProps.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [processedProps.number, processedProps.locale]);

  // Number inputs are formatted with `locale`, so anchor parsing on that locale's decimal separator.
  // Pre-formatted string inputs keep the default '.' since their separator is caller-controlled.
  const decimalSeparator = useMemo(
    () => (typeof processedProps.number === 'number' ? getDecimalSeparator(processedProps.locale) : '.'),
    [processedProps.number, processedProps.locale],
  );

  const characters = useMemo(() => parseCharacters(formattedNumber, decimalSeparator), [formattedNumber, decimalSeparator]);

  // Stable per-character keys so digit slots keep their identity across value changes.
  const keys = useMemo(() => buildCharacterKeys(characters, digitAnchor), [characters, digitAnchor]);

  const lastDigitIndex = useMemo(() => {
    for (let i = characters.length - 1; i >= 0; i--) {
      if (characters[i].isDigit) return i;
    }
    return -1;
  }, [characters]);

  const textStyle = useMemo(
    () => ({
      color: processedProps.color || colors.textPrimaryNeutral,
      fontSize: processedProps.fontSize,
      ...(processedProps.lineHeight ? { lineHeight: processedProps.lineHeight } : {}),
    }),
    [colors.textPrimaryNeutral, processedProps.color, processedProps.fontSize, processedProps.lineHeight],
  );

  return { processedProps, disableAnimation, enterFromBlank, characters, keys, lastDigitIndex, textStyle };
}
