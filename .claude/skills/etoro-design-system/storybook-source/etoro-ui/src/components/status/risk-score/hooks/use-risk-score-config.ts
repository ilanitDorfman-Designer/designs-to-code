import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { TextVariant } from '../../../../foundations/text/utils/variant-config';
import { EtRiskScoreProps, RiskScoreSize, RiskScoreValue } from '../api/types';

/** Maps shirt-size keys to pixel diameters */
export const SIZE_PX: Record<RiskScoreSize, number> = {
  xs: 20,
  sm: 24,
  md: 30,
  lg: 35,
};

/**
 * Per-size visual configuration for the risk score component.
 */
interface SizeConfig {
  strokeWidth: number;
  /** EtText variant that provides fontSize, fontFamily, lineHeight, etc. */
  textVariant: TextVariant;
}

const SIZE_CONFIG: Record<RiskScoreSize, SizeConfig> = {
  xs: { strokeWidth: 1.5, textVariant: 'num-xxs' },
  sm: { strokeWidth: 1.5, textVariant: 'num-xs' },
  md: { strokeWidth: 2, textVariant: 'num-s' },
  lg: { strokeWidth: 2, textVariant: 'num-sm' },
};

// Inactive segment color is sourced from the theme's dividerTertiary token
// (neutral[300] in light mode, neutral[500] in dark mode).

/**
 * Maps a RiskScoreValue to its theme color token key (risk1 … risk10).
 */
const RISK_COLOR_KEYS: Record<RiskScoreValue, string> = {
  1: 'risk1',
  2: 'risk2',
  3: 'risk3',
  4: 'risk4',
  5: 'risk5',
  6: 'risk6',
  7: 'risk7',
  8: 'risk8',
  9: 'risk9',
  10: 'risk10',
};

export interface RiskScoreConfig {
  /** Resolved pixel size */
  px: number;
  /** SVG stroke width for arcs */
  strokeWidth: number;
  /** EtText variant for the center number (handles fontSize, fontFamily, lineHeight) */
  textVariant: TextVariant;
  /** Radius of the arc (center of stroke) */
  radius: number;
  /** SVG viewBox center coordinate */
  center: number;
  /** Full circumference of the arc circle */
  circumference: number;
  /** Theme-resolved color for the score value (used for active segments and text) */
  scoreColor: string;
  /** Color for inactive segments */
  inactiveColor: string;
  /** Color for the score number text (same as scoreColor) */
  textColor: string;
}

/**
 * Computes all derived visual configuration for EtRiskScore.
 * All business logic for sizing, colors, and geometry lives here.
 */
export function useRiskScoreConfig({ value, size = 'md' }: Pick<EtRiskScoreProps, 'value' | 'size'>): RiskScoreConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const px = SIZE_PX[size];
    const sizeConfig = SIZE_CONFIG[size];
    const radius = (px - sizeConfig.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const inactiveColor = colors.dividerTertiary;
    const riskKey = RISK_COLOR_KEYS[value];
    const scoreColor = (riskKey && (colors as Record<string, string>)[riskKey]) || '#000000';

    return {
      px,
      strokeWidth: sizeConfig.strokeWidth,
      textVariant: sizeConfig.textVariant,
      radius,
      center: px / 2,
      circumference,
      scoreColor,
      inactiveColor,
      textColor: scoreColor,
    };
  }, [value, size, colors]);
}
