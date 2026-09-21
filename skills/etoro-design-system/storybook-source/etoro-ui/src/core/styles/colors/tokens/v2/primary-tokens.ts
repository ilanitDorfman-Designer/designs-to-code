import { primaryV2 } from '../../primitives';

const primaryTokensLight = {
  primary050: primaryV2[50],
  primary100: primaryV2[100],
  primary200: primaryV2[200],
  primary300: primaryV2[300],
  primary400: primaryV2[400],
  primary500: primaryV2[500],
  primary600: primaryV2[600],
  primary700: primaryV2[700],
  primary800: primaryV2[800],
  primary900: primaryV2[900],
  primary1000: primaryV2[1000],
};

const primaryTokensDark = {
  primary050: primaryV2[1000],
  primary100: primaryV2[900],
  primary200: primaryV2[800],
  primary300: primaryV2[700],
  primary400: primaryV2[600],
  primary500: primaryV2[500],
  primary600: primaryV2[400],
  primary700: primaryV2[300],
  primary800: primaryV2[200],
  primary900: primaryV2[100],
  primary1000: primaryV2[50],
};

export type PrimaryTokensLight = typeof primaryTokensLight;
export type PrimaryTokensDark = typeof primaryTokensDark;

export { primaryTokensDark, primaryTokensLight };
