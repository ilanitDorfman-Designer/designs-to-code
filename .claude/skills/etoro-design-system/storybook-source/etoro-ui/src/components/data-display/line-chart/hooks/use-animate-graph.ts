/**
 * useAnimateGraph Hook
 *
 * Animates the chart line and gradient when data changes.
 * Uses context for shared values.
 */

import { ChartDataApiEquity } from '@etoro/common/types';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { SharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useLineChartContext } from '../api';
import { GRADIENT_ANIMATION_DELAY, GRADIENT_ANIMATION_DURATION, LINE_ANIMATION_DURATION } from '../constants';
import { getLatestEquity } from '../utils';

// ============================================================================
// Types
// ============================================================================

export interface AnimateGraphParams {
  /** Chart data */
  data: ChartDataApiEquity[];
  /** Stable key for changes that should replay the line draw animation */
  animationKey: string;
  /** Selected value shared value (from parent) */
  selectedValue: SharedValue<number>;
  /** Multiplier for the vertical gradient fade distance */
  gradientFadeEndMultiplier?: number;
  /**
   * Opt-in re-draw trigger. When it changes, the chart redraws — either
   * replaying the draw-in animation or snapping straight to fully-drawn,
   * depending on `animateOnRedraw`. Undefined → the draw only plays when
   * `animationKey` changes.
   */
  redrawKey?: string | number;
  /**
   * How a `redrawKey` change redraws (default `true`): `true` resets to 0 and
   * replays the draw-in animation; `false` snaps straight to fully-drawn with no
   * animation (just repaints, e.g. after react-freeze blanks the canvas).
   */
  animateOnRedraw?: boolean;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Triggers line and gradient animations when data changes.
 * Reads animation shared values from context.
 */
export function useAnimateGraph({
  data,
  animationKey,
  selectedValue,
  gradientFadeEndMultiplier = 1,
  redrawKey,
  animateOnRedraw = true,
}: AnimateGraphParams) {
  const { sharedValues, config } = useLineChartContext();
  const { animationLine, animationGradient } = sharedValues;
  const { height } = config;

  // Read height/multiplier/flag through refs so the redraw effect below can
  // depend only on `redrawKey` — it must NOT re-run (and re-snap the line) on a
  // height change, which would steal the animated draw-in from the mount effect.
  const heightRef = useRef(height);
  heightRef.current = height;
  const gradientFadeEndMultiplierRef = useRef(gradientFadeEndMultiplier);
  gradientFadeEndMultiplierRef.current = gradientFadeEndMultiplier;
  const animateOnRedrawRef = useRef(animateOnRedraw);
  animateOnRedrawRef.current = animateOnRedraw;

  // Reset then replay the line draw + gradient fade on mount and whenever the
  // chart shape changes. `withTiming` animates from the shared value's *current*
  // value, so we must snap back to 0 first or the second play would be a 1→1
  // no-op. A layout effect keeps the reset and the animation start in one
  // synchronous block before paint, so the new path never flashes fully-drawn
  // for a frame.
  useLayoutEffect(() => {
    animationLine.set(0);
    animationGradient.set({ x: 0, y: 0 });

    animationLine.set(withTiming(1, { duration: LINE_ANIMATION_DURATION }));
    animationGradient.set(
      withDelay(GRADIENT_ANIMATION_DELAY, withTiming({ x: 0, y: height * gradientFadeEndMultiplier }, { duration: GRADIENT_ANIMATION_DURATION })),
    );
  }, [animationKey, animationLine, animationGradient, height, gradientFadeEndMultiplier]);

  useEffect(() => {
    selectedValue.set(withTiming(getLatestEquity(data)));
  }, [data, selectedValue]);

  // Consumer-driven redraw trigger (mount run skipped so it never competes with
  // the initial draw-in). Bumping `redrawKey` re-renders the canvas — which is
  // what repaints it after react-freeze blanks it on tab focus-return — then
  // either replays the draw-in animation (`animateOnRedraw`) or snaps straight
  // to fully-drawn so the line just reappears.
  const hasMountedRedraw = useRef(false);
  useLayoutEffect(() => {
    if (!hasMountedRedraw.current) {
      hasMountedRedraw.current = true;
      return;
    }
    const fullyFadedGradient = { x: 0, y: heightRef.current * gradientFadeEndMultiplierRef.current };
    if (animateOnRedrawRef.current) {
      animationLine.set(0);
      animationGradient.set({ x: 0, y: 0 });
      animationLine.set(withTiming(1, { duration: LINE_ANIMATION_DURATION }));
      animationGradient.set(withDelay(GRADIENT_ANIMATION_DELAY, withTiming(fullyFadedGradient, { duration: GRADIENT_ANIMATION_DURATION })));
    } else {
      animationLine.set(1);
      animationGradient.set(fullyFadedGradient);
    }
  }, [redrawKey, animationLine, animationGradient]);
}
