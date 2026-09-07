import { useAnimatedStyle } from 'react-native-reanimated';

import { useAmountAutoScale } from './use-amount-auto-scale';
import { useCaretBlinkAnimation } from './use-caret-blink-animation';
import { useShakeAnimation } from './use-shake-animation';

interface UseAmountInputDisplayAnimationsParams {
  value: string;
  availableWidth: number;
  affixWidth: number;
  digitWidth: number;
  autoScale: boolean;
  showCursor: boolean;
  shakeTrigger: number;
  shrinkStartDigits?: number;
  shrinkStepPerDigit?: number;
  progressiveMinScale?: number;
  overflowMinScale?: number;
}

/**
 * Orchestrates every animation for the amount row: the fit-to-width + progressive auto-scale, the
 * error shake, and the caret blink. Returns the animated styles and the caret's shared opacity. All
 * motion runs on the UI thread (transform/opacity only).
 */
export function useAmountInputDisplayAnimations(params: UseAmountInputDisplayAnimationsParams) {
  // When auto-scale is off, neutralize both shrink terms so the row stays at scale 1: zero the container
  // width (disables the overflow guard) and push the progressive threshold out of reach.
  const { scaleStyle } = useAmountAutoScale({
    value: params.value,
    availableWidth: params.autoScale ? params.availableWidth : 0,
    affixWidth: params.affixWidth,
    digitWidth: params.digitWidth,
    shrinkStartDigits: params.autoScale ? params.shrinkStartDigits : Number.POSITIVE_INFINITY,
    shrinkStepPerDigit: params.shrinkStepPerDigit,
    progressiveMinScale: params.progressiveMinScale,
    overflowMinScale: params.overflowMinScale,
  });

  const shakeX = useShakeAnimation(params.shakeTrigger);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const caretOpacity = useCaretBlinkAnimation(params.showCursor);

  return { scaleStyle, shakeStyle, caretOpacity };
}

/** Everything the amount row needs to render its animations (animated styles + caret opacity). */
export type AmountInputDisplayAnimations = ReturnType<typeof useAmountInputDisplayAnimations>;
