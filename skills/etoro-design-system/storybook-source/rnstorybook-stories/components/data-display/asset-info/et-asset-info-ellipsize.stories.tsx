import type { Meta, StoryObj } from '@storybook/react-native';
import { EtAssetInfo, EtText } from 'etoro-ui';
import { EtAssetInfoProps } from 'etoro-ui/components/data-display/asset-info/api/types';
import { ScrollView } from 'react-native-gesture-handler';
import { AVATAR_URI, LONG_SUBTITLE, LONG_TITLE, createMeta, styles } from './et-asset-info-stories-shared';

const meta: Meta<EtAssetInfoProps> = createMeta('Ellipsize');

export default meta;

type Story = StoryObj<typeof meta>;

export const Tail: Story = {
  name: 'Tail (default)',
  args: {},
  parameters: {
    notes: 'Default ellipsizeMode="tail" – long text is truncated at the end with "…".',
  },
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: LONG_TITLE,
        subtitle: LONG_SUBTITLE,
      }}
      layout="horizontal"
      ellipsizeMode="tail"
      maxWidth={200}
      style={styles.ellipsizeRow}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const Head: Story = {
  name: 'Head',
  args: {},
  parameters: {
    notes: 'ellipsizeMode="head" – long text is truncated at the start with "…".',
  },
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: LONG_TITLE,
        subtitle: LONG_SUBTITLE,
      }}
      layout="horizontal"
      ellipsizeMode="head"
      maxWidth={200}
      style={styles.ellipsizeRow}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const Middle: Story = {
  name: 'Middle',
  args: {},
  parameters: {
    notes: 'ellipsizeMode="middle" – long text is truncated in the middle with "…".',
  },
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: LONG_TITLE,
        subtitle: LONG_SUBTITLE,
      }}
      layout="horizontal"
      ellipsizeMode="middle"
      maxWidth={200}
      style={styles.ellipsizeRow}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const Clip: Story = {
  name: 'Clip',
  args: {},
  parameters: {
    notes: 'ellipsizeMode="clip" – text is clipped at the boundary (no ellipsis).',
  },
  render: () => (
    <EtAssetInfo
      data={{
        avatar: {
          source: AVATAR_URI,
          size: 'medium',
          shape: 'square',
        },
        title: LONG_TITLE,
        subtitle: LONG_SUBTITLE,
      }}
      layout="horizontal"
      ellipsizeMode="clip"
      maxWidth={200}
      style={styles.ellipsizeRow}
    >
      <EtAssetInfo.Avatar style={styles.avatarBackground} />
      <EtAssetInfo.Title />
      <EtAssetInfo.Subtitle />
    </EtAssetInfo>
  ),
};

export const AllModesShowcase: Story = {
  name: 'All modes showcase',
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        ellipsizeMode: tail (default)
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          title: LONG_TITLE,
          subtitle: LONG_SUBTITLE,
        }}
        layout="horizontal"
        ellipsizeMode="tail"
        maxWidth={200}
        style={styles.ellipsizeRow}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        ellipsizeMode: head
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          title: LONG_TITLE,
          subtitle: LONG_SUBTITLE,
        }}
        layout="horizontal"
        ellipsizeMode="head"
        maxWidth={200}
        style={styles.ellipsizeRow}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        ellipsizeMode: middle
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          title: LONG_TITLE,
          subtitle: LONG_SUBTITLE,
        }}
        layout="horizontal"
        ellipsizeMode="middle"
        maxWidth={200}
        style={styles.ellipsizeRow}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        ellipsizeMode: clip
      </EtText>
      <EtAssetInfo
        data={{
          avatar: {
            source: AVATAR_URI,
            size: 'medium',
            shape: 'square',
          },
          title: LONG_TITLE,
          subtitle: LONG_SUBTITLE,
        }}
        layout="horizontal"
        ellipsizeMode="clip"
        maxWidth={200}
        style={styles.ellipsizeRow}
      >
        <EtAssetInfo.Avatar style={styles.avatarBackground} />
        <EtAssetInfo.Title />
        <EtAssetInfo.Subtitle />
      </EtAssetInfo>
    </ScrollView>
  ),
  args: {},
};
