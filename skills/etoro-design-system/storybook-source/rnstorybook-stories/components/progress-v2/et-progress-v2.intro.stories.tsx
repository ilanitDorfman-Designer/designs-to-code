import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtProgressV2, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText variant="body-secondary-semibold">{title}</EtText>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <EtText variant="body-tiny-regular" style={styles.codeText}>
          {code}
        </EtText>
      </ScrollView>
    </View>
  );
};

const SectionTitle = ({ children }: { children: string }) => (
  <EtText variant="heading-compact" style={styles.sectionTitle}>
    {children}
  </EtText>
);

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Status/EtProgressV2/Introduction',
  parameters: {
    notes: 'Overview and usage guide for the EtProgressV2 component.',
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
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <EtText variant="display-main" style={styles.header}>
          EtProgressV2
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.subtitle}>
          A flexible progress indicator with line and circle variants for visualizing completion percentage.
        </EtText>

        {/* Component Structure */}
        <SectionTitle>Component Structure</SectionTitle>
        <CodeBlock
          code={`EtProgressV2
├── variant="line" (default)
│   ├── size: "small" | "medium" | "large"
│   ├── showLabel: boolean
│   └── labelText: string
└── variant="circle"
    ├── size: "small" | "medium" | "large"
    └── children: ReactNode (default: percentage)`}
        />

        {/* Line Variant */}
        <SectionTitle>Line Variant (Default)</SectionTitle>
        <EtText variant="body-secondary-regular" style={styles.description}>
          Horizontal progress bar with optional percentage label below.
        </EtText>

        <View style={styles.demoRow}>
          <View style={styles.demoItem}>
            <EtText variant="caption-regular" style={styles.demoLabel}>
              Small (4px)
            </EtText>
            <EtProgressV2 progress={0.6} size="small" />
          </View>
          <View style={styles.demoItem}>
            <EtText variant="caption-regular" style={styles.demoLabel}>
              Medium (8px)
            </EtText>
            <EtProgressV2 progress={0.6} size="medium" />
          </View>
          <View style={styles.demoItem}>
            <EtText variant="caption-regular" style={styles.demoLabel}>
              Large (12px)
            </EtText>
            <EtProgressV2 progress={0.6} size="large" />
          </View>
        </View>

        <CodeBlock
          title="Line Variant"
          code={`// Basic line (small)
<EtProgressV2 progress={0.6} />

// Medium size
<EtProgressV2 progress={0.6} size="medium" />

// Large size
<EtProgressV2 progress={0.6} size="large" />

// With label
<EtProgressV2 progress={0.6} showLabel />

// Custom label
<EtProgressV2 progress={0.6} showLabel labelText="Step 3 of 5" />`}
        />

        {/* Circle Variant */}
        <SectionTitle>Circle Variant</SectionTitle>
        <EtText variant="body-secondary-regular" style={styles.description}>
          Circular progress indicator with percentage displayed inside by default.
        </EtText>

        <View style={styles.circleRow}>
          <EtProgressV2 variant="circle" progress={0.2} />
          <EtProgressV2 variant="circle" progress={0.4} />
          <EtProgressV2 variant="circle" progress={0.6} />
          <EtProgressV2 variant="circle" progress={0.8} />
          <EtProgressV2 variant="circle" progress={1} />
        </View>

        <CodeBlock
          title="Circle Variant"
          code={`// Basic circle (shows percentage inside)
<EtProgressV2 variant="circle" progress={0.6} />

// Medium size
<EtProgressV2 variant="circle" progress={0.6} size="medium" />

// Large size with custom content
<EtProgressV2 variant="circle" progress={0.6} size="large">
  <EtText variant="body-tiny-regular">$186</EtText>
</EtProgressV2>`}
        />

        {/* Color Variants */}
        <SectionTitle>Color Variants</SectionTitle>
        <EtText variant="body-secondary-regular" style={styles.description}>
          Two color schemes: positive (green) and neutral (dark).
        </EtText>

        <View style={styles.colorDemo}>
          <View style={styles.colorItem}>
            <EtText variant="caption-regular" style={styles.demoLabel}>
              Positive (default)
            </EtText>
            <EtProgressV2 progress={0.6} size="medium" color="positive" />
          </View>
          <View style={styles.colorItem}>
            <EtText variant="caption-regular" style={styles.demoLabel}>
              Neutral
            </EtText>
            <EtProgressV2 progress={0.6} size="medium" color="neutral" />
          </View>
        </View>

        <View style={styles.circleColorRow}>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} color="positive" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Positive
            </EtText>
          </View>
          <View style={styles.circleItem}>
            <EtProgressV2 variant="circle" progress={0.6} color="neutral" />
            <EtText variant="caption-regular" style={styles.circleLabel}>
              Neutral
            </EtText>
          </View>
        </View>

        <CodeBlock
          title="Color Variants"
          code={`// Positive (default)
<EtProgressV2 progress={0.6} color="positive" />

// Neutral
<EtProgressV2 progress={0.6} color="neutral" />`}
        />

        {/* Props Table */}
        <SectionTitle>Props</SectionTitle>

        <View style={styles.propsTable}>
          <View style={styles.propsHeader}>
            <EtText variant="body-secondary-semibold" style={styles.propCol1}>
              Prop
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol2}>
              Type
            </EtText>
            <EtText variant="body-secondary-semibold" style={styles.propCol3}>
              Default
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              progress
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              number
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              (required)
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              variant
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              'line' | 'circle'
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              'line'
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              color
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              'positive' | 'neutral'
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              'positive'
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              size
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              'small' | 'medium' | 'large'
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              'small'
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              showBackground
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              boolean
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              false
            </EtText>
          </View>

          <View style={styles.propsRow}>
            <EtText variant="body-tiny-regular" style={styles.propCol1}>
              showLabel
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol2}>
              boolean (line only)
            </EtText>
            <EtText variant="body-tiny-regular" style={styles.propCol3}>
              false
            </EtText>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    );
  },
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
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    opacity: 0.7,
    marginBottom: 16,
  },
  demoRow: {
    gap: 16,
    marginBottom: 16,
  },
  demoItem: {
    gap: 8,
  },
  demoLabel: {
    opacity: 0.7,
  },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  circleColorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 16,
  },
  circleItem: {
    alignItems: 'center',
    gap: 8,
  },
  circleLabel: {
    opacity: 0.7,
  },
  colorDemo: {
    gap: 16,
    marginBottom: 16,
  },
  colorItem: {
    gap: 8,
  },
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeText: {
    fontFamily: 'Courier',
    padding: 12,
  },
  propsTable: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  propsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  propsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  propCol1: {
    flex: 1,
  },
  propCol2: {
    flex: 1.5,
  },
  propCol3: {
    flex: 1,
  },
  spacer: {
    height: 40,
  },
});
