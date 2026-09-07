import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtButton, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (code: string) => {
    Clipboard.setStringAsync(code);
    Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
  };

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralPrimary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={styles.codeHeader}>
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <Text style={[styles.copyButtonText, { color: colors.actionBrandText }]}>Copy</Text>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Button/EtButton/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtButton component with live examples.',
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
    const [loading, setLoading] = useState(false);
    const [failingLoading, setFailingLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleFailingAsyncAction = () => {
      setFailingLoading(true);
      const timeout = setTimeout(() => {
        setFailingLoading(false);
        setError(true);
        const timeout2 = setTimeout(() => {
          setError(false);
        }, 2000);
        return () => {
          clearTimeout(timeout2);
        };
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    };
    const handleAsyncAction = () => {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
        return () => {
          clearTimeout(timeout);
        };
      }, 2000);
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            🔘 EtButton
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Flexible button component with variants, sizes, and loading states
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText style={styles.featureText}>• Multiple variants (primary-filled, info-filled, negative-filled, subtle, ghost)</EtText>
          <EtText style={styles.featureText}>• Size options (tiny, small, medium, large)</EtText>
          <EtText style={styles.featureText}>• Loading states with spinner</EtText>
          <EtText style={styles.featureText}>• Disabled states</EtText>
          <EtText style={styles.featureText}>• Text clipping and truncation with ellipsis modes</EtText>
          <EtText style={styles.featureText}>• Icon support via EtButton.Icon subcomponent</EtText>
          <EtText style={styles.featureText}>• Full width (stretch prop) and disabled states</EtText>
          <EtText style={styles.featureText}>• Compositional API with EtButton.Label and EtButton.Icon</EtText>
          <EtText style={styles.featureText}>• String shorthand support (auto-wrapped in Label)</EtText>
        </View>

        <View style={styles.buttonGrid}>
          <EtButton variant="primary-filled" onPress={() => {}}>
            <EtButton.Label>Primary</EtButton.Label>
          </EtButton>
          <EtButton variant="info-filled" onPress={() => {}}>
            <EtButton.Label>Info</EtButton.Label>
          </EtButton>
          <EtButton variant="primary-subtle" onPress={() => {}}>
            <EtButton.Label>Subtle</EtButton.Label>
          </EtButton>
          <EtButton variant="primary-ghost" onPress={() => {}}>
            <EtButton.Label>Ghost</EtButton.Label>
          </EtButton>
        </View>
        <CodeBlock
          title="Basic Variants"
          code={`<EtButton variant="primary-filled" onPress={() => {}}>Primary</EtButton>
<EtButton variant="info-filled" onPress={() => {}}>Info</EtButton>
<EtButton variant="primary-subtle" onPress={() => {}}>Subtle</EtButton>
<EtButton variant="primary-ghost" onPress={() => {}}>Ghost</EtButton>`}
        ></CodeBlock>

        <View style={styles.buttonGrid}>
          <EtButton size="small" onPress={() => {}}>
            <EtButton.Label>Small</EtButton.Label>
          </EtButton>
          <EtButton size="medium" onPress={() => {}}>
            <EtButton.Label>Medium</EtButton.Label>
          </EtButton>
          <EtButton size="large" onPress={() => {}}>
            <EtButton.Label>Large</EtButton.Label>
          </EtButton>
        </View>
        <CodeBlock
          title="Sizes"
          code={`<EtButton size="small" onPress={() => {}}>Small</EtButton>
<EtButton size="medium" onPress={() => {}}>Medium</EtButton>
<EtButton size="large" onPress={() => {}}>Large</EtButton>`}
        ></CodeBlock>

        <EtButton loading={loading} onPress={handleAsyncAction} style={{ alignSelf: 'center' }}>
          <EtButton.Label>{loading ? 'Processing' : 'Submit'}</EtButton.Label>
        </EtButton>
        <CodeBlock
          title="Loading State"
          code={`const [loading, setLoading] = useState(false);

const handleAsyncAction = () => {
  setLoading(true);
  setTimeout(() => setLoading(false), 2000);
};

<EtButton 
  loading={loading}
  onPress={handleAsyncAction}
>
  {loading ? 'Processing' : 'Submit'}
</EtButton>`}
        ></CodeBlock>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Error State with Shake Animation
          </EtText>
          <EtButton loading={failingLoading} onPress={handleFailingAsyncAction} style={{ alignSelf: 'center' }}>
            <EtButton.Label>{failingLoading ? 'Processing' : 'Fail Process'}</EtButton.Label>
          </EtButton>
        </View>
        <CodeBlock
          title="Error State"
          code={`<EtButton 
  onPress={handleRetry}
>
  Process Payment
</EtButton>`}
        ></CodeBlock>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Smooth State Transitions
          </EtText>
          <EtText style={styles.subtitle}>Watch the text fade and width animate smoothly</EtText>
          <EtButton loading={loading} onPress={handleAsyncAction} style={{ alignSelf: 'center' }}>
            <EtButton.Label>{loading ? 'Processing' : 'Process Payment'}</EtButton.Label>
          </EtButton>
        </View>
        <CodeBlock
          title="Smooth Transitions"
          code={`const [loading, setLoading] = useState(false);

<EtButton 
  loading={loading}
  onPress={handleAsyncAction}
>
  {loading ? 'Processing' : 'Process Payment'}
</EtButton>

// Automatically includes:
// • Loading state with spinner
// • Press feedback
// • Disabled state handling`}
        ></CodeBlock>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Text Clipping
          </EtText>
          <EtText style={styles.subtitle}>Long text automatically truncates with ellipsis</EtText>
          <View style={styles.clippingDemo}>
            <EtButton onPress={() => {}}>
              <EtButton.Label numberOfLines={1} ellipsizeMode="tail">
                Process Very Long Payment Transaction
              </EtButton.Label>
            </EtButton>
          </View>
        </View>
        <CodeBlock
          title="Text Clipping"
          code={`<EtButton onPress={() => {}}>
  <EtButton.Label numberOfLines={1} ellipsizeMode="tail">
    Process Very Long Payment Transaction
  </EtButton.Label>
</EtButton>`}
        ></CodeBlock>

        <EtButton variant="primary-filled" stretch onPress={() => {}}>
          <EtButton.Label>Full Width Button</EtButton.Label>
        </EtButton>
        <CodeBlock
          title="Full Width"
          code={`<EtButton 
  variant="primary-filled"
  stretch
  onPress={() => {}}
>
  Full Width Button
</EtButton>`}
        ></CodeBlock>

        <View style={styles.buttonGrid}>
          <EtButton disabled onPress={() => {}}>
            <EtButton.Label>Disabled</EtButton.Label>
          </EtButton>
          <EtButton variant="negative-filled" onPress={() => {}}>
            <EtButton.Label>Error</EtButton.Label>
          </EtButton>
          <EtButton loading disabled onPress={() => {}}>
            <EtButton.Label>Loading Disabled</EtButton.Label>
          </EtButton>
        </View>
        <CodeBlock
          title="States"
          code={`<EtButton disabled onPress={() => {}}>Disabled</EtButton>
<EtButton variant="negative-filled" onPress={() => {}}>Error</EtButton>
<EtButton loading disabled onPress={() => {}}>Loading Disabled</EtButton>`}
        ></CodeBlock>

        <View style={styles.realWorldExample}>
          <View style={styles.tradingButtons}>
            <EtButton variant="primary-filled" size="large" onPress={() => {}}>
              <EtButton.Label>Buy AAPL</EtButton.Label>
            </EtButton>
            <EtButton variant="info-filled" onPress={() => {}}>
              <EtButton.Label>Sell</EtButton.Label>
            </EtButton>
          </View>
          <View style={styles.formButtons}>
            <EtButton stretch onPress={() => {}}>
              <EtButton.Label>Save Changes</EtButton.Label>
            </EtButton>
            <EtButton variant="primary-ghost" onPress={() => {}}>
              <EtButton.Label>Cancel</EtButton.Label>
            </EtButton>
          </View>
        </View>
        <CodeBlock
          title="Real-World Examples"
          code={`// Trading interface
<EtButton 
  variant="primary-filled"
  size="large"
  onPress={() => {}}
>
  Buy AAPL
</EtButton>
<EtButton variant="info-filled" onPress={() => {}}>Sell</EtButton>

// Form actions with state management
<EtButton 
  stretch
  loading={saving}
  onPress={() => {}}
>
  Save Changes
</EtButton>
<EtButton variant="primary-ghost" onPress={() => {}}>Cancel</EtButton>`}
        ></CodeBlock>

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="EtButtonProps"
            code={`
interface EtButtonProps {
  variant?: ButtonVariant;           // 'primary-filled' | 'info-filled' | etc.
  size?: ButtonSize;                 // 'tiny' | 'small' | 'medium' | 'large'
  disabled?: boolean;                 // Non-interactive
  loading?: boolean;                  // Shows spinner
  stretch?: boolean;                  // Full width
  onPress?: () => void;               // Press handler
  style?: StyleProp<ViewStyle>;      // Container style
  children?: string |                 // String shorthand (auto-wrapped)
            ReactElement<EtButtonLabelProps> |
            ReactElement<EtButtonIconProps> |
            Array<...>;
}

// Subcomponents
<EtButton.Label numberOfLines={1} ellipsizeMode="tail">
  Button Text
</EtButton.Label>

<EtButton.Icon name="settings" appearance={{ size: 20, color: '...' }} />`}
          ></CodeBlock>
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
  demoSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  clippingDemo: {
    width: 200,
    alignItems: 'center',
  },
  exampleSection: {
    marginBottom: 32,
  },
  exampleTitle: {
    marginBottom: 16,
  },
  exampleDemo: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  codeBlock: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  realWorldExample: {
    gap: 16,
    width: '100%',
  },
  tradingButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  formButtons: {
    gap: 8,
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  // Code Block Styles
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
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
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
