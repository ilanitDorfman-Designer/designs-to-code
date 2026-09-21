import { useMemo } from 'react';

import { RiskScoreValue, RiskScoreVariant } from '../api/types';
import { getSegmentColor, getSegmentDashArray, getSegmentDashOffset, TOTAL_SEGMENTS } from '../utils';
import { RiskScoreConfig } from './use-risk-score-config';

export interface RiskScoreSegment {
  key: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

/**
 * Derives the array of arc-segment descriptors for EtRiskScore.
 *
 * Each segment contains the pre-computed SVG dash parameters and resolved
 * color so the component can render without any layout logic.
 *
 * @param config - Visual configuration from useRiskScoreConfig
 * @param value  - The current risk score value (1-10)
 * @param variant - Display variant ('multi' or 'single')
 * @returns An array of segment objects ready for SVG rendering
 */
export function useRiskScoreSegments(config: RiskScoreConfig, value: RiskScoreValue, variant: RiskScoreVariant): RiskScoreSegment[] {
  return useMemo(() => {
    const [dashLength, gapLength] = getSegmentDashArray(config.circumference);

    return Array.from({ length: TOTAL_SEGMENTS }, (_, i) => ({
      key: i,
      color: getSegmentColor(i, value, variant, config.scoreColor, config.inactiveColor),
      dashArray: `${dashLength} ${gapLength}`,
      dashOffset: getSegmentDashOffset(i, config.circumference),
    }));
  }, [value, variant, config.circumference, config.scoreColor, config.inactiveColor]);
}
