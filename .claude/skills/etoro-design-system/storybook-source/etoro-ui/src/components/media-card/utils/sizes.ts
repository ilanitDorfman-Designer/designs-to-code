/**
 * EtMediaCard size dimensions from Figma DS Card
 * (node 38716:443435 — small 128×164, medium 327×230, large 327×377).
 */
export const MEDIA_CARD_SIZES = {
  small: { width: 128, height: 164 },
  medium: { width: 327, height: 230 },
  large: { width: 327, height: 377 },
} as const;

export type MediaCardSizeKey = keyof typeof MEDIA_CARD_SIZES;
