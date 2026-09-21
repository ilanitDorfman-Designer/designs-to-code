import { X2, X3 } from '../../../../core/styles/spacing';

export interface SizeConfiguration {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  fontSize: number;
  borderRadius: number;
  minWidth: number;
}

/**
 * Size configurations for different toggle sizes.
 * Note: Only spacing properties (paddingVertical) use spacing tokens.
 * Component dimensions (height, fontSize, borderRadius, minWidth) use explicit pixel values.
 */
export const SIZE_CONFIGS: Record<'small' | 'large', SizeConfiguration> = {
  small: {
    height: 36,
    paddingHorizontal: 0,
    paddingVertical: X2, // 8 - spacing token for padding
    fontSize: 14,
    borderRadius: 18, // Half of height for pill shape
    minWidth: 44,
  },
  large: {
    height: 48,
    paddingHorizontal: 0,
    paddingVertical: X3, // 12 - spacing token for padding
    fontSize: 16,
    borderRadius: 24, // Half of height for pill shape
    minWidth: 60,
  },
};

/**
 * Get size configuration for a given size
 */
export function getSizeConfig(size: 'small' | 'large'): SizeConfiguration {
  return SIZE_CONFIGS[size];
}
