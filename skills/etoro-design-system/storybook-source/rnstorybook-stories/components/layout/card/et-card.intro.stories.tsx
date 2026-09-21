import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtCard, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

function IntroductionContent() {
  const { colors } = useEtoroTheme();

  return (
    <ScrollView style={styles.container}>
      <EtText variant="display-main" style={styles.title}>
        EtCard
      </EtText>
      <EtText variant="heading-compact" style={styles.subtitle}>
        Basic card component with compound pattern
      </EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Features
      </EtText>
      <EtText variant="body-secondary-regular">- Compound component pattern (Header, Content, Footer)</EtText>
      <EtText variant="body-secondary-regular">- Flexible children - add custom elements between sections</EtText>
      <EtText variant="body-secondary-regular">- Optional shadow styling</EtText>
      <EtText variant="body-secondary-regular">- Sentiment-based styling (positive/negative/neutral)</EtText>
      <EtText variant="body-secondary-regular">- Halo effect in dark mode for sentiment</EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example - Neutral
      </EtText>
      <View style={styles.cardDemo}>
        <EtCard shadow>
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
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example - Positive
      </EtText>
      <View style={styles.cardDemo}>
        <EtCard isPositive={true}>
          <EtCard.Header>
            <EtText variant="label-tertiary-semibold">Today's Gain</EtText>
          </EtCard.Header>
          <EtCard.Content>
            <EtText variant="num-l" style={{ color: colors.actionBrandText }}>
              +$1,234.56
            </EtText>
          </EtCard.Content>
        </EtCard>
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example - Negative
      </EtText>
      <View style={styles.cardDemo}>
        <EtCard isPositive={false}>
          <EtCard.Header>
            <EtText variant="label-tertiary-semibold">Today's Loss</EtText>
          </EtCard.Header>
          <EtCard.Content>
            <EtText variant="num-l" style={{ color: colors.actionBrandVarText }}>
              -$567.89
            </EtText>
          </EtCard.Content>
        </EtCard>
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Usage
      </EtText>
      <EtText variant="body-secondary-regular" style={[styles.code, { backgroundColor: colors.bgNeutralSecondary }]}>
        {`<EtCard isPositive={true}>
  <EtCard.Header>
    <EtText>Title</EtText>
  </EtCard.Header>
  <EtCard.Content>
    <EtText>Main content</EtText>
  </EtCard.Content>
  <EtCard.Footer>
    <EtText>Footer</EtText>
  </EtCard.Footer>
</EtCard>`}
      </EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Flexible Layout
      </EtText>
      <EtText variant="body-secondary-regular" style={{ marginBottom: 8 }}>
        Add custom elements between sections:
      </EtText>
      <EtText variant="body-secondary-regular" style={[styles.code, { backgroundColor: colors.bgNeutralSecondary }]}>
        {`<EtCard>
  <EtCard.Header>...</EtCard.Header>
  <View style={styles.divider} />
  <EtCard.Content>...</EtCard.Content>
  <EtCard.Content>...</EtCard.Content>
</EtCard>`}
      </EtText>
    </ScrollView>
  );
}

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Layout/EtCard/Introduction',
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
  render: () => <IntroductionContent />,
};

const styles = StyleSheet.create({
  decorator: { flex: 1, padding: 16 },
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', opacity: 0.8, marginBottom: 24 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  cardDemo: { marginVertical: 16, paddingHorizontal: 16 },
  code: { fontFamily: 'Courier', fontSize: 12, padding: 12, borderRadius: 8 },
});
