import type { Meta, StoryObj } from '@storybook/react-native';
import { EtSearchInput, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const IntroContent = () => {
  const { colors } = useEtoroTheme();
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <EtText variant="heading-base" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
        EtSearchInput
      </EtText>

      <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
        <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
          Overview
        </EtText>
        <EtText variant="body-base-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 16 }}>
          A specialized search input component designed for intuitive search experiences. Features built-in search icon, automatic clear button, and
          optimized keyboard settings for search use cases.
        </EtText>
      </View>

      <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
        <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
          Try It Out
        </EtText>
        <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
          Start typing to see the search icon change color and the clear button appear
        </EtText>
        <EtSearchInput value={search} onChangeText={setSearch} placeholder="Search" testID="intro-search" />
      </View>

      <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
        <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
          Key Features
        </EtText>
        <View style={styles.featureList}>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textPrimaryNeutral }]}>
            • Built-in search icon that adapts to input state
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textPrimaryNeutral }]}>
            • Automatic clear button when text is present
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textPrimaryNeutral }]}>
            • Optimized keyboard settings for search
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textPrimaryNeutral }]}>
            • Accessible with screen reader support
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textPrimaryNeutral }]}>
            • Customizable placeholder and max length
          </EtText>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
        <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
          When to Use
        </EtText>
        <View style={styles.featureList}>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textSecondaryNeutral }]}>
            ✓ Searching for stocks, crypto, or other assets
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textSecondaryNeutral }]}>
            ✓ Finding users or traders
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textSecondaryNeutral }]}>
            ✓ Filtering lists or tables
          </EtText>
          <EtText variant="body-base-regular" style={[styles.featureItem, { color: colors.textSecondaryNeutral }]}>
            ✓ Any search-specific input needs
          </EtText>
        </View>
      </View>

      <EtText
        variant="body-base-regular"
        style={[
          styles.usage,
          {
            color: colors.textPrimaryNeutral,
            backgroundColor: colors.bgNeutralTertiary,
          },
        ]}
      >
        💡 Tip: Try the other stories to explore all features and use cases!
      </EtText>
    </ScrollView>
  );
};

const meta = {
  title: 'eToro-UI/Components/Input/EtSearchInput/📖 Introduction',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    lineHeight: 24,
  },
  usage: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
  },
});
