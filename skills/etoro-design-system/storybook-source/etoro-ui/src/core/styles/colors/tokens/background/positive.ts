import { green, greenOpacity, neutral } from '../../primitives';

const positiveLight = {
  bgPositivePrimary: green[600],
  bgPositiveSecondary: green[200],
  bgPositiveTertiary: green[200],
  bgPositiveTertiaryOpaque: green[300],
  bgPositiveForthiary: green[100],
  bgPositiveQuinary: green[300],
  bgPositiveSenary: green[200],
  bgPositiveSeptenary: green[100],

  // gradients
  positiveGradientPrimary50: green[500],
  positiveGradientPrimary70: green[700],
  positiveTransparentSecondary: green[800],
  positiveGradientSecondary45: greenOpacity[600.45],
  positiveGradientSecondary30: greenOpacity[600.15],
  positiveGradientSecondary25: greenOpacity[600.1],
  positiveGradientSecondary0: greenOpacity[600.0],
  positiveIndicatorBackground: greenOpacity[600.15],
};

const positiveDark = {
  bgPositivePrimary: green[500],
  bgPositiveSecondary: green[500],
  bgPositiveTertiary: greenOpacity[400.2],
  bgPositiveTertiaryOpaque: green[900],
  bgPositiveForthiary: greenOpacity[400.2],
  bgPositiveQuinary: green[400],
  bgPositiveSenary: green[900],
  bgPositiveSeptenary: neutral[850],

  // gradients
  positiveGradientPrimary50: green[500],
  positiveGradientPrimary70: green[700],
  positiveTransparentSecondary: green[800],
  positiveGradientSecondary45: greenOpacity[400.45],
  positiveGradientSecondary30: greenOpacity[400.15],
  positiveGradientSecondary25: greenOpacity[400.1],
  positiveGradientSecondary0: greenOpacity[400.0],
  positiveIndicatorBackground: greenOpacity[400.15],
};

export type PositiveLight = typeof positiveLight;
export type PositiveDark = typeof positiveDark;

export { positiveDark, positiveLight };
