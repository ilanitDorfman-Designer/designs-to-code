import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtProgressV2, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

import { StoryThemeProvider, ThemeSwitcher } from '../../utils/storybook-template';

type Story = StoryObj<typeof EtProgressV2>;

// =============================================================================
// CODE BLOCK HELPER
// =============================================================================

const CodeBlock = ({ code }: { code: string }) => {
  const { colors } = useEtoroTheme();
  return (
    <View style={[styles.codeBlock, { backgroundColor: colors.bgNeutralSecondary }]}>
      <EtText variant="body-tiny-regular" style={styles.codeText}>
        {code}
      </EtText>
    </View>
  );
};

// =============================================================================
// PROGRESS WRAPPER
// =============================================================================

const ProgressShowcase = ({ children, testID }: { children: React.ReactNode; testID?: string }) => {
  return (
    <View style={styles.progressWrapper} testID={testID}>
      {children}
    </View>
  );
};

const meta: Meta<typeof EtProgressV2> = {
  title: 'eToro-UI/Components/Status/EtProgressV2',
  component: EtProgressV2,
  parameters: {
    notes: 'Progress component with line and circle variants.',
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

// =============================================================================
// PLAYGROUND
// =============================================================================

export const Playground: Story = {
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Playground
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Interactive progress demo
        </EtText>

        <ProgressShowcase testID="playground-line">
          <EtProgressV2 progress={0.6} showLabel testID="progress-line" />
        </ProgressShowcase>

        <ProgressShowcase testID="playground-line-sectioned">
          <EtProgressV2 variant="line-sectioned" progress={0.6} sections={4} testID="progress-line-sectioned" />
        </ProgressShowcase>

        <View style={styles.circleRow}>
          <EtProgressV2 variant="circle" progress={0.6} testID="progress-circle" />
        </View>

        <CodeBlock
          code={`// Line variant (default)
<EtProgressV2 progress={0.6} showLabel />

// Sectioned Line variant
<EtProgressV2
  variant="line-sectioned"
  progress={0.6}
  sections={4}
/>

// Circle variant
<EtProgressV2 variant="circle" progress={0.6} />`}
        />
      </View>
    );
  },
};

// =============================================================================
// LINE VARIANT STORIES
// =============================================================================

export const Line_Basic: Story = {
  name: 'Line / Basic',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Basic Line Progress
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Simple progress bar without label
        </EtText>

        <ProgressShowcase testID="line-basic">
          <EtProgressV2 progress={0.6} testID="progress" />
        </ProgressShowcase>

        <CodeBlock code={`<EtProgressV2 progress={0.6} />`} />
      </View>
    );
  },
};

export const Line_WithLabel: Story = {
  name: 'Line / With Label',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Line with Label
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Shows percentage completion text below bar
        </EtText>

        <ProgressShowcase testID="line-label">
          <EtProgressV2 progress={0.6} showLabel testID="progress" />
        </ProgressShowcase>

        <CodeBlock code={`<EtProgressV2 progress={0.6} showLabel />`} />
      </View>
    );
  },
};

export const Line_CustomLabel: Story = {
  name: 'Line / Custom Label',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Custom Label Text
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Override default percentage label
        </EtText>

        <ProgressShowcase testID="line-custom-label">
          <EtProgressV2 progress={0.6} showLabel labelText="Step 3 of 5" testID="progress" />
        </ProgressShowcase>

        <CodeBlock
          code={`<EtProgressV2 
  progress={0.6} 
  showLabel 
  labelText="Step 3 of 5" 
/>`}
        />
      </View>
    );
  },
};

