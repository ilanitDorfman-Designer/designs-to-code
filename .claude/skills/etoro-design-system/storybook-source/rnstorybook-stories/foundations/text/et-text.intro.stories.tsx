import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  title: 'eToro-UI/Foundations/Typography/EtText/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtText component with live examples.',
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
  render: () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <EtText variant="display-main" style={styles.title}>
          📝 EtText
        </EtText>
        <EtText variant="heading-compact" style={styles.subtitle}>
          Typography component with variant-based API for consistent typography
        </EtText>
      </View>

      <View style={styles.features}>
        <EtText variant="heading-base" style={styles.featuresTitle}>
          Features
        </EtText>
        <EtText variant="body-base-regular" style={styles.featureText}>
          • Variant-based API (24+ variants)
        </EtText>
        <EtText variant="body-base-regular" style={styles.featureText}>
          • Includes line height and letter spacing
        </EtText>
        <EtText variant="body-base-regular" style={styles.featureText}>
          • Theme-aware colors
        </EtText>
        <EtText variant="body-base-regular" style={styles.featureText}>
          • Text truncation and line limits
        </EtText>
        <EtText variant="body-base-regular" style={styles.featureText}>
          • Full accessibility support
        </EtText>
      </View>

      <ExampleSection
        title="Variant Examples"
        code={`<EtText variant="display-hero">Display Hero</EtText>
<EtText variant="display-main">Display Main</EtText>
<EtText variant="heading-large">Heading Large</EtText>
<EtText variant="heading-base">Heading Base</EtText>
<EtText variant="body-base-regular">Body Base Regular</EtText>
<EtText variant="body-secondary-medium">Body Secondary Medium</EtText>
<EtText variant="body-tiny-regular">Body Tiny Regular</EtText>
<EtText variant="label-primary-bold">Label Primary Bold</EtText>`}
      >
        <View style={styles.sizeDemo}>
          <EtText variant="display-hero">Display Hero</EtText>
          <EtText variant="display-main">Display Main</EtText>
          <EtText variant="heading-large">Heading Large</EtText>
          <EtText variant="heading-base">Heading Base</EtText>
          <EtText variant="body-base-regular">Body Base Regular</EtText>
          <EtText variant="body-secondary-medium">Body Secondary Medium</EtText>
          <EtText variant="body-tiny-regular">Body Tiny Regular</EtText>
          <EtText variant="label-primary-bold">Label Primary Bold</EtText>
        </View>
      </ExampleSection>

      <ExampleSection
        title="Style Override"
        code={`<EtText variant="body-base-regular">Default</EtText>
<EtText variant="body-base-regular" style={{ color: '#FF0000' }}>
  Color Override
</EtText>
<EtText variant="body-base-regular" style={{ fontSize: 20 }}>
  Size Override
</EtText>`}
      >
        <View style={styles.weightDemo}>
          <EtText variant="body-base-regular">Default</EtText>
          <EtText variant="body-base-regular" style={{ color: '#FF0000' }}>
            Color Override
          </EtText>
          <EtText variant="body-base-regular" style={{ fontSize: 20 }}>
            Size Override
          </EtText>
        </View>
      </ExampleSection>

      <ExampleSection
        title="Text Alignment"
        code={`<EtText variant="body-base-regular" style={{ textAlign: 'left' }}>
  Left Aligned
</EtText>
<EtText variant="body-base-regular" style={{ textAlign: 'center' }}>
  Center Aligned
</EtText>
<EtText variant="body-base-regular" style={{ textAlign: 'right' }}>
  Right Aligned
</EtText>`}
      >
        <View style={styles.alignDemo}>
          <EtText variant="body-base-regular" style={{ textAlign: 'left' }}>
            Left Aligned
          </EtText>
          <EtText variant="body-base-regular" style={{ textAlign: 'center' }}>
            Center Aligned
          </EtText>
          <EtText variant="body-base-regular" style={{ textAlign: 'right' }}>
            Right Aligned
          </EtText>
        </View>
      </ExampleSection>

      <ExampleSection
        title="Line Limiting"
        code={`<EtText variant="body-base-regular" numberOfLines={2} ellipsizeMode="tail">
  This is a very long text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</EtText>`}
      >
        <EtText variant="body-base-regular" numberOfLines={2} ellipsizeMode="tail" style={styles.truncateDemo}>
          This is a very long text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </EtText>
      </ExampleSection>

      <ExampleSection
        title="Real-World Examples"
        code={`// Page headings
<EtText variant="display-main">Portfolio Overview</EtText>

// Card titles  
<EtText variant="heading-compact">Apple Inc</EtText>

// Body text
<EtText variant="body-base-regular">Your current portfolio value has increased by 5.2% today.</EtText>

// Captions and labels
<EtText variant="body-secondary-medium">Last updated: 2 minutes ago</EtText>

// Small details
<EtText variant="body-tiny-regular">Terms and conditions apply</EtText>`}
      >
        <View style={styles.realWorldDemo}>
          <EtText variant="display-main" style={styles.demoHeading}>
            Portfolio Overview
          </EtText>
          <EtText variant="heading-compact" style={styles.demoTitle}>
            Apple Inc
          </EtText>
          <EtText variant="body-base-regular" style={styles.demoBody}>
            Your current portfolio value has increased by 5.2% today.
          </EtText>
          <EtText variant="body-secondary-medium" style={styles.demoCaption}>
            Last updated: 2 minutes ago
          </EtText>
          <EtText variant="body-tiny-regular" style={styles.demoSmall}>
            Terms and conditions apply
          </EtText>
        </View>
      </ExampleSection>

      <View style={styles.apiReference}>
        <EtText variant="heading-base" style={styles.apiTitle}>
          Quick API Reference
        </EtText>
        <CodeBlock
          code={`
interface EtTextProps extends ComponentProps<typeof Text> {
  variant: TextVariant;              // Required variant prop
  entering?: ComplexAnimationBuilder; // Reanimated entering animation
  exiting?: ComplexAnimationBuilder;  // Reanimated exiting animation
  style?: StyleProp<TextStyle>;      // Style override
  // ... all React Native Text props
}

// Available variants:
// Display: 'display-hero', 'display-main', 'display-compact'
// Heading: 'heading-large', 'heading-base', 'heading-compact'
// Body: 'body-base-regular', 'body-base-medium', 'body-base-semibold',
//       'body-secondary-regular', 'body-secondary-medium', 'body-secondary-semibold',
//       'body-tiny-regular', 'body-tiny-medium'
// Label: 'label-primary-regular', 'label-primary-semibold', 'label-primary-bold',
//        'label-secondary-regular', 'label-secondary-semibold', 'label-secondary-bold',
//        'label-tertiary-regular', 'label-tertiary-semibold', 'label-tertiary-bold'
// Caption: 'caption-regular', 'caption-medium'`}
          title="EtTextProps"
        />
      </View>
    </ScrollView>
  ),
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
    borderWidth: 1,
    marginBottom: 12,
  },
  codeBlock: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  codeText: {
    fontFamily: 'Courier',
    lineHeight: 18,
  },
  sizeDemo: {
    gap: 8,
    alignItems: 'center',
  },
  weightDemo: {
    gap: 8,
    alignItems: 'center',
  },
  alignDemo: {
    gap: 8,
  },
  truncateDemo: {
    width: '100%',
  },
  realWorldDemo: {
    gap: 12,
    alignItems: 'flex-start',
  },
  demoHeading: {
    marginBottom: 4,
  },
  demoTitle: {
    marginBottom: 4,
  },
  demoBody: {
    marginBottom: 4,
  },
  demoCaption: {
    marginBottom: 4,
    opacity: 0.7,
  },
  demoSmall: {
    opacity: 0.5,
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
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
});
