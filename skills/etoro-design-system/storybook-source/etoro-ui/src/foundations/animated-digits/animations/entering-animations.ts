// ==============================================
// EtAnimatedCount entering / layout animation builders
// ==============================================

import { LinearTransition, withSpring, withTiming } from 'react-native-reanimated';

import { ANIMATION_CONFIG } from './constants';

/**
 * Gentle spring for the slide-to-make-room reflow, built once so it isn't reallocated per render.
 */
export const makeRoomTransition = LinearTransition.springify()
  .damping(ANIMATION_CONFIG.MAKE_ROOM_SPRING_CONFIG.damping)
  .stiffness(ANIMATION_CONFIG.MAKE_ROOM_SPRING_CONFIG.stiffness)
  .mass(ANIMATION_CONFIG.MAKE_ROOM_SPRING_CONFIG.mass);

/**
 * Custom Reanimated entering: the newly typed digit drops in from above (translateY -height -> 0) with
 * a slight spring, while fading opacity 0 -> 1 so it materialises as it slides in. Driven by Reanimated at
 * view creation on the UI thread, so it always interpolates and is never gated by JS effect timing (no
 * flash, no inconsistent lag). No delay: the digit is never held blank, so a slot can't be caught blank if
 * a fast next keystroke supersedes it.
 */
export function buildDropInEntering(height: number) {
  const spring = ANIMATION_CONFIG.ENTRANCE_SPRING_CONFIG;
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: -height }] },
      animations: {
        opacity: withTiming(1, { duration: ANIMATION_CONFIG.ENTER_DURATION + 200 }),
        transform: [{ translateY: withSpring(0, spring) }],
      },
    };
  };
}

/**
 * Resolves the container-level layout animation. Only pay for the container layout animation when the
 * character count actually changes (a digit or separator was added/removed) or in leading/typed mode where
 * the make-room reflow is always desired. Decimal odometer ticks keep the same width, so re-registering a
 * layout animation on every price tick is wasted work.
 */
export function getContainerLayout(disableAnimation: boolean, enterFromBlank: boolean, charCountChanged: boolean) {
  if (disableAnimation) {
    return undefined;
  }
  return enterFromBlank || charCountChanged ? LinearTransition.springify() : undefined;
}
