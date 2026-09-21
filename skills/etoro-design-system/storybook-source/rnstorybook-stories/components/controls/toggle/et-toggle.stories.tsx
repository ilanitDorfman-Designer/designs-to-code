import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtText, EtToggle } from 'etoro-ui';

type Story = StoryObj<typeof EtToggle>;

const ToggleWrapper: React.FC<{
  children: (value: boolean, setValue: (value: boolean) => void) => React.ReactNode;
}> = ({ children }) => {
  const [value, setValue] = useState(false);
  return <>{children(value, setValue)}</>;
};

const meta: Meta<typeof EtToggle> = {
  title: 'eToro-UI/Components/Controls/EtToggle',
  component: EtToggle,
  parameters: {
    notes: 'Switch component for binary choices with sizes and custom colors.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

export const Interactive: Story = {
  render: (args) => <ToggleWrapper>{(value, setValue) => <EtToggle {...args} value={value} onValueChange={setValue} />}</ToggleWrapper>,
  args: {
    size: 'medium',
    disabled: false,
    trackColorOn: undefined,
    trackColorOff: undefined,
    thumbColor: undefined,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    trackColorOn: {
      control: 'color',
    },
    trackColorOff: {
      control: 'color',
    },
    thumbColor: {
      control: 'color',
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Toggle Sizes
      </EtText>
      <View style={styles.grid}>
        <ToggleWrapper>
          {(value, setValue) => (
            <View style={styles.row}>
              <EtText variant="body-secondary-regular">Small</EtText>
              <EtToggle size="small" value={value} onValueChange={setValue} lockWhileChanging={false} />
            </View>
          )}
        </ToggleWrapper>
        <ToggleWrapper>
          {(value, setValue) => (
            <View style={styles.row}>
              <EtText variant="body-secondary-regular">Medium</EtText>
              <EtToggle size="medium" value={value} onValueChange={setValue} />
            </View>
          )}
        </ToggleWrapper>
        <ToggleWrapper>
          {(value, setValue) => (
            <View style={styles.row}>
              <EtText variant="body-secondary-regular">Large</EtText>
              <EtToggle size="large" value={value} onValueChange={setValue} />
            </View>
          )}
        </ToggleWrapper>
      </View>
    </View>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Custom Colors
      </EtText>
      <View style={styles.grid}>
        <ToggleWrapper>
          {(value, setValue) => (
            <View style={styles.row}>
              <EtText variant="body-secondary-regular">Green Theme</EtText>
              <EtToggle value={value} onValueChange={setValue} trackColorOn="#10B981" trackColorOff="#E5E7EB" thumbColor="#FFFFFF" />
            </View>
          )}
        </ToggleWrapper>
        <ToggleWrapper>
          {(value, setValue) => (
            <View style={styles.row}>
              <EtText variant="body-secondary-regular">Blue Theme</EtText>
              <EtToggle value={value} onValueChange={setValue} trackColorOn="#3B82F6" trackColorOff="#E5E7EB" thumbColor="#FFFFFF" />
            </View>
          )}
        </ToggleWrapper>
      </View>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Toggle States
      </EtText>
      <View style={styles.grid}>
        <ToggleWrapper>
          {(value, setValue) => (
            <View style={styles.row}>
              <EtText variant="body-secondary-regular">Normal</EtText>
              <EtToggle value={value} onValueChange={setValue} />
            </View>
          )}
        </ToggleWrapper>
        <View style={styles.row}>
          <EtText variant="body-secondary-regular" style={styles.disabledText}>
            Disabled (Off)
          </EtText>
          <EtToggle value={false} disabled onValueChange={() => {}} />
        </View>
        <View style={styles.row}>
          <EtText variant="body-secondary-regular" style={styles.disabledText}>
            Disabled (On)
          </EtText>
          <EtToggle value={true} disabled onValueChange={() => {}} />
        </View>
      </View>
    </View>
  ),
};

export const SettingsExample: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [privacy, setPrivacy] = useState(false);
    const [biometrics, setBiometrics] = useState(true);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Settings Screen
        </EtText>
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <EtText variant="body-secondary-regular">Push Notifications</EtText>
            <EtToggle value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.settingRow}>
            <EtText variant="body-secondary-regular">Privacy Mode</EtText>
            <EtToggle value={privacy} onValueChange={setPrivacy} />
          </View>
          <View style={styles.settingRow}>
            <EtText variant="body-secondary-regular">Biometric Login</EtText>
            <EtToggle value={biometrics} onValueChange={setBiometrics} />
          </View>
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  grid: {
    gap: 16,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 200,
    paddingVertical: 8,
  },
  disabledText: {
    opacity: 0.5,
  },
  settingsContainer: {
    gap: 16,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 280,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
