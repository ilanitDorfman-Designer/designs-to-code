/**
 * Shared constants for EtBottomSheet component.
 * Component-specific constants are co-located with their components.
 *
 * Note: Handle-specific constants are in subcomponents/handle/et-bottom-sheet-handle.const.ts
 */

import { X2 } from '../../../../core/styles/spacing';

// ============================================================================
// Animation Constants
// ============================================================================

/**
 * Reference animation duration in milliseconds.
 *
 * Note: This constant is not directly used by the component (spring animations
 * are controlled by SPRING_CONFIG), but is kept for:
 * 1. Documentation reference for animation timing
 * 2. Deriving related constants like ACCESSIBILITY_ANNOUNCEMENT_DELAY
 * 3. Potential future use for non-spring animations
 */
export const ANIMATION_DURATION = 300;

/**
 * Spring animation config for smooth animations (legacy internal default).
 * @deprecated Use SMOOTH_SPRING_CONFIG for preset-based animations.
 */
export const SPRING_CONFIG = {
  damping: 50,
  stiffness: 500,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/** Bouncy open/close spring — slight overshoot on settle (v1 default). */
export const BOUNCY_SPRING_CONFIG = {
  stiffness: 300,
  mass: 0.6,
  damping: 20,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/** Smooth open/close spring — subtle spring with minimal bounce. */
export const SMOOTH_SPRING_CONFIG = {
  damping: 60,
  stiffness: 450,
  mass: 1,
  overshootClamping: false,
  energyThreshold: 0.3,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/** Fast open/close spring — snappy, overdamped transition. */
export const FAST_SPRING_CONFIG = {
  damping: 80,
  stiffness: 800,
  mass: 1,
  overshootClamping: true,
  energyThreshold: 0.1,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/**
 * Reduced motion spring config (faster, no bounce).
 */
export const REDUCED_MOTION_SPRING_CONFIG = {
  damping: 100,
  stiffness: 1000,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// ============================================================================
// Layout Constants (used by main EtBottomSheet component)
// ============================================================================

/**
 * Vertical padding for scroll view content container.
 * Uses X2 (8px) from design system spacing.
 */
export const PADDING_VERTICAL = X2; // 8px

/**
 * Default ratio of screen height for scrollable content max height.
 * When content is scrollable, we cap the sheet height so the scroll view
 * has a constrained area to scroll within.
 */
export const SCROLLABLE_CONTENT_MAX_HEIGHT_RATIO = 0.9;

/**
 * Minimum bottom safe area padding in pixels.
 * Used when device safe area insets are smaller than this value
 * to ensure consistent spacing on all devices.
 * Note: This is a technical constant, not from design system.
 */
export const MIN_BOTTOM_SAFE_AREA_PADDING = 16;

/**
 * Transparent color constant to avoid ESLint color literal warnings.
 */
export const TRANSPARENT = 'transparent';

/**
 * Minimum height for loading containers.
 */
export const LOADING_CONTAINER_MIN_HEIGHT = 200;

// ============================================================================
// Accessibility Constants
// ============================================================================

/**
 * Calculated settling time for spring animation accessibility announcements (smooth preset).
 *
 * Based on SMOOTH_SPRING_CONFIG physics:
 * - damping: 60, stiffness: 450, mass: 1, overshootClamping: false
 *
 * Final value: 350ms (conservative buffer for device variance)
 *
 * IMPORTANT: If preset spring configs change, update ACCESSIBILITY_ANNOUNCEMENT_DELAYS
 * in this file.
 *
 * FUTURE ENHANCEMENT: Consider using animatedPosition SharedValue with
 * useAnimatedReaction to detect actual animation completion for more
 * robust timing that adapts to any spring configuration.
 */
export const ACCESSIBILITY_ANNOUNCEMENT_DELAY = 350;

/** Preset-specific delays for screen-reader "opened" announcements. */
export const ACCESSIBILITY_ANNOUNCEMENT_DELAYS = {
  smooth: 350,
  bouncy: 450,
  fast: 250,
} as const;
