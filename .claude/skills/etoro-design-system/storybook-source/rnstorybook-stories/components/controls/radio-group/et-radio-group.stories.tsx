import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtRadioGroup, EtText } from 'etoro-ui';

type Story = StoryObj<typeof EtRadioGroup>;

const meta: Meta<typeof EtRadioGroup> = {
  title: 'eToro-UI/Components/Controls/EtRadioGroup',
  component: EtRadioGroup,
  parameters: {
    notes:
      'Controlled radio group with compound component pattern. Options cannot be unselected - only a different option can be selected. Use the direction prop for layout.',
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
  render: () => {
    const [basicValue, setBasicValue] = useState<string | null>(null);
    const [errorValue, setErrorValue] = useState<string | null>(null);

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Basic Section */}
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Radio Group (Interactive)
          </EtText>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Select an option
            </EtText>
            <EtRadioGroup value={basicValue} onChange={setBasicValue}>
              <EtRadioGroup.Option value="option1">Option 1</EtRadioGroup.Option>
              <EtRadioGroup.Option value="option2">Option 2</EtRadioGroup.Option>
              <EtRadioGroup.Option value="option3">Option 3</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {basicValue ?? 'none'}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Error State (select to clear)
            </EtText>
            <EtRadioGroup value={errorValue} onChange={setErrorValue} error>
              <EtRadioGroup.Option value="required1">Required option 1</EtRadioGroup.Option>
              <EtRadioGroup.Option value="required2">Required option 2</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {errorValue ?? 'none'}
            </EtText>
          </View>
        </View>
      </ScrollView>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.variantSection}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          All States
        </EtText>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Active States
          </EtText>
          <EtRadioGroup value="selected" onChange={() => {}}>
            <EtRadioGroup.Option value="unselected">Unselected</EtRadioGroup.Option>
            <EtRadioGroup.Option value="selected">Selected</EtRadioGroup.Option>
          </EtRadioGroup>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Error State (unselected shows red)
          </EtText>
          <EtRadioGroup value="selected" onChange={() => {}} error>
            <EtRadioGroup.Option value="unselected">Unselected with error</EtRadioGroup.Option>
            <EtRadioGroup.Option value="selected">Selected (no error)</EtRadioGroup.Option>
          </EtRadioGroup>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Disabled States (group disabled)
          </EtText>
          <EtRadioGroup value="selected" onChange={() => {}} disabled>
            <EtRadioGroup.Option value="unselected">Disabled Unselected</EtRadioGroup.Option>
            <EtRadioGroup.Option value="selected">Disabled Selected</EtRadioGroup.Option>
          </EtRadioGroup>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Individual Option Disabled
          </EtText>
          <EtRadioGroup value="enabled" onChange={() => {}}>
            <EtRadioGroup.Option value="enabled">Enabled option</EtRadioGroup.Option>
            <EtRadioGroup.Option value="disabled" disabled>
              Disabled option
            </EtRadioGroup.Option>
          </EtRadioGroup>
        </View>
      </View>
    </ScrollView>
  ),
};

export const LayoutExamples: Story = {
  render: () => {
    const [shipping, setShipping] = useState<string | null>('standard');
    const [size, setSize] = useState<string | null>('small');

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Layout Examples
          </EtText>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Vertical Layout (default)
            </EtText>
            <EtRadioGroup value={shipping} onChange={setShipping}>
              <EtRadioGroup.Option value="standard">Standard (5-7 days)</EtRadioGroup.Option>
              <EtRadioGroup.Option value="express">Express (2-3 days)</EtRadioGroup.Option>
              <EtRadioGroup.Option value="overnight">Overnight (next day)</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {shipping}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Horizontal Layout
            </EtText>
            <EtRadioGroup value={size} onChange={setSize} direction="horizontal">
              <EtRadioGroup.Option value="small">Small</EtRadioGroup.Option>
              <EtRadioGroup.Option value="medium">Medium</EtRadioGroup.Option>
              <EtRadioGroup.Option value="large">Large</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {size}
            </EtText>
          </View>
        </View>
      </ScrollView>
    );
  },
};

export const FormExamples: Story = {
  render: () => {
    const [paymentMethod, setPaymentMethod] = useState<string | null>('credit');
    const [accountType, setAccountType] = useState<string | null>('personal');
    const [contactPreference, setContactPreference] = useState<string | null>('email');

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Form Examples
          </EtText>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Payment Method
            </EtText>
            <EtRadioGroup value={paymentMethod} onChange={setPaymentMethod}>
              <EtRadioGroup.Option value="credit">Credit Card</EtRadioGroup.Option>
              <EtRadioGroup.Option value="debit">Debit Card</EtRadioGroup.Option>
              <EtRadioGroup.Option value="paypal">PayPal</EtRadioGroup.Option>
              <EtRadioGroup.Option value="bank">Bank Transfer</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {paymentMethod}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Account Type
            </EtText>
            <EtRadioGroup value={accountType} onChange={setAccountType}>
              <EtRadioGroup.Option value="personal">Personal Account</EtRadioGroup.Option>
              <EtRadioGroup.Option value="business">Business Account</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {accountType}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Contact Preference (Horizontal)
            </EtText>
            <EtRadioGroup value={contactPreference} onChange={setContactPreference} direction="horizontal">
              <EtRadioGroup.Option value="email">Email</EtRadioGroup.Option>
              <EtRadioGroup.Option value="phone">Phone</EtRadioGroup.Option>
              <EtRadioGroup.Option value="sms">SMS</EtRadioGroup.Option>
            </EtRadioGroup>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {contactPreference}
            </EtText>
          </View>
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  variantSection: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  demoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  demoTitle: {
    marginBottom: 4,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
});
