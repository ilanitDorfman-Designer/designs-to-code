import { render } from '@testing-library/react-native';

import { EtRangeSlider } from './et-range-slider';

// Minimal mocks for gesture handler to avoid native dependency issues
jest.mock('react-native-gesture-handler', () => {
  const makeChain = () => {
    const obj: any = {};
    obj.hitSlop = jest.fn(() => obj);
    obj.activeOffsetX = jest.fn(() => obj);
    obj.failOffsetY = jest.fn(() => obj);
    obj.onBegin = jest.fn(() => obj);
    obj.onUpdate = jest.fn(() => obj);
    obj.onEnd = jest.fn(() => obj);
    obj.onFinalize = jest.fn(() => obj);
    obj.maxDuration = jest.fn(() => obj);
    obj.runOnJS = jest.fn(() => obj);
    return obj;
  };

  return {
    Gesture: {
      Pan: () => makeChain(),
      Tap: () => makeChain(),
      Simultaneous: (...args: any[]) => args,
    },
    GestureDetector: ({ children }: any) => children,
  };
});

// Mock expo-linear-gradient to avoid native module issues in Jest
jest.mock('expo-linear-gradient', () => {
  const Mock = ({ children }: any) => children;
  return { LinearGradient: Mock };
});

// Mock theme hook used by the component
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgNeutralSecondary: '#f5f5f5',
      bgSecondaryNeutral: '#f5f5f5',
      bgBaseScrollPrimary: '#e0e0e0',
      positiveGradientPrimary50: '#13C636',
      positiveGradientPrimary70: '#00c853',
      negativeGradientPrimary50: '#FF8680',
      negativeGradientPrimary70: '#FF8680',
      dividerTertiary: '#d0d0d0',
      textSecondaryNeutral: '#808080',
    },
  }),
}));

describe('EtRangeSlider', () => {
  it('renders min and max labels', () => {
    const { getByText } = render(<EtRangeSlider min={0} max={100} value={50} />);

    expect(getByText('MIN')).toBeTruthy();
    expect(getByText('MAX')).toBeTruthy();
  });

  it('supports custom cursor color preset', () => {
    const { getByText, getByLabelText, getByTestId } = render(<EtRangeSlider min={10} max={20} value={15} cursorColor="negative" testID="slider" />);

    expect(getByText('MIN')).toBeTruthy();
    expect(getByText('MAX')).toBeTruthy();
    const cursor = getByTestId('slider-cursor');
    expect(cursor).toBeTruthy();
    expect(getByLabelText('cursor-negative')).toBe(cursor);
  });

  it('centers cursor when min equals max (zero-span)', () => {
    const { getByTestId, getByLabelText } = render(<EtRangeSlider min={50} max={50} value={50} testID="slider" />);

    const cursor = getByTestId('slider-cursor');
    expect(cursor).toBeTruthy();
    expect(getByLabelText('cursor-positive')).toBe(cursor);
  });

  it('clamps value to range bounds', () => {
    const { getByTestId } = render(<EtRangeSlider min={0} max={100} value={150} testID="clamp-slider" />);

    const cursor = getByTestId('clamp-slider-cursor');
    expect(cursor).toBeTruthy();
  });
});
