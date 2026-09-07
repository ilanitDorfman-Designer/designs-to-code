import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { EtGlassView } from '../et-glass-view';
import { registerGlassEffect, resetGlassEffect } from '../glass-effect-registry';
import { LiquidGlassContext } from '../liquid-glass-context';

const MockGlassView = ({ children, testID, style, ...props }: any) => (
  <View testID={testID ?? 'glass-view-native'} style={style} accessibilityHint="glass" {...props}>
    {children}
  </View>
);

const mockGlassModule = {
  GlassView: MockGlassView,
  isLiquidGlassAvailable: () => true,
  isGlassEffectAPIAvailable: () => true,
};

const renderWithContext = (isLiquidGlass: boolean, ui: React.ReactElement) =>
  render(<LiquidGlassContext.Provider value={{ isLiquidGlass }}>{ui}</LiquidGlassContext.Provider>);

describe('EtGlassView', () => {
  afterEach(() => {
    resetGlassEffect();
  });

  it('renders native GlassView when Liquid Glass is available', () => {
    registerGlassEffect(mockGlassModule);

    renderWithContext(
      true,
      <EtGlassView testID="glass">
        <Text>Content</Text>
      </EtGlassView>,
    );

    expect(screen.getByTestId('glass')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('renders a plain View when Liquid Glass is unavailable', () => {
    renderWithContext(
      false,
      <EtGlassView testID="fallback">
        <Text>Fallback</Text>
      </EtGlassView>,
    );

    expect(screen.getByTestId('fallback')).toBeTruthy();
    expect(screen.getByText('Fallback')).toBeTruthy();
  });

  it('applies fallbackStyle only when Liquid Glass is unavailable', () => {
    const fallbackStyle = { backgroundColor: '#ccc' };

    renderWithContext(
      false,
      <EtGlassView testID="styled-fallback" fallbackStyle={fallbackStyle}>
        <Text>Styled</Text>
      </EtGlassView>,
    );

    const view = screen.getByTestId('styled-fallback');
    const flatStyle = Array.isArray(view.props.style) ? view.props.style.flat() : [view.props.style];
    expect(flatStyle.some((s: any) => s?.backgroundColor === '#ccc')).toBe(true);
  });

  it('does not apply fallbackStyle when Liquid Glass is available', () => {
    registerGlassEffect(mockGlassModule);
    const fallbackStyle = { backgroundColor: '#ccc' };

    renderWithContext(
      true,
      <EtGlassView testID="glass-no-fallback" fallbackStyle={fallbackStyle}>
        <Text>Glass</Text>
      </EtGlassView>,
    );

    const view = screen.getByTestId('glass-no-fallback');
    const flatStyle = Array.isArray(view.props.style) ? view.props.style.flat() : [view.props.style];
    expect(flatStyle.some((s: any) => s?.backgroundColor === '#ccc')).toBe(false);
  });

  it('passes native glass appearance props only to GlassView', () => {
    registerGlassEffect(mockGlassModule);

    renderWithContext(
      true,
      <EtGlassView testID="tinted-glass" tintColor="#1B1E2114" colorScheme="light">
        <Text>Glass</Text>
      </EtGlassView>,
    );

    const view = screen.getByTestId('tinted-glass');
    expect(view.props.tintColor).toBe('#1B1E2114');
    expect(view.props.colorScheme).toBe('light');
  });

  it('does not pass native-only glass appearance props to fallback View', () => {
    renderWithContext(
      false,
      <EtGlassView testID="plain-fallback" tintColor="#1B1E2114" colorScheme="light">
        <Text>Fallback</Text>
      </EtGlassView>,
    );

    const view = screen.getByTestId('plain-fallback');
    expect(view.props.tintColor).toBeUndefined();
    expect(view.props.colorScheme).toBeUndefined();
  });

  it('defaults to isLiquidGlass: false without a provider', () => {
    render(
      <EtGlassView testID="no-provider">
        <Text>No Provider</Text>
      </EtGlassView>,
    );

    expect(screen.getByTestId('no-provider')).toBeTruthy();
    expect(screen.getByText('No Provider')).toBeTruthy();
  });

  it('renders fallback View when module is not registered even if context says glass', () => {
    renderWithContext(
      true,
      <EtGlassView testID="no-module">
        <Text>No Module</Text>
      </EtGlassView>,
    );

    expect(screen.getByTestId('no-module')).toBeTruthy();
    expect(screen.getByText('No Module')).toBeTruthy();
  });
});
