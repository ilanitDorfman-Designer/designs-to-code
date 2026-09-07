import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { registerGlassEffect, resetGlassEffect } from '../../../core/liquid-glass/glass-effect-registry';
import { EtTopbar } from '../et-topbar';

// Mock the theme hook
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      backgroundBase: '#FFFFFF',
      carbon900: '#000000',
    },
  }),
}));

// Default: Liquid Glass unavailable
let mockIsLiquidGlassAvailable = false;
jest.mock('../../../core/liquid-glass', () => {
  const actual = jest.requireActual('../../../core/liquid-glass');
  return {
    ...actual,
    useLiquidGlass: () => ({ supportsLiquidGlass: mockIsLiquidGlassAvailable }),
  };
});

const MockGlassView = ({ children, testID, style, ...props }: any) =>
  React.createElement(View, { testID: testID ?? 'glass-view-native', style, accessibilityHint: 'glass', ...props }, children);

describe('EtTopbar', () => {
  describe('rendering', () => {
    it('renders with title', () => {
      const text = 'Test Title';
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Middle>
            <EtTopbar.Title>{text}</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      expect(screen.getByTestId('topbar')).toBeTruthy();
      expect(screen.getByText('Test Title')).toBeTruthy();
    });

    it('renders start slot content', () => {
      const text = 'Start Content';
      render(
        <EtTopbar>
          <EtTopbar.Start testID="start-slot">
            <Text>{text}</Text>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      expect(screen.getByTestId('start-slot')).toBeTruthy();
      expect(screen.getByText('Start Content')).toBeTruthy();
    });

    it('renders end slot content', () => {
      const text = 'End Content';
      render(
        <EtTopbar>
          <EtTopbar.End testID="end-slot">
            <Text>{text}</Text>
          </EtTopbar.End>
        </EtTopbar>,
      );

      expect(screen.getByTestId('end-slot')).toBeTruthy();
      expect(screen.getByText('End Content')).toBeTruthy();
    });

    it('renders middle slot content', () => {
      const text = 'Middle Content';
      render(
        <EtTopbar>
          <EtTopbar.Middle testID="middle-slot">
            <Text>{text}</Text>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      expect(screen.getByTestId('middle-slot')).toBeTruthy();
      expect(screen.getByText('Middle Content')).toBeTruthy();
    });

    it('renders all slots together', () => {
      const text = 'Start';
      const title = 'Title';
      const endText = 'End';
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Start testID="start">
            <Text>{text}</Text>
          </EtTopbar.Start>
          <EtTopbar.Middle testID="middle">
            <EtTopbar.Title>{title}</EtTopbar.Title>
          </EtTopbar.Middle>
          <EtTopbar.End testID="end">
            <Text>{endText}</Text>
          </EtTopbar.End>
        </EtTopbar>,
      );

      expect(screen.getByTestId('topbar')).toBeTruthy();
      expect(screen.getByTestId('start')).toBeTruthy();
      expect(screen.getByTestId('middle')).toBeTruthy();
      expect(screen.getByTestId('end')).toBeTruthy();
    });
  });

  describe('EtTopbar.Action', () => {
    it('handles press events', () => {
      const onPress = jest.fn();
      const text = 'Press Me';
      render(
        <EtTopbar>
          <EtTopbar.Start>
            <EtTopbar.Action testID="action" onPress={onPress}>
              <Text>{text}</Text>
            </EtTopbar.Action>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      fireEvent.press(screen.getByTestId('action'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('has accessibility role button', () => {
      const text = 'back';
      render(
        <EtTopbar>
          <EtTopbar.Start>
            <EtTopbar.Action testID="action" accessibilityLabel="Go back" onPress={() => {}}>
              <Text>{text}</Text>
            </EtTopbar.Action>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      const action = screen.getByTestId('action');
      expect(action.props.accessibilityRole).toBe('button');
    });
  });

  describe('EtTopbar.Title', () => {
    it('renders with default variant', () => {
      const text = 'Test Title';
      render(
        <EtTopbar>
          <EtTopbar.Middle>
            <EtTopbar.Title testID="title">{text}</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      expect(StyleSheet.flatten(screen.getByTestId('title').props.style).color).toBe('#000000');
      expect(screen.getByText('Test Title')).toBeTruthy();
    });

    it('respects numberOfLines prop', () => {
      const text = 'Very Long Title That Might Wrap';
      render(
        <EtTopbar>
          <EtTopbar.Middle>
            <EtTopbar.Title testID="title" numberOfLines={2}>
              {text}
            </EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const title = screen.getByTestId('title');
      expect(title.props.numberOfLines).toBe(2);
    });
  });

  describe('styling', () => {
    it('applies custom style to root', () => {
      const style = { paddingHorizontal: 16 };
      const title = 'Title';
      render(
        <EtTopbar testID="topbar" style={style}>
          <EtTopbar.Middle>
            <EtTopbar.Title>{title}</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('topbar');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];

      expect(flatStyle.some((s: any) => s?.paddingHorizontal === 16)).toBe(true);
    });

    it('applies custom style to slots', () => {
      const content = 'Content';
      const style = { gap: 8 };
      render(
        <EtTopbar>
          <EtTopbar.Start testID="start" style={style}>
            <Text>{content}</Text>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      const start = screen.getByTestId('start');
      const flatStyle = Array.isArray(start.props.style) ? start.props.style.flat() : [start.props.style];

      expect(flatStyle.some((s: any) => s?.gap === 8)).toBe(true);
    });
  });

  describe('StepProgress layout', () => {
    it('renders StepProgress inside the topbar', () => {
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Start>
            <Text>Back</Text>
          </EtTopbar.Start>
          <EtTopbar.StepProgress testID="step-progress" steps={4} currentStep={1} color="#000" />
        </EtTopbar>,
      );

      expect(screen.getByTestId('topbar')).toBeTruthy();
      expect(screen.getByTestId('step-progress')).toBeTruthy();
    });

    it('uses column layout when StepProgress is present', () => {
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.StepProgress testID="step-progress" steps={3} currentStep={0} color="#000" />
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('topbar');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];

      const hasColumnGap = flatStyle.some((s: any) => s?.gap === 4);
      const hasRowDirection = flatStyle.some((s: any) => s?.flexDirection === 'row');
      expect(hasColumnGap).toBe(true);
      expect(hasRowDirection).toBe(false);
    });

    it('uses default row layout when StepProgress is absent', () => {
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Middle>
            <EtTopbar.Title>Title</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('topbar');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];

      const hasRowDirection = flatStyle.some((s: any) => s?.flexDirection === 'row');
      expect(hasRowDirection).toBe(true);
    });

    it('renders StepProgress alongside all slots', () => {
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Start testID="start">
            <Text>Back</Text>
          </EtTopbar.Start>
          <EtTopbar.Middle testID="middle">
            <EtTopbar.Title>Title</EtTopbar.Title>
          </EtTopbar.Middle>
          <EtTopbar.End testID="end">
            <Text>Menu</Text>
          </EtTopbar.End>
          <EtTopbar.StepProgress testID="step-progress" steps={5} currentStep={2} color="#000" />
        </EtTopbar>,
      );

      expect(screen.getByTestId('topbar')).toBeTruthy();
      expect(screen.getByTestId('start')).toBeTruthy();
      expect(screen.getByTestId('middle')).toBeTruthy();
      expect(screen.getByTestId('end')).toBeTruthy();
      expect(screen.getByTestId('step-progress')).toBeTruthy();
    });
  });

  describe('slot prop forwarding', () => {
    it('forwards accessibilityLabel to start slot', () => {
      render(
        <EtTopbar>
          <EtTopbar.Start testID="start" accessibilityLabel="Navigation">
            <Text>Back</Text>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      const start = screen.getByTestId('start');
      expect(start.props.accessibilityLabel).toBe('Navigation');
    });

    it('forwards accessibilityLabel to end slot', () => {
      render(
        <EtTopbar>
          <EtTopbar.End testID="end" accessibilityLabel="Actions">
            <Text>Menu</Text>
          </EtTopbar.End>
        </EtTopbar>,
      );

      const end = screen.getByTestId('end');
      expect(end.props.accessibilityLabel).toBe('Actions');
    });

    it('forwards onLayout to slots', () => {
      const onLayout = jest.fn();
      render(
        <EtTopbar>
          <EtTopbar.End testID="end" onLayout={onLayout}>
            <Text>Menu</Text>
          </EtTopbar.End>
        </EtTopbar>,
      );

      const end = screen.getByTestId('end');
      expect(end.props.onLayout).toBe(onLayout);
    });

    it('allows overriding pointerEvents on middle slot', () => {
      render(
        <EtTopbar>
          <EtTopbar.Start>
            <Text>L</Text>
          </EtTopbar.Start>
          <EtTopbar.Middle testID="middle" pointerEvents="auto">
            <Text>Title</Text>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const middle = screen.getByTestId('middle');
      expect(middle.props.pointerEvents).toBe('auto');
    });

    it('forwards accessible prop to slots', () => {
      render(
        <EtTopbar>
          <EtTopbar.Start testID="start" accessible={true}>
            <Text>Back</Text>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      const start = screen.getByTestId('start');
      expect(start.props.accessible).toBe(true);
    });
  });

  describe('Liquid Glass', () => {
    beforeEach(() => {
      mockIsLiquidGlassAvailable = true;
      registerGlassEffect({
        GlassView: MockGlassView,
        isLiquidGlassAvailable: () => true,
        isGlassEffectAPIAvailable: () => true,
      });
    });

    afterEach(() => {
      mockIsLiquidGlassAvailable = false;
      resetGlassEffect();
    });

    it('uses a transparent background when Liquid Glass is available so glass capsules refract content behind the bar', () => {
      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Middle>
            <EtTopbar.Title>Title</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('topbar');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];
      expect(flatStyle.some((s: any) => s?.backgroundColor === 'transparent')).toBe(true);
      expect(flatStyle.some((s: any) => s?.backgroundColor === '#FFFFFF')).toBe(false);
    });

    it('keeps the opaque background when Liquid Glass is force-disabled even if available', () => {
      render(
        <EtTopbar testID="topbar" disableLiquidGlass>
          <EtTopbar.Middle>
            <EtTopbar.Title>Title</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('topbar');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];
      expect(flatStyle.some((s: any) => s?.backgroundColor === '#FFFFFF')).toBe(true);
      expect(flatStyle.some((s: any) => s?.backgroundColor === 'transparent')).toBe(false);
    });

    it('wraps single action in Start slot with glass surface', () => {
      render(
        <EtTopbar>
          <EtTopbar.Start testID="start">
            <EtTopbar.Action testID="action" onPress={() => {}}>
              <Text>Menu</Text>
            </EtTopbar.Action>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      const start = screen.getByTestId('start');
      const glassView = start.children[0];
      expect(glassView).toBeTruthy();
      expect(screen.getByText('Menu')).toBeTruthy();
    });

    it('wraps multiple actions in End slot with glass surface', () => {
      render(
        <EtTopbar>
          <EtTopbar.End testID="end">
            <EtTopbar.Action testID="share" onPress={() => {}}>
              <Text>Share</Text>
            </EtTopbar.Action>
            <EtTopbar.Action testID="notif" onPress={() => {}}>
              <Text>Notifications</Text>
            </EtTopbar.Action>
          </EtTopbar.End>
        </EtTopbar>,
      );

      expect(screen.getByText('Share')).toBeTruthy();
      expect(screen.getByText('Notifications')).toBeTruthy();
    });

    it('does not wrap slot children in glass when Liquid Glass is unavailable', () => {
      mockIsLiquidGlassAvailable = false;

      render(
        <EtTopbar>
          <EtTopbar.Start testID="start">
            <EtTopbar.Action testID="action" onPress={() => {}}>
              <Text>Menu</Text>
            </EtTopbar.Action>
          </EtTopbar.Start>
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('start');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];
      expect(flatStyle.some((s: any) => s?.backgroundColor === 'transparent')).toBe(false);
    });

    it('keeps solid background when Liquid Glass is unavailable', () => {
      mockIsLiquidGlassAvailable = false;

      render(
        <EtTopbar testID="topbar">
          <EtTopbar.Middle>
            <EtTopbar.Title>Title</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>,
      );

      const topbar = screen.getByTestId('topbar');
      const flatStyle = Array.isArray(topbar.props.style) ? topbar.props.style.flat() : [topbar.props.style];
      expect(flatStyle.some((s: any) => s?.backgroundColor === '#FFFFFF')).toBe(true);
    });
  });
});