export const Line_Sizes: Story = {
  name: 'Line / Sizes',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Size Variants
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Small (4px), Medium (8px), and Large (12px) heights
        </EtText>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Small (default)
        </EtText>
        <ProgressShowcase testID="line-small">
          <EtProgressV2 progress={0.6} size="small" showLabel testID="progress-small" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Medium
        </EtText>
        <ProgressShowcase testID="line-medium">
          <EtProgressV2 progress={0.6} size="medium" showLabel testID="progress-medium" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Large
        </EtText>
        <ProgressShowcase testID="line-large">
          <EtProgressV2 progress={0.6} size="large" showLabel testID="progress-large" />
        </ProgressShowcase>

        <CodeBlock
          code={`// Small (default)
<EtProgressV2 progress={0.6} size="small" />

// Medium
<EtProgressV2 progress={0.6} size="medium" />

// Large
<EtProgressV2 progress={0.6} size="large" />`}
        />
      </View>
    );
  },
};

export const Line_Colors: Story = {
  name: 'Line / Colors',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Color Variants
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Positive (green) and Neutral (dark) colors
        </EtText>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Positive (default)
        </EtText>
        <ProgressShowcase testID="line-positive">
          <EtProgressV2 progress={0.6} color="positive" size="medium" showLabel testID="progress-positive" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Neutral
        </EtText>
        <ProgressShowcase testID="line-neutral">
          <EtProgressV2 progress={0.6} color="neutral" size="medium" showLabel testID="progress-neutral" />
        </ProgressShowcase>

        <CodeBlock
          code={`// Positive (default)
<EtProgressV2 progress={0.6} color="positive" />

// Neutral
<EtProgressV2 progress={0.6} color="neutral" />`}
        />
      </View>
    );
  },
};

const LineCustomColorsContent = () => {
  // Data-driven categorical colors — passed as design-system token keys.
  // Matches the app's categorical data-viz palette (portfolio-insights ALLOCATION_PALETTE):
  // accentA700..accentF700 for slices, textTertiaryNeutral for the aggregated "Other".
  const rows = [
    { label: 'Accent A', progress: 0.536, color: 'accentA700' },
    { label: 'Accent B', progress: 0.273, color: 'accentB700' },
    { label: 'Accent C', progress: 0.191, color: 'accentC700' },
    { label: 'Other', progress: 0.003, color: 'textTertiaryNeutral' },
  ] as const;

  return (
    <View style={styles.showcase}>
      <View style={styles.themeSwitcherRow}>
        <ThemeSwitcher />
      </View>

      <EtText variant="heading-base" style={styles.storyTitle}>
        Custom Colors
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.storyDesc}>
        Use customColor for data-driven, categorical bars (overrides the color scheme). Toggle light/dark above.
      </EtText>

      {rows.map((row) => (
        <View key={row.label} style={styles.progressStateRow}>
          <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
            {row.label}
          </EtText>
          <ProgressShowcase testID={`line-custom-${row.label.toLowerCase()}`}>
            <EtProgressV2 progress={row.progress} size="medium" customColor={row.color} testID={`progress-custom-${row.label.toLowerCase()}`} />
          </ProgressShowcase>
        </View>
      ))}

      <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
        With background track (showBackground)
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.storyDesc}>
        showBackground renders the theme track behind the custom fill
      </EtText>

      {rows.map((row) => (
        <View key={`${row.label}-bg`} style={styles.progressStateRow}>
          <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
            {row.label}
          </EtText>
          <ProgressShowcase testID={`line-custom-bg-${row.label.toLowerCase()}`}>
            <EtProgressV2
              progress={row.progress}
              size="medium"
              customColor={row.color}
              showBackground
              testID={`progress-custom-bg-${row.label.toLowerCase()}`}
            />
          </ProgressShowcase>
        </View>
      ))}

      <CodeBlock
        code={`// customColor takes a design-system color token key (overrides the color scheme).
// Use the categorical accent palette for data-viz (matches ALLOCATION_PALETTE):
// accentA700, accentB700, accentC700... and textTertiaryNeutral for "Other".
<EtProgressV2 progress={0.536} size="medium" customColor="accentA700" />
<EtProgressV2 progress={0.003} size="medium" customColor="textTertiaryNeutral" />

// With the theme background track
<EtProgressV2 progress={0.536} size="medium" customColor="accentA700" showBackground />`}
      />
    </View>
  );
};

