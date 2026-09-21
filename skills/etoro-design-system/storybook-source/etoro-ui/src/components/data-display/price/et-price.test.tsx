import { render } from '@testing-library/react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { useEtPriceContext } from './context';
import { EtPrice } from './et-price';

// Sentinel hex values for V2 tokens that the shared (V1-only) `colorsMock` doesn't expose.
const VERDICT_POSITIVE_600_SENTINEL = '#AA0601';
const VERDICT_NEGATIVE_600_SENTINEL = '#AA0602';
const VERDICT_POSITIVE_600_STATIC_SENTINEL = '#AA0604';
const VERDICT_NEGATIVE_600_STATIC_SENTINEL = '#AA0605';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    dark: true,
    colors: {
      ...require('../../../core/hooks/__mocks__/colors-mock').colorsMock.colors,
      verdictPositive600: '#AA0601',
      verdictNegative600: '#AA0602',
      verdictPositive600Static: '#AA0604',
      verdictNegative600Static: '#AA0605',
      carbon900: '#AA0603',
    },
    gradients: {},
    fonts: {},
  }),
}));
jest.mock('../../../foundations/icon-assets');

function flattenStyle(style: StyleProp<TextStyle>): Record<string, unknown> {
  const flat = StyleSheet.flatten(style);
  return (flat as Record<string, unknown>) ?? {};
}

