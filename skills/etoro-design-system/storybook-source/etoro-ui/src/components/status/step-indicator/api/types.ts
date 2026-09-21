import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

/**
 * Props for EtStepIndicator component
 *
 * @example
 * ```tsx
 * <EtStepIndicator steps={['Profile', 'Verification', 'Deposit']} currentStep={0} progress={0.5} />
 * ```
 */
export interface EtStepIndicatorProps {
  /**
   * Ordered step labels. Requires at least 2 steps.
   */
  steps: string[];

  /**
   * 0-based index of the active step. Its label is emphasized (semibold,
   * `activeLabelColor`) and its dot rendered larger. Dot fill color follows
   * {@link progress} reach — an active step ahead of the fill keeps the track
   * color until the fill catches up.
   */
  currentStep: number;

  /**
   * Fill of the whole track from 0 to 1. Dots the fill reaches are tinted in
   * the fill color.
   * @default currentStep / (steps.length - 1)
   */
  progress?: number;

  /**
   * Base size in px — the active dot diameter. The rest of the geometry scales
   * from it: inactive dots are 0.75x, the track is 0.25x thick.
   * @default 10
   */
  size?: number;

  /**
   * Fill color — used for the progress line and reached dots.
   * @default primaryV2[400] (#6EFF8B — Figma Primary/600)
   */
  color?: string;

  /**
   * Track color — used for the unfilled line and unreached dots.
   * @default theme colors.dividerQuinary
   */
  trackColor?: string;

  /**
   * Active step label color.
   * @default theme colors.textPrimaryNeutral
   */
  activeLabelColor?: string;

  /**
   * Inactive step label color.
   * @default `body-tiny-regular` variant color (carbon400)
   */
  labelColor?: string;

  /**
   * Custom container styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier
   */
  testID?: string;
}

/**
 * Props for the StepIndicatorStep subcomponent
 */
export interface StepIndicatorStepProps {
  label: string;
  isActive: boolean;
  /** Active dot diameter in px; inactive dots render at 0.75x */
  size: number;
  dotColor: string;
  labelColor?: string;
  /** First step aligns its dot with the label start; the rest center it above the label */
  alignment: 'start' | 'center';
  onLayout: (event: LayoutChangeEvent) => void;
  testID?: string;
}
