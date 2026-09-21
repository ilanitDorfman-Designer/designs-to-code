import type { StoryObj } from '@storybook/react-native';
import { EtBadge, EtText, EtUserInfo } from 'etoro-ui';
import type { EtUserInfoProps } from 'etoro-ui/components/data-display/user-info/api/types';
import { ComponentAnnotations, Renderer } from 'storybook/internal/csf';
import { AVATAR_URI, createMeta, styles } from './et-user-info-stories-shared';

const meta: ComponentAnnotations<Renderer, EtUserInfoProps> = createMeta('Examples');

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Overview',
  args: {},
  parameters: {
    notes: 'Basic horizontal row with avatar, title and subtitle.',
  },
  render: () => (
    <EtUserInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
        },
        title: 'Jane Doe',
        subtitle: '@janedoe',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtUserInfo.Avatar style={styles.avatarBackground} />
      <EtUserInfo.Title />
      <EtUserInfo.Subtitle />
    </EtUserInfo>
  ),
};

export const UserHorizontal: Story = {
  name: 'User horizontal',
  args: {},
  render: () => (
    <EtUserInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
        },
        title: 'Jane Doe',
        subtitle: '@janedoe',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtUserInfo.Avatar style={styles.avatarBackground} />
      <EtUserInfo.Title />
      <EtUserInfo.Subtitle />
    </EtUserInfo>
  ),
};

export const UserWithDetails: Story = {
  name: 'User with title and subtitle',
  args: {},
  render: () => (
    <EtUserInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
        },
        title: 'Akansha Trivedi',
        subtitle: 'Germany',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtUserInfo.Avatar style={styles.avatarBackground} />
      <EtUserInfo.Title />
      <EtUserInfo.Subtitle />
    </EtUserInfo>
  ),
};

export const UserMinimal: Story = {
  name: 'User minimal',
  args: {},
  render: () => (
    <EtUserInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'small',
        },
        title: 'Jane Doe',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtUserInfo.Avatar style={styles.avatarBackground} />
      <EtUserInfo.Title />
    </EtUserInfo>
  ),
};

export const UserVertical: Story = {
  name: 'User vertical',
  args: {},
  render: () => (
    <EtUserInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'large',
        },
        title: 'Jane Doe',
        subtitle: '@janedoe',
      }}
      layout="vertical"
      style={styles.rowBackground}
    >
      <EtUserInfo.Avatar style={styles.avatarBackground} />
      <EtUserInfo.Title />
      <EtUserInfo.Subtitle />
    </EtUserInfo>
  ),
};

export const UserWithTitleBadge: Story = {
  name: 'User with title badge',
  args: {},
  render: () => (
    <EtUserInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
        },
        subtitle: '@janedoe',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtUserInfo.Avatar style={styles.avatarBackground} />
      <EtUserInfo.Title>
        <EtText variant="label-primary-semibold" style={styles.title}>
          Jane Doe
        </EtText>
        <EtBadge color="green">
          <EtBadge.Label>Popular</EtBadge.Label>
        </EtBadge>
      </EtUserInfo.Title>
      <EtUserInfo.Subtitle />
    </EtUserInfo>
  ),
};
