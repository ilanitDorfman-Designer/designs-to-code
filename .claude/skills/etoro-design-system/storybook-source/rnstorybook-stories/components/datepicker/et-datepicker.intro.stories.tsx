import type { Meta, StoryObj } from '@storybook/react-native';
import { EtDatepicker } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Code Block Component for displaying copyable code
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

const IntroContent = () => {
  const { colors } = useEtoroTheme();
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [controlledDate, setControlledDate] = useState<Date | null>(null);
  const [errorDate, setErrorDate] = useState<Date | null>(null);

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>EtDatepicker Component</Text>

      <Text style={[styles.description, { color: colors.textPrimaryNeutral }]}>
        The EtDatepicker component is a modern, compositional date input field built with a compound component pattern. It provides flexible
        composition with subcomponents for labels and fields, supporting native platform date pickers, configurable formatting, and locale-aware
        display.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>✨ Features</Text>
      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Compound Component API: Flexible composition with subcomponents</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • Native Picker Integration: Uses platform-native date pickers (iOS/Android)
        </Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Multiple States: normal, error, disabled, readonly</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Date Constraints: Restrict selection with minDate and maxDate</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Custom Formatting: Configurable date formats using date-fns</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Locale Support: Internationalization via date-fns locales</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Floating Label: Animated label that floats when input has value</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • Value Type Conversion: Return Date, ISO string, or formatted string
        </Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • Two Variants: inputField (form-style) and compactField (pill-style)
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🔀 Variants</Text>
      <Text style={[styles.description, { color: colors.textPrimaryNeutral }]}>
        EtDatepicker supports two display variants to fit different UI needs:
      </Text>
      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • inputField (default): Form-style input with floating label, ideal for forms and detailed data entry
        </Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • compactField: Pill-style button, ideal for compact layouts, filters, and inline date selection
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <Text style={[styles.variantLabel, { color: colors.textPrimaryNeutral }]}>inputField (default):</Text>
        <EtDatepicker defaultValue={new Date()}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field placeholder="Select date" />
        </EtDatepicker>

        <Text style={[styles.variantLabel, { color: colors.textPrimaryNeutral }]}>compactField:</Text>
        <EtDatepicker variant="compactField" defaultValue={new Date()} />
      </View>

      <CodeBlock
        title="Variants Usage"
        code={`// inputField variant (default) - form-style with label
<EtDatepicker value={date} onChange={setDate}>
  <EtDatepicker.Label>Date</EtDatepicker.Label>
  <EtDatepicker.Field placeholder="Select date" />
</EtDatepicker>

// compactField variant - pill-style button
<EtDatepicker
  variant="compactField"
  value={date}
  onChange={setDate}
/>

// compactField with customization (composition)
<EtDatepicker variant="compactField" value={date} onChange={setDate}>
  <EtDatepicker.CompactFieldDisplay showIcon={false} />
</EtDatepicker>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🎨 Basic Usage (inputField)</Text>
      <View style={styles.exampleContainer}>
        <EtDatepicker defaultValue={basicDate}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field placeholder="Select date" />
        </EtDatepicker>
        <EtDatepicker value={controlledDate} onChange={(date) => setControlledDate(date as Date | null)}>
          <EtDatepicker.Label>Controlled Date</EtDatepicker.Label>
          <EtDatepicker.Field placeholder="Select date" />
        </EtDatepicker>
      </View>

      <CodeBlock
        title="Basic Usage Code"
        code={`import { EtDatepicker } from 'etoro-ui';
import { useState } from 'react';

const MyForm = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <View>
      {/* Uncontrolled mode */}
      <EtDatepicker defaultValue={null}>
        <EtDatepicker.Label>Date</EtDatepicker.Label>
        <EtDatepicker.Field placeholder="Select date" />
      </EtDatepicker>

      {/* Controlled mode */}
      <EtDatepicker value={date} onChange={setDate}>
        <EtDatepicker.Label>Date</EtDatepicker.Label>
        <EtDatepicker.Field placeholder="Select date" />
      </EtDatepicker>
    </View>
  );
};`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🔴 Error States & Validation</Text>
      <View style={styles.exampleContainer}>
        <EtDatepicker error="Please select a valid date" defaultValue={errorDate}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field />
        </EtDatepicker>
      </View>

      <CodeBlock
        title="Error States Code"
        code={`// Datepicker with error state
<EtDatepicker
  error="Please select a valid date"
  defaultValue={null}
>
  <EtDatepicker.Label>Date</EtDatepicker.Label>
  <EtDatepicker.Field />