export const Line_CustomColors: Story = {
  name: 'Line / Custom Colors',
  render: () => (
    <StoryThemeProvider>
      <LineCustomColorsContent />
    </StoryThemeProvider>
  ),
};

export const Line_ProgressStates: Story = {
  name: 'Line / Progress States',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Progress States
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Various progress values from 0% to 100%
        </EtText>

        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((progress) => (
          <View key={progress} style={styles.progressStateRow}>
            <ProgressShowcase testID={`line-${progress * 100}`}>
              <EtProgressV2 progress={progress} size="medium" showLabel testID={`progress-${progress * 100}`} />
            </ProgressShowcase>
          </View>
        ))}

        <CodeBlock
          code={`<EtProgressV2 progress={0} showLabel />
<EtProgressV2 progress={0.2} showLabel />
<EtProgressV2 progress={0.4} showLabel />
<EtProgressV2 progress={0.6} showLabel />
<EtProgressV2 progress={0.8} showLabel />
<EtProgressV2 progress={1} showLabel />`}
        />
      </View>
    );
  },
};

// =============================================================================
// LINE SECTIONED VARIANT STORIES
// =============================================================================

export const Line_Sectioned: Story = {
  name: 'Line / Sectioned',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Sectioned Line Progress
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Line progress split into multiple sections.
        </EtText>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Basic (3 sections)
        </EtText>
        <ProgressShowcase testID="sectioned-basic">
          <EtProgressV2 variant="line-sectioned" progress={0.6} sections={3} testID="progress-sectioned-basic" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Custom Sections (5)
        </EtText>
        <ProgressShowcase testID="sectioned-custom">
          <EtProgressV2 variant="line-sectioned" progress={0.6} sections={5} testID="progress-sectioned-custom" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Custom Gap (4px)
        </EtText>
        <ProgressShowcase testID="sectioned-gap">
          <EtProgressV2 variant="line-sectioned" progress={0.6} sections={4} gap={4} testID="progress-sectioned-gap" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Neutral Color
        </EtText>
        <ProgressShowcase testID="sectioned-neutral">
          <EtProgressV2 variant="line-sectioned" progress={0.6} sections={4} color="neutral" testID="progress-sectioned-neutral" />
        </ProgressShowcase>

        <CodeBlock
          code={`// Basic (3 sections)
<EtProgressV2
  variant="line-sectioned"
  progress={0.6}
  sections={3}
/>

// Custom Sections & Gap
<EtProgressV2
  variant="line-sectioned"
  progress={0.6}
  sections={5}
  gap={4}
/>`}
        />
      </View>
    );
  },
};

// =============================================================================
// CIRCLE VARIANT STORIES
// =============================================================================

export const Circle_Basic: Story = {
  name: 'Circle / Basic',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Basic Circle Progress
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Simple circular progress indicator
        </EtText>

        <View style={styles.circleRow}>
          <EtProgressV2 variant="circle" progress={0.6} testID="progress-circle" />
        </View>

        <CodeBlock code={`<EtProgressV2 variant="circle" progress={0.6} />`} />
      </View>
    );
  },
};

export const Circle_WithCustomContent: Story = {
  name: 'Circle / Custom Content',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Circle with Custom Content
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Override default percentage with custom content
        </EtText>

        <View style={styles.circleRow}>
          <EtProgressV2 variant="circle" progress={0.6} size="large" testID="progress-circle">
            <EtText variant="body-tiny-regular">$186</EtText>
          </EtProgressV2>
        </View>

        <CodeBlock
          code={`// Custom content overrides default percentage
<EtProgressV2 variant="circle" progress={0.6} size="large">
  <EtText variant="body-tiny-regular">$186</EtText>
</EtProgressV2>`}
        />
      </View>
    );
  },
};

