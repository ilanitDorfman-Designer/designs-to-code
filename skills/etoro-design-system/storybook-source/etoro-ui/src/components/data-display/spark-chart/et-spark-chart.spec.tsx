import { render, within } from '@testing-library/react-native';

import { EtSparkChart } from './et-spark-chart';

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      verdictPositive600: '#00a000',
      verdictNegative600: '#d00000',
      actionDisabledText: '#999999',
    },
  }),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const makeComponent =
    (testID: string) =>
    ({ children, ...props }: { children?: React.ReactNode }) => (
      <View testID={testID} accessibilityHint={JSON.stringify(props)}>
        {children}
      </View>
    );

  return {
    __esModule: true,
    default: makeComponent('svg'),
    Circle: makeComponent('svg-circle'),
    Defs: makeComponent('svg-defs'),
    G: makeComponent('svg-group'),
    Line: makeComponent('svg-line'),
    LinearGradient: makeComponent('svg-linear-gradient'),
    Mask: makeComponent('svg-mask'),
    Path: makeComponent('svg-path'),
    Rect: makeComponent('svg-rect'),
    Stop: makeComponent('svg-stop'),
  };
});

describe('EtSparkChart', () => {
  it('GIVEN chart data WHEN rendered with defaults THEN the whole chart fades at both edges', () => {
    const data = [
      { equity: 60, timestamp: '2026-08-20T06:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
      { equity: 77, timestamp: '2026-08-21T14:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
    ];

    const { getAllByTestId } = render(<EtSparkChart data={data} referenceValue={77} />);

    const fadeStops = getAllByTestId('svg-stop')
      .slice(-4)
      .map((stop) => JSON.parse(stop.props['accessibilityHint']));

    expect(fadeStops).toEqual([
      expect.objectContaining({ offset: '0', stopOpacity: '0' }),
      expect.objectContaining({ offset: 0.15, stopOpacity: '1' }),
      expect.objectContaining({ offset: 0.85, stopOpacity: '1' }),
      expect.objectContaining({ offset: '1', stopOpacity: 0 }),
    ]);
  });

  it('GIVEN right-edge fade disabled WHEN rendered THEN the whole chart fades only at the left edge', () => {
    const data = [
      { equity: 60, timestamp: '2026-08-20T06:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
      { equity: 77, timestamp: '2026-08-21T14:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
    ];

    const { getAllByTestId } = render(<EtSparkChart data={data} referenceValue={77} fadeRightEdge={false} />);

    const fadeStops = getAllByTestId('svg-stop')
      .slice(-4)
      .map((stop) => JSON.parse(stop.props['accessibilityHint']));

    expect(fadeStops).toEqual([
      expect.objectContaining({ offset: '0', stopOpacity: '0' }),
      expect.objectContaining({ offset: 0.15, stopOpacity: '1' }),
      expect.objectContaining({ offset: 1, stopOpacity: '1' }),
      expect.objectContaining({ offset: '1', stopOpacity: 1 }),
    ]);
  });

  it('GIVEN chart data WHEN rendered with defaults THEN the baseline is drawn', () => {
    const data = [
      { equity: 60, timestamp: '2026-08-20T06:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
      { equity: 77, timestamp: '2026-08-21T14:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
    ];

    const { getByTestId } = render(<EtSparkChart data={data} referenceValue={77} />);

    expect(getByTestId('svg-line')).toBeTruthy();
  });

  it('GIVEN baseline disabled WHEN rendered THEN no baseline is drawn', () => {
    const data = [
      { equity: 60, timestamp: '2026-08-20T06:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
      { equity: 77, timestamp: '2026-08-21T14:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
    ];

    const { queryByTestId } = render(<EtSparkChart data={data} referenceValue={1_000} showBaseline={false} />);

    expect(queryByTestId('svg-line')).toBeNull();
  });

  it('GIVEN chart data WHEN rendered THEN no end-of-line dot is drawn', () => {
    const data = [
      { equity: 60, timestamp: '2026-08-20T06:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
      { equity: 77, timestamp: '2026-08-21T14:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
    ];

    const { queryAllByTestId } = render(<EtSparkChart data={data} referenceValue={77} />);

    expect(queryAllByTestId('svg-circle')).toHaveLength(0);
  });

  it('GIVEN chart data WHEN rendered THEN area and series are both inside the fade mask', () => {
    const data = [
      { equity: 60, timestamp: '2026-08-20T06:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
      { equity: 77, timestamp: '2026-08-21T14:00:00Z', cash: 0, inProcessCashouts: 0, investment: 0, pnL: 0 },
    ];

    const { getAllByTestId, getByTestId } = render(<EtSparkChart data={data} />);

    expect(getAllByTestId('svg-path')).toHaveLength(2);
    expect(within(getByTestId('svg-group')).getAllByTestId('svg-path')).toHaveLength(2);
  });
});
