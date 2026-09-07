import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { EtGlassFab } from './et-glass-fab';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light' },
}));

jest.mock('expo-blur', () => {
  const { View: RNView } = require('react-native');
  return { BlurView: (props: any) => <RNView testID="BlurView" {...props} /> };
});

jest.mock('../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    colors: {
      carbon050: '#fff',
      carbon900: '#1b1e21',
    },
  }),
}));

const mockUseLiquidGlass = jest.fn(() => ({ supportsLiquidGlass: false }));
jest.mock('../../core/liquid-glass', () => {
  const { View: RNView } = require('react-native');
  const { createContext } = require('react');
  return {
    EtGlassView: ({ children, style, fallbackStyle }: any) => (
      <RNView testID="EtGlassView" style={[style, fallbackStyle]}>
        {children}
      </RNView>
    ),
    LiquidGlassContext: createContext({ isLiquidGlass: false }),
    useLiquidGlass: () => mockUseLiquidGlass(),
  };
});

jest.mock('../et-icon-v2', () => {
  const { View: RNView } = require('react-native');
  return {
    EtIconV2: ({ name, size, color }: any) => <RNView testID="EtIconV2" data-icon-name={name} data-icon-size={size} data-icon-color={color} />,
  };
});

const baseProps = {
  iconName: 'plus' as const,
  onPress: jest.fn(),
  accessibilityLabel: 'Add',
};

describe('EtGlassFab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLiquidGlass.mockReturnValue({ supportsLiquidGlass: false });
  });

  it('renders the requested icon', () => {
    render(<EtGlassFab {...baseProps} iconName="sparkles-dark" />);
    expect(screen.getByTestId('EtIconV2').props['data-icon-name']).toBe('sparkles-dark');
  });

  it('fires haptics and onPress when pressed', () => {
    const Haptics = require('expo-haptics');
    render(<EtGlassFab {...baseProps} testID="fab" />);

    fireEvent.press(screen.getByTestId('fab'));

    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    expect(baseProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('skips haptics when haptics={false}', () => {
    const Haptics = require('expo-haptics');
    render(<EtGlassFab {...baseProps} haptics={false} testID="fab" />);

    fireEvent.press(screen.getByTestId('fab'));

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(baseProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    render(<EtGlassFab {...baseProps} disabled testID="fab" />);

    fireEvent.press(screen.getByTestId('fab'));

    expect(baseProps.onPress).not.toHaveBeenCalled();
  });

  it('renders the BlurView fallback when liquid glass is unavailable', () => {
    render(<EtGlassFab {...baseProps} />);
    expect(screen.getByTestId('BlurView')).toBeTruthy();
  });

  it('uses the primary Carbon color for the non-liquid-glass fallback', () => {
    render(<EtGlassFab {...baseProps} />);
    expect(StyleSheet.flatten(screen.getByTestId('EtGlassView').props.style).backgroundColor).toBe('#1b1e21');
  });

  it('uses the inverted icon color for the non-liquid-glass fallback by default', () => {
    render(<EtGlassFab {...baseProps} />);
    expect(screen.getByTestId('EtIconV2').props['data-icon-color']).toBe('#fff');
  });

  it('does not force the fallback icon color when iconColor is provided', () => {
    render(<EtGlassFab {...baseProps} iconColor="#123456" />);
    expect(screen.getByTestId('EtIconV2').props['data-icon-color']).toBe('#123456');
  });

  it('does not force the fallback icon color when liquid glass is available', () => {
    mockUseLiquidGlass.mockReturnValue({ supportsLiquidGlass: true });
    render(<EtGlassFab {...baseProps} />);
    expect(screen.getByTestId('EtIconV2').props['data-icon-color']).toBeUndefined();
  });

  it('uses a strong blur intensity for the non-liquid-glass fallback', () => {
    render(<EtGlassFab {...baseProps} />);
    expect(screen.getByTestId('BlurView').props.intensity).toBe(70);
    expect(screen.getByTestId('BlurView').props.tint).toBe('regular');
    expect(screen.getByTestId('BlurView').props.experimentalBlurMethod).toBe('dimezisBlurView');
    expect(screen.getByTestId('BlurView').props.blurReductionFactor).toBeUndefined();
  });

  it('omits the BlurView fallback when liquid glass is available', () => {
    mockUseLiquidGlass.mockReturnValue({ supportsLiquidGlass: true });
    render(<EtGlassFab {...baseProps} />);
    expect(screen.queryByTestId('BlurView')).toBeNull();
  });
});
