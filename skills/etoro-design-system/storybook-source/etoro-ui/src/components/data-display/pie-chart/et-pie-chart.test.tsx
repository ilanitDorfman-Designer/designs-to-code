import { fireEvent, render } from '@testing-library/react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '../../../core/hooks';
import type { PieChartData } from './api';
import { EtPieChart } from './et-pie-chart';

// Keep the icon hermetic — avoids CDN/registry resolution in the legend chevron.
jest.mock('../../et-icon-v2', () => ({
  EtIconV2: 'EtIconV2',
}));

// Control the reduced-motion signal per-test while keeping the rest of the
// core-hooks barrel (theme, etc.) intact.
jest.mock('../../../core/hooks', () => {
  const actual = jest.requireActual('../../../core/hooks');
  return { ...actual, useReducedMotion: jest.fn(() => false) };
});

// Note: useEtoroTheme is globally mocked in test-setup (full eToro color tokens);
// react-native-reanimated is mocked globally following the official approach.

const mockUseReducedMotion = useReducedMotion as jest.Mock;
const mockWithTiming = withTiming as jest.Mock;

const mockData: PieChartData[] = [
  { key: 'Stocks', value: 50 },
  { key: 'Crypto', value: 30 },
  { key: 'Commodities', value: 20 },
];

