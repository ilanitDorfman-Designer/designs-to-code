import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { MinuteInterval } from '../../api/types';

export interface TimepickerAndroidProps {
  value: Date;
  minuteInterval?: MinuteInterval;
  is24Hour: boolean;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}

/**
 * Android-only time picker: native dialog (no modal wrapper).
 * Parent should handle onChange and close when event.type === 'set'.
 */
export function TimepickerAndroid({ value, minuteInterval, is24Hour, onChange }: TimepickerAndroidProps) {
  return <DateTimePicker value={value} mode="time" display="spinner" is24Hour={is24Hour} minuteInterval={minuteInterval} onChange={onChange} />;
}

TimepickerAndroid.displayName = 'EtTimepicker.TimepickerAndroid';
