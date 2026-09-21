import { render } from '@testing-library/react-native';
import React from 'react';
import { Platform, Text, View } from 'react-native';

import { EtKeyboardAvoidingView } from './et-keyboard-avoiding-view';

// `react-native-keyboard-controller` is mocked globally in common-testing-react
// as a passthrough that spreads props (behavior, keyboardVerticalOffset, style,
// testID) onto a plain View, so we can assert what EtKeyboardAvoidingView forwards.

describe('EtKeyboardAvoidingView', () => {
  it('renders children', () => {
    const { getByText } = render(
      <EtKeyboardAvoidingView>
        <Text>composer</Text>
      </EtKeyboardAvoidingView>,
    );

    expect(getByText('composer')).toBeTruthy();
  });

  it("defaults behavior to 'padding' on iOS and forwards style + offset", () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <EtKeyboardAvoidingView testID="kav" style={{ flex: 1 }} keyboardVerticalOffset={12}>
        <View />
      </EtKeyboardAvoidingView>,
    );

    const node = getByTestId('kav');
    expect(node.props.behavior).toBe('padding');
    expect(node.props.keyboardVerticalOffset).toBe(12);
    expect(node.props.style).toEqual({ flex: 1 });
  });

  it('leaves behavior undefined on Android (relies on adjustResize)', () => {
    Platform.OS = 'android';

    const { getByTestId } = render(
      <EtKeyboardAvoidingView testID="kav">
        <View />
      </EtKeyboardAvoidingView>,
    );

    expect(getByTestId('kav').props.behavior).toBeUndefined();

    Platform.OS = 'ios';
  });

  it('respects an explicit behavior override', () => {
    Platform.OS = 'android';

    const { getByTestId } = render(
      <EtKeyboardAvoidingView testID="kav" behavior="height">
        <View />
      </EtKeyboardAvoidingView>,
    );

    expect(getByTestId('kav').props.behavior).toBe('height');

    Platform.OS = 'ios';
  });
});
