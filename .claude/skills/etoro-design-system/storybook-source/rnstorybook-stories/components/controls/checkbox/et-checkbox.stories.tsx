import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtButton, EtCheckbox, EtText } from 'etoro-ui';
import { CheckboxValueRoundOrAdd, CheckboxValueSquare } from 'etoro-ui/components/controls/checkbox';

type Story = StoryObj<typeof EtCheckbox>;

const meta: Meta<typeof EtCheckbox> = {
  title: 'eToro-UI/Components/Controls/EtCheckbox',
  component: EtCheckbox,
  parameters: {
    notes:
      'Controlled checkbox with variants: square (24x24, supports indeterminate), round (30x30, circular), and add (30x30, shows plus when unchecked). Smooth animations and haptic feedback.',
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
    const [squareValue, setSquareValue] = useState<CheckboxValueSquare>(false);
    const [squareError, setSquareError] = useState<CheckboxValueSquare>('error');
    const [squareIndeterminate, setSquareIndeterminate] = useState<CheckboxValueSquare>('indeterminate');
    const [roundValue, setRoundValue] = useState<CheckboxValueRoundOrAdd>(false);
    const [roundError, setRoundError] = useState<CheckboxValueRoundOrAdd>('error');
    const [addValue, setAddValue] = useState<CheckboxValueRoundOrAdd>(false);
    const [addError, setAddError] = useState<CheckboxValueRoundOrAdd>('error');

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Square Variant Section */}
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Square Variant (Interactive)
          </EtText>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Basic Toggle
            </EtText>
            <EtCheckbox value={squareValue} onChange={setSquareValue} variant="square">
              <EtCheckbox.Label>Toggle me</EtCheckbox.Label>
            </EtCheckbox>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(squareValue)}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Error State
            </EtText>
            <EtCheckbox value={squareError} onChange={setSquareError} variant="square">
              <EtCheckbox.Label>{squareError === 'error' ? 'Tap to fix error' : 'Checkbox'}</EtCheckbox.Label>
            </EtCheckbox>
            <View style={styles.buttonRow}>
              <EtButton onPress={() => setSquareError('error')}>Set Error</EtButton>
            </View>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(squareError)}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Indeterminate State
            </EtText>
            <EtCheckbox value={squareIndeterminate} onChange={setSquareIndeterminate} variant="square">
              <EtCheckbox.Label>{squareIndeterminate === 'indeterminate' ? 'Partial selection' : 'Checkbox'}</EtCheckbox.Label>
            </EtCheckbox>
            <View style={styles.buttonRow}>
              <EtButton onPress={() => setSquareIndeterminate('indeterminate')}>Set Indeterminate</EtButton>
            </View>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(squareIndeterminate)}
            </EtText>
          </View>
        </View>

        {/* Round Variant Section */}
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Round Variant (Interactive)
          </EtText>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Basic Toggle
            </EtText>
            <EtCheckbox value={roundValue} onChange={setRoundValue} variant="round">
              <EtCheckbox.Label>Toggle me</EtCheckbox.Label>
            </EtCheckbox>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(roundValue)}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Error State
            </EtText>
            <EtCheckbox value={roundError} onChange={setRoundError} variant="round">
              <EtCheckbox.Label>{roundError === 'error' ? 'Tap to fix error' : 'Checkbox'}</EtCheckbox.Label>
            </EtCheckbox>
            <View style={styles.buttonRow}>
              <EtButton onPress={() => setRoundError('error')}>Set Error</EtButton>
            </View>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(roundError)}
            </EtText>
          </View>
        </View>

        {/* Add Variant Section */}
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Add Variant (Interactive)
          </EtText>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Basic Toggle
            </EtText>
            <EtCheckbox value={addValue} onChange={setAddValue} variant="add">
              <EtCheckbox.Label>Shows plus when unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(addValue)}
            </EtText>
          </View>

          <View style={styles.demoCard}>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Error State
            </EtText>
            <EtCheckbox value={addError} onChange={setAddError} variant="add">
              <EtCheckbox.Label>{addError === 'error' ? 'Tap to fix error' : 'Checkbox'}</EtCheckbox.Label>
            </EtCheckbox>
            <View style={styles.buttonRow}>
              <EtButton onPress={() => setAddError('error')}>Set Error</EtButton>
            </View>
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Value: {String(addError)}
            </EtText>
          </View>
        </View>
      </ScrollView>
    );
  },
};

