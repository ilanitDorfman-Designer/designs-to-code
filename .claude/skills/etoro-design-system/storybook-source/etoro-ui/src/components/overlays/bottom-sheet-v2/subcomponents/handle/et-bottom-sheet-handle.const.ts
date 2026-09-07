import { X1, X2, X3, X8 } from '../../../../../core/styles/spacing';

/**
 * Handle indicator width in pixels.
 * Per Figma design: 36px width for bottom sheet drag handles.
 * Note: This is a visual indicator, not a touch target. The drag gesture
 * responds to the entire sheet width, so accessibility is not affected.
 */
export const HANDLE_INDICATOR_WIDTH = 36;

/**
 * Handle indicator height in pixels.
 */
export const HANDLE_INDICATOR_HEIGHT = 4;

/**
 * Handle indicator border radius.
 * Uses X1 (4px) for fully rounded ends.
 */
export const HANDLE_INDICATOR_BORDER_RADIUS = X1; // 4px

/**
 * Padding above the handle indicator.
 * Uses X3 (12px) from design system spacing.
 */
export const HANDLE_PADDING_TOP = X3; // 12px

/**
 * Padding below the handle indicator.
 * Uses X2 (8px) from design system spacing per Figma.
 */
export const HANDLE_PADDING_BOTTOM = X2; // 8px

/**
 * Total measurable height of the handle component in dp.
 *
 * Breakdown:
 *   HANDLE_PADDING_TOP     (X3) = 12 dp   — space above the indicator pill
 *   HANDLE_INDICATOR_HEIGHT      =  4 dp   — the pill itself
 *   HANDLE_PADDING_BOTTOM  (X2) =  8 dp   — space below the pill
 *   roundedTop height      (X8) = 32 dp   — rounded-corner overlap block
 *   ─────────────────────────────────────
 *   Total                        = 56 dp
 *
 * Exported so callers that compute available sheet height (e.g. keyboard-fit
 * logic) have a compile-time anchor instead of a magic number.
 *
 * Note: gorhom's BottomSheetView adds a small internal content inset on top
 * of this that is not exported by the library.  Any full "chrome" estimate
 * should be treated as approximate; see SHEET_CHROME in consumers.
 */
export const HANDLE_CHROME_HEIGHT = HANDLE_PADDING_TOP + HANDLE_INDICATOR_HEIGHT + HANDLE_PADDING_BOTTOM + X8; // 56 dp
