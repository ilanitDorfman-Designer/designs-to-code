import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { TextVariant } from '../../../foundations/text/utils';

/**
 * Props for EtReadMoreText
 *
 * @example
 * ```tsx
 * // Plain text with URL auto-detection
 * <EtReadMoreText maxLines={3} text={longTextContent} onLinkPress={handleLink} />
 *
 * // Rich content with pre-built interactive elements
 * <EtReadMoreText text={plainText} maxLines={3}>
 *   Buy <EtText onPress={handleTag} style={linkStyle}>$AAPL</EtText>!
 *   Follow <EtText onPress={handleMention} style={linkStyle}>@meiramar</EtText>
 * </EtReadMoreText>
 * ```
 */
export interface EtReadMoreTextProps {
  // ── Content ───────────────────────────────────────────────

  /**
   * Plain text content — always required.
   *
   * Used for:
   * - Measurement and truncation calculations
   * - Rendering when no `children` are provided (string mode with URL auto-detection)
   * - Reset trigger when content changes
   *
   * When `children` are also provided, `text` should be the plain-text
   * representation of the children content.
   */
  text: string;

  /**
   * Rich content with pre-built interactive elements.
   *
   * When provided, used for rendering in **both** collapsed and expanded states.
   * The children tree is truncated by character count when collapsed.
   *
   * Use nested `<EtText onPress>` for inline interactive text (not `<EtLink>`,
   * which is View-based and cannot be nested inside Text).
   *
   * @example
   * ```tsx
   * <EtReadMoreText text="Buy $AAPL! Follow @meiramar" maxLines={3}>
   *   Buy <EtText onPress={handleTag} style={linkStyle}>$AAPL</EtText>!
   *   Follow <EtText onPress={handleMention} style={linkStyle}>@meiramar</EtText>
   * </EtReadMoreText>
   * ```
   */
  children?: ReactNode;

  /**
   * Custom action component renderer.
   * Receives the current expanded state and returns a ReactNode.
   * When provided, replaces the default "Show More" / "Show Less" text.
   *
   * @example
   * ```tsx
   * <EtReadMoreText
   *   text={longText}
   *   customActionComponent={(isExpanded) => (
   *     <EtIconV2 name={isExpanded ? "chevron-up" : "chevron-down"} size={16} />
   *   )}
   * />
   * ```
   */
  customActionComponent?: (isExpanded: boolean) => ReactNode;

  // ── State ─────────────────────────────────────────────────

  /**
   * Whether the text starts in expanded state
   * @default false
   */
  initialExpanded?: boolean;

  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Fired when layout measurement determines whether "Show More" is needed.
   */
  onTruncationChange?: (needsTruncation: boolean) => void;

  // ── Appearance ────────────────────────────────────────────

  /**
   * Maximum number of lines to show when collapsed.
   * The last line will be truncated to fit the inline "Show More" action.
   * @default 4
   */
  maxLines?: number;

  /**
   * Typography variant for the text content
   * @default 'body-secondary-regular'
   */
  textVariant?: TextVariant;

  /**
   * Typography variant for the action text (Show More / Show Less)
   * @default 'body-secondary-semibold'
   */
  actionTextVariant?: TextVariant;

  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;

  // ── Interaction ───────────────────────────────────────────

  /**
   * Text for the expand action
   * @default 'Show More'
   */
  showMoreText?: string;

  /**
   * Text for the collapse action
   * @default 'Show Less'
   */
  showLessText?: string;

  // ── Link Detection ────────────────────────────────────────

  /**
   * Callback when a URL link in the text is pressed.
   * Receives the full URL (e.g., "https://example.com").
   * When provided, URLs in string content are auto-detected and rendered
   * as clickable inline text. Only applies in string mode (no children).
   */
  onLinkPress?: (url: string) => void;

  // ── Accessibility ─────────────────────────────────────────

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}
