import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtButton, EtSkeleton, EtSkeletonCard, EtSkeletonGroup, EtSkeletonList, EtSkeletonProfile, EtText, EtView } from 'etoro-ui';

type Story = StoryObj<typeof EtSkeleton>;

const meta: Meta<typeof EtSkeleton> = {
  title: 'eToro-UI/Components/Status/EtSkeleton',
  component: EtSkeleton,
  parameters: {
    notes: 'Beautiful animated skeleton components for loading states.',
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

export const Interactive: Story = {
  render: (args) => {
    return <EtSkeleton {...args} />;
  },
  args: {
    width: 200,
    height: 20,
    animation: 'shimmer',
    variant: 'text',
    duration: 1500,
    visible: true,
  },
  argTypes: {
    animation: {
      control: 'select',
      options: ['shimmer', 'pulse', 'wave', 'none'],
    },
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
    width: {
      control: { type: 'range', min: 50, max: 400, step: 10 },
    },
    height: {
      control: { type: 'range', min: 10, max: 200, step: 5 },
    },
    duration: {
      control: { type: 'range', min: 500, max: 3000, step: 100 },
    },
    visible: {
      control: 'boolean',
    },
  },
};

export const Animations: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Animation Types
      </EtText>

      <View style={styles.animationSection}>
        <EtText variant="body-base-medium" style={styles.animationTitle}>
          Shimmer
        </EtText>
        <EtSkeleton width={250} height={20} animation="shimmer" />
      </View>

      <View style={styles.animationSection}>
        <EtText variant="body-base-medium" style={styles.animationTitle}>
          Pulse
        </EtText>
        <EtSkeleton width={250} height={20} animation="pulse" />
      </View>

      <View style={styles.animationSection}>
        <EtText variant="body-base-medium" style={styles.animationTitle}>
          Wave
        </EtText>
        <EtSkeleton width={250} height={20} animation="wave" />
      </View>

      <View style={styles.animationSection}>
        <EtText variant="body-base-medium" style={styles.animationTitle}>
          None
        </EtText>
        <EtSkeleton width={250} height={20} animation="none" />
      </View>
    </View>
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Shape Variants
      </EtText>

      <View style={styles.variantSection}>
        <EtText variant="body-base-medium" style={styles.variantTitle}>
          Text
        </EtText>
        <View style={styles.variantRow}>
          <EtSkeleton width={200} height={16} variant="text" />
          <EtSkeleton width={150} height={16} variant="text" />
          <EtSkeleton width={180} height={16} variant="text" />
        </View>
      </View>

      <View style={styles.variantSection}>
        <EtText variant="body-base-medium" style={styles.variantTitle}>
          Circular
        </EtText>
        <View style={styles.variantRow}>
          <EtSkeleton width={40} height={40} variant="circular" />
          <EtSkeleton width={60} height={60} variant="circular" />
          <EtSkeleton width={80} height={80} variant="circular" />
        </View>
      </View>

      <View style={styles.variantSection}>
        <EtText variant="body-base-medium" style={styles.variantTitle}>
          Rounded
        </EtText>
        <View style={styles.variantRow}>
          <EtSkeleton width={120} height={80} variant="rounded" />
          <EtSkeleton width={100} height={60} variant="rounded" />
        </View>
      </View>

      <View style={styles.variantSection}>
        <EtText variant="body-base-medium" style={styles.variantTitle}>
          Rectangular
        </EtText>
        <View style={styles.variantRow}>
          <EtSkeleton width={200} height={40} variant="rectangular" />
          <EtSkeleton width={150} height={60} variant="rectangular" />
        </View>
      </View>
    </View>
  ),
};

export const CompositeComponents: Story = {
  render: () => (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Composite Components
        </EtText>

        <View style={styles.compositeSection}>
          <EtText variant="body-base-medium" style={styles.compositeTitle}>
            Skeleton Group
          </EtText>
          <EtSkeletonGroup animation="shimmer" />
        </View>

        <View style={styles.compositeSection}>
          <EtText variant="body-base-medium" style={styles.compositeTitle}>
            Skeleton Card
          </EtText>
          <EtSkeletonCard avatar={true} lines={3} actions={true} animation="shimmer" />
        </View>

        <View style={styles.compositeSection}>
          <EtText variant="body-base-medium" style={styles.compositeTitle}>
            Skeleton List
          </EtText>
          <EtSkeletonList items={4} animation="pulse" />
        </View>

        <View style={styles.compositeSection}>
          <EtText variant="body-base-medium" style={styles.compositeTitle}>
            Skeleton Profile
          </EtText>
          <EtSkeletonProfile animation="wave" />
        </View>
      </View>
    </ScrollView>
  ),
};

