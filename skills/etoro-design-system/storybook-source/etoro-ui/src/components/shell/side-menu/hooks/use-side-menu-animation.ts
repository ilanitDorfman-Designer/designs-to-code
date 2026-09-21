import { useEffect } from 'react';
import { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useLayoutDirection } from '../../../../core/hooks/use-layout-direction';
import type { UseSideMenuAnimationOptions, UseSideMenuAnimationResult } from '../api/types';
import {
  COLLAPSE_MS,
  EASE_ACCELERATE,
  EASE_DECELERATE,
  EXPAND_MS,
  HIDDEN_COLLAPSE_MS,
  HIDDEN_EXPAND_MS,
  PANEL_END_RADIUS,
  PANEL_WIDTH,
  REDUCED_MOTION_FADE_MS,
  STAGGER_STEP_MS,
} from '../constants';
import { useSideMenuConfig, useSideMenuState } from '../context';

// ========== Input windows (fractions of the EASED progress) ==========
// The fractions derive from the design sheet's ms values (ms ÷ duration), but
// they cut the progress AXIS, not the clock: `progress` runs through a bezier
// easing, so each window's wall-clock span differs from its ms provenance (the
// decelerate expand crosses early fractions sooner, the accelerate collapse
// later). Treat the ms numbers below as provenance, not timings — the shipped
// feel is what design approved in the browser.
// Direction-aware: expand windows are NOT the reversed collapse windows, so every
// worklet picks its window from `isExpanding` (set before the timing starts).

/** Surface width/radius (sheet: expand geometry at 260 of 280; collapse spans the full duration). */
const EXPAND_GEOMETRY_WINDOW = [0, 260 / EXPAND_MS] as const;
const COLLAPSE_GEOMETRY_WINDOW = [0, 1] as const;
/** Rail layer/icons (sheet: fade out over the first 80 of expand; fade back in over 80–200 of collapse). */
const RAIL_EXPAND_WINDOW = [0, 80 / EXPAND_MS] as const;
const RAIL_COLLAPSE_WINDOW = [0, 0.6] as const;
/**
 * Collapse: ALL panel content fades together over the sheet's FIRST 100 of 200
 * — no stagger. Under a linear read progress runs 1 → 0.5 there, so the input
 * window is the UPPER half: opacity interpolates 1 → 0 across p ∈ [1, 0.5]
 * and clamps at 0 below it.
 */
const COLLAPSE_CONTENT_WINDOW = [0.5, 1] as const;
/** Expand: primary row i (0–4) reveal window (sheet: (60+12i)…(220+12i) of 280). */
const EXPAND_ROW_WINDOWS = [
  [60 / EXPAND_MS, 220 / EXPAND_MS],
  [(60 + STAGGER_STEP_MS) / EXPAND_MS, (220 + STAGGER_STEP_MS) / EXPAND_MS],
  [(60 + 2 * STAGGER_STEP_MS) / EXPAND_MS, (220 + 2 * STAGGER_STEP_MS) / EXPAND_MS],
  [(60 + 3 * STAGGER_STEP_MS) / EXPAND_MS, (220 + 3 * STAGGER_STEP_MS) / EXPAND_MS],
  [(60 + 4 * STAGGER_STEP_MS) / EXPAND_MS, (220 + 4 * STAGGER_STEP_MS) / EXPAND_MS],
] as const;
/** Expand: header row + profile block (grouped opacity, no per-row stagger). */
export const HEADER_PROFILE_EXPAND_WINDOW = [0.21, 0.79] as const;
/** Expand: the whole secondary ("More") block. */
export const SECONDARY_BLOCK_EXPAND_WINDOW = [0.25, 0.83] as const;

/** Horizontal drift distance of crossfading content (signed by layout direction). */
const LAYER_DRIFT_PX = 8;

type ProgressWindow = readonly [number, number];

const useDirSign = (): number => (useLayoutDirection() === 'rtl' ? -1 : 1);

/**
 * The single animation driver, owned by the root. One `progress` SharedValue
 * (0 rail … 1 panel) with the design's asymmetric timings; everything else derives from
 * it in worklets. Reduced motion snaps geometry and drives an 80 ms opacity
 * crossfade instead. NEVER add `entering`/`exiting` animations here or in any
 * consumer — style-driven only (split-layout crash vector).
 */
export function useSideMenuAnimation({ expanded, tier, reducedMotion }: UseSideMenuAnimationOptions): UseSideMenuAnimationResult {
  const progress = useSharedValue(expanded ? 1 : 0);
  const crossfade = useSharedValue(expanded ? 1 : 0);
  const isExpanding = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    // Set BEFORE starting the timing — worklets pick their windows by it.
    isExpanding.set(expanded ? 1 : 0);
    if (reducedMotion) {
      // Geometry snaps; the crossfade SharedValue provides the single 80 ms opacity swap.
      progress.set(expanded ? 1 : 0);
      crossfade.set(withTiming(expanded ? 1 : 0, { duration: REDUCED_MOTION_FADE_MS, easing: Easing.linear }));
      return;
    }
    crossfade.set(expanded ? 1 : 0);
    const hidden = tier === -1;
    progress.set(
      withTiming(
        expanded ? 1 : 0,
        expanded
          ? { duration: hidden ? HIDDEN_EXPAND_MS : EXPAND_MS, easing: Easing.bezier(...EASE_DECELERATE) }
          : { duration: hidden ? HIDDEN_COLLAPSE_MS : COLLAPSE_MS, easing: Easing.bezier(...EASE_ACCELERATE) },
      ),
    );
  }, [expanded, tier, reducedMotion, progress, crossfade, isExpanding]);

  return { progress, crossfade, isExpanding };
}

