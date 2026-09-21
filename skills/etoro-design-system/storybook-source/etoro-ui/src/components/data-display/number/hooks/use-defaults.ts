import { useMemo } from 'react';

import type { EtNumberContextValue, EtNumberFormatType, EtNumberProps } from '../api/types';

const DEFAULT_FORMAT: EtNumberFormatType = 'number';
const DEFAULT_LOCALE = 'en-US';

/**
 * Resolves EtNumber value and format props with defaults.
 * Returns context-ready shape with all defaults applied.
 */
export function useDefaults(props: EtNumberProps): EtNumberContextValue {
  const {
    value,
    currencyCode,
    format,
    symbol,
    minDecimals,
    maxDecimals,
    locale,
    useGrouping,
    showAbsoluteValue,
    showSign,
    hasParentheses,
    isColored,
    color,
    fallback,
    isMasked,
    maskLength,
  } = props;

  return useMemo<EtNumberContextValue>(
    () => ({
      value,
      isColored: isColored ?? false,
      isMasked: isMasked ?? false,
      format: format ?? DEFAULT_FORMAT,
      locale: locale ?? DEFAULT_LOCALE,
      useGrouping: useGrouping ?? true,
      showAbsoluteValue: showAbsoluteValue ?? false,
      showSign: showSign ?? false,
      hasParentheses: hasParentheses ?? false,
      ...(color !== undefined && { color }),
      ...(currencyCode !== undefined && { currencyCode }),
      ...(symbol !== undefined && { symbol }),
      ...(minDecimals !== undefined && { minDecimals }),
      ...(maxDecimals !== undefined && { maxDecimals }),
      ...(fallback !== undefined && { fallback }),
      ...(maskLength !== undefined && { maskLength }),
    }),
    [
      value,
      currencyCode,
      format,
      symbol,
      minDecimals,
      maxDecimals,
      locale,
      useGrouping,
      showAbsoluteValue,
      showSign,
      hasParentheses,
      isColored,
      color,
      fallback,
      isMasked,
      maskLength,
    ],
  );
}
