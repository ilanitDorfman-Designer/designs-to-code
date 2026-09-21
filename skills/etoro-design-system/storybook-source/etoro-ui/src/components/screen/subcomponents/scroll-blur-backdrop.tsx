import { memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { EtProgressivePageBlur } from './progressive-page-blur';

const DEFAULT_SCROLL_THRESHOLD = 0;
const DEFAULT_BLUR_SCROLL_RANGE = 120;
const DEFAULT_GRADIENT_OVERFLOW = 60;
const DEFAULT_MAX_BLUR_INTENSITY = 50;

export interface EtScrollBlurBackdropProps {
  /**
   * Scroll position (in px) that drives the blur fade-in. Read on the UI thread inside worklets,
   * so it never triggers a React re-render per frame. Source it from the screen's scroll handlers
   * (e.g. `useScreenContext().scrollY` on `EtScreenV2`) or any scroll-owned shared value.
   */
  scrollY: SharedValue<number>;
  /** Scroll offset (px) before the blur starts ramping in. Default `0`. */
  scrollThreshold?: number;
  /** Scroll distance (px) over which the blur ramps from none → full. Default `120`. */
  blurScrollRange?: number;
  /** How far (px) the blurred band extends below the topbar area. Larger → taller blur. Default `60`. */
  gradientOverflow?: number;
  /** Peak `BlurView` intensity reached at the end of the scroll range. Default `50`. */
  maxBlurIntensity?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Progressive top blur backdrop driven by scroll position.
 *
 * As the user scrolls, the band pinned to the physical screen top fades in and its blur intensity
 * ramps up, masked so it dissolves into the content below. Shared by the home and market screens —
 * each supplies its own `scrollY` and (optionally) tunes the ramp/height. Render it above the
 * scrolled body but below the topbar (e.g. inside `EtScreenOverlay` or alongside a topbar overlay);
 * it is `pointerEvents="none"` so taps pass through.
 *
 * Stacking: this component intentionally does NOT set a `zIndex`. It relies on render order — place
 * it before the siblings that must sit on top of it (compact header, summary, topbar actions). That
 * keeps it below the topbar as the contract promises and avoids it washing over chrome that lacks an
 * explicit `zIndex`. If a screen needs a specific layer, pass one via the `style` prop.
 */
function EtScrollBlurBackdropComponent({
  scrollY,
  scrollThreshold = DEFAULT_SCROLL_THRESHOLD,
  blurScrollRange = DEFAULT_BLUR_SCROLL_RANGE,
  gradientOverflow = DEFAULT_GRADIENT_OVERFLOW,
  maxBlurIntensity = DEFAULT_MAX_BLUR_INTENSITY,
  style,
}: EtScrollBlurBackdropProps) {
  return (
    <EtProgressivePageBlur
      edge="top"
      scrollY={scrollY}
      scrollThreshold={scrollThreshold}
      blurScrollRange={blurScrollRange}
      height={60 + gradientOverflow}
      maxBlurIntensity={maxBlurIntensity}
      style={style}
    />
  );
}

export const EtScrollBlurBackdrop = memo(EtScrollBlurBackdropComponent);
EtScrollBlurBackdrop.displayName = 'EtScrollBlurBackdrop';
