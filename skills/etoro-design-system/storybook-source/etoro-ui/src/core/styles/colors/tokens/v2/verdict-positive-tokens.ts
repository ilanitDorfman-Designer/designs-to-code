import { verdictPositive, verdictPositiveOpacity } from '../../primitives';

const verdictPositiveTokensLight = {
  verdictPositive050: verdictPositive[50],
  verdictPositive100: verdictPositive[100],
  verdictPositive200: verdictPositive[200],
  verdictPositive300: verdictPositive[300],
  verdictPositive400: verdictPositive[400],
  verdictPositive500: verdictPositive[500],
  verdictPositive600: verdictPositive[600],
  verdictPositive700: verdictPositive[700],
  verdictPositive800: verdictPositive[800],
  verdictPositive900: verdictPositive[900],
  verdictPositive1000: verdictPositive[1000],
  verdictPositive400Inverted: verdictPositive[400],
  verdictPositive400Static: verdictPositive[400],
  verdictPositive600Opacity0: verdictPositiveOpacity[600.0],
  verdictPositive600Opacity15: verdictPositiveOpacity[600.15],
  verdictPositive600Opacity50: verdictPositiveOpacity[600.5],
  verdictPositive600Static: verdictPositive[600],
  verdictPositive600Opacity0OnLight: verdictPositiveOpacity[600.0],
};

const verdictPositiveTokensDark = {
  verdictPositive050: verdictPositive[1000],
  verdictPositive100: verdictPositive[900],
  verdictPositive200: verdictPositive[800],
  verdictPositive300: verdictPositive[700],
  verdictPositive400: verdictPositive[600],
  verdictPositive500: verdictPositive[500],
  verdictPositive600: verdictPositive[400],
  verdictPositive700: verdictPositive[300],
  verdictPositive800: verdictPositive[200],
  verdictPositive900: verdictPositive[100],
  verdictPositive1000: verdictPositive[50],
  verdictPositive400Inverted: verdictPositive[600],
  verdictPositive400Static: verdictPositive[400],
  verdictPositive600Opacity0: verdictPositiveOpacity[400.0],
  verdictPositive600Opacity15: verdictPositiveOpacity[400.15],
  verdictPositive600Opacity50: verdictPositiveOpacity[400.5],
  verdictPositive600Static: verdictPositive[600],
  verdictPositive600Opacity0OnLight: verdictPositive[600],
};

export type VerdictPositiveTokensLight = typeof verdictPositiveTokensLight;
export type VerdictPositiveTokensDark = typeof verdictPositiveTokensDark;

export { verdictPositiveTokensDark, verdictPositiveTokensLight };
