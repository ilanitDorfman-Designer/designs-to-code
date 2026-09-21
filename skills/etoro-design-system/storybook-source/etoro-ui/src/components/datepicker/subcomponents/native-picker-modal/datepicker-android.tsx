import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { Locale } from 'date-fns';

import { DatepickerMode } from '../../api/types';

export interface DatepickerAndroidProps {
  value: Date;
  mode: DatepickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: Locale;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}

/**
 * Android-only date/time picker: native dialog (no modal wrapper).
 * Parent should handle onChange and close when event.type === 'set'.
 */
export function DatepickerAndroid({ value, mode, minimumDate, maximumDate, locale, onChange }: DatepickerAndroidProps) {
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display="spinner"
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onChange={onChange}
      locale={locale?.code}
    />
  );
}

DatepickerAndroid.displayName = 'EtDatepicker.DatepickerAndroid';
