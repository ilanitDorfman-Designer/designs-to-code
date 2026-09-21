import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtText, EtToggle } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';

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

const ExampleSection: React.FC<{
  title: string;
  code: string;
  children: React.ReactNode;
}> = ({ title, code, children }) => (
  <View style={styles.exampleSection}>
    <EtText variant="heading-compact" style={styles.exampleTitle}>
      {title}
    </EtText>
    <View style={styles.exampleDemo}>{children}</View>
    <CodeBlock code={code} title={title} />
  </View>
);

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Controls/EtToggle/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtToggle component with live examples.',
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
    const [basicToggle, setBasicToggle] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [privacy, setPrivacy] = useState(false);
    const [biometrics, setBiometrics] = useState(true);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            🔘 EtToggle
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Switch component for binary choices with customizable colors and sizes
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Three sizes (small, medium, large)
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Customizable track and thumb colors
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Disabled states with visual feedback
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Smooth animations and haptic feedback
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Full accessibility support
          </EtText>
        </View>

        <View style={styles.toggleRow}>
          <EtText variant="body-secondary-regular">Basic Toggle</EtText>
          <EtToggle value={basicToggle} onValueChange={setBasicToggle} lockWhileChanging={false} />
        </View>
        <CodeBlock
          title="Basic Usage"
          code={`const [enabled, setEnabled] = useState(false);

<EtToggle 
  value={enabled} 
  onValueChange={setEnabled} 
/>`}
        ></CodeBlock>

        <View style={styles.sizeDemo}>
          <View style={styles.toggleRow}>
            <EtText variant="body-secondary-regular">Small</EtText>
            <EtToggle size="small" value={basicToggle} onValueChange={setBasicToggle} lockWhileChanging={false} />
          </View>
          <View style={styles.toggleRow}>
            <EtText variant="body-secondary-regular">Medium</EtText>
            <EtToggle size="medium" value={basicToggle} onValueChange={setBasicToggle} lockWhileChanging={false} />
          </View>
          <View style={styles.toggleRow}>
            <EtText variant="body-secondary-regular">Large</EtText>
            <EtToggle size="large" value={basicToggle} onValueChange={setBasicToggle} lockWhileChanging={false} />
          </View>
        </View>
        <CodeBlock
          title="Toggle Sizes"
          code={`<EtToggle size="small" value={enabled} onValueChange={setEnabled} />
<EtToggle size="medium" value={enabled} onValueChange={setEnabled} />
<EtToggle size="large" value={enabled} onValueChange={setEnabled} />`}
        ></CodeBlock>

        <View style={styles.toggleRow}>
          <EtText variant="body-secondary-regular">Custom Colors</EtText>
          <EtToggle
            value={basicToggle}
            onValueChange={setBasicToggle}
            trackColorOn="#10B981"
            trackColorOff="#E5E7EB"
            thumbColor="#FFFFFF"
            lockWhileChanging={false}
          />
        </View>
        <CodeBlock
          title="Custom Colors"
          code={`<EtToggle 
  value={enabled}
  onValueChange={setEnabled}
  trackColorOn="#10B981"
  trackColorOff="#E5E7EB"
  thumbColor="#FFFFFF"
/>`}
        ></CodeBlock>

        <View style={styles.disabledDemo}>
          <View style={styles.toggleRow}>
            <EtText variant="body-secondary-regular" style={styles.disabledText}>
              Disabled (On)
            </EtText>
            <EtToggle value={true} disabled onValueChange={() => {}} lockWhileChanging={false} />
          </View>
          <View style={styles.toggleRow}>
            <EtText variant="body-secondary-regular" style={styles.disabledText}>
              Disabled (Off)
            </EtText>
            <EtToggle value={false} disabled onValueChange={() => {}} lockWhileChanging={false} />
          </View>
        </View>
        <CodeBlock
          title="Disabled State"
          code={`<EtToggle value={true} disabled onValueChange={() => {}} />
<EtToggle value={false} disabled onValueChange={() => {}} />`}
        ></CodeBlock>

        <View style={styles.settingsDemo}>
          <View style={styles.settingItem}>
            <EtText variant="body-secondary-regular">Push Notifications</EtText>
            <EtToggle value={notifications} onValueChange={setNotifications} lockWhileChanging={false} />
          </View>
          <View style={styles.settingItem}>
            <EtText variant="body-secondary-regular">Privacy Mode</EtText>
            <EtToggle value={privacy} onValueChange={setPrivacy} lockWhileChanging={false} />
          </View>
          <View style={styles.settingItem}>
            <EtText variant="body-secondary-regular">Biometric Login</EtText>
            <EtToggle value={biometrics} onValueChange={setBiometrics} lockWhileChanging={false} />
          </View>
        </View>

        <CodeBlock
          title="Settings Screen Example"
          code={`const [settings, setSettings] = useState({
  notifications: true,
  privacy: false,
  biometrics: true,
});

<View style={styles.settingsGroup}>
  <View style={styles.settingItem}>
    <EtText variant="body-secondary-regular">Push Notifications</EtText>
    <EtToggle 
      value={settings.notifications}
      onValueChange={(value) => 
        setSettings(prev => ({ ...prev, notifications: value }))
      }
      lockWhileChanging={false}
    />
  </View>
  <View style={styles.settingItem}>
    <EtText variant="body-secondary-regular">Privacy Mode</EtText>
    <EtToggle 
      value={settings.privacy}
      onValueChange={(value) => 
        setSettings(prev => ({ ...prev, privacy: value }))
      }
      lockWhileChanging={false}
    />
  </View>
</View>`}
        ></CodeBlock>

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            code={`interface EtToggleProps {
  value: boolean;                   // Current state (required)
  onValueChange: (value: boolean) => void;  // Change handler (required)
  size?: 'small' | 'medium' | 'large';     // Toggle size
  disabled?: boolean;               // Non-interactive state
  trackColorOn?: string;            // Track color when on
  trackColorOff?: string;           // Track color when off
  thumbColor?: string;              // Thumb color
  thumbColorDisabled?: string;      // Thumb color when disabled
  testID?: string;                  // Test identifier
}`}
            title="EtToggleProps"
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
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  codeBlock: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 200,
  },
  sizeDemo: {
    gap: 12,
  },
  disabledDemo: {
    gap: 12,
  },
  disabledText: {
    opacity: 0.5,
  },
  settingsDemo: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: 250,
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