export const RoundVariantStates: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.variantSection}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Round Variant States (30x30)
        </EtText>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Active States
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="round">
              <EtCheckbox.Label>Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="round">
              <EtCheckbox.Label>Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="error" onChange={() => {}} variant="round">
              <EtCheckbox.Label>Error</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Disabled States
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="round" disabled>
              <EtCheckbox.Label>Disabled Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="round" disabled>
              <EtCheckbox.Label>Disabled Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="error" onChange={() => {}} variant="round" disabled>
              <EtCheckbox.Label>Disabled Error</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const AddVariantStates: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.variantSection}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Add Variant States (30x30)
        </EtText>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Active States
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="add">
              <EtCheckbox.Label>Unchecked (shows plus)</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="add">
              <EtCheckbox.Label>Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="error" onChange={() => {}} variant="add">
              <EtCheckbox.Label>Error</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Disabled States
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="add" disabled>
              <EtCheckbox.Label>Disabled Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="add" disabled>
              <EtCheckbox.Label>Disabled Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="error" onChange={() => {}} variant="add" disabled>
              <EtCheckbox.Label>Disabled Error</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const Variants: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.variantSection}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Variants Comparison
        </EtText>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Square (24x24)
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="square">
              <EtCheckbox.Label>Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="square">
              <EtCheckbox.Label>Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="indeterminate" onChange={() => {}} variant="square">
              <EtCheckbox.Label>Indeterminate</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Round (30x30)
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="round">
              <EtCheckbox.Label>Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="round">
              <EtCheckbox.Label>Checked</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Add (30x30)
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="add">
              <EtCheckbox.Label>Unchecked (shows plus)</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="add">
              <EtCheckbox.Label>Checked</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const SquareVariantStates: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.variantSection}>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Square Variant States (24x24)
        </EtText>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Active States
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="square">
              <EtCheckbox.Label>Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="square">
              <EtCheckbox.Label>Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="indeterminate" onChange={() => {}} variant="square">
              <EtCheckbox.Label>Indeterminate</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="error" onChange={() => {}} variant="square">
              <EtCheckbox.Label>Error</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-base-semibold" style={styles.demoTitle}>
            Disabled States
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={false} onChange={() => {}} variant="square" disabled>
              <EtCheckbox.Label>Disabled Unchecked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value={true} onChange={() => {}} variant="square" disabled>
              <EtCheckbox.Label>Disabled Checked</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="indeterminate" onChange={() => {}} variant="square" disabled>
              <EtCheckbox.Label>Disabled Indeterminate</EtCheckbox.Label>
            </EtCheckbox>
            <EtCheckbox value="error" onChange={() => {}} variant="square" disabled>
              <EtCheckbox.Label>Disabled Error</EtCheckbox.Label>
            </EtCheckbox>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const WithLabels: Story = {
  render: () => {
    const [value1, setValue1] = useState<CheckboxValueSquare>(true);
    const [value2, setValue2] = useState<CheckboxValueRoundOrAdd>(false);
    const [value3, setValue3] = useState<CheckboxValueSquare>('error');

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            With Labels
          </EtText>

          <View style={styles.demoCard}>
            <View style={styles.stateGroup}>
              <EtCheckbox value={value1} onChange={setValue1} variant="square">
                <EtCheckbox.Label>Subscribe to Newsletter</EtCheckbox.Label>
              </EtCheckbox>
              <EtCheckbox value={value2} onChange={setValue2} variant="round" disabled>
                <EtCheckbox.Label>Disabled Round</EtCheckbox.Label>
              </EtCheckbox>
              <EtCheckbox value={value3} onChange={setValue3} variant="square">
                <EtCheckbox.Label>Error State (tap to clear)</EtCheckbox.Label>
              </EtCheckbox>
              <EtCheckbox value={value2} onChange={setValue2} variant="add">
                <EtCheckbox.Label>Add Variant</EtCheckbox.Label>
              </EtCheckbox>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [terms, setTerms] = useState<CheckboxValueSquare>(false);
    const [newsletter, setNewsletter] = useState<CheckboxValueSquare>(true);
    const [notifications, setNotifications] = useState<CheckboxValueRoundOrAdd>(false);

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Form Integration
          </EtText>

          <View style={styles.demoCard}>
            <View style={styles.stateGroup}>
              <EtCheckbox value={terms} onChange={setTerms} variant="square">
                <EtCheckbox.Label>I agree to the terms and conditions</EtCheckbox.Label>
              </EtCheckbox>
              <EtCheckbox value={newsletter} onChange={setNewsletter} variant="square">
                <EtCheckbox.Label>Subscribe to newsletter</EtCheckbox.Label>
              </EtCheckbox>
              <EtCheckbox value={notifications} onChange={setNotifications} variant="add">
                <EtCheckbox.Label>Enable push notifications</EtCheckbox.Label>
              </EtCheckbox>
            </View>
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
  stateGroup: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
});
