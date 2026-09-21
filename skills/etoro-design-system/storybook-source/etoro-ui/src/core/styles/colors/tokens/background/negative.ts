import { neutral, red } from '../../primitives';

const negativeLight = {
  bgNegativePrimary: red[600],
  bgNegativeSecondary: red[200],
  bgNegativeTertiary: red[200],
  bgNegativeTertiaryOpaque: red[300],
  bgNegativeForthiary: red[100],
  bgNegativeQuinary: red[300],
  bgNegativeSenary: red[200],
  bgNegativeSeptenary: red[100],

  // gradients
  negativeGradientPrimary50: red[300],
  negativeGradientPrimary70: red[700],
  negativeTransparentSecondary: red[800],
  negativeGradientSecondary45: red[400.5],
  negativeGradientSecondary30: red[400.2],
  negativeGradientSecondary25: red[400.15],
  negativeGradientSecondary0: red[400.0],
  negativeIndicatorBackground: red[600.15],
};

const negativeDark = {
  bgNegativePrimary: red[500],
  bgNegativeSecondary: red[500],
  bgNegativeTertiary: red[400.2],
  bgNegativeTertiaryOpaque: red[900],
  bgNegativeForthiary: red[400.2],
  bgNegativeQuinary: red[400],
  bgNegativeSenary: red[900],
  bgNegativeSeptenary: neutral[850],

  // gradients
  negativeGradientPrimary50: red[300],
  negativeGradientPrimary70: red[700],
  negativeTransparentSecondary: red[800],
  negativeGradientSecondary45: red[400.5],
  negativeGradientSecondary30: red[400.2],
  negativeGradientSecondary25: red[400.15],
  negativeGradientSecondary0: red[400.0],
  negativeIndicatorBackground: red[400.15],
};

export type NegativeLight = typeof negativeLight;
export type NegativeDark = typeof negativeDark;

export { negativeDark, negativeLight };
