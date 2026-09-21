import type { PressableProps, ViewStyle } from 'react-native';

export function getInputContainerPressablePlatformProps(): Partial<PressableProps> {
  return {
    focusable: false,
    tabIndex: -1,
  } as Partial<PressableProps>;
}

export function getInputContainerPressablePlatformStyle(): ViewStyle {
  return {
    outlineStyle: 'none',
    outlineWidth: 0,
    boxShadow: 'none',
  } as unknown as ViewStyle;
}
