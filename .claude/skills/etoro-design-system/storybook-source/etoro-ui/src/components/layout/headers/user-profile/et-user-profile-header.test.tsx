import { render } from '@testing-library/react-native';
import React from 'react';

import { UserProfileHeaderUser } from './api';
import { EtUserProfileHeader } from './et-user-profile-header';

// Mock useEtoroTheme
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      bgNeutralSecondary: '#f5f5f5',
      textPrimaryNeutral: '#000000',
      textSecondaryNeutral: '#666666',
      dividerQuinarySecondary: '#e0e0e0',
    },
  })),
}));

// Mock EtAvatar
jest.mock('etoro-ui/components/social/avatar/et-avatar', () => ({
  EtAvatar: Object.assign(
    ({ children }: { children: React.ReactNode }) => {
      const { View } = require('react-native');
      return <View testID="mock-avatar">{children}</View>;
    },
    {
      Image: ({ alt }: { alt: string }) => {
        const { View } = require('react-native');
        return <View testID="mock-avatar-image" accessibilityLabel={alt} />;
      },
      Fallback: ({ children }: { children?: React.ReactNode }) => {
        const { View } = require('react-native');
        return <View testID="mock-avatar-fallback">{children}</View>;
      },
    },
  ),
}));

// Mock EtIconV2
jest.mock('etoro-ui/components/et-icon-v2/et-icon-v2', () => ({
  EtIconV2: ({ name }: { name: string }) => {
    const { View } = require('react-native');
    return <View testID={`icon-${name}`} />;
  },
}));

