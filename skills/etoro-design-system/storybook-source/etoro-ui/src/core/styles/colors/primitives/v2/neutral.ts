const neutralV2 = {
  50: '#FFFFFF',
  100: '#F7F7F7',
  200: '#F2F2F2',
  300: '#E0E0E0',
  400: '#B3B3B3',
  500: '#999999',
  600: '#666666',
  700: '#2E3033',
  800: '#242628',
  900: '#1B1E21',
  1000: '#0B0D10',
};

const neutralV2Opacity = {
  50.03: '#FFFFFF08',
  50.06: '#FFFFFF0F',
  50.1: '#FFFFFF1A',
  500.15: '#B2B2B226',
  500.25: '#B2B2B240',
  500.3: '#B2B2B24D',
  800.92: '#242628EB',
  900.03: '#1B1E2108',
  900.04: '#1B1E210A',
  900.06: '#1B1E210F',
  900.95: '#1B1E21F2',
};

export type NeutralV2 = typeof neutralV2;
export type NeutralV2Opacity = typeof neutralV2Opacity;

export { neutralV2, neutralV2Opacity };
