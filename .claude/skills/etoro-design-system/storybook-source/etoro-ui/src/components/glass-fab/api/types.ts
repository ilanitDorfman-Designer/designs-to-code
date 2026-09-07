import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { GlassEffectStyle } from '../../../core/liquid-glass';
import type { IconName } from '../../et-icon-v2';

/**
 * Props for {@link EtGlassFab} — a circular, liquid-glass floating action button.
 *
 * Renders the native iOS 26+ liquid-glass surface when available, and falls back
 * to a primary Carbon blurred circle on every other platform.
 */
export interface EtGlassFabProps {
  /** Icon rendered in the center of the FAB. Ignored when `children` is provided. */
  iconName?: IconName;
  /** Custom center content (e.g. a brand logo) rendered instead of `iconName`. */
  children?: ReactNode;
  /** Fallback surface color on non-liquid-glass platforms. @default carbon900 */
  fallbackColor?: string;
  /** Press handler. Fires after the optional haptic. */
  onPress: () => void;
  /** Accessibility label for the button (required for screen readers). */
  accessibilityLabel: string;
  /** Diameter of the circular FAB in px. @default 44 */
  size?: number;
  /** Icon size in px. @default 24 */
  iconSize?: number;
  /** Icon color override. Omit to use the icon's own / theme default color. */
  iconColor?: string;
  /** Glass material variant passed to the native glass surface. @default 'regular' */
  glassEffectStyle?: GlassEffectStyle;
  /** Tint color applied to the native glass material. */
  tintColor?: string;
  /** Whether to fire a light haptic impact on press. @default true */
  haptics?: boolean;
  /** Disables the press interaction. @default false */
  disabled?: boolean;
  /** Extra touch target padding around the button. */
  hitSlop?: number;
  /** Style merged onto the glass surface (e.g. shadows). Positioning is best owned by a wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Test ID applied to the pressable button. */
  testID?: string;
}
