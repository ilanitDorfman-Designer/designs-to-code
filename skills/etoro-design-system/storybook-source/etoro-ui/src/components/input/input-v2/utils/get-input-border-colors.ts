import { eToroTheme } from '../../../../core/styles';

export interface InputBorderColors {
  unfocused: string;
  focused: string;
}

export interface GetInputBorderColorsState {
  disabled: boolean;
  readonly: boolean;
  error: string | null;
}

/**
 * Resolves EtInput v2's unfocused/focused border colors for the current disabled/readonly/error
 * state. Error takes priority over disabled/readonly — same `verdictNegative600` token as
 * EtCheckbox/EtRadio's error border (see `get-checkbox-colors.ts`) — so the border stays solid
 * red both at rest and while focused, instead of only surfacing via helper text.
 */
export function getInputBorderColors(colors: eToroTheme['colors'], { disabled, readonly, error }: GetInputBorderColorsState): InputBorderColors {
  if (error) {
    return { unfocused: colors.verdictNegative600, focused: colors.verdictNegative600 };
  }

  return {
    /** Disabled state renders a static `carbon300` border (input cannot focus, so the animated border stays at the unfocused stop). */
    unfocused: disabled ? colors.carbon300 : 'transparent',
    /** Solid stroke — `carbon600` per Figma. `readonly` keeps the focus ring hidden. */
    focused: disabled ? colors.carbon300 : readonly ? 'transparent' : colors.carbon600,
  };
}
