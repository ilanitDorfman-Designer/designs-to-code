import { MAX_FONT_SIZE_MULTIPLIER } from '../../../../foundations/text/utils/variant-config';

const BASE_CONTENT_HEIGHT = 36;
const BASE_VERTICAL_SPACE = 4;

/**
 * Keeps the two-line ticker tall enough for the same clamped font scaling
 * applied by EtText while preserving the existing 40dp default height.
 */
export function getEtTickerHeight(fontScale: number): number {
  const normalizedFontScale = Number.isFinite(fontScale) ? fontScale : 1;
  const effectiveFontScale = Math.max(1, Math.min(normalizedFontScale, MAX_FONT_SIZE_MULTIPLIER));

  return Math.ceil(BASE_CONTENT_HEIGHT * effectiveFontScale + BASE_VERTICAL_SPACE);
}
