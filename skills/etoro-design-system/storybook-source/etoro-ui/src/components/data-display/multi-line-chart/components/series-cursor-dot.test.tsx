import { render } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

import { SeriesCursorDot } from './series-cursor-dot';

jest.mock('@shopify/react-native-skia', () => ({
  Circle: jest.fn(() => null),
  Group: ({ children }: any) => children,
}));

jest.mock('react-native-redash', () => ({
  getYForX: jest.fn((_path, x: number) => x * 2),
}));

const { Circle } = require('@shopify/react-native-skia') as { Circle: jest.Mock };
const { getYForX } = require('react-native-redash') as { getYForX: jest.Mock };

const mockParsedPath = { curves: [], move: { x: 0, y: 0 }, close: false } as any;

function renderDot(props: Partial<React.ComponentProps<typeof SeriesCursorDot>> = {}) {
  function Harness() {
    const cx = useSharedValue(50);
    const opacity = useSharedValue(1);
    return <SeriesCursorDot cx={cx} parsedPath={mockParsedPath} color="#D06BFF" opacity={opacity} {...props} />;
  }
  return render(<Harness />);
}

describe('SeriesCursorDot', () => {
  beforeEach(() => {
    Circle.mockClear();
    getYForX.mockClear();
  });

  it('should render a fill dot and a halo circle', () => {
    renderDot();
    expect(Circle).toHaveBeenCalledTimes(2);
    const [dot] = Circle.mock.calls[0];
    const [halo] = Circle.mock.calls[1];
    expect(dot.r).toBe(4);
    expect(dot.style).toBe('fill');
    expect(halo.r).toBe(8);
    expect(halo.style).toBe('stroke');
  });

  it('should tint the dot with the series color and derive a translucent halo', () => {
    renderDot({ color: '#36D1D1' });
    const [dot] = Circle.mock.calls[0];
    const [halo] = Circle.mock.calls[1];
    expect(dot.color).toBe('#36D1D1');
    expect(halo.color).toBe('#36D1D120');
  });

  it('should fall back to the raw color for non-hex halo colors', () => {
    renderDot({ color: 'rgba(1,2,3,0.5)' });
    const [halo] = Circle.mock.calls[1];
    expect(halo.color).toBe('rgba(1,2,3,0.5)');
  });

  it('should derive cy from the series path at the cursor x', () => {
    renderDot();
    const [dot] = Circle.mock.calls[0];
    // cy is a Reanimated derived value reading getYForX(parsedPath, cx)
    expect(dot.cy.value).toBe(100); // getYForX mock: x(50) * 2
    expect(getYForX).toHaveBeenCalledWith(mockParsedPath, 50);
  });

  it('should default cy to 0 when the path cannot resolve the x position', () => {
    getYForX.mockReturnValueOnce(null);
    renderDot();
    const [dot] = Circle.mock.calls[0];
    expect(dot.cy.value).toBe(0);
  });
});
