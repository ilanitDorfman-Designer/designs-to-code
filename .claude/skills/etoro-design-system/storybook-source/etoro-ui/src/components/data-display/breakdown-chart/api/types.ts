import { StyleProp, ViewStyle } from 'react-native';

export type BreakdownChartData = {
  key: string;
  value: number;
  color: [string, string]; // [from, to] gradient colors
};

export type EtBreakdownChartProps = {
  /** Chart data array */
  data?: BreakdownChartData[];
  /** Chart height in pixels */
  height?: number;
  /** Corner radius for bars */
  cornerRadius?: number;
  /** Gap between bars in pixels */
  gap?: number;
  /** Maximum number of main bars to show before condensing into "Other" */
  maxBars?: number;
  /** Show/hide labels below chart */
  showLabels?: boolean;
  /** Enable/disable animations */
  enableAnimation?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
};

export type AnimatedBreakdownChartData = BreakdownChartData & {
  animatedValue?: number;
};
