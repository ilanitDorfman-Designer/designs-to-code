import type { Meta, StoryObj } from '@storybook/react-native';
import { EtUserProfileHeader } from 'etoro-ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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

const meta = {
  title: 'eToro-UI/Components/Layout/Headers/EtUserProfileHeader',
  component: EtUserProfileHeader,
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtUserProfileHeader>;

export default meta;

type Story = StoryObj<{}>;

// Default header
export const Default: Story = {
  render: () => (
    <EtUserProfileHeader user={mockUser} testID="user-profile-header" accessibilityLabel="Jessica's profile header">
      <EtUserProfileHeader.UserInfo>
        <EtUserProfileHeader.UserInfo.Avatar alt="Jessica's avatar" />
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
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
