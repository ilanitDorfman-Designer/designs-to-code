import React, { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { EtPostProps } from './api/types';
import { PostProvider } from './context';
import {
  FooterComments,
  FooterLikes,
  FooterSave,
  FooterShares,
  ImageRenderer,
  LinkPreviewRenderer,
  PollRenderer,
  PostBody,
  PostFooter,
  PostHeader,
  PostTranslate,
  SharedPost,
  TagRenderer,
  TradeRenderer,
  VideoRenderer,
} from './subcomponents';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_LINES = 4;

// ============================================================================
// Main Component
// ============================================================================

/**
 * EtPost - Social post component with composition-only pattern
 *
 * ## Component Architecture
 *
 * The post is composed of subcomponents that must be explicitly rendered:
 * - `EtPost.Header` - User info, timestamp, menu
 * - `EtPost.Body` - Text content with "Show More/Less"
 * - `EtPost.Image` - Image attachment
 * - `EtPost.Video` - Video attachment with thumbnail + play icon
 * - `EtPost.Link` - Link preview card
 * - `EtPost.Trade` - Tappable asset chip (avatar + symbol + directional price change)
 * - `EtPost.Tag` - Self-hugging status pill wrapping caller-provided content
 * - `EtPost.Poll` - Interactive poll with vote/results
 * - `EtPost.Footer` - Container for engagement actions
 * - `EtPost.Likes` - Like icon + count
 * - `EtPost.Comments` - Comment icon + count
 * - `EtPost.Shares` - Share icon + count
 * - `EtPost.Save` - Bookmark icon
 *
 * @example
 * ```tsx
 * <EtPost
 *   displayName="Akansha Trivedi"
 *   avatar="https://example.com/avatar.jpg"
 *   text="This is something that annoys me..."
 *   timestamp="2h"
 *   onMenuPress={handleMenu}
 * >
 *   <EtPost.Header />
 *   <EtPost.Body />
 *   <EtPost.Footer>
 *     <EtPost.Likes onPress={handleLike} isActive={isLiked}>{10}</EtPost.Likes>
 *     <EtPost.Comments>{121}</EtPost.Comments>
 *     <EtPost.Shares>{33}</EtPost.Shares>
 *     <EtPost.Save onPress={handleSave} isActive={isSaved} />
 *   </EtPost.Footer>
 * </EtPost>
 * ```
 */
function EtPostBase(props: EtPostProps) {
  const { children, style, testID, accessibilityLabel, accessibilityHint, maxLines = DEFAULT_MAX_LINES, onPress } = props;

  const { colors } = useEtoroTheme();

  return (
    <PostProvider {...props} maxLines={maxLines}>
      <Pressable
        style={[styles.container, { backgroundColor: colors.carbon050, borderBottomColor: colors.carbonSecondaryDivider }, style]}
        onPress={onPress}
        disabled={!onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={onPress ? 'button' : undefined}
      >
        {children}
      </Pressable>
    </PostProvider>
  );
}

EtPostBase.displayName = 'EtPost';

// ============================================================================
// Compound Component Export
// ============================================================================

/**
 * EtPost with compound subcomponents attached
 *
 * ## Available subcomponents:
 *
 * ### Layout Components
 * - `EtPost.Header` - User info, timestamp, menu
 * - `EtPost.Body` - Text content with "Show More/Less"
 * - `EtPost.Translate` - "See translation" / "Show original" link
 * - `EtPost.Footer` - Container for engagement actions
 * - `EtPost.Likes` - Like icon + count
 * - `EtPost.Comments` - Comment icon + count
 * - `EtPost.Shares` - Share icon + count
 * - `EtPost.Save` - Bookmark icon
 *
 * ### Attachment Components
 * - `EtPost.Image` - Full-width image attachment
 * - `EtPost.Video` - Video thumbnail with play icon + metadata
 * - `EtPost.Link` - Link preview card
 * - `EtPost.Trade` - Tappable asset chip (avatar + symbol + directional price change)
 * - `EtPost.Tag` - Self-hugging status pill wrapping caller-provided content
 * - `EtPost.Poll` - Interactive poll with votable options / results
 *
 * ### Composition Components
 * - `EtPost.SharedPost` - Nested shared post with compact header + body + attachment wrapper
 * - `EtPost.SharedPost.Deleted` - Non-interactive placeholder shown when the shared post was deleted
 */
const MemoizedEtPost: FC<EtPostProps> = React.memo(EtPostBase);

export const EtPost = Object.assign(MemoizedEtPost, {
  displayName: 'EtPost',
  // Layout components
  Header: PostHeader,
  Body: PostBody,
  Translate: PostTranslate,
  Footer: PostFooter,
  // Engagement action components
  Likes: FooterLikes,
  Comments: FooterComments,
  Shares: FooterShares,
  Save: FooterSave,
  // Attachment components
  Image: ImageRenderer,
  Video: VideoRenderer,
  Link: LinkPreviewRenderer,
  Trade: TradeRenderer,
  Tag: TagRenderer,
  Poll: PollRenderer,
  // Composition components
  SharedPost: SharedPost,
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
});
