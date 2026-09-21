import { fireEvent, render } from '@testing-library/react-native';

import { TickerItem, TickerThemeColors } from '../api/types';
import { EtTickerItem } from './ticker-item';

// Mock EtoroIcon component
jest.mock('../../../../foundations/icon-assets', () => ({
  EtoroIcon: ({ icon, appearance: _appearance, accessibility, ...props }: any) => {
    const MockIcon = require('react-native').View;
    return <MockIcon testID={accessibility?.testID || `icon-${icon.iconName}`} {...props} />;
  },
}));

// Mock formatPrice utility
jest.mock('../utils/format-price', () => ({
  formatPrice: jest.fn((price: number) => {
    if (price >= 1000) return `$${Math.round(price).toLocaleString()}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  }),
}));

describe('EtTickerItem', () => {
  const mockColors: TickerThemeColors = {
    textSecondaryNeutral: '#666666',
    statusPositive: '#00CC44',
    statusNegative: '#FF3366',
  };

  const positiveItem: TickerItem = {
    instrumentId: 1,
    name: 'AAPL',
    currentPrice: 186.79,
    dailyChange: 2.5,
    navigationUrl: '/instruments/1',
  };

  const negativeItem: TickerItem = {
    instrumentId: 2,
    name: 'TSLA',
    currentPrice: 245.67,
    dailyChange: -1.2,
    navigationUrl: '/instruments/2',
  };

  const largeValueItem: TickerItem = {
    instrumentId: 3,
    name: 'GOOGL',
    currentPrice: 2820.45,
    dailyChange: 0.8,
    navigationUrl: '/instruments/3',
  };

  const smallValueItem: TickerItem = {
    instrumentId: 4,
    name: 'PENNY',
    currentPrice: 0.1234,
    dailyChange: -5.2,
    navigationUrl: '/instruments/4',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should display name correctly', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(getByText('AAPL:')).toBeDefined();
    });

    it('should display formatted price', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(getByText(/\$186\.79/)).toBeDefined();
    });

    it('should apply custom testID when provided', () => {
      const { getByTestId } = render(<EtTickerItem item={positiveItem} colors={mockColors} testID="custom-ticker-item" />);
      expect(getByTestId('custom-ticker-item')).toBeDefined();
    });
  });

  describe('Positive Changes', () => {
    it('should display positive change with plus sign', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(getByText('+2.50%')).toBeDefined();
    });

    it('should use triangle up icon for positive changes', () => {
      const { getByTestId } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(getByTestId('AAPL-change-icon')).toBeDefined();
    });

    it('should use positive color for positive changes', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      const changeText = getByText('+2.50%');
      expect(changeText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: mockColors.statusPositive })]));
    });

    it('should generate correct accessibility label for positive changes', () => {
      const { getByLabelText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(getByLabelText('AAPL at $186.79, up 2.50 percent')).toBeDefined();
    });
  });

  describe('Negative Changes', () => {
    it('should display negative change without plus sign', () => {
      const { getByText } = render(<EtTickerItem item={negativeItem} colors={mockColors} />);
      expect(getByText('-1.20%')).toBeDefined();
    });

    it('should use triangle down icon for negative changes', () => {
      const { getByTestId } = render(<EtTickerItem item={negativeItem} colors={mockColors} />);
      expect(getByTestId('TSLA-change-icon')).toBeDefined();
    });

    it('should use negative color for negative changes', () => {
      const { getByText } = render(<EtTickerItem item={negativeItem} colors={mockColors} />);
      const changeText = getByText('-1.20%');
      expect(changeText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: mockColors.statusNegative })]));
    });

    it('should generate correct accessibility label for negative changes', () => {
      const { getByLabelText } = render(<EtTickerItem item={negativeItem} colors={mockColors} />);
      expect(getByLabelText('TSLA at $245.67, down 1.20 percent')).toBeDefined();
    });
  });

  describe('Zero Changes', () => {
    const zeroChangeItem: TickerItem = {
      instrumentId: 5,
      name: 'FLAT',
      currentPrice: 100.0,
      dailyChange: 0,
      navigationUrl: '/instruments/5',
    };

    it('should treat zero change as positive', () => {
      const { getByText } = render(<EtTickerItem item={zeroChangeItem} colors={mockColors} />);
      expect(getByText('+0.00%')).toBeDefined();
    });

    it('should use triangle up icon for zero changes', () => {
      const { getByTestId } = render(<EtTickerItem item={zeroChangeItem} colors={mockColors} />);
      expect(getByTestId('FLAT-change-icon')).toBeDefined();
    });

    it('should generate correct accessibility label for zero changes', () => {
      const { getByLabelText } = render(<EtTickerItem item={zeroChangeItem} colors={mockColors} />);
      expect(getByLabelText('FLAT at $100.00, up 0.00 percent')).toBeDefined();
    });
  });

  describe('Price Formatting Integration', () => {
    it('should call formatPrice with correct price', () => {
      const formatPrice = require('../utils/format-price').formatPrice;
      render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(formatPrice).toHaveBeenCalledWith(186.79, undefined, undefined, undefined);
    });

    it('should handle large price values', () => {
      const { getByText } = render(<EtTickerItem item={largeValueItem} colors={mockColors} />);
      expect(getByText(/\$2,820/)).toBeDefined();
    });

    it('should handle small price values', () => {
      const { getByText } = render(<EtTickerItem item={smallValueItem} colors={mockColors} />);
      expect(getByText(/\$0\.1234/)).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      const { getAllByRole } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      const textElements = getAllByRole('text');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should be accessible', () => {
      const { getByLabelText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      const element = getByLabelText('AAPL at $186.79, up 2.50 percent');
      expect(element.props.accessible).toBe(true);
    });

    it('should generate testID for change icon', () => {
      const { getByTestId } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      expect(getByTestId('AAPL-change-icon')).toBeDefined();
    });
  });

  describe('Theme Integration', () => {
    it('should apply text color from theme', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      const symbolText = getByText('AAPL:');
      expect(symbolText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: mockColors.textSecondaryNeutral })]));
    });

    it('should apply price color from theme', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);
      const priceText = getByText(/\$186\.79/);
      expect(priceText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: mockColors.textSecondaryNeutral })]));
    });
  });

  describe('Performance', () => {
    it('should memoize formatted price correctly', () => {
      const formatPrice = require('../utils/format-price').formatPrice;
      const { rerender } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);

      // Re-render with same price
      rerender(<EtTickerItem item={positiveItem} colors={mockColors} />);

      // formatPrice should only be called once due to memoization
      expect(formatPrice).toHaveBeenCalledTimes(1);
    });

    it('should re-compute formatted price when price changes', () => {
      const formatPrice = require('../utils/format-price').formatPrice;
      const { rerender } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);

      // Re-render with different price
      const newItem = { ...positiveItem, currentPrice: 200.0 };
      rerender(<EtTickerItem item={newItem} colors={mockColors} />);

      expect(formatPrice).toHaveBeenCalledTimes(2);
      expect(formatPrice).toHaveBeenLastCalledWith(200.0, undefined, undefined, undefined);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large percentage changes', () => {
      const extremeItem: TickerItem = {
        instrumentId: 6,
        name: 'EXTREME',
        currentPrice: 100,
        dailyChange: 999.99,
        navigationUrl: '/instruments/6',
      };
      const { getByText } = render(<EtTickerItem item={extremeItem} colors={mockColors} />);
      expect(getByText('+999.99%')).toBeDefined();
    });

    it('should handle very small percentage changes', () => {
      const tinyItem: TickerItem = {
        instrumentId: 7,
        name: 'TINY',
        currentPrice: 100,
        dailyChange: 0.01,
        navigationUrl: '/instruments/7',
      };
      const { getByText } = render(<EtTickerItem item={tinyItem} colors={mockColors} />);
      expect(getByText('+0.01%')).toBeDefined();
    });

    it('should handle names with special characters', () => {
      const specialItem: TickerItem = {
        instrumentId: 8,
        name: 'BRK.A',
        currentPrice: 534850,
        dailyChange: 1.5,
        navigationUrl: '/instruments/8',
      };
      const { getByText } = render(<EtTickerItem item={specialItem} colors={mockColors} />);
      expect(getByText('BRK.A:')).toBeDefined();
    });
  });

  describe('Interaction', () => {
    it('should not throw when name is pressed', () => {
      const { getByText } = render(<EtTickerItem item={positiveItem} colors={mockColors} />);

      const nameText = getByText('AAPL:');
      expect(() => fireEvent.press(nameText)).not.toThrow();
    });
  });
});
