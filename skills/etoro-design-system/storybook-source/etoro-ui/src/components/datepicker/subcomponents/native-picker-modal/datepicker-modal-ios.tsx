import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { Locale } from 'date-fns';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X3, X4, X5 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { EtButton } from '../../../button/et-button';
import { DatepickerMode } from '../../api/types';

export interface DatepickerModalIOSProps {
  visible: boolean;
  value: Date;
  mode: DatepickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: Locale;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onDone: () => void;
  onCancel: () => void;
  title?: string;
  cancelText?: string;
  confirmText?: string;
}

/**
 * iOS-only date/time picker: centered modal card with native spinner
 * and Cancel/Done buttons at the bottom.
 * Commit happens on Done; Cancel dismisses without applying.
 */
export function DatepickerModalIOS({
  visible,
  value,
  mode,
  minimumDate,
  maximumDate,
  locale,
  onChange,
  onDone,
  onCancel,
  title = 'Select Date',
  cancelText = 'Cancel',
  confirmText = 'Done',
}: DatepickerModalIOSProps) {
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

          <DateTimePicker
            value={value}
            mode={mode}
            display="spinner"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={onChange}
            locale={locale?.code}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <EtButton testID="datepicker-modal-cancel" variant="primary-ghost" size="medium" stretch onPress={onCancel}>
                {cancelText}
              </EtButton>
            </View>
            <View style={styles.buttonWrapper}>
              <EtButton testID="datepicker-modal-done" variant="primary-filled" size="medium" stretch onPress={onDone}>
                {confirmText}
              </EtButton>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

DatepickerModalIOS.displayName = 'EtDatepicker.DatepickerModalIOS';

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
