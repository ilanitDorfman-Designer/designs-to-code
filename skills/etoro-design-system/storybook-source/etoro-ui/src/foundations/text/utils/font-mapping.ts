import { TextStyle } from 'react-native';

// Font weight mapping for cleaner code
export const FONT_WEIGHTS = {
  light: 'eToro-Light',
  regular: 'eToro-Regular',
  medium: 'eToro-Medium',
  semiBold: 'eToro-Semibold',
  bold: 'eToro-Bold',
  extraBold: 'eToro-Extrabold',
} as const;

// Size variants with predefined font sizes
export const TEXT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export type FontWeightKey = keyof typeof FONT_WEIGHTS;
export type TextSizeKey = keyof typeof TEXT_SIZES;

/**
 * Gets the actual font family string for a given weight
 */
export function getFontFamily(weight: FontWeightKey = 'regular'): string {
  return FONT_WEIGHTS[weight];
}

/**
 * Gets the actual font size number for a given size variant or custom size
 */
export function getFontSize(size: TextSizeKey | number = 'base'): number {
  return typeof size === 'number' ? size : (TEXT_SIZES[size] ?? TEXT_SIZES.base);
}

/**
 * Converts numeric fontWeight to FontWeightKey
 * React Native fontWeight values: 100-900
 */
export function fontWeightToKey(fontWeight?: TextStyle['fontWeight']): FontWeightKey {
  if (typeof fontWeight === 'string') {
    // Handle string values like 'normal', 'bold'
    if (fontWeight === 'bold' || fontWeight === '700') return 'bold';
    if (fontWeight === 'normal' || fontWeight === '400') return 'regular';
    return 'regular';
  }

  if (typeof fontWeight === 'number') {
    // Map numeric weights to our font keys
    if (fontWeight >= 800) return 'extraBold';
    if (fontWeight >= 700) return 'bold';
    if (fontWeight >= 600) return 'semiBold';
    if (fontWeight >= 500) return 'medium';
    if (fontWeight >= 300) return 'light';
    return 'regular';
  }

  return 'regular';
}
