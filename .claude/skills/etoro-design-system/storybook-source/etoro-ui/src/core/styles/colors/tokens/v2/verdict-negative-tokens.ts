import { verdictNegative, verdictNegativeOpacity } from '../../primitives';

const verdictNegativeTokensLight = {
  verdictNegative050: verdictNegative[50],
  verdictNegative100: verdictNegative[100],
  verdictNegative200: verdictNegative[200],
  verdictNegative300: verdictNegative[300],
  verdictNegative400: verdictNegative[400],
  verdictNegative500: verdictNegative[500],
  verdictNegative600: verdictNegative[600],
  verdictNegative700: verdictNegative[700],
  verdictNegative800: verdictNegative[800],
  verdictNegative900: verdictNegative[900],
  verdictNegative1000: verdictNegative[1000],
  verdictNegative400Inverted: verdictNegative[400],
  verdictNegative400Static: verdictNegative[400],
  verdictNegative600Opacity0: verdictNegativeOpacity[600.0],
  verdictNegative600Opacity15: verdictNegativeOpacity[600.15],
  verdictNegative600Opacity50: verdictNegativeOpacity[600.5],
  verdictNegative600Static: verdictNegative[600],
  verdictNegative600Opacity0OnLight: verdictNegativeOpacity[500.0],
};

const verdictNegativeTokensDark = {
  verdictNegative050: verdictNegative[1000],
  verdictNegative100: verdictNegative[900],
  verdictNegative200: verdictNegative[800],
  verdictNegative300: verdictNegative[700],
  verdictNegative400: verdictNegative[600],
  verdictNegative500: verdictNegative[500],
  verdictNegative600: verdictNegative[400],
  verdictNegative700: verdictNegative[300],
  verdictNegative800: verdictNegative[200],
  verdictNegative900: verdictNegative[100],
  verdictNegative1000: verdictNegative[50],
  verdictNegative400Inverted: verdictNegative[600],
  verdictNegative400Static: verdictNegative[400],
  verdictNegative600Opacity0: verdictNegativeOpacity[500.0],
  verdictNegative600Opacity15: verdictNegativeOpacity[500.15],
  verdictNegative600Opacity50: verdictNegativeOpacity[500.5],
  verdictNegative600Static: verdictNegative[600],
  verdictNegative600Opacity0OnLight: verdictNegative[400],
};

export type VerdictNegativeTokensLight = typeof verdictNegativeTokensLight;
export type VerdictNegativeTokensDark = typeof verdictNegativeTokensDark;

export { verdictNegativeTokensDark, verdictNegativeTokensLight };
