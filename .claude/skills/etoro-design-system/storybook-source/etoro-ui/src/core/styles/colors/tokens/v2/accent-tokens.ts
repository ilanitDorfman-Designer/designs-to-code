import {
  accentA,
  accentA2,
  accentB,
  accentB2,
  accentC,
  accentC2,
  accentD,
  accentD2,
  accentE,
  accentE2,
  accentF,
  accentF2,
  accentG,
  accentG2,
} from '../../primitives';

const accentTokensLight = {
  accentA100: accentA[100],
  accentA400: accentA[400],
  accentA700: accentA[700],

  accentB100: accentB[100],
  accentB400: accentB[400],
  accentB700: accentB[700],

  accentC100: accentC[100],
  accentC400: accentC[400],
  accentC700: accentC[700],

  accentD100: accentD[100],
  accentD400: accentD[400],
  accentD700: accentD[700],

  accentE100: accentE[100],
  accentE400: accentE[400],
  accentE700: accentE[700],

  accentF100: accentF[100],
  accentF400: accentF[400],
  accentF700: accentF[700],

  accentG100: accentG[100],
  accentG400: accentG[400],
  accentG700: accentG[700],
};

const accentTokensDark = {
  accentA100: accentA2[100],
  accentA400: accentA2[400],
  accentA700: accentA2[700],

  accentB100: accentB2[100],
  accentB400: accentB2[400],
  accentB700: accentB2[700],

  accentC100: accentC2[100],
  accentC400: accentC2[400],
  accentC700: accentC2[700],

  accentD100: accentD2[100],
  accentD400: accentD2[400],
  accentD700: accentD2[700],

  accentE100: accentE2[100],
  accentE400: accentE2[400],
  accentE700: accentE2[700],

  accentF100: accentF2[100],
  accentF400: accentF2[400],
  accentF700: accentF2[700],

  accentG100: accentG2[100],
  accentG400: accentG2[400],
  accentG700: accentG2[700],
};

export type AccentTokensLight = typeof accentTokensLight;
export type AccentTokensDark = typeof accentTokensDark;

export { accentTokensDark, accentTokensLight };
