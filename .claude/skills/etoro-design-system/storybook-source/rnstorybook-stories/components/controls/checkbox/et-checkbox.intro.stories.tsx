import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtCheckbox, EtText } from 'etoro-ui';
import { CheckboxValueRoundOrAdd, CheckboxValueSquare } from 'etoro-ui/components/controls/checkbox';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (code: string) => {
    Clipboard.setStringAsync(code);
    Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
  };

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={styles.codeHeader}>
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <Text style={[styles.copyButtonText, { color: colors.actionBrandText }]}>Copy</Text>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/EtCheckbox/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtCheckbox component with live examples.',
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

export const Introduction: Story = {
  render: () => {
    const [basicValue, setBasicValue] = useState<CheckboxValueSquare>(false);
    const [terms, setTerms] = useState<CheckboxValueSquare>(false);
    const [newsletter, setNewsletter] = useState<CheckboxValueSquare>(true);
    const [notifications, setNotifications] = useState<CheckboxValueRoundOrAdd>(false);
    const [errorDemo, setErrorDemo] = useState<CheckboxValueSquare>('error');

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtCheckbox
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Controlled checkbox with variants: square, round, and add
          </EtText>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Features
          </EtText>
          <View style={styles.features}>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Three variants: square (24x24), round (30x30), and add (30x30)
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Square variant supports indeterminate state
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Value: true (checked), false (unchecked), "error", or "indeterminate" (square only)
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Smooth animated transitions
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Haptic feedback on interaction
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Add variant shows plus icon when unchecked
            </EtText>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Basic Usage
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={basicValue} onChange={setBasicValue} variant="square">
              <EtCheckbox.Label>Basic Checkbox (Square)</EtCheckbox.Label>
            </EtCheckbox>
          </View>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Value: {String(basicValue)}
          </EtText>
          <CodeBlock
            title="Basic Usage"
            code={`const [value, setValue] = useState<CheckboxValueSquare>(false);

<EtCheckbox value={value} onChange={setValue} variant="square">
  <EtCheckbox.Label>Basic Checkbox</EtCheckbox.Label>
</EtCheckbox>`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Error State
          </EtText>
          <View style={styles.stateGroup}>
            <EtCheckbox value={errorDemo} onChange={setErrorDemo} variant="square">
              <EtCheckbox.Label>{errorDemo === 'error' ? 'Tap to fix error' : 'Checkbox'}</EtCheckbox.Label>
            </EtCheckbox>
          </View>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Value: {String(errorDemo)} (tap checkbox to clear error)
          </EtText>
          <CodeBlock
            title="Error State"
            code={`// Error state shows red border and unchecked appearance
// When user taps, onChange emits true (toggled from error/false)

const [value, setValue] = useState<CheckboxValueSquare>('error');

<EtCheckbox value={value} onChange={setValue} variant="square">
  <EtCheckbox.Label>Required field</EtCheckbox.Label>
</EtCheckbox>`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Form Integration
          </EtText>
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
          <CodeBlock
            title="Form Integration"
            code={`const [terms, setTerms] = useState<CheckboxValueSquare>(false);
const [newsletter, setNewsletter] = useState<CheckboxValueSquare>(true);
const [notifications, setNotifications] = useState<CheckboxValueRoundOrAdd>(false);

<EtCheckbox value={terms} onChange={setTerms} variant="square">
  <EtCheckbox.Label>I agree to the terms</EtCheckbox.Label>
</EtCheckbox>

<EtCheckbox value={newsletter} onChange={setNewsletter} variant="square">
  <EtCheckbox.Label>Subscribe to newsletter</EtCheckbox.Label>
</EtCheckbox>

<EtCheckbox value={notifications} onChange={setNotifications} variant="add">
  <EtCheckbox.Label>Enable notifications</EtCheckbox.Label>
</EtCheckbox>`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtCheckboxProps"
            code={`type CheckboxValueSquare = boolean | 'error' | 'indeterminate';
type CheckboxValueRoundOrAdd = boolean | 'error';

// Square variant (default, supports indeterminate)
interface EtCheckboxSquareProps {
  variant?: 'square';
  value: CheckboxValueSquare;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  haptics?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: EtCheckboxChildren;
  testID?: string;
  accessibilityLabel?: string;
}

// Round variant (no indeterminate)
interface EtCheckboxRoundProps {
  variant: 'round';
  value: CheckboxValueRoundOrAdd;
  // ... same optional props
}

// Add variant (no indeterminate, shows plus when unchecked)
interface EtCheckboxAddProps {
  variant: 'add';
  value: CheckboxValueRoundOrAdd;
  // ... same optional props
}

type EtCheckboxProps = EtCheckboxSquareProps | EtCheckboxRoundProps | EtCheckboxAddProps;`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-secondary-regular" style={styles.noteText}>
            The checkbox uses a controlled value prop. On press, it emits the toggled boolean: true becomes false, false/error/indeterminate becomes
            true. The parent component manages all state. Square variant supports indeterminate state, while round and add variants do not.
          </EtText>
        </View>
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
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
    marginBottom: 8,
  },
  features: {
    gap: 8,
  },
  featureText: {
    opacity: 0.8,
  },
  stateGroup: {
    gap: 12,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
  noteText: {
    opacity: 0.8,
    lineHeight: 20,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
});
