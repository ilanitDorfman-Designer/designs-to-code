import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { withAlpha } from '../../../../core/styles/color.utils';
import { X1, X2, X3, X4, X8, X12, X13, X15, X17 } from '../../../../core/styles/spacing';
import { TextVariant } from '../../../../foundations/text/utils/variant-config';
import { OtpInputSize } from '../api/types';

interface UseOtpConfigProps {
  size: OtpInputSize;
  error: boolean;
}

/** Resolved cell dimensions */
export interface OtpCellDimensions {
  width: number;
  height: number;
  gap: number;
  borderRadius: number;
}

/** Resolved colors for the OTP cells */
export interface OtpCellColors {
  filledText: string;
  errorText: string;
  secureDot: string;
  secureDotError: string;
  cellBackgroundDefault: string;
  /** Border for inactive / filled cells — keeps every slot visible on any surface */
  idleBorder: string;
  /** Border for the active (next empty) cell — stronger emphasis */
  focusedBorder: string;
  iconColor: string;
}

export interface OtpConfig {
  dimensions: OtpCellDimensions;
  colors: OtpCellColors;
  textVariant: TextVariant;
  dotSize: number;
}

// =============================================================================
// Size dimension presets (Figma phone / OTP digit cells), keyed by OtpInputSize
// large: 60×68, medium: 48×52, small: 32×52 — 1px border on every cell; active uses stronger token
// =============================================================================

const DIMENSIONS: Record<OtpInputSize, OtpCellDimensions> = {
  /** Many digits — smallest cells */
  small: { width: X8, height: X13, gap: X1, borderRadius: X2 },
  medium: { width: X12, height: X13, gap: X1, borderRadius: X2 },
  /** Few digits — largest cells; Figma ~9.48px radius */
  large: { width: X15, height: X17, gap: X1, borderRadius: 9.5 },
};

const TEXT_VARIANT: Record<OtpInputSize, TextVariant> = {
  small: 'num-ml-medium',
  medium: 'num-l-medium',
  large: 'num-xl-medium',
};

const DOT_SIZE: Record<OtpInputSize, number> = {
  small: X3,
  medium: X3,
  large: X4,
};

// ~8% carbon overlay (`#…14`); kept in 0–1 form so the opacity reads as intent.
const DEFAULT_CELL_BACKGROUND_ALPHA = 0.08;

/**
 * Resolves the cell size tier from the OTP length (when `size` prop is not set).
 * - 2–3 digits → large
 * - 4–6 digits → medium
 * - 7–9 digits → small
 */
export function getOtpSize(length: number): OtpInputSize {
  if (length <= 3) {
    return 'large';
  }
  if (length <= 6) {
    return 'medium';
  }
  return 'small';
}

/**
 * Resolves props + theme into cell configuration (dimensions, colors, typography).
 * Pure computation — no state, no side-effects.
 */
export function useOtpConfig({ size, error }: UseOtpConfigProps): OtpConfig {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const dimensions = DIMENSIONS[size];
    const errorColor = colors.actionBrandVarText;
    const cellBackgroundDefault = withAlpha(colors.carbon900, DEFAULT_CELL_BACKGROUND_ALPHA);

    const cellColors: OtpCellColors = {
      filledText: error ? errorColor : colors.textPrimaryNeutral,
      errorText: errorColor,

      secureDot: error ? errorColor : colors.textPrimaryNeutral,
      secureDotError: errorColor,

      cellBackgroundDefault,

      idleBorder: error ? errorColor : 'transparent',
      focusedBorder: error ? errorColor : colors.carbon900,

      iconColor: colors.textPrimaryNeutral,
    };

    return {
      dimensions,
      colors: cellColors,
      textVariant: TEXT_VARIANT[size],
      dotSize: DOT_SIZE[size],
    };
  }, [colors, error, size]);
}
