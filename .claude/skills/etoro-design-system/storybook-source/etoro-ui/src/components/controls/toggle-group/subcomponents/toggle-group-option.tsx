import * as Haptics from 'expo-haptics';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import type { ToggleGroupOptionProps } from '../api';
import { useToggleGroupContext } from '../context';
import { getToggleGroupSizeConfig } from '../utils';

function ToggleGroupOptionComponent({ id, children, disabled: optionDisabled = false, style, testID, accessibilityLabel }: ToggleGroupOptionProps) {
  const { selectedId, onSelect, size, disabled: groupDisabled, haptics } = useToggleGroupContext();
  const sizeConfig = getToggleGroupSizeConfig(size);
  const selected = selectedId === id;
  const disabled = groupDisabled || optionDisabled;

  const handlePress = useCallback(() => {
    if (disabled || selected) return;

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    onSelect(id);
  }, [disabled, haptics, id, onSelect, selected]);

  const content = typeof children === 'function' ? children({ selected, disabled }) : children;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.option, { width: sizeConfig.optionSize, height: sizeConfig.optionSize }, style]}
      testID={testID || `toggle-group-option-${id}`}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
    >
      {content}
    </Pressable>
  );
}

export const ToggleGroupOption = memo(ToggleGroupOptionComponent);
ToggleGroupOption.displayName = 'EtToggleGroup.Option';

const styles = StyleSheet.create({
  option: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
