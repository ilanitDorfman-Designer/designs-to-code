import { primary } from './primary';

const green = {
  ...primary,
  100: primary[100],
  200: primary[200],
  300: primary[300],
  500: primary[500],
  700: primary[700],
  800: primary[800],
  900: primary[900],
};

const greenOpacity = {
  400.0: primary[400] + '00',
  400.1: primary[400] + '10',
  400.15: primary[400] + '15',
  400.2: primary[400] + '20',
  400.3: primary[400] + '30',
  400.45: primary[400] + '45',
  600.0: primary[600] + '00',
  600.1: primary[600] + '10',
  600.15: primary[600] + '15',
  600.45: primary[600] + '45',
};

export type Green = typeof green;
export type GreenOpacity = typeof greenOpacity;

export { green, greenOpacity };
