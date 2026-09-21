import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useTimepickerConfig, useTimepickerInteraction, useTimepickerValue } from '../../context';
import { dateToTimeValue, timeValueToDate } from '../../utils/time-formatters';
import { TimepickerAndroid } from './timepicker-android';
import { TimepickerModalIOS } from './timepicker-modal-ios';

/**
 * Orchestrates the native time picker: owns state and platform branch.
 * Renders iOS modal (with Cancel/Done) or Android dialog based on Platform.OS.
 */
export function NativePickerModal() {
  const { format, minuteInterval } = useTimepickerConfig();
  const { isPickerOpen, handleClosePicker } = useTimepickerInteraction();
  const { selectedTime, setTime } = useTimepickerValue();

  const is24Hour = format === '24h';

  const [pickerDate, setPickerDate] = useState<Date>(() => timeValueToDate(selectedTime));

  useEffect(() => {
    if (isPickerOpen) {
      setPickerDate(timeValueToDate(selectedTime));
    }
  }, [isPickerOpen, selectedTime]);

  const handlePickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      handleClosePicker();
      if (event.type === 'set' && selected) {
        setTime(dateToTimeValue(selected));
      }
    } else if (Platform.OS === 'ios' && selected) {
      setPickerDate(selected);
    }
  };

  const handleDone = () => {
    setTime(dateToTimeValue(pickerDate));
    handleClosePicker();
  };

  if (Platform.OS === 'android' && isPickerOpen) {
    return <TimepickerAndroid value={pickerDate} minuteInterval={minuteInterval} is24Hour={is24Hour} onChange={handlePickerChange} />;
  }

  if (Platform.OS === 'ios') {
    return (
      <TimepickerModalIOS
        visible={isPickerOpen}
        value={pickerDate}
        minuteInterval={minuteInterval}
        is24Hour={is24Hour}
        onChange={handlePickerChange}
        onDone={handleDone}
        onCancel={handleClosePicker}
      />
    );
  }

  return null;
}

NativePickerModal.displayName = 'EtTimepicker.NativePickerModal';
