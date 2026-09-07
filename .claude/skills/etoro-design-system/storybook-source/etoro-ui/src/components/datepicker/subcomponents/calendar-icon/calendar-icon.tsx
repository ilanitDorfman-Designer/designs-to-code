import { Pressable } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X2 } from '../../../../core/styles/spacing';
import { IconName } from '../../../../foundations/icon-assets/api';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { DatepickerCalendarIconProps } from '../../api/types';
import { useDatepickerConfig, useDatepickerInteraction } from '../../context';

export function CalendarIcon({
  iconName = 'calendar',
  size = 20,
  color,
  testID,
  accessibilityLabel = 'Open date picker',
}: DatepickerCalendarIconProps) {
  const { disabled } = useDatepickerConfig();
  const { handleOpenPicker } = useDatepickerInteraction();
  const { colors } = useEtoroTheme();
  // Idle primary; disabled secondary (V2 adornment pattern without pulling IconAdornment).
  const finalColor = color || (disabled ? colors.textSecondaryNeutral : colors.textPrimaryNeutral);
  return (
    <Pressable
      testID={testID}
      onPress={handleOpenPicker}
      disabled={disabled}
      hitSlop={X2}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size, color: finalColor }} />
    </Pressable>
  );
}

CalendarIcon.displayName = 'EtDatepicker.CalendarIcon';
