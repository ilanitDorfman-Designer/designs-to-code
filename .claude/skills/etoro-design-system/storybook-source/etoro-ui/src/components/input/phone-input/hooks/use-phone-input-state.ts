import { useCallback, useState } from 'react';

import { sanitizePhoneInputValue } from './sanitize-phone-input-value';

interface UsePhoneInputStateProps {
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: (value: string) => void;
}

export function usePhoneInputState({ defaultValue = '', onChangeText, onFocus, onBlur, onSubmitEditing }: UsePhoneInputStateProps) {
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = useCallback(
    (text: string) => {
      const sanitized = sanitizePhoneInputValue(text);
      setCurrentValue(sanitized);
      onChangeText?.(sanitized);
    },
    [onChangeText],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleSubmitEditing = useCallback(() => {
    onSubmitEditing?.(currentValue);
  }, [onSubmitEditing, currentValue]);

  return {
    currentValue,
    isFocused,
    handleChangeText,
    handleFocus,
    handleBlur,
    handleSubmitEditing,
  };
}
