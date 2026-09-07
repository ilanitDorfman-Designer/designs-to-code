import type { TextStyle } from 'react-native';

export function getTextInputPlatformStyle(): TextStyle {
  return {
    outlineStyle: 'none',
    outlineWidth: 0,
    boxShadow: 'none',
  } as unknown as TextStyle;
}

export function getTextInputSubmitBehavior(): 'blurAndSubmit' {
  return 'blurAndSubmit';
}