describe('EtPieChart', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing with no data', () => {
      const { toJSON } = render(<EtPieChart />);
      expect(toJSON()).not.toBeNull();
    });

    it('renders the track ring', () => {
      const { getByTestId } = render(<EtPieChart testID="pie" />);
      expect(getByTestId('pie-track')).toBeDefined();
    });

    it('renders one arc per segment', () => {
      const { getByTestId, queryByTestId } = render(<EtPieChart data={mockData} testID="pie" />);
      expect(getByTestId('pie-segment-0')).toBeDefined();
      expect(getByTestId('pie-segment-1')).toBeDefined();
      expect(getByTestId('pie-segment-2')).toBeDefined();
      expect(queryByTestId('pie-segment-3')).toBeNull();
    });

    it('renders only the track (no arcs) for empty data', () => {
      const { getByTestId, queryByTestId } = render(<EtPieChart data={[]} testID="pie" />);
      expect(getByTestId('pie-track')).toBeDefined();
      expect(queryByTestId('pie-segment-0')).toBeNull();
    });

    it('paints the track only in the empty state', () => {
      // Arcs always fill the circle, so a painted track would sit behind them and
      // tint any translucent segment color rather than let it composite on the
      // surface. react-native-svg normalizes stroke to an ARGB int; 0 is transparent.
      const { getByTestId: getEmpty } = render(<EtPieChart data={[]} testID="pie" />);
      expect(getEmpty('pie-track').props.stroke).not.toEqual({ type: 0, payload: 0 });

      const { getByTestId: getFilled } = render(<EtPieChart data={mockData} testID="pie" />);
      expect(getFilled('pie-track').props.stroke).toEqual({ type: 0, payload: 0 });
    });
  });

  describe('Sizes', () => {
    it('applies the small size (default, 100 px) to the container', () => {
      const { getByTestId } = render(<EtPieChart data={mockData} testID="pie" />);
      const flat = StyleSheet.flatten(getByTestId('pie').props.style);
      expect(flat.width).toBe(100);
      expect(flat.height).toBe(100);
    });

    it('applies the large size (150 px) to the container', () => {
      const { getByTestId } = render(<EtPieChart data={mockData} size="large" testID="pie" />);
      const flat = StyleSheet.flatten(getByTestId('pie').props.style);
      expect(flat.width).toBe(150);
      expect(flat.height).toBe(150);
    });
  });

  describe('maxSegments folding', () => {
    it('folds overflow into a single "Other" arc (7 arcs max by default)', () => {
      const data: PieChartData[] = Array.from({ length: 10 }, (_, i) => ({ key: `k${i}`, value: i + 1 }));
      const { getByTestId, queryByTestId } = render(<EtPieChart data={data} testID="pie" />);

      expect(getByTestId('pie-segment-6')).toBeDefined();
      expect(queryByTestId('pie-segment-7')).toBeNull();
    });

    it('respects a custom maxSegments', () => {
      const data: PieChartData[] = Array.from({ length: 6 }, (_, i) => ({ key: `k${i}`, value: 1 }));
      const { getByTestId, queryByTestId } = render(<EtPieChart data={data} maxSegments={3} testID="pie" />);

      expect(getByTestId('pie-segment-2')).toBeDefined();
      expect(queryByTestId('pie-segment-3')).toBeNull();
    });
  });

  describe('Outer ring', () => {
    it('renders the dashed outer ring when enabled', () => {
      const { getByTestId } = render(<EtPieChart data={mockData} showOuterRing testID="pie" />);
      expect(getByTestId('pie-outer-ring')).toBeDefined();
    });

    it('does not render the outer ring by default', () => {
      const { queryByTestId } = render(<EtPieChart data={mockData} testID="pie" />);
      expect(queryByTestId('pie-outer-ring')).toBeNull();
    });

    // Figma node `12771:61538` places the ring's box at `inset: -5%` around the
    // donut, i.e. 165 px around the 150 px donut → centerline radius 82.5, a 7.5 px
    // gap from the donut edge. The small size keeps the same 5% proportion.
    it.each([
      ['small' as const, 55],
      ['large' as const, 82.5],
    ])('places the %s outer ring centerline at the Figma -5%% inset (r=%s)', (size, expectedRadius) => {
      const { getByTestId } = render(<EtPieChart data={mockData} size={size} showOuterRing testID="pie" />);
      expect(getByTestId('pie-outer-ring').props.r).toBe(expectedRadius);
    });

    // The ring color is a module-level primitive that never reads the theme — that
    // is deliberate, since the `carbonPrimaryDivider` semantic token fades to 25%
    // alpha in dark and all but disappears. Pinning the literal here is what would
    // catch a later switch to a theme-dependent token.
    it('strokes the outer ring with the theme-independent Figma --primary-divider value', () => {
      const { getByTestId } = render(<EtPieChart data={mockData} showOuterRing testID="pie" />);
      // react-native-svg normalizes the stroke to an ARGB int: 0x4DB2B2B2 is
      // alpha 0x4D (30%) over #B2B2B2 — Figma's `--primary-divider` (#B2B2B24D).
      expect(getByTestId('pie-outer-ring').props.stroke).toEqual({ type: 0, payload: 0x4db2b2b2 });
    });
  });

  describe('Animation', () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(false);
      mockWithTiming.mockClear();
    });

    it('renders with animation disabled', () => {
      const { toJSON } = render(<EtPieChart data={mockData} enableAnimation={false} />);
      expect(toJSON()).not.toBeNull();
    });

    it('renders with animation enabled', () => {
      const { toJSON } = render(<EtPieChart data={mockData} enableAnimation animationDuration={500} />);
      expect(toJSON()).not.toBeNull();
    });

    it('schedules a timing animation when enabled and motion is allowed', () => {
      render(<EtPieChart data={mockData} enableAnimation />);
      expect(mockWithTiming).toHaveBeenCalled();
    });

    // A full 360° sweep needs to be long enough to read; 900ms is the DS default.
    it('sweeps for 900ms by default', () => {
      render(<EtPieChart data={mockData} enableAnimation />);
      expect(mockWithTiming).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 900 }));
    });

    it('honors a custom animationDuration', () => {
      render(<EtPieChart data={mockData} enableAnimation animationDuration={500} />);
      expect(mockWithTiming).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 500 }));
    });

    it('does not schedule a timing animation when animation is disabled', () => {
      render(<EtPieChart data={mockData} enableAnimation={false} />);
      expect(mockWithTiming).not.toHaveBeenCalled();
    });

    it('respects reduced motion and skips the sweep even when animation is enabled', () => {
      mockUseReducedMotion.mockReturnValue(true);
      render(<EtPieChart data={mockData} enableAnimation />);
      expect(mockWithTiming).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('supports testID', () => {
      const { getByTestId } = render(<EtPieChart testID="pie" />);
      expect(getByTestId('pie')).toBeDefined();
    });

    it('exposes a default image accessibility label', () => {
      const { getByLabelText } = render(<EtPieChart data={mockData} />);
      expect(getByLabelText('Pie chart with 3 segments')).toBeDefined();
    });

    it('supports an accessibility label override', () => {
      const { getByLabelText } = render(<EtPieChart data={mockData} accessibilityLabel="Portfolio allocation" />);
      expect(getByLabelText('Portfolio allocation')).toBeDefined();
    });
  });

  describe('SegmentLegend', () => {
    it('wraps each item in a cell', () => {
      const { getByTestId } = render(
        <EtPieChart.SegmentLegend testID="legend">
          <EtPieChart.SegmentLegendItem dotColor="#ff0000" label="Stocks" value="50%" testID="legend-item-0" />
          <EtPieChart.SegmentLegendItem dotColor="#00ff00" label="Crypto" value="30%" testID="legend-item-1" />
        </EtPieChart.SegmentLegend>,
      );

      expect(getByTestId('legend-cell-0')).toBeDefined();
      expect(getByTestId('legend-cell-1')).toBeDefined();
    });

    it('renders the dot, label and value of an item', () => {
      const { getByTestId } = render(<EtPieChart.SegmentLegendItem dotColor="#ff0000" label="Stocks" value="50%" testID="item" />);

      expect(getByTestId('item-dot')).toBeDefined();
      expect(getByTestId('item-label')).toBeDefined();
      expect(getByTestId('item-value')).toBeDefined();
    });

    it.each([
      { size: undefined, fontSize: 14 },
      { size: 'small' as const, fontSize: 10 },
    ])('renders label and value at $fontSize px for size $size', ({ size, fontSize }) => {
      const { getByTestId } = render(<EtPieChart.SegmentLegendItem dotColor="#ff0000" label="Stocks" value="50%" size={size} testID="item" />);

      const fontSizeOf = (node: { props: { style?: StyleProp<TextStyle> } }) => StyleSheet.flatten(node.props.style)?.fontSize;

      expect(fontSizeOf(getByTestId('item-label'))).toBe(fontSize);
      expect(fontSizeOf(getByTestId('item-value'))).toBe(fontSize);
    });

    it('does not render a value node when value is omitted', () => {
      const { queryByTestId } = render(<EtPieChart.SegmentLegendItem dotColor="#ff0000" label="Stocks" testID="item" />);
      expect(queryByTestId('item-value')).toBeNull();
    });

    it('becomes a pressable button when onPress is provided', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(<EtPieChart.SegmentLegendItem dotColor="#ff0000" label="Stocks" onPress={onPress} testID="item" />);

      fireEvent.press(getByTestId('item'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    describe('fixed columns', () => {
      const renderLegend = (count: number, columns?: number) =>
        render(
          <EtPieChart.SegmentLegend testID="legend" columns={columns}>
            {Array.from({ length: count }, (_unused, index) => (
              <EtPieChart.SegmentLegendItem key={index} dotColor="#ff0000" label={`Segment ${index}`} value="10%" />
            ))}
          </EtPieChart.SegmentLegend>,
        );

      const styleOf = (node: { props: { style?: StyleProp<ViewStyle> } }): ViewStyle => StyleSheet.flatten(node.props.style) ?? {};

      it('centers a full row and lets its cells hug their content', () => {
        // An equal `flex` share would pin each cell to the start of its column,
        // leaving the pair left-shifted with ragged space at the card's edge.
        const { getByTestId } = renderLegend(4, 2);

        expect(styleOf(getByTestId('legend-cell-0')).flex).toBeUndefined();
        expect(styleOf(getByTestId('legend-cell-3')).flex).toBeUndefined();
        expect(styleOf(getByTestId('legend-row-0')).justifyContent).toBe('center');
        expect(styleOf(getByTestId('legend-row-1')).justifyContent).toBe('center');
      });

      it('centers a row holding a single item', () => {
        // Five over two columns = 2 / 2 / 1, every row centered on the card.
        const { getByTestId } = renderLegend(5, 2);

        expect(styleOf(getByTestId('legend-cell-4')).flex).toBeUndefined();
        expect(styleOf(getByTestId('legend-row-2')).justifyContent).toBe('center');
      });

      it('lets a cell shrink so an over-wide pair truncates instead of overflowing', () => {
        const { getByTestId } = renderLegend(4, 2);

        expect(styleOf(getByTestId('legend-cell-0')).flexShrink).toBe(1);
      });

      it('applies the same rule however many items arrive', () => {
        // The segment count is data-driven, so every count has to land on the
        // same shape: rows of `columns` items, each row centered.
        [1, 2, 3, 4, 5, 6, 7].forEach((count) => {
          const { getByTestId, queryByTestId, unmount } = renderLegend(count, 2);
          const rowCount = Math.ceil(count / 2);

          for (let row = 0; row < rowCount; row += 1) {
            expect(styleOf(getByTestId(`legend-row-${row}`)).justifyContent).toBe('center');
            expect(styleOf(getByTestId(`legend-cell-${row * 2}`)).flex).toBeUndefined();
          }

          expect(queryByTestId(`legend-row-${rowCount}`)).toBeNull();
          unmount();
        });
      });

      it('keeps content-hugging cells when no column count is given', () => {
        const { getByTestId, queryByTestId } = renderLegend(5);

        expect(styleOf(getByTestId('legend-cell-0')).width).toBeUndefined();
        expect(styleOf(getByTestId('legend-cell-0')).flex).toBeUndefined();
        expect(queryByTestId('legend-row-0')).toBeNull();
      });
    });
  });
});
