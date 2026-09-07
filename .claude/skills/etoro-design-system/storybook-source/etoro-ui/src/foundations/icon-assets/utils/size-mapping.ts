import { IconSize } from '../api/types';

// Standard size mappings for icons
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

// Default size for icons
export const DEFAULT_ICON_SIZE = 24;

/**
 * Get the actual pixel size for an icon size
 * @param size The icon size (predefined or number)
 * @returns The pixel size as a number
 */
export function getIconSize(size?: IconSize): number {
  if (typeof size === 'number') {
    return size;
  }

  if (size && size in ICON_SIZES) {
    return ICON_SIZES[size];
  }

  return DEFAULT_ICON_SIZE;
}

/**
 * Get the closest predefined size for a custom number
 * @param customSize Custom pixel size
 * @returns The closest predefined size key
 */
export function getClosestPresetSize(customSize: number): keyof typeof ICON_SIZES {
  const sizes = Object.entries(ICON_SIZES);
  let closest = sizes[0];
  let minDiff = Math.abs(customSize - closest[1]);

  for (const [key, value] of sizes) {
    const diff = Math.abs(customSize - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = [key, value];
    }
  }

  return closest[0] as keyof typeof ICON_SIZES;
}

/**
 * Validate if a size is within reasonable bounds
 * @param size The size to validate
 * @returns Whether the size is valid
 */
export function isValidIconSize(size: number): boolean {
  return size >= 8 && size <= 256; // Reasonable bounds for icon sizes
}
