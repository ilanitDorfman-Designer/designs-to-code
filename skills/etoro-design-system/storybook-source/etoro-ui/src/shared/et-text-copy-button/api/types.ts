import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

// ========== Child Component Props ==========

/**
 * Props for EtTextCopyButton.Icon subcomponent
 */
export interface TextCopyButtonIconProps {
  /** Optional custom style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Props for EtTextCopyButton.Text subcomponent
 */
export interface TextCopyButtonTextProps {
  children: ReactNode;
  /** Optional custom style */
  style?: StyleProp<TextStyle>;
}

// ========== Main Component Props ==========

/**
 * Props for EtTextCopyButton component
 *
 * @example
 * ```tsx
 * <EtTextCopyButton textToCopy="123456789">
 *   <EtTextCopyButton.Icon />
 *   <EtTextCopyButton.Text>123456789</EtTextCopyButton.Text>
 * </EtTextCopyButton>
 * ```
 *
 * @example
 * ```tsx
 * // String shorthand
 * <EtTextCopyButton textToCopy="Tal Ben Simon">
 *   Tal Ben Simon
 * </EtTextCopyButton>
 * ```
 */
export interface EtTextCopyButtonProps {
  // ========== Required ==========
  /** Text to copy to clipboard */
  textToCopy: string;

  /** Children (compound components or string) */
  children: ReactNode;

  // ========== Optional ==========
  /**
   * Custom copy implementation. Receives text; return true if successful.
   * If not provided, the component will handle clipboard copy by itself.
   */
  onCopy?: (text: string) => Promise<boolean>;

  /** Callback when copy fails (e.g. for analytics) */
  onError?: (error: string) => void;
  /** Callback when copy succeeds (e.g. toast, analytics) */
  afterCopy?: () => void;

  /** Duration to show success state (ms) */
  successDuration?: number;

  /** Enable haptic feedback */
  haptics?: boolean;

  // ========== Appearance ==========
  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test identifier */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}
