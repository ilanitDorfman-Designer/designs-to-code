import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { EtBlurredText, EtText } from 'etoro-ui';

type Story = StoryObj<typeof EtBlurredText>;

const VARIANT_OPTIONS = [
  'display-hero',
  'display-main',
  'heading-large',
  'heading-base',
  'heading-compact',
  'body-base-regular',
  'body-base-medium',
  'body-base-semibold',
  'body-secondary-regular',
  'body-secondary-medium',
  'body-secondary-semibold',
  'body-tiny-regular',
  'body-tiny-medium',
  'label-primary-regular',
  'label-primary-semibold',
  'label-primary-bold',
  'label-secondary-regular',
  'label-secondary-semibold',
  'label-secondary-bold',
  'label-tertiary-regular',
  'label-tertiary-semibold',
  'label-tertiary-bold',
  'caption-regular',
  'caption-medium',
];

/**
 * Stand-ins for the lorem-ipsum filler that the API returns for users
 * without access to the gated content. The visual purpose is to convey
 * "there's content here, you just can't see it", so the strings are
 * shaped like real content (rating verdicts, descriptions, prices) but
 * carry no information.
 */
const FILLER_VERDICT = 'MODERATE BUY';
const FILLER_DESCRIPTION = 'Strong momentum signals with elevated volatility across the past four sessions.';
const FILLER_DESCRIPTION_LONG = 'Wrapping handled by the native text engine, with the Skia overlay drawing line-by-line.';

const meta: Meta<typeof EtBlurredText> = {
  title: 'eToro-UI/Foundations/Typography/EtBlurredText',
  component: EtBlurredText,
  parameters: {
    notes:
      'Skia-rendered text with a Gaussian blur mask filter on the glyphs. Used to gate an unauthorized value behind an unreadable placeholder — the API returns lorem-ipsum-style filler for users without access, and this component blurs that filler. Children are decorative filler; accessibilityLabel must describe the GATING STATE, never the children. Visual effect only — not a redaction primitive for sensitive data.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANT_OPTIONS,
    },
    color: {
      control: 'color',
    },
    accessibilityLabel: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;

export const Interactive: Story = {
  args: {
    variant: 'body-base-regular',
    children: FILLER_VERDICT,
    accessibilityLabel: 'Locked, eToro Club required to view the rating',
  },
};

export const Variants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Variants
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        The variant union matches `EtText` — typeface, size, weight, and color token all carry through. Children in every example would be
        lorem-ipsum-style filler in production; only `accessibilityLabel` carries semantic meaning.
      </EtText>

      <View style={styles.variantGrid}>
        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Display / Heading
          </EtText>
          <EtBlurredText variant="display-main" accessibilityLabel="Locked, eToro Club required to view the price">
            $-,---.--
          </EtBlurredText>
          <EtBlurredText variant="heading-large" accessibilityLabel="Locked, eToro Club required">
            Heading Large
          </EtBlurredText>
          <EtBlurredText variant="heading-base" accessibilityLabel="Locked, eToro Club required">
            Heading Base
          </EtBlurredText>
        </View>

        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Body
          </EtText>
          <EtBlurredText variant="body-base-regular" accessibilityLabel="Locked, eToro Club required">
            Body Base Regular
          </EtBlurredText>
          <EtBlurredText variant="body-base-semibold" accessibilityLabel="Locked, eToro Club required">
            Body Base Semibold
          </EtBlurredText>
          <EtBlurredText variant="body-secondary-regular" accessibilityLabel="Locked, eToro Club required">
            Body Secondary Regular
          </EtBlurredText>
          <EtBlurredText variant="body-tiny-regular" accessibilityLabel="Locked, eToro Club required">
            Body Tiny Regular
          </EtBlurredText>
        </View>

        <View style={styles.variantSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Label / Caption
          </EtText>
          <EtBlurredText variant="label-secondary-semibold" accessibilityLabel="Locked, eToro Club required to view the rating">
            {FILLER_VERDICT}
          </EtBlurredText>
          <EtBlurredText variant="label-secondary-bold" accessibilityLabel="Locked, eToro Club required to view the rating">
            STRONG BUY
          </EtBlurredText>
          <EtBlurredText variant="caption-regular" accessibilityLabel="Locked, eToro Club required">
            updated 2m ago
          </EtBlurredText>
        </View>
      </View>
    </View>
  ),
};

