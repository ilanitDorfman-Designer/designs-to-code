import type { NativeSyntheticEvent, TextInputSubmitEditingEventData, TextStyle } from 'react-native';

interface InputFieldPlatformPropsParams {
  onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  value: string;
}

export function getInputFieldPlatformProps(_params: InputFieldPlatformPropsParams): Record<string, unknown> {
  return {};
}

export function getInputFieldPlatformStyle(): TextStyle {
  return {};
}

export function getInputFieldSubmitBehavior(): 'blurAndSubmit' {
  return 'blurAndSubmit';
}