</EtDatepicker>

// Dynamic error validation
const [date, setDate] = useState<Date | null>(null);
const [error, setError] = useState<string | null>(null);

const validateDate = (selectedDate: Date | null) => {
  if (!selectedDate) {
    setError('Date is required');
  } else if (selectedDate < new Date()) {
    setError('Date must be in the future');
  } else {
    setError(null);
  }
};

<EtDatepicker
  value={date}
  onChange={(d) => {
    const dateValue = d as Date | null;
    setDate(dateValue);
    validateDate(dateValue);
  }}
  error={error}
>
  <EtDatepicker.Label>Date</EtDatepicker.Label>
  <EtDatepicker.Field />
</EtDatepicker>

// Note: Helper text is automatically rendered when error prop is provided`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>📅 Date Constraints</Text>
      <View style={styles.exampleContainer}>
        <EtDatepicker defaultValue={null} minDate={new Date()} maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}>
          <EtDatepicker.Label>Date (Next Year)</EtDatepicker.Label>
          <EtDatepicker.Field placeholder="Select date" />
        </EtDatepicker>
      </View>

      <CodeBlock
        title="Date Constraints Code"
        code={`// Date with min/max constraints
const today = new Date();
const maxDate = new Date(today.getFullYear() + 1, 11, 31);

<EtDatepicker
  defaultValue={null}
  minDate={today}
  maxDate={maxDate}
>
  <EtDatepicker.Label>Date</EtDatepicker.Label>
  <EtDatepicker.Field placeholder="Select date" />
</EtDatepicker>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>🚫 Disabled & Readonly States</Text>
      <View style={styles.exampleContainer}>
        <EtDatepicker disabled defaultValue={new Date()}>
          <EtDatepicker.Label>Disabled Date</EtDatepicker.Label>
          <EtDatepicker.Field />
        </EtDatepicker>
        <EtDatepicker readonly defaultValue={new Date()}>
          <EtDatepicker.Label>Read-only Date</EtDatepicker.Label>
          <EtDatepicker.Field />
        </EtDatepicker>
      </View>

      <CodeBlock
        title="Disabled & Readonly Code"
        code={`// Disabled datepicker
<EtDatepicker disabled defaultValue={new Date()}>
  <EtDatepicker.Label>Date</EtDatepicker.Label>
  <EtDatepicker.Field />
</EtDatepicker>

// Read-only datepicker
<EtDatepicker readonly defaultValue={new Date()}>
  <EtDatepicker.Label>Date (Read only)</EtDatepicker.Label>
  <EtDatepicker.Field />
</EtDatepicker>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>📝 Component API</Text>
      <CodeBlock
        title="Component Structure"
        code={`// Main component (context provider)
<EtDatepicker
  variant?: 'inputField' | 'compactField'  // Default: 'inputField'
  defaultValue?: Date | string | null
  value?: Date | string | null
  onChange?: (date: Date | string | null) => void
  format?: string
  locale?: Locale
  valueType?: 'date' | 'iso' | 'formatted'
  minDate?: Date
  maxDate?: Date
  error?: string | null
  disabled?: boolean
  readonly?: boolean
>
  {/* For inputField variant - required subcomponents */}
  <EtDatepicker.Label required?: boolean>Label Text</EtDatepicker.Label>
  <EtDatepicker.Field placeholder?: string />
  <EtDatepicker.CalendarIcon iconName?: string />  {/* Optional */}
  
  {/* For compactField variant - optional customization */}
  <EtDatepicker.CompactFieldDisplay
    showIcon?: boolean    // Default: true
    iconName?: string     // Default: 'calendar'
  />
</EtDatepicker>

// Important Notes:
// - inputField: Calendar icon auto-rendered if not provided
// - compactField: CompactFieldDisplay auto-rendered if not provided
// - Helper text is automatically rendered when error exists
// - Component supports both controlled (value) and uncontrolled (defaultValue) modes`}
      />

      <Text
        style={[
          styles.usage,
          {
            color: colors.textPrimaryNeutral,
            backgroundColor: colors.bgNeutralPrimary,
          },
        ]}
      >
        💡 Tip: Explore the InputField and CompactField story sections to see all features for each variant!
      </Text>
    </ScrollView>
  );
};

const meta = {
  title: 'eToro-UI/Components/Datepicker/EtDatepicker/📖 Introduction',
  component: IntroContent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof IntroContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Introduction: Story = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  exampleContainer: {
    marginBottom: 16,
    gap: 16,
  },
  variantLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  usage: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
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
