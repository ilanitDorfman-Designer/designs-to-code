import React, { createContext, forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ViewProps } from 'react-native';
import { AnimatedProps, Extrapolation, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { GreenHalo } from '../../components/green-halo';
import { NeutralHalo } from '../../components/neutral-halo';

interface ScrollContextType {
  updateGlobalScroll: (value: number, options?: { isNearBottom?: boolean }) => void;
  setAnimateHalo: (shouldAnimate: boolean) => void;
  unregisterActiveScroll: () => void;
  setHaloOpacity: (opacity: number | null, duration?: number) => void;
  setSubHaloOpacity: (opacity: number | null, duration?: number) => void;
  setHaloLayerVisibility: (visibility: HaloLayerVisibilityOverride | null) => void;
  setHaloGlowColor: (color: string | null) => void;
  resetHaloOpacity: () => void;
  isHeaderVisible: SharedValue<boolean>;
  globalScrollY: SharedValue<number>;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

type HaloLayerVisibilityOverride = {
  hideNeutralHalo?: boolean;
  hideGreenHalo?: boolean;
};

// Resting opacity of the green halo at the top of a screen. Shared by the static
// and animated paths so enabling `animateHalo` on focus doesn't visibly dim the
// halo — both rest at the same value and the animated path fades to 0 on scroll.
const HALO_RESTING_OPACITY = 0.75;
// Resting opacity of the white/neutral sub-halo. Shared by the static and
// animated paths for the same reason, fading to 0 on scroll when animated.
const SUB_HALO_RESTING_OPACITY = 0.2;

type AnimatedHaloStyle = NonNullable<AnimatedProps<ViewProps>['style']>;

type HaloRendererHandle = {
  setGlowColor: (color: string | null) => void;
  setVisibility: (visibility: HaloLayerVisibilityOverride | null) => void;
};

interface HaloRendererProps {
  hideGreenHalo: boolean;
  hideNeutralHalo: boolean;
  animatedHaloOpacity: AnimatedHaloStyle;
  animatedSubHaloOpacity: AnimatedHaloStyle;
}

/**
 * Self-contained halo subtree. It owns the glow color + per-screen layer
 * visibility as local React state and exposes imperative setters through a ref.
 *
 * This isolation is deliberate: keeping this state out of `ScrollProvider` (which
 * renders `{children}`) means `setHaloGlowColor` / `setHaloLayerVisibility` only
 * re-render these two SVG layers, never the entire app tree below the provider.
 */
const HaloRenderer = forwardRef<HaloRendererHandle, HaloRendererProps>(function HaloRenderer(
  { hideGreenHalo, hideNeutralHalo, animatedHaloOpacity, animatedSubHaloOpacity },
  ref,
) {
  const [glowColor, setGlowColor] = useState<string>();
  const [visibility, setVisibility] = useState<HaloLayerVisibilityOverride | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setGlowColor: (color) => setGlowColor(color ?? undefined),
      setVisibility,
    }),
    [],
  );

  const effectiveHideGreenHalo = visibility?.hideGreenHalo ?? hideGreenHalo;
  const effectiveHideNeutralHalo = visibility?.hideNeutralHalo ?? hideNeutralHalo;

  return (
    <>
      {effectiveHideGreenHalo ? null : <GreenHalo animatedHaloOpacity={animatedHaloOpacity} />}
      {effectiveHideNeutralHalo ? null : <NeutralHalo animatedSubHaloOpacity={animatedSubHaloOpacity} glowColor={glowColor} />}
    </>
  );
});

/**
 * Provides global scroll tracking and halo animation context.
 *
 * The halo renders after `children`, so paint order — not a `zIndex` — keeps it
 * floating above the app tree.
 *
 * When `hideHalo` is true, the halo elements are not rendered. The context
 * methods (`setHaloOpacity`, `setSubHaloOpacity`, `resetHaloOpacity`) remain
 * available and will update internal shared values, but no visible halo
 * changes will occur since the halo components are unmounted.
 *
 * When `hideNeutralHalo` is true, only the white/neutral halo is suppressed
 * while the (dark-mode) green halo keeps rendering. Use this when a screen tree
 * wants the green accent but not the white glow.
 *
 * When `hideGreenHalo` is true, only the (dark-mode) green halo is suppressed
 * while the white/neutral halo keeps rendering. Use this when a screen tree
 * wants the white glow but not the green accent.
 */
