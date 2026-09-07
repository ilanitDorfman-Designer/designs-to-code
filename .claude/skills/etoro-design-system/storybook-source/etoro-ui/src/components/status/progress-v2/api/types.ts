import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import type { eToroTheme } from '../../../../core/styles';

/**
 * Progress variant type
 */
export type EtProgressV2Variant = 'line' | 'circle' | 'line-sectioned';

/**
 * A design-system color token key (e.g. `'accentA700'`). Used by `customColor` so
 * the fill can only be a theme color — never an arbitrary literal — which keeps
 * bars on-brand and correct across light/dark.
 */
export type EtProgressV2CustomColor = keyof eToroTheme['colors'];

/**
 * Progress size for both line and circle variants
 */
export type EtProgressV2Size = 'small' | 'medium' | 'large';

/**
 * Progress color scheme
 */
export type EtProgressV2Color = 'positive' | 'neutral';

/**
 * Base props shared by all variants
 */
interface EtProgressV2BaseProps {
  /**
   * Progress value from 0 to 1
   */
  progress: number;

  /**
   * Visual variant of the progress indicator
   * @default 'line'
   */
  variant?: EtProgressV2Variant;

  /**
   * Color scheme for the progress indicator
   * @default 'positive'
   */
  color?: EtProgressV2Color;

  /**
   * Show gray background track
   * @default false
   */
  showBackground?: boolean;

  /**
   * Custom container styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier
   */
  testID?: string;

  /**
   * When `true`, the filled portion of the bar animates in (slides + fades
   * from the left). Rendered as an `Animated.View` only when enabled.
   * @default false
   */
  fillEntering?: boolean;

  /**
   * Custom fill color that overrides the `color` scheme. Accepts a design-system
   * color token key (e.g. `'accentA700'`), resolved from the theme at render.
   * Use when the fill color is data-driven and not one of the built-in
   * `positive`/`neutral` schemes — e.g. per-row categorical allocation bars.
   */
  customColor?: EtProgressV2CustomColor;
}

/**
 * Props specific to line variant
 */
interface EtProgressV2LineProps extends EtProgressV2BaseProps {
  variant?: 'line';

  /**
   * Size of the line progress bar
   * @default 'small'
   */
  size?: EtProgressV2Size;

  /**
   * Show "XX% complete" label below the bar
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom label text (overrides default "XX% complete")
   */
  labelText?: string;

  /**
   * Children not supported for line variant
   */
  children?: never;
}

/**
 * Props specific to circle variant
 */
interface EtProgressV2CircleProps extends EtProgressV2BaseProps {
  variant: 'circle';

  /**
   * Size of the circle: small (32px), medium (40px), large (48px)
   * @default 'medium'
   */
  size?: EtProgressV2Size;

  /**
   * Content to display in the center of the circle
   */
  children?: ReactNode;

  /**
   * Label props not supported for circle variant
   */
  showLabel?: never;
  labelText?: never;
}

/**
 * Props specific to line-sectioned variant
 */
export interface EtProgressV2LineSectionedProps extends EtProgressV2BaseProps {
  variant: 'line-sectioned';

  /**
   * Number of sections to split the progress bar into
   */
  sections: number;

  /**
   * Optional gap between sections
   * @default theme.spacing.X0_5 (2px)
   */
  gap?: number;

  /**
   * Size of the line progress bar
   * @default 'small'
   */
  size?: EtProgressV2Size;

  /**
   * Children not supported for line-sectioned variant
   */
  children?: never;

  /**
   * Label props not supported for line-sectioned variant
   */
  showLabel?: never;
  labelText?: never;
}

/**
 * Props for EtProgressV2 component
 */
export type EtProgressV2Props = EtProgressV2LineProps | EtProgressV2CircleProps | EtProgressV2LineSectionedProps;

/**
 * Props for ProgressLine subcomponent
 */
export interface ProgressLineProps {
  progress: number;
  size: EtProgressV2Size;
  color: EtProgressV2Color;
  showBackground: boolean;
  showLabel: boolean;
  labelText?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  fillEntering?: boolean;

  /**
   * Custom fill color that overrides the `color` scheme (design-system token key).
   */
  customColor?: EtProgressV2CustomColor;

  /**
   * Delay (ms) before the fill starts sliding toward its target width. Used by
   * the sectioned variant to stagger sections so they fill one after another.
   * Defaults to no delay.
   */
  fillDelay?: number;

  /**
   * Duration (ms) of the fill slide. Used by the sectioned variant to give each
   * section a slice of the total sweep proportional to the width it fills, so
   * the row sweeps at one constant speed. When omitted, the default ease-out
   * timing is used (plain line variant).
   */
  fillDuration?: number;

  /**
   * When `true`, the fill slides in from zero on first layout instead of
   * snapping to its width. Used by the sectioned variant so every section —
   * including the first (delay 0) — sweeps in as part of one continuous line.
   * @default false
   */
  animateOnMount?: boolean;
}

/**
 * Props for ProgressCircle subcomponent
 */
export interface ProgressCircleProps {
  progress: number;
  size: EtProgressV2Size;
  color: EtProgressV2Color;
  showBackground: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;

  /**
   * Custom fill color that overrides the `color` scheme (design-system token key).
   */
  customColor?: EtProgressV2CustomColor;
}

/**
 * Props for ProgressLineSectioned subcomponent
 */
export type ProgressLineSectionedProps = Omit<EtProgressV2LineSectionedProps, 'variant' | 'children' | 'showLabel' | 'labelText'>;
