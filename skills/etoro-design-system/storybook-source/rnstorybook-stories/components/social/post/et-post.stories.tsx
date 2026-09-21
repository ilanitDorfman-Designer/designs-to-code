import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EtPost, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X2, X3, X4 } from 'etoro-ui/core/styles';

// Mock user data
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
};

// Mock post content
const mockPosts = {
  short: 'Just closed my $AAPL position with a solid 15% gain! The tech sector is looking strong.',
  medium:
    'This is something that annoys me about using social trading platforms. Everyone talks about their winners but rarely discusses their losses. Real traders know that managing risk is key!',
  long: `Market analysis: After careful consideration of the current market conditions and technical indicators, I believe we're entering a bullish phase for tech stocks.

Apple's recent product launches and strong consumer demand, combined with their services revenue growth, make it a compelling investment. However, always remember to manage your risk and never invest more than you can afford to lose.

The key factors I'm watching:
• Q4 earnings expectations
• Supply chain improvements
• Services revenue growth
• iPhone 16 sales data

This is not financial advice - always do your own research!`,
};

// Mock attachment data
const mockAttachments = {
  image: {
    source: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  },
  video: {
    thumbnailSource: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    title: 'Intel Stock Analysis - Value Perspective on AI Boom',
    host: 'www.youtube.com',
    description:
      'Intel is investing big on dominating the AI semiconductor revolution going forward. Here is a value investing perspective discussing Intel stock and the risk...',
  },
  videoNoMeta: {
    thumbnailSource: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
  },
  link: {
    url: 'https://www.etoro.com/people/marcomazzali',
    title: "@MarcoMazzali's profile on eToro",
    host: 'www.etoro.com',
    description: 'The Wallaby Project is an ethical investment portfolio on eToro that combines financial growth with real...',
    thumbnailSource: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200',
  },
  linkNoThumb: {
    url: 'https://www.reuters.com/markets',
    title: 'Global Markets Overview - Reuters',
    host: 'www.reuters.com',
    description: 'Get the latest global markets news, including stock market data, bond yields, commodities, and currencies.',
  },
  videoLink: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Intel Stock Analysis - Value Perspective on AI Boom',
    host: 'www.youtube.com',
    description: 'Intel is investing big on dominating the AI semiconductor revolution going forward.',
    thumbnailSource: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200',
    type: 'video' as const,
  },
};

/** Typed map tying each attachment key to the concrete props of its component */
type AttachmentComponentMap = {
  image: typeof EtPost.Image;
  video: typeof EtPost.Video;
  videoNoMeta: typeof EtPost.Video;
  link: typeof EtPost.Link;
  linkNoThumb: typeof EtPost.Link;
  videoLink: typeof EtPost.Link;
};

const ATTACHMENT_COMPONENTS: AttachmentComponentMap = {
  image: EtPost.Image,
  video: EtPost.Video,
  videoNoMeta: EtPost.Video,
  link: EtPost.Link,
  linkNoThumb: EtPost.Link,
  videoLink: EtPost.Link,
};

// Wrapper for interactive stories - simple toggle behavior
const EtPostWrapper = (props: any) => {
  const [isLiked, setIsLiked] = useState(props.isLiked ?? false);
  const [isSaved, setIsSaved] = useState(props.isSaved ?? false);

  const selectedUser = mockUsers[props.selectedUser as keyof typeof mockUsers] || mockUsers.akansha;

  const attachmentProps = props.attachmentType ? mockAttachments[props.attachmentType as keyof typeof mockAttachments] : undefined;

  const attachmentKey = props.attachmentType as keyof AttachmentComponentMap | undefined;
  const AttachmentComponent = attachmentKey ? ATTACHMENT_COMPONENTS[attachmentKey] : undefined;

  return (
    <EtPost
      displayName={selectedUser.displayName}
      avatar={selectedUser.avatar}
      location={props.showLocation ? selectedUser.location : undefined}
      text={props.text || mockPosts.medium}
      timestamp={props.timestamp || '2h'}
      isEdited={props.isEdited}
      maxLines={props.maxLines}
      haptics={props.haptics}
      onPress={() => console.log('Post pressed')}
      onUserPress={() => console.log('User pressed')}
      onMenuPress={props.showMenu ? () => console.log('Menu pressed') : undefined}
      style={props.style}
      testID={props.testID}
    >
      <EtPost.Header />
      <EtPost.Body />
      {props.showTranslate && (
        <EtPost.Translate
          linkText={props.translateText ?? 'See translation'}
          loading={props.translateLoading}
          onPress={() => console.log('Translate pressed')}
        />
      )}
      {AttachmentComponent &&
        attachmentProps &&
        React.createElement(AttachmentComponent as unknown as React.FC<Record<string, unknown>>, {
          ...attachmentProps,
          onPress: () => console.log('Attachment pressed'),
        })}
      <EtPost.Footer>
        <EtPost.Likes onPress={() => setIsLiked((prev: boolean) => !prev)} isActive={isLiked}>
          {props.likes ?? 247}
        </EtPost.Likes>
        <EtPost.Comments onPress={() => console.log('Comment pressed')}>{props.comments ?? 121}</EtPost.Comments>
        <EtPost.Shares onPress={() => console.log('Share pressed')}>{props.shares ?? 33}</EtPost.Shares>
        <EtPost.Save onPress={() => setIsSaved((prev: boolean) => !prev)} isActive={isSaved} />
      </EtPost.Footer>
    </EtPost>
  );
};