describe('EtPrice', () => {
  describe('Basic rendering', () => {
    it('renders Value and Change together', () => {
      const { getByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
      expect(getByText('0.96')).toBeTruthy();
      expect(getByText('(+0.86%)')).toBeTruthy();
    });

    it('renders Value only without Change', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
      expect(queryByText(/[()%]/)).toBeNull();
    });

    it('renders Change only without Value', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('0.96')).toBeTruthy();
      expect(getByText('(+0.86%)')).toBeTruthy();
      expect(queryByText('113.24')).toBeNull();
    });

    it('renders only the relative change with percentageOnly (no absolute value, no parentheses)', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Change percentageOnly />
        </EtPrice>,
      );

      expect(getByText('+0.86%')).toBeTruthy();
      expect(queryByText('0.96')).toBeNull();
      expect(queryByText('(+0.86%)')).toBeNull();
    });
  });

  describe('Decimal precision', () => {
    it('uses up to 2 decimal places for price >= 1', () => {
      const { getByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
      expect(getByText('0.96')).toBeTruthy();
    });

    it('uses up to 5 decimal places for sub-dollar price (0 < price < 1)', () => {
      const { getByText } = render(
        <EtPrice price={0.00012} change={0.00001} changePercentage={9.09}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('0.00012')).toBeTruthy();
      expect(getByText('0.00001')).toBeTruthy();
    });

    it('uses 2-decimal rule when price is exactly 0', () => {
      const { getByText } = render(
        <EtPrice price={0} change={0}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('0')).toBeTruthy();
    });

    it('uses 2-decimal rule when price is exactly 1', () => {
      const { getByText } = render(
        <EtPrice price={1} change={0.5} changePercentage={50}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('1')).toBeTruthy();
    });

    it('strips trailing zeros from value', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={100}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('100')).toBeTruthy();
      expect(queryByText('100.00')).toBeNull();
    });

    it('change decimal precision follows price magnitude, not change magnitude', () => {
      // price >= 1 → maxDecimals=2 for change: 0.00001 rounds to "0"
      const { getByText: getWithHighPrice } = render(
        <EtPrice price={100} change={0.00001} changePercentage={0.001}>
          <EtPrice.Change />
        </EtPrice>,
      );
      expect(getWithHighPrice('0')).toBeTruthy();

      // price < 1 → maxDecimals=5 for change: 0.00001 renders in full
      const { getByText: getWithLowPrice } = render(
        <EtPrice price={0.0005} change={0.00001} changePercentage={2}>
          <EtPrice.Change />
        </EtPrice>,
      );
      expect(getWithLowPrice('0.00001')).toBeTruthy();
    });
  });

  describe('Caller-supplied precision', () => {
    it('renders an above-dollar fine-tick price at its real precision instead of 2 decimals', () => {
      // The magnitude rule would show EURUSD's 1.1565 as "1.16" (PAH-699).
      const { getByText, queryByText } = render(
        <EtPrice price={1.1565} decimals={5}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('1.15650')).toBeTruthy();
      expect(queryByText('1.16')).toBeNull();
    });

    it('keeps trailing zeros with decimals, so a price column stays digit-aligned', () => {
      const { getByText } = render(
        <EtPrice price={18} decimals={4}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('18.0000')).toBeTruthy();
    });

    it('applies the same precision to the absolute change, not just the price', () => {
      const { getByText } = render(
        <EtPrice price={1.1565} change={0.0009} changePercentage={0.08} decimals={5}>
          <EtPrice.Change />
        </EtPrice>,
      );

      // Without the override the magnitude rule rounds 0.0009 to a useless "0".
      expect(getByText('0.00090')).toBeTruthy();
    });

    it('preserves metadata precision and Static verdict colors together on bright surfaces', () => {
      const { getByText } = render(
        <EtPrice price={1.1565} change={0.0009} changePercentage={0.08} decimals={5}>
          <EtPrice.Change onBrightSurface />
        </EtPrice>,
      );

      const changeText = getByText('0.00090');

      expect(flattenStyle(changeText.props.style).color).toBe(VERDICT_POSITIVE_600_STATIC_SENTINEL);
    });

    it('leaves the percentage at 2 decimals — it is a ratio, not a quote', () => {
      const { getByText } = render(
        <EtPrice price={1.1565} change={0.0009} changePercentage={0.08} decimals={5}>
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('(+0.08%)')).toBeTruthy();
    });

    it('falls back to the magnitude rule when precision is not supplied', () => {
      const { getByText } = render(
        <EtPrice price={1.1565} decimals={undefined}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('1.16')).toBeTruthy();
    });
  });

  describe('Sign-based coloring', () => {
    it('applies verdictPositive600 color to both change elements when change is positive', () => {
      const { getByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Change />
        </EtPrice>,
      );

      const changeText = getByText('0.96');
      const pctText = getByText('(+0.86%)');

      expect(flattenStyle(changeText.props.style).color).toBe(VERDICT_POSITIVE_600_SENTINEL);
      expect(flattenStyle(pctText.props.style).color).toBe(VERDICT_POSITIVE_600_SENTINEL);
    });

    it('applies verdictNegative600 color to both change elements when change is negative', () => {
      const { getByText } = render(
        <EtPrice price={112.28} change={-1.06} changePercentage={-0.94}>
          <EtPrice.Change />
        </EtPrice>,
      );

      // showAbsoluteValue=true → displays absolute value "1.06"
      const changeText = getByText('1.06');
      const pctText = getByText('(-0.94%)');

      expect(flattenStyle(changeText.props.style).color).toBe(VERDICT_NEGATIVE_600_SENTINEL);
      expect(flattenStyle(pctText.props.style).color).toBe(VERDICT_NEGATIVE_600_SENTINEL);
    });

    it('applies verdictPositive600 color when change is zero (zero treated as non-negative)', () => {
      const { getByText } = render(
        <EtPrice price={113.24} change={0} changePercentage={0}>
          <EtPrice.Change />
        </EtPrice>,
      );

      const changeText = getByText('0');
      expect(flattenStyle(changeText.props.style).color).toBe(VERDICT_POSITIVE_600_SENTINEL);
    });

    it('uses Static verdict tokens on bright surfaces (readable on white in dark theme)', () => {
      const { getByText } = render(
        <EtPrice price={21.63} change={0.4} changePercentage={1.84}>
          <EtPrice.Change onBrightSurface />
        </EtPrice>,
      );

      const changeText = getByText('0.4');
      const pctText = getByText('(+1.84%)');

      expect(flattenStyle(changeText.props.style).color).toBe(VERDICT_POSITIVE_600_STATIC_SENTINEL);
      expect(flattenStyle(pctText.props.style).color).toBe(VERDICT_POSITIVE_600_STATIC_SENTINEL);
    });

    it('uses Static negative tokens on bright surfaces when change is negative', () => {
      const { getByText } = render(
        <EtPrice price={21.63} change={-0.4} changePercentage={-1.84}>
          <EtPrice.Change onBrightSurface />
        </EtPrice>,
      );

      const changeText = getByText('0.4');
      const pctText = getByText('(-1.84%)');

      expect(flattenStyle(changeText.props.style).color).toBe(VERDICT_NEGATIVE_600_STATIC_SENTINEL);
      expect(flattenStyle(pctText.props.style).color).toBe(VERDICT_NEGATIVE_600_STATIC_SENTINEL);
    });

    it('forces a single color (over the verdict tokens) when `color` is provided', () => {
      const FORCED = '#0A0B0C';
      const { getByText } = render(
        <EtPrice price={112.28} change={-1.06} changePercentage={-0.94}>
          <EtPrice.Change color={FORCED} onBrightSurface />
        </EtPrice>,
      );

      const changeText = getByText('1.06');
      const pctText = getByText('(-0.94%)');

      expect(flattenStyle(changeText.props.style).color).toBe(FORCED);
      expect(flattenStyle(pctText.props.style).color).toBe(FORCED);
    });

    it('renders Value with neutral color (not verdictPositive600 or verdictNegative600)', () => {
      const { getByText } = render(
        <EtPrice price={113.24}>
          <EtPrice.Value />
        </EtPrice>,
      );

      const valueText = getByText('113.24');
      const color = flattenStyle(valueText.props.style).color;

      expect(color).not.toBe(VERDICT_POSITIVE_600_SENTINEL);
      expect(color).not.toBe(VERDICT_NEGATIVE_600_SENTINEL);
    });
  });

  describe('Percentage formatting', () => {
    it('treats changePercentage as pre-multiplied: 0.86 renders as 0.86%, not 86%', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('(+0.86%)')).toBeTruthy();
      expect(queryByText('(+86%)')).toBeNull();
      expect(queryByText(/8600%/)).toBeNull();
    });

    it('renders positive percentage with sign and parentheses', () => {
      const { getByText } = render(
        <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('(+0.86%)')).toBeTruthy();
    });

    it('renders negative percentage with sign and parentheses', () => {
      const { getByText } = render(
        <EtPrice price={112.28} change={-1.06} changePercentage={-0.94}>
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('(-0.94%)')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('renders nothing for Value and Change when price is undefined', () => {
      const { queryByText } = render(
        <EtPrice change={0.96} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for Change but Value still renders when change is undefined', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
      expect(queryByText(/[()%]/)).toBeNull();
    });

    it('renders nothing for Value and Change when price is NaN', () => {
      const { queryByText } = render(
        <EtPrice price={Number.NaN} change={0.96} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for Value and Change when price is Infinity', () => {
      const { queryByText } = render(
        <EtPrice price={Number.POSITIVE_INFINITY} change={0.96} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for Value and Change when price is -Infinity', () => {
      const { queryByText } = render(
        <EtPrice price={Number.NEGATIVE_INFINITY} change={0.96} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for Change when change is NaN, Value still renders', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24} change={Number.NaN} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
      expect(queryByText(/[()%]/)).toBeNull();
    });

    it('renders nothing for Change when change is Infinity, Value still renders', () => {
      const { getByText, queryByText } = render(
        <EtPrice price={113.24} change={Number.POSITIVE_INFINITY} changePercentage={0.86}>
          <EtPrice.Value />
          <EtPrice.Change />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
      expect(queryByText(/[()%]/)).toBeNull();
    });
  });

  describe('Context', () => {
    it('useEtPriceContext throws when used outside EtPrice', () => {
      function BadComponent() {
        useEtPriceContext();
        return <View />;
      }

      expect(() => render(<BadComponent />)).toThrow('must be used within an EtPrice component');
    });
  });

  describe('displayName', () => {
    it('EtPrice has displayName "EtPrice"', () => {
      expect(EtPrice.displayName).toBe('EtPrice');
    });

    it('EtPrice.Value has displayName "EtPrice.Value"', () => {
      expect(EtPrice.Value.displayName).toBe('EtPrice.Value');
    });

    it('EtPrice.Change has displayName "EtPrice.Change"', () => {
      expect(EtPrice.Change.displayName).toBe('EtPrice.Change');
    });
  });

  describe('Compound component structure', () => {
    it('exposes Value and Change as static properties on EtPrice', () => {
      expect(EtPrice.Value).toBeDefined();
      expect(EtPrice.Change).toBeDefined();
    });

    it('accepts and applies custom style to root container without breaking rendering', () => {
      const { getByText } = render(
        <EtPrice price={113.24} style={{ margin: 10 }}>
          <EtPrice.Value />
        </EtPrice>,
      );

      expect(getByText('113.24')).toBeTruthy();
    });
  });
});
