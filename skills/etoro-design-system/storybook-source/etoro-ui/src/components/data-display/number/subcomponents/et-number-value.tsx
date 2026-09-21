import { formatCompactNumber, formatCurrency, formatNumberWithDecimals, formatPercent } from '@etoro/common/utils';
import { StyleProp, TextStyle } from 'react-native';

import type { EtTextProps } from '../../../../foundations/text';
import { EtText } from '../../../../foundations/text';
import type { TextVariant } from '../../../../foundations/text/utils/variant-config';
import { useEtNumberContext } from '../context';
import { useColor } from '../hooks';
import { resolveEtNumberMaskedText } from '../utils/masked-display';

type Props = {
  style?: StyleProp<TextStyle>;
  /**
   * Typography variant for the value text.
   * @default 'label-primary-semibold'
   */
  variant?: TextVariant;
  /**
   * Typography variant for the fallback text rendered when value is null, undefined, or non-finite.
   * @default the value's `variant`
   */
  fallbackVariant?: TextVariant;
  /** Text prepended to the formatted value, e.g. "(" */
  prefix?: string;
  /** Text appended to the formatted value, e.g. ")" */
  suffix?: string;
} & Pick<EtTextProps, 'shrinkToFit' | 'minimumFontScale' | 'scaleStep' | 'numberOfLines' | 'weight' | 'testID'>;

/**
 * EtNumber.Value - Formatted number from context.
 * Passes data options (symbol, minDecimals, maxDecimals, locale, useGrouping) directly to `@etoro/common/utils` formatters.
 *
 * When value is null, undefined, or non-finite:
 * - Renders the `fallback` text (if provided on the root EtNumber), styled with `fallbackVariant` when provided.
 * - Otherwise renders nothing.
 *
 * `showAbsoluteValue` formats `Math.abs(valueRaw)` as `value`; `showSign` prepends an explicit
 * sign based on the original `valueRaw`.
 *
 * Prefer `testID` on {@link EtNumberValue} (the text node) over the root `EtNumber` when Appium
 * needs to read the formatted value — iOS often exposes the root container as an empty Other.
 */
export function EtNumberValue({
  style,
  variant = 'label-primary-semibold',
  fallbackVariant = variant,
  prefix,
  suffix,
  shrinkToFit,
  minimumFontScale,
  scaleStep,
  numberOfLines,
  weight,
  testID,
}: Props) {
  const {
    value: valueRaw,
    format,
    symbol,
    minDecimals,
    maxDecimals,
    locale,
    useGrouping,
    showAbsoluteValue,
    showSign,
    hasParentheses,
    fallback,
    isMasked,
    maskLength,
  } = useEtNumberContext();
  const color = useColor();

  if (isMasked) {
    return (
      <EtText
        variant={variant}
        weight={weight}
        style={[{ color }, style]}
        shrinkToFit={shrinkToFit}
        minimumFontScale={minimumFontScale}
        scaleStep={scaleStep}
        numberOfLines={numberOfLines}
        testID={testID}
      >
        {resolveEtNumberMaskedText(maskLength)}
      </EtText>
    );
  }

  const isInvalidValue = valueRaw == null || !Number.isFinite(valueRaw);

  if (isInvalidValue) {
    if (fallback === undefined) return null;

    return (
      <EtText
        variant={fallbackVariant}
        weight={weight}
        style={[{ color }, style]}
        shrinkToFit={shrinkToFit}
        minimumFontScale={minimumFontScale}
        scaleStep={scaleStep}
        numberOfLines={numberOfLines}
        testID={testID}
      >
        {fallback}
      </EtText>
    );
  }

  const value = showAbsoluteValue ? Math.abs(valueRaw) : valueRaw;
  const options = {
    ...(symbol !== undefined && { symbol }),
    ...(minDecimals !== undefined && { minDecimals }),
    ...(maxDecimals !== undefined && { maxDecimals }),
    ...(locale !== undefined && { locale }),
    ...(!useGrouping && { useGrouping: false as const }),
  };

  let text: string;
  if (format === 'currency') {
    text = formatCurrency(value, options);
  } else if (format === 'percentage') {
    text = formatPercent(value, options);
  } else if (format === 'compact') {
    text = formatCompactNumber(value, '-', locale);
  } else {
    text = formatNumberWithDecimals(value, options);
  }

  if (showSign) {
    if (valueRaw >= 0) {
      text = `+${text}`;
    } else if (showAbsoluteValue) {
      text = `-${text}`;
    }
  }

  if (hasParentheses) {
    text = `(${text})`;
  }

  return (
    <EtText
      variant={variant}
      weight={weight}
      style={[{ color }, style]}
      shrinkToFit={shrinkToFit}
      minimumFontScale={minimumFontScale}
      scaleStep={scaleStep}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {prefix}
      {text}
      {suffix}
    </EtText>
  );
}

EtNumberValue.displayName = 'EtNumber.Value';
