import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtPost, EtText } from 'etoro-ui';
import { X2, X3, X4 } from 'etoro-ui/core/styles';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockUsers = {
  akansha: {
    displayName: 'Akansha Trivedi',
    avatar: 'https://i.pravatar.cc/150?u=akansha',
    location: 'Germany',
  },
  yoni: {
    displayName: 'YoniAssia',
    avatar: 'https://i.pravatar.cc/150?u=yoni',
    location: 'San Francisco, CA',
  },
  melissa: {
    displayName: 'Melissa_T',
    avatar: 'https://i.pravatar.cc/150?u=melissa',
    location: 'London, UK',
  },
  marco: {
    displayName: 'MarcoMazzali',
    avatar: 'https://i.pravatar.cc/150?u=marco',
    location: 'Milan, Italy',
  },
};

const mockSharedPosts = {
  textOnly: 'Just closed my $AAPL position with a solid 15% gain! The tech sector is looking strong this quarter.',
  longText: `Market analysis: After careful consideration of the current market conditions and technical indicators, I believe we're entering a bullish phase for tech stocks.

Apple's recent product launches and strong consumer demand, combined with their services revenue growth, make it a compelling investment.

The key factors I'm watching:
• Q4 earnings expectations
• Supply chain improvements
• Services revenue growth
• iPhone 16 sales data`,
  withImage: 'Sharing my new office trading setup - what do you think?',
  withLink: 'Check out my full eToro profile for my complete portfolio strategy.',
  withTrade: 'Just opened a position on NVIDIA. The AI momentum is undeniable!',
};

const mockAttachments = {
  image: {
    source: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  },
  link: {
    url: 'https://www.etoro.com/people/marcomazzali',
    title: "@MarcoMazzali's profile on eToro",
    host: 'www.etoro.com',
    description:
      'The Wallaby Project is an ethical investment portfolio on eToro that combines financial growth with real-world environmental impact.',
    thumbnailSource: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200',
  },
  linkNoThumb: {
    url: 'https://www.reuters.com/markets',
    title: 'Global Markets Overview - Reuters',
    host: 'www.reuters.com',
    description: 'Get the latest global markets news, including stock market data, bond yields, commodities, and currencies.',
  },
  trade: {
    symbolName: 'NVDA',
    displayName: 'NVIDIA Corporation',
    avatarSource: 'https://etoro-cdn.etorostatic.com/market-avatars/nvda/80x80.png',
    currentPrice: 186.86,
    priceChange: 1.01,
    priceChangePercent: 0.54,
  },
};

// ─── Shared outer-post defaults ───────────────────────────────────────────────

const defaultOuterPost = {
  displayName: mockUsers.yoni.displayName,
  avatar: mockUsers.yoni.avatar,
  location: mockUsers.yoni.location,
  timestamp: '2h',
};

