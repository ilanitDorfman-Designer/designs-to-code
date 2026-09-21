import { type ReactNode, useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';

interface UsePhoneInputConfigProps {
  currentValue: string;
  error: ReactNode | null | undefined;
  isFocused: boolean;
  disabled: boolean;
  prefixDisabled: boolean;
}

export function usePhoneInputConfig({ currentValue, error, isFocused, disabled, prefixDisabled }: UsePhoneInputConfigProps) {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const hasValue = currentValue.length > 0;
    const hasError = Boolean(error);

    const prefixTextColor =
      prefixDisabled || disabled
        ? colors.textTertiaryNeutral // #b2b2b2 (neutral[300])
        : hasValue
          ? colors.textPrimaryNeutral // #1a1a1a (neutral[900])
          : colors.textTertiaryNeutral; // #808080 (neutral[500])

    // Figma backup: Filled → primary-neutral-text (#1a1a1a), Disabled → tertiary-neutral-text (#b2b2b2)
    const numberTextColor = disabled
      ? colors.textTertiaryNeutral // #b2b2b2
      : colors.textPrimaryNeutral; // #1a1a1a

    // Figma backup: Placeholder → tertiary-neutral-text (#808080)
    const placeholderTextColor = colors.textTertiaryNeutral; // #808080 (neutral[500])

    // Prefix: always no border (prefix is a separate button, not a text input)
    const prefixBorderColor = 'transparent';

    // Number field: border only when focused
    const borderColor = isFocused
      ? colors.textPrimaryNeutral // #1A1A1A (neutral[900]) — matches Figma overlay-neutral-text
      : 'transparent';

    // Figma: 5% dark overlay background (bgGreyTransparentPrimary)
    const backgroundColor = colors.bgGreyTransparentPrimary;

    // Figma backup: positive-text (#0eb12e) - green cursor
    const cursorColor = colors.statusPositive;

    // Figma: Error validation text in red
    const errorTextColor = colors.statusNegative;

    return {
      hasValue,
      hasError,
      prefixTextColor,
      numberTextColor,
      placeholderTextColor,
      prefixBorderColor,
      borderColor,
      backgroundColor,
      cursorColor,
      errorTextColor,
    };
  }, [currentValue, error, isFocused, disabled, prefixDisabled, colors]);
}
