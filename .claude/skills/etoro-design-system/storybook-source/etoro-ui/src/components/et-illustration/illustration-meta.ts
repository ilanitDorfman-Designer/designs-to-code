import type { IllustrationName, IllustrationSize } from './api/types';

/** Figma defaults and intrinsic dimensions for one registered illustration. */
export type IllustrationMetaEntry = {
  /** Figma-native size token, used when the caller doesn't pass one. */
  defaultSize: IllustrationSize;
  /** Intrinsic width of the base (default-size) asset. */
  width: number;
  /** Intrinsic height of the base (default-size) asset. */
  height: number;
  /**
   * Dedicated size-variant assets — a genuinely different (not just scaled) layout drawn
   * for that size in Figma. When the caller requests such a `size`, a separate CDN file is
   * loaded and rendered at these intrinsic dimensions instead of scaling the base asset.
   */
  variants?: Partial<Record<IllustrationSize, { width: number; height: number }>>;
};

/**
 * Figma-native defaults and intrinsic dimensions for every registered illustration.
 * Drives size resolution and aspect-preserving layout; the pixels themselves live on the
 * CDN (see `utils/get-illustration-url` + `illustration-assets.generated`).
 */
export const ILLUSTRATION_META: Record<IllustrationName, IllustrationMetaEntry> = {
  assets: { defaultSize: 'xxl', width: 375, height: 230 },
  calendar: { defaultSize: 'xxl', width: 375, height: 230 },
  card: { defaultSize: 'm', width: 152, height: 152 },
  connection_error: { defaultSize: 'm', width: 154, height: 163, variants: { xl: { width: 375, height: 165 } } },
  coupon: { defaultSize: 's', width: 124, height: 124 },
  empty_bar_chart: { defaultSize: 'm', width: 152, height: 165 },
  empty_list: { defaultSize: 'm', width: 152, height: 152 },
  error: { defaultSize: 'm', width: 152, height: 152, variants: { xl: { width: 375, height: 176 } } },
  like: { defaultSize: 'm', width: 152, height: 152 },
  magnifying_glass: { defaultSize: 'm', width: 152, height: 152 },
  paper_plane: { defaultSize: 'xxl', width: 375, height: 230 },
  pending: { defaultSize: 'm', width: 152, height: 152, variants: { xl: { width: 375, height: 176 } } },
  phone_coins: { defaultSize: 'xxl', width: 375, height: 230 },
  refer_a_friend: { defaultSize: 'xxl', width: 443, height: 273 },
  settings: { defaultSize: 'm', width: 152, height: 152 },
  shield_and_users: { defaultSize: 'xxl', width: 375, height: 230 },
  shield_checkmark: { defaultSize: 'xxl', width: 375, height: 230 },
  shield_lock: { defaultSize: 'xxl', width: 375, height: 230 },
  success: { defaultSize: 'm', width: 152, height: 152, variants: { xl: { width: 375, height: 176 } } },
  target: { defaultSize: 'xxl', width: 375, height: 230 },
  verify: { defaultSize: 'xxl', width: 375, height: 230 },
  warning: { defaultSize: 'm', width: 183, height: 160, variants: { xl: { width: 375, height: 185 } } },
};
