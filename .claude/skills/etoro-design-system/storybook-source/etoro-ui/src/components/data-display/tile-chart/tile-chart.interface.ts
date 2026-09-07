import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface TileChartData {
  id?: string;
  label: string;
  value: number;
  color: [string, string];
}

export interface TileChartClasses {
  container?: StyleProp<ViewStyle>;
  barsContainer?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  percentage?: StyleProp<TextStyle>;
}

export interface TileChartStyles {
  height?: number;
  gap?: number;
}

export type TileChartDirection = 'vertical' | 'horizontal' | 'mixed';

export interface EtTileChartProps {
  data: TileChartData[];
  classes?: TileChartClasses;
  styles?: TileChartStyles;
  symbol?: string;
  direction?: TileChartDirection;
  testID?: string;
  onItemPress?: (item: TileChartLayoutItem, event: GestureResponderEvent) => void;
}

export type TileChartRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type TileChartLayoutItem = TileChartData & {
  rect: TileChartRect;
};
