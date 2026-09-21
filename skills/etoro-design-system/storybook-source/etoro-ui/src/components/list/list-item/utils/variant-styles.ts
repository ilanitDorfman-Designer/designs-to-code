export type VariantType = 'default' | 'compact' | 'comfortable' | 'spacious';

/**
 * Gets padding and sizing styles based on layout variant
 */
export function getVariantStyles(variant: VariantType = 'default') {
  switch (variant) {
    case 'compact':
      return {
        paddingVertical: 8,
        paddingHorizontal: 12,
        minHeight: 40,
      };
    case 'comfortable':
      return {
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 48,
      };
    case 'spacious':
      return {
        paddingVertical: 20,
        paddingHorizontal: 20,
        minHeight: 64,
      };
    default: // 'default'
      return {
        paddingVertical: 16,
        paddingHorizontal: 16,
        minHeight: 56,
      };
  }
}
