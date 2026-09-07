const verdictNegative = {
  50: '#FCF3F2',
  100: '#FCDFDE',
  200: '#FFA39E',
  300: '#FF6D66',
  400: '#FF665E',
  500: '#F55249',
  600: '#D12515',
  700: '#BF1100',
  800: '#99332E',
  900: '#6B2420',
  1000: '#2D0F0E',
};

const verdictNegativeOpacity = {
  500.0: verdictNegative[500] + '00',
  500.15: verdictNegative[500] + '26',
  500.5: verdictNegative[500] + '99',
  600.0: verdictNegative[600] + '00',
  600.15: verdictNegative[600] + '26',
  600.5: verdictNegative[600] + '99',
};

export type VerdictNegative = typeof verdictNegative;
export type VerdictNegativeOpacity = typeof verdictNegativeOpacity;

export { verdictNegative, verdictNegativeOpacity };
