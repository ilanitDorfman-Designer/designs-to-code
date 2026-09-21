import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nManager, StyleSheet, Text } from 'react-native';

import { EtToggleGroup } from './et-toggle-group';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const ReactLib = require('react');

  const AnimatedView = ReactLib.forwardRef((props: Record<string, unknown>, ref: React.Ref<typeof RN.View>) => {
    return ReactLib.createElement(RN.View, { ...props, ref });
  });
  AnimatedView.displayName = 'Animated.View';

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
    },
    View: AnimatedView,
    useSharedValue: <T,>(v: T) => {
      const sv = { value: v };
      return {
        get value() {
          return sv.value;
        },
        set value(next: T) {
          sv.value = next;
        },
        get: () => sv.value,
        set: (next: T) => {
          sv.value = next;
        },
      };
    },
    useAnimatedStyle: (fn: () => Record<string, unknown>) => fn(),
    withSpring: <T,>(v: T) => v,
  };
});

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      carbon900: '#1B1E21',
      carbonPrimaryDivider: '#B2B2B24D',
    },
  }),
}));

describe('EtToggleGroup', () => {
  const originalIsRTL = I18nManager.isRTL;

  afterEach(() => {
    (I18nManager as { isRTL: boolean }).isRTL = originalIsRTL;
  });

  it('renders default size at 40px height', () => {
    const { getByTestId } = render(
      <EtToggleGroup selectedId="one" testID="toggle-group">
        <EtToggleGroup.Option id="one">
          <Text>One</Text>
        </EtToggleGroup.Option>
        <EtToggleGroup.Option id="two">
          <Text>Two</Text>
        </EtToggleGroup.Option>
      </EtToggleGroup>,
    );

    expect(StyleSheet.flatten(getByTestId('toggle-group').props.style)).toMatchObject({
      width: 72,
      height: 40,
    });
  });

  it('renders small size at 32px height', () => {
    const { getByTestId } = render(
      <EtToggleGroup selectedId="one" size="small" testID="toggle-group">
        <EtToggleGroup.Option id="one">
          <Text>One</Text>
        </EtToggleGroup.Option>
        <EtToggleGroup.Option id="two">
          <Text>Two</Text>
        </EtToggleGroup.Option>
      </EtToggleGroup>,
    );

    expect(StyleSheet.flatten(getByTestId('toggle-group').props.style)).toMatchObject({
      width: 56,
      height: 32,
    });
  });

  it('calls onSelectionChange with pressed option id', () => {
    const onSelectionChange = jest.fn();
    const { getByText } = render(
      <EtToggleGroup selectedId="one" onSelectionChange={onSelectionChange}>
        <EtToggleGroup.Option id="one">
          <Text>One</Text>
        </EtToggleGroup.Option>
        <EtToggleGroup.Option id="two">
          <Text>Two</Text>
        </EtToggleGroup.Option>
      </EtToggleGroup>,
    );

    fireEvent.press(getByText('Two'));

    expect(onSelectionChange).toHaveBeenCalledWith('two');
  });

  it('passes selected state to render children', () => {
    const { getByText } = render(
      <EtToggleGroup selectedId="one">
        <EtToggleGroup.Option id="one">{({ selected }) => <Text>{selected ? 'Selected' : 'Idle'}</Text>}</EtToggleGroup.Option>
        <EtToggleGroup.Option id="two">{({ selected }) => <Text>{selected ? 'Selected' : 'Idle'}</Text>}</EtToggleGroup.Option>
      </EtToggleGroup>,
    );

    expect(getByText('Selected')).toBeTruthy();
    expect(getByText('Idle')).toBeTruthy();
  });

  it('anchors the indicator from the physical left and mirrors index in RTL', () => {
    (I18nManager as { isRTL: boolean }).isRTL = true;

    const { getByTestId } = render(
      <EtToggleGroup selectedId="two" testID="toggle-group">
        <EtToggleGroup.Option id="one">
          <Text>One</Text>
        </EtToggleGroup.Option>
        <EtToggleGroup.Option id="two">
          <Text>Two</Text>
        </EtToggleGroup.Option>
      </EtToggleGroup>,
    );

    const indicatorStyle = StyleSheet.flatten(getByTestId('toggle-group-indicator').props.style);
    // right:padding swaps to physical left under doLeftAndRightSwapInRTL
    expect(indicatorStyle).toMatchObject({ right: 4 });
    // selected index 1 → physical-left index 0 in a 2-option RTL group
    expect(indicatorStyle).toMatchObject({
      transform: [{ translateX: 0 }],
    });
  });

  it('positions the indicator at the physical right for the first option in RTL', () => {
    (I18nManager as { isRTL: boolean }).isRTL = true;

    const { getByTestId } = render(
      <EtToggleGroup selectedId="one" testID="toggle-group">
        <EtToggleGroup.Option id="one">
          <Text>One</Text>
        </EtToggleGroup.Option>
        <EtToggleGroup.Option id="two">
          <Text>Two</Text>
        </EtToggleGroup.Option>
      </EtToggleGroup>,
    );

    const indicatorStyle = StyleSheet.flatten(getByTestId('toggle-group-indicator').props.style);
    expect(indicatorStyle).toMatchObject({
      right: 4,
      transform: [{ translateX: 32 }],
    });
  });
});
