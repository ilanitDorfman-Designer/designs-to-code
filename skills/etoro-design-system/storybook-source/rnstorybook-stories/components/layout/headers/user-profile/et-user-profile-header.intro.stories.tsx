import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtText, EtUserProfileHeader } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import * as Clipboard from 'expo-clipboard';

type Story = StoryObj<{}>;

// Mock data
const mockUser = {
  displayName: 'Jessica Bale',
  username: 'Jessicab',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  stats: {
    aum: 1800000,
    copiers: 38000,
    followers: 42500,
    following: 128,
  },
};

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
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
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
  title: 'eToro-UI/Components/Layout/Headers/EtUserProfileHeader/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtUserProfileHeader component with live examples.',
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

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            👤 EtUserProfileHeader
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Compound component for user profile display
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText style={styles.featureText}>• Compound component pattern with shared context</EtText>
          <EtText style={styles.featureText}>• User profile display with avatar, name, username, and copiers</EtText>
          <EtText style={styles.featureText}>• Explicit composition - you control which stats to show</EtText>
          <EtText style={styles.featureText}>• Theme-aware styling</EtText>
        </View>

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Default Usage
        </EtText>

        <EtUserProfileHeader user={mockUser}>
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
          </EtUserProfileHeader.UserInfo>
          <EtUserProfileHeader.Stats>
            <EtUserProfileHeader.StatItem label="AUM" value={mockUser.stats.aum} />
            <EtUserProfileHeader.StatItem label="Followers" value={mockUser.stats.followers} />
            <EtUserProfileHeader.StatItem label="Following" value={mockUser.stats.following} />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>

        <CodeBlock
          title="Default Usage"
          code={`import { EtUserProfileHeader } from 'etoro-ui';

const user = {
  displayName: 'Jessica Bale',
  username: 'Jessicab',
  avatar: 'https://example.com/avatar.jpg',
  stats: {
    aum: 1800000,
    copiers: 38000,
    followers: 42500,
    following: 128,
  },
};

<EtUserProfileHeader user={user}>
  <EtUserProfileHeader.UserInfo>
    <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
    <EtUserProfileHeader.UserInfo.Name />
    <EtUserProfileHeader.UserInfo.UserName />
    <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
  </EtUserProfileHeader.UserInfo>
  <EtUserProfileHeader.Stats>
    <EtUserProfileHeader.StatItem label="AUM" value={user.stats.aum} />
    <EtUserProfileHeader.StatItem label="Followers" value={user.stats.followers} />
    <EtUserProfileHeader.StatItem label="Following" value={user.stats.following} />
  </EtUserProfileHeader.Stats>
</EtUserProfileHeader>`}
        />

        <EtText variant="heading-base" style={styles.sectionTitle}>
          High Numbers Example
        </EtText>

        <EtUserProfileHeader
          user={{
            displayName: 'Warren Buffett',
            username: 'warrenbuffett',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            stats: {
              aum: 125000000,
              copiers: 1200000,
              followers: 5800000,
              following: 12,
            },
          }}
        >
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="Warren Buffett's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="1.2M copiers" />
          </EtUserProfileHeader.UserInfo>
          <EtUserProfileHeader.Stats>
            <EtUserProfileHeader.StatItem label="AUM" value={125000000} />
            <EtUserProfileHeader.StatItem label="Followers" value={5800000} />
            <EtUserProfileHeader.StatItem label="Following" value={12} />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Low Numbers Example
        </EtText>

        <EtUserProfileHeader
          user={{
            displayName: 'New Trader',
            username: 'newtrader',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            stats: {
              aum: 500,
              copiers: 5,
              followers: 23,
              following: 156,
            },
          }}
        >
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="New Trader's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="5 copiers" />
          </EtUserProfileHeader.UserInfo>
          <EtUserProfileHeader.Stats>
            <EtUserProfileHeader.StatItem label="AUM" value={500} />
            <EtUserProfileHeader.StatItem label="Followers" value={23} />
            <EtUserProfileHeader.StatItem label="Following" value={156} />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Single Copier Example
        </EtText>

        <EtUserProfileHeader
          user={{
            displayName: 'First Timer',
            username: 'firsttimer',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            stats: {
              aum: 1000,
              copiers: 1,
              followers: 10,
              following: 50,
            },
          }}
        >
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="First Timer's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="1 copier" />
          </EtUserProfileHeader.UserInfo>
          <EtUserProfileHeader.Stats>
            <EtUserProfileHeader.StatItem label="AUM" value={1000} />
            <EtUserProfileHeader.StatItem label="Followers" value={10} />
            <EtUserProfileHeader.StatItem label="Following" value={50} />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>

        <View style={[styles.apiReference, { borderTopColor: colors.dividerPrimary }]}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>

          <CodeBlock
            title="EtUserProfileHeaderProps"
            code={`interface EtUserProfileHeaderProps extends ViewProps {
  // User data (required) - shared via context
  user: UserProfileHeaderUser;
}`}
          />

          <CodeBlock
            title="UserProfileHeaderUser"
            code={`interface UserProfileHeaderUser {
  displayName: string;
  username: string;     // without @
  avatar: string;
  stats: {
    aum: number;
    copiers: number;
    followers: number;
    following: number;
  };
}`}
          />

          <CodeBlock
            title="Subcomponents"
            code={`// UserInfo - container with composable subcomponents
<EtUserProfileHeader.UserInfo>
  <EtUserProfileHeader.UserInfo.Avatar />
  <EtUserProfileHeader.UserInfo.Name />
  <EtUserProfileHeader.UserInfo.UserName />
  <EtUserProfileHeader.UserInfo.Copiers />
</EtUserProfileHeader.UserInfo>

// Stats - container for StatItem children
<EtUserProfileHeader.Stats>
  <EtUserProfileHeader.StatItem ... />
</EtUserProfileHeader.Stats>

// StatItem - individual stat display
<EtUserProfileHeader.StatItem
  label="AUM"
  value={1800000}
/>`}
          />
        </View>

        <View style={[styles.notes, { borderTopColor: colors.dividerPrimary }]}>
          <EtText variant="heading-base" style={styles.notesTitle}>
            Important Notes
          </EtText>
          <EtText style={styles.noteText}>• User data is passed to parent and shared via context</EtText>
          <EtText style={styles.noteText}>• Subcomponents must be used within EtUserProfileHeader</EtText>
          <EtText style={styles.noteText}>• Stats requires StatItem children - no defaults</EtText>
          <EtText style={styles.noteText}>• All stats are numbers - auto-formatted to K/M/B suffixes</EtText>
          <EtText style={styles.noteText}>• Username is displayed with @ prefix automatically</EtText>
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
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  notes: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  notesTitle: {
    marginBottom: 12,
  },
  noteText: {
    marginBottom: 4,
    opacity: 0.8,
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
