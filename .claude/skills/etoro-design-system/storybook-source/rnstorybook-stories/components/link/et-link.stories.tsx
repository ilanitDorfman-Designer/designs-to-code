import type { Meta, StoryObj } from '@storybook/react-native';
import { EtLink, EtText, type LinkSize, type LinkVariant } from 'etoro-ui';
import { ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtLink>;

const meta: Meta<typeof EtLink> = {
  title: 'eToro-UI/Components/Link/EtLink',
  component: EtLink,
  parameters: {
    notes: 'Link-style button for text links and inline actions without background/border.',
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

// All variants and sizes for the matrix
const variants: LinkVariant[] = ['primary', 'info', 'negative'];
const sizes: LinkSize[] = ['small', 'medium', 'large'];

/**
 * Complete matrix of variants and sizes
 */
export const VariantSizeMatrix: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Variant × Size Matrix
      </EtText>

      {/* Header row */}
      <View style={styles.matrixRow}>
        <View style={styles.matrixLabelCell} />
        {sizes.map((size) => (
          <View key={size} style={styles.matrixHeaderCell}>
            <EtText variant="label-tertiary-bold">{size}</EtText>
          </View>
        ))}
      </View>

      {/* Variant rows */}
      {variants.map((variant) => (
        <View key={variant} style={styles.matrixRow}>
          <View style={styles.matrixLabelCell}>
            <EtText variant="caption-medium">{variant}</EtText>
          </View>
          {sizes.map((size) => (
            <View key={`${variant}-${size}`} style={styles.matrixCell}>
              <EtLink variant={variant} size={size} onPress={() => {}}>
                Label
              </EtLink>
            </View>
          ))}
        </View>
      ))}

      {/* With icons */}
      <EtText variant="label-primary-semibold" style={styles.groupTitle}>
        With Icons
      </EtText>
      {variants.map((variant) => (
        <View key={`${variant}-icon`} style={styles.matrixRow}>
          <View style={styles.matrixLabelCell}>
            <EtText variant="caption-medium">{variant}</EtText>
          </View>
          {sizes.map((size) => (
            <View key={`${variant}-${size}-icon`} style={styles.matrixCell}>
              <EtLink variant={variant} size={size} onPress={() => {}}>
                <EtLink.Label>Label</EtLink.Label>
                <EtLink.Icon name="chevronRight" />
              </EtLink>
            </View>
          ))}
        </View>
      ))}
    </View>
  ),
};

/**
 * Compositional Link API - use subcomponents
 */
export const LinkAPI: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Link API
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Use EtLink.Label and EtLink.Icon for explicit composition
      </EtText>

      <View style={styles.column}>
        <EtText variant="label-secondary-semibold">Icon on the right:</EtText>
        <EtLink onPress={() => {}}>
          <EtLink.Label>View details</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>
        <View style={styles.codeBlock}>
          <EtText style={styles.codeText}>
            {`<EtLink onPress={() => {}}>
  <EtLink.Label>View details</EtLink.Label>
  <EtLink.Icon name="chevronRight" />
</EtLink>`}
          </EtText>
        </View>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          Icon on the left:
        </EtText>
        <EtLink onPress={() => {}} variant="info">
          <EtLink.Icon name="share" />
          <EtLink.Label>Open in browser</EtLink.Label>
        </EtLink>
        <View style={styles.codeBlock}>
          <EtText style={styles.codeText}>
            {`<EtLink onPress={() => {}} variant="info">
  <EtLink.Icon name="share" />
  <EtLink.Label>Open in browser</EtLink.Label>
</EtLink>`}
          </EtText>
        </View>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          Text only (shorthand):
        </EtText>
        <EtLink onPress={() => {}}>Learn more</EtLink>
        <View style={styles.codeBlock}>
          <EtText style={styles.codeText}>
            {`<EtLink onPress={() => {}}>
  Learn more
</EtLink>`}
          </EtText>
        </View>
      </View>
    </View>
  ),
};

/**
 * Link states
 */
export const States: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Link States
      </EtText>

      <View style={styles.statesGrid}>
        <View style={styles.stateColumn}>
          <EtText variant="label-secondary-semibold">Normal</EtText>
          <EtLink onPress={() => {}}>Normal</EtLink>
        </View>

        <View style={styles.stateColumn}>
          <EtText variant="label-secondary-semibold">Disabled</EtText>
          <EtLink disabled onPress={() => {}}>
            Disabled
          </EtLink>
        </View>
      </View>

      {/* Disabled states for all variants */}
      <EtText variant="label-primary-semibold" style={styles.groupTitle}>
        Disabled States
      </EtText>
      <View style={styles.row}>
        <EtLink variant="primary" disabled onPress={() => {}}>
          Primary
        </EtLink>
        <EtLink variant="info" disabled onPress={() => {}}>
          Info
        </EtLink>
        <EtLink variant="negative" disabled onPress={() => {}}>
          Negative
        </EtLink>
      </View>
    </View>
  ),
};

