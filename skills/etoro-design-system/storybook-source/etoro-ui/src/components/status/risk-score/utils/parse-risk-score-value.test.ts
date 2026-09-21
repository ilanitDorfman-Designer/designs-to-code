import { parseRiskScoreValue } from './parse-risk-score-value';

describe('parseRiskScoreValue', () => {
  it.each([1, 5, 10] as const)('GIVEN valid score %s WHEN parsed THEN returns score', (score) => {
    expect(parseRiskScoreValue(score)).toBe(score);
  });

  it.each([0, 11, -1, NaN, Infinity, 7.5, null, undefined, '7'])('GIVEN invalid value %p WHEN parsed THEN returns undefined', (value) => {
    expect(parseRiskScoreValue(value)).toBeUndefined();
  });
});
