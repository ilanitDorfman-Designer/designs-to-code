import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAvatar, EtBadge, EtCheckbox, EtListItemV2, EtText, EtToggleSwitch } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (text: string) => {
    Clipboard.setStringAsync(text);
    Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
  };

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
        <View style={styles.codeHeader}>
          <EtText variant="label-primary-semibold" style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>
            {title}
          </EtText>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <EtText variant="label-tertiary-regular" style={[styles.copyButtonText, { color: colors.actionBrandText }]}>
              Copy
            </EtText>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <EtText variant="body-base-regular" style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>
          {code}
        </EtText>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/List/EtListItemV2/\u{1F4D6} Introduction',
  parameters: {
    notes: 'Complete documentation and usage guide for the EtListItemV2 component.',
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
    const [selected, setSelected] = useState('usd');
    const [toggleValue, setToggleValue] = useState(false);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtListItemV2
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Slot-based list item with automatic layout detection
          </EtText>
        </View>

        {/* Features */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Features
          </EtText>
          <View style={styles.features}>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Slot-based layout: Start / Middle / End compound components
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Auto-detection: layout adjusts based on which slots are present
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Two sizes: large (16px padding) and small (12px padding)
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Optional divider separator between items
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Four skeleton loading variants with shimmer animation
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Full dark / light mode support via useEtoroTheme
            </EtText>
          </View>
        </View>

        {/* Theme Support */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Theme Support
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            EtListItemV2 automatically adapts to the current theme. The divider color, skeleton shimmer colors, and background all respond to light
            and dark mode through useEtoroTheme. Switch the app theme to see all stories update in real-time.
          </EtText>
        </View>

        {/* Start Only Demo */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Start Only Layout
          </EtText>
          <View style={[styles.demoArea, { borderColor: colors.dividerPrimary }]}>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <EtText variant="label-primary-semibold">Centered content (Start only)</EtText>
              </EtListItemV2.Start>
            </EtListItemV2>
          </View>
          <CodeBlock
            title="Start Only"
            code={`<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">
      Centered content (Start only)
    </EtText>
  </EtListItemV2.Start>
</EtListItemV2>`}
          />
        </View>

        {/* Start + End Demo */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Start + End Layout
          </EtText>
          <View style={[styles.demoArea, { borderColor: colors.dividerPrimary }]}>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="circle">
                    <EtAvatar.Fallback>EC</EtAvatar.Fallback>
                  </EtAvatar>
                  <View>
                    <EtText variant="label-primary-semibold">Emma Collins</EtText>
                    <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      @emmacollins
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <EtText variant="label-primary-semibold">36.5K</EtText>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          </View>
          <CodeBlock
            title="Start + End"
            code={`<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <EtAvatar size="medium" shape="circle">
        <EtAvatar.Fallback>EC</EtAvatar.Fallback>
      </EtAvatar>
      <View>
        <EtText variant="label-primary-semibold">Emma Collins</EtText>
        <EtText variant="label-tertiary-regular">@emmacollins</EtText>
      </View>
    </View>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">36.5K</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </View>

        {/* 3-Column Demo */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Start + Middle + End (3-Column)
          </EtText>
          <View style={[styles.demoArea, { borderColor: colors.dividerPrimary }]}>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <EtAvatar size="medium" shape="square" variant="instrument">
                    <EtAvatar.Fallback>B</EtAvatar.Fallback>
                  </EtAvatar>
                  <View>
                    <EtText variant="label-primary-semibold">BTC</EtText>
                    <EtText variant="label-tertiary-regular" style={{ color: colors.textSecondaryNeutral }}>
                      Bitcoin
                    </EtText>
                  </View>
                </View>
              </EtListItemV2.Start>
              <EtListItemV2.Middle>
                <EtBadge color="neutral" size="small">
                  <EtBadge.Label>Edited</EtBadge.Label>
                </EtBadge>
              </EtListItemV2.Middle>
              <EtListItemV2.End>
                <View>
                  <EtText variant="label-primary-semibold" style={{ textAlign: 'right' }}>
                    $186.79
                  </EtText>
                  <EtText variant="label-tertiary-regular" style={{ color: colors.statusPositive, textAlign: 'right' }}>
                    1.95 (+1.03%)
                  </EtText>
                </View>
              </EtListItemV2.End>
              <EtListItemV2.Divider />
            </EtListItemV2>
          </View>
          <CodeBlock
            title="3-Column Layout"
            code={`<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">BTC</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.Middle>
    <EtBadge color="neutral" size="small">
      <EtBadge.Label>Edited</EtBadge.Label>
    </EtBadge>
  </EtListItemV2.Middle>
  <EtListItemV2.End>
    <EtText variant="label-primary-semibold">$186.79</EtText>
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </View>

        {/* Single Select Demo */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Single Select (Checkbox)
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Selected: {selected.toUpperCase()}
          </EtText>
          <View style={[styles.demoArea, { borderColor: colors.dividerPrimary }]}>
            {(['usd', 'eur', 'gbp'] as const).map((key) => (
              <EtListItemV2 key={key} size="large">
                <EtListItemV2.Start>
                  <EtText variant="label-primary-semibold">
                    {key === 'usd' ? 'US Dollar (USD)' : key === 'eur' ? 'Euro (EUR)' : 'British Pound (GBP)'}
                  </EtText>
                </EtListItemV2.Start>
                <EtListItemV2.End>
                  <EtCheckbox variant="round" value={selected === key} onChange={() => setSelected(key)} />
                </EtListItemV2.End>
                <EtListItemV2.Divider />
              </EtListItemV2>
            ))}
          </View>
          <CodeBlock
            title="Single Select"
            code={`const [selected, setSelected] = useState('usd');

<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">US Dollar (USD)</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtCheckbox
      variant="round"
      value={selected === 'usd'}
      onChange={() => setSelected('usd')}
    />
  </EtListItemV2.End>
  <EtListItemV2.Divider />
</EtListItemV2>`}
          />
        </View>

        {/* Toggle Switch Demo */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Switch Toggle
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Value: {toggleValue ? 'ON' : 'OFF'}
          </EtText>
          <View style={[styles.demoArea, { borderColor: colors.dividerPrimary }]}>
            <EtListItemV2 size="large">
              <EtListItemV2.Start>
                <EtText variant="label-primary-semibold">Push Notifications</EtText>
              </EtListItemV2.Start>
              <EtListItemV2.End>
                <EtToggleSwitch value={toggleValue} onValueChange={setToggleValue} />
              </EtListItemV2.End>
            </EtListItemV2>
          </View>
          <CodeBlock
            title="Switch Toggle"
            code={`const [enabled, setEnabled] = useState(false);

<EtListItemV2 size="large">
  <EtListItemV2.Start>
    <EtText variant="label-primary-semibold">Push Notifications</EtText>
  </EtListItemV2.Start>
  <EtListItemV2.End>
    <EtToggleSwitch value={enabled} onValueChange={setEnabled} />
  </EtListItemV2.End>
</EtListItemV2>`}
          />
        </View>

        {/* Skeleton Loading Demo */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Skeleton Loading
          </EtText>
          <View style={[styles.demoArea, { borderColor: colors.dividerPrimary }]}>
            <EtListItemV2 size="large">
              <EtListItemV2.Skeleton variant="asset-2-lines" />
            </EtListItemV2>
            <EtListItemV2 size="large">
              <EtListItemV2.Skeleton variant="asset-2-lines" />
            </EtListItemV2>
            <EtListItemV2 size="large">
              <EtListItemV2.Skeleton variant="asset-2-lines" />
            </EtListItemV2>
          </View>
          <CodeBlock
            title="Skeleton"
            code={`// Variants: '1-line' | '2-lines' | 'asset-1-line' | 'asset-2-lines'
<EtListItemV2 size="large">
  <EtListItemV2.Skeleton variant="asset-2-lines" />
</EtListItemV2>`}
          />
        </View>

        {/* Layout Modes */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            Layout Modes
          </EtText>
          <View style={styles.features}>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Start only — Start takes full width (flex: 1), content centered
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Start + End — Start gets flex: 1, End sizes to content
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Start + Middle + End — all slots get equal width (flex: 1 each)
            </EtText>
          </View>
        </View>

        {/* API Reference */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.bgNeutralQuaternary,
              borderColor: colors.dividerPrimary,
            },
          ]}
        >
          <EtText variant="heading-base" style={styles.demoTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtListItemV2 Props"
            code={`interface EtListItemV2Props {
  size?: 'large' | 'small';        // Vertical padding (default: 'large')
  children?: ReactNode;             // Slot components (Start, Middle, End, Divider)
  style?: StyleProp<ViewStyle>;     // Container style override
  testID?: string;                  // Test ID
}

// Compound sub-components
<EtListItemV2.Start>     // Left slot
<EtListItemV2.Middle>    // Center slot (equal width)
<EtListItemV2.End>       // Right slot
<EtListItemV2.Divider /> // Hairline separator

// Skeleton loading (compound child, inherits size from parent)
<EtListItemV2 size="large">
  <EtListItemV2.Skeleton variant="asset-2-lines" />
</EtListItemV2>`}
          />
        </View>
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  demoCard: {
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  demoTitle: {
    marginBottom: 8,
  },
  demoArea: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  features: {
    gap: 8,
  },
  featureText: {
    opacity: 0.8,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
});
