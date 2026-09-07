import type { Meta, StoryObj } from '@storybook/react-native';
import { EtTimepicker } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TimeValue } from 'etoro-ui';

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
  const [basicTime, setBasicTime] = useState<TimeValue | null>(null);
  const [controlledTime, setControlledTime] = useState<TimeValue | null>(null);
  const [errorTime, setErrorTime] = useState<TimeValue | null>(null);

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.textPrimaryNeutral }]}>EtTimepicker Component</Text>

      <Text style={[styles.description, { color: colors.textPrimaryNeutral }]}>
        The EtTimepicker component is a modern, compositional time input field built with a compound component pattern. It provides flexible
        composition with subcomponents for labels and fields, supporting native platform time pickers, 12h/24h formats, and configurable minute
        intervals.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Features</Text>
      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Compound Component API: Flexible composition with subcomponents</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • Native Picker Integration: Uses platform-native time pickers (iOS/Android)
        </Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Multiple States: normal, error, disabled, readonly</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• 12h/24h Format Support: Display in AM/PM or 24-hour format</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Configurable Minute Intervals: 1, 5, 10, 15, 30 minute steps</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>• Floating Label: Animated label that floats when input has value</Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • Two Variants: inputField (form-style) and compactField (pill-style)
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Variants</Text>
      <Text style={[styles.description, { color: colors.textPrimaryNeutral }]}>
        EtTimepicker supports two display variants to fit different UI needs:
      </Text>
      <View style={styles.featureList}>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • inputField (default): Form-style input with floating label, ideal for forms and detailed data entry
        </Text>
        <Text style={[styles.feature, { color: colors.textPrimaryNeutral }]}>
          • compactField: Pill-style button, ideal for compact layouts, filters, and inline time selection
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <Text style={[styles.variantLabel, { color: colors.textPrimaryNeutral }]}>inputField (default):</Text>
        <EtTimepicker defaultValue={{ hours: 14, minutes: 30 }}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field placeholder="Select time" />
        </EtTimepicker>

        <Text style={[styles.variantLabel, { color: colors.textPrimaryNeutral }]}>compactField:</Text>
        <EtTimepicker variant="compactField" defaultValue={{ hours: 14, minutes: 30 }} />
      </View>

      <CodeBlock
        title="Variants Usage"
        code={`// inputField variant (default) - form-style with label
<EtTimepicker value={time} onChange={setTime}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field placeholder="Select time" />
</EtTimepicker>

// compactField variant - pill-style button
<EtTimepicker
  variant="compactField"
  value={time}
  onChange={setTime}
/>

// compactField with customization (composition)
<EtTimepicker variant="compactField" value={time} onChange={setTime}>
  <EtTimepicker.CompactFieldDisplay showIcon={false} />
</EtTimepicker>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Basic Usage (inputField)</Text>
      <View style={styles.exampleContainer}>
        <EtTimepicker defaultValue={basicTime}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field placeholder="Select time" />
        </EtTimepicker>
        <EtTimepicker value={controlledTime} onChange={(time) => setControlledTime(time)}>
          <EtTimepicker.Label>Controlled Time</EtTimepicker.Label>
          <EtTimepicker.Field placeholder="Select time" />
        </EtTimepicker>
      </View>

      <CodeBlock
        title="Basic Usage Code"
        code={`import { EtTimepicker } from 'etoro-ui';
import { useState } from 'react';
import type { TimeValue } from 'etoro-ui';

const MyForm = () => {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <View>
      {/* Uncontrolled mode */}
      <EtTimepicker defaultValue={null}>
        <EtTimepicker.Label>Time</EtTimepicker.Label>
        <EtTimepicker.Field placeholder="Select time" />
      </EtTimepicker>

      {/* Controlled mode */}
      <EtTimepicker value={time} onChange={setTime}>
        <EtTimepicker.Label>Time</EtTimepicker.Label>
        <EtTimepicker.Field placeholder="Select time" />
      </EtTimepicker>
    </View>
  );
};`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Error States & Validation</Text>
      <View style={styles.exampleContainer}>
        <EtTimepicker error="Please select a valid time" defaultValue={errorTime}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field />
        </EtTimepicker>
      </View>

      <CodeBlock
        title="Error States Code"
        code={`// Timepicker with error state
<EtTimepicker
  error="Please select a valid time"
  defaultValue={null}
>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>

// Note: Helper text is automatically rendered when error prop is provided`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Disabled & Readonly States</Text>
      <View style={styles.exampleContainer}>
        <EtTimepicker disabled defaultValue={{ hours: 9, minutes: 30 }}>
          <EtTimepicker.Label>Disabled Time</EtTimepicker.Label>
          <EtTimepicker.Field />
        </EtTimepicker>
        <EtTimepicker readonly defaultValue={{ hours: 9, minutes: 30 }}>
          <EtTimepicker.Label>Read-only Time</EtTimepicker.Label>
          <EtTimepicker.Field />
        </EtTimepicker>
      </View>

      <CodeBlock
        title="Disabled & Readonly Code"
        code={`// Disabled timepicker
<EtTimepicker disabled defaultValue={{ hours: 9, minutes: 30 }}>
  <EtTimepicker.Label>Time</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>

// Read-only timepicker
<EtTimepicker readonly defaultValue={{ hours: 9, minutes: 30 }}>
  <EtTimepicker.Label>Time (Read only)</EtTimepicker.Label>
  <EtTimepicker.Field />
</EtTimepicker>`}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>Component API</Text>
      <CodeBlock
        title="Component Structure"
        code={`// Main component (context provider)
<EtTimepicker
  variant?: 'inputField' | 'compactField'  // Default: 'inputField'
  defaultValue?: TimeValue | null
  value?: TimeValue | null
  onChange?: (time: TimeValue | null) => void
  format?: '12h' | '24h'                   // Default: '24h'
  minuteInterval?: number                  // Default: 1
  error?: string | null
  disabled?: boolean
  readonly?: boolean
>
  {/* For inputField variant - required subcomponents */}
  <EtTimepicker.Label required?: boolean>Label Text</EtTimepicker.Label>
  <EtTimepicker.Field placeholder?: string />
  <EtTimepicker.ClockIcon iconName?: string />  {/* Optional */}
  
  {/* For compactField variant - optional customization */}
  <EtTimepicker.CompactFieldDisplay
    showIcon?: boolean    // Default: true
    iconName?: string     // Default: 'calendar'
  />
</EtTimepicker>

// Important Notes:
// - inputField: Clock icon auto-rendered if not provided
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
        Tip: Explore the InputField and CompactField story sections to see all features for each variant!
      </Text>
    </ScrollView>
  );
};

const meta = {
  title: 'eToro-UI/Components/Timepicker/EtTimepicker/Introduction',
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
