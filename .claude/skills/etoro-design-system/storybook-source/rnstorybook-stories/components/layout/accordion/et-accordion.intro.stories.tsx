import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAccordion, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X1, X10, X2, X3, X4, X6, X8 } from 'etoro-ui/core/styles/spacing';
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
    } catch {
      Alert.alert('Copy Failed', 'Unable to copy code to clipboard');
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

CodeBlock.displayName = 'CodeBlock';

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Layout/EtAccordion/Introduction',
  parameters: {
    notes: 'Complete guide for the EtAccordion component with live examples.',
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
    const [expandedIds, setExpandedIds] = useState<string[]>(['1']);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtAccordion
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Collapsible accordion for FAQ sections and expandable content
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            - Smooth animated expand/collapse with height transitions
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            - Animated chevron rotation indicator
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            - Single or multiple items can be expanded
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            - Controlled and uncontrolled modes supported
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            - Compound component pattern for flexible composition
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            - Full accessibility support
          </EtText>
        </View>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Basic Usage
        </EtText>
        <EtAccordion defaultExpandedIds={['basic1']}>
          <EtAccordion.Item id="basic1">
            <EtAccordion.Header>
              <EtText variant="body-base-semibold">What is eToro?</EtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <EtText variant="body-base-regular">eToro is a social trading and multi-asset investment platform.</EtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="basic2">
            <EtAccordion.Header>
              <EtText variant="body-base-semibold">How do I get started?</EtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <EtText variant="body-base-regular">Download the app and create an account to get started.</EtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>
        <CodeBlock
          title="Basic Accordion"
          code={`<EtAccordion defaultExpandedIds={['1']}>
  <EtAccordion.Item id="1">
    <EtAccordion.Header>
      <EtText variant="body-base-semibold">
        Question text here
      </EtText>
    </EtAccordion.Header>
    <EtAccordion.Content>
      <EtText variant="body-base-regular">
        Answer text here
      </EtText>
    </EtAccordion.Content>
  </EtAccordion.Item>
</EtAccordion>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Multiple Items Expanded
        </EtText>
        <EtAccordion allowMultiple defaultExpandedIds={['multi1', 'multi2']}>
          <EtAccordion.Item id="multi1">
            <EtAccordion.Header>
              <EtText variant="body-base-semibold">First Question</EtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <EtText variant="body-base-regular">Both this and the next item can be open simultaneously.</EtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
          <EtAccordion.Item id="multi2">
            <EtAccordion.Header>
              <EtText variant="body-base-semibold">Second Question</EtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <EtText variant="body-base-regular">With allowMultiple, users can expand multiple items at once.</EtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        </EtAccordion>
        <CodeBlock
          title="Multiple Expanded"
          code={`<EtAccordion 
  allowMultiple 
  defaultExpandedIds={['1', '2']}
>
  <EtAccordion.Item id="1">...</EtAccordion.Item>
  <EtAccordion.Item id="2">...</EtAccordion.Item>
</EtAccordion>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Controlled Mode
        </EtText>
        <View style={styles.controlledSection}>
          <EtText variant="body-secondary-regular" style={styles.statusText}>
            Currently expanded: {expandedIds.join(', ') || 'None'}
          </EtText>
          <EtAccordion expandedIds={expandedIds} onExpandedChange={setExpandedIds}>
            <EtAccordion.Item id="1">
              <EtAccordion.Header>
                <EtText variant="body-base-semibold">Controlled Item 1</EtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <EtText variant="body-base-regular">State is managed externally with useState.</EtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
            <EtAccordion.Item id="2">
              <EtAccordion.Header>
                <EtText variant="body-base-semibold">Controlled Item 2</EtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <EtText variant="body-base-regular">Useful for integrating with form state or analytics.</EtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          </EtAccordion>
        </View>
        <CodeBlock
          title="Controlled Accordion"
          code={`const [expandedIds, setExpandedIds] = useState(['1']);

<EtAccordion
  expandedIds={expandedIds}
  onExpandedChange={setExpandedIds}
>
  <EtAccordion.Item id="1">
    <EtAccordion.Header>...</EtAccordion.Header>
    <EtAccordion.Content>...</EtAccordion.Content>
  </EtAccordion.Item>
</EtAccordion>`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="EtAccordionProps"
            code={`interface EtAccordionProps {
  children: ReactNode;          // Accordion items
  allowMultiple?: boolean;      // Allow multiple expanded (default: false)
  defaultExpandedIds?: string[];// Default expanded items (uncontrolled)
  expandedIds?: string[];       // Controlled expanded state
  onExpandedChange?: (ids: string[]) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface EtAccordionItemProps {
  id: string;                   // Unique identifier (required)
  children: ReactNode;          // Header and Content components
  disabled?: boolean;           // Disable expand/collapse
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface EtAccordionHeaderProps {
  children: EtTextChildren;     // EtText components only! (throws if other)
  showChevron?: boolean;        // Show chevron icon (default: true)
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface EtAccordionContentProps {
  children: EtTextChildren;     // EtText components only! (throws if other)
  style?: StyleProp<ViewStyle>;
  testID?: string;
}`}
          />
        </View>

        <View style={styles.usageNotes}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Usage Notes
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - Each EtAccordion.Item must have a unique id prop
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - Header and Content children must be EtText components only (throws error otherwise)
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - Use body-base-semibold for question text and body-base-regular for answers
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - The chevron rotates 180 degrees when expanded
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - Animations are 300ms with smooth easing
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - Content has paddingBottom X6 (24px) and paddingRight X4 (16px)
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            - A divider (dividerSenary) is automatically added after each item
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
    padding: X4,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: X6,
    paddingBottom: X4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    textAlign: 'center',
    marginBottom: X2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  features: {
    marginBottom: X8,
  },
  featuresTitle: {
    marginBottom: X3,
  },
  featureText: {
    marginBottom: X1,
    opacity: 0.8,
  },
  sectionTitle: {
    marginTop: X6,
    marginBottom: X3,
  },
  controlledSection: {
    marginBottom: X2,
  },
  statusText: {
    marginBottom: X3,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  apiReference: {
    marginTop: X6,
    paddingTop: X6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  apiTitle: {
    marginBottom: X4,
  },
  usageNotes: {
    marginTop: X6,
    paddingTop: X6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: X10,
  },
  noteText: {
    marginBottom: X2,
    opacity: 0.8,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: X3,
    borderRadius: X2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: X3,
    paddingVertical: X2,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: X2,
    paddingVertical: X1,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: X3,
  },
});
