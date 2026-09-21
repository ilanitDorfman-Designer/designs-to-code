/**
 * Standard gap between icon and text/label
 */
const PREFIX_GAP = 6;

/**
 * Default icon size for prefix/suffix adornments
 * Used as fallback when size is not provided or is falsy (including 0)
 */
const DEFAULT_ICON_SIZE = 20;

/**
 * Calculate prefix width for label positioning
 * Formula: icon position (0) + icon size + gap (12) - label base position (0)
 * This ensures exactly 12px gap between icon and label/text
 */
export function calculatePrefixWidth(hasPrefix: boolean, prefixSize?: number): number {
  if (!hasPrefix) return 0;
  const iconSize = prefixSize || DEFAULT_ICON_SIZE;
  return iconSize + PREFIX_GAP;
}
