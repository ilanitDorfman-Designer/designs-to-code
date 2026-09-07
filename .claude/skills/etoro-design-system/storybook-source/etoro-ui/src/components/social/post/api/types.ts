import { ReactNode } from 'react';
import { AccessibilityRole, StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// Type Aliases & Enums
// ============================================================================

/** Trade direction */
export type TradeDirection = 'Long' | 'Short';

// ============================================================================
// Subcomponent Props
// ============================================================================

/**
 * Props for EtPost.Header subcomponent
 */
export interface PostHeaderProps {
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID prefix for internal elements (avatar, menu, userInfo) */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the header is activated */
  accessibilityHint?: string;
}

/**
 * Props for EtPost.Body subcomponent (text content only)
 */
export interface PostBodyProps {
  /**
   * Rich content with pre-built interactive elements (mentions, tags).
   *
   * When provided, `text` from context is still used for measurement/truncation
   * while children are used for display in both collapsed and expanded states.
   *
   * @example
   * ```tsx
   * <EtPost.Body>
   *   Buy <EtText onPress={handleTag} style={linkStyle}>$AAPL</EtText>!
   * </EtPost.Body>
   * ```
   */
  children?: ReactNode;
  /**
   * Override the text used for measurement and truncation. When omitted, falls back to
   * `text` from `usePostContext()`. Pass the translated text here when translation is active
   * so truncation and disclaimer visibility stay consistent with what is displayed.
   */
  text?: string;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID prefix for internal elements (text, showMore) */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Called when the expanded/collapsed state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Called after layout measurement with whether the text needs truncation */
  onTruncationChange?: (needsTruncation: boolean) => void;
}

/**
 * Props for EtPost.Footer compound container
 *
 * @example
 * ```tsx
 * <EtPost.Footer>
 *   <EtPost.Likes onPress={toggleLike} onCountPress={openDrawer} isActive={isLiked}>
 *     {likesCount}
 *   </EtPost.Likes>
 *   <EtPost.Comments onPress={openComments}>{commentsCount}</EtPost.Comments>
 *   <EtPost.Shares onPress={share}>{sharesCount}</EtPost.Shares>
 *   <EtPost.Save onPress={toggleSave} isActive={isSaved} />
 * </EtPost.Footer>
 * ```
 */
export interface PostFooterProps {
  /** Footer action subcomponents (Likes, Comments, Shares, Save) */
  children: ReactNode;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID prefix for internal elements */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the footer is activated */
  accessibilityHint?: string;
  /** Whether the element is accessible */
  accessible?: boolean;
  /** Accessibility role for the footer container */
  accessibilityRole?: AccessibilityRole;
}

// ============================================================================
// Footer Action Subcomponent Props
// ============================================================================

/** Props for EtPost.Likes — thumbs-up icon + count */
export interface FooterLikesProps {
  /** Like count to display (formatted via formatCompactNumber) */
  children: number;
  /** Called when the like icon is pressed */
  onPress?: () => void;
  /** Called when the count label is pressed (falls back to onPress) */
  onCountPress?: () => void;
  /** Whether the like is active (filled icon, brand color) */
  isActive?: boolean;
  /** Test ID prefix */
  testID?: string;
}

/** Props for EtPost.Comments — comment icon + count */
export interface FooterCommentsProps {
  /** Comment count to display (formatted via formatCompactNumber) */
  children: number;
  /** Called when the comment icon is pressed */
  onPress?: () => void;
  /** Called when the count label is pressed (falls back to onPress) */
  onCountPress?: () => void;
  /** Test ID prefix */
  testID?: string;
}

/** Props for EtPost.Shares — share icon + count */
export interface FooterSharesProps {
  /** Share count to display (formatted via formatCompactNumber) */
  children: number;
  /** Called when the share icon is pressed */
  onPress?: () => void;
  /** Called when the count label is pressed (falls back to onPress) */
  onCountPress?: () => void;
  /** Test ID prefix */
  testID?: string;
}

/** Props for EtPost.Save — bookmark icon only */
export interface FooterSaveProps {
  /** Called when the save icon is pressed */
  onPress?: () => void;
  /** Whether the save is active (filled icon, brand color) */
  isActive?: boolean;
  /** Test ID prefix */
  testID?: string;
}

// ============================================================================
// Translate Subcomponent Props
// ============================================================================

/** Props for EtPost.Translate — "See translation" / "Show original" link below body */
export interface PostTranslateProps {
  /** Localized CTA label (e.g. "See translation" or "Show original"). */
  linkText: string;
  /** Shows a loading spinner on the link while a translation request is in flight. */
  loading?: boolean;
  /** Called when the link is pressed. */
  onPress?: () => void;
  /** Override container styles. */
  style?: StyleProp<ViewStyle>;
  /** Test ID prefix. */
  testID?: string;
}

// ============================================================================
// SharedPost Compound Subcomponent Props
// ============================================================================

/**
 * Props for EtPost.SharedPost — outer frame with left border
 *
 * @example
 * ```tsx
 * <EtPost.SharedPost>
 *   <EtPost.SharedPost.Header displayName="Author" avatar="..." timestamp="2h" />
 *   <EtPost.SharedPost.Body text="Original content..." />
 *   <EtPost.SharedPost.Attachment>
 *     <EtPost.Image source="..." />
 *   </EtPost.SharedPost.Attachment>
 * </EtPost.SharedPost>
 * ```
 */
export interface SharedPostFrameProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when activated */
  accessibilityHint?: string;
}

