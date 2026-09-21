import type { ColorValue } from 'react-native';

import type { eToroTheme } from '../../../../core/styles';

export interface ToggleSwitchColors {
  /** Track color when switch is off */
  trackOff: string;
  /** Track color when switch is on */
  trackOn: string;
  /** Track color when disabled */
  trackDisabled: string;
  /** Thumb color for normal state */
  thumb: string;
  /** Thumb color when disabled */
  thumbDisabled: string;
}

/**
 * Returns toggle switch colors based on theme.
 *
 * Colors aligned with Figma design spec:
 * - Track Off: bgGreyPrimary (gray)
 * - Track On: actionBrandText (#0eb12e) - brand green
 * - Track Disabled: bgActionDisabled (#E5E5E5)
 * - Thumb: white (#ffffff)
 * - Thumb Disabled: #bfbfbf (per Figma)
 */
export function getToggleSwitchColors(themeColors: eToroTheme['colors']): ToggleSwitchColors {
  return {
    trackOff: themeColors.bgGreyPrimary,
    trackOn: themeColors.actionBrandText,
    trackDisabled: themeColors.bgActionDisabled,
    thumb: '#ffffff',
    thumbDisabled: '#bfbfbf',
  };
}

/**
 * Resolve track and thumb colors from props or theme defaults.
 * Accepts React Native's ColorValue types for compatibility with SwitchProps.
 * Only string values are used; non-string ColorValues fall back to theme defaults.
 */
export function resolveToggleColors(
  themeColors: eToroTheme['colors'],
  trackColorProp?: { false?: ColorValue | null; true?: ColorValue | null },
  thumbColorProp?: ColorValue | null,
  disabled?: boolean,
): {
  trackColorOff: string;
  trackColorOn: string;
  thumbColor: string;
} {
  const defaults = getToggleSwitchColors(themeColors);

  if (disabled) {
    return {
      trackColorOff: defaults.trackDisabled,
      trackColorOn: defaults.trackDisabled,
      thumbColor: defaults.thumbDisabled,
    };
  }

  // Extract string values, falling back to defaults for non-string ColorValues
  const trackOff = typeof trackColorProp?.false === 'string' ? trackColorProp.false : defaults.trackOff;
  const trackOn = typeof trackColorProp?.true === 'string' ? trackColorProp.true : defaults.trackOn;
  const thumb = typeof thumbColorProp === 'string' ? thumbColorProp : defaults.thumb;

  return {
    trackColorOff: trackOff,
    trackColorOn: trackOn,
    thumbColor: thumb,
  };
}
