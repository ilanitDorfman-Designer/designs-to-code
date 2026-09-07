import type { Meta, StoryObj } from '@storybook/react-native';
import { EtChipsGroupV2, EtText } from 'etoro-ui';
import { ChipsGroupItem } from 'etoro-ui/components/controls/chips-group-v2/api';
import { useEtoroTheme } from 'etoro-ui/core';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CodeBlock } from '../../../utils/code-block';

type Story = StoryObj<{}>;

// Sample data
const categoryItems: ChipsGroupItem[] = [
  { id: 'tech', label: 'Technology' },
  { id: 'finance', label: 'Finance' },
  { id: 'health', label: 'Healthcare' },
  { id: 'energy', label: 'Energy' },
];

const manyItems: ChipsGroupItem[] = [
  { id: '1', label: 'Technology' },
  { id: '2', label: 'Finance' },
  { id: '3', label: 'Healthcare' },
  { id: '4', label: 'Energy' },
  { id: '5', label: 'Consumer' },
  { id: '6', label: 'Industrial' },
  { id: '7', label: 'Real Estate' },
  { id: '8', label: 'Materials' },
];

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/Chips/EtChipsGroupV2/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtChipsGroupV2 component with live examples.',
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
    const { colors } = useEtoroTheme();
    const [singleSelected, setSingleSelected] = useState<string | null>('tech');
    const [multiSelected, setMultiSelected] = useState<string[]>(['tech', 'finance']);

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText variant="display-main" style={styles.title}>
            EtChipsGroupV2
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Group of selectable chips with scroll/wrap layouts
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Three selection modes: none, single, multi
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Horizontal scroll with animated fade overlays
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Wrapped multi-row layout option
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • RTL support for fade overlays
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Controlled-only state management
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Haptic feedback on selection
          </EtText>
        </View>

        <View style={styles.whenToUse}>
          <EtText variant="heading-base" style={styles.whenToUseTitle}>
            When to Use
          </EtText>
          <EtText variant="body-base-semibold" style={styles.whenToUseSubtitle}>
            Use EtChipsGroupV2 for:
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Filter lists with single or multi selection
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Category selectors (e.g., market sectors)
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Horizontal scrolling chip rows
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • When you need built-in selection state management
          </EtText>

          <EtText variant="body-base-semibold" style={[styles.whenToUseSubtitle, styles.whenToUseSubtitleSpacing]}>
            Use EtChip directly when:
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Single standalone chip
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Action chips (non-selection buttons)
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Custom layout requirements
          </EtText>
          <EtText variant="body-base-regular" style={styles.whenToUseItem}>
            • Need compound children flexibility (custom icon placement)
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.whenToUseHint}>
            EtChipsGroupV2 uses EtChip internally - it's a convenience wrapper for common group patterns.
          </EtText>
        </View>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Non-Selectable Mode
        </EtText>
        <EtChipsGroupV2 items={categoryItems} selectionMode="none" />
        <CodeBlock
          title="Display Only"
          code={`// Non-selectable chips (display only)
<EtChipsGroupV2
  items={categories}
  selectionMode="none"
/>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Single Selection
        </EtText>
        <EtChipsGroupV2 items={categoryItems} selectionMode="single" value={singleSelected} onChange={setSingleSelected} />
        <EtText variant="body-secondary-regular" style={styles.selectedText}>
          Selected: {singleSelected ?? 'none'}
        </EtText>
        <CodeBlock
          title="Single Select"
          code={`const [selected, setSelected] = useState<string | null>(null);

<EtChipsGroupV2
  items={categories}
  selectionMode="single"
  value={selected}
  onChange={setSelected}
/>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Multi Selection
        </EtText>
        <EtChipsGroupV2 items={categoryItems} selectionMode="multi" value={multiSelected} onChange={setMultiSelected} />
        <EtText variant="body-secondary-regular" style={styles.selectedText}>
          Selected: {multiSelected.length > 0 ? multiSelected.join(', ') : 'none'}
        </EtText>
        <CodeBlock
          title="Multi Select"
          code={`const [selected, setSelected] = useState<string[]>([]);

<EtChipsGroupV2
  items={categories}
  selectionMode="multi"
  value={selected}
  onChange={setSelected}
/>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Scroll Layout with Fade Overlays
        </EtText>
        <EtChipsGroupV2 items={manyItems} selectionMode="none" layout="scroll" />
        <EtText variant="body-secondary-regular" style={styles.hint}>
          Scroll to see fade effect on edges
        </EtText>
        <CodeBlock
          title="Scroll with Overlays"
          code={`// Horizontal scroll with fade overlays (default)
<EtChipsGroupV2
  items={manyItems}
  selectionMode="single"
  value={selected}
  onChange={setSelected}
  layout="scroll"
/>`}
        />

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Wrapped Layout
        </EtText>
        <EtChipsGroupV2 items={manyItems} selectionMode="none" layout="wrap" />
        <CodeBlock
          title="Wrap Layout"
          code={`// Multi-row wrapped layout
<EtChipsGroupV2
  items={categories}
  selectionMode="multi"
  value={selected}
  onChange={setSelected}
  layout="wrap"
/>`}
        />

        <View style={[styles.apiReference, { borderTopColor: colors.dividerPrimary }]}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="ChipsGroupItem"
            code={`interface ChipsGroupItem {
  id: string;           // Unique identifier
  label: string;        // Display label
  icon?: IconName;      // Optional leading icon
}`}
          />
          <CodeBlock
            title="EtChipsGroupV2Props"
            code={`// Non-selectable mode
<EtChipsGroupV2
  items: ChipsGroupItem[]
  selectionMode?: 'none'
  layout?: 'scroll' | 'wrap'
  gap?: number              // default: 8
  fadeColor?: string        // for non-white backgrounds
  haptics?: boolean         // default: true
/>

// Single selection mode
<EtChipsGroupV2
  items: ChipsGroupItem[]
  selectionMode: 'single'
  value: string | null
  onChange: (value: string | null) => void
  // ... other props
/>

// Multi selection mode
<EtChipsGroupV2
  items: ChipsGroupItem[]
  selectionMode: 'multi'
  value: string[]
  onChange: (value: string[]) => void
  // ... other props
/>`}
          />
        </View>

        <View style={[styles.notes, { borderTopColor: colors.dividerPrimary }]}>
          <EtText variant="heading-base" style={styles.notesTitle}>
            Important Notes
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            • This is a <EtText variant="body-base-semibold">controlled-only</EtText> component
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            • Always provide <EtText variant="body-base-semibold">value</EtText> and <EtText variant="body-base-semibold">onChange</EtText> for
            single/multi modes
          </EtText>
          <EtText variant="body-base-regular" style={styles.noteText}>
            • Fade overlays only appear when content overflows
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
  whenToUse: {
    marginBottom: 24,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 150, 136, 0.08)',
  },
  whenToUseTitle: {
    marginBottom: 12,
  },
  whenToUseSubtitle: {
    marginBottom: 8,
  },
  whenToUseSubtitleSpacing: {
    marginTop: 16,
  },
  whenToUseItem: {
    marginBottom: 4,
    opacity: 0.85,
    paddingLeft: 8,
  },
  whenToUseHint: {
    marginTop: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  selectedText: {
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  hint: {
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
    opacity: 0.6,
    fontSize: 12,
  },
  apiReference: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  notes: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    marginBottom: 32,
  },
  notesTitle: {
    marginBottom: 12,
  },
  noteText: {
    marginBottom: 8,
    opacity: 0.8,
  },
});
