import { useEffect } from 'react';
import { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { X2 } from '../../../../core/styles/spacing';
import { getFontFamily } from '../../../../foundations/text/utils/font-mapping';
import { VARIANT_CONFIG } from '../../../../foundations/text/utils/variant-config';
import { INPUT_COMPACT_LABEL_FIELD_GAP, INPUT_INNER_HEIGHT } from '../utils/input-layout-metrics';

const FLOAT_LABEL_TIMING_MS = 220;

/** body-base-regular vs body-tiny-medium (Figma floating label) */
const LABEL_IDLE = VARIANT_CONFIG['body-base-regular'];
const LABEL_COMPACT = VARIANT_CONFIG['body-tiny-medium'];
const LABEL_IDLE_FONT_FAMILY = getFontFamily(LABEL_IDLE.weight);
const LABEL_COMPACT_FONT_FAMILY = getFontFamily(LABEL_COMPACT.weight);

/**
 * Top padding to vertically center the idle label in the inner field area (large line).
 * Uses `INPUT_INNER_HEIGHT` from `utils/input-layout-metrics.ts` — same box model as `et-input` `inputContainer`.
 */
const IDLE_LABEL_TOP_PAD = Math.max(0, (INPUT_INNER_HEIGHT - LABEL_IDLE.lineHeight) / 2);

interface UseInputAnimationsProps {
  isFocused: boolean;
  hasValue: boolean;
  /** Forces the label into the compact (top) position regardless of focus/value, so the placeholder area is free. */
  staticLabel?: boolean;
  /** Unfocused — no visible border (typically transparent). Error is shown via helper text only, not border. */
  unfocusedBorderColor: string;
  /** Focus ring — must be a solid token; very transparent colors disappear on gray fills. */
  focusedBorderColor: string;
  /** `textSecondaryNeutral` — large idle label (matches body-base-regular). */
  idleLabelColor: string;
  /** `textTertiaryNeutral` — compact label (matches body-tiny-medium). */
  compactLabelColor: string;
}

/** Border color stops: 0 unfocused, 1 focused */
function getBorderColorStop(isFocused: boolean): number {
  return isFocused ? 1 : 0;
}

/** Animation driver for label compact state: `1` when focused, non-empty, or pinned via `staticLabel`, else `0`. */
function getLabelCompactTarget(isFocused: boolean, hasValue: boolean, staticLabel: boolean): number {
  return staticLabel || isFocused || hasValue ? 1 : 0;
}

const timingConfig = { duration: FLOAT_LABEL_TIMING_MS, easing: Easing.out(Easing.cubic) };

/**
 * Reanimated styles for EtInput v2: border color, floating label (size/position/color), and field row offset.
 * Keeps typography and motion aligned with the design-system tokens passed from `InputProvider`.
 */
export function useInputAnimations({
  isFocused,
  hasValue,
  staticLabel = false,
  unfocusedBorderColor,
  focusedBorderColor,
  idleLabelColor,
  compactLabelColor,
}: UseInputAnimationsProps) {
  const borderColorAnim = useSharedValue(getBorderColorStop(isFocused));
  const labelCompactProgress = useSharedValue(getLabelCompactTarget(isFocused, hasValue, staticLabel));

  useEffect(() => {
    const targetValue = getBorderColorStop(isFocused);
    borderColorAnim.set(withTiming(targetValue, timingConfig));
  }, [isFocused, borderColorAnim]);

  useEffect(() => {
    const target = getLabelCompactTarget(isFocused, hasValue, staticLabel);
    labelCompactProgress.set(withTiming(target, timingConfig));
  }, [isFocused, hasValue, staticLabel, labelCompactProgress]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(borderColorAnim.get(), [0, 1], [unfocusedBorderColor, focusedBorderColor]);

    return {
      borderWidth: 1,
      borderColor,
      borderRadius: X2,
    };
  });

  /** Pads the overlay so the big label sits in the same vertical band as the input text. */
  const animatedLabelContainerStyle = useAnimatedStyle(() => {
    const p = labelCompactProgress.get();
    return {
      paddingTop: interpolate(p, [0, 1], [IDLE_LABEL_TOP_PAD, 0]),
    };
  });

  /**
   * Pushes the text field down as the label animates to the compact (top) position,
   * matching the two-row layout so typed text does not sit under the label.
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
