import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { SelectContextValue } from '../context/select-context';

export interface SelectConfig {
  /** Context value for subcomponents (structured as { state, meta }) */
  contextValue: SelectContextValue;
  /** Is the component effectively disabled */
  isDisabled: boolean;
  /** Is the component in readonly state (field type only) */
  isReadonly: boolean;
  /** Background overlay color for field type (carbon900 at 5% per Figma) */
  backgroundColor: string;
}

/**
 * Processes type props into component configuration.
 * All business logic for colors, sizes, and derived values lives here.
 */
export function useSelectConfig({
  type,
  disabled = false,
  readonly = false,
  hasValue = false,
}: {
  type: 'text' | 'field';
  disabled?: boolean;
  readonly?: boolean;
  hasValue?: boolean;
}): SelectConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const isText = type === 'text';

    const isDisabled = !isText && disabled;
    // Readonly only applies to field type (text type ignores it, mirroring `disabled`).
    const isReadonly = !isText && readonly;

    // Text color: filled (text type or hasValue) -> carbon900; empty placeholder -> carbon500; disabled -> carbon500.
    // Readonly falls through to the enabled path — same colors as enabled.
    const textColor = isDisabled ? colors.carbon500 : isText || hasValue ? colors.carbon900 : colors.carbon500;

    // Label color: idle -> carbon500; disabled -> carbon500 (used in field type's filled state).
    const labelColor = isDisabled ? colors.carbon500 : colors.carbon500;

    // Icon color: text type idle -> carbon900; field type idle -> carbon500; disabled -> carbon300.
    const iconColor = isDisabled ? colors.carbon300 : isText ? colors.carbon900 : colors.carbon500;

    // Icon size: 24px for text type, 20px for field
    const iconSize = isText ? 24 : 20;

    // Figma 45107:26668 "Background transparent color" — carbon900 at ~5% opacity (0x0D / 255 ≈ 5.1%).
    const backgroundColor = `${colors.carbon900}0D`;

    const contextValue: SelectContextValue = {
      state: { type, disabled: isDisabled, readonly: isReadonly },
      meta: { textColor, labelColor, iconColor, iconSize },
    };

    return { contextValue, isDisabled, isReadonly, backgroundColor };
  }, [type, disabled, readonly, hasValue, colors]);
}
