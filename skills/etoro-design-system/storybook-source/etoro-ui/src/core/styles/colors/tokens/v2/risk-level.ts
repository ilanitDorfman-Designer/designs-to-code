import { riskScore } from '../../primitives';

const riskLevelLight = {
  riskLevel050: riskScore[1],
  riskLevel100: riskScore[2],
  riskLevel200: riskScore[3],
  riskLevel300: riskScore[4],
  riskLevel400: riskScore[5],
  riskLevel500: riskScore[6],
  riskLevel600: riskScore[7],
  riskLevel700: riskScore[8],
  riskLevel800: riskScore[9],
  riskLevel900: riskScore[10],
};

const riskLevelDark = {
  riskLevel050: riskScore[1],
  riskLevel100: riskScore[2],
  riskLevel200: riskScore[3],
  riskLevel300: riskScore[4],
  riskLevel400: riskScore[5],
  riskLevel500: riskScore[6],
  riskLevel600: riskScore[7],
  riskLevel700: riskScore[8],
  riskLevel800: riskScore[9],
  riskLevel900: riskScore[10],
};

export type RiskLevelLight = typeof riskLevelLight;
export type RiskLevelDark = typeof riskLevelDark;

export { riskLevelDark, riskLevelLight };