const meta = {
  title: 'eToro-UI/Components/Social/EtPost',
  component: EtPostWrapper,
  argTypes: {
    // User Selection
    selectedUser: {
      control: { type: 'select' },
      options: ['akansha', 'yoni', 'melissa'],
      description: 'Select user to display',
    },
    // Post Content
    text: {
      control: { type: 'text' },
      description: 'Post text content',
    },
    timestamp: {
      control: { type: 'text' },
      description: 'Timestamp display',
    },
    isEdited: {
      control: { type: 'boolean' },
      description: 'Show "Edited" badge',
    },
    // Display Options
    showLocation: {
      control: { type: 'boolean' },
      description: 'Show user location',
    },
    showMenu: {
      control: { type: 'boolean' },
      description: 'Show menu button',
    },
    maxLines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Max lines before "Show More"',
    },
    // Translation
    showTranslate: {
      control: { type: 'boolean' },
      description: 'Show translation link below body',
    },
    translateText: {
      control: { type: 'text' },
      description: 'Translation link text',
    },
    translateLoading: {
      control: { type: 'boolean' },
      description: 'Translation link loading state',
    },
    // Attachment
    attachmentType: {
      control: { type: 'select' },
      options: [undefined, 'image', 'video', 'videoNoMeta', 'link', 'linkNoThumb', 'videoLink'],
      description: 'Attachment type to display',
    },
    // Engagement counts (passed to compound footer children)
    likes: {
      control: { type: 'number', min: 0, max: 10000 },
      description: 'Number of likes',
    },
    comments: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'Number of comments',
    },
    shares: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'Number of shares',
    },
    isLiked: {
      control: { type: 'boolean' },
      description: 'Initial liked state',
    },
    isSaved: {
      control: { type: 'boolean' },
      description: 'Initial saved state',
    },
    // Interaction
    haptics: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback',
    },
  },
  args: {
    selectedUser: 'akansha',
    text: mockPosts.medium,
    timestamp: '2h',
    isEdited: false,
    showLocation: true,
    showMenu: true,
    maxLines: 4,
    showTranslate: false,
    translateText: 'See translation',
    translateLoading: false,
    attachmentType: undefined,
    likes: 247,
    comments: 121,
    shares: 33,
    isLiked: false,
    isSaved: false,
    haptics: true,
  },
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtPostWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive story with full controls
export const Interactive: Story = {
  render: (args) => <EtPostWrapper {...args} />,
};

