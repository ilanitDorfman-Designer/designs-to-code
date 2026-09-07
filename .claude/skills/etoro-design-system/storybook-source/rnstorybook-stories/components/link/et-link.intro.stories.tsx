import type { Meta, StoryObj } from '@storybook/react-native';
import { EtLink, EtText } from 'etoro-ui';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtLink>;

const meta: Meta<typeof EtLink> = {
  title: 'eToro-UI/Components/Link/Introduction',
  component: EtLink,
  parameters: {
    notes: 'Introduction to the EtLink component',
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

export const Introduction: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-large">EtLink</EtText>

      <View style={styles.section}>
        <EtText variant="label-primary-semibold">Overview</EtText>
        <EtText variant="body-secondary-regular">
          EtLink is a link-style button component for text links and inline actions. It renders as styled text without background or border, ideal for
          inline links and secondary actions.
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="label-primary-semibold">When to use</EtText>
        <EtText variant="body-secondary-regular">
          • Inline text links (e.g., "Learn more", "View details"){'\n'}• Terms and policy links{'\n'}• Secondary actions that should appear as text
          {'\n'}• Navigation links within content
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="label-primary-semibold">When NOT to use</EtText>
        <EtText variant="body-secondary-regular">
          • Primary actions (use EtButton instead){'\n'}• Icon-only buttons (use EtButton with EtButton.Icon instead){'\n'}• Navigation in headers
          (use EtHeader actions)
        </EtText>
      </View>

      <View style={styles.section}>
        <EtText variant="label-primary-semibold">Basic Example</EtText>
        <View style={styles.exampleBox}>
          <EtLink onPress={() => {}}>Learn more</EtLink>
        </View>
      </View>

      <View style={styles.section}>
        <EtText variant="label-primary-semibold">Variants</EtText>
        <View style={styles.exampleBox}>
          <View style={styles.row}>
            <EtLink variant="primary" onPress={() => {}}>
              Primary
            </EtLink>
            <EtLink variant="info" onPress={() => {}}>
              Info
            </EtLink>
            <EtLink variant="negative" onPress={() => {}}>
              Negative
            </EtLink>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <EtText variant="label-primary-semibold">With Icon</EtText>
        <View style={styles.exampleBox}>
          <EtLink onPress={() => {}}>
            <EtLink.Label>View details</EtLink.Label>
            <EtLink.Icon name="chevronRight" />
          </EtLink>
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  showcase: {
    gap: 24,
    paddingHorizontal: 16,
  },
  section: {
    gap: 8,
  },
  exampleBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
});