/** Props for EtPost.SharedPost.Header — compact avatar + name + dot + timestamp */
export interface SharedPostHeaderProps {
  displayName: string;
  avatar: string;
  /** Pre-formatted display string (e.g., `"2h"`, `"Jan 15"`). The presentational
   * layer no longer formats; callers should localize via the shared
   * `formatCompactTimeFromString` helper in `@etoro/common/infra/translations`. */
  timestamp: string;
  onUserPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when activated */
  accessibilityHint?: string;
}

/** Props for EtPost.SharedPost.Body — expandable text via EtReadMoreText */
export interface SharedPostBodyProps {
  text: string;
  /**
   * Rich content with pre-built interactive elements (mentions, tags).
   *
   * When provided, `text` is still used for measurement/truncation
   * while children are used for display.
   */
  children?: ReactNode;
  maxLines?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Called when the expanded/collapsed state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Called after layout measurement with whether the text needs truncation */
  onTruncationChange?: (needsTruncation: boolean) => void;
}

/** Props for EtPost.SharedPost.Attachment — padded + rounded wrapper */
export interface SharedPostAttachmentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when activated */
  accessibilityHint?: string;
}

// ============================================================================
// SharedPostDeleted Subcomponent Props
// ============================================================================

/**
 * Props for EtPost.SharedPost.Deleted — informational placeholder shown in place
 * of the embedded original-post preview when the shared post has been deleted.
 *
 * Non-interactive by design. Renders as a muted card with an alert icon and the
 * caller-provided localized text. Mutually exclusive with the `<EtPost.SharedPost>`
 * active-share frame in the same post.
 *
 * Note: although exposed under the `EtPost.SharedPost.*` namespace, this
 * subcomponent is a leaf rendered directly under `<EtPost>` (not as a child of
 * `<EtPost.SharedPost>`).
 *
 * @example
 * ```tsx
 * <EtPost {...outerProps}>
 *   <EtPost.Header />
 *   <EtPost.Body />
 *   <EtPost.SharedPost.Deleted text={t('feedPostShared.shareDeleted')} />
 *   <EtPost.Footer>...</EtPost.Footer>
 * </EtPost>
 * ```
 */
export interface SharedPostDeletedProps {
  /**
   * Localized placeholder message (e.g. "The shared post was deleted").
   * Translation MUST happen at the consumer; etoro-ui is i18n-free by convention.
   */
  text: string;
  /** Override default container styles */
  style?: StyleProp<ViewStyle>;
  /** Test identifier for the placeholder root */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing the element to screen readers */
  accessibilityHint?: string;
}

// ============================================================================
// Main Props Interface
// ============================================================================

/**
 * Props for EtPost component
 *
 * EtPost uses a composition-only pattern where you must explicitly render
 * subcomponents as children. This provides maximum flexibility for custom layouts.
 *
 * Engagement data (likes, comments, shares, save) is passed directly to
 * footer subcomponents rather than to EtPost itself.
 *
 * @example
 * ```tsx
 * <EtPost
 *   displayName="Akansha Trivedi"
 *   avatar="https://example.com/avatar.jpg"
 *   text="This is my post content..."
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
export interface EtPostProps {
  // -------------------------------------------------------------------------
  // User Information
  // -------------------------------------------------------------------------

  /** User display name (e.g., full name or username) */
  displayName: string;

  /** User avatar image URL */
  avatar: string;

  /** User location (e.g., "Germany") */
  location?: string;

  // -------------------------------------------------------------------------
  // Post Content
  // -------------------------------------------------------------------------

  /** Main post text content */
  text: string;

  /** Pre-formatted post timestamp (e.g., `"2h"`, `"3d"`, `"Jan 15"`). The
   * presentational layer renders this as-is — callers own localization via
   * `formatCompactTimeFromString` in `@etoro/common/infra/translations`. */
  timestamp: string;

  /** Whether the post has been edited - shows "Edited" badge */
  isEdited?: boolean;

  // -------------------------------------------------------------------------
  // Text Expansion
  // -------------------------------------------------------------------------

  /** Maximum number of lines before showing "Show More" (default: 4) */
  maxLines?: number;

  // -------------------------------------------------------------------------
  // Interaction Handlers
  // -------------------------------------------------------------------------

  /** Called when post container is pressed */
  onPress?: () => void;

  /** Called when the user zone is pressed (avatar, display name, country/location, timestamp) */
  onUserPress?: () => void;

  /** Called when menu (three dots) is pressed */
  onMenuPress?: () => void;

  /** Called when the empty header space is pressed (between the user zone and the menu icon). Does NOT fire for avatar, display name, location, timestamp, edited badge, or menu. */
  onHeaderPress?: () => void;

  /** Enable haptic feedback on interactions (default: true) */
  haptics?: boolean;

  // -------------------------------------------------------------------------
  // Compound Children (Required)
  // -------------------------------------------------------------------------

  /**
   * Children are required - use EtPost subcomponents to compose the layout.
   *
   * Available subcomponents:
   * - EtPost.Header - User info, timestamp, menu
   * - EtPost.Body - Text content with "Show More/Less"
   * - EtPost.Image - Image attachment
   * - EtPost.Video - Video attachment
   * - EtPost.Link - Link preview card
   * - EtPost.Trade - Trade card
   * - EtPost.Footer - Container for engagement actions
   * - EtPost.Likes - Like icon + count
   * - EtPost.Comments - Comment icon + count
   * - EtPost.Shares - Share icon + count
   * - EtPost.Save - Bookmark icon
   */
  children: ReactNode;

  // -------------------------------------------------------------------------
  // Style & Accessibility
  // -------------------------------------------------------------------------

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Accessibility hint */
  accessibilityHint?: string;
}
