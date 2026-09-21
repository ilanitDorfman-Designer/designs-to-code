import { render } from '@testing-library/react-native';

import { Gridlines } from './gridlines';

jest.mock('@shopify/react-native-skia', () => ({
  Line: jest.fn(() => null),
}));

const { Line } = require('@shopify/react-native-skia') as { Line: jest.Mock };

describe('Gridlines', () => {
  const defaultProps = {
    count: 4,
    chartWidth: 300,
    chartHeight: 200,
    color: '#B2B2B226',
  };

  beforeEach(() => {
    Line.mockClear();
  });

  it('should render one line per tick', () => {
    render(<Gridlines {...defaultProps} />);
    expect(Line).toHaveBeenCalledTimes(4);
  });

  it('should render nothing when count is zero', () => {
    const { toJSON } = render(<Gridlines {...defaultProps} count={0} />);
    expect(Line).not.toHaveBeenCalled();
    expect(toJSON()).toBeNull();
  });

  it('should span the full chart width', () => {
    render(<Gridlines {...defaultProps} />);
    for (const [props] of Line.mock.calls) {
      expect(props.p1).toEqual({ x: 0, y: props.p2.y });
      expect(props.p2.x).toBe(defaultProps.chartWidth);
    }
  });

  it('should apply the given color to every line', () => {
    render(<Gridlines {...defaultProps} color="#FF0000" />);
    for (const [props] of Line.mock.calls) {
      expect(props.color).toBe('#FF0000');
    }
  });

  it('should position lines with space-around distribution by default (matching y-axis label chips)', () => {
    render(<Gridlines {...defaultProps} count={2} chartHeight={100} />);
    const ys = Line.mock.calls.map(([props]) => props.p1.y);
    expect(ys).toEqual([25, 75]);
  });

  it('should position lines with space-between distribution', () => {
    render(<Gridlines {...defaultProps} count={3} chartHeight={100} distribution="space-between" />);
    const ys = Line.mock.calls.map(([props]) => props.p1.y);
    expect(ys).toEqual([0, 50, 100]);
  });
});
