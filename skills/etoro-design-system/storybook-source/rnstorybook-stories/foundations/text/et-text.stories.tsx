import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { EtText } from 'etoro-ui';

type Story = StoryObj<typeof EtText>;

const meta: Meta<typeof EtText> = {
  title: 'eToro-UI/Foundations/Typography/EtText',
  component: EtText,
  parameters: {
    notes: 'Typography component with variant-based API for consistent typography.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display-hero',
        'display-main',
        'display-compact',
        'heading-large',
        'heading-base',
        'heading-compact',
        'body-base-regular',
        'body-base-medium',
        'body-base-semibold',
        'body-secondary-regular',
        'body-secondary-medium',
        'body-secondary-semibold',
        'body-tiny-regular',
        'body-tiny-medium',
        'label-primary-regular',
        'label-primary-semibold',
        'label-primary-bold',
        'label-secondary-regular',
        'label-secondary-semibold',
        'label-secondary-bold',
        'label-tertiary-regular',
        'label-tertiary-semibold',
        'label-tertiary-bold',
        'caption-regular',
        'caption-medium',
      ],
    },
    numberOfLines: {
      control: { type: 'number', min: 1, max: 5, step: 1 },
    },
    ellipsizeMode: {
      control: 'select',
      options: ['head', 'middle', 'tail', 'clip'],
    },
    selectable: {
      control: 'boolean',
    },
  },
};

export default meta;

export const Interactive: Story = {
  args: {
    variant: 'body-base-regular',
    children: 'Sample Text',
    numberOfLines: undefined,
    ellipsizeMode: 'tail',
    selectable: false,
  },
};

export const Variants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        All Variants
      </EtText>
      <View style={styles.variantGrid}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Display
          </EtText>
          <EtText variant="display-hero">Display Hero</EtText>
          <EtText variant="display-main">Display Main</EtText>
          <EtText variant="display-compact">Display Compact</EtText>
        </View>

        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Heading
          </EtText>
          <EtText variant="heading-large">Heading Large</EtText>
          <EtText variant="heading-base">Heading Base</EtText>
          <EtText variant="heading-compact">Heading Compact</EtText>
        </View>

        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Body
          </EtText>
          <EtText variant="body-base-regular">Body Base Regular</EtText>
          <EtText variant="body-base-medium">Body Base Medium</EtText>
          <EtText variant="body-base-semibold">Body Base Semibold</EtText>
          <EtText variant="body-secondary-regular">Body Secondary Regular</EtText>
          <EtText variant="body-secondary-medium">Body Secondary Medium</EtText>
          <EtText variant="body-secondary-semibold">Body Secondary Semibold</EtText>
          <EtText variant="body-tiny-regular">Body Tiny Regular</EtText>
          <EtText variant="body-tiny-medium">Body Tiny Medium</EtText>
        </View>

        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Label
          </EtText>
          <EtText variant="label-primary-regular">Label Primary Regular</EtText>
          <EtText variant="label-primary-semibold">Label Primary Semibold</EtText>
          <EtText variant="label-primary-bold">Label Primary Bold</EtText>
          <EtText variant="label-secondary-regular">Label Secondary Regular</EtText>
          <EtText variant="label-secondary-semibold">Label Secondary Semibold</EtText>
          <EtText variant="label-secondary-bold">Label Secondary Bold</EtText>
          <EtText variant="label-tertiary-regular">Label Tertiary Regular</EtText>
          <EtText variant="label-tertiary-semibold">Label Tertiary Semibold</EtText>
          <EtText variant="label-tertiary-bold">Label Tertiary Bold</EtText>
        </View>

        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Caption
          </EtText>
          <EtText variant="caption-regular">Caption Regular</EtText>
          <EtText variant="caption-medium">Caption Medium</EtText>
        </View>
      </View>
    </View>
  ),
};

export const StyleOverride: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Style Override
      </EtText>
      <View style={styles.overrideGrid}>
        <EtText variant="body-base-regular">Default color (from variant)</EtText>
        <EtText variant="body-base-regular" style={{ color: '#FF0000' }}>
          Red color override
        </EtText>
        <EtText variant="body-base-regular" style={{ fontSize: 20 }}>
          Font size override
        </EtText>
        <EtText variant="body-base-regular" style={{ fontWeight: 'bold' }}>
          Font weight override
        </EtText>
      </View>
    </View>
  ),
};

export const Truncation: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Text Truncation
      </EtText>
      <View style={styles.truncationGrid}>
        <EtText variant="body-base-regular" numberOfLines={1} ellipsizeMode="tail" style={styles.truncationExample}>
          This is a very long text that will be truncated at the end with ellipsis
        </EtText>
        <EtText variant="body-base-regular" numberOfLines={1} ellipsizeMode="middle" style={styles.truncationExample}>
          This text will be truncated in the middle with ellipsis
        </EtText>
        <EtText variant="body-base-regular" numberOfLines={2} ellipsizeMode="tail" style={styles.truncationExample}>
          This is a longer text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </EtText>
      </View>
    </View>
  ),
};

export const ShrinkToFit: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Shrink to fit (narrow container)
      </EtText>
      <View style={styles.shrinkNarrow}>
        <EtText variant="num-s-medium" shrinkToFit minimumFontScale={0.85}>
          $12,345,678.90
        </EtText>
      </View>
      <View style={styles.shrinkNarrow}>
        <EtText variant="body-base-regular" shrinkToFit minimumFontScale={0.85}>
          Stop Loss: $1,234.56 · Take Profit: $9,876.54
        </EtText>
      </View>
    </View>
  ),
};

export const TypographyHierarchy: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Typography Hierarchy
      </EtText>
      <View style={styles.typographyGrid}>
        <EtText variant="display-hero">Display Hero</EtText>
        <EtText variant="display-main">Display Main</EtText>
        <EtText variant="display-compact">Display Compact</EtText>
        <EtText variant="heading-large">Heading Large</EtText>
        <EtText variant="heading-base">Heading Base</EtText>
        <EtText variant="heading-compact">Heading Compact</EtText>
        <EtText variant="body-base-regular">Body text for reading content</EtText>
        <EtText variant="body-secondary-medium">Caption text</EtText>
        <EtText variant="body-tiny-regular">Small details and notes</EtText>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 8,
  },
  variantGrid: {
    gap: 16,
    alignItems: 'flex-start',
    width: '100%',
  },
  variantSection: {
    gap: 8,
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 4,
  },
  overrideGrid: {
    gap: 8,
    alignItems: 'flex-start',
    width: '100%',
  },
  truncationGrid: {
    gap: 12,
    width: '100%',
  },
  truncationExample: {
    width: '100%',
  },
  typographyGrid: {
    gap: 8,
    alignItems: 'flex-start',
    width: '100%',
  },
  shrinkNarrow: {
    width: 140,
    alignSelf: 'flex-end',
  },
});
