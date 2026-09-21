import { useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import type { EtLoaderProps, LoaderSize, LoaderSizeConfig } from '../api/types';

/**
 * Size configurations matching Figma design specs
 * Maps size names to pixel dimensions and stroke widths
 */
const SIZE_CONFIG: Record<LoaderSize, LoaderSizeConfig> = {
  tiny: { size: 12, strokeWidth: 1.5 },
  xs: { size: 16, strokeWidth: 1.6 },
  small: { size: 20, strokeWidth: 2 },
  medium: { size: 24, strokeWidth: 2.8 },
  large: { size: 30, strokeWidth: 3.5 },
  xl: { size: 36, strokeWidth: 4.2 },
};

/**
 * Loader configuration derived from props and theme
 */
export interface LoaderConfig {
  /** Container size in pixels */
  containerSize: number;
  /** Stroke width for the circular arc */
  strokeWidth: number;
  /** Radius of the circle (accounting for stroke) */
  radius: number;
  /** Center point of the SVG */
  center: number;
  /** Track color */
  trackColor: string;
  /** Progress color */
  progressColor: string;
  /** Animation duration in ms */
  duration: number;
  /** Whether loader is in indeterminate state */
  isIndeterminate: boolean;
  /** Progress value clamped to 0-1 */
  clampedProgress: number;
}

/**
 * Hook that processes loader props into configuration values
 * All business logic for the loader lives here
 */
export function useLoaderConfig(props: EtLoaderProps): LoaderConfig {
  const {
    size = 'medium',
    state = 'indeterminate',
    progress = 0,
    trackColor: customTrackColor,
    progressColor: customProgressColor,
    duration = 1000,
  } = props;
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    // Determine container size and stroke width from preset size
    const sizeConfig = SIZE_CONFIG[size];
    const containerSize = sizeConfig.size;
    const strokeWidth = sizeConfig.strokeWidth;

    // Calculate circle geometry
    const center = containerSize / 2;
    const radius = Math.max(0, (containerSize - strokeWidth) / 2);

    // Resolve colors - use theme colors with fallback to Figma design colors
    // Figma design: track = #F2F2F2, progress = #666666
    const trackColor = customTrackColor ?? colors.carbonSecondaryDivider ?? '#F2F2F2';
    const progressColor = customProgressColor ?? colors.carbon500 ?? '#666666';

    // State calculations
    const isIndeterminate = state === 'indeterminate';
    const clampedProgress = Math.max(0, Math.min(progress, 1));

    return {
      containerSize,
      strokeWidth,
      radius,
      center,
      trackColor,
      progressColor,
      duration,
      isIndeterminate,
      clampedProgress,
    };
  }, [size, state, progress, customTrackColor, customProgressColor, duration, colors]);
}
