import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAccordion, EtText } from 'etoro-ui';
import { X2, X3, X4, X5, X6 } from 'etoro-ui/core/styles/spacing';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// FAQ data for stories
const faqItems = [
  {
    id: '1',
    question: 'What is eToro?',
    answer: 'eToro is a social trading and multi-asset investment platform that allows users to trade stocks, cryptocurrencies, and more.',
  },
  {
    id: '2',
    question: 'How do I open an account?',
    answer:
      'You can open an account by downloading the app, providing your email, and completing the verification process. It only takes a few minutes.',
  },
  {
    id: '3',
    question: 'What are the minimum deposit requirements?',
    answer: 'The minimum deposit varies by region and payment method. Please check the deposit section in the app for specific requirements.',
  },
  {
    id: '4',
    question: 'Is my money safe?',
    answer: 'Yes, eToro is regulated by multiple financial authorities worldwide. Client funds are held in segregated accounts.',
  },
  {
    id: '5',
    question: 'How do I withdraw funds?',
    answer: 'You can withdraw funds by going to the Withdraw section in the app. Withdrawals are processed within 1-3 business days.',
  },
];

// Wrapper component for interactive stories
const AccordionWrapper = (props: { allowMultiple?: boolean; defaultExpandedIds?: string[] }) => {
  return (
    <EtAccordion allowMultiple={props.allowMultiple} defaultExpandedIds={props.defaultExpandedIds}>
      {faqItems.map((item) => (
        <EtAccordion.Item key={item.id} id={item.id}>
          <EtAccordion.Header>
            <EtText variant="body-base-semibold">{item.question}</EtText>
          </EtAccordion.Header>
          <EtAccordion.Content>
            <EtText variant="body-base-regular">{item.answer}</EtText>
          </EtAccordion.Content>
        </EtAccordion.Item>
      ))}
    </EtAccordion>
  );
};
AccordionWrapper.displayName = 'AccordionWrapper';

const meta = {
  title: 'eToro-UI/Components/Layout/EtAccordion',
  component: AccordionWrapper,
  argTypes: {
    allowMultiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple items to be expanded simultaneously',
    },
    defaultExpandedIds: {
      control: { type: 'object' },
      description: 'IDs of items to expand by default',
    },
  },
  args: {
    allowMultiple: false,
    defaultExpandedIds: [],
  },
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AccordionWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive story with full controls
export const Interactive: Story = {
  render: (args) => <AccordionWrapper {...args} />,
};

// Basic accordion - single item expanded at a time
export const Basic: Story = {
  args: {
    allowMultiple: false,
    defaultExpandedIds: ['1'],
  },
  render: (args) => <AccordionWrapper {...args} />,
};

// Multiple items can be expanded
export const MultipleExpanded: Story = {
  args: {
    allowMultiple: true,
    defaultExpandedIds: ['1', '3'],
  },
  render: (args) => <AccordionWrapper {...args} />,
};

// Controlled accordion example
export const Controlled: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<string[]>(['1']);

    return (
      <View>
        <EtText variant="body-secondary-regular" style={styles.statusText}>
          Expanded: {expandedIds.join(', ') || 'None'}
        </EtText>
        <EtAccordion expandedIds={expandedIds} onExpandedChange={setExpandedIds}>
          {faqItems.slice(0, 3).map((item) => (
            <EtAccordion.Item key={item.id} id={item.id}>
              <EtAccordion.Header>
                <EtText variant="body-base-semibold">{item.question}</EtText>
              </EtAccordion.Header>
              <EtAccordion.Content>
                <EtText variant="body-base-regular">{item.answer}</EtText>
              </EtAccordion.Content>
            </EtAccordion.Item>
          ))}
        </EtAccordion>
      </View>
    );
  },
  args: {},
};

