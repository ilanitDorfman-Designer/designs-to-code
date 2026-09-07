import { Easing, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

// ---------------------------------------------------------------------------
// Key press feedback
// ---------------------------------------------------------------------------

/** Spring config for the clear-key inversion (finger down) and collapse (finger up). */
export const PRESS_SPRING: WithSpringConfig = { damping: 15, stiffness: 120, mass: 0.85 };

/**
 * One-shot press pulse for digit keys. The circle grows in then fades out as a
 * single fixed animation on every tap, so the feedback is identical and distinct
 * regardless of how long the key is held (a quick tap and a long press look the same).
 */
export const PRESS_PULSE_IN: WithTimingConfig = { duration: 110, easing: Easing.out(Easing.quad) };
export const PRESS_PULSE_OUT: WithTimingConfig = { duration: 260, easing: Easing.in(Easing.quad) };

/** Resting scale of the press circle (kept mounted, pulses up on press). */
export const PRESS_CIRCLE_REST_SCALE = 0.3;

/** Glyph scale while pressed — grows with the press circle instead of dipping. */
export const GLYPH_PRESSED_SCALE = 1.15;

// ---------------------------------------------------------------------------
// Entrance flare (radial bloom outward from the center "5")
// ---------------------------------------------------------------------------

/**
 * Light spring with a touch of overshoot for the flare bloom — springy enough to
 * feel alive as each key snaps into its slot, without a harsh bounce. Drives the
 * translate-back-to-slot and scale-up of the custom entering worklet.
 */
export const FLARE_SPRING: WithSpringConfig = { damping: 14, stiffness: 130, mass: 0.9 };

/** Quick opacity fade-in paired with the flare spring so keys don't pop in fully opaque. */
export const FLARE_OPACITY_TIMING: WithTimingConfig = { duration: 180, easing: Easing.out(Easing.quad) };

/** Starting scale of each key before it blooms up to full size. */
export const FLARE_START_SCALE = 0.6;

/**
 * Fraction of the full offset toward the center "5" that a key starts displaced by.
 * Kept partial so the 12 keys read as a gentle outward bloom instead of all
 * collapsing onto "5" and exploding out.
 */
export const FLARE_DISPLACEMENT = 0.35;

/**
 * Delay (ms) between each concentric ring so the layers enter one after another: "5" first, then the
 * surrounding ring a beat later, then the outer ring. Large enough to read as distinct waves.
 */
export const FLARE_RING_STAGGER_MS = 100;

/** Base delay (ms) before the flare begins. */
export const FLARE_BASE_DELAY_MS = 25;

// ---------------------------------------------------------------------------
// Top-edge self-drawing outline
// ---------------------------------------------------------------------------

// The hairline draws itself from the top-center outward on mount (two half-paths
// revealed via strokeDashoffset), around the corners and down the sides.

/** Duration (ms) of the center-out self-drawing reveal of the outline. */
export const KEYPAD_EDGE_DRAW_MS = 600;

/** Delay (ms) before the draw starts, so it runs after the keyboard finishes opening. */
export const KEYPAD_EDGE_DRAW_DELAY_MS = 200;

/** Extra dash length (pt) so the strokeDashoffset reveal spans (nearly) the whole animation. */
export const KEYPAD_EDGE_DRAW_DASH_PAD = 24;

// ---------------------------------------------------------------------------
// Drawer dismiss (drag the handle down to close)
// ---------------------------------------------------------------------------

/** Downward drag distance (pt) past which release dismisses the keypad. */
export const KEYPAD_DISMISS_DISTANCE = 56;

/** Downward fling velocity (pt/s) past which release dismisses regardless of distance. */
export const KEYPAD_DISMISS_VELOCITY = 800;

/** Timing config for the slide-out before the dismiss callback fires. */
export const KEYPAD_DISMISS_TIMING: WithTimingConfig = { duration: 200, easing: Easing.out(Easing.cubic) };

/** Spring config for snapping the keypad back when released before the threshold. */
export const KEYPAD_SNAPBACK_SPRING: WithSpringConfig = { damping: 18, stiffness: 200, mass: 0.6 };

/** Fallback travel distance (pt) used for slide-out/opacity before the height is measured. */
export const KEYPAD_DISMISS_FALLBACK_HEIGHT = 320;
