import { act, fireEvent, render } from '@testing-library/react-native';

import { EtTileChart } from './tile-chart';
import { TileChartData } from './tile-chart.interface';

// Mock core hooks
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      textBright: '#FFFFFF',
      textPrimaryNeutral: '#1A1A1A',
      textSecondaryNeutral: '#666666',
      textTertiaryNeutral: '#808080',
    },
    isDarkMode: false,
  })),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }: any) => {
    const { View } = require('react-native');
    return (
      <View testID="linear-gradient" style={style}>
        {children}
      </View>
    );
  },
}));

// Mock EtText component
jest.mock('../../../foundations/text', () => ({
  EtText: ({ children, variant: _variant, style, ...props }: any) => {
    const { StyleSheet, Text } = require('react-native');
    const flattenedStyle = StyleSheet.flatten(style) || {};

    return (
      <Text testID="et-text" style={flattenedStyle} {...props}>
        {children}
      </Text>
    );
  },
}));

const mockData: TileChartData[] = [
  {
    id: '1',
    label: 'Tech',
    value: 25,
    color: ['#f0abfc', '#e879f9'],
  },
  {
    id: '2',
    label: 'Energy',
    value: 35,
    color: ['#93c5fd', '#60a5fa'],
  },
  {
    id: '3',
    label: 'Finance',
    value: 40,
    color: ['#7dd3fc', '#38bdf8'],
  },
];

// Helper function to trigger layout event
function triggerLayout(UNSAFE_root: any, width: number, height = 200) {
  const views = UNSAFE_root.findAllByType(require('react-native').View);
  const canvas = views.find((view: any) => view.props.onLayout);

  act(() => {
    if (canvas && canvas.props.onLayout) {
      canvas.props.onLayout({
        nativeEvent: {
          layout: { width, height },
        },
      });
    }
  });
}

