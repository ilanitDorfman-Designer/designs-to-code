import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { Switch } from 'react-native-gesture-handler';

import type { EtToggleSwitchProps } from './api/types';
import { useToggleSwitchConfig } from './hooks/use-toggle-switch-config';

/**
 * EtToggleSwitch - A native toggle switch component with theme support
 *
 * Uses Switch from react-native-gesture-handler for proper gesture coordination
 * with drawer navigators (React Navigation/Expo Router) on Android. Includes
 * scale transforms for size variants.
 *
 * Performance optimizations:
 * - React.memo prevents re-renders when props haven't changed
 * - All derived values (trackColor, style, accessibilityLabel) are memoized
 * - useCallback for event handler to maintain stable reference
 *
 * @example Basic usage
 * ```tsx
 * const [on, setOn] = useState(false);
 * <EtToggleSwitch value={on} onValueChange={setOn} />
 * ```
 *
 * @example With size variant
 * ```tsx
 * <EtToggleSwitch value={on} onValueChange={setOn} size="medium" />
 * ```
 *
 * @example Disabled state
 * ```tsx
 * <EtToggleSwitch value={on} onValueChange={setOn} disabled />
 * ```
 *
 * @example Custom colors (optional - uses theme by default)
 * ```tsx
 * <EtToggleSwitch
 *   value={on}
 *   onValueChange={setOn}
 *   trackColor={{ true: '#0eb12e', false: '#ccc' }}
 *   thumbColor="#fff"
 * />
 * ```
 *
 * @example Inside bottom sheets (iOS fix)
 * ```tsx
 * // Use forceNativeSync when the switch is inside @gorhom/bottom-sheet
 * // to work around iOS native Switch visual sync issues
 * <EtToggleSwitch
 *   value={on}
 *   onValueChange={setOn}
 *   forceNativeSync
 * />
 * ```
 */
function EtToggleSwitchBase({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  haptics = true,
  forceNativeSync = false,
  trackColor,
  thumbColor,
  style,
  testID,
  accessibilityLabel,
  ...rest
}: EtToggleSwitchProps) {
  // When forceNativeSync is enabled, use local state to control the Switch.
  // This works around an iOS bug where the native UISwitch doesn't update
  // visually when the value prop changes programmatically (e.g., in bottom sheets).
  const [localValue, setLocalValue] = useState(value);

  // Sync local state when prop changes from outside
  useEffect(() => {
    if (forceNativeSync) {
      setLocalValue(value);
    }
  }, [forceNativeSync, value]);

  // Use local state when forceNativeSync is enabled, otherwise use prop directly.
  // Computed before config hook so derived values (accessibilityLabel) stay in sync.
  const switchValue = forceNativeSync ? localValue : value;

  // Get memoized configuration (colors, styles, accessibility)
  const config = useToggleSwitchConfig({
    size,
    disabled,
    trackColor,
    thumbColor,
    style,
    accessibilityLabel,
    value: switchValue,
  });

  // Handle value change with haptics
  const handleValueChange = useCallback(
    (newValue: boolean) => {
      if (disabled) return;

      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
          // Ignore haptics errors on unsupported devices
        });
      }

      // When forceNativeSync is enabled, update local state immediately
      if (forceNativeSync) {
        setLocalValue(newValue);
      }

      onValueChange(newValue);
    },
    [disabled, haptics, forceNativeSync, onValueChange],
  );

  return (
    <Switch
      value={switchValue}
      onValueChange={handleValueChange}
      disabled={config.disabled}
      trackColor={config.trackColor}
      thumbColor={config.thumbColor}
      style={config.style}
      testID={testID}
      ios_backgroundColor={config.trackColor.false}
      accessibilityLabel={config.accessibilityLabel}
      {...rest}
    />
  );
}

EtToggleSwitchBase.displayName = 'EtToggleSwitch';

/**
 * EtToggleSwitch component with React.memo for performance.
 */
export const EtToggleSwitch = React.memo(EtToggleSwitchBase);
