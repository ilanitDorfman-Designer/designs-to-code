import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { EtCard, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

const meta: Meta<typeof EtCard> = {
  title: 'eToro-UI/Components/Layout/EtCard/Examples',
  component: EtCard,
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EtCard>;

// ============================================================================
// Neutral Card (Default)
// ============================================================================

export const Neutral: Story = {
  render: () => (
    <EtCard>
      <EtCard.Header>
        <EtText variant="label-tertiary-semibold">Portfolio Value</EtText>
      </EtCard.Header>
      <EtCard.Content>
        <EtText variant="num-l">$42,150.23</EtText>
      </EtCard.Content>
      <EtCard.Footer>
        <EtText variant="body-tiny-regular">Updated just now</EtText>
      </EtCard.Footer>
    </EtCard>
  ),
};

// ============================================================================
// Positive Sentiment
// ============================================================================

function PositiveCard() {
  const { colors } = useEtoroTheme();
  return (
    <EtCard isPositive={true}>
      <EtCard.Header>
        <EtText variant="label-tertiary-semibold">Today's Gain</EtText>
      </EtCard.Header>
      <EtCard.Content>
        <EtText variant="num-l" style={{ color: colors.actionBrandText }}>
          +$1,234.56
        </EtText>
      </EtCard.Content>
      <EtCard.Footer>
        <EtText variant="body-tiny-regular" style={{ color: colors.actionBrandText }}>
          +5.2%
        </EtText>
      </EtCard.Footer>
    </EtCard>
  );
}

export const Positive: Story = {
  render: () => <PositiveCard />,
};

// ============================================================================
// Negative Sentiment
// ============================================================================

function NegativeCard() {
  const { colors } = useEtoroTheme();
  return (
    <EtCard isPositive={false}>
      <EtCard.Header>
        <EtText variant="label-tertiary-semibold">Today's Loss</EtText>
      </EtCard.Header>
      <EtCard.Content>
        <EtText variant="num-l" style={{ color: colors.actionBrandVarText }}>
          -$567.89
        </EtText>
      </EtCard.Content>
      <EtCard.Footer>
        <EtText variant="body-tiny-regular" style={{ color: colors.actionBrandVarText }}>
          -2.3%
        </EtText>
      </EtCard.Footer>
    </EtCard>
  );
}

export const Negative: Story = {
  render: () => <NegativeCard />,
};

// ============================================================================
// Content Only (Flexible)
// ============================================================================

export const ContentOnly: Story = {
  render: () => (
    <EtCard>
      <EtCard.Content>
        <View style={styles.customContent}>
          <EtText variant="heading-base">Custom Layout</EtText>
          <EtText variant="body-secondary-regular">Use Content slot for full flexibility</EtText>
        </View>
      </EtCard.Content>
    </EtCard>
  ),
};

// ============================================================================
// No Shadow
// ============================================================================

export const NoShadow: Story = {
  render: () => (
    <EtCard shadow={false}>
      <EtCard.Header>
        <EtText variant="label-tertiary-semibold">Flat Card</EtText>
      </EtCard.Header>
      <EtCard.Content>
        <EtText variant="body-secondary-regular">No shadow</EtText>
      </EtCard.Content>
    </EtCard>
  ),
};

// ============================================================================
// All Sentiments Comparison
// ============================================================================

function AllSentiments() {
  const { colors } = useEtoroTheme();
  return (
    <View style={styles.comparison}>
      <EtCard isPositive={true} style={styles.comparisonCard}>
        <EtCard.Content>
          <EtText variant="label-tertiary-semibold">Positive</EtText>
          <EtText variant="num-sm" style={{ color: colors.actionBrandText }}>
            +$100
          </EtText>
        </EtCard.Content>
      </EtCard>

      <EtCard style={styles.comparisonCard}>
        <EtCard.Content>
          <EtText variant="label-tertiary-semibold">Neutral</EtText>
          <EtText variant="num-sm">$0</EtText>
        </EtCard.Content>
      </EtCard>

      <EtCard isPositive={false} style={styles.comparisonCard}>
        <EtCard.Content>
          <EtText variant="label-tertiary-semibold">Negative</EtText>
          <EtText variant="num-sm" style={{ color: colors.actionBrandVarText }}>
            -$50
          </EtText>
        </EtCard.Content>
      </EtCard>
    </View>
  );
}

export const SentimentComparison: Story = {
  render: () => <AllSentiments />,
};

const styles = StyleSheet.create({
  decorator: { flex: 1, padding: 16 },
  customContent: { gap: 8 },
  comparison: { gap: 16 },
  comparisonCard: { flex: 1 },
});
