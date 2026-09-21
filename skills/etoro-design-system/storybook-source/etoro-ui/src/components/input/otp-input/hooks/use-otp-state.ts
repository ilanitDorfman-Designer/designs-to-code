import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

interface UseOtpStateProps {
  length: number;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onComplete?: (code: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  secureEntry?: boolean;
  haptics?: boolean;
  disabled?: boolean;
}

/** Only change vs legacy: strip non-digits, then clamp to max length (same as `slice(0, length)` for digit-only strings). */
function sanitizeDigits(text: string, maxLen: number): string {
  return text.replace(/\D/g, '').slice(0, maxLen);
}

export function useOtpState(
  {
    length = 0,
    value: controlledValue,
    defaultValue = '',
    onChangeText,
    onComplete,
    onFocus,
    onBlur,
    secureEntry = false,
    haptics = true,
    disabled = false,
  }: UseOtpStateProps = { length: 0 },
) {
  const inputRef = useRef<TextInput>(null);
  const lastCompletedRef = useRef('');
  const isControlled = controlledValue !== undefined;

  // Internal value for uncontrolled mode
  const [internalValue, setInternalValue] = useState(() => sanitizeDigits(defaultValue, length));
  const currentValue = isControlled ? sanitizeDigits(controlledValue ?? '', length) : internalValue;

  // Focus state
  const [isFocused, setIsFocused] = useState(false);

  // Secure toggle state — starts with prop value
  const [isSecure, setIsSecure] = useState(secureEntry);

  // Sync secure state when prop changes
  useEffect(() => {
    setIsSecure(secureEntry);
  }, [secureEntry]);

  const handleChangeText = useCallback(
    (text: string) => {
      const clamped = sanitizeDigits(text, length);

      if (!isControlled) {
        setInternalValue(clamped);
      }
      onChangeText?.(clamped);

      if (length > 0 && clamped.length === length) {
        // Skip duplicate onComplete calls with the same value
        if (lastCompletedRef.current !== clamped) {
          lastCompletedRef.current = clamped;
          onComplete?.(clamped);
          Keyboard.dismiss();
        }
      } else {
        // Reset when value becomes partial again (user deleted chars)
        lastCompletedRef.current = '';
      }
    },
    [length, isControlled, onChangeText, onComplete],
  );

  const handleFocus = useCallback(() => {
    if (haptics && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setIsFocused(true);
    onFocus?.();
  }, [haptics, disabled, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const focusInput = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const toggleSecure = useCallback(() => {
    if (haptics && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setIsSecure((prev) => !prev);
  }, [haptics, disabled]);

  return {
    inputRef,
    currentValue,
    isFocused,
    isSecure,
    handleChangeText,
    handleFocus,
    handleBlur,
    focusInput,
    toggleSecure,
  };
}
