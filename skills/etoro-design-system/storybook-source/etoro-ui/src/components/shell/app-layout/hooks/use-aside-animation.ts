import { useEffect, useRef } from 'react';
import { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { UseAsideAnimationOptions, UseAsideAnimationResult } from '../api/types';
import {
  COLLAPSE_MS,
  EASE_ACCELERATE,
  EASE_DECELERATE,
  EXPAND_MS,
  HOVER_IN_MS,
  HOVER_OUT_MS,
  RAIL_HOVER_WIDTH,
  RAIL_WIDTH,
  REDUCED_MOTION_FADE_MS,
  TOGGLE_OPEN_END,
  TOGGLE_OPEN_TOP,
  TOGGLE_RAIL_END,
  TOGGLE_SIZE,
} from '../constants';

// ========== Input windows (fractions of the EASED progress) ==========
// The fractions derive from the design sheet's ms values (ms ÷ duration), but
// they cut the progress AXIS, not the clock — wall-clock spans differ under
// the bezier easing. Ms numbers are provenance, not timings (full note in
// `use-side-menu-animation.ts`).
// Direction-aware (side-menu precedent): expand windows are NOT the reversed
// collapse windows, so worklets pick their window from `isExpanding`.

/** Rail layer (sheet: fades out over the first 80 of expand; back in over 80–200 of collapse). */
const RAIL_EXPAND_WINDOW = [0, 80 / EXPAND_MS] as const;
const RAIL_COLLAPSE_WINDOW = [0, 0.6] as const;
/** Panel layer (sheet: reveals over 60–220 of expand; fully out within the first 100 of collapse). */
const PANEL_EXPAND_WINDOW = [60 / EXPAND_MS, 220 / EXPAND_MS] as const;
const PANEL_COLLAPSE_WINDOW = [0.5, 1] as const;

/** Horizontal drift of the crossfading panel content (signed by layout direction). */
const LAYER_DRIFT_PX = 8;

type ProgressWindow = readonly [number, number];

/**
 * The aside's single animation driver — one `progress` SharedValue (0 rail …
 * 1 panel) on the left-menu curves; everything else derives from it in
 * worklets. Button/rail-driven changes animate; breakpoint-driven changes
 * SNAP: a 1440 crossing sets `progress` directly, and the shell's state reset
 * (`expanded := isInline`, one commit later) is flagged here so it snaps too —
 * one paint, never a reflow-then-animated-close sequence. Reduced motion snaps
 * geometry and drives an 80 ms opacity crossfade instead. NEVER add
 * `entering`/`exiting` animations here or in any consumer — style-driven only.
 */
export function useAsideAnimation({ expanded, isInline, railHovered, reducedMotion }: UseAsideAnimationOptions): UseAsideAnimationResult {
  const progress = useSharedValue(expanded ? 1 : 0);
  const crossfade = useSharedValue(expanded ? 1 : 0);
  const isExpanding = useSharedValue(expanded ? 1 : 0);
  const hoverWidth = useSharedValue(RAIL_WIDTH);
  const surfaceHeight = useSharedValue(0);

  const prevExpanded = useRef(expanded);
  const prevInline = useRef(isInline);
  const breakpointResetPending = useRef(false);

  useEffect(() => {
    const expandedChanged = prevExpanded.current !== expanded;
    const inlineChanged = prevInline.current !== isInline;
    prevExpanded.current = expanded;
    prevInline.current = isInline;

    const snap = () => {
      isExpanding.set(expanded ? 1 : 0);
      progress.set(expanded ? 1 : 0);
      crossfade.set(expanded ? 1 : 0);
    };

    if (inlineChanged) {
      breakpointResetPending.current = expanded !== isInline;
      snap();
      return;
    }
    if (!expandedChanged) {
      return;
    }
    if (breakpointResetPending.current) {
      breakpointResetPending.current = false;
      snap();
      return;
    }
    // Set BEFORE starting the timing — worklets pick their windows by it.
    isExpanding.set(expanded ? 1 : 0);
    if (reducedMotion) {
      progress.set(expanded ? 1 : 0);
      crossfade.set(withTiming(expanded ? 1 : 0, { duration: REDUCED_MOTION_FADE_MS, easing: Easing.linear }));
      return;
    }
    crossfade.set(expanded ? 1 : 0);
    progress.set(
      withTiming(
        expanded ? 1 : 0,
        expanded
          ? { duration: EXPAND_MS, easing: Easing.bezier(...EASE_DECELERATE) }
          : { duration: COLLAPSE_MS, easing: Easing.bezier(...EASE_ACCELERATE) },
      ),
    );
  }, [expanded, isInline, reducedMotion, progress, crossfade, isExpanding]);

  useEffect(() => {
    const target = railHovered ? RAIL_HOVER_WIDTH : RAIL_WIDTH;
    if (reducedMotion) {
      hoverWidth.set(target);
      return;
    }
    hoverWidth.set(withTiming(target, { duration: railHovered ? HOVER_IN_MS : HOVER_OUT_MS, easing: Easing.linear }));
  }, [railHovered, reducedMotion, hoverWidth]);

  return { progress, crossfade, isExpanding, hoverWidth, surfaceHeight };
}

/**
 * In-flow placeholder width: rail-width in overlay mode (the surface floats,
 * main never reflows); in inline mode it follows the open/close curve so main
 * reflows responsively through the transition. Tier width changes and
 * breakpoint-driven resets land as snaps because `progress` snaps.
 */
export function useAsidePlaceholderStyle(animation: UseAsideAnimationResult, isInline: boolean, suppressed: boolean, panelWidth: number) {
  const { progress } = animation;
  return useAnimatedStyle(() => {
    if (suppressed) {
      return { width: 0 };
    }
    if (!isInline) {
      return { width: RAIL_WIDTH };
    }
    return { width: interpolate(progress.get(), [0, 1], [RAIL_WIDTH, panelWidth], Extrapolation.CLAMP) };
  }, [progress, isInline, suppressed, panelWidth]);
}

/** Animated surface width: (hovering ? 68 : 60) rail ↔ tier panel width, end-anchored. */
export function useAsideSurfaceStyle(animation: UseAsideAnimationResult, panelWidth: number) {
  const { progress, hoverWidth } = animation;
  return useAnimatedStyle(() => {
    return { width: interpolate(progress.get(), [0, 1], [hoverWidth.get(), panelWidth], Extrapolation.CLAMP) };
  }, [progress, hoverWidth, panelWidth]);
}

/** Rail-layer opacity (out early on expand, in late on collapse). */
export function useAsideRailLayerStyle(animation: UseAsideAnimationResult, reducedMotion: boolean) {
  const { progress, crossfade, isExpanding } = animation;
  return useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: 1 - crossfade.get() };
    }
    const win: ProgressWindow = isExpanding.get() === 1 ? RAIL_EXPAND_WINDOW : RAIL_COLLAPSE_WINDOW;
    return { opacity: interpolate(progress.get(), win, [1, 0], Extrapolation.CLAMP) };
  }, [progress, crossfade, isExpanding, reducedMotion]);
}

