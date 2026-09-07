// ==============================================
// EtAmountInputDisplay Animation Constants
// ==============================================

import { LinearTransition } from 'react-native-reanimated';

/** Gentle spring so existing digits slide to make room for a new one with a slight settle, no snap. */
export const makeRoomTransition = LinearTransition.springify().damping(16).stiffness(210).mass(1);

/** Short settle so per-keystroke width changes scale smoothly instead of popping. */
export const AUTO_SCALE_SETTLE_MS = 120;

/** Unit label slide: gentle spring so it glides to its new x with a slight settle (never snaps). */
export const UNIT_SLIDE_SPRING = { damping: 18, stiffness: 220, mass: 1 } as const;
/** On delete the unit holds ~one digit-exit fade before sliding in, so it doesn't lurch left while the
 * removed digit is still fading out. Roughly matches EtAnimatedCount's EXIT_DURATION (180ms). */
export const UNIT_SLIDE_DELETE_DELAY_MS = 170;

/** Caret blink: fade duration and the hold at each end, so it breathes instead of hard-cutting. */
export const CARET_FADE_MS = 220;
export const CARET_HOLD_MS = 480;

/** Horizontal displacement (px) of the shake's initial kick. */
export const SHAKE_OFFSET = 20;
/** Near-instant snap to the offset (very high stiffness/damping = no travel time). */
export const SHAKE_KICK = { damping: 90000, stiffness: 90000, mass: 1.2 } as const;
/** Bouncy settle back to rest so the shake reads as an energetic error nudge. */
export const SHAKE_SETTLE = { damping: 5, stiffness: 800, mass: 1.2 } as const;