export const Circle_Sizes: Story = {
  name: 'Circle / Sizes',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Circle Sizes
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Small (32px), Medium (40px), and Large (48px)
        </EtText>

        <View style={styles.circleRowSpaced}>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} size="small" testID="circle-small" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Small
            </EtText>
          </View>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} size="medium" testID="circle-medium" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Medium
            </EtText>
          </View>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} size="large" testID="circle-large" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Large
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`// Small (32px)
<EtProgressV2 variant="circle" progress={0.6} size="small" />

// Medium (40px)
<EtProgressV2 variant="circle" progress={0.6} size="medium" />

// Large (48px)
<EtProgressV2 variant="circle" progress={0.6} size="large" />`}
        />
      </View>
    );
  },
};

export const Circle_ProgressStates: Story = {
  name: 'Circle / Progress States',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Circle Progress States
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Various progress values from 0% to 100%
        </EtText>

        <View style={styles.circleRowSpaced}>
          {[0.2, 0.4, 0.6, 0.8, 1].map((progress) => (
            <EtProgressV2 key={progress} variant="circle" progress={progress} testID={`circle-${progress * 100}`} />
          ))}
        </View>

        <CodeBlock
          code={`<EtProgressV2 variant="circle" progress={0.2} />
<EtProgressV2 variant="circle" progress={0.4} />
<EtProgressV2 variant="circle" progress={0.6} />
<EtProgressV2 variant="circle" progress={0.8} />
<EtProgressV2 variant="circle" progress={1} />`}
        />
      </View>
    );
  },
};

export const Circle_Colors: Story = {
  name: 'Circle / Colors',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Circle Color Variants
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Positive (green) and Neutral (dark) colors
        </EtText>

        <View style={styles.circleRowSpaced}>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} color="positive" testID="circle-positive" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Positive
            </EtText>
          </View>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} color="neutral" testID="circle-neutral" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Neutral
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`// Positive (default)
<EtProgressV2 variant="circle" progress={0.6} color="positive" />

// Neutral
<EtProgressV2 variant="circle" progress={0.6} color="neutral" />`}
        />
      </View>
    );
  },
};

// =============================================================================
// BACKGROUND STORIES
// =============================================================================

export const Line_WithBackground: Story = {
  name: 'Line / With Background',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Line with Background
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Show gray background track (default is hidden)
        </EtText>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          Without Background (default)
        </EtText>
        <ProgressShowcase testID="line-no-bg">
          <EtProgressV2 progress={0.6} size="medium" testID="progress-no-bg" />
        </ProgressShowcase>

        <EtText variant="body-secondary-semibold" style={styles.sizeLabel}>
          With Background
        </EtText>
        <ProgressShowcase testID="line-with-bg">
          <EtProgressV2 progress={0.6} size="medium" showBackground testID="progress-with-bg" />
        </ProgressShowcase>

        <CodeBlock
          code={`// Without background (default)
<EtProgressV2 progress={0.6} size="medium" />

// With background
<EtProgressV2 progress={0.6} size="medium" showBackground />`}
        />
      </View>
    );
  },
};

export const Circle_WithBackground: Story = {
  name: 'Circle / With Background',
  render: () => {
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-base" style={styles.storyTitle}>
          Circle with Background
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.storyDesc}>
          Show gray background track (default is hidden)
        </EtText>

        <View style={styles.circleRowSpaced}>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} testID="circle-no-bg" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              No Background
            </EtText>
          </View>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} showBackground testID="circle-with-bg" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              With Background
            </EtText>
          </View>
        </View>

        <CodeBlock
          code={`// Without background (default)
<EtProgressV2 variant="circle" progress={0.6} />

// With background
<EtProgressV2 variant="circle" progress={0.6} showBackground />`}
        />
      </View>
    );
  },
};

// =============================================================================
// ALL VARIANTS GRID
// =============================================================================

