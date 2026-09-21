import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtPost, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { X1, X10, X2, X3, X4, X6, X8 } from 'etoro-ui/core/styles';

type Story = StoryObj<{}>;

// Mock data
const mockUser = {
  displayName: 'Akansha Trivedi',
  avatar: 'https://i.pravatar.cc/150?u=akansha',
  location: 'Germany',
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

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/Social/EtPost/Introduction',
  parameters: {
    notes: 'Complete guide for the EtPost component - the refactored social post component.',
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
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(247);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = () => {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    };

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            EtPost
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Refactored social post component with compound pattern support
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Key Features
          </EtText>
          <EtText style={styles.featureText}>• Composition-only pattern (children required)</EtText>
          <EtText style={styles.featureText}>• Flat props API - no nested objects required</EtText>
          <EtText style={styles.featureText}>• Modular attachment system (image, video, poll, etc.)</EtText>
          <EtText style={styles.featureText}>• "Edited" badge support</EtText>
          <EtText style={styles.featureText}>• "Show More/Less" for long text</EtText>
          <EtText style={styles.featureText}>• Save button support</EtText>
          <EtText style={styles.featureText}>• Performance optimized with React.memo & useCallback</EtText>
        </View>

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Basic Usage
        </EtText>
        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          location={mockUser.location}
          text="Just closed my $AAPL position with a solid 15% gain! The tech sector is looking strong this quarter."
          timestamp="2h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Footer>
            <EtPost.Likes onPress={handleLike} isActive={isLiked}>
              {likes}
            </EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{121}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{33}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
        <CodeBlock
          title="Basic Post"
          code={`<EtPost
  displayName="Akansha Trivedi"
  avatar={require('./avatar.png')}
  location="Germany"
  text="Just closed my $AAPL position..."
  timestamp="2h"
  onMenuPress={handleMenu}
>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike} isActive={isLiked}>{247}</EtPost.Likes>
    <EtPost.Comments onPress={handleComment}>{121}</EtPost.Comments>
    <EtPost.Shares onPress={handleShare}>{33}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtText variant="heading-base" style={styles.sectionTitle}>
          With "Edited" Badge
        </EtText>
        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          location={mockUser.location}
          text="This post has been edited to add more context about market conditions."
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
        <CodeBlock
          title="Edited Post"
          code={`<EtPost
  {...props}
  isEdited
  onMenuPress={handleMenu}
>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{89}</EtPost.Likes>
    <EtPost.Comments>{12}</EtPost.Comments>
    <EtPost.Shares>{5}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtText variant="heading-base" style={styles.sectionTitle}>
          With Save Button
        </EtText>
        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          text="Bookmark this post for later reference! Great trading tips inside."
          timestamp="1h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{324}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{67}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{23}</EtPost.Shares>
            <EtPost.Save onPress={() => setIsSaved(!isSaved)} isActive={isSaved} />
          </EtPost.Footer>
        </EtPost>
        <CodeBlock
          title="Post with Save"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{324}</EtPost.Likes>
    <EtPost.Comments>{67}</EtPost.Comments>
    <EtPost.Shares>{23}</EtPost.Shares>
    <EtPost.Save onPress={() => setIsSaved(!isSaved)} isActive={isSaved} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Compound Component Pattern
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.description}>
          Use subcomponents for custom layouts:
        </EtText>
        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          location={mockUser.location}
          text="Custom layout with compound components"
          timestamp="3h"
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
        <CodeBlock
          title="Compound Usage"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{156}</EtPost.Likes>
    <EtPost.Comments>{45}</EtPost.Comments>
    <EtPost.Shares>{12}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Attachment Slot
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.description}>
          Use EtPost.Image, .Video, .Link, .Trade directly as children
        </EtText>
        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          location={mockUser.location}
          text="Check out this amazing view from our office!"
          timestamp="1h"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Image source="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800" onPress={() => console.log('Image pressed')} />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{892}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{156}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{78}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
        <CodeBlock
          title="Image Attachment"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Image
    source="https://..."
    onPress={() => openFullscreen()}
  />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{892}</EtPost.Likes>
    <EtPost.Comments>{156}</EtPost.Comments>
    <EtPost.Shares>{78}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          text="www.youtube.com/watch?v=8oBCqhuZej0"
          timestamp="2y"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Video
            thumbnailSource="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800"
            title="Intel Stock Analysis - Value Perspective"
            host="www.youtube.com"
            description="Intel is investing big on dominating the AI..."
            onPress={() => console.log('Video pressed')}
          />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{0}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{1}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{2}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
        <CodeBlock
          title="Video Attachment"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Video
    thumbnailSource="https://..."
    title="Video Title"
    host="www.youtube.com"
    description="Description..."
    onPress={() => openVideo()}
  />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{0}</EtPost.Likes>
    <EtPost.Comments>{1}</EtPost.Comments>
    <EtPost.Shares>{2}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          text="Check out this profile on eToro!"
          timestamp="8m"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
          <EtPost.Body />
          <EtPost.Link
            url="https://www.etoro.com/people/marcomazzali"
            title="@MarcoMazzali's profile on eToro"
            host="www.etoro.com"
            description="The Wallaby Project is an ethical investment..."
            thumbnailSource="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200"
            onPress={() => console.log('Link pressed')}
          />
          <EtPost.Footer>
            <EtPost.Likes onPress={() => console.log('Like')}>{0}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{0}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{0}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
        <CodeBlock
          title="Link Preview"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Link
    url="https://..."
    title="Article Title"
    host="www.example.com"
    description="Description..."
    thumbnailSource="https://..."
    onPress={() => openLink()}
  />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{0}</EtPost.Likes>
    <EtPost.Comments>{0}</EtPost.Comments>
    <EtPost.Shares>{0}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          text="Just opened a new position on NVIDIA! 🚀"
          timestamp="30m"
          onMenuPress={() => console.log('Menu')}
        >
          <EtPost.Header />
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
            <EtPost.Likes onPress={() => console.log('Like')}>{56}</EtPost.Likes>
            <EtPost.Comments onPress={() => console.log('Comment')}>{12}</EtPost.Comments>
            <EtPost.Shares onPress={() => console.log('Share')}>{4}</EtPost.Shares>
            <EtPost.Save onPress={() => console.log('Save')} />
          </EtPost.Footer>
        </EtPost>
        <CodeBlock
          title="Trade Attachment"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Trade
    symbolName="NVDA"
    displayName="NVIDIA Corporation"
    avatarSource="https://..."
    currentPrice={186.86}
    priceChange={1.01}
    priceChangePercent={0.54}
    onPress={() => openTradeDetails()}
  />
  <EtPost.Footer>
    <EtPost.Likes onPress={handleLike}>{56}</EtPost.Likes>
    <EtPost.Comments>{12}</EtPost.Comments>
    <EtPost.Shares>{4}</EtPost.Shares>
    <EtPost.Save onPress={handleSave} />
  </EtPost.Footer>
</EtPost>`}
        />

        <EtText variant="heading-base" style={styles.sectionTitle}>
          Trade Status Tag
        </EtText>
        <EtText variant="body-secondary-regular" style={styles.description}>
          EtPost.Tag is a self-hugging status pill. Pass pre-styled, translation-free content (e.g. a status line with a highlighted cashtag) as
          children. For trade/order posts it sits below the header, above the body, and pairs with the EtPost.Trade asset chip.
        </EtText>
        <EtPost
          displayName={mockUser.displayName}
          avatar={mockUser.avatar}
          location={mockUser.location}
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
        <CodeBlock
          title="Status Tag + Trade Chip"
          code={`<EtPost {...props}>
  <EtPost.Header />
  <EtPost.Tag>
    <EtText variant="caption-medium" style={{ color: colors.textPrimaryNeutral }}>
      Opened Buy{' '}
      <EtText variant="caption-medium" style={{ color: colors.actionBrandText }} onPress={openAsset}>
        $NVDA
      </EtText>
    </EtText>
  </EtPost.Tag>
  <EtPost.Body />
  <EtPost.Trade
    symbolName="NVDA"
    displayName="NVIDIA Corporation"
    avatarSource="https://..."
    currentPrice={186.86}
    priceChange={1.01}
    priceChangePercent={0.54}
    onPress={openTradeDetails}
  />
  <EtPost.Footer>{/* ... */}</EtPost.Footer>
</EtPost>`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtPostProps"
            code={`interface EtPostProps {
  // User Information
  displayName: string;             // Display name (required)
  avatar: string;                  // Avatar image URL (required)
  location?: string;               // User location

  // Post Content
  text: string;                    // Main text (required)
  timestamp: string;               // Display timestamp (required)
  isEdited?: boolean;              // Show "Edited" badge

  // Text Expansion
  maxLines?: number;               // Lines before "Show More" (default: 4)

  // Handlers
  onPress?: () => void;            // Post press
  onUserPress?: () => void;        // User press
  onMenuPress?: () => void;        // Menu button

  // Options
  haptics?: boolean;               // Haptic feedback (default: true)
  children: ReactNode;             // Compound components (required)

  // Style & Accessibility
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

// Footer action subcomponents:
// EtPost.Likes   — { children: number, onPress?, onCountPress?, isActive? }
// EtPost.Comments — { children: number, onPress?, onCountPress? }
// EtPost.Shares   — { children: number, onPress?, onCountPress? }
// EtPost.Save     — { onPress?, isActive? }`}
          />
        </View>

        <View style={styles.migration}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Legacy vs Current API
          </EtText>
          <CodeBlock
            title="Legacy vs Current"
            code={`// Legacy - Nested props (removed)
<EtPost
  user={{ displayName, avatar, location }}
  post={{ text, timestamp, id, type }}
  engagement={{ likes, comments, shares }}
  interaction={{ onLike, onComment, onShare }}
/>

// Current - Flat props + compound footer (children required)
<EtPost
  displayName={displayName}
  avatar={avatar}
  location={location}
  text={text}
  timestamp={timestamp}
>
  <EtPost.Header />
  <EtPost.Body />
  <EtPost.Footer>
    <EtPost.Likes onPress={onLike} isActive={isLiked}>{likes}</EtPost.Likes>
    <EtPost.Comments onPress={onComment}>{comments}</EtPost.Comments>
    <EtPost.Shares onPress={onShare}>{shares}</EtPost.Shares>
    <EtPost.Save onPress={onSave} isActive={isSaved} />
  </EtPost.Footer>
</EtPost>`}
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
    padding: X4,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: X6,
    paddingBottom: X4,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    textAlign: 'center',
    marginBottom: X2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  features: {
    marginBottom: X8,
  },
  featuresTitle: {
    marginBottom: X3,
  },
  featureText: {
    marginBottom: X1,
    opacity: 0.8,
  },
  sectionTitle: {
    marginTop: X6,
    marginBottom: X3,
  },
  description: {
    marginBottom: X3,
    opacity: 0.8,
  },
  apiReference: {
    marginTop: X6,
    paddingTop: X6,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  migration: {
    marginTop: X6,
    paddingTop: X6,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    marginBottom: X10,
  },
  apiTitle: {
    marginBottom: X4,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: X3,
    borderRadius: X2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: X3,
    paddingVertical: X2,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: X2,
    paddingVertical: X1,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: X3,
  },
});
