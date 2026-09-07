import { neutral } from '../../primitives';

const dividersLight = {
  dividerPrimary: neutral[700],
  dividerSecondary: neutral[500],
  dividerTertiary: neutral[300],
  dividerQuinary: neutral[100],
  dividerQuinarySecondary: neutral[100],
  dividerSenary: neutral[50],
  dividerDark: neutral[300],
};

const dividersDark = {
  dividerPrimary: neutral[100],
  dividerSecondary: neutral[300],
  dividerTertiary: neutral[500],
  dividerQuinary: neutral[700],
  dividerQuinarySecondary: neutral[850],
  dividerSenary: neutral[800],
  dividerDark: neutral[750],
};

export type DividersLight = typeof dividersLight;
export type DividersDark = typeof dividersDark;

export { dividersDark, dividersLight };
