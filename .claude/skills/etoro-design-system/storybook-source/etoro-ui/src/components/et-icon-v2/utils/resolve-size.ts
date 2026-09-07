import { IconSize } from '../api/types';

const SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

const DEFAULT_SIZE = 20; // 'md'

/**
 * Resolves icon size from preset or custom number
 * @param size Size preset string or custom number
 * @returns Size in pixels
 */
export function resolveIconSize(size?: IconSize): number {
  if (size === undefined) {
    return DEFAULT_SIZE;
  }

  if (typeof size === 'number') {
    return size;
  }

  return SIZE_MAP[size] ?? DEFAULT_SIZE;
}
