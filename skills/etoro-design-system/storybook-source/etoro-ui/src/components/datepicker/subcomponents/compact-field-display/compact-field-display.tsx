import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X2, X4 } from '../../../../core/styles';
import { IconName } from '../../../../foundations/icon-assets/api';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';
import { EtText } from '../../../../foundations/text/et-text';
import { CompactFieldDisplayProps } from '../../api/types';
import { useDatepickerConfig, useDatepickerInteraction, useDatepickerValue } from '../../context';

const CONTAINER_HEIGHT = 48;
const CONTAINER_PADDING = X4;
const FONT_SIZE = 16;
const BORDER_RADIUS = 14;
const ICON_SIZE = 16;
const GAP = X2;

function CompactFieldDisplayBase({
  showIcon = true,
  iconName = 'calendar',
  testID = 'datepicker-compact-field-display',
  accessibilityLabel,
}: CompactFieldDisplayProps) {
  const { colors } = useEtoroTheme();
  const { disabled, readonly, format } = useDatepickerConfig();
  const { handleOpenPicker } = useDatepickerInteraction();
  const { formattedValue } = useDatepickerValue();

  const { isInteractive, displayText, computedAccessibilityLabel } = useMemo(
    () => ({
      isInteractive: !disabled && !readonly,
      displayText: formattedValue || format,
      computedAccessibilityLabel: accessibilityLabel || `Date picker, current value ${formattedValue || 'not set'}`,
    }),
    [disabled, readonly, formattedValue, format, accessibilityLabel],
  );

  const backgroundColor = colors.bgNeutralQuaternary;
  const textColor = colors.textPrimaryNeutral;

  return (
    <Pressable
      onPress={isInteractive ? handleOpenPicker : undefined}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={computedAccessibilityLabel}
      accessibilityState={{ disabled: !isInteractive }}
    >
      <View style={styles.content}>
        {showIcon && <EtoroIcon icon={{ iconName: iconName as IconName }} appearance={{ size: ICON_SIZE, color: textColor }} />}
        <EtText
          variant="body-base-medium"
          style={[
            styles.dateText,
            {
              color: formattedValue ? textColor : colors.textTertiaryNeutral,
            },
          ]}
        >
          {displayText}
        </EtText>
        <EtoroIcon icon={{ iconName: 'chevronDown' as IconName }} appearance={{ size: ICON_SIZE - 2, color: textColor }} />
      </View>
    </Pressable>
  );
}

export const CompactFieldDisplay = React.memo(CompactFieldDisplayBase);
CompactFieldDisplay.displayName = 'EtDatepicker.CompactFieldDisplay';

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    paddingHorizontal: CONTAINER_PADDING,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GAP,
  },
  dateText: {
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
