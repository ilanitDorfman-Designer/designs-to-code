import type { StoryObj } from '@storybook/react-native';
import { EtAssetInfo, EtBadge, EtText } from 'etoro-ui';
import { EtAssetInfoProps } from 'etoro-ui/components/data-display/asset-info/api/types';
import { ScrollView } from 'react-native-gesture-handler';
import { ComponentAnnotations, Renderer } from 'storybook/internal/csf';
import { AVATAR_URI, createMeta, styles } from './et-asset-info-stories-shared';

const meta: ComponentAnnotations<Renderer, EtAssetInfoProps> = createMeta('Examples');

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Overview',
  args: {},
  parameters: {
    notes: 'Basic horizontal row with avatar, title and subtitle.',
  },
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: 'AAPL',
        subtitle: 'Apple Inc',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AvatarHorizontal: Story = {
  name: 'Avatar horizontal',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'circle',
        },
        title: 'Jane Doe',
        subtitle: '@janedoe',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AvatarWithDetails: Story = {
  name: 'Avatar with title and subtitle',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'circle',
        },
        title: 'Akansha Trivedi',
        subtitle: 'Germany',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AssetHorizontal: Story = {
  name: 'Asset horizontal',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: 'AAPL',
        subtitle: 'Apple Inc',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AssetMinimal: Story = {
  name: 'Asset minimal',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'small',
          shape: 'square',
        },
        title: 'AAPL',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
    </EtAssetInfo>
  ),
};

export const AssetWithTitleBadge: Story = {
  name: 'Asset with title badge',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        subtitle: 'Apple Inc',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title>
        <EtText variant="label-primary-bold" style={styles.title}>
          AAPL
        </EtText>
        <EtBadge color="green">
          <EtBadge.Label>100</EtBadge.Label>
        </EtBadge>
      </EtAssetInfo.Title>
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AssetWithSubtitleBadge: Story = {
  name: 'Asset with subtitle badge',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: 'AAPL',
      }}
      layout="horizontal"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle>
        <EtText variant="label-secondary-regular">Apple Inc</EtText>
        <EtBadge color="green">
          <EtBadge.Label>100</EtBadge.Label>
        </EtBadge>
      </EtAssetInfo.Subtitle>
    </EtAssetInfo>
  ),
};

export const Vertical: Story = {
  name: 'Vertical',
  args: {},
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'large',
          shape: 'square',
        },
        title: 'AAPL',
        subtitle: 'Apple Inc',
      }}
      layout="vertical"
      style={styles.rowBackground}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AllVariations: Story = {
  name: 'All variations',
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Basic (image & title only)
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'circle',
          },
          title: 'AAPL',
        }}
        layout="horizontal"
        style={styles.rowBackground}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Avatar list
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          title: 'Jane Doe',
          subtitle: '@janedoe',
        }}
        layout="horizontal"
        style={styles.rowBackground}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Title With Badge
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          subtitle: '@janedoe',
        }}
        layout="horizontal"
        style={styles.rowBackground}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title>
          <EtText variant="label-primary-bold" style={styles.title}>
            Jane Doe
          </EtText>
          <EtBadge color="red">
            <EtBadge.Label>100</EtBadge.Label>
          </EtBadge>
        </EtAssetInfo.Title>
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Subtitle With Badge
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
        }}
        layout="horizontal"
        style={styles.rowBackground}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title>
          <EtText variant="label-primary-bold" style={styles.title}>
            Jane Doe
          </EtText>
          <EtBadge color="green">
            <EtBadge.Label>100</EtBadge.Label>
          </EtBadge>
        </EtAssetInfo.Title>
        <EtAssetInfo.Subtitle>
          <EtBadge color="red">
            <EtBadge.Label>10</EtBadge.Label>
          </EtBadge>
          <EtText variant="label-secondary-regular">@janedoe</EtText>
        </EtAssetInfo.Subtitle>
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Asset list
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          title: 'AAPL',
          subtitle: 'Apple Inc',
        }}
        layout="horizontal"
        style={styles.rowBackground}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Vertical
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'large',
            shape: 'square',
          },
          title: 'AAPL',
          subtitle: 'Apple Inc',
        }}
        layout="vertical"
        style={styles.rowBackground}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>
    </ScrollView>
  ),
  args: {},
};
