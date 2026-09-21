import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Props for EtStory.Label subcomponent
 */
export interface StoryLabelProps {
  /** Label text */
  children: ReactNode;
  /** Text style override */
  style?: StyleProp<TextStyle>;
}

/**
 * Story variant - determines avatar styling
 * - 'default': No overlay (for user/social avatars)
 * - 'instrument': Shows gradient overlay (for stocks, crypto, etc.)
 */
export type StoryVariant = 'default' | 'instrument';

/**
 * Props for EtStory component
 */
export interface EtStoryProps {
  /** Image source URL for the avatar */
  imageSource: string;
  /** Story variant - 'instrument' shows gradient overlay, 'default' shows no overlay */
  variant?: StoryVariant;
  /** Shows green ring when false (unwatched), no ring when true (watched) */
  watched?: boolean;
  /** Shows animated loading ring - takes precedence over watched state */
  loading?: boolean;
  /** Callback when story is pressed */
  onPress?: () => void;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Children must contain EtStory.Label */
  children: ReactNode;
}
