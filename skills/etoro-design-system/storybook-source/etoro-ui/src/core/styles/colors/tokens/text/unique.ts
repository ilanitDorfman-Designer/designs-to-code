import { currency, investment, riskScore } from '../../primitives';

const uniqueLight = {
  risk1: riskScore[1],
  risk2: riskScore[2],
  risk3: riskScore[3],
  risk4: riskScore[4],
  risk5: riskScore[5],
  risk6: riskScore[6],
  risk7: riskScore[7],
  risk8: riskScore[8],
  risk9: riskScore[9],
  risk10: riskScore[10],

  indicesPrimary: investment['indicesPrimary'],
  indicesGradient: investment['indicesGradientBase'],
  cryptoPrimary: investment['cryptoPrimary'],
  cryptoGradient: investment['cryptoGradientBase'],
  currenciesPrimary: investment['currenciesPrimary'],
  currenciesGradient: investment['currenciesGradientBase'],
  smartPortfoliosPrimary: investment['smartPortfoliosPrimary'],
  smartPortfoliosGradient: investment['smartPortfoliosGradientBase'],
  etfPrimary: investment['etfPrimary'],
  etfGradient: investment['etfGradientBase'],
  stocksPrimary: investment['stocksPrimary'],
  stocksGradient: investment['stocksGradientBase'],
  peoplePrimary: investment['peoplePrimary'],
  peopleGradient: investment['peopleGradientBase'],
  commoditiesPrimary: investment['commoditiesPrimary'],
  commoditiesGradient: investment['commoditiesGradientBase'],
  countriesPrimary: investment['countriesPrimary'],
  countriesGradient: investment['countriesGradientBase'],
  otherPrimary: investment['otherPrimary'],
  otherGradient: investment['otherGradientBase'],

  wallet: investment['options'],
  gbp: currency['GBP'],
  eur: currency['EUR'],
  usd: currency['USD'],
  aud: currency['AUD'],

  // Popular Investor (PI) star badge colours. Exact hex values from the legacy webapp
  // (`etoro-assets/.../discovery-funds-results-list.component.less`) — kept identical
  // for visual parity until the design system defines its own PI tier palette.
  piStarBlue: '#3F9ADB',
  piStarYellow: '#FDD590',
  piStarRed: '#E36B5F',
  piStarGreen: '#B0E05A',
};

const uniqueDark = { ...uniqueLight };

export type UniqueLight = typeof uniqueLight;
export type UniqueDark = typeof uniqueDark;

export { uniqueDark, uniqueLight };
