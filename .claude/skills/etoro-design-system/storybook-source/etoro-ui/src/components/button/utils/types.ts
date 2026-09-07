import type { ReactElement } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import type { EtoroIconProps } from '../../../foundations/icon-assets/api/types';
import type { EtTextProps } from '../../../foundations/text/api/types';
import type { EtIconProps } from '../../et-icon-v2/api/types';

/**
 * Button variant types following design system
 * Format: {color}-{style}
 * - color: primary (brand/green), info (neutral/gray), negative (destructive/red)
 * - style: filled = solid background, subtle = tinted background, ghost = no background
 */
export type ButtonVariant =
  | 'primary-filled'
  | 'info-filled'
  | 'negative-filled'
  | 'primary-subtle'
  | 'info-subtle'
  | 'negative-subtle'
  | 'primary-ghost'
  | 'info-ghost'
  | 'negative-ghost';

/**
 * Button size options
 */
export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large';

/**
 * Forces the button to resolve its colors from a fixed theme palette,
 * ignoring the active app theme. Use for surfaces that are always dark
 * or always light (e.g. a dark promo card shown in light mode).
 */
export type ButtonColorScheme = 'light' | 'dark';

/**
 * Button context value shared with subcomponents
 */
export interface ButtonContextValue {
  /** Current button variant */
  variant: ButtonVariant;
  /** Current button size */
  size: ButtonSize;
  /** Whether button is disabled */
  disabled: boolean;
  /** Whether button is in loading state */
  loading: boolean;
  /** Whether button is pressed */
  pressed: boolean;
  /** Computed text color for the button */
  textColor: string;
  /** Computed icon color for the button */
  iconColor: string;
  /** Computed icon size based on button size */
  iconSize: number;
}

/**
 * Main EtButton props
 */
export interface EtButtonProps extends Omit<PressableProps, 'children'> {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /**
   * Button children - only string, EtButton.Label, EtButton.Icon, or EtButton.IconV2 allowed.
   * Do NOT pass arbitrary components like EtText - use EtButton.Label instead.
   */
  children?:
    | string
    | ReactElement<EtButtonLabelProps>
    | ReactElement<EtButtonIconProps>
    | ReactElement<EtButtonIconV2Props>
    | (string | ReactElement<EtButtonLabelProps> | ReactElement<EtButtonIconProps> | ReactElement<EtButtonIconV2Props>)[];
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Enable haptic feedback on press */
  haptics?: boolean;
  /** Whether button should stretch to full width of its container */
  stretch?: boolean;
  /**
   * Pin the button's colors to a fixed theme palette instead of the active app theme.
   * Useful for surfaces that must always render dark (or light) regardless of the
   * user's current theme. When omitted, the button follows the active theme.
   */
  forceColorScheme?: ButtonColorScheme;
}

/**
 * EtButton.Label props - extends EtTextProps
 */
export interface EtButtonLabelProps extends Omit<EtTextProps, 'children'> {
  /** Label text */
  children: string;
}

/**
 * EtButton.Icon props - extends EtoroIconProps with simplified API
 */
export interface EtButtonIconProps extends Omit<EtoroIconProps, 'icon'> {
  /** Icon name from the icon library */
  name: EtoroIconProps['icon']['iconName'];
}

/**
 * EtButton.IconV2 props - mirrors EtIconV2 props except interactive behavior.
 * `size` and `color` default to the parent button's context values when omitted.
 */
export type EtButtonIconV2Props = Omit<EtIconProps, 'onPress'>;

/**
 * Size configuration for each button size
 */
export interface SizeConfig {
  height: number;
  minWidth: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  iconSize: number;
}

/**
 * Variant style configuration
 */
export interface VariantStyleConfig {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  pressedBackgroundColor?: string;
  pressedTextColor?: string;
  pressedIconColor?: string;
  disabledBackgroundColor?: string;
  disabledTextColor?: string;
}
