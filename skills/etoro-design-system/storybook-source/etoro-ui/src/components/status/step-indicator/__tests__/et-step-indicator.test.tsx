import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { EtStepIndicator } from '../et-step-indicator';

// Mock reanimated so useAnimatedStyle evaluates its worklet at render time,
// making the animated fill width observable in the rendered style.
jest.mock('react-native-reanimated', () => {
  const { View, Animated: RNAnimated } = require('react-native');
  return {
    __esModule: true,
    default: {
      ...RNAnimated,
      View,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    // Stateful shared value: assigning `.value` re-renders, so the animated
    // style below re-evaluates and the new width shows up in rendered styles.
    useSharedValue: jest.fn((initial: unknown) => {
      const React = require('react');
      const [value, setValue] = React.useState(initial);
      const ref = React.useRef({ value: initial });
      ref.current = {
        get value() {
          return value;
        },
        set value(next: unknown) {
          setValue(next);
        },
      };
      return ref.current;
    }),
    useAnimatedStyle: jest.fn((worklet: () => object) => worklet()),
    withTiming: jest.fn((toValue: unknown) => toValue),
    Easing: {
      out: jest.fn(() => undefined),
      cubic: undefined,
    },
    createAnimatedComponent: (Component: unknown) => Component,
  };
});

// Mock useEtoroTheme hook
jest.mock('../../../../core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

const STEPS = ['Profile', 'Verification', 'Deposit'];

function layoutStep(testID: string, x: number, width: number) {
  fireEvent(screen.getByTestId(testID), 'layout', {
    nativeEvent: { layout: { x, y: 0, width, height: 30 } },
  });
}

function layoutAllSteps(testID = 'indicator') {
  layoutStep(`${testID}-step-0`, 0, 60);
  layoutStep(`${testID}-step-1`, 120, 80);
  layoutStep(`${testID}-step-2`, 250, 50);
}

function getDotColor(testID: string): string | undefined {
  const style = StyleSheet.flatten(screen.getByTestId(testID).props.style);
  return style.backgroundColor as string | undefined;
}

describe('EtStepIndicator', () => {
  it('renders all step labels', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={0} testID="indicator" />);

    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Verification')).toBeTruthy();
    expect(screen.getByText('Deposit')).toBeTruthy();
  });

  it('applies testIDs to steps, dots and labels', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={0} testID="indicator" />);

    STEPS.forEach((_, index) => {
      expect(screen.getByTestId(`indicator-step-${index}`)).toBeTruthy();
      expect(screen.getByTestId(`indicator-step-${index}-dot`)).toBeTruthy();
      expect(screen.getByTestId(`indicator-step-${index}-label`)).toBeTruthy();
    });
  });

  it('renders the track and fill only after the step columns are measured', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={1} testID="indicator" />);

    expect(screen.queryByTestId('indicator-track')).toBeNull();
    expect(screen.queryByTestId('indicator-fill')).toBeNull();

    layoutAllSteps();

    expect(screen.getByTestId('indicator-track')).toBeTruthy();
    expect(screen.getByTestId('indicator-fill')).toBeTruthy();
  });

  it('spans the track from the first dot center to the last dot center', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={1} testID="indicator" />);

    layoutAllSteps();

    const trackStyle = StyleSheet.flatten(screen.getByTestId('indicator-track').props.style);
    // First column is start-aligned → dot center = x + size / 2 (default 10);
    // others are centered → x + width / 2
    expect(trackStyle.left).toBe(5);
    expect(trackStyle.width).toBe(250 + 50 / 2 - 5);
  });

  it('sticks the fill end to the dot center at integer step positions, even with uneven dot spacing', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={1} testID="indicator" />);

    // Uneven spacing: dot centers land at 5, 160 and 275 — the middle dot is
    // NOT at the midpoint of the track (140), so a plain proportional fill
    // (0.5 * 270 = 135) would miss it.
    layoutAllSteps();

    const fillStyle = StyleSheet.flatten(screen.getByTestId('indicator-fill').props.style);
    expect(fillStyle.width).toBe(160 - 5);
  });

  it('scales the track and dots from the size prop', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={0} size={16} testID="indicator" />);

    layoutAllSteps();

    const trackStyle = StyleSheet.flatten(screen.getByTestId('indicator-track').props.style);
    expect(trackStyle.height).toBe(4); // size * 0.25
    expect(trackStyle.left).toBe(8); // first dot center = size / 2

    const activeDot = StyleSheet.flatten(screen.getByTestId('indicator-step-0-dot').props.style);
    const inactiveDot = StyleSheet.flatten(screen.getByTestId('indicator-step-1-dot').props.style);
    expect(activeDot.width).toBe(16);
    expect(inactiveDot.width).toBe(12); // size * 0.75
  });

  it('tints reached dots with the fill color and unreached dots with the track color', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={1} color="#00ff00" trackColor="#cccccc" testID="indicator" />);

    // Default progress for currentStep=1 of 3 steps is 0.5 → steps 0 and 1 reached
    expect(getDotColor('indicator-step-0-dot')).toBe('#00ff00');
    expect(getDotColor('indicator-step-1-dot')).toBe('#00ff00');
    expect(getDotColor('indicator-step-2-dot')).toBe('#cccccc');
  });

  it('supports an explicit progress override', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={0} progress={1} color="#00ff00" trackColor="#cccccc" testID="indicator" />);

    expect(getDotColor('indicator-step-0-dot')).toBe('#00ff00');
    expect(getDotColor('indicator-step-1-dot')).toBe('#00ff00');
    expect(getDotColor('indicator-step-2-dot')).toBe('#00ff00');
  });

  it('tints dots only when the fill has reached them — active-but-unreached stays track-colored', () => {
    // Deposit active at halfway Verification→Deposit (onboarding "You're verified"):
    // fill has passed Verification but not Deposit yet.
    render(<EtStepIndicator steps={STEPS} currentStep={2} progress={0.75} color="#00ff00" trackColor="#cccccc" testID="indicator" />);

    expect(getDotColor('indicator-step-0-dot')).toBe('#00ff00');
    expect(getDotColor('indicator-step-1-dot')).toBe('#00ff00');
    expect(getDotColor('indicator-step-2-dot')).toBe('#cccccc');
  });

  it('applies the active label color to the active step only', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={0} activeLabelColor="#ffffff" labelColor="#8c8c91" testID="indicator" />);

    const activeStyle = StyleSheet.flatten(screen.getByTestId('indicator-step-0-label').props.style);
    const inactiveStyle = StyleSheet.flatten(screen.getByTestId('indicator-step-1-label').props.style);

    expect(activeStyle.color).toBe('#ffffff');
    expect(inactiveStyle.color).toBe('#8c8c91');
  });

  it('clamps currentStep to the steps range', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={10} color="#00ff00" trackColor="#cccccc" testID="indicator" />);

    // Clamped to the last step → everything reached
    expect(getDotColor('indicator-step-2-dot')).toBe('#00ff00');
  });

  it('clamps progress to the 0-1 range', () => {
    render(<EtStepIndicator steps={STEPS} currentStep={0} progress={-1} color="#00ff00" trackColor="#cccccc" testID="indicator" />);

    expect(getDotColor('indicator-step-1-dot')).toBe('#cccccc');
    expect(getDotColor('indicator-step-2-dot')).toBe('#cccccc');
  });
});