/**
 * Root-level: animated surface width (railWidth ↔ 280) + logical END-corner radii (0 ↔ 32).
 * Under reduced motion `progress` snaps, so the interpolation is instantly correct — no branch.
 * While collapsed, a tier change moves `railWidth` with NO animation (progress stays 0) — by design.
 */
export function useSideMenuSurfaceStyle(animation: UseSideMenuAnimationResult, railWidth: number) {
  const { progress, isExpanding } = animation;
  return useAnimatedStyle(() => {
    const win: ProgressWindow = isExpanding.get() === 1 ? EXPAND_GEOMETRY_WINDOW : COLLAPSE_GEOMETRY_WINDOW;
    const p = progress.get();
    const radius = interpolate(p, win, [0, PANEL_END_RADIUS], Extrapolation.CLAMP);
    return {
      width: interpolate(p, win, [railWidth, PANEL_WIDTH], Extrapolation.CLAMP),
      // CSS-logical names, not RN-logical borderTopEndRadius/borderBottomEndRadius:
      // reanimated's web driver (_updatePropsJS → RNW createReactDOMStyle) drops the
      // RN-logical names, so animated radii silently render as 0 on web.
      borderStartEndRadius: radius,
      borderEndEndRadius: radius,
    };
  }, [progress, isExpanding, railWidth]);
}

/** Root-level: whole-rail-layer opacity (out early on expand, in late on collapse). */
export function useSideMenuRailLayerStyle(animation: UseSideMenuAnimationResult, reducedMotion: boolean) {
  const { progress, crossfade, isExpanding } = animation;
  return useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: 1 - crossfade.get() };
    }
    const win: ProgressWindow = isExpanding.get() === 1 ? RAIL_EXPAND_WINDOW : RAIL_COLLAPSE_WINDOW;
    return { opacity: interpolate(progress.get(), win, [1, 0], Extrapolation.CLAMP) };
  }, [progress, crossfade, isExpanding, reducedMotion]);
}

/** Rail-cell icon drift (0 → 8·dirSign) paired with the rail layer's fade window. */
export function useSideMenuRailDriftStyle() {
  const { progress, isExpanding } = useSideMenuState();
  const { reducedMotion } = useSideMenuConfig();
  const dirSign = useDirSign();
  return useAnimatedStyle(() => {
    if (reducedMotion) {
      return { transform: [{ translateX: 0 }] };
    }
    const win: ProgressWindow = isExpanding.get() === 1 ? RAIL_EXPAND_WINDOW : RAIL_COLLAPSE_WINDOW;
    return {
      transform: [{ translateX: dirSign * interpolate(progress.get(), win, [0, LAYER_DRIFT_PX], Extrapolation.CLAMP) }],
    };
  }, [progress, isExpanding, reducedMotion, dirSign]);
}

/**
 * Panel-content reveal. Expand uses the given window; collapse always uses the
 * shared no-stagger content window. `drift` adds the -8 → 0 translateX (signed
 * by direction); grouped blocks pass `drift: false` (opacity only).
 * Reduced motion: opacity = crossfade, no transform.
 */
function usePanelRevealStyle(expandWindow: ProgressWindow, drift: boolean) {
  const { progress, crossfade, isExpanding } = useSideMenuState();
  const { reducedMotion } = useSideMenuConfig();
  const dirSign = useDirSign();
  return useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: crossfade.get(), transform: [{ translateX: 0 }] };
    }
    const win: ProgressWindow = isExpanding.get() === 1 ? expandWindow : COLLAPSE_CONTENT_WINDOW;
    const p = progress.get();
    return {
      opacity: interpolate(p, win, [0, 1], Extrapolation.CLAMP),
      transform: [{ translateX: drift ? dirSign * interpolate(p, win, [-LAYER_DRIFT_PX, 0], Extrapolation.CLAMP) : 0 }],
    };
  }, [progress, crossfade, isExpanding, reducedMotion, dirSign, expandWindow, drift]);
}

/** Per-primary-row staggered reveal (indexes past 4 share the last window). */
export function useSideMenuRowStyle(staggerIndex: number) {
  const clamped = Math.max(0, Math.min(staggerIndex, EXPAND_ROW_WINDOWS.length - 1));
  return usePanelRevealStyle(EXPAND_ROW_WINDOWS[clamped as 0 | 1 | 2 | 3 | 4], true);
}

/** Grouped-block reveal (header/profile/secondary) — opacity only. */
export function useSideMenuBlockRevealStyle(expandWindow: ProgressWindow) {
  return usePanelRevealStyle(expandWindow, false);
}
