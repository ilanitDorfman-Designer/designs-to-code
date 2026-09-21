import { EtInputProps } from '../api/types';

/**
 * Initializes props with default values
 */
export function initProps(props: EtInputProps): EtInputProps {
  return {
    state: {
      ...props.state,
      type: props.state.type || 'text',
      disabled: props.state.disabled || false,
      required: props.state.required || false,
      maxLength: props.state.maxLength || undefined,
      value: props.state.value || '',
      onChangeText: props.state.onChangeText || (() => {}),
    },
    appearance: {
      ...props.appearance,
      label: props.appearance.label || '',
      placeholder: props.appearance.placeholder || '',
      style: props.appearance.style || undefined,
      inputStyle: props.appearance.inputStyle || undefined,
      labelStyle: props.appearance.labelStyle || undefined,
      errorBorderColor: props.appearance.errorBorderColor || undefined,
    },
    validation: props.validation || {},
    accessibility: props.accessibility || {},
    interaction: {
      haptics: props.interaction?.haptics ?? true,
    },
    advanced: props.advanced || {},
  };
}
