// NATIVE TWIN: the advanced watchlist table renders the text variants body-tiny-regular, label-secondary-*, label-tertiary-semibold, num-s, num-xs and MAX_FONT_SIZE_MULTIPLIER natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/EtNativeTokens.swift (EtNativeTextVariant) + the dynamicTypeSize cap in AdvancedTableView.swift and
// apps/etoro-mobile/modules/advanced-table/android/.../EtNativeTokens.kt (EtNativeTextVariant) + the LocalDensity fontScale cap in AdvancedTableView.kt. A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import type { eToroTheme } from '../../../core/styles';
import type { FontWeightKey } from './font-mapping';

/** Upper bound for text scaling to avoid UI breakage on extreme accessibility font settings. */
export const MAX_FONT_SIZE_MULTIPLIER = 1.2; // Make sure that older folks who scale their phone font size don't completely break the app

/** Supported design-system text variant ids. */
export type TextVariant =
  // Display variants
  /** 32px, bold, lineHeight 40px, letterSpacing -0.25, default color `carbon900`. */
  | 'display-hero'
  /** 28px, bold, lineHeight 32px, letterSpacing -0.25, default color `carbon900`. */
  | 'display-main'
  /** 24px, bold, lineHeight 30px, letterSpacing -0.25, default color `textPrimaryNeutral`. */
  | 'display-compact'
  // Heading variants
  /** 22px, semiBold, lineHeight 28px, letterSpacing -0.25, default color `carbon900`. */
  | 'heading-large'
  /** 20px, semiBold, lineHeight 26px, letterSpacing -0.25, default color `carbon500`. */
  | 'heading-base'
  /** 18px, medium, lineHeight 24px, letterSpacing 0, default color `carbon500`. */
  | 'heading-compact'
  // Body variants
  /** 16px, regular, lineHeight 22px, letterSpacing 0, default color `carbon500`. */
  | 'body-base-regular'
  /** 16px, medium, lineHeight 22px, letterSpacing 0, default color `carbon500`. */
  | 'body-base-medium'
  /** 16px, semiBold, lineHeight 22px, letterSpacing 0, default color `carbon500`. */
  | 'body-base-semibold'
  /** 14px, regular, lineHeight 18px, letterSpacing 0, default color `carbon500`. */
  | 'body-secondary-regular'
  /** 14px, medium, lineHeight 18px, letterSpacing 0, default color `carbon500`. */
  | 'body-secondary-medium'
  /** 14px, semiBold, lineHeight 18px, letterSpacing 0, default color `carbon500`. */
  | 'body-secondary-semibold'
  /** 12px, regular, lineHeight 16px, letterSpacing 0, default color `carbon400`. */
  | 'body-tiny-regular'
  /** 12px, medium, lineHeight 16px, letterSpacing 0, default color `carbon400`. */
  | 'body-tiny-medium'
  // Label variants
  /** 16px, regular, lineHeight 24px, letterSpacing 0, default color `carbon500`. */
  | 'label-primary-regular'
  /** 16px, semiBold, lineHeight 24px, letterSpacing 0, default color `carbon500`. */
  | 'label-primary-semibold'
  /** 16px, bold, lineHeight 24px, letterSpacing 0, default color `carbon500`. */
  | 'label-primary-bold'
  /** 14px, regular, lineHeight 20px, letterSpacing 0.15, default color `carbon500`. */
  | 'label-secondary-regular'
  /** 14px, semiBold, lineHeight 20px, letterSpacing 0.15, default color `carbon500`. */
  | 'label-secondary-semibold'
  /** 14px, bold, lineHeight 20px, letterSpacing 0.15, default color `carbon500`. */
  | 'label-secondary-bold'
  /** 12px, regular, lineHeight 20px, letterSpacing 0.25, default color `carbon400`. */
  | 'label-tertiary-regular'
  /** 12px, semiBold, lineHeight 24px, letterSpacing 0.25, default color `carbon400`. */
  | 'label-tertiary-semibold'
  /** 12px, bold, lineHeight 24px, letterSpacing 0.25, default color `carbon400`. */
  | 'label-tertiary-bold'
  // Caption variants
  /** 10px, regular, lineHeight 14px, letterSpacing 0.25, default color `carbon400`. */
  | 'caption-regular'
  /** 10px, medium, lineHeight 14px, letterSpacing 0.25, default color `carbon400`. */
  | 'caption-medium'
  // Number variants
  /** 40px, bold, lineHeight 48px, letterSpacing -0.25, default color `carbon900`. */
  | 'num-xxl'
  /** 32px, bold, lineHeight 38px, letterSpacing -0.25, default color `carbon900`. */
  | 'num-xl'
  /** 32px, medium, lineHeight 38px, letterSpacing -0.25, default color `carbon900`. */
  | 'num-xl-medium'
  /** 24px, semiBold, lineHeight 30px, letterSpacing -0.1, default color `carbon900`. */
  | 'num-l'
  /** 24px, medium, lineHeight 30px, letterSpacing -0.1, default color `carbon900`. */
  | 'num-l-medium'
  /** 20px, semiBold, lineHeight 26px, letterSpacing -0.1, default color `carbon900`. */
  | 'num-ml'
  /** 20px, medium, lineHeight 26px, letterSpacing -0.1, default color `carbon900`. */
  | 'num-ml-medium'
  /** 18px, medium, lineHeight 24px, letterSpacing 0, default color `carbon900`. */
  | 'num-md'
  /** 16px, medium, lineHeight 22px, letterSpacing 0.05, default color `carbon900`. */
  | 'num-sm'
  /** 14px, regular, lineHeight 20px, letterSpacing 0.1, default color `carbon900`. */
  | 'num-s'
  /** 14px, medium, lineHeight 20px, letterSpacing 0.1, default color `carbon900`. */
  | 'num-s-medium'
  /** 12px, regular, lineHeight 18px, letterSpacing 0.2, default color `carbon900`. */
  | 'num-xs'
  /** 12px, medium, lineHeight 18px, letterSpacing 0.2, default color `carbon900`. */
  | 'num-xs-medium'
  /** 10px, regular, lineHeight 14px, letterSpacing 0.35, default color `carbon900`. */
  | 'num-xxs'
  /** 10px, medium, lineHeight 14px, letterSpacing 0.35, default color `carbon900`. */
  | 'num-xxs-medium';

