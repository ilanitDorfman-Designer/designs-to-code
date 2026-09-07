import { neutral, primary, primaryVar } from '../../primitives';

const actionsLight = {
  actionBrandText: primary[700],
  actionBrandTextHover: primary[800],
  actionBrandVarText: primaryVar[700],
  actionBrandVarTextHover: primaryVar[800],
  actionInfoText: neutral[850],
  actionInfoTextHover: neutral[950],
  actionDisabledText: neutral[300],
  indicator: primary[600],
};

const actionsDark = {
  actionBrandText: primary[500],
  actionBrandTextHover: primary[400],
  actionBrandVarText: primaryVar[500],
  actionBrandVarTextHover: primaryVar[400],
  actionInfoText: neutral[0],
  actionInfoTextHover: neutral[50],
  actionDisabledText: neutral[500],
  indicator: neutral[0],
};

export type ActionsLight = typeof actionsLight;
export type ActionsDark = typeof actionsDark;

export { actionsDark, actionsLight };
