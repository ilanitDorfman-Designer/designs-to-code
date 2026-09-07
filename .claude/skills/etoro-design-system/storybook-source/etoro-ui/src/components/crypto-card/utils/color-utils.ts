/**
 * Extracts the primary hex color from an eToro CDN URL.
 *
 * CDN URL format:
 * https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F0AF32_F7F7F7.svg
 *                                                               ^^^^^^
 *                                                             Primary color
 *
 * @param url - The CDN URL containing color information
 * @returns Hex color string (with #), or null if parsing fails
 */
export function extractColorFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Extract the filename from the URL
  const parts = url.split('/');
  const filename = parts[parts.length - 1];

  if (!filename) {
    return null;
  }

  // Remove extension and split by underscore
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
  const segments = nameWithoutExtension.split('_');

  // We expect at least 2 segments: id, color
  if (segments.length < 2) {
    return null;
  }

  const color = segments[1];

  // Validate hex color (6 characters, alphanumeric)
  const hexRegex = /^[0-9A-Fa-f]{6}$/;

  if (!hexRegex.test(color)) {
    return null;
  }

  return `#${color}`;
}

/**
 * Returns a default color for fallback.
 */
export function getDefaultColor(): string {
  return '#1A1A2E';
}
