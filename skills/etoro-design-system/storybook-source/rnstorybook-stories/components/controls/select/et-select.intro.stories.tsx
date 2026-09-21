import type { Meta, StoryObj } from '@storybook/react-native';
import { EtCountryFlag, EtSelect, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = async (code: string) => {
    try {
      await Clipboard.setStringAsync(code);
      Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Copy Failed', 'Failed to copy code to clipboard', [{ text: 'OK' }]);
    }
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
  title: 'eToro-UI/Components/Controls/EtSelect/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtSelect component with live examples.',
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
    const [selectedValue, setSelectedValue] = useState<string>('Select');

    const handlePress = () => {
      Alert.alert('Select Pressed', 'This would open a selection modal', [
        {
          text: 'Option 1',
          onPress: () => setSelectedValue('Option 1'),
        },
        {
          text: 'Option 2',
          onPress: () => setSelectedValue('Option 2'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtSelect
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Composable select trigger with type-based layout
          </EtText>
        </View>

        {/* Text Type */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            type=&quot;text&quot; (inline + semibold text)
          </EtText>
          <EtSelect type="text" onPress={handlePress}>
            <EtSelect.Value>Select</EtSelect.Value>
          </EtSelect>
        </View>
        <CodeBlock
          title="Text Type"
          code={`<EtSelect type="text" onPress={handlePress}>
  <EtSelect.Value>Select</EtSelect.Value>
</EtSelect>`}
        />

        {/* Field Type */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            type=&quot;field&quot; (bordered empty container)
          </EtText>
          <EtSelect type="field" onPress={handlePress}>
            <EtSelect.Value>Select</EtSelect.Value>
          </EtSelect>
        </View>
        <CodeBlock
          title="Field Type"
          code={`<EtSelect type="field" onPress={handlePress}>
  <EtSelect.Value>Select</EtSelect.Value>
</EtSelect>`}
        />

        {/* Field with Value (auto-filled appearance) */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Field with Value (auto-filled appearance)
          </EtText>
          <EtSelect type="field" onPress={handlePress}>
            <EtSelect.Label>Country of residence</EtSelect.Label>
            <EtSelect.Value>eToro</EtSelect.Value>
          </EtSelect>
        </View>
        <CodeBlock
          title="Field with Value"
          code={`<EtSelect type="field" onPress={handlePress}>
  <EtSelect.Label>Country of residence</EtSelect.Label>
  <EtSelect.Value>eToro</EtSelect.Value>
</EtSelect>`}
        />

        {/* Field with Leading Content (country flag) */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Field with Leading Content (country flag)
          </EtText>
          <EtSelect type="field" onPress={handlePress}>
            <EtSelect.Label>Country of residence</EtSelect.Label>
            <EtSelect.LeadingContent>
              <EtCountryFlag isoCode="GB" size={20} />
            </EtSelect.LeadingContent>
            <EtSelect.Value>United Kingdom</EtSelect.Value>
          </EtSelect>
        </View>
        <CodeBlock
          title="Field with Leading Content"
          code={`<EtSelect type="field" onPress={handlePress}>
  <EtSelect.Label>Country of residence</EtSelect.Label>
  <EtSelect.LeadingContent>
    <EtCountryFlag isoCode="GB" size={20} />
  </EtSelect.LeadingContent>
  <EtSelect.Value>United Kingdom</EtSelect.Value>
</EtSelect>`}
        />

        {/* Interactive Example */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Interactive Example
          </EtText>
          <EtSelect type="text" onPress={handlePress}>
            <EtSelect.Value>{selectedValue}</EtSelect.Value>
          </EtSelect>
          <EtText variant="body-secondary-regular" style={styles.selectedText}>
            Selected: {selectedValue}
          </EtText>
        </View>

        {/* Disabled States */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Disabled States
          </EtText>
          <View style={styles.row}>
            <EtSelect type="field" onPress={handlePress} disabled>
              <EtSelect.Value>Select</EtSelect.Value>
            </EtSelect>
          </View>
          <View style={styles.row}>
            <EtSelect type="field" onPress={handlePress} disabled>
              <EtSelect.Label>Country</EtSelect.Label>
              <EtSelect.Value>eToro</EtSelect.Value>
            </EtSelect>
          </View>
        </View>

        {/* API Reference */}
        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtSelectProps"
            code={`interface EtSelectProps {
  children: ReactNode;                   // Compound children
  onPress: () => void;                   // Press callback
  type?: 'text' | 'field';              // Visual type (default: 'field')
  disabled?: boolean;                    // Disabled state (field only)
  haptics?: boolean;                     // Haptic feedback (default: true)
  width?: DimensionValue;               // Width for field (default: 335)
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Compound subcomponents:
// EtSelect.Label          - Label text (triggers filled appearance)
// EtSelect.Value          - Value text
// EtSelect.LeadingContent - Content before value, field type only (e.g. country flag)`}
          />
        </View>
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  selectedText: {
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
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
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
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
