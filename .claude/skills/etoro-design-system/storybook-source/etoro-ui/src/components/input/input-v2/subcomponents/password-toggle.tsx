import { Pressable } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { InputPasswordToggleProps } from '../api/types';
import { useInputConfig } from '../context';

/** English fallbacks when `EtInput` password a11y props are omitted; apps should pass localized strings from `InputProps`. */
const DEFAULT_SHOW_PASSWORD_A11Y_LABEL = 'Show password';
const DEFAULT_HIDE_PASSWORD_A11Y_LABEL = 'Hide password';
const DEFAULT_PASSWORD_TOGGLE_A11Y_HINT = 'Toggles password visibility';

/**
 * Eye / eye-off control for password fields; stroke color follows focus, value, and disabled state.
 */
export function PasswordToggle({ isPasswordVisible, handlePasswordVisibility, isFocused, hasValue, disabled = false }: InputPasswordToggleProps) {
  const { colors } = useEtoroTheme();
  const { passwordShowAccessibilityLabel, passwordHideAccessibilityLabel, passwordToggleAccessibilityHint } = useInputConfig();

  // Idle and "filled + blurred" both resolve to `carbon500` post-V2 migration (Figma + V1 hex converge to #999999),
  // so the prior 4-state ternary collapses to 3 states. `hasValue` is intentionally unused here.
  void hasValue;
  const iconColor = disabled ? colors.carbon300 : isFocused ? colors.carbon900 : colors.carbon500;

  return (
    <Pressable
      testID="password-toggle-icon"
      onPress={disabled ? undefined : handlePasswordVisibility}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={
        isPasswordVisible
          ? (passwordHideAccessibilityLabel ?? DEFAULT_HIDE_PASSWORD_A11Y_LABEL)
          : (passwordShowAccessibilityLabel ?? DEFAULT_SHOW_PASSWORD_A11Y_LABEL)
      }
      accessibilityHint={passwordToggleAccessibilityHint ?? DEFAULT_PASSWORD_TOGGLE_A11Y_HINT}
      accessibilityState={{ disabled }}
    >
      {/* TODO: flatten props once we tackle EtoroIcon */}
      <EtoroIcon icon={{ iconName: isPasswordVisible ? 'eye' : 'eyeOff' }} appearance={{ size: 20, color: iconColor }} />
    </Pressable>
  );
}
