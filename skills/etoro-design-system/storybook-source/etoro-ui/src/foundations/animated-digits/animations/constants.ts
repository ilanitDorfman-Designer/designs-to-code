// ==============================================
// EtAnimatedCount Animation Constants
// ==============================================

/**
 * Animation configuration constants
 */
export const ANIMATION_CONFIG = {
  /** Duration for fade in/out animations */
  FADE_DURATION: 250,
  /** Duration for a slot entering as a digit/group is added. */
  ENTER_DURATION: 200,
  /** Duration for a slot exiting as a digit/group is removed. */
  EXIT_DURATION: 180,
  /** Spring animation configuration for digit movement */
  SPRING_CONFIG: {
    damping: 75,
    stiffness: 1000,
    mass: 3,
  },
  /** Springy make-room reflow (existing digits slide over with a little bounce as they settle). */
  MAKE_ROOM_SPRING_CONFIG: {
    damping: 16,
    stiffness: 210,
    mass: 1,
  },
  /** Bouncy spring for a new digit dropping into its slot: a noticeable overshoot so the entrance pops. */
  ENTRANCE_SPRING_CONFIG: {
    damping: 20,
    stiffness: 200,
    mass: 1,
  },
} as const;