/**
 * Press animation demonstration
 */
export const PressAnimation: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Press Animation
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Press and hold to see the scale animation (scales to 0.95 with spring effect)
      </EtText>

      <View style={styles.animationDemo}>
        <View style={styles.animationItem}>
          <EtText variant="label-secondary-semibold">Primary</EtText>
          <EtLink variant="primary" size="large" onPress={() => {}}>
            <EtLink.Label>Press me</EtLink.Label>
            <EtLink.Icon name="chevronRight" />
          </EtLink>
        </View>

        <View style={styles.animationItem}>
          <EtText variant="label-secondary-semibold">Info</EtText>
          <EtLink variant="info" size="large" onPress={() => {}}>
            <EtLink.Label>Press me</EtLink.Label>
            <EtLink.Icon name="chevronRight" />
          </EtLink>
        </View>

        <View style={styles.animationItem}>
          <EtText variant="label-secondary-semibold">Negative</EtText>
          <EtLink variant="negative" size="large" onPress={() => {}}>
            <EtLink.Label>Press me</EtLink.Label>
            <EtLink.Icon name="chevronRight" />
          </EtLink>
        </View>
      </View>

      <EtText variant="label-primary-semibold" style={styles.groupTitle}>
        Animation Details
      </EtText>
      <View style={styles.codeBlock}>
        <EtText style={styles.codeText}>
          {`Scale animation on press:
• Pressed: scale(0.95)
• Released: scale(1)
• Spring config: damping=15, stiffness=300
• Disabled links: no animation`}
        </EtText>
      </View>

      <EtText variant="label-primary-semibold" style={styles.groupTitle}>
        Disabled (No Animation)
      </EtText>
      <EtLink disabled size="large" onPress={() => {}}>
        <EtLink.Label>Disabled - no animation</EtLink.Label>
      </EtLink>
    </View>
  ),
};

/**
 * Loading state demonstration
 */
export const LoadingState: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Loading State
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        The loader appears on the side where the icon would be (or leading if no icon)
      </EtText>

      <View style={styles.column}>
        <EtText variant="label-secondary-semibold">Text only (loader on left):</EtText>
        <EtLink loading onPress={() => {}}>
          Loading...
        </EtLink>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          With trailing icon (loader replaces icon on right):
        </EtText>
        <EtLink loading onPress={() => {}}>
          <EtLink.Label>Submitting</EtLink.Label>
          <EtLink.Icon name="chevronRight" />
        </EtLink>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          With leading icon (loader replaces icon on left):
        </EtText>
        <EtLink loading variant="info" onPress={() => {}}>
          <EtLink.Icon name="share" />
          <EtLink.Label>Opening...</EtLink.Label>
        </EtLink>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          All variants loading:
        </EtText>
        <View style={styles.row}>
          <EtLink variant="primary" loading onPress={() => {}}>
            Primary
          </EtLink>
          <EtLink variant="info" loading onPress={() => {}}>
            Info
          </EtLink>
          <EtLink variant="negative" loading onPress={() => {}}>
            Negative
          </EtLink>
        </View>

        <EtText variant="label-secondary-semibold" style={{ marginTop: 16 }}>
          All sizes loading:
        </EtText>
        <View style={styles.row}>
          <EtLink size="small" loading onPress={() => {}}>
            Small
          </EtLink>
          <EtLink size="medium" loading onPress={() => {}}>
            Medium
          </EtLink>
          <EtLink size="large" loading onPress={() => {}}>
            Large
          </EtLink>
        </View>
      </View>
    </View>
  ),
};

/**
 * Inline text usage example
 */
export const InlineUsage: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Inline Usage
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Links work inline with text
      </EtText>

      <View style={styles.inlineContainer}>
        <EtText variant="body-secondary-regular">By continuing, you agree to our </EtText>
        <EtLink size="medium" onPress={() => {}}>
          Terms of Service
        </EtLink>
        <EtText variant="body-secondary-regular"> and </EtText>
        <EtLink size="medium" onPress={() => {}}>
          Privacy Policy
        </EtLink>
        <EtText variant="body-secondary-regular">.</EtText>
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
    gap: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 12,
  },
  groupTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
  },
  column: {
    gap: 12,
    alignItems: 'flex-start',
  },
  statesGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  stateColumn: {
    gap: 8,
    alignItems: 'center',
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  matrixLabelCell: {
    width: 80,
    paddingRight: 8,
  },
  matrixHeaderCell: {
    width: 100,
    alignItems: 'center',
  },
  matrixCell: {
    width: 100,
    alignItems: 'center',
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    width: '100%',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  inlineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  animationDemo: {
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  animationItem: {
    alignItems: 'center',
    gap: 12,
  },
});
