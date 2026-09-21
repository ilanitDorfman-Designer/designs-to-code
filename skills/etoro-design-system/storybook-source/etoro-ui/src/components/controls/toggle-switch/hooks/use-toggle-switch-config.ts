import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import type { EtToggleSwitchProps, ToggleSwitchConfig } from '../api/types';
import { getSizeTransform, resolveToggleColors } from '../utils';

/**
 * Props accepted by useToggleSwitchConfig hook
 */
export type UseToggleSwitchConfigProps = Pick<
  EtToggleSwitchProps,
  'size' | 'disabled' | 'trackColor' | 'thumbColor' | 'style' | 'accessibilityLabel' | 'value'
>;

/**
 * Processes props and computes all derived values for toggle switch.
 * Returns memoized theme-based colors, styles, and accessibility labels.
 *
 * All returned values are memoized to prevent unnecessary re-renders:
 * - trackColor: Pre-computed object for Switch trackColor prop
 * - style: Combined size transform + custom styles
 * - accessibilityLabel: Resolved accessibility label with state
 */
export function useToggleSwitchConfig(props: UseToggleSwitchConfigProps): ToggleSwitchConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const disabled = props.disabled ?? false;
    const size = props.size ?? 'medium';
    const value = props.value ?? false;

    // Resolve colors from props or theme defaults
    const resolvedColors = resolveToggleColors(colors, props.trackColor, props.thumbColor, disabled);

    // Pre-compute trackColor object to avoid inline object creation
    const trackColor = {
      false: resolvedColors.trackColorOff,
      true: resolvedColors.trackColorOn,
    };

    // Combine size transform with custom style (memoized)
    const style: StyleProp<ViewStyle> = [getSizeTransform(size), props.style];

    // Resolve accessibility label with state
    const accessibilityLabel = props.accessibilityLabel ?? `Toggle switch ${value ? 'on' : 'off'}`;

    return {
      trackColor,
      thumbColor: resolvedColors.thumbColor,
      disabled,
      style,
      accessibilityLabel,
    };
  }, [props.disabled, props.trackColor, props.thumbColor, props.size, props.style, props.accessibilityLabel, props.value, colors]);
}
