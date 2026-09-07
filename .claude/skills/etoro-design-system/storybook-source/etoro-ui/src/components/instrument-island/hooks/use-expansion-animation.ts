import { useEffect } from 'react';
import { type ViewStyle } from 'react-native';
import { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

import { IslandLayout } from './use-island-layout';

/** Bouncy, "alive" expansion. Mirrors the Dynamic Island's springy morph. */
const EXPAND_SPRING = { damping: 15, stiffness: 190, mass: 0.9 } as const;
/** Slightly firmer collapse so it tucks back without overshooting awkwardly. */
const COLLAPSE_SPRING = { damping: 19, stiffness: 220, mass: 0.9 } as const;

export interface ExpansionAnimation {
  /** Ground-truth progress, 0 (collapsed) → 1 (expanded). */
  expansion: SharedValue<number>;
  /** Live shell geometry, derived from {@link expansion} — consumed by the Skia glow. */
  shellWidth: SharedValue<number>;
  shellHeight: SharedValue<number>;
  shellRadius: SharedValue<number>;
  /** Width/height of the (unclipped) shell wrapper that hosts the glow. */
  shellStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
  /** Border radius for the clipped glass surface (kept separate so the glow isn't clipped). */
  surfaceStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
  collapsedContentStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
  expandedContentStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
  backdropStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
}

/**
 * Drives the collapsed → expanded morph from a single spring-animated
 * progress value. Everything visual (size, radius, cross-fade, backdrop) is
 * `interpolate`d off that one value so the whole island moves as one piece.
 */
export function useExpansionAnimation(isExpanded: boolean, layout: IslandLayout): ExpansionAnimation {
  const expansion = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    expansion.value = withSpring(isExpanded ? 1 : 0, isExpanded ? EXPAND_SPRING : COLLAPSE_SPRING);
  }, [isExpanded, expansion]);

  const shellWidth = useDerivedValue(() => interpolate(expansion.value, [0, 1], [layout.collapsedWidth, layout.expandedWidth]));
  const shellHeight = useDerivedValue(() => interpolate(expansion.value, [0, 1], [layout.collapsedHeight, layout.expandedHeight]));
  const shellRadius = useDerivedValue(() => interpolate(expansion.value, [0, 1], [layout.collapsedRadius, layout.expandedRadius]));

  const shellStyle = useAnimatedStyle<ViewStyle>(() => ({
    width: shellWidth.value,
    height: shellHeight.value,
    // Anchor the top edge: the shell is center-aligned, so pushing it down by
    // half the height gain keeps its top fixed and grows the island downward
    // (clearing the device Dynamic Island instead of expanding into it).
    transform: [{ translateY: (shellHeight.value - layout.collapsedHeight) / 2 }],
  }));

  const surfaceStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: shellRadius.value,
  }));

  const collapsedContentStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(expansion.value, [0, 0.45], [1, 0], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(expansion.value, [0, 1], [1, 0.86]) }],
  }));

  const expandedContentStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(expansion.value, [0.45, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(expansion.value, [0, 1], [0.92, 1]) }, { translateY: interpolate(expansion.value, [0, 1], [10, 0]) }],
  }));

  const backdropStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(expansion.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }));

  return {
    expansion,
    shellWidth,
    shellHeight,
    shellRadius,
    shellStyle,
    surfaceStyle,
    collapsedContentStyle,
    expandedContentStyle,
    backdropStyle,
  };
}
