import { render } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { eToroTheme } from '../../../../core/styles';
import { AssetChart } from './asset-chart';

// Mock dependencies
jest.mock('../../../../foundations/text', () => ({
  EtText: ({ children }: any) => children,
}));

jest.mock('../../line-chart/et-line-chart', () => ({
  EtLineChart: () => 'MockLineChart',
}));

jest.mock('../utils', () => ({
  formatPrice: (price: number, currency?: string) => `$${price}${currency ? ` ${currency}` : ''}`,
  formatChange: (changeAmount: number, changePercentage: number) => `${changeAmount} (${changePercentage}%)`,
}));

// Note: react-native-reanimated is mocked globally in jest.setup.ts
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

const mockColors: eToroTheme = colorsMock;

const mockChartData = [
  { timestamp: '1234567890', price: 100 },
  { timestamp: '1234567891', price: 105 },
  { timestamp: '1234567892', price: 98 },
];

// Create a mock shared value object instead of calling the hook
// SharedValue is just an object with a .value property
const mockSelectedValue = { value: 0 } as SharedValue<number>;

describe('AssetChart', () => {
  const defaultProps = {
    currentPrice: 102.5,
    currency: 'USD',
    chartData: mockChartData,
    colors: mockColors.colors,
    selectedValue: mockSelectedValue,
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should return null when chartData is empty', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} chartData={[]} />);
      expect(toJSON()).toBeNull();
    });

    it('should return null when chartData is undefined', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} chartData={undefined as any} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('Props Handling', () => {
    it('should handle missing currency', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} currency={undefined} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle missing compactStats', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} compactStats={undefined} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle positive change percentage', () => {
      const compactStats = {
        changePercentage: 5.2,
        changeAmount: 2.5,
        changePeriod: '1D',
      };
      const { toJSON } = render(<AssetChart {...defaultProps} compactStats={compactStats} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle negative change percentage', () => {
      const compactStats = {
        changePercentage: -3.1,
        changeAmount: -1.8,
        changePeriod: '1D',
      };
      const { toJSON } = render(<AssetChart {...defaultProps} compactStats={compactStats} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle zero change percentage', () => {
      const compactStats = {
        changePercentage: 0,
        changeAmount: 0,
        changePeriod: '1D',
      };
      const { toJSON } = render(<AssetChart {...defaultProps} compactStats={compactStats} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large price values', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} currentPrice={999999.99} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very small price values', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} currentPrice={0.0001} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle single data point in chart', () => {
      const singlePointData = [{ timestamp: '1234567890', price: 100 }];
      const { toJSON } = render(<AssetChart {...defaultProps} chartData={singlePointData} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle large percentage changes', () => {
      const compactStats = {
        changePercentage: 150.75,
        changeAmount: 50.25,
        changePeriod: '1D',
      };
      const { toJSON } = render(<AssetChart {...defaultProps} compactStats={compactStats} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle different currencies', () => {
      const { toJSON } = render(<AssetChart {...defaultProps} currency="EUR" />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle complex chart data', () => {
      const complexChartData = [
        { timestamp: '1000', price: 50.5 },
        { timestamp: '2000', price: 75.25 },
        { timestamp: '3000', price: 60.75 },
        { timestamp: '4000', price: 80.0 },
      ];

      const { toJSON } = render(<AssetChart {...defaultProps} chartData={complexChartData} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle different selectedValue', () => {
      const customSelectedValue = { value: 42 } as any;
      const { toJSON } = render(<AssetChart {...defaultProps} selectedValue={customSelectedValue} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Component Integration', () => {
    it('should handle all props together', () => {
      const compactStats = {
        changePercentage: 1.5,
        changeAmount: 0.8,
        changePeriod: '1D',
      };
      const { toJSON } = render(
        <AssetChart
          currentPrice={99.99}
          currency="GBP"
          chartData={mockChartData}
          compactStats={compactStats}
          colors={mockColors.colors}
          selectedValue={mockSelectedValue}
        />,
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render consistently with same props', () => {
      const { toJSON: first } = render(<AssetChart {...defaultProps} />);
      const { toJSON: second } = render(<AssetChart {...defaultProps} />);

      expect(first()).toEqual(second());
    });
  });
});
