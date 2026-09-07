import { render } from '@testing-library/react-native';

import type { TickerItem } from '../api';
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

const mockData: TickerItem[] = [
  {
    instrumentId: 1,
    name: 'AAPL',
    currentPrice: 150.25,
    dailyChange: 2.5,
    navigationUrl: '/instruments/1',
  },
  {
    instrumentId: 2,
    name: 'TSLA',
    currentPrice: 800.5,
    dailyChange: -1.2,
    navigationUrl: '/instruments/2',
  },
  {
    instrumentId: 3,
    name: 'GOOGL',
    currentPrice: 2820.45,
    dailyChange: 0.8,
    navigationUrl: '/instruments/3',
  },
];

describe('TickerContent', () => {
  describe('Rendering', () => {
    it('should render all provided items', () => {
      const { getByText } = render(
        <EtTicker items={mockData}>
          <EtTicker.Content items={mockData} />
        </EtTicker>,
      );

      expect(getByText('AAPL')).toBeDefined();
      expect(getByText('TSLA')).toBeDefined();
      expect(getByText('GOOGL')).toBeDefined();
    });

    it('should render items without separators', () => {
      const { queryAllByTestId } = render(
        <EtTicker items={mockData}>
          <EtTicker.Content items={mockData} />
        </EtTicker>,
      );

      const separators = queryAllByTestId(/separator-\d+/);
      expect(separators).toHaveLength(0);
    });

    it('should render items with correct testIDs', () => {
      const { getByTestId } = render(
        <EtTicker items={mockData}>
          <EtTicker.Content items={mockData} />
        </EtTicker>,
      );

      expect(getByTestId('ticker-item-1')).toBeDefined();
      expect(getByTestId('ticker-item-2')).toBeDefined();
      expect(getByTestId('ticker-item-3')).toBeDefined();
    });

    it('should handle single item', () => {
      const singleItem = [mockData[0]];
      const { getByText } = render(
        <EtTicker items={singleItem}>
          <EtTicker.Content items={singleItem} />
        </EtTicker>,
      );

      expect(getByText('AAPL')).toBeDefined();
    });

    it('should handle empty array gracefully', () => {
      const { toJSON } = render(
        <EtTicker items={[]}>
          <EtTicker.Content items={[]} />
        </EtTicker>,
      );

      // Should render without crashing
      expect(toJSON()).toBeDefined();
    });
  });

  describe('Integration with TickerItem', () => {
    it('should pass item data to TickerItem correctly', () => {
      const { getByText } = render(
        <EtTicker items={mockData}>
          <EtTicker.Content items={mockData} />
        </EtTicker>,
      );

      // Verify all item details are rendered
      expect(getByText('AAPL')).toBeDefined();
      expect(getByText('$150.25')).toBeDefined();
      expect(getByText('2.50%')).toBeDefined();
    });

    it('should maintain unique keys for items', () => {
      const { getByTestId } = render(
        <EtTicker items={mockData}>
          <EtTicker.Content items={mockData} />
        </EtTicker>,
      );

      // Check that all items are rendered with unique testIDs
      expect(getByTestId('ticker-item-1')).toBeDefined();
      expect(getByTestId('ticker-item-2')).toBeDefined();
      expect(getByTestId('ticker-item-3')).toBeDefined();
    });
  });

  describe('Item spacing behavior', () => {
    it('should render items with appropriate spacing via styles', () => {
      const { getByTestId } = render(
        <EtTicker items={mockData}>
          <EtTicker.Content items={mockData} />
        </EtTicker>,
      );

      // Verify all items are present
      const item1 = getByTestId('ticker-item-1');
      const item2 = getByTestId('ticker-item-2');
      const item3 = getByTestId('ticker-item-3');

      expect(item1).toBeDefined();
      expect(item2).toBeDefined();
      expect(item3).toBeDefined();

      // Verify spacing is applied via marginStart (20px between items - X5 constant; RTL-safe)
      expect(item1.props.style).toEqual(expect.objectContaining({ marginStart: 20 }));
      expect(item2.props.style).toEqual(expect.objectContaining({ marginStart: 20 }));
      expect(item3.props.style).toEqual(expect.objectContaining({ marginStart: 20 }));
    });
  });

  describe('Context errors', () => {
    it('should throw when used outside EtTicker', () => {
      const { TickerContent } = require('./ticker-content');

      expect(() => render(<TickerContent items={mockData} />)).toThrow('EtTicker compound components must be used within an EtTicker component');
    });
  });
});
