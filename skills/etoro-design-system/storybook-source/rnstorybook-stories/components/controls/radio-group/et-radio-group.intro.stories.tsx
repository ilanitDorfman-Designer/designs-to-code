import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtRadioGroup, EtText } from 'etoro-ui';
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
  title: 'eToro-UI/Components/Controls/EtRadioGroup/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtRadioGroup component with live examples.',
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
    const [basicValue, setBasicValue] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>('credit');
    const [errorValue, setErrorValue] = useState<string | null>(null);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtRadioGroup
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Controlled radio group for single selection
          </EtText>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Features
          </EtText>
          <View style={styles.features}>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Compound component pattern with EtRadioGroup.Option
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Cannot unselect - only select a different option
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • direction prop for vertical/horizontal layout
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Group-level disabled and error states
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Smooth animated transitions
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Haptic feedback on selection
            </EtText>
          </View>
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Basic Usage
          </EtText>
          <EtRadioGroup value={basicValue} onChange={setBasicValue}>
            <EtRadioGroup.Option value="option1">Option 1</EtRadioGroup.Option>
            <EtRadioGroup.Option value="option2">Option 2</EtRadioGroup.Option>
            <EtRadioGroup.Option value="option3">Option 3</EtRadioGroup.Option>
          </EtRadioGroup>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Selected: {basicValue ?? 'none'}
          </EtText>
          <CodeBlock
            title="Basic Usage"
            code={`const [selected, setSelected] = useState<string | null>(null);

<EtRadioGroup value={selected} onChange={setSelected}>
  <EtRadioGroup.Option value="option1">Option 1</EtRadioGroup.Option>
  <EtRadioGroup.Option value="option2">Option 2</EtRadioGroup.Option>
  <EtRadioGroup.Option value="option3">Option 3</EtRadioGroup.Option>
</EtRadioGroup>`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Horizontal Layout
          </EtText>
          <EtRadioGroup value={paymentMethod} onChange={setPaymentMethod} direction="horizontal">
            <EtRadioGroup.Option value="credit">Credit</EtRadioGroup.Option>
            <EtRadioGroup.Option value="debit">Debit</EtRadioGroup.Option>
            <EtRadioGroup.Option value="paypal">PayPal</EtRadioGroup.Option>
          </EtRadioGroup>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Selected: {paymentMethod}
          </EtText>
          <CodeBlock
            title="Horizontal Layout"
            code={`<EtRadioGroup value={selected} onChange={setSelected} direction="horizontal">
  <EtRadioGroup.Option value="credit">Credit</EtRadioGroup.Option>
  <EtRadioGroup.Option value="debit">Debit</EtRadioGroup.Option>
</EtRadioGroup>`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Error State
          </EtText>
          <EtRadioGroup value={errorValue} onChange={setErrorValue} error>
            <EtRadioGroup.Option value="required1">Required option 1</EtRadioGroup.Option>
            <EtRadioGroup.Option value="required2">Required option 2</EtRadioGroup.Option>
          </EtRadioGroup>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Selected: {errorValue ?? 'none'} (select to clear error)
          </EtText>
          <CodeBlock
            title="Error State"
            code={`// Error state shows red border on unselected options
<EtRadioGroup value={selected} onChange={setSelected} error>
  <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
</EtRadioGroup>`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="heading-base" style={styles.demoTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtRadioGroupProps"
            code={`interface EtRadioGroupProps {
  value: string | null;
  onChange: (value: string) => void;
  children: ReactNode;
  direction?: 'vertical' | 'horizontal';  // Default: 'vertical'
  disabled?: boolean;  // Group-level disabled
  error?: boolean;     // Group-level error
  haptics?: boolean;   // Default: true
  testID?: string;
  accessibilityLabel?: string;
}

interface RadioOptionProps {
  value: string;       // Unique value for this option
  children: string;    // Label text
  disabled?: boolean;  // Option-level disabled
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}`}
          />
        </View>

        <View style={styles.demoCard}>
          <EtText variant="body-secondary-regular" style={styles.noteText}>
            Radio buttons cannot be unselected - clicking a selected option does nothing. Use the direction prop to control layout (vertical is
            default, horizontal for inline options).
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
