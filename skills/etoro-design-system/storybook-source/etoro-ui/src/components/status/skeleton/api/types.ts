import type { ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

export type SkeletonAnimation =
  | 'shimmer'
  | 'none'
  /** @deprecated Alias for `shimmer`; distinct pulse handling is no longer implemented. */
  | 'pulse'
  /** @deprecated Alias for `shimmer`; distinct wave handling is no longer implemented. */
  | 'wave';
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface EtSkeletonProps {
  /** Width of the skeleton */
  width?: number | string;
  /** Height of the skeleton */
  height?: number;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Border radius for custom shapes */
  borderRadius?: number;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Whether to show the skeleton */
  visible?: boolean;
  /** Children to render when not loading */
  children?: ReactNode;
  /** Test identifier */
  testID?: string;
  /**
   * @deprecated No-op. The shared shimmer clock fixes duration globally.
   * Kept only for backward compatibility with existing call sites.
   */
  duration?: number;
  /**
   * @deprecated No-op. Shimmers are phase-synced via the shared clock; there is
   * nothing to stagger. Kept only for backward compatibility.
   */
  delay?: number;
  /**
   * @deprecated No-op. The shared-clock + group-mask architecture removes the
   * need for a global animation cap. Kept only for backward compatibility.
   */
  performanceMode?: boolean;
  /**
   * @deprecated No-op. There is no longer a concurrent-animation budget to
   * prioritise against. Kept only for backward compatibility.
   */
  priority?: 'high' | 'medium' | 'low';
}

export interface SkeletonGroupProps {
  /** Number of skeleton lines */
  lines?: number;
  /** Spacing between lines */
  spacing?: number;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

export interface SkeletonChipsProps {
  /** Number of pill placeholders (ignored when `widths` is provided). */
  count?: number;
  /** Explicit pill widths; length determines the number of pills. */
  widths?: number[];
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Custom style for the row container. */
  style?: StyleProp<ViewStyle>;
  /** Test identifier */
  testID?: string;
}

export interface SkeletonCardProps {
  /** Show avatar */
  avatar?: boolean;
  /** Number of text lines */
  lines?: number;
  /** Show action buttons */
  actions?: boolean;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}
