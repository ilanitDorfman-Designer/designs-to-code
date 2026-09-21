import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

import { EtChipsGroupV2, EtText } from 'etoro-ui';
import { ChipsGroupItem } from 'etoro-ui/components/controls/chips-group-v2/api';
import { useEtoroTheme } from 'etoro-ui/core';

type DemoCardVariant = 'white' | 'greyLight' | 'greyMedium' | 'greyDark';

/**
 * Theme-aware demo card wrapper that provides fadeColor automatically.
 * Supports different background variants to demonstrate fadeColor usage.
 */
const DemoCard = ({ children, style, variant = 'greyLight' }: { children: React.ReactNode; style?: ViewStyle; variant?: DemoCardVariant }) => {
  const { colors } = useEtoroTheme();

  // Use visually distinct background colors
  const bgColorMap: Record<DemoCardVariant, string> = {
    white: colors.bgNeutralPrimary,
    greyLight: colors.bgNeutralGreyPrimary, // neutral[50]
    greyMedium: colors.bgGreyPrimary, // neutral[100]
    greyDark: colors.bgGreySecondary, // neutral[200]
  };

  return (
    <View
      style={[
        styles.demoCard,
        {
          backgroundColor: bgColorMap[variant],
          borderColor: colors.dividerPrimary,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/** Hook to get the demo card background color for fadeColor prop */
const useDemoCardBg = (variant: DemoCardVariant = 'greyLight') => {
  const { colors } = useEtoroTheme();
  const bgColorMap: Record<DemoCardVariant, string> = {
    white: colors.bgNeutralPrimary,
    greyLight: colors.bgNeutralGreyPrimary,
    greyMedium: colors.bgGreyPrimary,
    greyDark: colors.bgGreySecondary,
  };
  return bgColorMap[variant];
};

// Sample data
const categoryItems: ChipsGroupItem[] = [
  { id: 'tech', label: 'Technology' },
  { id: 'finance', label: 'Finance' },
  { id: 'health', label: 'Healthcare' },
  { id: 'energy', label: 'Energy' },
  { id: 'consumer', label: 'Consumer' },
  { id: 'industrial', label: 'Industrial' },
];

const manyItems: ChipsGroupItem[] = [
  { id: '1', label: 'Technology' },
  { id: '2', label: 'Finance' },
  { id: '3', label: 'Healthcare' },
  { id: '4', label: 'Energy' },
  { id: '5', label: 'Consumer Goods' },
  { id: '6', label: 'Industrial' },
  { id: '7', label: 'Real Estate' },
  { id: '8', label: 'Materials' },
  { id: '9', label: 'Utilities' },
  { id: '10', label: 'Communication' },
];

const itemsWithIcons: ChipsGroupItem[] = [
  { id: 'favorites', label: 'Favorites', icon: 'heart' },
  { id: 'watchlist', label: 'Watchlist', icon: 'watched' },
  { id: 'trending', label: 'Trending', icon: 'gainers' },
];

const meta: Meta<typeof EtChipsGroupV2> = {
  title: 'eToro-UI/Components/Controls/Chips/EtChipsGroupV2',
  component: EtChipsGroupV2,
  parameters: {
    notes: 'Chips group component with scroll/wrap layouts and single/multi selection modes. Controlled-only - always provide value and onChange.',
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

type Story = StoryObj<typeof EtChipsGroupV2>;

// Interactive story with full controls
export const Interactive: Story = {
  render: () => {
    const [singleValue, setSingleValue] = useState<string | null>('tech');
    const [multiValue, setMultiValue] = useState<string[]>(['tech', 'finance']);
    const fadeColor = useDemoCardBg();

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Single Selection (Interactive)
          </EtText>
          <DemoCard>
            <EtChipsGroupV2 items={categoryItems} selectionMode="single" value={singleValue} onChange={setSingleValue} fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {singleValue ?? 'none'}
            </EtText>
          </DemoCard>
        </View>

        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Multi Selection (Interactive)
          </EtText>
          <DemoCard>
            <EtChipsGroupV2 items={categoryItems} selectionMode="multi" value={multiValue} onChange={setMultiValue} fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {multiValue.length > 0 ? multiValue.join(', ') : 'none'}
            </EtText>
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// Non-selectable display mode
export const NonSelectable: Story = {
  render: () => {
    const fadeColor = useDemoCardBg();
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Display Only (Non-Interactive)
          </EtText>
          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Static category labels
            </EtText>
            <EtChipsGroupV2 items={categoryItems} selectionMode="none" fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.hint}>
              Chips are not clickable in 'none' mode
            </EtText>
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// Single selection mode
export const SingleSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    const fadeColor = useDemoCardBg();

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Single Selection
          </EtText>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Select a category
            </EtText>
            <EtChipsGroupV2 items={categoryItems} selectionMode="single" value={selected} onChange={setSelected} fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {selected ?? 'none'}
            </EtText>
          </DemoCard>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Pre-selected value
            </EtText>
            <EtChipsGroupV2 items={categoryItems.slice(0, 4)} selectionMode="single" value="finance" onChange={() => {}} fadeColor={fadeColor} />
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// Multi selection mode
export const MultiSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['tech']);
    const fadeColor = useDemoCardBg();

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Multi Selection
          </EtText>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Select multiple categories
            </EtText>
            <EtChipsGroupV2 items={categoryItems} selectionMode="multi" value={selected} onChange={setSelected} fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {selected.length > 0 ? selected.join(', ') : 'none'}
            </EtText>
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// Scroll layout with fade overlays
export const ScrollWithOverlays: Story = {
  render: () => {
    const [selectedWhite, setSelectedWhite] = useState<string | null>('1');
    const [selectedGrey, setSelectedGrey] = useState<string | null>('3');
    const fadeColorWhite = useDemoCardBg('white');
    const fadeColorGrey = useDemoCardBg('greyMedium');

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Horizontal Scroll with Fade Overlays
          </EtText>

          <DemoCard variant="white">
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              White background
            </EtText>
            <EtChipsGroupV2
              items={manyItems}
              selectionMode="single"
              value={selectedWhite}
              onChange={setSelectedWhite}
              layout="scroll"
              fadeColor={fadeColorWhite}
            />
            <EtText variant="body-secondary-regular" style={styles.hint}>
              Use fadeColor to match container background
            </EtText>
          </DemoCard>

          <DemoCard variant="greyMedium">
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Grey background
            </EtText>
            <EtChipsGroupV2
              items={manyItems}
              selectionMode="single"
              value={selectedGrey}
              onChange={setSelectedGrey}
              layout="scroll"
              fadeColor={fadeColorGrey}
            />
            <EtText variant="body-secondary-regular" style={styles.hint}>
              fadeColor={'{colors.bgGreyPrimary}'}
            </EtText>
          </DemoCard>

          <DemoCard variant="greyLight">
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              No fade when content fits
            </EtText>
            <EtChipsGroupV2 items={categoryItems.slice(0, 3)} selectionMode="none" layout="scroll" />
            <EtText variant="body-secondary-regular" style={styles.hint}>
              Fade overlays are hidden when chips fit on screen
            </EtText>
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// Wrapped layout
export const WrappedLayout: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['tech', 'health']);

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Wrapped Multi-Row Layout
          </EtText>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Chips wrap to multiple rows
            </EtText>
            <EtChipsGroupV2 items={manyItems} selectionMode="multi" value={selected} onChange={setSelected} layout="wrap" />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {selected.length > 0 ? selected.join(', ') : 'none'}
            </EtText>
          </DemoCard>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Custom gap (12px)
            </EtText>
            <EtChipsGroupV2 items={categoryItems} selectionMode="none" layout="wrap" gap={12} />
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// With icons
export const WithIcons: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>('favorites');
    const fadeColor = useDemoCardBg();

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Chips with Icons
          </EtText>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Leading icons
            </EtText>
            <EtChipsGroupV2 items={itemsWithIcons} selectionMode="single" value={selected} onChange={setSelected} fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Selected: {selected ?? 'none'}
            </EtText>
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => {
    const [sector, setSector] = useState<string | null>('all');
    const [filters, setFilters] = useState<string[]>([]);
    const [timeframe, setTimeframe] = useState<string | null>('1m');
    const fadeColor = useDemoCardBg();

    const sectorItems: ChipsGroupItem[] = [
      { id: 'all', label: 'All Sectors' },
      { id: 'tech', label: 'Technology' },
      { id: 'finance', label: 'Financials' },
      { id: 'health', label: 'Healthcare' },
      { id: 'energy', label: 'Energy' },
      { id: 'consumer', label: 'Consumer' },
      { id: 'materials', label: 'Materials' },
      { id: 'utilities', label: 'Utilities' },
    ];

    const filterItems: ChipsGroupItem[] = [
      { id: 'gainers', label: 'Top Gainers' },
      { id: 'losers', label: 'Top Losers' },
      { id: 'volume', label: 'High Volume' },
      { id: 'dividend', label: 'Dividend' },
      { id: 'popular', label: 'Popular' },
    ];

    const timeframeItems: ChipsGroupItem[] = [
      { id: '1d', label: '1D' },
      { id: '1w', label: '1W' },
      { id: '1m', label: '1M' },
      { id: '3m', label: '3M' },
      { id: '1y', label: '1Y' },
      { id: 'all', label: 'All' },
    ];

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Examples
          </EtText>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Stock Sector Filter
            </EtText>
            <EtChipsGroupV2 items={sectorItems} selectionMode="single" value={sector} onChange={setSector} fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Viewing: {sector === 'all' ? 'All sectors' : sector}
            </EtText>
          </DemoCard>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Market Filters (Multi-select)
            </EtText>
            <EtChipsGroupV2 items={filterItems} selectionMode="multi" value={filters} onChange={setFilters} layout="wrap" fadeColor={fadeColor} />
            <EtText variant="body-secondary-regular" style={styles.valueLabel}>
              Active filters: {filters.length > 0 ? filters.join(', ') : 'none'}
            </EtText>
          </DemoCard>

          <DemoCard>
            <EtText variant="body-base-semibold" style={styles.demoTitle}>
              Chart Timeframe
            </EtText>
            <EtChipsGroupV2 items={timeframeItems} selectionMode="single" value={timeframe} onChange={setTimeframe} gap={4} fadeColor={fadeColor} />
          </DemoCard>
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  demoCard: {
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  demoTitle: {
    marginBottom: 4,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
  hint: {
    marginTop: 4,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
