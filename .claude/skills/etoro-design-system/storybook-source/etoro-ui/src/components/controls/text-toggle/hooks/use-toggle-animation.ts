import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { OptionLayout } from '../api/types';

/** Single source of truth for the indicator's spring "feel". */
export const TEXT_TOGGLE_SPRING_CONFIG = {
  damping: 30,
  stiffness: 300,
  mass: 1.7,
};

/**
 * Computes the indicator's animated transform. The spring itself is
 * driven from `TextToggleProvider.animateToIndex` (UI thread, kicked
 * off by press handlers) — this hook only reads `selectedProgress`
 * and the per-option layouts to interpolate the indicator's position
 * and width across the two adjacent option rectangles.
 *
 * Using measured layouts — instead of `containerWidth / optionsCount` —
 * is what makes `stretch={false}` toggles align correctly when options
 * have intrinsic, label-driven widths.
 *
 * All math here is physical (left-based): `onLayout.x` is physical in
 * both directions, and `<ToggleLayout>` pins the indicator's anchor to
 * the physical left edge in RTL too, so no direction handling is needed.
 */
export function useToggleAnimation(optionsCount: number, optionLayoutsShared: SharedValue<OptionLayout[]>, selectedProgress: SharedValue<number>) {
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const layouts = optionLayoutsShared.value;

    // Defensive — `<ToggleLayout>` already gates render on `layoutsReady`.
    if (layouts.length === 0 || optionsCount === 0) {
      return { transform: [{ translateX: 0 }], width: 0 };
    }

    const progress = selectedProgress.value;
    const lastIndex = layouts.length - 1;

    if (lastIndex === 0) {
      return { transform: [{ translateX: layouts[0].x }], width: layouts[0].width };
    }

    // The spring overshoots its target before settling. To let that
    // overshoot visually bounce past either edge, extrapolate against
    // the first/last *segment* on overshoot rather than clamping to a
    // degenerate [edge, edge] range that would flatten the bounce.
    let lower: number;
    let upper: number;
    if (progress < 0) {
      lower = 0;
      upper = 1;
    } else if (progress > lastIndex) {
      lower = lastIndex - 1;
      upper = lastIndex;
    } else {
      lower = Math.floor(progress);
      upper = lower < lastIndex ? lower + 1 : lower;
    }

    const fraction = progress - lower;
    const lowerLayout = layouts[lower];
    const upperLayout = layouts[upper];

    return {
      transform: [{ translateX: lowerLayout.x + fraction * (upperLayout.x - lowerLayout.x) }],
      width: lowerLayout.width + fraction * (upperLayout.width - lowerLayout.width),
    };
  }, [optionsCount]);

  return { animatedIndicatorStyle };
}
