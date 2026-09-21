import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { IconName } from '../../../../foundations/icon-assets/api/types';

/**
 * Available badge color variants
 * Each color has a themed background (with opacity) and text color
 */
export type BadgeColor = 'neutral' | 'red' | 'orange' | 'yellow' | 'green' | 'mint' | 'blue' | 'purple' | 'violet';

/**
 * Available badge sizes (per DS)
 * - large: 28px height, 12px horizontal padding, body-tiny-medium label (12/16), 16px icon
 * - medium: 20px height, 8px horizontal padding, body-tiny-medium label (12/16), 16px icon
 * - small: 20px height, 8px horizontal padding, caption-medium label (10/14), 12px icon
 */
export type BadgeSize = 'large' | 'medium' | 'small';

/**
 * Props for EtBadge.Label subcomponent
 */
export interface BadgeLabelProps {
  /** Label text content */
  children: ReactNode;
  /** Additional text styles */
  style?: StyleProp<TextStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for EtBadge.Icon subcomponent
 */
export interface BadgeIconProps {
  /** Icon name from icon library */
  name: IconName;
  /** Whether to render the icon as filled (solid) instead of stroked (outlined) */
  hasFill?: boolean;
}

/**
 * Props for the EtBadge component
 *
 * @example Basic usage
 * ```tsx
 * <EtBadge color="green">
 *   <EtBadge.Label>Success</EtBadge.Label>
 * </EtBadge>
 * ```
 *
 * @example With prefix icon
 * ```tsx
 * <EtBadge color="green">
 *   <EtBadge.Icon name="heart" />
 *   <EtBadge.Label>Favorites</EtBadge.Label>
 * </EtBadge>
 * ```
 *
 * @example With suffix icon
 * ```tsx
 * <EtBadge color="blue">
 *   <EtBadge.Label>New</EtBadge.Label>
 *   <EtBadge.Icon name="chevronRight" />
 * </EtBadge>
 * ```
 */
export interface EtBadgeProps {
  /** Badge content (EtBadge.Label and/or EtBadge.Icon) */
  children: ReactNode;

  /** Color variant (default: 'neutral') */
  color?: BadgeColor;

  /** Size variant (default: 'medium') */
  size?: BadgeSize;

  /** Additional container styles */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Colors returned by useBadgeColors hook
 */
export interface BadgeColors {
  /** Background color with opacity */
  background: string;
  /** Text color */
  text: string;
}
