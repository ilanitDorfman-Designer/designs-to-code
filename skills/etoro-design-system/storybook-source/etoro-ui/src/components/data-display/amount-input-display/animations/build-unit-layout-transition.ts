// ==============================================
// EtAmountInputDisplay unit-label layout transition
// ==============================================

import type { LayoutAnimation, LayoutAnimationsValues } from 'react-native-reanimated';
import { withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { UNIT_SLIDE_DELETE_DELAY_MS, UNIT_SLIDE_SPRING } from './constants';

/**
 * Direction-aware layout transition for the trailing unit label so it never snaps as the number width
 * changes:
 * - Typing (the number grows, pushing the unit right): the unit slides to its new x immediately with a
 *   gentle spring, gliding alongside the digits.
 * - Deleting (the number shrinks, pulling the unit left): the unit holds ~one digit-exit fade, then
 *   slides in to fill the void — so it doesn't lurch left while the removed digit is still fading out.
 *
 * Only `originX` travels; `originY`/`width`/`height` snap to target (the label's own size is stable, so
 * animating them would only add jitter).
 */
export function unitLayoutTransition(values: LayoutAnimationsValues): LayoutAnimation {
  'worklet';
  const isShrinking = values.targetOriginX < values.currentOriginX;
  const originX = isShrinking
    ? withDelay(UNIT_SLIDE_DELETE_DELAY_MS, withSpring(values.targetOriginX, UNIT_SLIDE_SPRING))
    : withSpring(values.targetOriginX, UNIT_SLIDE_SPRING);

  return {
    initialValues: {
      originX: values.currentOriginX,
      originY: values.currentOriginY,
      width: values.currentWidth,
      height: values.currentHeight,
    },
    animations: {
      originX,
      originY: withTiming(values.targetOriginY, { duration: 0 }),
      width: withTiming(values.targetWidth, { duration: 0 }),
      height: withTiming(values.targetHeight, { duration: 0 }),
    },
  };
}
