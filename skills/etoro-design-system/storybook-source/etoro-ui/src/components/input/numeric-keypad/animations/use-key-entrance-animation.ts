import { type EntryAnimationsValues, withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { getFlareOffset, getFlareRing } from '../constants';
import { FLARE_BASE_DELAY_MS, FLARE_DISPLACEMENT, FLARE_OPACITY_TIMING, FLARE_RING_STAGGER_MS, FLARE_SPRING, FLARE_START_SCALE } from './constants';

/**
 * The radial entrance flare shared by every key: the key mounts pulled toward the
 * center "5" (scaled down, transparent), then springs out to its slot with a light
 * bounce while fading in. Keys enter in distinct concentric layers around "5" — the
 * center first, then the surrounding ring a beat later, then the outer ring — so the
 * grid blooms outward wave by wave. Returns a custom Reanimated `entering` worklet
 * (or `undefined` when disabled).
 */
export function useKeyEntranceAnimation(animateEntrance: boolean, rowIndex: number, colIndex: number) {
  if (!animateEntrance) return undefined;

  const { colFactor, rowFactor } = getFlareOffset(rowIndex, colIndex);
  const delayMs = FLARE_BASE_DELAY_MS + getFlareRing(rowIndex, colIndex) * FLARE_RING_STAGGER_MS;

  return (values: EntryAnimationsValues) => {
    'worklet';
    const startX = colFactor * values.targetWidth * FLARE_DISPLACEMENT;
    const startY = rowFactor * values.targetHeight * FLARE_DISPLACEMENT;

    return {
      initialValues: {
        opacity: 0,
        transform: [{ translateX: startX }, { translateY: startY }, { scale: FLARE_START_SCALE }],
      },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, FLARE_OPACITY_TIMING)),
        transform: [
          { translateX: withDelay(delayMs, withSpring(0, FLARE_SPRING)) },
          { translateY: withDelay(delayMs, withSpring(0, FLARE_SPRING)) },
          { scale: withDelay(delayMs, withSpring(1, FLARE_SPRING)) },
        ],
      },
    };
  };
}
