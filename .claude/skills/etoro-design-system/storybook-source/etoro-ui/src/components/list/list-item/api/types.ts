import type { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { IconName } from '../../../../foundations/icon-assets/api';

// Grouped configuration interfaces
export interface ListContentConfig {
  /** Main text content (required) */
  title: string;
  /** Secondary text line */
  subtitle?: string;
  /** Additional descriptive text */
  description?: string;
}

export interface ListLayoutConfig {
  /** Layout density variant */
  variant?: 'default' | 'compact' | 'comfortable' | 'spacious';
  /** Vertical alignment of content */
  alignment?: 'top' | 'center' | 'bottom';
  /** Show bottom divider line */
  divider?: boolean;
  /** Container style */
  style?: ViewStyle;
  /** Title text style */
  titleStyle?: TextStyle;
  /** Subtitle text style */
  subtitleStyle?: TextStyle;
  /** Description text style */
  descriptionStyle?: TextStyle;
  /** Background color override */
  backgroundColor?: string;
}

export interface ListInteractionConfig {
  /** Press handler */
  onPress?: () => void;
  /** Long press handler */
  onLongPress?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
}

export interface ListSelectionConfig {
  /** Whether item can be selected with checkbox */
  selectable?: boolean;
  /** Current selection state */
  selected?: boolean;
  /** Selection change handler */
  onSelectionChange?: (_selected: boolean) => void;
  /** Checkbox position */
  checkboxPosition?: 'left' | 'right';
}

export interface ListVisualConfig {
  /** Left icon name (EtoroIcon) */
  leftIcon?: IconName;
  /** Custom right element */
  rightElement?: ReactNode;
  /** Visual highlighting */
  highlight?: boolean;
}

export interface ListAccessibilityConfig {
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

// Enhanced grouped props interface
export interface EtListItemProps {
  content: ListContentConfig;
  layout?: ListLayoutConfig;
  interaction?: ListInteractionConfig;
  selection?: ListSelectionConfig;
  visual?: ListVisualConfig;
  accessibility?: ListAccessibilityConfig;
}
