/**
 * Animation duration for accordion animations (ms)
 * Used for both content height and chevron rotation animations
 */
export const ANIMATION_DURATION = 300;

/**
 * Spring configuration for accordion animations
 * Creates a subtle bounce effect when opening/closing
 */
export const SPRING_CONFIG = {
  damping: 15, // Lower = more bouncy
  stiffness: 150, // Higher = faster
  mass: 1,
  overshootClamping: false, // Allow the bounce overshoot
};
