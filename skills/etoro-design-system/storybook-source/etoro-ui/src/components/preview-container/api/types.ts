import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for {@link EtPreviewContainer} — a floating liquid-glass preview card shell.
 *
 * Renders the native iOS 26+ liquid-glass surface when available, and falls back
 * to a frosted blur on every other platform. Domain content (label, value, chart)
 * is supplied via compound children.
 */
export interface EtPreviewContainerProps {
  /**
   * Compound children — typically `EtPreviewContainer.Content` and
   * `EtPreviewContainer.Trailing`.
   */
  children: ReactNode;
  /** Press handler. Fires after the optional haptic. */
  onPress?: () => void;
  /** Accessibility label for the pressable card. */
  accessibilityLabel?: string;
  /**
   * Pin the card absolutely above the bottom tab bar (clears the home-indicator
   * inset automatically). When `false`, the consumer owns positioning.
   * @default false
   */
  floating?: boolean;
  /**
   * Slide/fade the card with the tab bar via `useTabBarVisibility`.
   * Only meaningful when `floating` is also `true`.
   * @default false
   */
  syncWithTabBar?: boolean;
  /** Show the centred grab-handle at the top of the card. @default true */
  showHandle?: boolean;
  /** Whether to fire a light haptic impact on press. @default true */
  haptics?: boolean;
  /** Disables the press interaction. @default false */
  disabled?: boolean;
  /** Style merged onto the outer container (floating wrapper or pressable). */
  style?: StyleProp<ViewStyle>;
  /** Test ID applied to the pressable. */
  testID?: string;
}

/**
 * Props for `EtPreviewContainer.Content` — left-side text stack slot.
 */
export interface PreviewContainerContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for `EtPreviewContainer.Trailing` — right-side trailing visual slot
 * (e.g. a sparkline).
 */
export interface PreviewContainerTrailingProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
