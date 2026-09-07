import React from 'react';
import { Pressable } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { IconName } from '../../../../foundations/icon-assets/api';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { TimepickerClockIconProps } from '../../api/types';
import { useTimepickerConfig, useTimepickerInteraction } from '../../context';

/** Minimum recommended touch target size (Apple HIG / Material Design) */
const CLOCK_ICON_HIT_SLOP = 10;

function ClockIconComponent({ iconName = 'clock', size = 20, color, testID, accessibilityLabel = 'Open time picker' }: TimepickerClockIconProps) {
  const { disabled, readonly } = useTimepickerConfig();
  const { handleOpenPicker } = useTimepickerInteraction();
  const { colors } = useEtoroTheme();
  const finalColor = color || colors.textSecondaryNeutral;
  const isDisabled = disabled || readonly;

  return (
    <Pressable
      testID={testID}
      onPress={isDisabled ? undefined : handleOpenPicker}
      disabled={isDisabled}
      hitSlop={CLOCK_ICON_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
    >
      <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size, color: finalColor }} />
    </Pressable>
  );
}

export const ClockIcon = React.memo(ClockIconComponent);
ClockIcon.displayName = 'EtTimepicker.ClockIcon';
