import * as Haptics from 'expo-haptics';
import { useState } from 'react';

interface UseInputStateProps {
  haptics?: boolean;
  disabled?: boolean;
}

export function useInputState(props?: UseInputStateProps) {
  const { haptics = true, disabled = false } = props || {};
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
