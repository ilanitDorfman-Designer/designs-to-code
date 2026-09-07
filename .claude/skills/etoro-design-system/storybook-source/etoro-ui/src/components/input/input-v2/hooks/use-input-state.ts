import * as Haptics from 'expo-haptics';
import { useState } from 'react';

interface UseInputStateProps {
  haptics?: boolean;
  disabled?: boolean;
  /** Initial value of `isPasswordVisible`. Defaults to `false` (masked). */
  initialPasswordVisible?: boolean;
}

/**
 * Local focus and password-visibility toggles, with optional light haptics when enabled and not disabled.
 */
export function useInputState(props?: UseInputStateProps) {
  const { haptics = true, disabled = false, initialPasswordVisible = false } = props || {};
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(initialPasswordVisible);

  const handleFocus = () => {
    if (haptics && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handlePasswordVisibility = () => {
    if (haptics && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsPasswordVisible(!isPasswordVisible);
  };

  return {
    isFocused,
    isPasswordVisible,
    handleFocus,
    handleBlur,
    handlePasswordVisibility,
  };
}