// Basic post
export const BasicPost: Story = {
  args: {
    text: mockPosts.short,
    showMenu: true,
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with "Edited" badge
export const EditedPost: Story = {
  args: {
    text: mockPosts.medium,
    isEdited: true,
    showMenu: true,
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Long post with "Show More"
export const LongPost: Story = {
  args: {
    text: mockPosts.long,
    maxLines: 4,
    showMenu: true,
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with image attachment
export const PostWithImage: Story = {
  args: {
    text: 'Check out this amazing view from my trading setup!',
    attachmentType: 'image',
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with video attachment
export const PostWithVideo: Story = {
  args: {
    text: 'www.youtube.com/watch?v=8oBCqhuZej0',
    attachmentType: 'video',
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with video attachment (thumbnail only, no metadata)
export const PostWithVideoNoMeta: Story = {
  args: {
    text: 'Check out this video I found!',
    attachmentType: 'videoNoMeta',
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with link preview
export const PostWithLinkPreview: Story = {
  args: {
    text: "Check out @MarcoMazzali's page on eToro!",
    attachmentType: 'link',
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with link preview (no thumbnail)
export const PostWithLinkNoThumb: Story = {
  args: {
    text: 'Great overview of global markets from Reuters.',
    attachmentType: 'linkNoThumb',
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with video link preview (link card with play icon overlay)
export const PostWithVideoLink: Story = {
  args: {
    text: 'Check out this video!',
    attachmentType: 'videoLink',
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Post with translation link
export const PostWithTranslationLink: Story = {
  render: function TranslationLinkStory() {
    const [state, setState] = useState<'idle' | 'loading' | 'translated'>('idle');
    // Original (German) is intentionally much longer than the translation (English) to
    // demonstrate how the post body re-flows when the user toggles between them — a
    // common real-world translation pattern (German is typically ~30–50% longer than
    // English; here we exaggerate the gap to make the layout shift visible).
    const originalText =
      'Liebe Investoren-Community, nach einer eingehenden Analyse der aktuellen Marktbedingungen und der bevorstehenden Zentralbankentscheidungen habe ich beschlossen, meine Position in $AAPL teilweise zu reduzieren. Die makroökonomischen Indikatoren deuten auf eine kurzfristige Volatilität hin, und ich bevorzuge es, einen Teil meiner Gewinne mitzunehmen, bevor sich der Markt neu kalibriert.';
    const translatedText = "Hi all — trimmed my $AAPL position; macro signals point to short-term volatility, so I'm taking some profit.";

    const handlePress = () => {
      if (state === 'idle') {
        setState('loading');
        setTimeout(() => setState('translated'), 1500);
      } else {
        setState('idle');
      }
    };

    const linkText = state === 'translated' ? 'Show original' : 'See translation';
    const displayText = state === 'translated' ? translatedText : originalText;

    return (
      <ScrollView contentContainerStyle={styles.showcase}>
        <EtText variant="heading-base" style={styles.title}>
          Post with Translation Link
        </EtText>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Interactive
        </EtText>
        <EtPost
          displayName="Akansha Trivedi"
          avatar={mockUsers.akansha.avatar}
          location="Germany"
          text={displayText}
          timestamp="2h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Translate linkText={linkText} loading={state === 'loading'} onPress={handlePress} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{89}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{12}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{5}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          See Translation (idle)
        </EtText>
        <EtPost
          displayName="Melissa_T"
          avatar={mockUsers.melissa.avatar}
          location="London, UK"
          text="Marktanalyse: Nach sorgfältiger Prüfung der aktuellen Marktbedingungen glaube ich, dass wir in eine bullische Phase eintreten."
          timestamp="5m"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Translate linkText="See translation" onPress={() => console.log('Translate')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{247}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{121}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{33}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Loading
        </EtText>
        <EtPost
          displayName="YoniAssia"
          avatar={mockUsers.yoni.avatar}
          location="San Francisco, CA"
          text="Bonjour à tous! Je viens de clôturer ma position sur $AAPL avec un gain de 15%."
          timestamp="1h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Translate linkText="See translation" loading onPress={() => console.log('Translate')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{156}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{45}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{12}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Show Original (translated)
        </EtText>
        <EtPost
          displayName="Akansha Trivedi"
          avatar={mockUsers.akansha.avatar}
          location="Germany"
          text="Hello everyone! I just closed my $AAPL position with a 15% gain. The tech sector looks strong."
          timestamp="3h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Translate linkText="Show original" onPress={() => console.log('Show original')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{324}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{67}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{23}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
      </ScrollView>
    );
  },
  args: {},
};

// Post with saved state active
export const SavedPost: Story = {
  args: {
    text: mockPosts.medium,
    isSaved: true,
    showMenu: true,
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// High engagement post
export const HighEngagement: Story = {
  args: {
    selectedUser: 'yoni',
    text: 'Major announcement coming soon! Stay tuned for something that will change the way you trade. #Innovation',
    likes: 5247,
    comments: 892,
    shares: 234,
    isLiked: true,
    showMenu: true,
  },
  render: (args) => <EtPostWrapper {...args} />,
};

// Showcase all variations
export const AllVariations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        EtPost Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Basic Post
      </EtText>
      <EtPost
        displayName="Akansha Trivedi"
        avatar={mockUsers.akansha.avatar}
        location="Germany"
        text={mockPosts.short}
        timestamp="2h"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{247}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{121}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{33}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Edited Post with Menu
      </EtText>
      <EtPost
        displayName="Akansha Trivedi"
        avatar={mockUsers.akansha.avatar}
        location="Germany"
        text={mockPosts.medium}
        timestamp="5m"
        isEdited
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{89}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{12}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{5}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Long Post (Show More)
      </EtText>
      <EtPost
        displayName="Melissa_T"
        avatar={mockUsers.melissa.avatar}
        location="London, UK"
        text={mockPosts.long}
        timestamp="3h"
        maxLines={4}
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{156}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{45}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{12}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Post with Image Attachment
      </EtText>
      <EtPost
        displayName="YoniAssia"
        avatar={mockUsers.yoni.avatar}
        location="San Francisco, CA"
        text="Check out this amazing view from our new office!"
        timestamp="1h"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Image {...mockAttachments.image} onPress={() => console.log('Image pressed')} />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{892}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{156}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{78}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Post with Video Attachment
      </EtText>
      <EtPost
        displayName="Akansha Trivedi"
        avatar={mockUsers.akansha.avatar}
        location="Germany"
        text="www.youtube.com/watch?v=8oBCqhuZej0"
        timestamp="2y"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Video {...mockAttachments.video} onPress={() => console.log('Video pressed')} />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{0}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{1}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{2}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Post with Link Preview
      </EtText>
      <EtPost
        displayName="Melissa_T"
        avatar={mockUsers.melissa.avatar}
        location="London, UK"
        text="Check out @MarcoMazzali's page on eToro!"
        timestamp="8m"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Link {...mockAttachments.link} onPress={() => console.log('Link pressed')} />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{0}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{0}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{0}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Link Preview (No Thumbnail)
      </EtText>
      <EtPost
        displayName="YoniAssia"
        avatar={mockUsers.yoni.avatar}
        text="Great overview of global markets from Reuters."
        timestamp="4h"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Link {...mockAttachments.linkNoThumb} onPress={() => console.log('Link pressed')} />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{45}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{8}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{3}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Link Preview (Video)
      </EtText>
      <EtPost
        displayName="YoniAssia"
        avatar={mockUsers.yoni.avatar}
        text="Check out this video!"
        timestamp="2h"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Link {...mockAttachments.videoLink} onPress={() => console.log('Video link pressed')} />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{12}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{3}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{1}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Post with Save Button (active)
      </EtText>
      <EtPost
        displayName="Akansha Trivedi"
        avatar={mockUsers.akansha.avatar}
        location="Germany"
        text="Portfolio diversification tip: Don't put all your eggs in one basket!"
        timestamp="6h"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{324}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{67}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{23}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} isActive />
        </EtPost.Footer>
      </EtPost>
    </ScrollView>
  ),
  args: {},
};

// Compound component usage
export const CompoundUsage: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Compound Component Pattern
      </EtText>

      <EtText variant="body-secondary-regular" style={styles.description}>
        EtPost supports compound component pattern for custom layouts:
      </EtText>

      <EtPost
        displayName="Akansha Trivedi"
        avatar={mockUsers.akansha.avatar}
        location="Germany"
        text={mockPosts.medium}
        timestamp="2h"
        onMenuPress={() => console.log('Menu')}
      >
        <EtPost.Header />
        <EtPost.Body />
        <EtPost.Footer>
          <EtPost.Likes onPress={() => console.log('Like')}>{247}</EtPost.Likes>
          <EtPost.Comments onPress={() => console.log('Comment')}>{121}</EtPost.Comments>
          <EtPost.Shares onPress={() => console.log('Share')}>{33}</EtPost.Shares>
          <EtPost.Save onPress={() => console.log('Save')} />
        </EtPost.Footer>
      </EtPost>
    </ScrollView>
  ),
  args: {},
};

/**
 * Attachment Architecture Story
 *
 * Demonstrates the dynamic attachment slot system in EtPost.
 * Attachment components (EtPost.Image, EtPost.Video, EtPost.Link,
 * EtPost.Trade) are placed directly as children of EtPost.
 */
export const AttachmentArchitecture: Story = {
  render: function AttachmentArchitectureStory() {
    const { colors } = useEtoroTheme();
    return (
      <ScrollView contentContainerStyle={styles.showcase}>
        <EtText variant="heading-base" style={styles.title}>
          Attachment Architecture
        </EtText>

        <EtText variant="body-secondary-regular" style={styles.description}>
          Use EtPost.Image, .Video, .Link, .Trade, .Tag directly as children.
        </EtText>

        {/* Text Only */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Text Only (No Attachment)
        </EtText>
        <EtPost
          displayName="Akansha Trivedi"
          avatar={mockUsers.akansha.avatar}
          location="Germany"
          text={mockPosts.short}
          timestamp="2h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{247}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{121}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{33}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Image Attachment */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Image Attachment
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          EtPost.Image
        </EtText>
        <EtPost
          displayName="YoniAssia"
          avatar={mockUsers.yoni.avatar}
          location="San Francisco, CA"
          text="Check out this amazing view from our new office!"
          timestamp="1h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Image {...mockAttachments.image} onPress={() => console.log('Image pressed - open fullscreen')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{892}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{156}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{78}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Video Attachment */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Video Attachment (with metadata)
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          EtPost.Video - thumbnail + play icon + metadata
        </EtText>
        <EtPost
          displayName="Akansha Trivedi"
          avatar={mockUsers.akansha.avatar}
          location="Germany"
          text="www.youtube.com/watch?v=8oBCqhuZej0"
          timestamp="2y"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Video {...mockAttachments.video} onPress={() => console.log('Video pressed')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{0}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{1}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{2}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Video Attachment - thumbnail only */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Video Attachment (thumbnail only)
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          EtPost.Video - thumbnail only
        </EtText>
        <EtPost
          displayName="Melissa_T"
          avatar={mockUsers.melissa.avatar}
          location="London, UK"
          text="Check out this video I found!"
          timestamp="30m"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Video {...mockAttachments.videoNoMeta} onPress={() => console.log('Video pressed')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{12}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{3}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{1}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Link Preview */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Link Preview (with thumbnail)
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          EtPost.Link - with thumbnail
        </EtText>
        <EtPost
          displayName="Melissa_T"
          avatar={mockUsers.melissa.avatar}
          location="London, UK"
          text="Check out @MarcoMazzali's page on eToro!"
          timestamp="8m"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Link {...mockAttachments.link} onPress={() => console.log('Link pressed')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{0}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{0}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{0}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Link Preview - no thumbnail */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Link Preview (no thumbnail)
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          EtPost.Link - no thumbnail
        </EtText>
        <EtPost
          displayName="YoniAssia"
          avatar={mockUsers.yoni.avatar}
          text="Great overview of global markets from Reuters."
          timestamp="4h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Link {...mockAttachments.linkNoThumb} onPress={() => console.log('Link pressed')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{45}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{8}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{3}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Trade Post: Status Tag + Asset Chip */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Trade Post (Status Tag + Asset Chip)
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          EtPost.Tag - status pill below the header + EtPost.Trade - tappable asset chip
        </EtText>
        <EtPost
          displayName="YoniAssia"
          avatar={mockUsers.yoni.avatar}
          location="San Francisco, CA"
          text="Riding the AI wave 🚀"
          timestamp="12m"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Tag>
            <EtText variant="caption-medium" style={{ color: colors.textPrimaryNeutral }}>
              Opened Buy{' '}
              <EtText variant="caption-medium" style={{ color: colors.actionBrandText }} onPress={() => console.log('Cashtag pressed')}>
                $NVDA
              </EtText>
            </EtText>
          </EtPost.Tag>
          <EtPost.Body />
          <EtPost.Trade
            symbolName="NVDA"
            displayName="NVIDIA Corporation"
            avatarSource="https://etoro-cdn.etorostatic.com/market-avatars/nvda/80x80.png"
            currentPrice={186.86}
            priceChange={1.01}
            priceChangePercent={0.54}
            onPress={() => console.log('Trade pressed')}
          />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{78}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{9}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{3}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>

        {/* Sell / Short variant */}
        <EtText variant="heading-compact" style={styles.sectionTitle}>
          Trade Post (Sell / Short)
        </EtText>
        <EtText variant="caption-regular" style={styles.description}>
          Sell / Short variant (negative price change)
        </EtText>
        <EtPost
          displayName="Melissa_T"
          avatar={mockUsers.melissa.avatar}
          location="London, UK"
          text="Taking some profit off the table."
          timestamp="1h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Tag>
            <EtText variant="caption-medium" style={{ color: colors.textPrimaryNeutral }}>
              Closed Sell{' '}
              <EtText variant="caption-medium" style={{ color: colors.actionBrandText }} onPress={() => console.log('Cashtag pressed')}>
                $TSLA
              </EtText>
            </EtText>
          </EtPost.Tag>
          <EtPost.Body />
          <EtPost.Trade
            symbolName="TSLA"
            displayName="Tesla Inc."
            avatarSource="https://etoro-cdn.etorostatic.com/market-avatars/tsla/80x80.png"
            currentPrice={242.68}
            priceChange={-3.28}
            priceChangePercent={-1.33}
            onPress={() => console.log('Trade pressed')}
          />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{34}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{6}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{2}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
      </ScrollView>
    );
  },
  args: {},
};

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
