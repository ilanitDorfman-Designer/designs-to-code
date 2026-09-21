/**
 * Spring animation configurations for toast animations
 * Centralized configs for consistent animation behavior
 */

/**
 * Shared spring config for entry and stack animations
 *
 * Used for both entry animation (smooth slide up) and stack position changes
 * (smooth reordering). These are intentionally kept identical for consistent
 * feel, but can be independently tuned in the future if different timing is needed.
 */
const SHARED_SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.8,
} as const;

/** Entry animation spring config - smooth slide up */
export const ENTRY_SPRING_CONFIG = SHARED_SPRING_CONFIG;

/** Stack position change spring config - smooth reordering */
export const STACK_SPRING_CONFIG = SHARED_SPRING_CONFIG;

/** Swipe bounce-back spring config - snappy return */
export const SWIPE_SPRING_CONFIG = {
  damping: 50,
  stiffness: 500,
} as const;
