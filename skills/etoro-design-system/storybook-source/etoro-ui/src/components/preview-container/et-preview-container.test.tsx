import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { EtPreviewContainer } from './et-preview-container';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light' },
}));

jest.mock('expo-blur', () => {
  const { View: RNView } = require('react-native');
  return { BlurView: (props: Record<string, unknown>) => <RNView testID="BlurView" {...props} /> };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    dark: true,
    colors: {
      bgButtonGroupPressed: '#222',
      backgroundBase: '#0b0d10',
      bgNeutralSecondary: '#2a2a2a',
      carbon300: '#444',
      carbonStatic900: '#1b1e21',
      carbonEffectPrimaryShadow: 'rgba(0,0,0,0.06)',
    },
  }),
}));

const mockUseLiquidGlass = jest.fn(() => ({ supportsLiquidGlass: false }));
jest.mock('../../core/liquid-glass', () => {
  const { View: RNView } = require('react-native');
  const { createContext } = require('react');
  return {
    EtGlassView: ({ children, style, fallbackStyle }: { children?: React.ReactNode; style?: unknown; fallbackStyle?: unknown }) => (
      <RNView testID="EtGlassView" style={[style, fallbackStyle]}>
        {children}
      </RNView>
    ),
    LiquidGlassContext: createContext({ isLiquidGlass: false }),
    useLiquidGlass: () => mockUseLiquidGlass(),
  };
});

const mockTabBarVisibility = { value: true };
jest.mock('../screen/api/tab-bar-visibility.context', () => ({
  useTabBarVisibility: () => mockTabBarVisibility,
}));

describe('EtPreviewContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLiquidGlass.mockReturnValue({ supportsLiquidGlass: false });
    mockTabBarVisibility.value = true;
  });

  it('renders children in Content and Trailing slots', () => {
    render(
      <EtPreviewContainer accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
          <Text>$100</Text>
        </EtPreviewContainer.Content>
        <EtPreviewContainer.Trailing>
          <Text>Chart</Text>
        </EtPreviewContainer.Trailing>
      </EtPreviewContainer>,
    );

    expect(screen.getByText('Label')).toBeTruthy();
    expect(screen.getByText('$100')).toBeTruthy();
    expect(screen.getByText('Chart')).toBeTruthy();
  });

  it('renders the grab handle by default', () => {
    render(
      <EtPreviewContainer accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    expect(screen.getByTestId('preview.Handle')).toBeTruthy();
  });

  it('hides the grab handle when showHandle={false}', () => {
    render(
      <EtPreviewContainer accessibilityLabel="Preview" showHandle={false} testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    expect(screen.queryByTestId('preview.Handle')).toBeNull();
  });

  it('fires haptics and onPress when pressed', () => {
    const Haptics = require('expo-haptics');
    const onPress = jest.fn();

    render(
      <EtPreviewContainer onPress={onPress} accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    fireEvent.press(screen.getByTestId('preview'));

    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('skips haptics when haptics={false}', () => {
    const Haptics = require('expo-haptics');
    const onPress = jest.fn();

    render(
      <EtPreviewContainer onPress={onPress} haptics={false} accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    fireEvent.press(screen.getByTestId('preview'));

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();

    render(
      <EtPreviewContainer onPress={onPress} disabled accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    fireEvent.press(screen.getByTestId('preview'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes a button role only when onPress is provided', () => {
    const { rerender } = render(
      <EtPreviewContainer accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    expect(screen.getByTestId('preview').props.accessibilityRole).toBeUndefined();

    rerender(
      <EtPreviewContainer onPress={jest.fn()} accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    expect(screen.getByTestId('preview').props.accessibilityRole).toBe('button');
  });

  it('wraps in a floating container when floating={true}', () => {
    render(
      <EtPreviewContainer floating accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    expect(screen.getByTestId('preview.Floating')).toBeTruthy();
    expect(screen.getByTestId('preview')).toBeTruthy();
  });

  it('does not wrap in a floating container when floating={false}', () => {
    render(
      <EtPreviewContainer accessibilityLabel="Preview" testID="preview">
        <EtPreviewContainer.Content>
          <Text>Label</Text>
        </EtPreviewContainer.Content>
      </EtPreviewContainer>,
    );

    expect(screen.queryByTestId('preview.Floating')).toBeNull();
  });
});
