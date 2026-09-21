import { DatepickerProps } from './api/types';
import { DatepickerProvider } from './context';
import { CalendarIcon, CompactFieldContainer, CompactFieldDisplay, InputFieldContainer, InputFieldDisplay, InputFieldLabel } from './subcomponents';

function DatepickerRoot({
  style,
  children,
  defaultValue,
  value,
  onChange,
  format = 'dd MMM yyyy',
  locale,
  valueType = 'date',
  minDate,
  maxDate,
  error = null,
  disabled = false,
  readonly = false,
  variant = 'inputField',
}: DatepickerProps) {
  return (
    <DatepickerProvider
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      mode="date"
      format={format}
      locale={locale}
      valueType={valueType}
      minDate={minDate}
      maxDate={maxDate}
      error={error}
      disabled={disabled}
      readonly={readonly}
    >
      {variant === 'inputField' ? (
        <InputFieldContainer style={style}>{children}</InputFieldContainer>
      ) : (
        <CompactFieldContainer style={style}>{children}</CompactFieldContainer>
      )}
    </DatepickerProvider>
  );
}

DatepickerRoot.displayName = 'EtDatepicker';

const Label = InputFieldLabel;
const Field = InputFieldDisplay;

export const EtDatepicker = Object.assign(DatepickerRoot, {
  Label,
  Field,
  CalendarIcon,
  CompactFieldDisplay,
});
