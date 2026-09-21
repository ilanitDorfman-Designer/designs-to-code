import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtChip, EtText } from 'etoro-ui';

// Wrapper for interactive stories
const EtChipWrapper = (props: any) => {
  const [isSelected, setIsSelected] = useState(props.selected || false);

  // Default to a no-op onPress so the `disabled` visual actually renders in the
  // wrapper (otherwise a handler-less chip falls into the static path which
  // intentionally keeps default colors regardless of the `disabled` prop).
  const onPress = props.onPress ?? (() => undefined);

  return (
    <EtChip
      selected={props.controlled ? props.selected : isSelected}
      onSelectionChange={props.controlled ? props.onSelectionChange : setIsSelected}
      onPress={onPress}
      disabled={props.disabled}
      haptics={props.haptics}
      style={props.style}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel}
    >
      {props.icon && <EtChip.Icon iconName={props.icon} />}
      <EtChip.Label>{props.label}</EtChip.Label>
    </EtChip>
  );
};

const meta = {
  title: 'eToro-UI/Components/Controls/Chips/EtChip',
  component: EtChipWrapper,
  argTypes: {
    // Display
    label: {
      control: { type: 'text' },
      description: 'Chip label text',
    },
    icon: {
      control: {
        type: 'select',
        options: ['heart', 'watched', 'plus', 'checked', 'close', undefined],
      },
      description: 'Optional icon',
    },
    // State
    selected: {
      control: { type: 'boolean' },
      description: 'Whether chip is selected (for controlled mode)',
    },
    controlled: {
      control: { type: 'boolean' },
      description: 'Whether to use controlled state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable interaction and apply disabled visuals (carbon300 label/icon)',
    },
    // Interaction
    haptics: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback',
    },
    // Accessibility
    testID: {
      control: { type: 'text' },
      description: 'Test ID for testing',
    },
    accessibilityLabel: {
      control: { type: 'text' },
      description: 'Accessibility label',
    },
  },
  args: {
    label: 'Technology',
    selected: false,
    controlled: false,
    disabled: false,
    haptics: true,
  },
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtChipWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive story with full controls
export const Interactive: Story = {
  render: (args) => <EtChipWrapper {...args} />,
};

