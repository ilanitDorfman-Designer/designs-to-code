import { useCallback, useEffect, useState } from 'react';
import type { ViewProps } from 'react-native';
import { type AnimatedProps, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { X15 } from '../../../core/styles';
import { useScreenContext } from '../api/context';
import { useHideOnScroll } from './use-hide-on-scroll';

/** Default animated top padding reserved for the {@link CollapsibleHeaderModel} `renderTopNav` slot. */
export const DEFAULT_TOP_NAV_HEIGHT = X15;
/** Default cap for the animated filter row so collapse matches the fade. */
export const DEFAULT_FILTER_ROW_MAX_HEIGHT = 56;
/** Reveal animation duration. Kept below the shared toggle lock so a flip can't re-target mid-flight. */
const TIMING_DURATION_MS = 180;

/** Inputs for {@link useCollapsibleHeaderModel}. */
export interface UseCollapsibleHeaderModelOptions {
  /** When false, the header stays fully expanded and ignores scroll (e.g. item count below threshold). */
  enabled: boolean;
  /** When false, `bottomStyle` is unused (no filter row mounted). */
  hasFilters: boolean;
  /** When true, reserves animated top padding for the consumer's `renderTopNav` slot. */
  hasTopNavSlot: boolean;
  /** When true, keep the current reveal state stable and ignore scroll-driven visibility flips. */
  freezeScrollCollapse?: boolean;
  /** Animated top padding reserved for the top-nav slot. @default X15 */
  topNavHeight?: number;
  /** Max height the animated filter row collapses from. @default 56 */
  filterRowMaxHeight?: number;
}

/** Reanimated styles applied to the outer container, top slot, and filter row wrapper. */
export interface CollapsibleHeaderModel {
  containerStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
  topStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
  topPointerEvents: NonNullable<ViewProps['pointerEvents']>;
  bottomStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
}

/**
 * Scroll-linked reveal for a screen header: an optional padded top-nav slot, a persistent title row
 * the consumer renders itself, and a filter row that fades + collapses its height so freed space
 * returns to the list. Hide-on-scroll-down / show-on-scroll-up is derived locally on the UI thread
 * from smoothed scroll velocity, so sibling components never re-render React on scroll.
 *
 * Reads `scrollY` directly from the per-screen `EtScreenV2`/`EtScreen` context — the scrolling child
 * feeds it via `useScrollHandlers()`. Used by the watchlist and portfolio collapsible headers.
 */
export function useCollapsibleHeaderModel({
  enabled,
  hasFilters,
  hasTopNavSlot,
  freezeScrollCollapse = false,
  topNavHeight = DEFAULT_TOP_NAV_HEIGHT,
  filterRowMaxHeight = DEFAULT_FILTER_ROW_MAX_HEIGHT,
}: UseCollapsibleHeaderModelOptions): CollapsibleHeaderModel {
  const { scrollY, scrollBottomDistance } = useScreenContext();

  const enabledSV = useSharedValue(enabled);
  const hasFiltersSV = useSharedValue(hasFilters);
  const hasTopNavSlotSV = useSharedValue(hasTopNavSlot);

  useEffect(() => {
    enabledSV.value = enabled;
  }, [enabled, enabledSV]);

  useEffect(() => {
    hasFiltersSV.value = hasFilters;
  }, [hasFilters, hasFiltersSV]);

  useEffect(() => {
    hasTopNavSlotSV.value = hasTopNavSlot;
  }, [hasTopNavSlot, hasTopNavSlotSV]);

  // Shared hide-on-scroll signal — the same UI-thread velocity model the bottom tab bar uses, so
  // header and tab bar reveal/hide in lock-step on a single scroll.
  const isHeaderVisible = useHideOnScroll({ scrollY, scrollBottomDistance, enabled, freeze: freezeScrollCollapse });

  const headerRevealProgress = useSharedValue(1);
  const [topPointerEvents, setTopPointerEvents] = useState<NonNullable<ViewProps['pointerEvents']>>('box-none');

  const syncTopPointerEvents = useCallback((isInteractive: boolean) => {
    setTopPointerEvents(isInteractive ? 'box-none' : 'none');
  }, []);

  // The top nav is absolutely positioned over the title row (see consumer styles.top). Opacity-only
  // collapse leaves it touchable on Android, so taps on the collapsed nav still hit it. Mirror the
  // reveal progress into `pointerEvents` so the hidden nav stops intercepting touches.
  useAnimatedReaction(
    () => {
      if (!enabledSV.value) {
        return 1;
      }
      return headerRevealProgress.value > 0.01 ? 1 : 0;
    },
    (interactiveFlag, previous) => {
      if (interactiveFlag === previous) {
        return;
      }
      runOnJS(syncTopPointerEvents)(interactiveFlag === 1);
    },
  );

  // Combine visibility into a single 0..1 reveal driver. Only direction changes start timing;
  // tying target progress to every scrollY frame restarts the animation continuously and feels
  // sticky/janky on-device.
  useAnimatedReaction(
    () => (enabledSV.value ? (isHeaderVisible.value ? 1 : 0) : 1),
    (targetProgress, previousTargetProgress) => {
      if (targetProgress === previousTargetProgress) return;
      headerRevealProgress.value = withTiming(targetProgress, { duration: TIMING_DURATION_MS });
    },
  );

  const containerStyle = useAnimatedStyle(() => {
    const topPad = hasTopNavSlotSV.value ? topNavHeight : 0;
    if (!enabledSV.value) {
      return { paddingTop: topPad };
    }
    return {
      paddingTop: topPad * headerRevealProgress.value,
    };
  });

  const topStyle = useAnimatedStyle(() => {
    if (!enabledSV.value) return { opacity: 1 };
    return { opacity: headerRevealProgress.value };
  });

  const bottomStyle = useAnimatedStyle(() => {
    if (!hasFiltersSV.value) return {};
    if (!enabledSV.value) {
      return {
        opacity: 1,
        maxHeight: filterRowMaxHeight,
        overflow: 'hidden',
      };
    }
    const p = headerRevealProgress.value;
    return {
      opacity: p,
      maxHeight: filterRowMaxHeight * p,
      overflow: 'hidden',
    };
  });

  return { containerStyle, topStyle, topPointerEvents, bottomStyle };
}
