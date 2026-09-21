/**
 * LineChart Constants
 *
 * Centralized configuration values for the chart component.
 */

// ============================================================================
// Gesture Configuration
// ============================================================================

/** Duration (ms) user must hold before entering focus mode */
export const LONG_PRESS_DELAY = 250;

// ============================================================================
// Animation Timing
// ============================================================================

/** Duration for line drawing animation */
export const LINE_ANIMATION_DURATION = 1000;

/** Delay before gradient animation starts */
export const GRADIENT_ANIMATION_DELAY = 700;

/** Duration for gradient fill animation */
export const GRADIENT_ANIMATION_DURATION = 500;

/** Duration for overlay/cursor fade animations */
export const FADE_ANIMATION_DURATION = 200;

/** Overlay opacity when cursor is active */
export const OVERLAY_ACTIVE_OPACITY = 0.6;

// ============================================================================
// Chart Styling
// ============================================================================

/** Stroke width for the chart line */
export const LINE_STROKE_WIDTH = 1.5;

// ============================================================================
// Marker Styling
// ============================================================================

/** Radius of marker dots on the chart line (6px diameter) */
export const MARKER_RADIUS = 2;

/** Hit area buffer around markers for easier hovering (in pixels) */
export const MARKER_HIT_BUFFER = 3;

// ============================================================================
// Cursor Styling
// ============================================================================

/**
 * Vertical headroom (in px) reserved on each side of the chart so the cursor
 * dot's outer halo isn't clipped when the line is at the top/bottom edge.
 *
 * The Skia `<Canvas>` surface clips to its own `width × height` regardless of
 * `overflow: visible` on the React Native View, so we extend the canvas by
 * this amount and offset the drawn content with a `Group` translate. Matches
 * the cursor's outer Circle: `r=8 + strokeWidth/2 (5) = 13`.
 */
export const CURSOR_DOT_OVERFLOW = 13;

/** Extra vertical length for the focus needle beyond the chart plot area. */
export const CURSOR_NEEDLE_EXTENSION = 40;