/** Panel-layer opacity + drift (8px from the panel's growth direction, signed by layout direction). */
export function useAsidePanelLayerStyle(animation: UseAsideAnimationResult, reducedMotion: boolean, dirSign: number) {
  const { progress, crossfade, isExpanding } = animation;
  return useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: crossfade.get(), transform: [{ translateX: 0 }] };
    }
    const win: ProgressWindow = isExpanding.get() === 1 ? PANEL_EXPAND_WINDOW : PANEL_COLLAPSE_WINDOW;
    const p = progress.get();
    return {
      opacity: interpolate(p, win, [0, 1], Extrapolation.CLAMP),
      transform: [{ translateX: dirSign * interpolate(p, win, [LAYER_DRIFT_PX, 0], Extrapolation.CLAMP) }],
    };
  }, [progress, crossfade, isExpanding, reducedMotion, dirSign]);
}

/**
 * The persistent toggle's position: rail-center → panel top-end on `progress`.
 * Static anchor is the rail-centered spot (`top: 0`, `end: TOGGLE_RAIL_END`);
 * the interpolation moves it via physical transforms (signed by direction) —
 * animating logical inset props is unsafe under reanimated's web driver.
 * Under reduced motion `progress` snaps, so position and glyph snap — no branch.
 */
export function useAsideToggleStyle(animation: UseAsideAnimationResult, dirSign: number) {
  const { progress, surfaceHeight } = animation;
  return useAnimatedStyle(() => {
    const p = progress.get();
    // `onLayout` only reports the height AFTER the first paint, so a mount in
    // the closed state would otherwise center against 0 — a negative offset that
    // clips the toggle against the surface's top edge. Fall back to the open
    // anchor until measured (in bounds in both states; the open state needs no
    // measurement, so only the collapsed first frame ever sees the fallback).
    const height = surfaceHeight.get();
    const railCenterTop = height === 0 ? TOGGLE_OPEN_TOP : (height - TOGGLE_SIZE) / 2;
    return {
      transform: [
        { translateX: dirSign * interpolate(p, [0, 1], [0, TOGGLE_RAIL_END - TOGGLE_OPEN_END]) },
        { translateY: interpolate(p, [0, 1], [railCenterTop, TOGGLE_OPEN_TOP]) },
      ],
    };
  }, [progress, surfaceHeight, dirSign]);
}
