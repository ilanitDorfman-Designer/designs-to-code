import { StyleProp, ViewStyle } from 'react-native';
import { WithSpringConfig } from 'react-native-reanimated';

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | '5Y' | 'MAX';

export interface TimeFrameOption<T = TimeFrame> {
  id: T;
  label: string;
  value?: number; // The value to display in the floating label
}

/** Measured rect of a single option, indexed by position. */
export interface OptionLayout {
  x: number;
  width: number;
}

export interface EtTimeFrameToggleProps<T = TimeFrame> {
  /** Array of time frame options */
  options: TimeFrameOption<T>[];
  /** Currently selected time frame ID */
  selectedId: T;
  /** Callback when selection changes */
  onSelectionChange?: (option: TimeFrameOption<T>) => void;
  /** Whether to show the floating value label above the indicator */
  showLabel?: boolean;
  /** Font size for the option labels (default: 14) */
  fontSize?: number;
  /** Size of the indicator - affects height and min-width (default: 44) */
  indicatorSize?: number;
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Enable haptic feedback */
  haptics?: boolean;
  /** Animation configuration */
  animationConfig?: AnimationConfig;
  /** Test ID for accessibility */
  testID?: string;
  /** Color for the selected option label and indicator ring */
  selectedColor?: string;
  /** Color for unselected option labels */
  unselectedColor?: string;
  /** When true, options scroll horizontally instead of squeezing to fit the container width */
  scrollable?: boolean;
  /** When true with `scrollable`, initial scroll position anchors to the trailing (right) edge */
  scrollAnchorEnd?: boolean;
  /** When true with `scrollable`, shows edge gradient fades for overflow (default: same as `scrollable`) */
  showScrollFade?: boolean;
  /** Solid edge color for scroll fades — should match the chip row background */
  scrollFadeColor?: string;
  /** Horizontal padding inside each option chip (default: 12) */
  optionHorizontalPadding?: number;
  /** EtText variant for option labels (default: body-base-medium) */
  labelVariant?: 'body-base-medium' | 'body-tiny-medium';
}

export interface AnimationConfig {
  enableAnimation?: boolean;
  duration?: number;
  springConfig?: WithSpringConfig;
}

export const DEFAULT_ANIMATION_CONFIG: Required<AnimationConfig> = {
  enableAnimation: true,
  duration: 300,
  springConfig: {
    damping: 20,
    stiffness: 200,
    mass: 0.5,
  },
};

// Default sizes
export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_INDICATOR_SIZE = 44;
