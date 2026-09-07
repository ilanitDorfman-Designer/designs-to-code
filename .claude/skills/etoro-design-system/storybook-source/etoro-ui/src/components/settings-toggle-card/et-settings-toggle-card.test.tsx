import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { EtSettingsToggleCard } from './et-settings-toggle-card';

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      cardDefault: '#ffffff',
      textPrimaryNeutral: '#111111',
      textSecondaryNeutral: '#666666',
      dividerQuinary: '#eeeeee',
    },
  }),
}));

jest.mock('../../foundations/text/et-text', () => {
  const { Text } = require('react-native');
  return { EtText: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text> };
});

jest.mock('../controls/toggle-switch/et-toggle-switch', () => {
  const { Pressable } = require('react-native');
  return {
    EtToggleSwitch: ({ value, onValueChange, testID, accessibilityState }: any) => (
      <Pressable testID={testID} accessibilityState={accessibilityState} onPress={() => onValueChange?.(!value)} />
    ),
  };
});

jest.mock('../et-icon-v2', () => {
  const { View } = require('react-native');
  return { EtIconV2: ({ name }: { name: string }) => <View testID={`icon-${name}`} /> };
});

jest.mock('../list/list-item-v2/et-list-item', () => {
  const { Pressable, View } = require('react-native');
  const EtListItem = ({ children, onPress, testID, accessibilityLabel }: any) => (
    <Pressable testID={testID} accessibilityLabel={accessibilityLabel} onPress={onPress}>
      {children}
    </Pressable>
  );
  EtListItem.Start = ({ children }: any) => <View>{children}</View>;
  return { EtListItem };
});

const baseProps = {
  title: 'Advanced view',
  subtitle: 'Show more columns',
  value: false,
  onValueChange: jest.fn(),
};

describe('EtSettingsToggleCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders title, subtitle, and the toggle reflecting the value', () => {
    const { getByText, getByTestId } = render(<EtSettingsToggleCard {...baseProps} value testID="row" toggleTestID="toggle" />);

    expect(getByText('Advanced view')).toBeTruthy();
    expect(getByText('Show more columns')).toBeTruthy();
    expect(getByTestId('toggle').props.accessibilityState).toEqual({ checked: true });
  });

  it('calls onValueChange with the flipped value when the toggle is pressed', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(<EtSettingsToggleCard {...baseProps} value={false} onValueChange={onValueChange} toggleTestID="toggle" />);

    fireEvent.press(getByTestId('toggle'));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('hides the action row while the toggle is off', () => {
    const { queryByTestId } = render(
      <EtSettingsToggleCard {...baseProps} value={false} action={{ label: 'Manage columns', onPress: jest.fn(), testID: 'manage' }} />,
    );

    expect(queryByTestId('manage')).toBeNull();
  });

  it('reveals the action row only while the toggle is on and forwards presses', () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = render(
      <EtSettingsToggleCard {...baseProps} value action={{ label: 'Manage columns', onPress, testID: 'manage' }} />,
    );

    expect(getByText('Manage columns')).toBeTruthy();
    fireEvent.press(getByTestId('manage'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render an action row when no action is provided', () => {
    const { queryByTestId } = render(<EtSettingsToggleCard {...baseProps} value />);

    expect(queryByTestId('icon-nut')).toBeNull();
  });
});
