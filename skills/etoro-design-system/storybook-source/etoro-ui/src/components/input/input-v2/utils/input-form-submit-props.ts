import type { TextInputProps } from 'react-native';

interface InputFormSubmitPropsParams {
  onEndEditing?: TextInputProps['onEndEditing'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
}

export function getInputFormSubmitProps({ onEndEditing }: InputFormSubmitPropsParams): Pick<TextInputProps, 'onEndEditing' | 'onSubmitEditing'> {
  return onEndEditing ? { onEndEditing } : {};
}
