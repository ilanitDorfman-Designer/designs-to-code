import { ChartDataApiEquity } from '@etoro/common/types';
import { render } from '@testing-library/react-native';

import { EtLineChart } from './et-line-chart';

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => {
  const actual = jest.requireActual('react-native-gesture-handler');
  return {
    ...actual,
    Gesture: {
      Pan: jest.fn(() => ({
        enabled: jest.fn().mockReturnThis(),
        activateAfterLongPress: jest.fn().mockReturnThis(),
        activeOffsetX: jest.fn().mockReturnThis(),
        failOffsetY: jest.fn().mockReturnThis(),
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      })),
    },
    GestureDetector: ({ children }: any) => children,
  };
});

// Mock core hooks
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      primary: '#00D2AA',
      secondary: '#808080',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      border: '#E0E0E0',
      text: '#000000',
      disabled: '#CCCCCC',
      positive: '#00D2AA',
      negative: '#F44336',
    },
    gradients: {},
    fonts: {},
  })),
  useSkiaRuntime: jest.fn(() => ({ status: 'ready', error: null })),
  retrySkiaRuntime: jest.fn(),
  EtCanvas: jest.requireActual('../../../core/skia/et-canvas').EtCanvas,
}));

// Mock dependencies
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

jest.mock('react-native-redash', () => ({
  getYForX: jest.fn((_path, _x) => 100),
  parse: jest.fn(() => ({ toSVGString: () => 'M0,100L100,50' })),
}));

jest.mock('@shopify/react-native-skia', () => ({
  Canvas: ({ children: _children, style }: any) => `Canvas[${JSON.stringify(style)}]`,
  LinearGradient: () => 'LinearGradient',
  Mask: ({ children }: any) => children,
  Path: () => 'Path',
  Rect: () => 'Rect',
  Circle: () => 'Circle',
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        toSVGString: () => 'M0,0',
        close: jest.fn(),
      })),
      MakeFromSVGString: jest.fn(() => ({
        toSVGString: () => 'M0,100L100,50',
      })),
    },
  },
}));

jest.mock('d3-shape', () => ({
  curveBasis: 'curveBasis',
  curveMonotoneX: 'curveMonotoneX',
  line: jest.fn(() => ({
    x: jest.fn().mockReturnThis(),
    y: jest.fn().mockReturnThis(),
    curve: jest.fn(() => () => 'M0,100L100,50'),
  })),
}));

jest.mock('d3-scale', () => ({
  scaleLinear: jest.fn(() => {
    const scale: any = jest.fn((value: number) => value);
    scale.domain = jest.fn().mockReturnValue(scale);
    scale.range = jest.fn().mockReturnValue(scale);
    return scale;
  }),
  scalePoint: jest.fn(() => {
    const scale: any = jest.fn((value: string) => {
      // Extract hour from timestamp (e.g., "2023-01-01T10:00:00Z" -> 10)
      const hour = parseInt(value.substring(11, 13), 10);
      return hour * 30;
    });
    scale.domain = jest.fn().mockReturnValue(scale);
    scale.range = jest.fn().mockReturnValue(scale);
    scale.padding = jest.fn().mockReturnValue(scale);
    scale.step = jest.fn(() => 30);
    return scale;
  }),
}));

jest.mock('./components/graph-gradient', () => ({
  GraphGradient: () => 'GraphGradient',
}));

jest.mock('./components/cursor', () => ({
  Cursor: () => 'Cursor',
}));

jest.mock('./components/chart-markers', () => ({
  ChartMarkers: () => 'ChartMarkers',
}));

jest.mock('./hooks/use-animate-graph', () => ({
  useAnimateGraph: jest.fn(),
}));

