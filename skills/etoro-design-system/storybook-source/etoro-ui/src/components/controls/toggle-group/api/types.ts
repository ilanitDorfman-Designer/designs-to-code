import type { ReactElement, ReactNode } from 'react';
import type { AccessibilityRole, StyleProp, ViewStyle } from 'react-native';

export type ToggleGroupSize = 'small' | 'default';

export interface ToggleGroupOptionRenderState {
  selected: boolean;
  disabled: boolean;
}

export interface ToggleGroupOptionProps {
  id: string;
  children: ReactNode | ((state: ToggleGroupOptionRenderState) => ReactNode);
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export type EtToggleGroupChildren = ReactElement<ToggleGroupOptionProps> | ReactElement<ToggleGroupOptionProps>[];

export interface EtToggleGroupProps {
  children: EtToggleGroupChildren;
  selectedId: string;
  onSelectionChange?: (id: string) => void;
  size?: ToggleGroupSize;
  disabled?: boolean;
  haptics?: boolean;
  trackColor?: string;
  indicatorColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface ToggleGroupContextValue {
  selectedId: string;
  onSelect: (id: string) => void;
  size: ToggleGroupSize;
  disabled: boolean;
  haptics: boolean;
}
