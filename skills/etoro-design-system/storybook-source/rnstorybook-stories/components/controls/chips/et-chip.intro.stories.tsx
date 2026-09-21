import type { Meta, StoryObj } from '@storybook/react-native';
import { EtChip, EtText } from 'etoro-ui';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CodeBlock } from '../../../utils/code-block';

type Story = StoryObj<{}>;

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/Chips/EtChip/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtChip component with live examples.',
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
    const [selectedCategory, setSelectedCategory] = useState('Technology');
    const [selectedChips, setSelectedChips] = useState<string[]>(['Technology', 'Finance']);

    const toggleChip = (label: string) => {
      setSelectedChips((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            🏷️ EtChip
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Simple selection chips with neutral and selected states
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Simple selected/neutral states with clear visual feedback
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Optional icon support for enhanced meaning
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Haptic feedback for better user experience
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Full accessibility support
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Compound component pattern for flexible composition
          </EtText>
        </View>

        <View style={styles.chipRow}>
          <EtChip selected={false}>
            <EtChip.Label>Neutral</EtChip.Label>
          </EtChip>
          <EtChip selected={true}>
            <EtChip.Label>Selected</EtChip.Label>
          </EtChip>
        </View>
        <CodeBlock
          title="Basic Chip"
          code={`// Neutral state
<EtChip selected={false}>
  <EtChip.Label>Technology</EtChip.Label>
</EtChip>

// Selected state
<EtChip selected={true}>
  <EtChip.Label>Technology</EtChip.Label>
</EtChip>`}
        />

        <View style={styles.chipRow}>
          <EtChip selected={false}>
            <EtChip.Icon iconName="heart" />
            <EtChip.Label>Favorites</EtChip.Label>
          </EtChip>
          <EtChip selected={true}>
            <EtChip.Icon iconName="watched" />
            <EtChip.Label>Watchlist</EtChip.Label>
          </EtChip>
        </View>
        <CodeBlock
          title="Chips with Icons"
          code={`<EtChip selected={false}>
  <EtChip.Icon iconName="heart" />
  <EtChip.Label>Favorites</EtChip.Label>
</EtChip>

<EtChip selected={true}>
  <EtChip.Icon iconName="watched" />
  <EtChip.Label>Watchlist</EtChip.Label>
</EtChip>`}
        />

        <View>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Interactive Single Selection
          </EtText>
          <View style={styles.chipRow}>
            {['Technology', 'Finance', 'Healthcare', 'Energy'].map((category) => (
              <EtChip key={category} selected={selectedCategory === category} onSelectionChange={() => setSelectedCategory(category)}>
                <EtChip.Label>{category}</EtChip.Label>
              </EtChip>
            ))}
          </View>
          <EtText variant="body-secondary-regular" style={styles.selectedText}>
            Selected: {selectedCategory}
          </EtText>
        </View>
        <CodeBlock
          title="Single Selection Example"
          code={`const [selectedCategory, setSelectedCategory] = useState('Technology');

const categories = ['Technology', 'Finance', 'Healthcare', 'Energy'];

{categories.map(category => (
  <EtChip
    key={category}
    selected={selectedCategory === category}
    onSelectionChange={() => setSelectedCategory(category)}
  >
    <EtChip.Label>{category}</EtChip.Label>
  </EtChip>
))}`}
        />

        <View>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Interactive Multi-Selection
          </EtText>
          <View style={styles.chipGrid}>
            {['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial'].map((category) => (
              <EtChip key={category} selected={selectedChips.includes(category)} onSelectionChange={() => toggleChip(category)}>
                <EtChip.Label>{category}</EtChip.Label>
              </EtChip>
            ))}
          </View>
          <EtText variant="body-secondary-regular" style={styles.selectedText}>
            Selected: {selectedChips.join(', ') || 'None'}
          </EtText>
        </View>
        <CodeBlock
          title="Multi-Selection Example"
          code={`const [selectedChips, setSelectedChips] = useState<string[]>(['Technology']);

const toggleChip = (label: string) => {
  setSelectedChips(prev => 
    prev.includes(label) 
      ? prev.filter(item => item !== label)
      : [...prev, label]
  );
};

{categories.map(category => (
  <EtChip
    key={category}
    selected={selectedChips.includes(category)}
    onSelectionChange={() => toggleChip(category)}
  >
    <EtChip.Label>{category}</EtChip.Label>
  </EtChip>
))}`}
        />

        <View style={styles.chipGrid}>
          <EtChip selected={false} onPress={() => console.log('Adding to watchlist')}>
            <EtChip.Icon iconName="plus" />
            <EtChip.Label>Add to Watchlist</EtChip.Label>
          </EtChip>
          <EtChip selected={false} onPress={() => console.log('Removing item')}>
            <EtChip.Icon iconName="close" />
            <EtChip.Label>Remove</EtChip.Label>
          </EtChip>
        </View>
        <CodeBlock
          title="Action Chips"
          code={`// Action chip for adding items
<EtChip
  selected={false}
  onPress={() => handleAddToWatchlist()}
>
  <EtChip.Icon iconName="plus" />
  <EtChip.Label>Add to Watchlist</EtChip.Label>
</EtChip>

// Action chip for removing items
<EtChip
  selected={false}
  onPress={() => handleRemove()}
>
  <EtChip.Icon iconName="close" />
  <EtChip.Label>Remove</EtChip.Label>
</EtChip>`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="EtChipProps"
            code={`interface EtChipProps {
  // Required
  children: EtChipChildren;          // Compound children (EtChip.Icon, EtChip.Label)

  // State
  selected?: boolean;                 // Selection state

  // Interaction
  onPress?: () => void;               // Press handler
  onSelectionChange?: (selected: boolean) => void;

  // Style
  style?: StyleProp<ViewStyle>;       // Container style
  haptics?: boolean;                  // Haptic feedback

  // Accessibility
  testID?: string;                    // Test ID
  accessibilityLabel?: string;        // A11y label
}

// Usage
<EtChip selected={true} onPress={handlePress}>
  <EtChip.Icon iconName="star" />
  <EtChip.Label>Chip</EtChip.Label>
</EtChip>`}
          />
        </View>

        <View style={styles.seeAlsoSection}>
          <EtText variant="heading-base" style={styles.seeAlsoTitle}>
            Using Chips in Groups?
          </EtText>
          <EtText variant="body-base-regular" style={styles.seeAlsoText}>
            For common group patterns like filter lists or category selectors, consider using EtChipsGroupV2 instead of manually mapping EtChip
            components. It provides:
          </EtText>
          <EtText variant="body-base-regular" style={styles.seeAlsoFeature}>
            • Built-in single/multi selection logic
          </EtText>
          <EtText variant="body-base-regular" style={styles.seeAlsoFeature}>
            • Horizontal scroll with animated fade overlays
          </EtText>
          <EtText variant="body-base-regular" style={styles.seeAlsoFeature}>
            • Wrap layout option for multi-row grids
          </EtText>
          <EtText variant="body-base-regular" style={styles.seeAlsoFeature}>
            • Data-driven API - just pass an items array
          </EtText>
          <EtText variant="body-base-regular" style={styles.seeAlsoFeature}>
            • RTL support and proper accessibility roles
          </EtText>
          <CodeBlock
            title="EtChipsGroupV2 Example"
            code={`// Instead of manually mapping EtChip components:
const [selected, setSelected] = useState<string | null>('tech');

<EtChipsGroupV2
  items={[
    { id: 'tech', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'health', label: 'Healthcare' },
  ]}
  selectionMode="single"
  value={selected}
  onChange={setSelected}
/>`}
          />
          <EtText variant="body-secondary-regular" style={styles.seeAlsoHint}>
            See EtChipsGroupV2 in Storybook for full documentation.
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
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  chipGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  selectedText: {
    marginTop: 8,
    marginBottom: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  legacySection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  seeAlsoSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  seeAlsoTitle: {
    marginBottom: 12,
  },
  seeAlsoText: {
    marginBottom: 12,
    opacity: 0.9,
  },
  seeAlsoFeature: {
    marginBottom: 4,
    opacity: 0.8,
    paddingLeft: 8,
  },
  seeAlsoHint: {
    marginTop: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