/** Typography config for a given {@link TextVariant}. */
export interface VariantConfig {
  size: number;
  weight: FontWeightKey;
  colorKey: keyof eToroTheme['colors'];
  lineHeight: number;
  letterSpacing: number;
}

/**
 * Maps text variants to their typography configuration
 * Based on the design system typography guide
 */
export const VARIANT_CONFIG: Record<TextVariant, VariantConfig> = {
  // Display variants
  'display-hero': {
    size: 32,
    weight: 'bold',
    colorKey: 'carbon900',
    lineHeight: 40,
    letterSpacing: -0.25,
  },
  'display-main': {
    size: 28,
    weight: 'bold',
    colorKey: 'carbon900',
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  'display-compact': {
    size: 24,
    weight: 'bold',
    colorKey: 'textPrimaryNeutral',
    lineHeight: 30,
    letterSpacing: -0.25,
  },
  // Heading variants
  'heading-large': {
    size: 22,
    weight: 'semiBold',
    colorKey: 'carbon900',
    lineHeight: 28,
    letterSpacing: -0.25,
  },
  'heading-base': {
    size: 20,
    weight: 'semiBold',
    colorKey: 'carbon500',
    lineHeight: 26,
    letterSpacing: -0.25,
  },
  'heading-compact': {
    size: 18,
    weight: 'medium',
    colorKey: 'carbon500',
    lineHeight: 24,
    letterSpacing: 0,
  },
  // Body variants
  'body-base-regular': {
    size: 16,
    weight: 'regular',
    colorKey: 'carbon500',
    lineHeight: 22,
    letterSpacing: 0,
  },
  'body-base-medium': {
    size: 16,
    weight: 'medium',
    colorKey: 'carbon500',
    lineHeight: 22,
    letterSpacing: 0,
  },
  'body-base-semibold': {
    size: 16,
    weight: 'semiBold',
    colorKey: 'carbon500',
    lineHeight: 22,
    letterSpacing: 0,
  },
  'body-secondary-regular': {
    size: 14,
    weight: 'regular',
    colorKey: 'carbon500',
    lineHeight: 18,
    letterSpacing: 0,
  },
  'body-secondary-medium': {
    size: 14,
    weight: 'medium',
    colorKey: 'carbon500',
    lineHeight: 18,
    letterSpacing: 0,
  },
  'body-secondary-semibold': {
    size: 14,
    weight: 'semiBold',
    colorKey: 'carbon500',
    lineHeight: 18,
    letterSpacing: 0,
  },
  'body-tiny-regular': {
    size: 12,
    weight: 'regular',
    colorKey: 'carbon400',
    lineHeight: 16,
    letterSpacing: 0,
  },
  'body-tiny-medium': {
    size: 12,
    weight: 'medium',
    colorKey: 'carbon400',
    lineHeight: 16,
    letterSpacing: 0,
  },
  // Label variants
  'label-primary-regular': {
    size: 16,
    weight: 'regular',
    colorKey: 'carbon500',
    lineHeight: 24,
    letterSpacing: 0,
  },
  'label-primary-semibold': {
    size: 16,
    weight: 'semiBold',
    colorKey: 'carbon500',
    lineHeight: 24,
    letterSpacing: 0,
  },
  'label-primary-bold': {
    size: 16,
    weight: 'bold',
    colorKey: 'carbon500',
    lineHeight: 24,
    letterSpacing: 0,
  },
  'label-secondary-regular': {
    size: 14,
    weight: 'regular',
    colorKey: 'carbon500',
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  'label-secondary-semibold': {
    size: 14,
    weight: 'semiBold',
    colorKey: 'carbon500',
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  'label-secondary-bold': {
    size: 14,
    weight: 'bold',
    colorKey: 'carbon500',
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  'label-tertiary-regular': {
    size: 12,
    weight: 'regular',
    colorKey: 'carbon400',
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  'label-tertiary-semibold': {
    size: 12,
    weight: 'semiBold',
    colorKey: 'carbon400',
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  'label-tertiary-bold': {
    size: 12,
    weight: 'bold',
    colorKey: 'carbon400',
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  // Caption variants
  'caption-regular': {
    size: 10,
    weight: 'regular',
    colorKey: 'carbon400',
    lineHeight: 14,
    letterSpacing: 0.25,
  },
  'caption-medium': {
    size: 10,
    weight: 'medium',
    colorKey: 'carbon400',
    lineHeight: 14,
    letterSpacing: 0.25,
  },
  // Number variants
  'num-xxl': {
    size: 40,
    weight: 'bold',
    colorKey: 'carbon900',
    lineHeight: 48,
    letterSpacing: -0.25,
  },

  'num-xl': {
    size: 32,
    weight: 'bold',
    colorKey: 'carbon900',
    lineHeight: 38,
    letterSpacing: -0.25,
  },
  /** Num XL — medium weight (e.g. phone OTP size m) */
  'num-xl-medium': {
    size: 32,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 38,
    letterSpacing: -0.25,
  },

  'num-l': {
    size: 24,
    weight: 'semiBold',
    colorKey: 'carbon900',
    lineHeight: 30,
    letterSpacing: -0.1,
  },
  /** Num L — medium weight (e.g. phone OTP size s) */
  'num-l-medium': {
    size: 24,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 30,
    letterSpacing: -0.1,
  },
  'num-ml': {
    size: 20,
    weight: 'semiBold',
    colorKey: 'carbon900',
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  /** Num ML — medium weight (e.g. phone OTP size xs) */
  'num-ml-medium': {
    size: 20,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  'num-md': {
    size: 18,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 24,
    letterSpacing: 0,
  },
  'num-sm': {
    size: 16,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 22,
    letterSpacing: 0.05,
  },
  'num-s': {
    size: 14,
    weight: 'regular',
    colorKey: 'carbon900',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  /** Num S — medium weight (Figma Num S/Medium: 14px / 500 / 20px) */
  'num-s-medium': {
    size: 14,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  'num-xs': {
    size: 12,
    weight: 'regular',
    colorKey: 'carbon900',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  /** Num XS — medium weight (12px / 500 / 18px) */
  'num-xs-medium': {
    size: 12,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  'num-xxs': {
    size: 10,
    weight: 'regular',
    colorKey: 'carbon900',
    lineHeight: 14,
    letterSpacing: 0.35,
  },
  /** Num XXS — medium weight (10px / 500 / 14px) */
  'num-xxs-medium': {
    size: 10,
    weight: 'medium',
    colorKey: 'carbon900',
    lineHeight: 14,
    letterSpacing: 0.35,
  },
};

/**
 * Gets the variant configuration for a given variant
 */
export function getVariantConfig(variant: TextVariant): VariantConfig {
  return VARIANT_CONFIG[variant];
}