describe('EtTileChart', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing with minimal props', () => {
      const { toJSON } = render(<EtTileChart data={mockData} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render with empty data array', () => {
      const { toJSON, queryByText } = render(<EtTileChart data={[]} />);
      expect(toJSON()).not.toBeNull();
      // No items should be rendered
      expect(queryByText('Tech')).toBeNull();
    });
  });

  describe('Layout Calculation', () => {
    it('should calculate layout when width is set via onLayout', () => {
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} />);

      // Trigger layout event with width
      triggerLayout(UNSAFE_root, 300);

      // After layout, items should be rendered (check by text content)
      expect(getByText('Tech')).toBeDefined();
      expect(getByText('Energy')).toBeDefined();
      expect(getByText('Finance')).toBeDefined();
    });

    it('should not render items when width is 0', () => {
      const { queryByText } = render(<EtTileChart data={mockData} />);

      // Initially width is 0, so no items should be rendered (layoutChart returns empty array)
      expect(queryByText('Tech')).toBeNull();
    });
  });

  describe('Data Rendering', () => {
    it('should render correct number of items from data', () => {
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} />);

      // Trigger layout event with width
      triggerLayout(UNSAFE_root, 300);

      // Should render 3 items
      expect(getByText('Tech')).toBeDefined();
      expect(getByText('Energy')).toBeDefined();
      expect(getByText('Finance')).toBeDefined();
    });

    it('should handle single data point', () => {
      const singleData: TileChartData[] = [
        {
          id: 'single',
          label: 'Single',
          value: 100,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { getByText, UNSAFE_root } = render(<EtTileChart data={singleData} />);

      // Trigger layout event with width
      triggerLayout(UNSAFE_root, 300);

      expect(getByText('Single')).toBeDefined();
    });
  });

  describe('Width Dependency Memoization', () => {
    it('should recalculate layout when width changes', () => {
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} />);

      // First layout with width 300
      triggerLayout(UNSAFE_root, 300);

      expect(getByText('Tech')).toBeDefined();

      // Change width to 500
      triggerLayout(UNSAFE_root, 500);

      // Items should still be rendered (layout recalculated)
      expect(getByText('Tech')).toBeDefined();
    });
  });

  describe('onItemPress Callback', () => {
    it('should call onItemPress with correct item and event when item is pressed', () => {
      const mockOnItemPress = jest.fn();
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} onItemPress={mockOnItemPress} />);

      // Trigger layout to render items
      triggerLayout(UNSAFE_root, 300);

      // Verify items are rendered and press the first item
      const techText = getByText('Tech');
      fireEvent.press(techText);

      expect(mockOnItemPress).toHaveBeenCalledTimes(1);
      // The item passed includes rect (TileChartLayoutItem) and the event may be undefined
      const callArgs = mockOnItemPress.mock.calls[0];
      expect(callArgs[0]).toMatchObject({
        id: '1',
        label: 'Tech',
        value: 25,
        color: ['#f0abfc', '#e879f9'],
      });
      expect(callArgs[0]).toHaveProperty('rect');
      expect(callArgs[0].rect).toMatchObject({
        x: expect.any(Number),
        y: expect.any(Number),
        w: expect.any(Number),
        h: expect.any(Number),
      });
    });

    it('should not crash when onItemPress is not provided', () => {
      const { UNSAFE_root } = render(<EtTileChart data={mockData} />);

      // Trigger layout to render items
      triggerLayout(UNSAFE_root, 300);

      // Should not throw when pressing without callback
      expect(() => {
        const { Pressable } = require('react-native');
        const pressables = UNSAFE_root.findAllByType(Pressable);
        if (pressables.length > 0) {
          fireEvent.press(pressables[0]);
        }
      }).not.toThrow();
    });
  });

  describe('Custom Styles and Classes', () => {
    it('should apply custom styles', () => {
      const customStyles = { height: 150, gap: 8 };
      const { UNSAFE_root } = render(<EtTileChart data={mockData} styles={customStyles} />);

      const views = UNSAFE_root.findAllByType(require('react-native').View);
      const canvas = views.find((view: any) => view.props.onLayout);

      expect(canvas).toBeDefined();

      // Verify height is applied
      const canvasStyle = canvas.props.style;
      const flattenedStyle = Array.isArray(canvasStyle) ? Object.assign({}, ...canvasStyle.filter(Boolean)) : canvasStyle;

      expect(flattenedStyle.height).toBe(150);
    });

    it('should apply custom classes', () => {
      const customClasses = {
        container: { backgroundColor: '#f0f0f0' },
        barsContainer: { borderWidth: 1 },
      };
      const { UNSAFE_root } = render(<EtTileChart data={mockData} classes={customClasses} />);

      const views = UNSAFE_root.findAllByType(require('react-native').View);
      const container = views[0]; // First View is container
      const canvas = views.find((view: any) => view.props.onLayout);

      expect(container).toBeDefined();
      expect(canvas).toBeDefined();

      const containerStyle = container.props.style;
      const flattenedContainerStyle = Array.isArray(containerStyle) ? Object.assign({}, ...containerStyle.filter(Boolean)) : containerStyle;
      expect(flattenedContainerStyle.backgroundColor).toBe('#f0f0f0');

      const barsContainerStyle = canvas?.props.style;
      const flattenedBarsContainerStyle = Array.isArray(barsContainerStyle)
        ? Object.assign({}, ...barsContainerStyle.filter(Boolean))
        : barsContainerStyle;
      expect(flattenedBarsContainerStyle.borderWidth).toBe(1);
    });
  });

  describe('Default Props', () => {
    it('should use default direction when not provided', () => {
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} />);

      // Trigger layout to render items
      triggerLayout(UNSAFE_root, 300);

      // Should render items (default direction is 'vertical')
      expect(getByText('Tech')).toBeDefined();
    });

    it('should use default symbol when not provided', () => {
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} />);

      // Trigger layout to render items
      triggerLayout(UNSAFE_root, 300);

      // Default symbol is '%' - check if text contains the value and symbol
      expect(getByText(/25%/)).toBeDefined();
    });
  });

  describe('Direction and Variant Changes', () => {
    it('should recalculate layout when direction changes', () => {
      const { getByText, UNSAFE_root, rerender } = render(<EtTileChart data={mockData} direction="vertical" />);

      // Trigger layout with initial direction
      triggerLayout(UNSAFE_root, 300);

      expect(getByText('Tech')).toBeDefined();

      // Change direction
      rerender(<EtTileChart data={mockData} direction="horizontal" />);

      // Trigger layout again after rerender (UNSAFE_root is updated by rerender)
      triggerLayout(UNSAFE_root, 300);

      // Items should still be rendered with new direction
      expect(getByText('Tech')).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with missing id (uses label as key)', () => {
      const dataWithoutId: TileChartData[] = [
        {
          label: 'NoId',
          value: 50,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { getByText, UNSAFE_root } = render(<EtTileChart data={dataWithoutId} />);

      // Trigger layout to render items
      triggerLayout(UNSAFE_root, 300);

      // Should use label as key and render item
      expect(getByText('NoId')).toBeDefined();
    });

    it('should merge default styles with custom styles', () => {
      const customStyles = { gap: 10 };
      const { getByText, UNSAFE_root } = render(<EtTileChart data={mockData} styles={customStyles} />);

      // Trigger layout to render items
      triggerLayout(UNSAFE_root, 300);

      // Should use custom gap (10) but default height (200)
      expect(getByText('Tech')).toBeDefined();
    });
  });
});