const DefaultFooter = () => (
  <EtPost.Footer>
    <EtPost.Likes onPress={() => console.log('Like')}>{128}</EtPost.Likes>
    <EtPost.Comments onPress={() => console.log('Comment')}>{34}</EtPost.Comments>
    <EtPost.Shares onPress={() => console.log('Share')}>{12}</EtPost.Shares>
    <EtPost.Save onPress={() => console.log('Save')} />
  </EtPost.Footer>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof EtPost> = {
  title: 'eToro-UI/Components/Social/EtPost/SharedPost',
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The simplest form: sharing a text-only post (no body in outer post).
 * Outer poster adds no caption — SharedPost carries all the content.
 */
export const TextOnly: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="" onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header
          displayName={mockUsers.akansha.displayName}
          avatar={mockUsers.akansha.avatar}
          timestamp="1d"
          onUserPress={() => console.log('Shared user pressed')}
        />
        <EtPost.SharedPost.Body text={mockSharedPosts.textOnly} />
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Outer poster adds their own commentary above the shared post.
 * Most common real-world sharing pattern.
 */
export const WithOuterCaption: Story = {
  render: () => (
    <EtPost
      {...defaultOuterPost}
      text="Worth reading - this is exactly what I've been saying about the market."
      onMenuPress={() => console.log('Menu')}
    >
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header
          displayName={mockUsers.melissa.displayName}
          avatar={mockUsers.melissa.avatar}
          timestamp="3h"
          onUserPress={() => console.log('Shared user pressed')}
        />
        <EtPost.SharedPost.Body text={mockSharedPosts.textOnly} />
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Shared post with a long body that collapses to 4 lines by default.
 * "Show More / Show Less" is handled by SharedPost.Body automatically.
 */
export const LongBodyCollapsed: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="Great analysis - sharing this with my followers." onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header displayName={mockUsers.melissa.displayName} avatar={mockUsers.melissa.avatar} timestamp="5h" />
        <EtPost.SharedPost.Body text={mockSharedPosts.longText} />
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Shared post with an image attachment wrapped in SharedPost.Attachment.
 */
export const WithImage: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="Nice setup!" onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header
          displayName={mockUsers.akansha.displayName}
          avatar={mockUsers.akansha.avatar}
          timestamp="2d"
          onUserPress={() => console.log('Shared user pressed')}
        />
        <EtPost.SharedPost.Body text={mockSharedPosts.withImage} />
        <EtPost.SharedPost.Attachment>
          <EtPost.Image {...mockAttachments.image} onPress={() => console.log('Image pressed')} />
        </EtPost.SharedPost.Attachment>
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Shared post with a link preview (thumbnail + title + description).
 */
export const WithLinkPreview: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="Follow Marco - one of the best performers this year." onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header
          displayName={mockUsers.marco.displayName}
          avatar={mockUsers.marco.avatar}
          timestamp="1w"
          onUserPress={() => console.log('Shared user pressed')}
        />
        <EtPost.SharedPost.Body text={mockSharedPosts.withLink} />
        <EtPost.SharedPost.Attachment>
          <EtPost.Link {...mockAttachments.link} onPress={() => console.log('Link pressed')} />
        </EtPost.SharedPost.Attachment>
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Shared post with a link preview but no thumbnail image.
 */
export const WithLinkNoThumbnail: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="Good market overview for those who missed today's session." onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header displayName={mockUsers.melissa.displayName} avatar={mockUsers.melissa.avatar} timestamp="4h" />
        <EtPost.SharedPost.Attachment>
          <EtPost.Link {...mockAttachments.linkNoThumb} onPress={() => console.log('Link pressed')} />
        </EtPost.SharedPost.Attachment>
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Shared post with a trade card — the most eToro-specific use case.
 * Inner post author opened a position and shared it; outer user reshared it.
 */
export const WithTradeCard: Story = {
  render: () => {
    const [isLiked, setIsLiked] = useState(false);

    return (
      <EtPost {...defaultOuterPost} text="Following this trade - NVDA is a beast right now." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header
            displayName={mockUsers.akansha.displayName}
            avatar={mockUsers.akansha.avatar}
            timestamp="30m"
            onUserPress={() => console.log('Shared user pressed')}
          />
          <EtPost.SharedPost.Body text={mockSharedPosts.withTrade} />
          <EtPost.SharedPost.Attachment>
            <EtPost.Trade {...mockAttachments.trade} onPress={() => console.log('Trade pressed')} />
          </EtPost.SharedPost.Attachment>
        </EtPost.SharedPost>
        <EtPost.Footer>
          <EtPost.Likes onPress={() => setIsLiked((prev) => !prev)} isActive={isLiked}>
            {128}
          </EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{34}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{12}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>
    );
  },
};

/**
 * Header-only shared post — when the original post has no body or the body
 * was deleted. Only attribution is shown.
 */
export const HeaderOnly: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="This post inspired me to rethink my strategy." onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost>
        <EtPost.SharedPost.Header displayName={mockUsers.marco.displayName} avatar={mockUsers.marco.avatar} timestamp="2w" />
      </EtPost.SharedPost>
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Deleted shared post — when the original of the shared post has been deleted.
 * Renders `EtPost.SharedPost.Deleted` (a self-contained leaf, non-interactive)
 * in place of the `<EtPost.SharedPost>` active-share frame. Caller owns the
 * localized text — `etoro-ui` is i18n-free by convention.
 */
export const Deleted: Story = {
  render: () => (
    <EtPost {...defaultOuterPost} text="Worth reading — even if the original is gone." onMenuPress={() => console.log('Menu')}>
      <EtPost.Header />
      <EtPost.Body />
      <EtPost.SharedPost.Deleted text="The shared post was deleted" testID="feed-shared-post-deleted" />
      <DefaultFooter />
    </EtPost>
  ),
};

/**
 * Showcase of all SharedPost variations in a single scrollable view.
 */
export const AllVariations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        SharedPost Variations
      </EtText>

      {/* Text only */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Text Only
      </EtText>
      <EtPost {...defaultOuterPost} text="" onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header
            displayName={mockUsers.akansha.displayName}
            avatar={mockUsers.akansha.avatar}
            timestamp="1d"
            onUserPress={() => console.log('Shared user pressed')}
          />
          <EtPost.SharedPost.Body text={mockSharedPosts.textOnly} />
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* With outer caption */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        With Outer Caption
      </EtText>
      <EtPost
        {...defaultOuterPost}
        text="Worth reading - this is exactly what I've been saying about the market."
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header
            displayName={mockUsers.melissa.displayName}
            avatar={mockUsers.melissa.avatar}
            timestamp="3h"
            onUserPress={() => console.log('Shared user pressed')}
          />
          <EtPost.SharedPost.Body text={mockSharedPosts.textOnly} />
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Long body */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Long Body (collapsed)
      </EtText>
      <EtPost {...defaultOuterPost} text="Great analysis - sharing this with my followers." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header displayName={mockUsers.melissa.displayName} avatar={mockUsers.melissa.avatar} timestamp="5h" />
          <EtPost.SharedPost.Body text={mockSharedPosts.longText} />
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Image attachment */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        With Image
      </EtText>
      <EtPost {...defaultOuterPost} text="Nice setup!" onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header
            displayName={mockUsers.akansha.displayName}
            avatar={mockUsers.akansha.avatar}
            timestamp="2d"
            onUserPress={() => console.log('Shared user pressed')}
          />
          <EtPost.SharedPost.Body text={mockSharedPosts.withImage} />
          <EtPost.SharedPost.Attachment>
            <EtPost.Image {...mockAttachments.image} onPress={() => console.log('Image pressed')} />
          </EtPost.SharedPost.Attachment>
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Link preview */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        With Link Preview
      </EtText>
      <EtPost {...defaultOuterPost} text="Follow Marco - one of the best performers this year." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header
            displayName={mockUsers.marco.displayName}
            avatar={mockUsers.marco.avatar}
            timestamp="1w"
            onUserPress={() => console.log('Shared user pressed')}
          />
          <EtPost.SharedPost.Body text={mockSharedPosts.withLink} />
          <EtPost.SharedPost.Attachment>
            <EtPost.Link {...mockAttachments.link} onPress={() => console.log('Link pressed')} />
          </EtPost.SharedPost.Attachment>
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Link - no thumbnail */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Link Preview (no thumbnail)
      </EtText>
      <EtPost {...defaultOuterPost} text="Good market overview for those who missed today's session." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header displayName={mockUsers.melissa.displayName} avatar={mockUsers.melissa.avatar} timestamp="4h" />
          <EtPost.SharedPost.Attachment>
            <EtPost.Link {...mockAttachments.linkNoThumb} onPress={() => console.log('Link pressed')} />
          </EtPost.SharedPost.Attachment>
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Trade card */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        With Trade Card
      </EtText>
      <EtPost {...defaultOuterPost} text="Following this trade - NVDA is a beast right now." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header
            displayName={mockUsers.akansha.displayName}
            avatar={mockUsers.akansha.avatar}
            timestamp="30m"
            onUserPress={() => console.log('Shared user pressed')}
          />
          <EtPost.SharedPost.Body text={mockSharedPosts.withTrade} />
          <EtPost.SharedPost.Attachment>
            <EtPost.Trade {...mockAttachments.trade} onPress={() => console.log('Trade pressed')} />
          </EtPost.SharedPost.Attachment>
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Header only */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Header Only (deleted / no body)
      </EtText>
      <EtPost {...defaultOuterPost} text="This post inspired me to rethink my strategy." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost>
          <EtPost.SharedPost.Header displayName={mockUsers.marco.displayName} avatar={mockUsers.marco.avatar} timestamp="2w" />
        </EtPost.SharedPost>
        <DefaultFooter />
      </EtPost>

      {/* Deleted (tombstone placeholder for a removed original) */}
      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Deleted
      </EtText>
      <EtPost {...defaultOuterPost} text="Worth reading — even if the original is gone." onMenuPress={() => console.log('Menu')}>
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.SharedPost.Deleted text="The shared post was deleted" testID="feed-shared-post-deleted" />
        <DefaultFooter />
      </EtPost>
    </ScrollView>
  ),
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: X4,
  },
  showcase: {
    padding: X4,
    gap: X4,
  },
  title: {
    marginBottom: X4,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: X4,
    marginBottom: X2,
  },
  description: {
    marginBottom: X3,
    opacity: 0.8,
  },
});
