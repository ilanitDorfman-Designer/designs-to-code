import { RiskScoreValue } from '../api/types';

const MIN_RISK_SCORE = 1;
const MAX_RISK_SCORE = 10;

/** Returns a design-system risk score (1–10) or undefined for missing/invalid API values. */
export function parseRiskScoreValue(value: unknown): RiskScoreValue | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    return undefined;
  }
  if (value < MIN_RISK_SCORE || value > MAX_RISK_SCORE) {
    return undefined;
  }
  return value as RiskScoreValue;
}
