import { useEffect } from 'react';
import { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { X2 } from '../../../core/styles/spacing';
import { getFontFamily } from '../../../foundations/text/utils/font-mapping';
import { VARIANT_CONFIG } from '../../../foundations/text/utils/variant-config';
import { INPUT_COMPACT_LABEL_FIELD_GAP, INPUT_INNER_HEIGHT } from '../../input/input-v2';

const FLOAT_LABEL_TIMING_MS = 220;

/** body-base-regular vs body-tiny-medium (matches InputV2 floating label) */
const LABEL_IDLE = VARIANT_CONFIG['body-base-regular'];
const LABEL_COMPACT = VARIANT_CONFIG['body-tiny-medium'];
const LABEL_IDLE_FONT_FAMILY = getFontFamily(LABEL_IDLE.weight);
const LABEL_COMPACT_FONT_FAMILY = getFontFamily(LABEL_COMPACT.weight);

/**
 * Top padding to vertically center the idle label in the inner field area (large line).
 */
const IDLE_LABEL_TOP_PAD = Math.max(0, (INPUT_INNER_HEIGHT - LABEL_IDLE.lineHeight) / 2);

interface UseDatepickerAnimationsProps {
  isFocused: boolean;
  /**
   * `isFocused || hasValue` — computed once in the provider and shared with label/display
   * consumers so all three sites move in lockstep (see `DatepickerStateContextValue.isCompact`).
   */
  isCompact: boolean;
  /**
   * D8: when disabled, the border must stay at the idle stop (`carbon300`) regardless of
   * error or focus. InputV2's disabled pattern shows no error signal on the border.
   */
  disabled: boolean;
  /**
   * Readonly is quiet chrome — no focus ring, no error ring. Same policy as `disabled`
   * on the border, so `readonly + error` doesn't paint the full-box error color.
   */
  readonly: boolean;
  hasError: boolean;
  /** Idle stop — always visible (D9). Typically `carbon300`. */
  idleBorderColor: string;
  /** Focus stop — typically `carbon600`. */
  focusedBorderColor: string;
  /** Error stop — `actionBrandVarText` (D4). */
  errorBorderColor: string;
  /** Large idle label color. */
  idleLabelColor: string;
  /** Compact label color. */
  compactLabelColor: string;
}

/**
 * Whether the focus channel drives the border. Under a hard override (disabled/readonly),
 * focus is suppressed — the field enters quiet chrome and shows only the idle stop.
 * Exported for pinning the policy in unit tests.
 */
export function isFocusActive(disabled: boolean, readonly: boolean, isFocused: boolean): boolean {
  if (disabled || readonly) {
    return false;
  }
  return isFocused;
}

/**
 * Whether the error channel drives the border. Under a hard override (disabled/readonly),
 * error is suppressed — the field stays on the idle stop (D8 + quiet-chrome).
 * Exported for pinning the policy in unit tests.
 */
export function isErrorActive(disabled: boolean, readonly: boolean, hasError: boolean): boolean {
  if (disabled || readonly) {
    return false;
  }
  return hasError;
}

/** Label compact progress target: compact → 1, else 0. */
function getLabelCompactTarget(isCompact: boolean): number {
  return isCompact ? 1 : 0;
}

const timingConfig = { duration: FLOAT_LABEL_TIMING_MS, easing: Easing.out(Easing.cubic) };

/**
 * Reanimated styles for EtDatepicker inputField: full-box border (idle/focus/error),
 * floating label (size/position/color), and field-row inset — InputV2 chrome with D4/D9.
 *
 * Border animation uses two independent 0..1 drivers rather than a single 3-stop driver:
 *   - `focusProgress` blends idle → focused inside the base color.
 *   - `errorProgress` blends that base color → error to produce the final border color.
 *
 * Composing two two-stop interpolations avoids the transient "flash" that a single
 * `[0, 1, 2]` driver would produce on non-adjacent transitions (idle ↔ error), where
 * `withTiming` would ramp the driver through the focus stop and briefly paint carbon600
 * on the box mid-fade. Adjacent transitions (idle ↔ focus, focus ↔ error, error ↔ focus)
 * remain smooth; idle ↔ error now interpolates directly between those two colors.
 */
export function useDatepickerAnimations({
  isFocused,
  isCompact,
  disabled,
  readonly,
  hasError,
  idleBorderColor,
  focusedBorderColor,
  errorBorderColor,
  idleLabelColor,
  compactLabelColor,
}: UseDatepickerAnimationsProps) {
  const focusProgress = useSharedValue(isFocusActive(disabled, readonly, isFocused) ? 1 : 0);
  const errorProgress = useSharedValue(isErrorActive(disabled, readonly, hasError) ? 1 : 0);
  const labelCompactProgress = useSharedValue(getLabelCompactTarget(isCompact));

  const focusActive = isFocusActive(disabled, readonly, isFocused);
  const errorActive = isErrorActive(disabled, readonly, hasError);

  useEffect(() => {
    const hardOverride = disabled || readonly;
    // D8 + quiet-chrome: snap both drivers to idle without timing so entering
    // disabled/readonly instantly clears any focus or error signal on the border.
    // Without the snap, `withTiming(0)` from focused/error would fade the color
    // over 220ms and briefly contradict the "no state signals" semantic.
    // On exit, the next effect run picks up the normal withTiming path.
    if (hardOverride) {
      focusProgress.set(0);
      errorProgress.set(0);
      return;
    }
    focusProgress.set(withTiming(focusActive ? 1 : 0, timingConfig));
    errorProgress.set(withTiming(errorActive ? 1 : 0, timingConfig));
  }, [disabled, readonly, focusActive, errorActive, focusProgress, errorProgress]);

  useEffect(() => {
    const target = getLabelCompactTarget(isCompact);
    labelCompactProgress.set(withTiming(target, timingConfig));
  }, [isCompact, labelCompactProgress]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const baseColor = interpolateColor(focusProgress.get(), [0, 1], [idleBorderColor, focusedBorderColor]);
    const borderColor = interpolateColor(errorProgress.get(), [0, 1], [baseColor, errorBorderColor]);

    return {
      borderWidth: 1,
      borderColor,
      borderRadius: X2,
    };
  });

  /** Pads the overlay so the big label sits in the same vertical band as the value. */
  const animatedLabelContainerStyle = useAnimatedStyle(() => {
    const p = labelCompactProgress.get();
    return {
      paddingTop: interpolate(p, [0, 1], [IDLE_LABEL_TOP_PAD, 0]),
    };
  });

  /**
   * Pushes the value row down as the label animates to the compact (top) position,
   * so the date text does not sit under the label.
   */
  const animatedFieldRowStyle = useAnimatedStyle(() => {
    const p = labelCompactProgress.get();
    return {
      paddingTop: interpolate(p, [0, 1], [0, LABEL_COMPACT.lineHeight + INPUT_COMPACT_LABEL_FIELD_GAP]),
    };
  });

  const animatedLabelTextStyle = useAnimatedStyle(() => {
    const p = labelCompactProgress.get();
    return {
      fontSize: interpolate(p, [0, 1], [LABEL_IDLE.size, LABEL_COMPACT.size]),
      lineHeight: interpolate(p, [0, 1], [LABEL_IDLE.lineHeight, LABEL_COMPACT.lineHeight]),
      letterSpacing: interpolate(p, [0, 1], [LABEL_IDLE.letterSpacing, LABEL_COMPACT.letterSpacing]),
      color: interpolateColor(p, [0, 1], [idleLabelColor, compactLabelColor]),
      fontFamily: p < 0.5 ? LABEL_IDLE_FONT_FAMILY : LABEL_COMPACT_FONT_FAMILY,
    };
  });

  return {
    animatedBorderStyle,
    animatedLabelContainerStyle,
    animatedFieldRowStyle,
    animatedLabelTextStyle,
  };
}
