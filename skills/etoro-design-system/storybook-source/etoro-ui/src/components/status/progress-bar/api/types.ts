import { StyleProp, ViewStyle } from 'react-native';

export enum EtProgressBarFillType {
  Solid = 'solid',
  Gradient = 'gradient',
}

interface SolidFillProps {
  fillType: EtProgressBarFillType.Solid;
  progressColor: string;
  gradientColors?: never;
}

export interface EtProgressBarPropsBase {
  progress: number; // 0 to 1
  style?: StyleProp<ViewStyle>;
  height?: number;
  testID?: string;
}

interface GradientFillProps {
  fillType: EtProgressBarFillType.Gradient;
  gradientColors?: [string, string, ...string[]];
  progressColor?: never;
}

export type EtProgressBarProps = EtProgressBarPropsBase & (SolidFillProps | GradientFillProps);
