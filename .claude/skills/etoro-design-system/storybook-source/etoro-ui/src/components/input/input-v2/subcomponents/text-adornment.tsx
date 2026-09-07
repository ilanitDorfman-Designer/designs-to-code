import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import { InputTextAdornmentProps } from '../api/types';
import { useInputConfig, useInputInteraction } from '../context';

/**
 * Trailing suffix: idle = `carbon500` (Figma idle secondary text), focused = `carbon900` (input text), disabled = `carbon300`.
 */
export function TextAdornment({ children }: InputTextAdornmentProps) {
  const { colors } = useEtoroTheme();
  const { disabled } = useInputConfig();
  const { isFocused } = useInputInteraction();

  const textColor = disabled ? colors.carbon300 : isFocused ? colors.carbon900 : colors.carbon500;

  return (
    <EtText variant="body-base-regular" style={{ color: textColor }}>
      {children}
    </EtText>
  );
}

TextAdornment.displayName = 'EtInput.TextAdornment';
