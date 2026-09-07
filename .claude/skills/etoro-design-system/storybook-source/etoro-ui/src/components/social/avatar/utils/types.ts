import type { ImageProps } from 'expo-image';
import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewProps } from 'react-native';

/**
 * Avatar size options
 * - xsmall (16px) is the stacked-logo size. Pass it on `EtAvatar.Group` when
 *   that's the intended geometry; the group default stays `'medium'`.
 */
export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large';

/**
 * Avatar shape options
 * - square: rounded rectangle (for instruments/assets)
 * - circle: fully circular (for social/user avatars)
 */
export type AvatarShape = 'square' | 'circle';

/**
 * Avatar variant options
 * - default / user: no overlay (default kept for backward compat)
 * - instrument: gradient overlay for instrument/asset logos
 * - currency: gradient overlay for currency badges
 */
export type AvatarVariant = 'default' | 'user' | 'instrument' | 'currency';

/**
 * Badge position options
 */
export type BadgePosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/**
 * Context value shared with subcomponents
 */
export interface AvatarContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  variant: AvatarVariant;
  imageLoaded: boolean;
  imageError: boolean;
  setImageLoaded: (loaded: boolean) => void;
  setImageError: (error: boolean) => void;
  /** Background color extracted from an SVG instrument URL (e.g. `#F7F7F7`). Set by AvatarImage when src is an SVG with encoded colors. */
  svgBackgroundColor: string | undefined;
  setSvgBackgroundColor: (color: string | undefined) => void;
}

/**
 * Main EtAvatar props - extends ViewProps
 */
export interface EtAvatarProps extends ViewProps {
  children: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  variant?: AvatarVariant;
  /** Explicit image background color, used for SVG logos whose URL does not encode one. */
  imageBackgroundColor?: string;
}

/**
 * AvatarImage props - extends ImageProps with 'src' alias
 */
export interface AvatarImageProps extends ImageProps {
  /** Remote URL. Bundled `require(...)` assets should use {@link ImageProps.source} instead. */
  src?: string;
}

/**
 * AvatarFallback props - extends ViewProps
 */
export interface AvatarFallbackProps extends ViewProps {
  children: ReactNode;
  delayMs?: number;
}

/**
 * AvatarCurrency props - centered currency symbol for `variant="currency"` avatars.
 */
export interface AvatarCurrencyProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

/**
 * AvatarBadge props - extends ViewProps
 *
 * Two modes:
 * - Generic (children): bare positioning container, no background
 * - Icon (icon prop): styled circular container with themed background, RTL-aware positioning
 *
 * When `icon` is provided, `children` is ignored.
 */
export interface AvatarBadgeProps extends ViewProps {
  children?: ReactNode;
  /** When provided, renders a styled circular badge with this icon inside. Takes precedence over children. */
  icon?: ReactElement;
  position?: BadgePosition;
}

/**
 * Market status for the avatar dot indicator.
 * - `'open'` renders a green dot (`statusPositive`)
 * - `'closed'` renders a red dot (`statusNegative`)
 */
export type AvatarMarketStatus = 'open' | 'closed';

/**
 * AvatarMarketOpen props - extends ViewProps
 */
export interface AvatarMarketOpenProps extends ViewProps {
  position?: BadgePosition;
  /** Dot color: green (open) or red (closed). Default: `'open'`. */
  status?: AvatarMarketStatus;
  /** Background ring color around the status dot. Defaults to the app background. */
  backgroundColor?: string;
}

/**
 * AvatarGroup props - extends ViewProps
 */
export interface AvatarGroupProps extends ViewProps {
  children: ReactNode;
  /**
   * Size applied to grouped avatars that don't set their own `size`.
   * Defaults to `'medium'`. A child's explicit `size` prop overrides this.
   */
  size?: AvatarSize;
}

/**
 * AvatarGroupCount props - extends ViewProps
 */
export interface AvatarGroupCountProps extends ViewProps {
  children: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
}

/**
 * Size configuration for each avatar size
 */
export interface SizeConfig {
  size: number;
  squareRadius: number;
}
