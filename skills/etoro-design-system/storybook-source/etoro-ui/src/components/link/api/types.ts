import type { ReactElement } from 'react';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { EtoroIconProps } from '../../../foundations/icon-assets/api/types';
import type { EtTextProps } from '../../../foundations/text/api/types';
import type { TextVariant } from '../../../foundations/text/utils/variant-config';

/**
 * Link variant types following design system
 * - primary: brand green color
 * - info: neutral/gray color
 * - negative: destructive/red color
 */
export type LinkVariant = 'primary' | 'info' | 'negative';

/**
 * Link size options
 */
export type LinkSize = 'small' | 'medium' | 'large';

/**
 * Link icon position options
 * - none: no icon displayed
 * - leading: icon on the left of the label
 * - trailing: icon on the right of the label
 */
export type LinkIconPosition = 'none' | 'leading' | 'trailing';

/**
 * Variant style configuration for link
 */
export interface LinkVariantStyleConfig {
  textColor: string;
  iconColor: string;
  pressedTextColor: string;
  pressedIconColor: string;
  disabledTextColor: string;
}

/**
 * Link context value shared with subcomponents
 */
export interface LinkContextValue {
  /** Current link variant */
  variant: LinkVariant;
  /** Current link size */
  size: LinkSize;
  /** Icon position configuration */
  iconPosition: LinkIconPosition;
  /** Whether link is in loading state */
  loading: boolean;
  /** Whether link is pressed */
  pressed: boolean;
  /** Computed text color for the link */
  textColor: string;
  /** Computed icon color for the link */
  iconColor: string;
  /** Computed icon size based on link size */
  iconSize: number;
}

/**
 * EtLink.Label props - extends EtTextProps
 */
export interface EtLinkLabelProps extends Omit<EtTextProps, 'children'> {
  /** Label text */
  children: string;
  /** Override text variant */
  variant?: TextVariant;
  /** Override text style */
  style?: StyleProp<TextStyle>;
}

/**
 * EtLink.Icon props - extends EtoroIconProps with simplified API
 */
export interface EtLinkIconProps extends Omit<EtoroIconProps, 'icon'> {
  /** Icon name from the icon library */
  name: EtoroIconProps['icon']['iconName'];
}

/**
 * Main EtLink props
 */
export interface EtLinkProps extends Omit<PressableProps, 'children'> {
  /** Link visual variant */
  variant?: LinkVariant;
  /** Link size */
  size?: LinkSize;
  /** Whether link is disabled */
  disabled?: boolean;
  /** Whether link is in loading state (shows loader on the side) */
  loading?: boolean;
  /**
   * Link children - only string, EtLink.Label, or EtLink.Icon allowed.
   * Do NOT pass arbitrary components like EtText - use EtLink.Label instead.
   */
  children?:
    | string
    | ReactElement<EtLinkLabelProps>
    | ReactElement<EtLinkIconProps>
    | (string | ReactElement<EtLinkLabelProps> | ReactElement<EtLinkIconProps>)[];
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Enable haptic feedback on press */
  haptics?: boolean;
  /** Enable the scale animation on press */
  animateOnPress?: boolean;
}
