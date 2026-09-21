import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TickerItem as TickerItemType } from '../api';
import { EtTicker } from '../et-ticker';

// Mock useEtoroTheme
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textSecondaryNeutral: '#666666',
      statusPositive: '#00CC44',
      statusNegative: '#FF3366',
    },
  }),
}));

// Mock EtoroIcon to capture icon names
jest.mock('../../../../foundations/icon-assets', () => ({
  EtoroIcon: ({ icon, accessibility, ...props }: any) => {
    const MockView = require('react-native').View;
    return <MockView testID={accessibility?.testID} data-icon={icon.iconName} {...props} />;
  },
}));

const mockItem: TickerItemType = {
  instrumentId: 1,
  name: 'AAPL',
  currentPrice: 150.25,
  dailyChange: 2.5,
  navigationUrl: '/instruments/1',
};

const mockNegativeItem: TickerItemType = {
  instrumentId: 2,
  name: 'TSLA',
  currentPrice: 800.5,
  dailyChange: -1.2,
  navigationUrl: '/instruments/2',
};

describe('TickerItem', () => {
  describe('Rendering', () => {
    it('should render ticker item with name, price, and change', () => {
      const { getByText } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} testID="ticker-item" />
        </EtTicker>,
      );

      expect(getByText('AAPL')).toBeDefined();
      expect(getByText('$150.25')).toBeDefined();
      expect(getByText('2.50%')).toBeDefined();
    });

    it('should disable Android font padding for every ticker text line', () => {
      const { getByText } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      for (const text of ['AAPL', '$150.25', '2.50%']) {
        expect(StyleSheet.flatten(getByText(text).props.style)?.includeFontPadding).toBe(false);
      }
    });

    it('should render with custom testID', () => {
      const { getByTestId } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} testID="custom-item" />
        </EtTicker>,
      );

      expect(getByTestId('custom-item')).toBeDefined();
    });

    it('should format price correctly for values >= $1000', () => {
      const largeItem = { ...mockItem, currentPrice: 2500 };
      const { getByText } = render(
        <EtTicker items={[largeItem]}>
          <EtTicker.Item item={largeItem} />
        </EtTicker>,
      );

      expect(getByText('$2,500')).toBeDefined();
    });

    it('should format price correctly for values < $1', () => {
      const smallItem = { ...mockItem, currentPrice: 0.1234 };
      const { getByText } = render(
        <EtTicker items={[smallItem]}>
          <EtTicker.Item item={smallItem} />
        </EtTicker>,
      );

      expect(getByText('$0.1234')).toBeDefined();
    });

    it('should respect custom currency symbol', () => {
      const euroItem = { ...mockItem, currencySymbol: '€' };
      const { getByText } = render(
        <EtTicker items={[euroItem]}>
          <EtTicker.Item item={euroItem} />
        </EtTicker>,
      );

      expect(getByText('€150.25')).toBeDefined();
    });
  });

  describe('Daily change display', () => {
    it('should keep the PnL caret on the left of the percentage in RTL', () => {
      const { getByTestId } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      expect(getByTestId('1-change-icon')).toBeDefined();

      const changeRow = getByTestId('1-change-row');
      expect(StyleSheet.flatten(changeRow.props.style)).toEqual(
        expect.objectContaining({
          direction: 'ltr',
          flexDirection: 'row',
        }),
      );
    });

    it('should show positive change with caret-up icon', () => {
      const { getByText, getByTestId } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      expect(getByText('2.50%')).toBeDefined();
      const icon = getByTestId('1-change-icon');
      expect(icon).toBeDefined();
      // Verify icon direction
      expect(icon.props['data-icon']).toBe('caretUp');
    });

    it('should show negative change with caret-down icon', () => {
      const { getByText, getByTestId } = render(
        <EtTicker items={[mockNegativeItem]}>
          <EtTicker.Item item={mockNegativeItem} />
        </EtTicker>,
      );

      expect(getByText('1.20%')).toBeDefined();
      const icon = getByTestId('2-change-icon');
      expect(icon).toBeDefined();
      // Verify icon direction
      expect(icon.props['data-icon']).toBe('caretDown');
    });

    it('should display absolute value of daily change', () => {
      const { getByText } = render(
        <EtTicker items={[mockNegativeItem]}>
          <EtTicker.Item item={mockNegativeItem} />
        </EtTicker>,
      );

      // Should show 1.20%, not -1.20%
      expect(getByText('1.20%')).toBeDefined();
    });

    it('should treat zero change as positive', () => {
      const zeroItem = { ...mockItem, dailyChange: 0 };
      const { getByText } = render(
        <EtTicker items={[zeroItem]}>
          <EtTicker.Item item={zeroItem} />
        </EtTicker>,
      );

      expect(getByText('0.00%')).toBeDefined();
    });

    it('should show dash without change icon when daily change is unavailable', () => {
      const unavailableItem = { ...mockItem, dailyChange: null };
      const { getByText, queryByTestId } = render(
        <EtTicker items={[unavailableItem]}>
          <EtTicker.Item item={unavailableItem} />
        </EtTicker>,
      );

      expect(getByText('-')).toBeDefined();
      expect(queryByTestId('1-change-icon')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label for positive change', () => {
      const { getByLabelText } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      expect(getByLabelText('AAPL at $150.25, up 2.50 percent')).toBeDefined();
    });

    it('should have correct accessibility label for negative change', () => {
      const { getByLabelText } = render(
        <EtTicker items={[mockNegativeItem]}>
          <EtTicker.Item item={mockNegativeItem} />
        </EtTicker>,
      );

      expect(getByLabelText('TSLA at $800.50, down 1.20 percent')).toBeDefined();
    });

    it('should announce unavailable daily change', () => {
      const unavailableItem = { ...mockItem, dailyChange: null };
      const { getByLabelText } = render(
        <EtTicker items={[unavailableItem]}>
          <EtTicker.Item item={unavailableItem} />
        </EtTicker>,
      );

      expect(getByLabelText('AAPL at $150.25, change unavailable')).toBeDefined();
    });

    it('should have accessibility role when interactive', () => {
      const onItemPress = jest.fn();
      const { getByRole } = render(
        <EtTicker items={[mockItem]} onItemPress={onItemPress}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      const button = getByRole('button');
      expect(button).toBeDefined();
    });

    it('should not have button role when non-interactive', () => {
      const { queryByRole } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      const button = queryByRole('button');
      expect(button).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('should call onItemPress when name is pressed', () => {
      const onItemPress = jest.fn();
      const { getByText } = render(
        <EtTicker items={[mockItem]} onItemPress={onItemPress}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      fireEvent.press(getByText('AAPL'));
      expect(onItemPress).toHaveBeenCalledWith(mockItem);
    });

    it('should call onItemPress when price is pressed', () => {
      const onItemPress = jest.fn();
      const { getByText } = render(
        <EtTicker items={[mockItem]} onItemPress={onItemPress}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      fireEvent.press(getByText('$150.25'));
      expect(onItemPress).toHaveBeenCalledWith(mockItem);
    });

    it('should call onItemPress when change percentage is pressed', () => {
      const onItemPress = jest.fn();
      const { getByText } = render(
        <EtTicker items={[mockItem]} onItemPress={onItemPress}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      fireEvent.press(getByText('2.50%'));
      expect(onItemPress).toHaveBeenCalledWith(mockItem);
    });

    it('should not throw when onItemPress is not provided', () => {
      const { getByText } = render(
        <EtTicker items={[mockItem]}>
          <EtTicker.Item item={mockItem} />
        </EtTicker>,
      );

      expect(() => fireEvent.press(getByText('AAPL'))).not.toThrow();
    });
  });

  describe('Context errors', () => {
    it('should throw when used outside EtTicker', () => {
      // Import the raw component to bypass compound API
      const { TickerItem } = require('./ticker-item');

      expect(() => render(<TickerItem item={mockItem} />)).toThrow('EtTicker compound components must be used within an EtTicker component');
    });
  });
});
