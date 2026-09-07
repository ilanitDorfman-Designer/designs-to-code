import { neutral, neutralOpacity } from '../../primitives';

const neutralLight = {
  textPrimaryNeutral: neutral[900],
  textSecondaryNeutral: neutral[600],
  textTertiaryNeutral: neutral[500],
  textQuaternaryNeutral: neutral[300],
  textDisabledPrimaryNeutral: neutral[200],
  textTransparentNeutral: neutralOpacity[200.2],
  textInvertedPrimaryNeutral: neutral[0],
  textBright: neutral[0],
  textDark: neutral[200],
};

const neutralDark = {
  textPrimaryNeutral: neutral[0],
  textSecondaryNeutral: neutral[100],
  textTertiaryNeutral: neutral[300],
  textQuaternaryNeutral: neutral[500],
  textDisabledPrimaryNeutral: neutral[700],
  textTransparentNeutral: neutralOpacity[200.2],
  textInvertedPrimaryNeutral: neutral[850],
  textBright: neutral[0],
  textDark: neutral[150],
};

export type NeutralLight = typeof neutralLight;
export type NeutralDark = typeof neutralDark;

export { neutralDark, neutralLight };
