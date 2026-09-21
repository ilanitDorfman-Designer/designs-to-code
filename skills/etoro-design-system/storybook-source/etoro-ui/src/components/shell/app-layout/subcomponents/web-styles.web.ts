import type { ViewStyle } from 'react-native';

/**
 * Figma: the closed rail is `overlayBottom` (95% alpha) with a 3px backdrop
 * blur. RNW passes unrecognized style props through to CSS; the `-webkit-`
 * prefix covers Safari. Where the passthrough is unsupported, the 95%-alpha
 * fill makes the no-blur fallback visually acceptable.
 */
export function getRailBlurStyle(): ViewStyle {
  return {
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  } as unknown as ViewStyle;
}
