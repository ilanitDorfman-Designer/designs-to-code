import type { Meta, StoryObj } from '@storybook/react-native';
import { EtRange, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

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
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Status/EtRange/📖 Introduction',
  parameters: {
    notes: 'Overview and usage guide for the EtRange component.',
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
    const basicPosition = useSharedValue(0.5);
    const pricePosition = useSharedValue(0.35);
    const readOnlyPosition = useSharedValue(0.65);
    const [currentValue, setCurrentValue] = useState(50);

    return (
      <ScrollView style={styles.container}>
        <EtText variant="heading-compact" style={styles.header}>
          📊 EtRange
        </EtText>
        <EtText style={styles.subtitle}>
          A range slider component for selecting values within a defined range. Perfect for price ranges, percentages, and interactive data
          visualization.
        </EtText>

        {/* Basic Example */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Usage
          </EtText>
          <View style={styles.demoBlock}>
            <EtText style={{ color: colors.textSecondaryNeutral }}>Current: {currentValue.toFixed(0)}%</EtText>
            <View style={styles.rangeWrapper}>
              <EtRange leftValue={0} rightValue={100} position={basicPosition} onPositionChange={(pos) => setCurrentValue(pos * 100)} />
            </View>
          </View>
          <CodeBlock
            title="Basic Range"
            code={`import { EtRange } from 'etoro-ui';
import { useSharedValue } from 'react-native-reanimated';

const position = useSharedValue(0.5);

<EtRange
  leftValue={0}
  rightValue={100}
  position={position}
  onPositionChange={(pos) => console.log(pos)}
/>`}
          />
        </View>

        {/* Price Range Example */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Price Range with Custom Format
          </EtText>
          <View style={styles.demoBlock}>
            <View style={styles.rangeWrapper}>
              <EtRange leftValue={142.5} rightValue={189.75} position={pricePosition} formatValue={(value) => `$${value.toFixed(2)}`} />
            </View>
          </View>
          <CodeBlock
            title="Custom Value Formatting"
            code={`<EtRange
  leftValue={142.50}
  rightValue={189.75}
  position={position}
  formatValue={(value) => \`$\${value.toFixed(2)}\`}
/>`}
          />
        </View>

        {/* Read Only Example */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Read-Only Mode
          </EtText>
          <EtText style={{ color: colors.textSecondaryNeutral, marginBottom: 12 }}>
            Use readOnly prop when you want to display the range without user interaction.
          </EtText>
          <View style={styles.demoBlock}>
            <View style={styles.rangeWrapper}>
              <EtRange leftValue={1} rightValue={10} position={readOnlyPosition} formatValue={(value) => value.toFixed(0)} readOnly />
            </View>
          </View>
          <CodeBlock
            title="Read-Only Display"
            code={`<EtRange
  leftValue={1}
  rightValue={10}
  position={position}
  formatValue={(value) => value.toFixed(0)}
  readOnly
/>`}
          />
        </View>

        {/* Props Table */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Props
          </EtText>
          <View style={[styles.propsTable, { backgroundColor: colors.bgNeutralSecondary }]}>
            <PropsRow name="leftValue" type="number" description="Value displayed on the left side" required />
            <PropsRow name="rightValue" type="number" description="Value displayed on the right side" required />
            <PropsRow name="position" type="SharedValue<number>" description="Animated value for cursor position (0-1)" />
            <PropsRow name="width" type="number | 'auto'" description="Width of the track (default: 'auto')" />
            <PropsRow name="cursorHeight" type="number" description="Height of the cursor indicator (default: 16)" />
            <PropsRow name="formatValue" type="(value: number) => string" description="Format function for label values" />
            <PropsRow name="onScrubStart" type="() => void" description="Called when user starts dragging" />
            <PropsRow name="onScrubEnd" type="() => void" description="Called when user stops dragging" />
            <PropsRow name="onPositionChange" type="(position: number) => void" description="Called when position changes" />
            <PropsRow name="disabled" type="boolean" description="Disables gesture interaction (default: false)" />
            <PropsRow name="readOnly" type="boolean" description="Display only, no gesture handlers (default: false)" />
          </View>
        </View>

        {/* Use Cases */}
        <View style={styles.section}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Common Use Cases
          </EtText>
          <View style={styles.useCaseList}>
            <UseCaseItem emoji="📈" title="Price Ranges" description="Show 52-week high/low with current position" />
            <UseCaseItem emoji="💰" title="Portfolio Allocation" description="Adjust stock/bond allocation percentages" />
            <UseCaseItem emoji="⚖️" title="Risk Scores" description="Display risk level on a scale" />
            <UseCaseItem emoji="🎯" title="Target Prices" description="Set buy/sell target prices" />
          </View>
        </View>
      </ScrollView>
    );
  },
};

const PropsRow = ({ name, type, description, required }: { name: string; type: string; description: string; required?: boolean }) => {
  const { colors } = useEtoroTheme();

  return (
    <View style={[styles.propsRow, { borderBottomColor: colors.dividerSecondary }]}>
      <View style={styles.propNameContainer}>
        <Text style={[styles.propName, { color: colors.actionBrandText }]}>{name}</Text>
        {required && <Text style={[styles.requiredBadge, { color: colors.actionBrandVarText }]}>*</Text>}
      </View>
      <Text style={[styles.propType, { color: colors.textTertiaryNeutral }]}>{type}</Text>
      <Text style={[styles.propDesc, { color: colors.textSecondaryNeutral }]}>{description}</Text>
    </View>
  );
};

const UseCaseItem = ({ emoji, title, description }: { emoji: string; title: string; description: string }) => {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.useCaseItem}>
      <Text style={styles.useCaseEmoji}>{emoji}</Text>
      <View style={styles.useCaseContent}>
        <Text style={[styles.useCaseTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
        <Text style={[styles.useCaseDesc, { color: colors.textSecondaryNeutral }]}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  demoBlock: {
    marginBottom: 16,
  },
  rangeWrapper: {
    marginTop: 12,
  },
  codeContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
  propsTable: {
    borderRadius: 8,
    padding: 12,
  },
  propsRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  propNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  propName: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: '600',
  },
  requiredBadge: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  propType: {
    fontFamily: 'Courier',
    fontSize: 12,
    marginBottom: 4,
  },
  propDesc: {
    fontSize: 13,
  },
  useCaseList: {
    gap: 12,
  },
  useCaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  useCaseEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  useCaseContent: {
    flex: 1,
  },
  useCaseTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  useCaseDesc: {
    fontSize: 13,
  },
});