// FAQ Section matching Figma design
export const FAQSection: Story = {
  render: () => (
    <ScrollView style={styles.faqContainer}>
      <View style={styles.faqHeader}>
        <EtText variant="heading-large" style={styles.faqTitle}>
          FAQ
        </EtText>
        <EtText variant="body-base-regular" style={styles.faqSubtitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </EtText>
      </View>
      <EtAccordion defaultExpandedIds={['1']}>
        {faqItems.map((item) => (
          <EtAccordion.Item key={item.id} id={item.id}>
            <EtAccordion.Header>
              <EtText variant="body-base-semibold">{item.question}</EtText>
            </EtAccordion.Header>
            <EtAccordion.Content>
              <EtText variant="body-base-regular">{item.answer}</EtText>
            </EtAccordion.Content>
          </EtAccordion.Item>
        ))}
      </EtAccordion>
    </ScrollView>
  ),
  args: {},
};

// With disabled items
export const WithDisabledItems: Story = {
  render: () => (
    <EtAccordion>
      <EtAccordion.Item id="1">
        <EtAccordion.Header>
          <EtText variant="body-base-semibold">Enabled Item</EtText>
        </EtAccordion.Header>
        <EtAccordion.Content>
          <EtText variant="body-base-regular">This item can be expanded and collapsed.</EtText>
        </EtAccordion.Content>
      </EtAccordion.Item>
      <EtAccordion.Item id="2" disabled>
        <EtAccordion.Header>
          <EtText variant="body-base-semibold">Disabled Item</EtText>
        </EtAccordion.Header>
        <EtAccordion.Content>
          <EtText variant="body-base-regular">This content won't be visible because the item is disabled.</EtText>
        </EtAccordion.Content>
      </EtAccordion.Item>
      <EtAccordion.Item id="3">
        <EtAccordion.Header>
          <EtText variant="body-base-semibold">Another Enabled Item</EtText>
        </EtAccordion.Header>
        <EtAccordion.Content>
          <EtText variant="body-base-regular">This item also works normally.</EtText>
        </EtAccordion.Content>
      </EtAccordion.Item>
    </EtAccordion>
  ),
  args: {},
};

// All variations showcase
export const AllVariations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Accordion Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Single Expand (Default)
      </EtText>
      <EtAccordion defaultExpandedIds={['s1']}>
        <EtAccordion.Item id="s1">
          <EtAccordion.Header>
            <EtText variant="body-base-semibold">First Question</EtText>
          </EtAccordion.Header>
          <EtAccordion.Content>
            <EtText variant="body-base-regular">First answer content here.</EtText>
          </EtAccordion.Content>
        </EtAccordion.Item>
        <EtAccordion.Item id="s2">
          <EtAccordion.Header>
            <EtText variant="body-base-semibold">Second Question</EtText>
          </EtAccordion.Header>
          <EtAccordion.Content>
            <EtText variant="body-base-regular">Second answer content here.</EtText>
          </EtAccordion.Content>
        </EtAccordion.Item>
      </EtAccordion>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Multiple Expand
      </EtText>
      <EtAccordion allowMultiple defaultExpandedIds={['m1', 'm2']}>
        <EtAccordion.Item id="m1">
          <EtAccordion.Header>
            <EtText variant="body-base-semibold">First Question</EtText>
          </EtAccordion.Header>
          <EtAccordion.Content>
            <EtText variant="body-base-regular">First answer - this can stay open while others are opened.</EtText>
          </EtAccordion.Content>
        </EtAccordion.Item>
        <EtAccordion.Item id="m2">
          <EtAccordion.Header>
            <EtText variant="body-base-semibold">Second Question</EtText>
          </EtAccordion.Header>
          <EtAccordion.Content>
            <EtText variant="body-base-regular">Second answer - multiple items can be open at once.</EtText>
          </EtAccordion.Content>
        </EtAccordion.Item>
      </EtAccordion>
    </ScrollView>
  ),
  args: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: X4,
  },
  showcase: {
    padding: X4,
  },
  title: {
    marginBottom: X5,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: X6,
    marginBottom: X3,
  },
  statusText: {
    marginBottom: X4,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  faqContainer: {
    flex: 1,
    padding: X4,
  },
  faqHeader: {
    marginBottom: X6,
  },
  faqTitle: {
    marginBottom: X2,
  },
  faqSubtitle: {
    color: '#666',
  },
});
