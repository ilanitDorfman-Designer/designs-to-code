import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { CheckboxVariant, EtCheckboxProps } from '../api/types';
import { CheckboxColors, getCheckboxColors } from '../utils/get-checkbox-colors';

export interface CheckboxConfig {
  disabled: boolean;
  colors: CheckboxColors;
  haptics: boolean;
  variant: CheckboxVariant;
  size: number;
  borderRadius: number;
}

/**
 * Processes props and computes derived values for checkbox configuration.
 */
export function useCheckboxConfig(props: EtCheckboxProps): CheckboxConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const disabled = props.disabled ?? false;
    const haptics = props.haptics ?? true;
    // Extract variant from discriminated union
    const variant = props.variant ?? 'square';

    // Calculate colors
    const checkboxColors = getCheckboxColors(colors);

    // Calculate size based on variant
    // 'round' and 'add' variants are 30x30, 'square' is 24x24
    const size = variant === 'square' ? 24 : 30;

    // Calculate border radius based on variant
    // Both 'round' and 'add' variants are fully round (15px), 'square' is square (4px)
    const borderRadius = variant === 'square' ? 4 : 15;

    return {
      disabled,
      colors: checkboxColors,
      haptics,
      variant,
      size,
      borderRadius,
    };
  }, [props.disabled, props.haptics, props.variant, colors]);
}
