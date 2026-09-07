import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtStory, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import type { ViewStyle } from 'react-native';

type Story = StoryObj<{}>;

// Theme-aware card component
function DemoCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { colors } = useEtoroTheme();
  return <View style={[styles.demoCard, { backgroundColor: colors.bgNeutralSecondary }, style]}>{children}</View>;
}
DemoCard.displayName = 'DemoCard';

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = async (code: string) => {
    try {
      await Clipboard.setStringAsync(code);
      Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
    } catch {
      Alert.alert('Copy Failed', 'Failed to copy code to clipboard', [{ text: 'OK' }]);
    }
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
CodeBlock.displayName = 'CodeBlock';

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/EtStory/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtStory component with live examples.',
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
    const [watched, setWatched] = useState(true);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtStory
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Circular instrument avatar with watched state indicator
          </EtText>
        </View>

        <DemoCard>
          <EtText variant="body-base-regular" style={styles.noteText}>
            The EtStory component displays a circular avatar for instruments or users. Unwatched stories show a green ring border; watched stories
            have no ring. It's designed for horizontal scrollable story lists. The component supports press interaction and requires an EtStory.Label
            subcomponent for the label text.
          </EtText>
        </DemoCard>

        <DemoCard>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Features
          </EtText>
          <View style={styles.features}>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Circular avatar (56x56px) with instrument image
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Unwatched state with green ring border (64x64px)
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Label text below avatar (e.g., "TSLA")
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Optional press interaction
            </EtText>
            <EtText variant="body-base-regular" style={styles.featureText}>
              • Compound component pattern: EtStory.Label
            </EtText>
          </View>
        </DemoCard>

        <DemoCard>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Default Variant (User)
          </EtText>
          <View style={styles.demoRow}>
            <EtStory imageSource="https://randomuser.me/api/portraits/women/44.jpg" onPress={() => console.log('Story pressed')}>
              <EtStory.Label>Sarah</EtStory.Label>
            </EtStory>
          </View>
          <CodeBlock
            title="Default (User) Story"
            code={`<EtStory
  imageSource="https://randomuser.me/api/portraits/women/44.jpg"
  onPress={() => console.log('Story pressed')}
>
  <EtStory.Label>Sarah</EtStory.Label>
</EtStory>`}
          />
        </DemoCard>

        <DemoCard>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Instrument Variant
          </EtText>
          <View style={styles.demoRow}>
            <EtStory
              imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png"
              variant="instrument"
              onPress={() => console.log('Story pressed')}
            >
              <EtStory.Label>AAPL</EtStory.Label>
            </EtStory>
          </View>
          <CodeBlock
            title="Instrument Story"
            code={`<EtStory
  imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png"
  variant="instrument"
  onPress={() => console.log('Story pressed')}
>
  <EtStory.Label>AAPL</EtStory.Label>
</EtStory>`}
          />
        </DemoCard>

        <DemoCard>
          <EtText variant="heading-base" style={styles.demoTitle}>
            Watched State
          </EtText>
          <View style={styles.demoRow}>
            <EtStory
              imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png"
              variant="instrument"
              watched={watched}
              onPress={() => setWatched(!watched)}
            >
              <EtStory.Label>AAPL</EtStory.Label>
            </EtStory>
          </View>
          <EtText variant="body-secondary-regular" style={styles.valueLabel}>
            Watched: {String(watched)} (tap to toggle)
          </EtText>
          <CodeBlock
            title="Watched State"
            code={`const [watched, setWatched] = useState(true);

<EtStory
  imageSource="https://etoro-cdn.etorostatic.com/market-avatars/aapl/150x150.png"
  variant="instrument"
  watched={watched}
  onPress={() => setWatched(!watched)}
>
  <EtStory.Label>AAPL</EtStory.Label>
</EtStory>`}
          />
        </DemoCard>

        <DemoCard>
          <EtText variant="heading-base" style={styles.demoTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtStoryProps"
            code={`interface EtStoryProps {
  /** Image source URL for the avatar */
  imageSource: string;
  /** Story variant - 'instrument' shows gradient overlay, 'default' shows no overlay */
  variant?: 'default' | 'instrument';
  /** Shows green ring when false (unwatched) */
  watched?: boolean;
  /** Shows animated loading ring - takes precedence over watched */
  loading?: boolean;
  /** Callback when story is pressed */
  onPress?: () => void;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Children must contain EtStory.Label */
  children: ReactNode;
}`}
          />
        </DemoCard>
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
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoTitle: {
    marginBottom: 8,
  },
  features: {
    gap: 8,
  },
  featureText: {
    opacity: 0.8,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  valueLabel: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
  noteText: {
    opacity: 0.8,
    lineHeight: 20,
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
