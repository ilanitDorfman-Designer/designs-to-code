import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useDatepickerConfig, useDatepickerInteraction, useDatepickerValue } from '../../context';
import { DatepickerAndroid } from './datepicker-android';
import { DatepickerModalIOS } from './datepicker-modal-ios';

/**
 * Orchestrates the native date/time picker: owns state and platform branch.
 * Renders iOS modal (with Cancel/Done) or Android dialog based on Platform.OS.
 */
export function NativePickerModal() {
  const { mode, minDate, maxDate, locale } = useDatepickerConfig();
  const { isPickerOpen, handleClosePicker } = useDatepickerInteraction();
  const { selectedDate, setDate } = useDatepickerValue();

  const [pickerDate, setPickerDate] = useState<Date>(() => selectedDate || new Date());

  useEffect(() => {
    if (isPickerOpen) {
      setPickerDate(selectedDate || new Date());
    }
  }, [isPickerOpen, selectedDate]);

  const handlePickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      handleClosePicker();
      if (event.type === 'set' && selected) {
        setDate(selected);
      }
    } else if (Platform.OS === 'ios' && selected) {
      setPickerDate(selected);
    }
  };

  const handleDone = () => {
    setDate(pickerDate);
    handleClosePicker();
  };

  if (Platform.OS === 'android' && isPickerOpen) {
    return (
      <DatepickerAndroid value={pickerDate} mode={mode} minimumDate={minDate} maximumDate={maxDate} locale={locale} onChange={handlePickerChange} />
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <DatepickerModalIOS
        visible={isPickerOpen}
        value={pickerDate}
        mode={mode}
        minimumDate={minDate}
        maximumDate={maxDate}
        locale={locale}
        onChange={handlePickerChange}
        onDone={handleDone}
        onCancel={handleClosePicker}
      />
    );
  }

  return null;
}

NativePickerModal.displayName = 'EtDatepicker.NativePickerModal';
