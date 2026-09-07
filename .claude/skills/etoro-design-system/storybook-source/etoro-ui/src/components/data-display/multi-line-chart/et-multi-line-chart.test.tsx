import { ChartDataApiEquity } from '@etoro/common/types';
import { render } from '@testing-library/react-native';

import { EtMultiLineChart } from './et-multi-line-chart';

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
      backgroundBase: '#FFFFFF',
      carbonSecondaryDivider: '#B2B2B226',
      carbon500: '#808080',
      actionBrandText: '#00D2AA',
      carbon100: '#F2F2F2',
      carbon900: '#1A1A1A',
    },
    gradients: {},
    fonts: {},
  })),
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
  // Render children so canvas contents (Gridlines / Path / Rect / Cursor) are exercised.
  Canvas: ({ children, style }: any) => {
    const { View } = require('react-native');
    return (
      <View style={style} testID="skia-canvas">
        {children}
      </View>
    );
  },
  Group: ({ children }: any) => children,
  Line: jest.fn(() => null),
  LinearGradient: () => null,
  Path: jest.fn(() => null),
  Rect: jest.fn(() => null),
  Circle: jest.fn(() => null),
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

const { Circle, Line, Path } = require('@shopify/react-native-skia') as { Circle: jest.Mock; Line: jest.Mock; Path: jest.Mock };

