import { useEffect } from 'react';
import { Easing, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { KEYPAD_EDGE_DRAW_DELAY_MS, KEYPAD_EDGE_DRAW_MS } from './constants';

/**
 * Self-drawing reveal of the top-edge hairline: on mount the outline paints itself
 * from the top-center apex outward via `strokeDashoffset`. Returns the animated
 * props to spread onto the dashed `AnimatedPath`s (both share the same reveal).
 */
export function useEdgeDrawAnimation(dashLength: number) {
  const draw = useSharedValue(0);

  useEffect(() => {
    draw.set(withDelay(KEYPAD_EDGE_DRAW_DELAY_MS, withTiming(1, { duration: KEYPAD_EDGE_DRAW_MS, easing: Easing.out(Easing.cubic) })));
  }, [draw]);

  const drawProps = useAnimatedProps(() => ({
    strokeDashoffset: dashLength * (1 - draw.get()),
  }));

  return drawProps;
}
