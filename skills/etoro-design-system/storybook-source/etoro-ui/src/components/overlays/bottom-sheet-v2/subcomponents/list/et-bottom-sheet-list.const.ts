import { X2, X6 } from '../../../../../core/styles/spacing';
import { LOADING_CONTAINER_MIN_HEIGHT } from '../../utils/et-bottom-sheet.const';

// Re-export for convenience
export { LOADING_CONTAINER_MIN_HEIGHT };

/**
 * List horizontal padding.
 * Matches content padding for visual consistency.
 * Figma: px-[var(--x5,20px)]
 */
export const LIST_PADDING_HORIZONTAL = X6;

/**
 * List vertical padding.
 * Matches content padding for visual consistency.
 * Figma: py-[var(--x2,8px)]
 */
export const LIST_PADDING_VERTICAL = X2; // 8px

/** Absolute host height for the list bottom overlay (fade / sticky footer chrome). */
export const BOTTOM_OVERLAY_HEIGHT = 48;
