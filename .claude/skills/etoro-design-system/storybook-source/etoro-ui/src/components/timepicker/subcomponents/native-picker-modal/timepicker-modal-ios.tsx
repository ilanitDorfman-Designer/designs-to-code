import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X3, X4, X5 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { EtButton } from '../../../button/et-button';
import { MinuteInterval } from '../../api/types';

export interface TimepickerModalIOSProps {
  visible: boolean;
  value: Date;
  minuteInterval?: MinuteInterval;
  is24Hour: boolean;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onDone: () => void;
  onCancel: () => void;
  title?: string;
  cancelText?: string;
  confirmText?: string;
}

/**
 * iOS-only time picker: centered modal card with native spinner
 * and Cancel/Done buttons at the bottom.
 * Commit happens on Done; Cancel dismisses without applying.
 */
function TimepickerModalIOSComponent({
  visible,
  value,
  minuteInterval,
  is24Hour,
  onChange,
  onDone,
  onCancel,
  title = 'Select Time',
  cancelText = 'Cancel',
  confirmText = 'Done',
}: TimepickerModalIOSProps) {
  const { colors } = useEtoroTheme();

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.bgOverlayTop }]} onPress={onCancel}>
        <Pressable
          style={[
            styles.container,
            {
              backgroundColor: colors.bgNeutralQuaternary ?? colors.bgNeutralTertiary,
              shadowColor: colors.bgNeutralDark,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <EtText variant="heading-compact" style={{ color: colors.textPrimaryNeutral }}>
              {title}
            </EtText>
          </View>

          <DateTimePicker value={value} mode="time" display="spinner" is24Hour={is24Hour} minuteInterval={minuteInterval} onChange={onChange} />

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <EtButton variant="primary-ghost" size="medium" stretch onPress={onCancel}>
                {cancelText}
              </EtButton>
            </View>
            <View style={styles.buttonWrapper}>
              <EtButton variant="primary-filled" size="medium" stretch onPress={onDone}>
                {confirmText}
              </EtButton>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const TimepickerModalIOS = React.memo(TimepickerModalIOSComponent);
TimepickerModalIOS.displayName = 'EtTimepicker.TimepickerModalIOS';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 16,
    padding: X5,
    minWidth: 280,
    maxWidth: 360,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: X4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: X4,
    gap: X3,
  },
  buttonWrapper: {
    flex: 1,
  },
});