jest.mock('d3-shape', () => ({
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
    let domainValue: number[] = [0, 1];
    // Mirror d3's getter/setter contract: domain(d) sets and returns the
    // scale, domain() returns the current domain array.
    scale.domain = jest.fn((d?: number[]) => {
      if (d === undefined) return domainValue;
      domainValue = d;
      return scale;
    });
    scale.range = jest.fn().mockReturnValue(scale);
    scale.nice = jest.fn().mockReturnValue(scale);
    return scale;
  }),
  scalePoint: jest.fn(() => {
    const scale: any = jest.fn((value: string) => {
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

jest.mock('../line-chart/components/cursor', () => ({
  Cursor: jest.fn(() => 'Cursor'),
}));

const { Cursor } = require('../line-chart/components/cursor') as { Cursor: jest.Mock };

jest.mock('../line-chart/hooks/use-animate-graph', () => ({
  useAnimateGraph: jest.fn(),
}));

const buildSeries = (offset: number): ChartDataApiEquity[] => [
  { timestamp: '2023-01-01T10:00:00Z', equity: 100 + offset },
  { timestamp: '2023-01-01T11:00:00Z', equity: 105 + offset },
  { timestamp: '2023-01-01T12:00:00Z', equity: 98 + offset },
  { timestamp: '2023-01-01T13:00:00Z', equity: 110 + offset },
];

const mockSelectedValue = { value: 0 } as any;

describe('EtMultiLineChart', () => {
  const defaultProps = {
    series: [
      { data: buildSeries(0), color: '#0EB12E' },
      { data: buildSeries(-10), color: '#D06BFF' },
    ],
    selectedValue: mockSelectedValue,
  };

  const renderChart = (props = {}) => {
    return render(<EtMultiLineChart {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    Circle.mockClear();
    Cursor.mockClear();
    Line.mockClear();
    Path.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = renderChart();
      expect(getByTestId('skia-canvas')).toBeTruthy();
    });

    it('should render with custom dimensions', () => {
      const { getByTestId } = renderChart({ width: 300, height: 200, marginVertical: 20 });
      expect(getByTestId('skia-canvas')).toBeTruthy();
    });

    it('should render consistently with same props', () => {
      const { toJSON: first } = renderChart();
      const { toJSON: second } = renderChart();
      expect(JSON.stringify(first())).toEqual(JSON.stringify(second()));
    });
  });

  describe('Series Handling', () => {
    it('should render a Path per series', () => {
      renderChart({ series: [{ data: buildSeries(0), color: '#0EB12E' }] });
      expect(Path).toHaveBeenCalledTimes(1);
    });

    it('should render four series (DS compare design maximum)', () => {
      renderChart({
        series: [
          { data: buildSeries(0), color: '#0EB12E' },
          { data: buildSeries(-10), color: '#D06BFF' },
          { data: buildSeries(10), color: '#36D1D1' },
          { data: buildSeries(20), color: '#FFD400' },
        ],
      });
      expect(Path).toHaveBeenCalledTimes(4);
    });

    it('should render with an empty series array', () => {
      const { getByTestId } = renderChart({ series: [] });
      expect(getByTestId('skia-canvas')).toBeTruthy();
      expect(Path).not.toHaveBeenCalled();
    });

    it('should render when a secondary series has empty data', () => {
      renderChart({
        series: [
          { data: buildSeries(0), color: '#0EB12E' },
          { data: [], color: '#D06BFF' },
        ],
      });
      // Empty secondary still gets a Path slot; primary Path is always painted when series is non-empty.
      expect(Path).toHaveBeenCalledTimes(2);
    });

    it('should render when the primary series has empty data', () => {
      renderChart({
        series: [
          { data: [], color: '#0EB12E' },
          { data: buildSeries(0), color: '#D06BFF' },
        ],
      });
      expect(Path).toHaveBeenCalledTimes(2);
    });

    it('should handle flat/constant series data', () => {
      const flat: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 100 },
      ];
      renderChart({ series: [{ data: flat, color: '#0EB12E' }] });
      expect(Path).toHaveBeenCalledTimes(1);
    });
  });

  describe('Gridlines & Y-Axis', () => {
    it('should render one gridline per auto-computed tick (gridlines on by default)', () => {
      const { getByText } = renderChart({ yAxisTickCount: 4 });
      expect(Line).toHaveBeenCalledTimes(4);
      // Unified domain over default series is [88, 110]; ticks are evenly spaced top→bottom.
      expect(getByText('110')).toBeTruthy();
      expect(getByText('88')).toBeTruthy();
    });

    it('should render with gridlines disabled', () => {
      renderChart({ yAxisTickCount: 4, showGridlines: false });
      expect(Line).not.toHaveBeenCalled();
    });

    it('should render with manual y-axis labels', () => {
      const { getByText } = renderChart({ yAxisLabels: ['10%', '5%', '0%', '-5%'] });
      expect(Line).toHaveBeenCalledTimes(4);
      expect(getByText('10%')).toBeTruthy();
      expect(getByText('-5%')).toBeTruthy();
    });

    it('should render with a custom gridline color', () => {
      renderChart({ yAxisTickCount: 3, gridlineColor: '#FF0000' });
      expect(Line).toHaveBeenCalledTimes(3);
      expect(Line.mock.calls.some((call) => call[0]?.color === '#FF0000')).toBe(true);
    });

    it('should render with hidden labels (gridlines only)', () => {
      renderChart({ yAxisTickCount: 3, yAxisLabelsHidden: true });
      expect(Line).toHaveBeenCalledTimes(3);
    });

    it('should render with a tick formatter', () => {
      const { getByText } = renderChart({
        yAxisTickCount: 4,
        yAxisTickFormat: (value: number) => `${Math.round(value)}%`,
      });
      expect(Line).toHaveBeenCalledTimes(4);
      expect(getByText('110%')).toBeTruthy();
      expect(getByText('88%')).toBeTruthy();
    });

    it('should render without labels or gridlines when no tick source is given', () => {
      renderChart();
      expect(Line).not.toHaveBeenCalled();
    });

    it('should render with space-between distribution', () => {
      renderChart({ yAxisTickCount: 3, yAxisDistribution: 'space-between' });
      expect(Line).toHaveBeenCalledTimes(3);
    });
  });

  describe('Interaction', () => {
    it('should render with cursor disabled', () => {
      const { getByTestId, queryByText } = renderChart({ isInteractive: false });
      expect(getByTestId('skia-canvas')).toBeTruthy();
      expect(queryByText('Cursor')).toBeNull();
    });

    // The shared line-chart `Cursor` (needle + primary dot) is mocked out below,
    // so every Circle rendered here comes from a SeriesCursorDot — 2 per dot
    // (fill + halo). That makes the per-series wiring assertable.
    const seriesDotCount = () => Circle.mock.calls.length / 2;

    it('should render a scrub dot for every secondary series', () => {
      renderChart({
        series: [
          { data: buildSeries(0), color: '#0EB12E' },
          { data: buildSeries(-10), color: '#D06BFF' },
          { data: buildSeries(10), color: '#36D1D1' },
          { data: buildSeries(20), color: '#FFD400' },
        ],
      });
      // 4 series → primary dot comes from Cursor, the other 3 are SeriesCursorDots
      expect(seriesDotCount()).toBe(3);
    });

    it('should tint each scrub dot with its own series color', () => {
      renderChart({
        series: [
          { data: buildSeries(0), color: '#0EB12E' },
          { data: buildSeries(-10), color: '#D06BFF' },
          { data: buildSeries(10), color: '#36D1D1' },
        ],
      });
      const fillColors = Circle.mock.calls.filter(([props]) => props.style === 'fill').map(([props]) => props.color);
      expect(fillColors).toEqual(['#D06BFF', '#36D1D1']);
    });

    it('should not render scrub dots when the chart is not interactive', () => {
      renderChart({ isInteractive: false });
      expect(seriesDotCount()).toBe(0);
    });

    it('should skip the scrub dot for a secondary series with empty data', () => {
      renderChart({
        series: [
          { data: buildSeries(0), color: '#0EB12E' },
          { data: [], color: '#D06BFF' },
          { data: buildSeries(10), color: '#36D1D1' },
        ],
      });
      expect(seriesDotCount()).toBe(1);
    });

    it('should render no scrub dots for a single-series chart', () => {
      renderChart({ series: [{ data: buildSeries(0), color: '#0EB12E' }] });
      expect(seriesDotCount()).toBe(0);
    });

    it('should default the needle to the neutral carbon500 token', () => {
      renderChart();
      expect(Cursor).toHaveBeenCalledWith(expect.objectContaining({ needleColor: '#808080' }), undefined);
    });

    it('should tint the primary dot with the primary series color by default', () => {
      renderChart();
      expect(Cursor).toHaveBeenCalledWith(expect.objectContaining({ color: '#0EB12E' }), undefined);
    });

    it('should let needleColor and cursorColor be overridden independently', () => {
      renderChart({ needleColor: '#123456', cursorColor: '#654321' });
      expect(Cursor).toHaveBeenCalledWith(expect.objectContaining({ needleColor: '#123456', color: '#654321' }), undefined);
    });

    it('should accept focus and cursor callbacks without invoking them on render', () => {
      const onFocusModeChange = jest.fn();
      const onCursorDataChange = jest.fn();
      const { getByTestId } = renderChart({ onFocusModeChange, onCursorDataChange });
      expect(getByTestId('skia-canvas')).toBeTruthy();
      expect(onFocusModeChange).not.toHaveBeenCalled();
      expect(onCursorDataChange).not.toHaveBeenCalled();
    });

    it('should handle callbacks being undefined', () => {
      expect(() => {
        renderChart({ onFocusModeChange: undefined, onCursorDataChange: undefined });
      }).not.toThrow();
    });
  });

  describe('Props Integration', () => {
    it('should handle all props together', () => {
      const { getByTestId } = renderChart({
        width: 400,
        height: 250,
        marginVertical: 15,
        isInteractive: false,
        showGridlines: true,
        yAxisTickCount: 4,
        yAxisTickFormat: (value: number) => String(Math.round(value)),
        gridlineColor: '#B2B2B226',
        cursorColor: '#00D2AA',
        surfaceColor: '#000000',
        onFocusModeChange: jest.fn(),
        onCursorDataChange: jest.fn(),
      });
      expect(getByTestId('skia-canvas')).toBeTruthy();
      expect(Path).toHaveBeenCalledTimes(2);
      expect(Line).toHaveBeenCalledTimes(4);
    });
  });
});