const defaultUser: UserProfileHeaderUser = {
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

// Helper to render default user info (uses context, no props needed)
const renderDefaultUserInfo = () => (
  <EtUserProfileHeader.UserInfo>
    <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
    <EtUserProfileHeader.UserInfo.Name />
    <EtUserProfileHeader.UserInfo.UserName />
    <EtUserProfileHeader.UserInfo.Copiers text="38K copiers" />
  </EtUserProfileHeader.UserInfo>
);

// Helper to render default stats
const renderDefaultStats = (user: UserProfileHeaderUser) => (
  <EtUserProfileHeader.Stats>
    <EtUserProfileHeader.StatItem label="AUM" value={user.stats.aum} />
    <EtUserProfileHeader.StatItem label="Followers" value={user.stats.followers} />
    <EtUserProfileHeader.StatItem label="Following" value={user.stats.following} />
  </EtUserProfileHeader.Stats>
);

describe('EtUserProfileHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Container', () => {
    it('renders correctly with accessibilityLabel', () => {
      // GIVEN / WHEN
      const { getByLabelText } = render(
        <EtUserProfileHeader user={defaultUser} accessibilityLabel="Jessica Bale's profile section">
          {renderDefaultUserInfo()}
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByLabelText("Jessica Bale's profile section")).toBeTruthy();
    });

    it('applies testID when provided', () => {
      // GIVEN
      const testID = 'user-profile-header';

      // WHEN
      const { getByTestId } = render(
        <EtUserProfileHeader user={defaultUser} testID={testID}>
          {renderDefaultUserInfo()}
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByTestId(testID)).toBeTruthy();
    });
  });

  describe('UserInfo', () => {
    it('renders avatar image', () => {
      // GIVEN / WHEN
      const { getByTestId } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultUserInfo()}</EtUserProfileHeader>);

      // THEN
      expect(getByTestId('mock-avatar-image')).toBeTruthy();
    });

    it('renders avatar fallback', () => {
      // GIVEN / WHEN
      const { getByTestId } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultUserInfo()}</EtUserProfileHeader>);

      // THEN
      expect(getByTestId('mock-avatar-fallback')).toBeTruthy();
    });

    it('renders user display name', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultUserInfo()}</EtUserProfileHeader>);

      // THEN
      expect(getByText('Jessica Bale')).toBeTruthy();
    });

    it('renders username with @ prefix', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultUserInfo()}</EtUserProfileHeader>);

      // THEN
      expect(getByText('@Jessicab')).toBeTruthy();
    });

    it('renders copiers count', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultUserInfo()}</EtUserProfileHeader>);

      // THEN
      expect(getByText('38K copiers')).toBeTruthy();
    });

    it('renders singular copier for count of 1', () => {
      // GIVEN
      const user = {
        ...defaultUser,
        stats: { ...defaultUser.stats, copiers: 1 },
      };

      // WHEN
      const { getByText } = render(
        <EtUserProfileHeader user={user}>
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="1 copier" />
          </EtUserProfileHeader.UserInfo>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByText('1 copier')).toBeTruthy();
    });

    it('renders high numbers correctly', () => {
      // GIVEN
      const user: UserProfileHeaderUser = {
        displayName: 'Warren Buffett',
        username: 'warrenbuffett',
        avatar: 'https://example.com/avatar.jpg',
        stats: {
          aum: 125000000,
          copiers: 1200000,
          followers: 5800000,
          following: 12,
        },
      };

      // WHEN
      const { getByText } = render(
        <EtUserProfileHeader user={user}>
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="Warren Buffett's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="1.2M copiers" />
          </EtUserProfileHeader.UserInfo>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByText('Warren Buffett')).toBeTruthy();
      expect(getByText('@warrenbuffett')).toBeTruthy();
      expect(getByText('1.2M copiers')).toBeTruthy();
    });

    it('renders low numbers correctly', () => {
      // GIVEN
      const user: UserProfileHeaderUser = {
        displayName: 'New Trader',
        username: 'newtrader',
        avatar: 'https://example.com/avatar.jpg',
        stats: { aum: 500, copiers: 5, followers: 23, following: 156 },
      };

      // WHEN
      const { getByText } = render(
        <EtUserProfileHeader user={user}>
          <EtUserProfileHeader.UserInfo>
            <EtUserProfileHeader.UserInfo.Avatar alt="New Trader's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
            <EtUserProfileHeader.UserInfo.UserName />
            <EtUserProfileHeader.UserInfo.Copiers text="5 copiers" />
          </EtUserProfileHeader.UserInfo>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByText('New Trader')).toBeTruthy();
      expect(getByText('@newtrader')).toBeTruthy();
      expect(getByText('5 copiers')).toBeTruthy();
    });

    it('allows custom style and testID', () => {
      // GIVEN
      const customStyle = { marginBottom: 16 };

      // WHEN
      const { getByTestId } = render(
        <EtUserProfileHeader user={defaultUser}>
          <EtUserProfileHeader.UserInfo style={customStyle} testID="user-info">
            <EtUserProfileHeader.UserInfo.Avatar alt="Jessica Bale's avatar" />
            <EtUserProfileHeader.UserInfo.Name />
          </EtUserProfileHeader.UserInfo>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByTestId('user-info')).toBeTruthy();
    });
  });

  describe('Stats', () => {
    it('renders AUM stat', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultStats(defaultUser)}</EtUserProfileHeader>);

      // THEN
      expect(getByText('1.8M')).toBeTruthy();
      expect(getByText('AUM')).toBeTruthy();
    });

    it('renders Followers stat', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultStats(defaultUser)}</EtUserProfileHeader>);

      // THEN
      expect(getByText('42.5K')).toBeTruthy();
      expect(getByText('Followers')).toBeTruthy();
    });

    it('renders Following stat', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultStats(defaultUser)}</EtUserProfileHeader>);

      // THEN
      expect(getByText('128')).toBeTruthy();
      expect(getByText('Following')).toBeTruthy();
    });

    it('renders all three stats', () => {
      // GIVEN / WHEN
      const { getByText } = render(<EtUserProfileHeader user={defaultUser}>{renderDefaultStats(defaultUser)}</EtUserProfileHeader>);

      // THEN
      expect(getByText('AUM')).toBeTruthy();
      expect(getByText('Followers')).toBeTruthy();
      expect(getByText('Following')).toBeTruthy();
    });

    it('renders only specified stats', () => {
      // GIVEN / WHEN
      const { getByText, queryByText } = render(
        <EtUserProfileHeader user={defaultUser}>
          <EtUserProfileHeader.Stats>
            <EtUserProfileHeader.StatItem label="AUM" value={defaultUser.stats.aum} />
            <EtUserProfileHeader.StatItem label="Followers" value={defaultUser.stats.followers} />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByText('AUM')).toBeTruthy();
      expect(getByText('Followers')).toBeTruthy();
      expect(queryByText('Following')).toBeNull();
    });

    it('renders high numbers correctly', () => {
      // GIVEN
      const user: UserProfileHeaderUser = {
        displayName: 'Warren Buffett',
        username: 'warrenbuffett',
        avatar: 'https://example.com/avatar.jpg',
        stats: {
          aum: 125000000,
          copiers: 1200000,
          followers: 5800000,
          following: 12,
        },
      };

      // WHEN
      const { getByText } = render(<EtUserProfileHeader user={user}>{renderDefaultStats(user)}</EtUserProfileHeader>);

      // THEN
      expect(getByText('125M')).toBeTruthy();
      expect(getByText('5.8M')).toBeTruthy();
      expect(getByText('12')).toBeTruthy();
    });

    it('renders low numbers correctly', () => {
      // GIVEN
      const user: UserProfileHeaderUser = {
        displayName: 'New Trader',
        username: 'newtrader',
        avatar: 'https://example.com/avatar.jpg',
        stats: { aum: 500, copiers: 5, followers: 23, following: 156 },
      };

      // WHEN
      const { getByText } = render(<EtUserProfileHeader user={user}>{renderDefaultStats(user)}</EtUserProfileHeader>);

      // THEN
      expect(getByText('500')).toBeTruthy();
      expect(getByText('23')).toBeTruthy();
      expect(getByText('156')).toBeTruthy();
    });

    it('allows custom style on Stats', () => {
      // GIVEN
      const customStyle = { paddingHorizontal: 16 };

      // WHEN
      const { getByTestId } = render(
        <EtUserProfileHeader user={defaultUser}>
          <EtUserProfileHeader.Stats style={customStyle} testID="stats">
            <EtUserProfileHeader.StatItem labelKey="stats.aum" value={defaultUser.stats.aum} />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByTestId('stats')).toBeTruthy();
    });

    it('allows custom style on StatItem', () => {
      // GIVEN / WHEN
      const { getByTestId } = render(
        <EtUserProfileHeader user={defaultUser}>
          <EtUserProfileHeader.Stats>
            <EtUserProfileHeader.StatItem label="AUM" value={defaultUser.stats.aum} testID="stat-aum" />
          </EtUserProfileHeader.Stats>
        </EtUserProfileHeader>,
      );

      // THEN
      expect(getByTestId('stat-aum')).toBeTruthy();
    });
  });
});
