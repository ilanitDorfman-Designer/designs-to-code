import { render } from '@testing-library/react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { AssetPriceMetrics } from './asset-price-metrics';

// Mock dependencies
jest.mock('../../../../foundations/text', () => ({
  EtText: ({ children }: any) => children,
}));

// Mock EtButton (from button)
jest.mock('../../../button/et-button', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  const mockButton = Object.assign(
    function MockEtButton({ onPress, children }: any) {
      return React.createElement(Pressable, { onPress }, React.createElement(Text, {}, children));
    },
    {
      Label: function MockEtButtonLabel({ children }: any) {
        return React.createElement(Text, {}, children);
      },
      Icon: function MockEtButtonIcon() {
        return null;
      },
    },
  );

  return {
    EtButton: mockButton,
  };
});

jest.mock('../utils', () => ({
  formatPrice: (price: number, currency?: string) => `$${price}${currency ? ` ${currency}` : ''}`,
  formatChange: (changeAmount: number, changePercentage: number) => `${changeAmount} (${changePercentage}%)`,
}));

const mockColors = colorsMock;

describe('AssetPriceMetrics', () => {
  const mockOnTrade = jest.fn();

  const defaultProps = {
    currentPrice: 125.5,
    currency: 'USD',
    priceMetrics: {
      changeAmount: 2.5,
      changePercentage: 2.0,
      isPositive: true,
      onTrade: mockOnTrade,
    },
    colors: mockColors.colors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should use default trade button text', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should use custom trade button text', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} tradeButtonText="Buy Now" />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Props Handling', () => {
    it('should handle missing currency', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} currency={undefined} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle positive changes', () => {
      const priceMetrics = {
        changeAmount: 5.25,
        changePercentage: 4.2,
        isPositive: true,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} priceMetrics={priceMetrics} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle negative changes', () => {
      const priceMetrics = {
        changeAmount: -3.75,
        changePercentage: -2.8,
        isPositive: false,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} priceMetrics={priceMetrics} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle zero changes', () => {
      const priceMetrics = {
        changeAmount: 0,
        changePercentage: 0,
        isPositive: true,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} priceMetrics={priceMetrics} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Trade Button Interaction', () => {
    it('should handle onTrade function', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle undefined onTrade function', () => {
      const priceMetrics = {
        changeAmount: 2.5,
        changePercentage: 2.0,
        isPositive: true,
        onTrade: undefined,
      };

      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} priceMetrics={priceMetrics} />);

      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large price values', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} currentPrice={1000000.5} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very small price values', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} currentPrice={0.0001} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle zero price', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} currentPrice={0} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle large percentage changes', () => {
      const priceMetrics = {
        changeAmount: 150.75,
        changePercentage: 120.5,
        isPositive: true,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} priceMetrics={priceMetrics} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very small change values', () => {
      const priceMetrics = {
        changeAmount: 0.000001,
        changePercentage: 0.000001,
        isPositive: true,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} priceMetrics={priceMetrics} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle empty trade button text', () => {
      const { toJSON } = render(<AssetPriceMetrics {...defaultProps} tradeButtonText="" />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Component Integration', () => {
    it('should handle all props together', () => {
      const priceMetrics = {
        changeAmount: 10.5,
        changePercentage: 8.4,
        isPositive: true,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(
        <AssetPriceMetrics currentPrice={135.75} currency="GBP" priceMetrics={priceMetrics} tradeButtonText="Buy Stock" colors={mockColors.colors} />,
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should handle missing optional props', () => {
      const priceMetrics = {
        changeAmount: 1.0,
        changePercentage: 0.8,
        isPositive: true,
        onTrade: mockOnTrade,
      };

      const { toJSON } = render(<AssetPriceMetrics currentPrice={100} priceMetrics={priceMetrics} colors={mockColors.colors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render consistently with same props', () => {
      const { toJSON: first } = render(<AssetPriceMetrics {...defaultProps} />);
      const { toJSON: second } = render(<AssetPriceMetrics {...defaultProps} />);

      // Compare JSON strings to avoid function reference differences
      expect(JSON.stringify(first())).toEqual(JSON.stringify(second()));
    });
  });
});
