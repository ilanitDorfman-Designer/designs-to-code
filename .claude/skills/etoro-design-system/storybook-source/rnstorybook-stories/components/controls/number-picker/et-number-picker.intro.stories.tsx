import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtNumberPicker, EtText } from 'etoro-ui';
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

const ExampleSection: React.FC<{
  title: string;
  code: string;
  children: React.ReactNode;
}> = ({ title, code, children }) => (
  <View style={styles.exampleSection}>
    <EtText variant="heading-compact" style={styles.exampleTitle}>
      {title}
    </EtText>
    <View style={styles.exampleDemo}>{children}</View>
    <CodeBlock code={code} title={title} />
  </View>
);

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/EtNumberPicker/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtNumberPicker component with live examples.',
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
    const [basicValue, setBasicValue] = useState(8);
    const [portfolioValue, setPortfolioValue] = useState(2500);
    const [quantity, setQuantity] = useState(10);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            🔢 EtNumberPicker
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Animated counter with smooth digit transitions inspired by motion.dev
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Smooth vertical digit animations
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Staggered timing for natural feel
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Dynamic container expansion
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Haptic feedback on changes
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Customizable styling
          </EtText>
        </View>

        <ExampleSection
          title="Basic Usage"
          code={`const [value, setValue] = useState(150);

<EtNumberPicker 
  value={value} 
  onValueChange={setValue}
/>`}
        >
          <View style={styles.pickerContainer}>
            <EtNumberPicker
              state={{
                value: basicValue,
                onValueChange: setBasicValue,
              }}
            />
          </View>
        </ExampleSection>

        <ExampleSection
          title="Large Numbers"
          code={`const [portfolioValue, setPortfolioValue] = useState(2500);

<EtNumberPicker 
  state={{
    value: portfolioValue,
    onValueChange: setPortfolioValue,
    min: 0,
    max: 10000,
    step: 100,
  }}
/>`}
        >
          <View style={styles.pickerContainer}>
            <EtNumberPicker
              state={{
                value: portfolioValue,
                onValueChange: setPortfolioValue,
                min: 0,
                max: 10000,
                step: 100,
              }}
            />
          </View>
        </ExampleSection>

        <ExampleSection
          title="Custom Styling"
          code={`<EtNumberPicker 
  state={{
    value: quantity,
    onValueChange: setQuantity,
  }}
  appearance={{
    size: "large",
    buttonColor: "#3B82F6",
    textColor: "#1F2937",
    backgroundColor: "#F3F4F6",
  }}
/>`}
        >
          <View style={styles.pickerContainer}>
            <EtNumberPicker
              state={{
                value: quantity,
                onValueChange: setQuantity,
              }}
              appearance={{
                size: 'large',
                buttonColor: '#3B82F6',
              }}
            />
          </View>
        </ExampleSection>

        <ExampleSection
          title="Trading Interface Example"
          code={`const TradingCard = () => {
  const [price, setPrice] = useState(1250);
  const [quantity, setQuantity] = useState(5);
  
  return (
    <View style={styles.tradingCard}>
      <View style={styles.tradingRow}>
        <EtText>Price:</EtText>
        <EtNumberPicker 
          value={price} 
          onValueChange={setPrice}
          min={100}
          max={5000}
          step={10}
        />
      </View>
      
      <View style={styles.tradingRow}>
        <EtText>Quantity:</EtText>
        <EtNumberPicker 
          value={quantity} 
          onValueChange={setQuantity}
          min={1}
          max={100}
        />
      </View>
      
      <EtText>Total: \${price * quantity}</EtText>
    </View>
  );
};`}
        >
          <View style={styles.tradingCard}>
            <View style={styles.tradingRow}>
              <EtText variant="body-base-medium">Price:</EtText>
              <EtNumberPicker
                state={{
                  value: portfolioValue,
                  onValueChange: setPortfolioValue,
                  min: 100,
                  max: 5000,
                  step: 10,
                }}
              />
            </View>
            <View style={styles.tradingRow}>
              <EtText variant="body-base-medium">Quantity:</EtText>
              <EtNumberPicker
                state={{
                  value: quantity,
                  onValueChange: setQuantity,
                  min: 1,
                  max: 100,
                }}
              />
            </View>
            <View style={styles.tradingRow}>
              <EtText variant="heading-compact">Total: ${portfolioValue * quantity}</EtText>
            </View>
          </View>
        </ExampleSection>

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            code={`
interface EtNumberPickerProps {
  value: number;                    // Current number value (required)
  onValueChange: (value: number) => void;  // Change handler (required)
  min?: number;                     // Minimum value (default: 0)
  max?: number;                     // Maximum value (default: 100)
  step?: number;                    // Step increment (default: 1)
  size?: 'small' | 'medium' | 'large';     // Size variant
  disabled?: boolean;               // Non-interactive state
  buttonColor?: string;             // Custom button color
  textColor?: string;               // Custom text color
  backgroundColor?: string;         // Custom background color
  testID?: string;                  // Test identifier
}`}
            title="EtNumberPickerProps"
          />
        </View>

        <View style={styles.note}>
          <EtText variant="body-secondary-regular" style={styles.noteText}>
            💡 The animations automatically handle digit count changes (9→10, 99→100) with smooth container expansion and staggered digit timing for a
            natural feel.
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
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  features: {
    marginBottom: 32,
  },
  featuresTitle: {
    marginBottom: 12,
  },
  featureText: {
    marginBottom: 4,
    opacity: 0.8,
  },
  exampleSection: {
    marginBottom: 32,
  },
  exampleTitle: {
    marginBottom: 16,
  },
  exampleDemo: {
    padding: 16,
    borderRadius: 8,

    marginBottom: 12,
    alignItems: 'center',
  },

  pickerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    minWidth: 40,
    alignItems: 'center',
  },
  controlButtonText: {
    fontWeight: '600',
  },
  tradingCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    minWidth: 200,
  },
  tradingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  note: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
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
