import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtText, EtTextToggle } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/EtTextToggle/Introduction',
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

function IntroductionContent() {
  const { colors } = useEtoroTheme();
  const [selectedBasic, setSelectedBasic] = useState('option1');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedBuySell, setSelectedBuySell] = useState('buy');

  return (
    <ScrollView style={styles.container}>
      <EtText variant="display-main" style={styles.title}>
        EtTextToggle
      </EtText>
      <EtText variant="heading-compact" style={styles.subtitle}>
        Animated segmented control with compound pattern
      </EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Features
      </EtText>
      <EtText variant="body-secondary-regular">- Compound component pattern (EtTextToggle.Option)</EtText>
      <EtText variant="body-secondary-regular">- Smooth sliding animations</EtText>
      <EtText variant="body-secondary-regular">- Two sizes: small and large</EtText>
      <EtText variant="body-secondary-regular">- Full width or auto-sizing</EtText>
      <EtText variant="body-secondary-regular">- Haptic feedback support</EtText>
      <EtText variant="body-secondary-regular">- Individual option disabling</EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example - Basic
      </EtText>
      <View style={styles.exampleDemo}>
        <EtTextToggle selectedId={selectedBasic} onSelectionChange={setSelectedBasic} size="large" fullWidth>
          <EtTextToggle.Option id="option1" label="Option 1" />
          <EtTextToggle.Option id="option2" label="Option 2" />
          <EtTextToggle.Option id="option3" label="Option 3" />
        </EtTextToggle>
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example - Time Frame
      </EtText>
      <View style={styles.exampleDemo}>
        <EtTextToggle selectedId={selectedTimeframe} onSelectionChange={setSelectedTimeframe} size="small" fullWidth>
          <EtTextToggle.Option id="1d" label="1D" />
          <EtTextToggle.Option id="1w" label="1W" />
          <EtTextToggle.Option id="1m" label="1M" />
          <EtTextToggle.Option id="3m" label="3M" />
          <EtTextToggle.Option id="1y" label="1Y" />
        </EtTextToggle>
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example - Two Options
      </EtText>
      <View style={styles.exampleDemo}>
        <EtTextToggle selectedId={selectedBuySell} onSelectionChange={setSelectedBuySell} size="large" fullWidth>
          <EtTextToggle.Option id="buy" label="Buy" />
          <EtTextToggle.Option id="sell" label="Sell" />
        </EtTextToggle>
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Usage
      </EtText>
      <EtText variant="body-secondary-regular" style={[styles.code, { backgroundColor: colors.bgNeutralSecondary }]}>
        {`const [selectedId, setSelectedId] = useState('1d');

<EtTextToggle
  selectedId={selectedId}
  onSelectionChange={setSelectedId}
  size="small"
  fullWidth
>
  <EtTextToggle.Option id="1d" label="1D" />
  <EtTextToggle.Option id="1w" label="1W" />
  <EtTextToggle.Option id="1m" label="1M" />
</EtTextToggle>`}
      </EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Props
      </EtText>
      <EtText variant="body-secondary-regular" style={[styles.code, { backgroundColor: colors.bgNeutralSecondary }]}>
        {`// EtTextToggle props
selectedId: string;           // Currently selected option ID
onSelectionChange?: (id) => void;  // Selection callback
size?: 'small' | 'large';     // Size variant
fullWidth?: boolean;          // Take full width
disabled?: boolean;           // Disable entire toggle
haptics?: boolean;            // Enable haptic feedback
style?: ViewStyle;            // Container style
testID?: string;              // Test ID

// EtTextToggle.Option props
id: string;                   // Unique identifier
label: string;                // Display text
disabled?: boolean;           // Disable this option
style?: ViewStyle;            // Option style
textStyle?: TextStyle;        // Text style`}
      </EtText>
    </ScrollView>
  );
}

export const Introduction: Story = {
  render: () => <IntroductionContent />,
};

const styles = StyleSheet.create({
  decorator: { flex: 1, padding: 16 },
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', opacity: 0.8, marginBottom: 24 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  exampleDemo: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  code: { fontFamily: 'Courier', fontSize: 11, padding: 12, borderRadius: 8 },
});
