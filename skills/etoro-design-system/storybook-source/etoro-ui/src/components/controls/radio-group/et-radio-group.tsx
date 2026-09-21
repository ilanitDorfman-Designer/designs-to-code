import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import { EtRadioGroupProps } from './api/types';
import { RadioGroupProvider } from './context/radio-group-provider';
import { RadioOption } from './subcomponents/radio-option';

/**
 * EtRadioGroup - A controlled radio group component
 *
 * Uses compound component pattern for flexible composition.
 * Layout is controlled via the `direction` prop.
 *
 * @example Basic vertical layout (default)
 * ```tsx
 * const [selected, setSelected] = useState<string | null>(null);
 * <EtRadioGroup value={selected} onChange={setSelected}>
 *   <EtRadioGroup.Option value="option1">Option 1</EtRadioGroup.Option>
 *   <EtRadioGroup.Option value="option2">Option 2</EtRadioGroup.Option>
 * </EtRadioGroup>
 * ```
 *
 * @example Horizontal layout
 * ```tsx
 * <EtRadioGroup value={selected} onChange={setSelected} direction="horizontal">
 *   <EtRadioGroup.Option value="small">Small</EtRadioGroup.Option>
 *   <EtRadioGroup.Option value="large">Large</EtRadioGroup.Option>
 * </EtRadioGroup>
 * ```
 *
 * @example With error state
 * ```tsx
 * <EtRadioGroup value={selected} onChange={setSelected} error>
 *   <EtRadioGroup.Option value="opt1">Required option</EtRadioGroup.Option>
 * </EtRadioGroup>
 * ```
 */
function EtRadioGroupBase({
  value,
  onChange,
  children,
  direction = 'vertical',
  disabled = false,
  error = false,
  haptics = true,
  testID,
  accessibilityLabel,
}: EtRadioGroupProps) {
  // Handler for option selection
  const handleSelect = (optionValue: string) => {
    // Early return if group is disabled
    if (disabled) {
      return;
    }

    // Only act if the value is actually changing (clicking selected does nothing)
    if (optionValue === value) {
      return;
    }

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onChange(optionValue);
  };

  return (
    <RadioGroupProvider value={value} onSelect={handleSelect} disabled={disabled} error={error}>
      <View
        testID={testID}
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        style={direction === 'horizontal' ? styles.containerHorizontal : styles.containerVertical}
      >
        {children}
      </View>
    </RadioGroupProvider>
  );
}

// Gap values from Figma design
const styles = StyleSheet.create({
  containerVertical: {
    flexDirection: 'column',
    gap: 12,
  },
  containerHorizontal: {
    flexDirection: 'row',
    gap: 24,
  },
});

EtRadioGroupBase.displayName = 'EtRadioGroup';

/**
 * Export with compound components attached
 */
export const EtRadioGroup = Object.assign(EtRadioGroupBase, {
  Option: RadioOption,
});