export function ScrollProvider({
  children,
  hideHalo = false,
  hideNeutralHalo = false,
  hideGreenHalo = false,
  defaultNeutralOpacity = SUB_HALO_RESTING_OPACITY,
}: {
  children: React.ReactNode;
  hideHalo?: boolean;
  hideNeutralHalo?: boolean;
  hideGreenHalo?: boolean;
  /**
   * Baseline opacity for the neutral halo when no screen overrides it via
   * `setSubHaloOpacity`. Defaults to a faint `0.1`; raise it (e.g. on the tab
   * shell) when the neutral glow should be clearly visible by default.
   */
  defaultNeutralOpacity?: number;
}) {
  const globalScrollY = useSharedValue(0);
  const isHeaderVisible = useSharedValue(true);
  const lastScrollY = useSharedValue(0);
  const shouldAnimateHalo = useSharedValue<boolean>(false);
  const overrideHaloOpacity = useSharedValue<boolean>(false);
  const overrideSubHaloOpacity = useSharedValue<boolean>(false);
  const haloOpacity = useSharedValue<number>(1);
  const subHaloOpacity = useSharedValue<number>(defaultNeutralOpacity);
  const haloRef = useRef<HaloRendererHandle>(null);

  const updateGlobalScroll = useCallback(
    (value: number, options?: { isNearBottom?: boolean }) => {
      'worklet';
      globalScrollY.value = value;
      const isNearBottom = options?.isNearBottom ?? false;

      // Header visibility: show on scroll up, hide on scroll down (after a small threshold).
      // Keep visible when near the top to avoid jitter on tiny scrolls.
      const MIN_HIDE_Y = 24;
      const MIN_DELTA = 6;
      const delta = value - lastScrollY.value;

      if (value <= 0) {
        isHeaderVisible.value = true;
      } else if (isNearBottom && value > MIN_HIDE_Y) {
        // Avoid revealing the header near the bottom to prevent bounce jank.
        isHeaderVisible.value = false;
      } else if (Math.abs(delta) >= MIN_DELTA) {
        if (delta > 0 && value > MIN_HIDE_Y) {
          isHeaderVisible.value = false;
        } else if (delta < 0) {
          isHeaderVisible.value = true;
        }
      }

      lastScrollY.value = value;
    },
    [globalScrollY, isHeaderVisible, lastScrollY],
  );

  const setAnimateHalo = useCallback(
    (shouldAnimate: boolean) => {
      'worklet';
      shouldAnimateHalo.value = shouldAnimate;
    },
    [shouldAnimateHalo],
  );

  const unregisterActiveScroll = useCallback(() => {
    'worklet';
    shouldAnimateHalo.value = false;
    globalScrollY.value = 0;
    lastScrollY.value = 0;
    isHeaderVisible.value = true;
  }, [shouldAnimateHalo, globalScrollY, lastScrollY, isHeaderVisible]);

  // Programmatic opacity control functions
  const setHaloOpacity = useCallback(
    (opacity: number | null, duration = 300) => {
      'worklet';
      if (opacity === null) {
        overrideHaloOpacity.value = false; // Reset to scroll-based
      } else {
        haloOpacity.value = withTiming(opacity, { duration });
        overrideHaloOpacity.value = true; // Enable manual control
      }
    },
    [overrideHaloOpacity, haloOpacity],
  );

  const setSubHaloOpacity = useCallback(
    (opacity: number | null, duration = 300) => {
      'worklet';
      if (opacity === null) {
        overrideSubHaloOpacity.value = false; // Reset to scroll-based
      } else {
        subHaloOpacity.value = withTiming(opacity, { duration });
        overrideSubHaloOpacity.value = true; // Enable manual control
      }
    },
    [overrideSubHaloOpacity, subHaloOpacity],
  );

  // Delegated to HaloRenderer's local state via ref so updating the glow color
  // or layer visibility re-renders only the halo subtree, not the app tree
  // under this provider. Stable identities keep `contextValue` referentially
  // constant.
  const setHaloGlowColor = useCallback((color: string | null) => {
    haloRef.current?.setGlowColor(color);
  }, []);

  const setHaloLayerVisibility = useCallback((visibility: HaloLayerVisibilityOverride | null) => {
    haloRef.current?.setVisibility(visibility);
  }, []);

  const resetHaloOpacity = useCallback(() => {
    'worklet';
    overrideHaloOpacity.value = false;
    overrideSubHaloOpacity.value = false;
  }, [overrideHaloOpacity, overrideSubHaloOpacity]);

  const animatedSubHaloOpacity = useAnimatedStyle(() => {
    if (overrideSubHaloOpacity.get()) {
      return { opacity: subHaloOpacity.get() };
    }
    if (!shouldAnimateHalo.get()) {
      return { opacity: SUB_HALO_RESTING_OPACITY };
    }
    return {
      opacity: interpolate(globalScrollY.get(), [0, 150], [SUB_HALO_RESTING_OPACITY, 0], Extrapolation.CLAMP),
    };
  });

  const animatedHaloOpacity = useAnimatedStyle(() => {
    if (overrideHaloOpacity.get()) {
      return { opacity: haloOpacity.get() };
    }
    if (!shouldAnimateHalo.get()) {
      return { opacity: HALO_RESTING_OPACITY };
    }
    return {
      opacity: interpolate(globalScrollY.get(), [0, 150], [HALO_RESTING_OPACITY, 0], Extrapolation.CLAMP),
    };
  });

  const contextValue = useMemo(
    () => ({
      updateGlobalScroll,
      setAnimateHalo,
      unregisterActiveScroll,
      setHaloOpacity,
      setSubHaloOpacity,
      setHaloLayerVisibility,
      setHaloGlowColor,
      resetHaloOpacity,
      isHeaderVisible,
      globalScrollY,
    }),
    [
      updateGlobalScroll,
      setAnimateHalo,
      unregisterActiveScroll,
      setHaloOpacity,
      setSubHaloOpacity,
      setHaloLayerVisibility,
      setHaloGlowColor,
      resetHaloOpacity,
      isHeaderVisible,
      globalScrollY,
    ],
  );

  // The halo is a global decoration that must float above the app tree. Rather than
  // lifting it with a hardcoded `zIndex`, it is rendered *after* `children` so paint
  // order alone keeps it on top — both halo views are absolutely positioned and
  // pointer-transparent, so they overlay the content without affecting layout.
  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
      {hideHalo ? null : (
        <HaloRenderer
          ref={haloRef}
          hideGreenHalo={hideGreenHalo}
          hideNeutralHalo={hideNeutralHalo}
          animatedHaloOpacity={animatedHaloOpacity}
          animatedSubHaloOpacity={animatedSubHaloOpacity}
        />
      )}
    </ScrollContext.Provider>
  );
}

export function useGlobalScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useGlobalScroll must be used within ScrollProvider');
  }
  return context;
}

export function useOptionalGlobalScroll() {
  return useContext(ScrollContext);
}
