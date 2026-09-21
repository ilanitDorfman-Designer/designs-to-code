import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { colorsMock } from '../../../../../core/hooks/__mocks__/colors-mock';
import { TradeRenderer } from './trade-renderer';

function flattenStyle(style: StyleProp<TextStyle>): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style as Record<string, unknown>;
}

// Use the automatic theme mock (returns colorsMock) — same approach as sibling
// etoro-ui component tests (e.g. et-asset-info.spec.tsx).
jest.mock('../../../../../core/hooks/use-etoro-theme');

// EtChip fires light haptics on press (haptics default true), so stub the
// native module exactly like the sibling post/chip tests do.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

const baseProps = {
  symbolName: 'AAPL',
  displayName: 'Apple Inc.',
  avatarSource: 'https://example.com/aapl.png',
};

describe('EtPost.Trade (TradeRenderer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('always renders avatar + symbol even when price props are absent', () => {
      const { getByText, getByTestId } = render(<TradeRenderer {...baseProps} />);

      expect(getByText('AAPL')).toBeTruthy();
      expect(getByTestId('post-trade-tag-avatar')).toBeTruthy();
    });

    it('uses the default root and avatar testIDs', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} />);

      expect(getByTestId('post-trade-tag')).toBeTruthy();
      expect(getByTestId('post-trade-tag-avatar')).toBeTruthy();
    });

    it('honors a custom testID prefix', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} testID="feed-trade" />);

      expect(getByTestId('feed-trade')).toBeTruthy();
      expect(getByTestId('feed-trade-avatar')).toBeTruthy();
    });
  });

  describe('Current price visibility (FR-011)', () => {
    it('renders the price node when currentPrice is a finite positive number', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} currentPrice={186.79} />);

      expect(getByTestId('post-trade-tag-price')).toBeTruthy();
    });

    it('hides the price node when currentPrice is undefined', () => {
      const { queryByTestId } = render(<TradeRenderer {...baseProps} />);

      expect(queryByTestId('post-trade-tag-price')).toBeNull();
    });

    it('hides the price node while pricing is pending (currentPrice is 0)', () => {
      const { queryByTestId } = render(<TradeRenderer {...baseProps} currentPrice={0} />);

      expect(queryByTestId('post-trade-tag-price')).toBeNull();
    });
  });

  describe('Directional change visibility (FR-011)', () => {
    it('renders the change node when priceChangePercent is a finite number', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} priceChange={1.01} priceChangePercent={0.54} />);

      expect(getByTestId('post-trade-tag-change')).toBeTruthy();
    });

    it('hides the change node when priceChangePercent is undefined', () => {
      const { queryByTestId } = render(<TradeRenderer {...baseProps} />);

      expect(queryByTestId('post-trade-tag-change')).toBeNull();
    });

    it('hides the change node when priceChangePercent is NaN', () => {
      const { queryByTestId } = render(<TradeRenderer {...baseProps} priceChangePercent={NaN} />);

      expect(queryByTestId('post-trade-tag-change')).toBeNull();
    });

    it('hides the change node when priceChangePercent is not finite (Infinity)', () => {
      const { queryByTestId } = render(<TradeRenderer {...baseProps} priceChangePercent={Infinity} />);

      expect(queryByTestId('post-trade-tag-change')).toBeNull();
    });
  });

  describe('Directional change sign', () => {
    it('renders the change node for a positive price change', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} priceChange={1.01} priceChangePercent={0.54} />);

      expect(getByTestId('post-trade-tag-change')).toBeTruthy();
    });

    it('renders the change node for a negative price change', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} priceChange={-1.03} priceChangePercent={-1.03} />);

      expect(getByTestId('post-trade-tag-change')).toBeTruthy();
    });

    it('uses priceChangePercent sign for color when priceChange disagrees', () => {
      const { getByText } = render(<TradeRenderer {...baseProps} priceChange={1.01} priceChangePercent={-0.54} />);

      const valueText = getByText(/0\.54%/);
      expect(flattenStyle(valueText.props.style).color).toBe(colorsMock.colors.verdictNegative600);
    });
  });

  describe('Interaction', () => {
    it('calls onPress when the chip is pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(<TradeRenderer {...baseProps} onPress={onPress} />);

      fireEvent.press(getByTestId('post-trade-tag'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Defensive rendering', () => {
    it('renders without crashing when symbolName is an empty string', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} symbolName="" />);

      expect(getByTestId('post-trade-tag')).toBeTruthy();
      expect(getByTestId('post-trade-tag-avatar')).toBeTruthy();
    });

    it('renders without crashing when symbolName is missing', () => {
      const { getByTestId } = render(<TradeRenderer {...baseProps} symbolName={undefined as unknown as string} />);

      expect(getByTestId('post-trade-tag')).toBeTruthy();
    });
  });

  describe('displayName', () => {
    it('has the correct displayName', () => {
      expect(TradeRenderer.displayName).toBe('EtPost.Trade');
    });
  });
});