export const TradingInterface: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    const handleToggleLoading = () => {
      setLoading(!loading);
    };

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.showcase}>
          <EtText variant="heading-compact" style={styles.title}>
            Trading Interface Examples
          </EtText>

          <EtButton variant="info-subtle" onPress={handleToggleLoading}>
            <EtButton.Label>{loading ? 'Show Content' : 'Show Loading'}</EtButton.Label>
          </EtButton>

          <View style={styles.tradingExample}>
            <View style={styles.portfolioSection}>
              <EtText variant="heading-compact">Portfolio Overview</EtText>
              <EtSkeleton visible={loading} width="100%" height={200} variant="rounded" animation="shimmer">
                <View style={styles.contentPlaceholder}>
                  <EtText>📈 Portfolio Chart Content</EtText>
                </View>
              </EtSkeleton>
            </View>

            <View style={styles.watchlistSection}>
              <EtText variant="heading-compact">Watchlist</EtText>
              <EtSkeleton visible={loading} style={{ width: '100%' }}>
                <EtSkeletonList items={5} animation="shimmer" />
              </EtSkeleton>
            </View>

            <View style={styles.profileSection}>
              <EtText variant="heading-compact">User Profile</EtText>
              <EtSkeleton visible={loading} style={{ width: '100%' }}>
                <EtSkeletonProfile animation="pulse" />
              </EtSkeleton>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  },
};

export const GroupShimmer: Story = {
  render: () => (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Group Shimmer (shared clock)
      </EtText>
      <EtText variant="body-base-medium" style={styles.animationTitle}>
        All shapes below share ONE animation loop and stay phase-synced. Compose shape atoms inside EtSkeleton.Group to mirror the real content.
      </EtText>

      <EtSkeleton.Group style={styles.groupDemo}>
        {Array.from({ length: 4 }, (_, index) => (
          <View key={index} style={styles.groupRow}>
            <EtSkeleton.Circle width={40} height={40} />
            <View style={styles.groupRowText}>
              <EtSkeleton.Text width="70%" height={14} />
              <EtSkeleton.Text width="40%" height={12} />
            </View>
            <EtSkeleton.Box width={56} height={28} />
          </View>
        ))}
      </EtSkeleton.Group>
    </View>
  ),
};

export const Crossfade: Story = {
  render: function CrossfadeStory() {
    const [loading, setLoading] = useState(true);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Crossfade Transition
        </EtText>
        <EtButton variant="info-subtle" onPress={() => setLoading((prev) => !prev)}>
          <EtButton.Label>{loading ? 'Reveal content' : 'Show skeleton'}</EtButton.Label>
        </EtButton>

        <EtView
          loading={loading}
          skeleton={
            <EtSkeleton.Group style={styles.groupDemo}>
              <View style={styles.groupRow}>
                <EtSkeleton.Circle width={48} height={48} />
                <View style={styles.groupRowText}>
                  <EtSkeleton.Text width="70%" height={16} />
                  <EtSkeleton.Text width="40%" height={12} />
                </View>
              </View>
            </EtSkeleton.Group>
          }
        >
          <View style={styles.groupRow}>
            <View style={styles.contentAvatar} />
            <EtText variant="body-base-medium">Loaded content</EtText>
          </View>
        </EtView>
      </View>
    );
  },
};

export const LoadingStates: Story = {
  render: () => {
    const [cardLoading, setCardLoading] = useState(true);
    const [listLoading, setListLoading] = useState(true);

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.showcase}>
          <EtText variant="heading-compact" style={styles.title}>
            Interactive Loading States
          </EtText>

          <View style={styles.loadingControls}>
            <EtButton variant="info-subtle" size="small" onPress={() => setCardLoading(!cardLoading)}>
              <EtButton.Label>Toggle Card</EtButton.Label>
            </EtButton>
            <EtButton variant="info-subtle" size="small" onPress={() => setListLoading(!listLoading)}>
              <EtButton.Label>Toggle List</EtButton.Label>
            </EtButton>
          </View>

          <View style={styles.loadingExample}>
            <EtText variant="body-base-medium">Asset Card</EtText>
            <EtSkeleton visible={cardLoading}>
              <EtSkeletonCard avatar={true} lines={2} actions={true} />
            </EtSkeleton>
          </View>

          <View style={styles.loadingExample}>
            <EtText variant="body-base-medium">Asset List</EtText>
            <EtSkeleton visible={listLoading}>
              <EtSkeletonList items={3} />
            </EtSkeleton>
          </View>
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    gap: 24,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  animationSection: {
    gap: 8,
  },
  animationTitle: {
    opacity: 0.8,
    marginBottom: 4,
  },
  variantSection: {
    gap: 12,
  },
  variantTitle: {
    opacity: 0.8,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  compositeSection: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  compositeTitle: {
    opacity: 0.8,
    marginBottom: 8,
  },
  tradingExample: {
    gap: 24,
  },
  portfolioSection: {
    gap: 12,
  },
  watchlistSection: {
    gap: 12,
  },
  profileSection: {
    gap: 12,
  },
  contentPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  loadingControls: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  loadingExample: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  groupDemo: {
    gap: 16,
    width: '100%',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupRowText: {
    flex: 1,
    gap: 8,
  },
  contentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#cfe8d6',
  },
});
