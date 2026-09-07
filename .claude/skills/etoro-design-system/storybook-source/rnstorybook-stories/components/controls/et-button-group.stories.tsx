import type { Meta, StoryObj } from '@storybook/react-native';
import { EtButtonGroup, EtText } from 'etoro-ui';
import { X1, X10, X2, X3, X4 } from 'etoro-ui/core/styles';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtButtonGroup>;

const meta: Meta<typeof EtButtonGroup> = {
  title: 'eToro-UI/Components/Controls/EtButtonGroup',
  component: EtButtonGroup,
  parameters: {
    notes: 'A horizontal group of icon buttons with pill-shaped ends and smooth press animations.',
  },
  decorators: [
    (Story) => (
      <ScrollView contentContainerStyle={styles.decorator}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;

/**
 * Basic usage with two icon buttons
 */
export const Basic: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Basic Button Group
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Two icon buttons in a pill-shaped container
      </EtText>

      <EtButtonGroup>
        <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} />
        <EtButtonGroup.Item iconName="expand" onPress={() => {}} />
      </EtButtonGroup>
    </View>
  ),
};

/**
 * Different icon combinations
 */
export const IconVariations: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Icon Variations
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Different icon combinations for various use cases
      </EtText>

      <View style={styles.column}>
        <EtText variant="label-secondary-semibold">Chart actions:</EtText>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} />
          <EtButtonGroup.Item iconName="expand" onPress={() => {}} />
        </EtButtonGroup>

        <EtText variant="label-secondary-semibold" style={styles.marginTop}>
          Zoom controls:
        </EtText>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="plus" onPress={() => {}} />
          <EtButtonGroup.Item iconName="minus" onPress={() => {}} />
        </EtButtonGroup>

        <EtText variant="label-secondary-semibold" style={styles.marginTop}>
          Navigation:
        </EtText>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="chevronLeft" onPress={() => {}} />
          <EtButtonGroup.Item iconName="chevronRight" onPress={() => {}} />
        </EtButtonGroup>
      </View>
    </View>
  ),
};

/**
 * With disabled buttons
 */
export const DisabledState: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Disabled State
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Individual buttons can be disabled
      </EtText>

      <View style={styles.column}>
        <EtText variant="label-secondary-semibold">First button disabled:</EtText>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} disabled />
          <EtButtonGroup.Item iconName="expand" onPress={() => {}} />
        </EtButtonGroup>

        <EtText variant="label-secondary-semibold" style={styles.marginTop}>
          Second button disabled:
        </EtText>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} />
          <EtButtonGroup.Item iconName="expand" onPress={() => {}} disabled />
        </EtButtonGroup>

        <EtText variant="label-secondary-semibold" style={styles.marginTop}>
          Both disabled:
        </EtText>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} disabled />
          <EtButtonGroup.Item iconName="expand" onPress={() => {}} disabled />
        </EtButtonGroup>
      </View>
    </View>
  ),
};

/**
 * Interactive demo - press the buttons to see the animation
 */
export const InteractiveDemo: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Interactive Demo
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Press and hold to see the animated press state
      </EtText>

      <EtButtonGroup>
        <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} accessibilityLabel="Set price alert" />
        <EtButtonGroup.Item iconName="expand" onPress={() => {}} accessibilityLabel="Expand chart" />
      </EtButtonGroup>

      <View style={styles.codeBlock}>
        <EtText style={styles.codeText}>
          {`<EtButtonGroup>
  <EtButtonGroup.Item
    iconName="priceAlert"
    onPress={handlePriceAlert}
    accessibilityLabel="Set price alert"
  />
  <EtButtonGroup.Item
    iconName="expand"
    onPress={handleExpand}
    accessibilityLabel="Expand chart"
  />
</EtButtonGroup>`}
        </EtText>
      </View>
    </View>
  ),
};

/**
 * Multiple button groups in a row
 */
export const MultipleGroups: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Multiple Groups
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Multiple button groups can be placed side by side
      </EtText>

      <View style={styles.row}>
        <EtButtonGroup>
          <EtButtonGroup.Item iconName="priceAlert" onPress={() => {}} />
          <EtButtonGroup.Item iconName="expand" onPress={() => {}} />
        </EtButtonGroup>

        <EtButtonGroup>
          <EtButtonGroup.Item iconName="plus" onPress={() => {}} />
          <EtButtonGroup.Item iconName="minus" onPress={() => {}} />
        </EtButtonGroup>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    paddingVertical: X4, // 16px
    paddingBottom: X10, // 40px
  },
  showcase: {
    gap: X4, // 16px
    paddingHorizontal: X4, // 16px
  },
  sectionTitle: {
    marginBottom: X1, // 4px
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: X3, // 12px
  },
  column: {
    gap: X2, // 8px
  },
  row: {
    flexDirection: 'row',
    gap: X4, // 16px
    alignItems: 'center',
  },
  marginTop: {
    marginTop: X4, // 16px
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: X2, // 8px
    padding: X3, // 12px
    marginTop: X4, // 16px
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: X3, // 12px
    lineHeight: 18,
  },
});
