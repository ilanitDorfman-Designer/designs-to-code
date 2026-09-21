import { useTheme } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { EtScrollBlurBackdrop } from './scroll-blur-backdrop';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useTheme: jest.fn(),
}));

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return {
    BlurView: ({ children, ...props }: { children?: ReactNode }) => (
      <View testID="blur-view" {...props}>
        {children}
      </View>
    ),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const mockedUseTheme = useTheme as jest.Mock;

function Harness() {
  const scrollY = useSharedValue(100);
  return <EtScrollBlurBackdrop scrollY={scrollY} />;
}

function getOverlayGradient(rendered: ReturnType<typeof render>) {
  return rendered
    .UNSAFE_getAllByType('LinearGradient' as never)
    .find((gradient) => Array.isArray(gradient.props.locations) && gradient.props.locations.length === 3);
}

describe('EtScrollBlurBackdrop', () => {
  beforeEach(() => {
    mockedUseTheme.mockReturnValue({ dark: false });
  });

  it('uses a light blur and a backgroundBase overlay gradient in light mode', () => {
    const rendered = render(<Harness />);

    expect(rendered.getByTestId('blur-view').props.tint).toBe('light');
    expect(getOverlayGradient(rendered)?.props.colors).toEqual(['rgba(11, 13, 16, 0.86)', 'rgba(11, 13, 16, 0.72)', 'rgba(11, 13, 16, 0)']);
  });

  it('uses a dark blur and a backgroundBase overlay gradient in dark mode', () => {
    mockedUseTheme.mockReturnValue({ dark: true });

    const rendered = render(<Harness />);

    expect(rendered.getByTestId('blur-view').props.tint).toBe('dark');
    expect(getOverlayGradient(rendered)?.props.colors).toEqual(['rgba(11, 13, 16, 0.86)', 'rgba(11, 13, 16, 0.72)', 'rgba(11, 13, 16, 0)']);
  });
});
