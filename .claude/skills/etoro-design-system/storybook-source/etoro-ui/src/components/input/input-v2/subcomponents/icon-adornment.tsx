import { useMemo } from 'react';
import { Pressable } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import type { IconStyleConfig } from '../../../../foundations/icon-assets/api/types';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { InputIconAdornmentProps } from '../api/types';
import { useInputConfig, useInputInteraction } from '../context';

const ETORO_ICON_STYLE_NO_FILL: IconStyleConfig = { hasFill: false };

/**
 * Default stroke: idle = `carbon500` (Figma idle secondary text), focused = `carbon900` (input text), disabled = `carbon300`.
 * Fill is applied only when `fillColor` is passed; otherwise `EtoroIcon` gets `hasFill: false` (outline / stroke-only).
 */
export function IconAdornment({ iconName, size = 20, strokeColor, fillColor, onPress, accessibilityLabel, testID }: InputIconAdornmentProps) {
  const { disabled } = useInputConfig();
  const { isFocused } = useInputInteraction();
  const { colors } = useEtoroTheme();

  const defaultStroke = disabled ? colors.carbon300 : isFocused ? colors.carbon900 : colors.carbon500;
  const finalStroke = strokeColor ?? defaultStroke;
  const hasPress = Boolean(onPress);

  const etoroIconStyle = useMemo((): IconStyleConfig => {
    if (fillColor === undefined) {
      return ETORO_ICON_STYLE_NO_FILL;
    }
    return { hasFill: true, fill: fillColor };
  }, [fillColor]);

  return (
    <Pressable
      testID={testID}
      onPress={hasPress ? onPress : undefined}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole={hasPress ? 'button' : 'image'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={hasPress ? { disabled } : undefined}
    >
      <EtoroIcon icon={{ iconName }} appearance={{ size, color: finalStroke }} style={etoroIconStyle} />
    </Pressable>
  );
}

IconAdornment.displayName = 'EtInput.IconAdornment';
