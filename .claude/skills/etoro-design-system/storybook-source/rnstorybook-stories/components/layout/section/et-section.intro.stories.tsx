import type { Meta, StoryObj } from '@storybook/react-native';
import { EtSection, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const meta: Meta = {
  title: 'eToro-UI/Components/Layout/EtSection/Intro',
  parameters: {
    notes: `
# EtSection

A flexible section container component for consistent layout patterns.

## Features

- **Static Title** - Simple heading text with \`EtSection.Title\`
- **Select Title** - Pressable title with chevron via \`EtSection.SelectTitle\`
- **Chips** - Chip group with auto fadeColor via \`EtSection.Chips\`
- **Pagination** - Pagination dots with section defaults via \`EtSection.Pagination\`
- **Flexible Content** - Any content via \`EtSection.Content\`
- **Shorthand** - Simple \`title\` prop for basic use cases

## Layout Specs

| Property | Value |
|----------|-------|
| Gap (between elements) | 12px (X3) |
| Title style | heading-base (22px semibold) |

## Usage

### With Chips

\`\`\`tsx
<EtSection>
  <EtSection.Title>My Watchlist</EtSection.Title>
  <EtSection.Chips
    items={chips}
    selectionMode="single"
    value={selected}
    onChange={setSelected}
  />
</EtSection>
\`\`\`

### With Select Title

\`\`\`tsx
<EtSection>
  <EtSection.SelectTitle text="Selected Option" onPress={openPicker} />
  <EtSection.Chips items={chips} ... />
</EtSection>
\`\`\`

### With Pagination

\`\`\`tsx
<EtSection>
  <EtSection.Title>Featured</EtSection.Title>
  <Animated.FlatList horizontal data={items} onScroll={scrollHandler} ... />
  <EtSection.Pagination totalPages={5} currentPage={currentPageAnimated} />
</EtSection>
\`\`\`

### With Content

\`\`\`tsx
<EtSection>
  <EtSection.Title>Settings</EtSection.Title>
  <EtSection.Content>
    <EtListItem ... />
  </EtSection.Content>
</EtSection>
\`\`\`

### Shorthand

\`\`\`tsx
<EtSection title="Quick Section">
  <EtSection.Chips items={chips} ... />
</EtSection>
\`\`\`
    `,
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <EtText variant="heading-base" style={styles.title}>
          EtSection Component
        </EtText>

        <EtText variant="body-base-regular" style={styles.description}>
          A flexible section container that provides consistent layout for section-based UI patterns in the eToro app.
        </EtText>

        <View style={[styles.card, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="body-base-semibold">Key Features:</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Static title (EtSection.Title)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Pressable select title with chevron (EtSection.SelectTitle)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Chips group with auto fadeColor (EtSection.Chips)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Pagination dots with section defaults (EtSection.Pagination)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Flexible content area (EtSection.Content)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Shorthand title prop for simple cases</EtText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="body-base-semibold">Design Specs:</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Gap between elements: 12px (X3)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} Title style: heading-base (22px semibold)</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} EtSection.Chips auto-sets fadeColor to match theme</EtText>
          <EtText variant="body-secondary-regular">{'\u2022'} EtSection.Pagination defaults to size="small", color="neutral"</EtText>
        </View>

        <EtText variant="body-secondary-regular" style={styles.hint}>
          See the "Component" stories for interactive examples.
        </EtText>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  hint: {
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 8,
  },
});