export const MultiLine: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Multi-line wrapping
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Wrapping is driven by RN's native text engine; the Skia overlay replays each line at the same `(x, baseline)`.
      </EtText>

      <View style={styles.multilineContainer}>
        <EtBlurredText variant="body-secondary-regular" accessibilityLabel="Locked, eToro Club required to view the analysis">
          {FILLER_DESCRIPTION}
        </EtBlurredText>
      </View>

      <View style={[styles.multilineContainer, styles.multilineNarrow]}>
        <EtText variant="caption-medium" style={styles.scaleLabel}>
          Narrow container (180px)
        </EtText>
        <EtBlurredText variant="body-base-regular" accessibilityLabel="Locked, eToro Club required to view the analysis">
          {FILLER_DESCRIPTION_LONG}
        </EtBlurredText>
      </View>
    </View>
  ),
};

export const ColorOverride: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Color override
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Pass `color` to override the variant's default fill. The blur mask uses the same color.
      </EtText>

      <View style={styles.colorGrid}>
        <View style={styles.scaleRow}>
          <EtText variant="caption-medium" style={styles.scaleLabel}>
            Default (variant color)
          </EtText>
          <EtBlurredText variant="body-base-semibold" accessibilityLabel="Locked, eToro Club required">
            $-,---.--
          </EtBlurredText>
        </View>
        <View style={styles.scaleRow}>
          <EtText variant="caption-medium" style={styles.scaleLabel}>
            Brand accent
          </EtText>
          <EtBlurredText variant="body-base-semibold" color="#37b06f" accessibilityLabel="Locked, eToro Club required">
            $-,---.--
          </EtBlurredText>
        </View>
        <View style={styles.scaleRow}>
          <EtText variant="caption-medium" style={styles.scaleLabel}>
            Loss red
          </EtText>
          <EtBlurredText variant="body-base-semibold" color="#e54839" accessibilityLabel="Locked, eToro Club required">
            -$-,---.--
          </EtBlurredText>
        </View>
      </View>
    </View>
  ),
};

export const DefaultAccessibilityLabel: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Default accessibilityLabel
      </EtText>
      <EtText variant="body-secondary-regular" style={styles.subtitle}>
        Omitting `accessibilityLabel` reads the localized `uiKit:blurredText.accessibility.lockedContent` fallback so a missed prop isn't a
        screen-reader gap. Feature copy that names *why* the value is gated should still be passed explicitly — never pass the children string.
      </EtText>

      <View style={styles.rowGrid}>
        <View style={styles.scaleRow}>
          <EtText variant="caption-medium" style={styles.scaleLabel}>
            With explicit label (preferred)
          </EtText>
          <EtBlurredText variant="body-base-regular" accessibilityLabel="Locked, eToro Club required to view the rating">
            {FILLER_VERDICT}
          </EtBlurredText>
        </View>
        <View style={styles.scaleRow}>
          <EtText variant="caption-medium" style={styles.scaleLabel}>
            Without label (falls back to localized "Locked content")
          </EtText>
          <EtBlurredText variant="body-base-regular">{FILLER_VERDICT}</EtBlurredText>
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  rowGrid: {
    gap: 16,
    width: '100%',
  },
  scaleRow: {
    gap: 6,
  },
  scaleLabel: {
    opacity: 0.6,
  },
  variantGrid: {
    gap: 20,
    width: '100%',
  },
  variantSection: {
    gap: 8,
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 4,
    opacity: 0.8,
  },
  multilineContainer: {
    gap: 6,
    width: '100%',
  },
  multilineNarrow: {
    width: 180,
  },
  colorGrid: {
    gap: 16,
    width: '100%',
  },
});
