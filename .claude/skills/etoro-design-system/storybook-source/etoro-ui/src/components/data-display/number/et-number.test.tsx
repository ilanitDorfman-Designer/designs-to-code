import { render } from '@testing-library/react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { EtNumber } from './et-number';

// Sentinel hex values for V2 tokens that the shared (V1-only) `colorsMock` doesn't expose.
const VERDICT_POSITIVE_600_SENTINEL = '#AA0501';
const VERDICT_NEGATIVE_600_SENTINEL = '#AA0502';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    dark: true,
    colors: {
      ...require('../../../core/hooks/__mocks__/colors-mock').colorsMock.colors,
      verdictPositive600: '#AA0501',
      verdictNegative600: '#AA0502',
      carbon900: '#AA0503',
    },
    gradients: {},
    fonts: {},
  }),
}));
jest.mock('../../../foundations/icon-assets', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    EtoroIcon: ({ appearance }: any) =>
      React.createElement(View, {
        testID: 'et-number-arrow-icon',
        style: { width: appearance?.size, height: appearance?.size, color: appearance?.color },
      }),
  };
});

function flattenStyle(style: StyleProp<TextStyle>): Record<string, unknown> {
  const flat = StyleSheet.flatten(style);
  return (flat as Record<string, unknown>) ?? {};
}