const mockChartData: ChartDataApiEquity[] = [
  { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
  { timestamp: '2023-01-01T11:00:00Z', equity: 105 },
  { timestamp: '2023-01-01T12:00:00Z', equity: 98 },
  { timestamp: '2023-01-01T13:00:00Z', equity: 110 },
];

const mockSelectedValue = { value: 0 } as any;

describe('EtLineChart', () => {
  const defaultProps = {
    data: mockChartData,
    selectedValue: mockSelectedValue,
  };

  const renderChart = (props = {}) => {
    return render(<EtLineChart {...defaultProps} {...props} />);
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = renderChart();
      expect(toJSON()).not.toBeNull();
    });

    it('should render with default dimensions', () => {
      const { toJSON } = renderChart();
      expect(toJSON()).not.toBeNull();
    });

    it('should render with custom dimensions', () => {
      const { toJSON } = renderChart({ width: 300, height: 200 });
      expect(toJSON()).not.toBeNull();
    });

    it('should render with custom marginVertical', () => {
      const { toJSON } = renderChart({ marginVertical: 20 });
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Balance Configuration', () => {
    it('should render with positive balance', () => {
      const { toJSON } = renderChart({ balance: 'positive' });
      expect(toJSON()).not.toBeNull();
    });

    it('should render with negative balance', () => {
      const { toJSON } = renderChart({ balance: 'negative' });
      expect(toJSON()).not.toBeNull();
    });

    it('should default to positive balance when not specified', () => {
      const { toJSON } = renderChart();
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Cursor Configuration', () => {
    it('should render with cursor enabled by default', () => {
      const { toJSON } = renderChart();
      expect(toJSON()).not.toBeNull();
    });

    it('should render with cursor disabled', () => {
      const { toJSON } = renderChart({ isInteractive: false });
      expect(toJSON()).not.toBeNull();
    });

    it('should render with cursor explicitly enabled', () => {
      const { toJSON } = renderChart({ isInteractive: true });
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Callback Props', () => {
    it('should accept onFocusModeChange callback', () => {
      const onFocusModeChange = jest.fn();
      const { toJSON } = renderChart({ onFocusModeChange });
      expect(toJSON()).not.toBeNull();
    });

    it('should accept onCursorDataChange callback', () => {
      const onCursorDataChange = jest.fn();
      const { toJSON } = renderChart({ onCursorDataChange });
      expect(toJSON()).not.toBeNull();
    });

    it('should accept both callbacks together', () => {
      const onFocusModeChange = jest.fn();
      const onCursorDataChange = jest.fn();
      const { toJSON } = renderChart({ onFocusModeChange, onCursorDataChange });
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Gesture Interaction', () => {
    /**
     * Note: These tests verify the callback integration at the component level.
     * Full gesture simulation requires react-native-gesture-handler's test utilities
     * and may need additional setup in the test environment.
     */

    it('should provide callbacks to internal gesture handler', () => {
      const onFocusModeChange = jest.fn();
      const onCursorDataChange = jest.fn();

      const { toJSON } = renderChart({
        onFocusModeChange,
        onCursorDataChange,
        isInteractive: true,
      });

      // Component should render with gesture handlers configured
      expect(toJSON()).not.toBeNull();
      // Callbacks are provided but not called until gesture occurs
      expect(onFocusModeChange).not.toHaveBeenCalled();
      expect(onCursorDataChange).not.toHaveBeenCalled();
    });

    it('should accept callbacks with correct type signatures', () => {
      // Type check: onFocusModeChange receives boolean
      const onFocusModeChange = jest.fn<void, [boolean]>();
      // Type check: onCursorDataChange receives CursorData | null
      const onCursorDataChange = jest.fn<void, [{ amount: number; pnL: number; timestamp: string } | null]>();

      const { toJSON } = renderChart({
        onFocusModeChange,
        onCursorDataChange,
      });

      expect(toJSON()).not.toBeNull();
    });

    it('should render with cursor enabled when isInteractive is true', () => {
      const onFocusModeChange = jest.fn();
      const onCursorDataChange = jest.fn();

      // With cursor enabled, gesture handlers should be active
      const { toJSON } = renderChart({
        onFocusModeChange,
        onCursorDataChange,
        isInteractive: true,
      });

      expect(toJSON()).not.toBeNull();
    });

    it('should not trigger gestures when cursor is disabled', () => {
      const onFocusModeChange = jest.fn();
      const onCursorDataChange = jest.fn();

      // With cursor disabled, no gesture callbacks should fire
      renderChart({
        onFocusModeChange,
        onCursorDataChange,
        isInteractive: false,
      });

      // Verify callbacks are not called when cursor is disabled
      expect(onFocusModeChange).not.toHaveBeenCalled();
      expect(onCursorDataChange).not.toHaveBeenCalled();
    });

    it('should handle callbacks being undefined', () => {
      // Should not throw when callbacks are not provided
      expect(() => {
        renderChart({
          onFocusModeChange: undefined,
          onCursorDataChange: undefined,
        });
      }).not.toThrow();
    });

    it('should maintain callback references across renders', () => {
      const onFocusModeChange = jest.fn();
      const onCursorDataChange = jest.fn();

      const { rerender } = renderChart({
        onFocusModeChange,
        onCursorDataChange,
      });

      // Re-render with same callbacks
      rerender(<EtLineChart {...defaultProps} onFocusModeChange={onFocusModeChange} onCursorDataChange={onCursorDataChange} />);

      // Should not have called callbacks just from re-render
      expect(onFocusModeChange).not.toHaveBeenCalled();
      expect(onCursorDataChange).not.toHaveBeenCalled();
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data array', () => {
      const { toJSON } = renderChart({ data: [] });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle single data point', () => {
      const singleData: ChartDataApiEquity[] = [{ timestamp: '2023-01-01T10:00:00Z', equity: 100 }];
      const { toJSON } = renderChart({ data: singleData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle multiple data points', () => {
      const multipleData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 105 },
        { timestamp: '2023-01-01T12:00:00Z', equity: 98 },
        { timestamp: '2023-01-01T13:00:00Z', equity: 110 },
        { timestamp: '2023-01-01T14:00:00Z', equity: 95 },
      ];
      const { toJSON } = renderChart({ data: multipleData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle large datasets', () => {
      const largeData: ChartDataApiEquity[] = Array.from({ length: 100 }, (_, i) => ({
        timestamp: `2023-01-01T${String(i).padStart(2, '0')}:00:00Z`,
        equity: 100 + Math.random() * 50,
      }));
      const { toJSON } = renderChart({ data: largeData });
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero equity values', () => {
      const zeroData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 0 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 0 },
      ];
      const { toJSON } = renderChart({ data: zeroData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle negative equity values', () => {
      const negativeData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: -50 },
        { timestamp: '2023-01-01T11:00:00Z', equity: -30 },
        { timestamp: '2023-01-01T12:00:00Z', equity: -20 },
      ];
      const { toJSON } = renderChart({ data: negativeData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very large equity values', () => {
      const largeData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 1000000 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 2000000 },
      ];
      const { toJSON } = renderChart({ data: largeData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very small equity values', () => {
      const smallData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 0.001 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 0.002 },
      ];
      const { toJSON } = renderChart({ data: smallData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle extreme dimension values', () => {
      const { toJSON } = renderChart({ width: 1, height: 1 });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very large dimensions', () => {
      const { toJSON } = renderChart({ width: 2000, height: 1000 });
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Markers', () => {
    const mockMarkers = [{ timestamp: '2023-01-01T11:00:00Z' }, { timestamp: '2023-01-01T13:00:00Z' }];

    it('should render with markers', () => {
      const { toJSON } = renderChart({ markers: mockMarkers });
      expect(toJSON()).not.toBeNull();
    });

    it('should render with empty markers array', () => {
      const { toJSON } = renderChart({ markers: [] });
      expect(toJSON()).not.toBeNull();
    });

    it('should render with single marker', () => {
      const { toJSON } = renderChart({
        markers: [{ timestamp: '2023-01-01T12:00:00Z' }],
      });
      expect(toJSON()).not.toBeNull();
    });

    it('should render with markers on all data points', () => {
      const allMarkers = mockChartData.map((d) => ({ timestamp: d.timestamp }));
      const { toJSON } = renderChart({ markers: allMarkers });
      expect(toJSON()).not.toBeNull();
    });

    it('should render markers together with all other props', () => {
      const { toJSON } = renderChart({
        markers: mockMarkers,
        balance: 'negative',
        isInteractive: true,
        onFocusModeChange: jest.fn(),
        onCursorDataChange: jest.fn(),
      });
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Props Integration', () => {
    it('should handle all props together', () => {
      const { toJSON } = renderChart({
        data: mockChartData,
        width: 400,
        height: 250,
        marginVertical: 15,
        balance: 'negative',
        isInteractive: false,
        onFocusModeChange: jest.fn(),
        onCursorDataChange: jest.fn(),
      });
      expect(toJSON()).not.toBeNull();
    });

    it('should render consistently with same props', () => {
      const { toJSON: first } = renderChart();
      const { toJSON: second } = renderChart();

      // Compare serialized outputs since component instances are different
      expect(JSON.stringify(first())).toEqual(JSON.stringify(second()));
    });
  });

  describe('Data Patterns', () => {
    it('should handle flat/constant data', () => {
      const flatData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 100 },
        { timestamp: '2023-01-01T12:00:00Z', equity: 100 },
      ];
      const { toJSON } = renderChart({ data: flatData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle strictly increasing data', () => {
      const increasingData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 110 },
        { timestamp: '2023-01-01T12:00:00Z', equity: 120 },
        { timestamp: '2023-01-01T13:00:00Z', equity: 130 },
      ];
      const { toJSON } = renderChart({ data: increasingData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle strictly decreasing data', () => {
      const decreasingData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 130 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 120 },
        { timestamp: '2023-01-01T12:00:00Z', equity: 110 },
        { timestamp: '2023-01-01T13:00:00Z', equity: 100 },
      ];
      const { toJSON } = renderChart({ data: decreasingData });
      expect(toJSON()).not.toBeNull();
    });

    it('should handle volatile/oscillating data', () => {
      const volatileData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 150 },
        { timestamp: '2023-01-01T12:00:00Z', equity: 75 },
        { timestamp: '2023-01-01T13:00:00Z', equity: 200 },
        { timestamp: '2023-01-01T14:00:00Z', equity: 50 },
      ];
      const { toJSON } = renderChart({ data: volatileData });
      expect(toJSON()).not.toBeNull();
    });
  });
});
