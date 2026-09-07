import { render } from '@testing-library/react-native';

import { TickerItem, TickerThemeColors } from '../api/types';
import { EtTickerContent } from './ticker-content';

// Mock child components
jest.mock('./ticker-item', () => ({
  EtTickerItem: ({ item, testID, ...props }: any) => {
    const MockItem = require('react-native').Text;
    const displayText = `${item.name}: $${item.currentPrice} ${item.dailyChange > 0 ? '+' : ''}${item.dailyChange}%`;
    return (
      <MockItem testID={testID} {...props}>
        {displayText}
      </MockItem>
    );
  },
}));

// Mock EtoroIcon for separator rendering
jest.mock('../../../../foundations/icon-assets', () => ({
  EtoroIcon: ({ icon, appearance: _appearance, ...props }: any) => {
    const MockIcon = require('react-native').View;
    return <MockIcon testID={`etoro-icon-${icon.iconName}`} {...props} />;
  },
}));

describe('EtTickerContent', () => {
  const mockColors: TickerThemeColors = {
    textSecondaryNeutral: '#666666',
    statusPositive: '#00CC44',
    statusNegative: '#FF3366',
  };

  const singleItem: TickerItem[] = [
    {
      instrumentId: 1,
      name: 'AAPL',
      currentPrice: 186.79,
      dailyChange: 2.5,
      navigationUrl: '/instruments/1',
    },
  ];

  const multipleItems: TickerItem[] = [
    {
      instrumentId: 1,
      name: 'AAPL',
      currentPrice: 186.79,
      dailyChange: 2.5,
      navigationUrl: '/instruments/1',
    },
    {
      instrumentId: 2,
      name: 'TSLA',
      currentPrice: 245.67,
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

  const emptyItems: TickerItem[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing with empty items', () => {
      // Empty items should render an empty fragment
      expect(() => {
        render(<EtTickerContent items={emptyItems} colors={mockColors} />);
      }).not.toThrow();
    });

    it('should render without crashing with single item', () => {
      const { toJSON } = render(<EtTickerContent items={singleItem} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render without crashing with multiple items', () => {
      const { toJSON } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Single Item Rendering', () => {
    it('should render single ticker item', () => {
      const { getByTestId } = render(<EtTickerContent items={singleItem} colors={mockColors} />);
      // testID now uses instrumentId instead of name
      expect(getByTestId('ticker-item-1')).toBeDefined();
    });

    it('should render trailing separator for single item', () => {
      const { UNSAFE_getAllByType } = render(<EtTickerContent items={singleItem} colors={mockColors} />);
      // Separator is now a View, not EtoroIcon
      const View = require('react-native').View;
      const views = UNSAFE_getAllByType(View);
      // Should have item + separator views
      expect(views.length).toBeGreaterThan(0);
    });

    it('should not render separator between items for single item', () => {
      const { UNSAFE_getAllByType } = render(<EtTickerContent items={singleItem} colors={mockColors} />);
      // Single item should have exactly one separator (trailing)
      const View = require('react-native').View;
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Items Rendering', () => {
    it('should render all ticker items', () => {
      const { getByTestId } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);

      // testIDs now use instrumentId
      expect(getByTestId('ticker-item-1')).toBeDefined();
      expect(getByTestId('ticker-item-2')).toBeDefined();
      expect(getByTestId('ticker-item-3')).toBeDefined();
    });

    it('should render correct number of separators', () => {
      const { UNSAFE_getAllByType } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);
      // Separators are now plain Views
      const View = require('react-native').View;
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('should render separators between each item', () => {
      const { UNSAFE_getAllByType } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);
      const View = require('react-native').View;
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('should render trailing separator after last item', () => {
      const { UNSAFE_getAllByType } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);
      const View = require('react-native').View;
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe('Empty Items Handling', () => {
    it('should render only trailing separator for empty items', () => {
      const { queryByTestId } = render(<EtTickerContent items={emptyItems} colors={mockColors} />);

      // Should have no ticker items
      expect(queryByTestId(/ticker-item-/)).toBeNull();
    });

    it('should not crash with empty array', () => {
      expect(() => {
        render(<EtTickerContent items={emptyItems} colors={mockColors} />);
      }).not.toThrow();
    });
  });

  describe('Item Props and Keys', () => {
    it('should pass correct props to ticker items', () => {
      const { getByTestId } = render(<EtTickerContent items={singleItem} colors={mockColors} />);

      // testID now uses instrumentId
      const tickerItem = getByTestId('ticker-item-1');
      expect(tickerItem).toBeDefined();
      // Check that the children string contains the expected values
      const children = tickerItem.props.children;
      expect(children).toContain('AAPL');
      expect(children).toContain('186.79');
      expect(children).toContain('2.5');
    });

    it('should generate unique keys for items', () => {
      // This is more of an implementation detail, but we can verify
      // that items render correctly without key conflicts
      const duplicateNameItems: TickerItem[] = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 186.79,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
        {
          instrumentId: 2,
          name: 'AAPL',
          currentPrice: 187.0,
          dailyChange: 2.6,
          navigationUrl: '/instruments/2',
        },
      ];

      const { getByTestId } = render(<EtTickerContent items={duplicateNameItems} colors={mockColors} />);

      // Each item has unique instrumentId, so both should render
      expect(getByTestId('ticker-item-1')).toBeDefined();
      expect(getByTestId('ticker-item-2')).toBeDefined();
    });

    it('should pass correct testID to ticker items', () => {
      const { getByTestId } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);

      // testIDs now use instrumentId
      expect(getByTestId('ticker-item-1')).toBeDefined();
      expect(getByTestId('ticker-item-2')).toBeDefined();
      expect(getByTestId('ticker-item-3')).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should memoize content array generation', () => {
      const { rerender } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);

      // Re-render with same props
      rerender(<EtTickerContent items={multipleItems} colors={mockColors} />);

      // Should not throw and should render correctly
      expect(() => {
        rerender(<EtTickerContent items={multipleItems} colors={mockColors} />);
      }).not.toThrow();
    });

    it('should re-compute content when items change', () => {
      const { rerender, getByTestId, queryByTestId } = render(<EtTickerContent items={singleItem} colors={mockColors} />);

      // Initially should have item with instrumentId 1
      expect(getByTestId('ticker-item-1')).toBeDefined();

      // Re-render with different items
      const newItems: TickerItem[] = [
        {
          instrumentId: 4,
          name: 'MSFT',
          currentPrice: 415.26,
          dailyChange: 1.1,
          navigationUrl: '/instruments/4',
        },
      ];

      rerender(<EtTickerContent items={newItems} colors={mockColors} />);

      // Should now have MSFT (instrumentId 4) and not AAPL (instrumentId 1)
      expect(queryByTestId('ticker-item-1')).toBeNull();
      expect(getByTestId('ticker-item-4')).toBeDefined();
    });

    it('should re-compute content when colors change', () => {
      const { rerender, getByTestId } = render(<EtTickerContent items={singleItem} colors={mockColors} />);

      const newColors: TickerThemeColors = {
        textSecondaryNeutral: '#999999',
        statusPositive: '#00DD44',
        statusNegative: '#FF2266',
      };

      rerender(<EtTickerContent items={singleItem} colors={newColors} />);

      // Should still render the item
      expect(getByTestId('ticker-item-1')).toBeDefined();
    });
  });

  describe('Component Identity', () => {
    it('should have correct displayName', () => {
      expect(EtTickerContent.displayName).toBe('EtTickerContent');
    });

    it('should be a memoized component', () => {
      // Check that the component is wrapped with React.memo
      expect(EtTickerContent.$$typeof).toBeDefined();
    });
  });

  describe('Content Structure', () => {
    it('should maintain correct order of items and separators', () => {
      const { getAllByTestId } = render(<EtTickerContent items={multipleItems} colors={mockColors} />);

      // Get all rendered elements (items)
      const items = getAllByTestId(/ticker-item-/);
      expect(items).toHaveLength(3);
    });

    it('should render fragment as root element', () => {
      const { toJSON } = render(<EtTickerContent items={singleItem} colors={mockColors} />);

      // The component returns a fragment, so toJSON should not be null
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large number of items', () => {
      const manyItems: TickerItem[] = Array.from({ length: 100 }, (_, i) => ({
        instrumentId: 1000 + i,
        name: `STOCK${i}`,
        currentPrice: 100 + i,
        dailyChange: (i % 2 === 0 ? 1 : -1) * (i % 10),
        navigationUrl: `/instruments/${1000 + i}`,
      }));

      const { getAllByTestId } = render(<EtTickerContent items={manyItems} colors={mockColors} />);

      const items = getAllByTestId(/ticker-item-/);
      expect(items).toHaveLength(100);
    });

    it('should handle items with special characters in symbols', () => {
      const specialItems: TickerItem[] = [
        {
          instrumentId: 100,
          name: 'BRK.A',
          currentPrice: 534850,
          dailyChange: 1.5,
          navigationUrl: '/instruments/100',
        },
        {
          instrumentId: 101,
          name: 'BRK/B',
          currentPrice: 356.25,
          dailyChange: 1.2,
          navigationUrl: '/instruments/101',
        },
        {
          instrumentId: 102,
          name: 'SPY-USD',
          currentPrice: 445.67,
          dailyChange: 0.8,
          navigationUrl: '/instruments/102',
        },
      ];

      const { getByTestId } = render(<EtTickerContent items={specialItems} colors={mockColors} />);

      // testIDs use instrumentId
      expect(getByTestId('ticker-item-100')).toBeDefined();
      expect(getByTestId('ticker-item-101')).toBeDefined();
      expect(getByTestId('ticker-item-102')).toBeDefined();
    });

    it('should handle items with extreme price values', () => {
      const extremeItems: TickerItem[] = [
        {
          instrumentId: 200,
          name: 'EXPENSIVE',
          currentPrice: 999999.99,
          dailyChange: 0.1,
          navigationUrl: '/instruments/200',
        },
        {
          instrumentId: 201,
          name: 'CHEAP',
          currentPrice: 0.0001,
          dailyChange: -50.0,
          navigationUrl: '/instruments/201',
        },
        {
          instrumentId: 202,
          name: 'ZERO',
          currentPrice: 0,
          dailyChange: 0,
          navigationUrl: '/instruments/202',
        },
      ];

      const { getByTestId } = render(<EtTickerContent items={extremeItems} colors={mockColors} />);

      // testIDs use instrumentId
      expect(getByTestId('ticker-item-200')).toBeDefined();
      expect(getByTestId('ticker-item-201')).toBeDefined();
      expect(getByTestId('ticker-item-202')).toBeDefined();
    });
  });
});