// Basic chips
export const BasicChip: Story = {
  args: {
    label: 'Technology',
    selected: false,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

export const SelectedChip: Story = {
  args: {
    label: 'Technology',
    selected: true,
    controlled: true,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

// Chips with icons
export const ChipWithIcon: Story = {
  args: {
    label: 'Favorites',
    icon: 'heart',
    selected: false,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

export const SelectedChipWithIcon: Story = {
  args: {
    label: 'Favorites',
    icon: 'heart',
    selected: true,
    controlled: true,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

// Disabled chips
export const DisabledChip: Story = {
  args: {
    label: 'Technology',
    selected: false,
    disabled: true,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

export const DisabledSelectedChip: Story = {
  args: {
    label: 'Technology',
    selected: true,
    controlled: true,
    disabled: true,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

export const DisabledChipWithIcon: Story = {
  args: {
    label: 'Favorites',
    icon: 'heart',
    selected: false,
    disabled: true,
  },
  render: (args) => <EtChipWrapper {...args} />,
};

// Different categories
export const CategoryChips: Story = {
  render: () => (
    <View style={styles.chipGrid}>
      <EtChip selected={false}>
        <EtChip.Label>Technology</EtChip.Label>
      </EtChip>
      <EtChip selected={true}>
        <EtChip.Label>Finance</EtChip.Label>
      </EtChip>
      <EtChip selected={false}>
        <EtChip.Label>Healthcare</EtChip.Label>
      </EtChip>
      <EtChip selected={true}>
        <EtChip.Label>Energy</EtChip.Label>
      </EtChip>
    </View>
  ),
  args: {},
};

// Chips with icons
export const IconChips: Story = {
  render: () => (
    <View style={styles.chipGrid}>
      <EtChip selected={false}>
        <EtChip.Icon iconName="heart" />
        <EtChip.Label>Favorites</EtChip.Label>
      </EtChip>
      <EtChip selected={true}>
        <EtChip.Icon iconName="watched" />
        <EtChip.Label>Watchlist</EtChip.Label>
      </EtChip>
      <EtChip selected={false}>
        <EtChip.Icon iconName="plus" />
        <EtChip.Label>Add New</EtChip.Label>
      </EtChip>
      <EtChip selected={true}>
        <EtChip.Icon iconName="checked" />
        <EtChip.Label>Completed</EtChip.Label>
      </EtChip>
    </View>
  ),
  args: {},
};

// Interactive chip group
export const ChipGroup: Story = {
  render: () => {
    const [selectedChips, setSelectedChips] = useState<string[]>(['Technology']);

    const toggleChip = (label: string) => {
      setSelectedChips((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
    };

    const categories = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial'];

    return (
      <View>
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Select Categories
        </EtText>
        <View style={styles.chipGrid}>
          {categories.map((category) => (
            <EtChip key={category} selected={selectedChips.includes(category)} onSelectionChange={() => toggleChip(category)}>
              <EtChip.Label>{category}</EtChip.Label>
            </EtChip>
          ))}
        </View>
        <EtText variant="body-secondary-regular" style={styles.selectedText}>
          Selected: {selectedChips.join(', ') || 'None'}
        </EtText>
      </View>
    );
  },
  args: {},
};

// Showcase all variations
export const AllVariations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Chip Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Basic States
      </EtText>
      <View style={styles.chipRow}>
        <EtChip selected={false}>
          <EtChip.Label>Neutral</EtChip.Label>
        </EtChip>
        <EtChip selected={true}>
          <EtChip.Label>Selected</EtChip.Label>
        </EtChip>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        With Icons
      </EtText>
      <View style={styles.chipRow}>
        <EtChip selected={false}>
          <EtChip.Icon iconName="watched" />
          <EtChip.Label>Neutral</EtChip.Label>
        </EtChip>
        <EtChip selected={true}>
          <EtChip.Icon iconName="watched" />
          <EtChip.Label>Selected</EtChip.Label>
        </EtChip>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Disabled States
      </EtText>
      <View style={styles.chipRow}>
        <EtChip disabled onPress={() => undefined}>
          <EtChip.Label>Disabled</EtChip.Label>
        </EtChip>
        <EtChip disabled selected onPress={() => undefined}>
          <EtChip.Label>Disabled Selected</EtChip.Label>
        </EtChip>
        <EtChip disabled onPress={() => undefined}>
          <EtChip.Icon iconName="heart" />
          <EtChip.Label>Disabled with Icon</EtChip.Label>
        </EtChip>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Category Examples
      </EtText>
      <View style={styles.chipGrid}>
        <EtChip selected={true}>
          <EtChip.Label>Technology</EtChip.Label>
        </EtChip>
        <EtChip selected={false}>
          <EtChip.Label>Finance</EtChip.Label>
        </EtChip>
        <EtChip selected={true}>
          <EtChip.Label>Healthcare</EtChip.Label>
        </EtChip>
        <EtChip selected={false}>
          <EtChip.Label>Energy</EtChip.Label>
        </EtChip>
        <EtChip selected={false}>
          <EtChip.Label>Consumer Goods</EtChip.Label>
        </EtChip>
        <EtChip selected={true}>
          <EtChip.Label>Real Estate</EtChip.Label>
        </EtChip>
      </View>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Action Chips
      </EtText>
      <View style={styles.chipRow}>
        <EtChip selected={false}>
          <EtChip.Icon iconName="plus" />
          <EtChip.Label>Add to Watchlist</EtChip.Label>
        </EtChip>
        <EtChip selected={false}>
          <EtChip.Icon iconName="close" />
          <EtChip.Label>Remove</EtChip.Label>
        </EtChip>
      </View>
    </ScrollView>
  ),
  args: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showcase: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
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
    marginTop: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