describe('EtNumber', () => {
  describe('Basic rendering', () => {
    it('renders with value and children', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('20.43%')).toBeTruthy();
    });

    it('renders value only without arrow', () => {
      const { queryByTestId, getByText } = render(
        <EtNumber value={42} format="number">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/^42(\.00)?$/)).toBeTruthy();
      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
    });

    it('passes numberOfLines to the rendered value text', () => {
      const { getByText } = render(
        <EtNumber value={42} format="number">
          <EtNumber.Value numberOfLines={1} />
        </EtNumber>,
      );

      expect(getByText(/^42(\.00)?$/).props.numberOfLines).toBe(1);
    });

    it('renders currency formatted value', () => {
      const { getByText } = render(
        <EtNumber value={1234.56} format="currency" symbol="$">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('$1,234.56')).toBeTruthy();
    });

    it('passes testID to the root container', () => {
      const { getByTestId } = render(
        <EtNumber value={1234.56} format="number" testID="portfolio-value">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByTestId('portfolio-value')).toBeTruthy();
    });
  });

  describe('Compound components', () => {
    it('renders Arrow and Value in given order', () => {
      const { getByText, toJSON } = render(
        <EtNumber value={-0.05} format="percentage">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/-5\.?0*%/)).toBeTruthy();
      const tree = toJSON();
      expect(tree).not.toBeNull();
    });

    it('renders Value before Arrow when children order is reversed', () => {
      const { getByText } = render(
        <EtNumber value={100} format="number">
          <EtNumber.Value />
          <EtNumber.Arrow />
        </EtNumber>,
      );

      expect(getByText(/^100(\.00)?$/)).toBeTruthy();
    });
  });

  describe('Display name', () => {
    it('exposes Arrow and Value as compound components', () => {
      expect(EtNumber.Arrow).toBeDefined();
      expect(EtNumber.Value).toBeDefined();
    });
  });

  describe('isColored', () => {
    it('applies verdictPositive600 style to Value when value >= 0', () => {
      const { getByText } = render(
        <EtNumber value={0.05} format="percentage" isColored>
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText(/5\.?0*%/);
      expect(flattenStyle(valueText.props.style).color).toBe(VERDICT_POSITIVE_600_SENTINEL);
    });

    it('applies verdictNegative600 style to Value when value < 0', () => {
      const { getByText } = render(
        <EtNumber value={-0.03} format="percentage" isColored>
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText(/-3\.?0*%/);
      expect(flattenStyle(valueText.props.style).color).toBe(VERDICT_NEGATIVE_600_SENTINEL);
    });

    it('applies verdictPositive600 to Value when value is zero and isColored', () => {
      const { getByText } = render(
        <EtNumber value={0} format="number" isColored>
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText(/^0(\.00)?$/);
      expect(flattenStyle(valueText.props.style).color).toBe(VERDICT_POSITIVE_600_SENTINEL);
    });
  });

  describe('showAbsoluteValue', () => {
    it('renders absolute numeric string while arrow direction follows raw sign', () => {
      const { getByText } = render(
        <EtNumber value={-2.95} format="currency" symbol="$" showAbsoluteValue isColored>
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText('$2.95');
      expect(valueText).toBeTruthy();
      expect(flattenStyle(valueText.props.style).color).toBe(VERDICT_NEGATIVE_600_SENTINEL);
    });

    it('shows absolute value for positive number (unchanged display)', () => {
      const { getByText } = render(
        <EtNumber value={1.5} format="number" showAbsoluteValue>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/^1\.50$/)).toBeTruthy();
    });
  });

  describe('showSign', () => {
    it('prepends + for positive values', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage" showSign>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('+20.43%')).toBeTruthy();
    });

    it('keeps - prefix for negative values unchanged', () => {
      const { getByText } = render(
        <EtNumber value={-0.05} format="percentage" showSign>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/^-5\.?0*%$/)).toBeTruthy();
    });

    it('prepends + for zero', () => {
      const { getByText } = render(
        <EtNumber value={0} format="number" showSign>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/^\+0(\.00)?$/)).toBeTruthy();
    });

    it('combines showSign with hasParentheses', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage" showSign hasParentheses>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('(+20.43%)')).toBeTruthy();
    });

    it('combines showSign with showAbsoluteValue for negative values', () => {
      const { getByText } = render(
        <EtNumber value={-2.95} format="currency" symbol="$" showSign showAbsoluteValue>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('-$2.95')).toBeTruthy();
    });

    it('combines showSign with showAbsoluteValue for positive values', () => {
      const { getByText } = render(
        <EtNumber value={2.95} format="currency" symbol="$" showSign showAbsoluteValue>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('+$2.95')).toBeTruthy();
    });
  });

  describe('custom color', () => {
    it('overrides default coloring for Value and Arrow', () => {
      const customColor = '#A1B2C3';
      const { getByText } = render(
        <EtNumber value={-0.1} format="percentage" color={customColor}>
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText(/-10\.?0*%/);
      expect(flattenStyle(valueText.props.style).color).toBe(customColor);
    });
  });

  describe('locale', () => {
    it('produces en-US locale-specific separators', () => {
      const { getByText } = render(
        <EtNumber value={1234.56} format="number" locale="en-US">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('1,234.56')).toBeTruthy();
    });

    it('produces de-DE locale-specific separators', () => {
      const { getByText } = render(
        <EtNumber value={1234.56} format="number" locale="de-DE">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('1.234,56')).toBeTruthy();
    });
  });

  describe('NaN and non-finite values', () => {
    it('renders nothing for NaN (no value text, no arrow)', () => {
      const { queryByText, queryByTestId } = render(
        <EtNumber value={Number.NaN} format="number">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for Infinity', () => {
      const { queryByText, queryByTestId } = render(
        <EtNumber value={Number.POSITIVE_INFINITY} format="number">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for -Infinity', () => {
      const { queryByText, queryByTestId } = render(
        <EtNumber value={Number.NEGATIVE_INFINITY} format="number">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for null', () => {
      const { queryByText, queryByTestId } = render(
        <EtNumber value={null} format="number">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
      expect(queryByText(/\d/)).toBeNull();
    });

    it('renders nothing for undefined', () => {
      const { queryByText, queryByTestId } = render(
        <EtNumber value={undefined} format="number">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
      expect(queryByText(/\d/)).toBeNull();
    });
  });

  describe('fallback', () => {
    it('renders fallback text when value is null', () => {
      const { getByText } = render(
        <EtNumber value={null} format="number" fallback="--">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('--')).toBeTruthy();
    });

    it('renders fallback text when value is undefined', () => {
      const { getByText } = render(
        <EtNumber value={undefined} format="number" fallback="N/A">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('N/A')).toBeTruthy();
    });

    it('renders fallback text when value is NaN', () => {
      const { getByText } = render(
        <EtNumber value={Number.NaN} format="number" fallback="--">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('--')).toBeTruthy();
    });

    it('does not render arrow when value is null even with fallback', () => {
      const { queryByTestId } = render(
        <EtNumber value={null} format="number" fallback="--">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
    });

    it('uses the value variant for fallback text when fallbackVariant is not provided', () => {
      const { getByText } = render(
        <EtNumber value={null} format="number" fallback="--">
          <EtNumber.Value variant="label-primary-semibold" />
        </EtNumber>,
      );

      // label-primary-semibold has size 16
      expect(flattenStyle(getByText('--').props.style).fontSize).toBe(16);
    });

    it('applies fallbackVariant typography to fallback text independently of the value variant', () => {
      const { getByText } = render(
        <EtNumber value={null} format="number" fallback="--">
          <EtNumber.Value variant="label-primary-semibold" fallbackVariant="label-tertiary-regular" />
        </EtNumber>,
      );

      // label-tertiary-regular has size 12, not 16 (label-primary-semibold)
      expect(flattenStyle(getByText('--').props.style).fontSize).toBe(12);
    });

    it('uses fallbackVariant for NaN value', () => {
      const { getByText } = render(
        <EtNumber value={Number.NaN} format="number" fallback="N/A">
          <EtNumber.Value variant="num-ml" fallbackVariant="body-secondary-regular" />
        </EtNumber>,
      );

      // body-secondary-regular has size 14, not 20 (num-ml)
      expect(flattenStyle(getByText('N/A').props.style).fontSize).toBe(14);
    });
  });

  describe('format="compact"', () => {
    it('formats thousands with K suffix', () => {
      const { getByText } = render(
        <EtNumber value={1500} format="compact">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('1.5K')).toBeTruthy();
    });

    it('formats millions with M suffix', () => {
      const { getByText } = render(
        <EtNumber value={2500000} format="compact">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('2.5M')).toBeTruthy();
    });

    it('formats whole thousands without decimal', () => {
      const { getByText } = render(
        <EtNumber value={5000} format="compact">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('5K')).toBeTruthy();
    });

    it('formats small values as plain string', () => {
      const { getByText } = render(
        <EtNumber value={999} format="compact">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('999')).toBeTruthy();
    });
  });

  describe('Arrow size prop', () => {
    it('renders Arrow with custom size prop', () => {
      const { getByText } = render(
        <EtNumber value={10} format="number">
          <EtNumber.Arrow size={16} />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/^10(\.00)?$/)).toBeTruthy();
    });

    it('renders Arrow with default size', () => {
      const { getByText } = render(
        <EtNumber value={10} format="number">
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText(/^10(\.00)?$/)).toBeTruthy();
    });
  });

  describe('Value prefix and suffix props', () => {
    it('renders prefix before formatted value', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage">
          <EtNumber.Value prefix="(" />
        </EtNumber>,
      );

      expect(getByText('(20.43%')).toBeTruthy();
    });

    it('renders suffix after formatted value', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage">
          <EtNumber.Value suffix=")" />
        </EtNumber>,
      );

      expect(getByText('20.43%)')).toBeTruthy();
    });

    it('renders both prefix and suffix wrapping formatted value', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage">
          <EtNumber.Value prefix="(" suffix=")" />
        </EtNumber>,
      );

      expect(getByText('(20.43%)')).toBeTruthy();
    });

    it('combines prefix/suffix with isColored', () => {
      const { getByText } = render(
        <EtNumber value={-0.15} format="percentage" isColored>
          <EtNumber.Value prefix="(" suffix=")" />
        </EtNumber>,
      );

      const valueText = getByText(/\(-15\.?0*%\)/);
      expect(valueText).toBeTruthy();
      expect(flattenStyle(valueText.props.style).color).toBe(VERDICT_NEGATIVE_600_SENTINEL);
    });

    it('combines prefix/suffix with showSign', () => {
      const { getByText } = render(
        <EtNumber value={0.2043} format="percentage" showSign>
          <EtNumber.Value prefix="[" suffix="]" />
        </EtNumber>,
      );

      expect(getByText('[+20.43%]')).toBeTruthy();
    });
  });

  describe('font figures', () => {
    it('does not apply tabular-nums fontVariant by default to Value', () => {
      const { getByText } = render(
        <EtNumber value={1234.56} format="number">
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText('1,234.56');
      expect(flattenStyle(valueText.props.style).fontVariant).toBeUndefined();
    });

    it('does not apply tabular-nums fontVariant to fallback rendering', () => {
      const { getByText } = render(
        <EtNumber value={null} format="number" fallback="--">
          <EtNumber.Value />
        </EtNumber>,
      );

      const fallbackText = getByText('--');
      expect(flattenStyle(fallbackText.props.style).fontVariant).toBeUndefined();
    });

    it('allows callers to set fontVariant via style prop', () => {
      const { getByText } = render(
        <EtNumber value={42} format="number">
          <EtNumber.Value style={{ fontVariant: ['lining-nums'] }} />
        </EtNumber>,
      );

      const valueText = getByText(/^42(\.00)?$/);
      expect(flattenStyle(valueText.props.style).fontVariant).toEqual(['lining-nums']);
    });
  });

  describe('isMasked', () => {
    it('renders default mask placeholder instead of formatted value', () => {
      const { getByText } = render(
        <EtNumber value={1517.35} format="currency" symbol="$" isMasked>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('*******')).toBeTruthy();
    });

    it('renders maskLength asterisks when provided', () => {
      const { getByText } = render(
        <EtNumber value={3178.47} format="currency" symbol="$" isMasked maskLength={6}>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('******')).toBeTruthy();
    });

    it('hides Arrow when isMasked so direction is not leaked', () => {
      const { getByText, queryByTestId } = render(
        <EtNumber value={-182.33} format="number" isColored isMasked>
          <EtNumber.Arrow />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('*******')).toBeTruthy();
      expect(queryByTestId('et-number-arrow-icon')).toBeNull();
    });

    it('renders Arrow while masked when the caller explicitly opts in', () => {
      const { getByText, getByTestId } = render(
        <EtNumber value={-182.33} format="number" isColored isMasked>
          <EtNumber.Arrow showWhenMasked />
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('*******')).toBeTruthy();
      expect(getByTestId('et-number-arrow-icon')).toBeTruthy();
    });

    it('uses neutral color for masked value even when isColored', () => {
      const { getByText } = render(
        <EtNumber value={-182.33} format="number" isColored isMasked>
          <EtNumber.Value />
        </EtNumber>,
      );

      const valueText = getByText('*******');
      expect(flattenStyle(valueText.props.style).color).toBe(
        require('../../../core/hooks/__mocks__/colors-mock').colorsMock.colors.textPrimaryNeutral,
      );
    });

    it('still renders real value when isMasked is false', () => {
      const { getByText } = render(
        <EtNumber value={-0.1073} format="percentage" isColored showSign hasParentheses>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('(-10.73%)')).toBeTruthy();
    });
  });

  describe('useGrouping', () => {
    it('includes thousand separators by default', () => {
      const { getByText } = render(
        <EtNumber value={1234567.89} format="number">
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('1,234,567.89')).toBeTruthy();
    });

    it('omits thousand separators when useGrouping={false}', () => {
      const { getByText } = render(
        <EtNumber value={1234567.89} format="number" useGrouping={false}>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('1234567.89')).toBeTruthy();
    });

    it('works with custom maxDecimals and no grouping', () => {
      const { getByText } = render(
        <EtNumber value={0.123456} format="number" useGrouping={false} maxDecimals={6} minDecimals={6}>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('0.123456')).toBeTruthy();
    });

    it('strips trailing zeros when minDecimals=0 and no grouping', () => {
      const { getByText } = render(
        <EtNumber value={150.1} format="number" useGrouping={false} minDecimals={0} maxDecimals={2}>
          <EtNumber.Value />
        </EtNumber>,
      );

      expect(getByText('150.1')).toBeTruthy();
    });
  });
});
