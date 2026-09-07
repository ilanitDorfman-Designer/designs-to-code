import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { computeAmountScale, type ComputeAmountScaleParams } from '../utils/compute-amount-scale';
import { AUTO_SCALE_SETTLE_MS } from './constants';

export interface UseAmountAutoScaleParams extends ComputeAmountScaleParams {
  /** Settle duration (ms) for the scale tween (default 120). */
  settleMs?: number;
}

/**
 * Drives a fit-to-width + progressive shrink scale for an animated amount row. The target scale is
 * derived on JS from the value and measured widths, then animated toward via `withTiming` so the
 * tween itself runs entirely on the UI thread. Apply the returned `scaleStyle` to the row that holds
 * the number and its affixes (currency/unit) so they shrink together.
 */
export function useAmountAutoScale(params: UseAmountAutoScaleParams) {
  const { settleMs = AUTO_SCALE_SETTLE_MS, ...scaleParams } = params;
  const targetScale = computeAmountScale(scaleParams);

  // Initialize at the target so a value that mounts already-large renders scaled without a first-frame flash.
  const scale = useSharedValue(targetScale);
  useEffect(() => {
    scale.set(withTiming(targetScale, { duration: settleMs }));
  }, [scale, targetScale, settleMs]);

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return { scaleStyle, targetScale };
}
