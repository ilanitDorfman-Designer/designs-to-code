/** Regex to validate hex color (3 or 6 characters) */
const HEX_COLOR_REGEX = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;

/** Fallback background color when extraction fails */
export const FALLBACK_BACKGROUND_COLOR = '#E0E0E0';

/**
 * Extract and validate background color from logoUrl
 *
 * This function searches for a valid hex color in the URL segments separated by underscores.
 * It's designed to work with URLs like:
 * - "https://example.com/1111_E82127_F7F7F7.svg" -> "#E82127"
 * - "path/to/asset_ABC123.png" -> "#ABC123"
 *
 * @param logoUrl - The URL containing color information
 * @param useFallback - Whether to return a fallback color or undefined when extraction fails
 * @returns A valid hex color string (with #) or fallback/undefined if invalid
 *
 * @example
 * ```ts
 * extractBackgroundColor("https://example.com/1111_E82127_F7F7F7.svg", true)
 * // Returns: "#E82127"
 *
 * extractBackgroundColor("https://example.com/no-color.svg", false)
 * // Returns: undefined
 * ```
 */
export function extractBackgroundColor(logoUrl: string, useFallback?: boolean): string | undefined {
  if (!logoUrl || typeof logoUrl !== 'string') {
    return useFallback !== false ? FALLBACK_BACKGROUND_COLOR : undefined;
  }

  // Extract potential color segment after underscore
  if (!logoUrl.includes('_')) {
    return useFallback !== false ? FALLBACK_BACKGROUND_COLOR : undefined;
  }

  const segments = logoUrl.split('_');

  // Try to find a valid hex color in the segments (skip the first segment which is usually the path/id)
  for (let i = 1; i < segments.length; i++) {
    let colorSegment = segments[i] || '';

    // Remove file extension if present (e.g., ".svg", ".png")
    colorSegment = colorSegment.replace(/\.(svg|png|jpg|jpeg|gif|webp)$/i, '');

    // Normalize: remove leading # if present
    colorSegment = colorSegment.replace(/^#/, '');

    // Validate it's a proper hex color (3 or 6 chars)
    if (HEX_COLOR_REGEX.test(colorSegment)) {
      return `#${colorSegment}`;
    }
  }

  // Invalid or missing color
  return useFallback !== false ? FALLBACK_BACKGROUND_COLOR : undefined;
}
