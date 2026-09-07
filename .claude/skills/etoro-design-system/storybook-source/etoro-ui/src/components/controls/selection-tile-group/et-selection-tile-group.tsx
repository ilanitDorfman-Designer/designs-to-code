import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { X3 } from '../../../core/styles/spacing';
import { EtSelectionTileGroupProps } from './api/types';
import { SelectionTileGroupProvider } from './context/selection-tile-group-provider';
import { SelectionTileOption } from './subcomponents/selection-tile-option';

/**
 * EtSelectionTileGroup - A controlled tile-based selection group
 *
 * Supports four visual variants:
 * - `icon` (default): tile with customizable right-side icon, border highlight on selection
 * - `radio`: tile with radio circle indicator, supports subtitle
 * - `toggle`: tile with toggle switch, supports single and multi select
 * - `toggleInput`: toggle switch + inline EtInput when option is selected
 *
 * @example icon variant (default)
 * ```tsx
 * <EtSelectionTileGroup value={selected} onChange={setSelected}>
 *   <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
 * </EtSelectionTileGroup>
 * ```
 *
 * @example radio variant with subtitle
 * ```tsx
 * <EtSelectionTileGroup variant="radio" value={selected} onChange={setSelected}>
 *   <EtSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">
 *     Moderate
 *   </EtSelectionTileGroup.Option>
 * </EtSelectionTileGroup>
 * ```
 *
 * @example toggle variant multi-select
 * ```tsx
 * <EtSelectionTileGroup variant="toggle" selectionMode="multi" value={selectedArray} onChange={setSelectedArray}>
 *   <EtSelectionTileGroup.Option value="a">Option A</EtSelectionTileGroup.Option>
 *   <EtSelectionTileGroup.Option value="b">Option B</EtSelectionTileGroup.Option>
 * </EtSelectionTileGroup>
 * ```
 */
function EtSelectionTileGroupBase(props: EtSelectionTileGroupProps) {
  const { children, disabled = false, haptics = true, size = 'small', style, testID, accessibilityLabel } = props;

  const variant = props.variant ?? 'icon';
  const selectionMode = ('selectionMode' in props && props.selectionMode) || 'single';
  const isMulti = selectionMode === 'multi';
  const normalizedGroupValue: string | null | string[] = isMulti
    ? Array.isArray(props.value)
      ? props.value
      : []
    : typeof props.value === 'string' || props.value === null
      ? props.value
      : null;

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (disabled) return;

      if (isMulti) {
        const multiProps = props as Extract<EtSelectionTileGroupProps, { selectionMode: 'multi' }>;
        const currentValues = Array.isArray(multiProps.value) ? multiProps.value : [];
        const isCurrentlySelected = currentValues.includes(optionValue);

        if (haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const nextValues = isCurrentlySelected ? currentValues.filter((v) => v !== optionValue) : [...currentValues, optionValue];
        multiProps.onChange(nextValues);
        return;
      }

      const singleProps = props as Extract<EtSelectionTileGroupProps, { selectionMode?: 'single' }>;
      const isToggle = variant === 'toggle' || variant === 'toggleInput';

      if (singleProps.value === optionValue) {
        // icon/radio: re-pressing the selected option is a no-op (deselection unsupported)
        if (!isToggle) return;
        // toggle/toggleInput: re-pressing deselects
        if (haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        singleProps.onChange(null);
        return;
      }

      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      singleProps.onChange(optionValue);
    },
    [disabled, haptics, isMulti, props, variant],
  );

  return (
    <SelectionTileGroupProvider
      value={normalizedGroupValue}
      onSelect={handleSelect}
      disabled={disabled}
      variant={variant}
      selectionMode={selectionMode}
      size={size}
    >
      <View testID={testID} role={isMulti ? 'group' : 'radiogroup'} accessibilityLabel={accessibilityLabel} style={[styles.container, style]}>
        {children}
      </View>
    </SelectionTileGroupProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: X3,
  },
});

EtSelectionTileGroupBase.displayName = 'EtSelectionTileGroup';

export const EtSelectionTileGroup = Object.assign(EtSelectionTileGroupBase, {
  Option: SelectionTileOption,
});
