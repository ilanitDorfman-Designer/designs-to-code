import { Platform, StyleSheet } from 'react-native';

/**
 * Builds the glass-FAB styles for a given diameter. Kept as a factory so the
 * circle scales with the `size` prop while staying a perfect circle
 * (`borderRadius = size / 2`).
 */
export const createGlassFabStyles = (size: number, fallbackBackgroundColor: string) =>
  StyleSheet.create({
    glass: {
      width: size,
      height: size,
      borderRadius: size / 2,
      // Android: lift the FAB off the page with a native elevation shadow (framework-drawn,
      // no per-frame cost). iOS gets depth from the native glass material instead.
      ...Platform.select({ android: { elevation: 3 } }),
    },
    /**
     * Keep blur clipping only on non-liquid-glass fallback rendering.
     * Native glass needs unclipped bounds so the highlight/elevation can breathe.
     */
    fallbackClip: {
      overflow: 'hidden',
      backgroundColor: fallbackBackgroundColor,
    },
    /**
     * Layered above the blur so non-liquid-glass platforms use the primary Carbon
     * surface instead of letting busy text/images bleed through the FAB.
     */
    fallbackScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: fallbackBackgroundColor,
    },
    pressable: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
