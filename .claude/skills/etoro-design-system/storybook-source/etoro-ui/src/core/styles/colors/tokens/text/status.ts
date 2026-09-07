import { blue, green, mint, orange, purple, red, violet, yellow } from '../../primitives';

const statusLight = {
  statusPositive: green[700],
  indicatorPositive: green[600],
  statusNegative: red[700],
  indicatorNegative: red[600],
  statusOrange: orange[700],
  statusYellow: yellow[700],
  statusMint: mint[700],
  statusBlue: blue[700],
  statusPurple: purple[700],
  statusViolet: violet[700],
};

const statusDark = {
  statusPositive: green[500],
  indicatorPositive: green[500],
  statusNegative: red[500],
  indicatorNegative: red[500],
  statusOrange: orange[500],
  statusYellow: yellow[500],
  statusMint: mint[500],
  statusBlue: blue[500],
  statusPurple: purple[500],
  statusViolet: violet[500],
};

export type StatusLight = typeof statusLight;
export type StatusDark = typeof statusDark;

export { statusDark, statusLight };
