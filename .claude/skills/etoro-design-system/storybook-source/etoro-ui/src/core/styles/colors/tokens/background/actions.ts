import { neutral, primary, primaryVar } from '../../primitives';

const actionsLight = {
  bgActionBrand: primary[700],
  bgActionBrandHover: primary[600],
  bgActionBrandVar: primaryVar[700],
  bgActionBrandVarHover: primaryVar[600],
  bgActionInfo: neutral[850],
  bgActionInfoHover: neutral[600],
  bgActionDisabled: neutral[150],
};

const actionsDark = {
  bgActionBrand: primary[500],
  bgActionBrandHover: primary[400],
  bgActionBrandVar: primaryVar[400],
  bgActionBrandVarHover: primaryVar[300],
  bgActionInfo: neutral[50],
  bgActionInfoHover: neutral[0],
  // Lighter than bgNeutralTertiary so disabled buttons stay visible on sheets.
  bgActionDisabled: neutral[700],
};

export { actionsDark, actionsLight };
