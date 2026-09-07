import { Pressable, StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text/et-text';
import { RadioOptionProps } from '../api/types';
import { RadioIndicator } from '../components/radio-indicator';
import { useRadioGroupContext } from '../context/radio-group-context';

/**
 * EtRadioGroup.Option - Individual radio option within a group
 *
 * Reads selection state from RadioGroup context.
 * Cannot be unselected - clicking a selected option does nothing.
 */
export function RadioOption({ value, children, disabled: optionDisabled = false, style, testID, accessibilityLabel }: RadioOptionProps) {
  const { colors } = useEtoroTheme();
  const { value: selectedValue, onSelect, disabled: groupDisabled, error } = useRadioGroupContext();

  const isSelected = selectedValue === value;
  const isDisabled = groupDisabled || optionDisabled;

  // Handle press - Pressable handles disabled, we check selected and call onSelect
  const handlePress = () => {
    if (isSelected) {
      return;
    }

    onSelect(value);
  };

  // Determine text color
  const textColor = isDisabled ? colors.carbon400 : colors.carbon900;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={[styles.container, isDisabled && styles.disabled, style]}
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{
        selected: isSelected,
        disabled: isDisabled,
      }}
      accessibilityLabel={accessibilityLabel || children}
      hitSlop={{
        top: 8,
        bottom: 8,
        left: 8,
        right: 8,
      }}
    >
      <RadioIndicator selected={isSelected} disabled={isDisabled} error={error && !isSelected} />
      <EtText variant="body-secondary-regular" style={[styles.label, { color: textColor }]}>
        {children}
      </EtText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    flexShrink: 1,
  },
});

RadioOption.displayName = 'EtRadioGroup.Option';