export const AllVariants: Story = {
  name: 'All Variants Grid',
  render: () => {
    return (
      <ScrollView style={styles.gridContainer}>
        <EtText variant="display-main" style={styles.gridTitle}>
          All Variants
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.gridSubtitle}>
          Complete overview of EtProgressV2 variants
        </EtText>

        {/* Line Variants */}
        <View style={styles.gridSection}>
          <EtText variant="heading-compact">Line Variants</EtText>

          <View style={styles.gridItem}>
            <EtText variant="caption-regular">Small + Positive</EtText>
            <ProgressShowcase>
              <EtProgressV2 progress={0.6} size="small" color="positive" showLabel />
            </ProgressShowcase>
          </View>

          <View style={styles.gridItem}>
            <EtText variant="caption-regular">Medium + Positive</EtText>
            <ProgressShowcase>
              <EtProgressV2 progress={0.6} size="medium" color="positive" showLabel />
            </ProgressShowcase>
          </View>

          <View style={styles.gridItem}>
            <EtText variant="caption-regular">Sectioned (4) + Positive</EtText>
            <ProgressShowcase>
              <EtProgressV2 variant="line-sectioned" progress={0.6} sections={4} size="small" color="positive" />
            </ProgressShowcase>
          </View>

          <View style={styles.gridItem}>
            <EtText variant="caption-regular">Small + Neutral</EtText>
            <ProgressShowcase>
              <EtProgressV2 progress={0.6} size="small" color="neutral" showLabel />
            </ProgressShowcase>
          </View>

          <View style={styles.gridItem}>
            <EtText variant="caption-regular">Medium + Neutral</EtText>
            <ProgressShowcase>
              <EtProgressV2 progress={0.6} size="medium" color="neutral" showLabel />
            </ProgressShowcase>
          </View>

          <View style={styles.gridItem}>
            <EtText variant="caption-regular">Sectioned (4) + Neutral</EtText>
            <ProgressShowcase>
              <EtProgressV2 variant="line-sectioned" progress={0.6} sections={4} size="small" color="neutral" />
            </ProgressShowcase>
          </View>
        </View>

        {/* Circle Variants */}
        <View style={styles.gridSection}>
          <EtText variant="heading-compact">Circle Variants</EtText>

          <View style={styles.circleRowSpaced}>
            <EtProgressV2 variant="circle" progress={0.2} />
            <EtProgressV2 variant="circle" progress={0.4} />
            <EtProgressV2 variant="circle" progress={0.6} />
            <EtProgressV2 variant="circle" progress={0.8} />
            <EtProgressV2 variant="circle" progress={1} />
          </View>

          <View style={styles.circleRowSpaced}>
            <View style={styles.circleItem}>
              <EtProgressV2 variant="circle" progress={0.6} color="neutral" />
              <EtText variant="caption-regular" style={styles.circleLabel}>
                Neutral
              </EtText>
            </View>
            <View style={styles.circleItem}>
              <EtProgressV2 variant="circle" progress={0.6} size="large">
                <EtText variant="body-tiny-regular">$186</EtText>
              </EtProgressV2>
              <EtText variant="caption-regular" style={styles.circleLabel}>
                Custom Content
              </EtText>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  },
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    gap: 8,
  },
  storyTitle: {
    marginBottom: 4,
  },
  storyDesc: {
    opacity: 0.7,
    marginBottom: 12,
  },
  progressWrapper: {
    paddingVertical: 8,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  codeText: {
    fontFamily: 'Courier',
  },
  sizeLabel: {
    marginTop: 12,
    marginBottom: 4,
  },
  progressStateRow: {
    marginBottom: 4,
  },
  themeSwitcherRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  circleRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  circleRowSpaced: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 16,
  },
  circleItem: {
    alignItems: 'center',
    gap: 8,
  },
  circleLabel: {
    opacity: 0.7,
  },
  gridContainer: {
    flex: 1,
  },
  gridTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  gridSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  gridSection: {
    gap: 12,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  gridItem: {
    gap: 4,
  },
});
