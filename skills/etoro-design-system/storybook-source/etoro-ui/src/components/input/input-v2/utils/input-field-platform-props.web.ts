import type { NativeSyntheticEvent, TextInputSubmitEditingEventData, TextStyle } from 'react-native';

interface WebKeyboardEvent {
  key: string;
  nativeEvent?: {
    key?: string;
  };
  currentTarget?: {
    blur?: () => void;
  };
  shiftKey?: boolean;
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

interface InputFieldPlatformPropsParams {
  onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  value: string;
}

export function getInputFieldPlatformProps({ onSubmitEditing, value }: InputFieldPlatformPropsParams): Record<string, unknown> {
  const handleEnter = (event: WebKeyboardEvent) => {
    const key = event.key ?? event.nativeEvent?.key;
    if (key !== 'Enter' || event.shiftKey) return;
    if (!onSubmitEditing) return;

    event.preventDefault?.();
    event.stopPropagation?.();
    onSubmitEditing({ nativeEvent: { text: value } } as NativeSyntheticEvent<TextInputSubmitEditingEventData>);
    event.currentTarget?.blur?.();
  };

  return {
    onKeyDown: handleEnter,
    onKeyPress: handleEnter,
  };
}

export function getInputFieldPlatformStyle(): TextStyle {
  return {
    outlineStyle: 'none',
    outlineWidth: 0,
    boxShadow: 'none',
  } as unknown as TextStyle;
}

export function getInputFieldSubmitBehavior(): 'submit' {
  return 'submit';
}
