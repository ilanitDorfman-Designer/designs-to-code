import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtListItem, EtText } from 'etoro-ui';
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

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/List/EtListItem/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtListItem component with live examples.',
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
    const [selectedItems, setSelectedItems] = useState(['notifications']);

    const toggleSelection = (item: string) => {
      setSelectedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            📋 EtListItem
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Versatile list item component with selection, icons, and multiple layouts
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText style={styles.featureText}>• Multiple layout variants (compact to spacious)</EtText>
          <EtText style={styles.featureText}>• Built-in checkbox selection</EtText>
          <EtText style={styles.featureText}>• Icon support with theme integration</EtText>
          <EtText style={styles.featureText}>• Visual states and dividers</EtText>
          <EtText style={styles.featureText}>• Full accessibility support</EtText>
        </View>

        <View style={styles.listDemo}>
          <EtListItem content={{ title: 'Settings' }} layout={{ divider: true }} />
          <EtListItem
            content={{
              title: 'Notifications',
              subtitle: 'Push notifications and alerts',
            }}
            layout={{ divider: true }}
          />
          <EtListItem content={{ title: 'Account' }} visual={{ leftIcon: 'user' }} interaction={{ onPress: () => {} }} />
        </View>
        <CodeBlock
          title="Basic Usage"
          code={`<EtListItem content={{ title: "Settings" }} />

<EtListItem 
  content={{ title: "Notifications", subtitle: "Push notifications and alerts" }}
/>

<EtListItem 
  content={{ title: "Account" }}
  visual={{ leftIcon: "user" }}
  interaction={{ onPress: () => navigate('Account') }}
/>`}
        ></CodeBlock>

        <View style={styles.listDemo}>
          <EtListItem
            content={{
              title: 'Notifications',
              subtitle: 'Push notifications and alerts',
            }}
            visual={{ leftIcon: 'notification' }}
            selection={{
              selectable: true,
              selected: selectedItems.includes('notifications'),
              onSelectionChange: () => toggleSelection('notifications'),
            }}
            layout={{ divider: true }}
          />
          <EtListItem
            content={{
              title: 'Privacy Settings',
              subtitle: 'Control data sharing',
            }}
            visual={{ leftIcon: 'privacy' }}
            selection={{
              selectable: true,
              selected: selectedItems.includes('privacy'),
              onSelectionChange: () => toggleSelection('privacy'),
            }}
          />
        </View>
        <CodeBlock
          title="Selectable Items"
          code={`const [selected, setSelected] = useState(['notifications']);

<EtListItem 
  content={{ title: "Notifications", subtitle: "Push notifications and alerts" }}
  visual={{ leftIcon: "notification" }}
  selection={{
    selectable: true,
    selected: selected.includes('notifications'),
    onSelectionChange: () => toggleSelection('notifications')
  }}
/>`}
        ></CodeBlock>

        <View style={styles.listDemo}>
          <EtListItem content={{ title: 'Compact Item' }} layout={{ variant: 'compact', divider: true }} />
          <EtListItem content={{ title: 'Default Item' }} layout={{ variant: 'default', divider: true }} />
          <EtListItem content={{ title: 'Comfortable Item' }} layout={{ variant: 'comfortable', divider: true }} />
          <EtListItem content={{ title: 'Spacious Item' }} layout={{ variant: 'spacious' }} />
        </View>
        <CodeBlock
          title="Layout Variants"
          code={`<EtListItem content={{ title: "Compact Item" }} layout={{ variant: "compact", divider: true }} />
<EtListItem content={{ title: "Default Item" }} layout={{ variant: "default", divider: true }} />
<EtListItem content={{ title: "Comfortable Item" }} layout={{ variant: "comfortable", divider: true }} />
<EtListItem content={{ title: "Spacious Item" }} layout={{ variant: "spacious" }} />`}
        ></CodeBlock>

        <View style={styles.listDemo}>
          <EtListItem
            content={{ title: 'Account', subtitle: 'Profile and preferences' }}
            visual={{ leftIcon: 'user' }}
            interaction={{ onPress: () => {} }}
            layout={{ divider: true }}
          />
          <EtListItem
            content={{
              title: 'Privacy',
              subtitle: 'Password and authentication',
            }}
            visual={{ leftIcon: 'privacy' }}
            interaction={{ onPress: () => {} }}
            layout={{ divider: true }}
          />
          <EtListItem
            content={{
              title: 'Notifications',
              subtitle: 'Push notifications and alerts',
            }}
            visual={{ leftIcon: 'notification' }}
            selection={{
              selectable: true,
              selected: selectedItems.includes('notifications'),
              onSelectionChange: () => toggleSelection('notifications'),
            }}
          />
        </View>
        <CodeBlock
          title="Real-World Example"
          code={`// Settings screen
const SettingsScreen = () => (
  <View>
    <EtListItem
      content={{ title: "Account", subtitle: "Profile and preferences" }}
      visual={{ leftIcon: "user" }}
      interaction={{ onPress: () => navigate('Account') }}
      layout={{ divider: true }}
    />
    <EtListItem
      content={{ title: "Security", subtitle: "Password and authentication" }}
      visual={{ leftIcon: "security" }}
      interaction={{ onPress: () => navigate('Security') }}
      layout={{ divider: true }}
    />
    <EtListItem
      content={{ title: "Notifications", subtitle: "Push notifications and alerts" }}
      visual={{ leftIcon: "notification" }}
      selection={{
        selectable: true,
        selected: settings.notifications,
        onSelectionChange: toggleNotifications
      }}
    />
  </View>
);`}
        ></CodeBlock>

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="EtListItemProps"
            code={`
interface EtListItemProps {
  content: {
    title: string;                    // Main text (required)
    subtitle?: string;                // Secondary text
  };
  visual?: {
    leftIcon?: string;                // EtoroIcon name
  };
  selection?: {
    selectable?: boolean;             // Shows checkbox
    selected?: boolean;               // Selection state
    onSelectionChange?: (selected: boolean) => void;
    checkboxPosition?: 'left' | 'right';
  };
  layout?: {
    variant?: 'compact' | 'default' | 'comfortable' | 'spacious';
    divider?: boolean;                // Bottom border
  };
  interaction?: {
    onPress?: () => void;             // Touch handler
    onLongPress?: () => void;         // Long press handler
    disabled?: boolean;               // Non-interactive
  };
}`}
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
  exampleSection: {
    marginBottom: 32,
  },
  exampleTitle: {
    marginBottom: 16,
  },
  exampleDemo: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  listDemo: {
    // Items will handle their own spacing
  },
  codeBlock: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
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
