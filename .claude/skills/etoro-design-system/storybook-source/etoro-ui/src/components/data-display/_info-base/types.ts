import type { ReactNode } from 'react';

import type { AvatarVariant } from '../../social/avatar';

/**
 * Ellipsize mode for text truncation. Maps to React Native TextProps.ellipsizeMode.
 */
export type InfoEllipsizeMode = 'head' | 'middle' | 'tail' | 'clip';

/**
 * Base layout type shared by EtAssetInfo and EtUserInfo.
 */
export type InfoLayoutType = 'horizontal' | 'vertical';

/**
 * Base avatar size shared by info components.
 */
export type InfoAvatarSize = 'small' | 'medium' | 'large';

/**
 * Base avatar shape for info components.
 */
export type InfoAvatarShape = 'circle' | 'square';

/**
 * Base avatar data structure shared by info components.
 */
export interface InfoAvatarData {
  source: string;
  size?: InfoAvatarSize;
  shape?: InfoAvatarShape;
  alt?: string;
  /** Optional fallback rendered by EtAvatar when the image fails to load. */
  fallback?: ReactNode;
  /** Optional explicit avatar background color, useful when remote SVG metadata provides it separately from the URL. */
  backgroundColor?: string;
  /**
   * Avatar styling variant. `'instrument'` enables the SVG-background-color
   * tint and gradient overlay used by asset/instrument logos; `'user'` and
   * `'default'` render the image plain.
   * @default 'default'
   */
  variant?: AvatarVariant;
}

/**
 * Base data structure shared by info components.
 */
export type InfoDataBase =
  | {
      avatar: InfoAvatarData;
      title?: string;
      subtitle?: string;
    }
  | {
      avatar?: InfoAvatarData;
      title: string;
      subtitle?: string;
    };

/**
 * Base defaults type for info context.
 */
export interface InfoDefaultsBase {
  data: InfoDataBase;
  layout: InfoLayoutType;
  ellipsizeMode: InfoEllipsizeMode;
  maxWidth?: number;
}

/**
 * Config for useInfoDefaults hook.
 */
export interface InfoDefaultsConfig {
  /** Default avatar shape when not specified in data. */
  defaultAvatarShape?: InfoAvatarShape;
  /** Default avatar size when not specified in data. */
  defaultAvatarSize?: InfoAvatarSize;
  /** Default avatar variant when not specified in data (e.g. EtAssetInfo defaults to 'instrument'). */
  defaultAvatarVariant?: AvatarVariant;
}

/**
 * Slots extracted from compound children.
 */
export interface InfoSlots {
  avatar: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}

/**
 * Display names for slot detection.
 */
export interface InfoDisplayNames {
  avatar: string;
  title: string;
  subtitle: string;
}
