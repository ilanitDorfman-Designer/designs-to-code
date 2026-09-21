import { type ComponentProps, useEffect, useState } from 'react';
import { StyleProp, Switch, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';

interface EtToggleProps {
  /** Current toggle state */
  value: boolean;
  /** Callback when toggle state changes */
  onValueChange: (_value: boolean) => void;
  /** When true, disables user interaction while a change is in-flight until parent value syncs */
  lockWhileChanging?: boolean;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Size variant of the toggle */
  size?: 'small' | 'medium' | 'large';
  /** Custom track color when toggle is on */
  trackColorOn?: string;
  /** Custom track color when toggle is off */
  trackColorOff?: string;
  /** Custom thumb color */
  thumbColor?: string;
  /** Custom thumb color when disabled */
  thumbColorDisabled?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Additional Switch component props */
  switchProps?: Omit<ComponentProps<typeof Switch>, 'value' | 'onValueChange' | 'style'>;
}

/** @deprecated use EtToggleSwitch instead */
export function EtToggle({
  value,
  onValueChange,
  lockWhileChanging = false,
  disabled = false,
  size = 'medium',
  trackColorOn,
  trackColorOff,
  thumbColor,
  thumbColorDisabled,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  switchProps,
}: EtToggleProps) {
  const { colors } = useEtoroTheme();

  // Optimistic state to prevent flickering/bouncing
  const [localValue, setLocalValue] = useState(value);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setLocalValue(value);
    if (lockWhileChanging) {
      // unlock when parent syncs the value back
      setLocked(false);
    }
  }, [value, lockWhileChanging]);

  const handleValueChange = (newValue: boolean) => {
    setLocalValue(newValue);
    if (lockWhileChanging) {
      setLocked(true);
    }
    onValueChange(newValue);
  };

  // Get size-based scaling
  const getSizeTransform = () => {
    switch (size) {
      case 'small':
        return { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] };
      case 'medium':
        return { transform: [{ scaleX: 1 }, { scaleY: 1 }] };
      case 'large':
        return { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] };
      default:
        return { transform: [{ scaleX: 1 }, { scaleY: 1 }] };
    }
  };

  // Get computed colors
  const getTrackColors = () => ({
    false: trackColorOff || colors.dividerPrimary || '#767577',
    true: trackColorOn || colors.actionBrandText,
  });

  const getThumbColor = () => {
    if (disabled) {
      return thumbColorDisabled || colors.textSecondaryNeutral || '#f4f3f4';
    }
    return thumbColor || '#ffffff';
  };

  const computedTrackColors = getTrackColors();
  const computedThumbColor = getThumbColor();
  const sizeTransform = getSizeTransform();

  const isDisabled = disabled || locked;

  return (
    <Switch
      {...switchProps}
      style={[sizeTransform, style]}
      trackColor={computedTrackColors}
      thumbColor={computedThumbColor}
      value={localValue}
      onValueChange={isDisabled ? undefined : handleValueChange}
      disabled={isDisabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel || `Toggle ${localValue ? 'on' : 'off'}`}
      accessibilityHint={accessibilityHint}
      accessibilityRole="switch"
      accessibilityState={{ checked: localValue, disabled: isDisabled }}
    />
  );
}
