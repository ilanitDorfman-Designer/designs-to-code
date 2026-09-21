const verdictPositive = {
  50: '#F2FCF4',
  100: '#DEFCE4',
  200: '#B8FFC5',
  300: '#99FFAC',
  400: '#6EFF8B',
  500: '#1CCF3F',
  600: '#0EB12E',
  700: '#10A12C',
  800: '#206B2F',
  900: '#14421D',
  1000: '#030A04',
};

const verdictPositiveOpacity = {
  400.0: verdictPositive[400] + '00',
  400.51: verdictPositive[400] + '00',
  400.52: verdictPositive[400] + '00',
  400.15: verdictPositive[400] + '26',
  400.5: verdictPositive[400] + '99',
  600.0: verdictPositive[600] + '00',
  600.15: verdictPositive[600] + '26',
  600.5: verdictPositive[600] + '80',
};

export type VerdictPositive = typeof verdictPositive;
export type VerdictPositiveOpacity = typeof verdictPositiveOpacity;

export { verdictPositive, verdictPositiveOpacity };
