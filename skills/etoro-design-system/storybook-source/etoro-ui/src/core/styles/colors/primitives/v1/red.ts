import { primaryVar } from './primary-var';

// Extends primaryVar with custom 400.x opacity variants
// Base keys available from primaryVar: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
const red = {
  ...primaryVar,
  400.0: primaryVar[400] + '00',
  400.1: primaryVar[400] + '10',
  400.15: primaryVar[400] + '15',
  400.2: primaryVar[400] + '20',
  400.3: primaryVar[400] + '30',
  400.5: primaryVar[400] + '50',
  600.15: primaryVar[600] + '15',
};

export type Red = typeof red;

export { red };
