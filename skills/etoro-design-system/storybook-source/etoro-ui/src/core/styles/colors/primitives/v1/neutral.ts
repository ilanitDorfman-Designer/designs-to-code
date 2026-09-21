const neutral = {
  0: '#FFFFFF',
  50: '#F2F2F2',
  100: '#E5E5E5',
  150: '#D9D9D9',
  200: '#CCCCCC',
  250: '#BFBFBF',
  300: '#B2B2B2',
  350: '#A6A6A6',
  400: '#999999',
  450: '#8C8C8C',
  500: '#808080',
  550: '#737373',
  600: '#666666',
  650: '#595959',
  700: '#4D4D4D',
  750: '#404040',
  800: '#333333',
  850: '#262626',
  900: '#1A1A1A',
  950: '#0D0D0D',
};

const neutralOpacity = {
  0: '#FFFFFF00',
  0.15: '#FFFFFF15',
  0.25: '#FFFFFF25',
  0.85: '#FFFFFF85',
  50.0: '#F2F2F250',
  50.2: '#F2F2F220',
  100.0: '#E5E5E500',
  200.2: '#CCCCCC20',
  200.3: '#CCCCCC30',
  600.25: '#66666625',
  700.0: '#4D4D4D00',
  800.0: '#33333300',
  850.0: '#26262600',
  850.8: '#26262680',
  850.85: '#26262685',
  950.0: '#0D0D0D00',
  950.25: '#0D0D0D25',
  950.95: '#0D0D0D95',
  900.85: '#1A1A1A85',
};

export type Neutral = typeof neutral;
export type NeutralOpacity = typeof neutralOpacity;

export { neutral, neutralOpacity };
