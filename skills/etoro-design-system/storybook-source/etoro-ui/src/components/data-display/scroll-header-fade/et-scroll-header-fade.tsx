// NATIVE TWIN: the advanced watchlist table renders the fade under the sticky table header natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/AdvancedTableView.swift (AdvancedTableHeaderFade) and
// apps/etoro-mobile/modules/advanced-table/android/.../AdvancedTableView.kt (AdvancedTableHeaderFade). A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import { LinearGradient } from 'expo-linear-gradient';
import { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { X8 } from '../../../core/styles';
import { useOptionalScreenContext } from '../../screen/api/context';

/** Scroll distance (px) over which the fade ramps from fully transparent to fully opaque. */
const DEFAULT_FADE_IN_DISTANCE = 12;

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 0, y: 1 };

export interface EtScrollHeaderFadeProps {
  /**
   * Scroll position driving the fade opacity. Defaults to the enclosing `EtScreen` / `EtScreenV2`
   * screen context's `scrollY`. Pass explicitly to react to a different scroll source or when the
   * fade is rendered outside a screen.
   */
  scrollY?: SharedValue<number>;
  /**
   * Gradient start color; fades to fully transparent. Defaults to the theme's `backgroundBase`
   * so list content dissolves into the page background as it scrolls under the sticky header.
   */
  color?: string;
  /**
   * Scroll distance (px) over which opacity ramps from 0 → 1.
   * @default 12
   */
  fadeInDistance?: number;
  /**
   * Height of the gradient overlay (px). For a header (`edge='bottom'`) the overlay is pushed down
   * by this same amount so it sits just below the host's bottom edge.
   * @default 32 (X8)
   */
  height?: number;
  /**
   * Which sticky-chrome edge the fade decorates.
   * - `'bottom'` (default): the fade hangs **below a sticky header**. Render it as the header's
   *   last child; it overflows downward onto the top of the list (solid → transparent).
   * - `'top'`: the fade sits **above a sticky footer**. Render it as the last child of the
   *   scrollable area so it pins to that area's bottom edge; it overlays the bottom of the list
   *   (transparent → solid) and dissolves rows into the footer.
   * @default 'bottom'
   */
  edge?: 'top' | 'bottom';
}

/**
 * Scroll-linked gradient that fades list content as it scrolls beneath a sticky header.
 *
 * Render it as the last child of the sticky header (the header must allow overflow and sit above
 * the list in paint order). It anchors to the header's bottom edge, is pushed down by its own
 * height so it overlays the top of the list, and ramps its opacity in from the screen's shared
 * `scrollY` on the UI thread — so it never re-renders React on scroll.
 *
 * Used by the watchlist section headers and the portfolio collapsible header.
 */
export function EtScrollHeaderFade({
  scrollY,
  color,
  fadeInDistance = DEFAULT_FADE_IN_DISTANCE,
  height = X8,
  edge = 'bottom',
}: EtScrollHeaderFadeProps): ReactElement {
  const { colors } = useEtoroTheme();
  const screen = useOptionalScreenContext();
  // Fallback keeps the hook order stable (and opacity pinned at 0) when neither an explicit
  // `scrollY` nor a screen context is available.
  const fallbackScrollY = useSharedValue(0);
  const activeScrollY = scrollY ?? screen?.scrollY ?? fallbackScrollY;
  const gradientColor = color ?? colors.backgroundBase;
  const isTop = edge === 'top';

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.max(activeScrollY.value / fadeInDistance, 0), 1),
  }));

  // The solid end always sits against the sticky chrome: top of the gradient for a header
  // (solid → transparent, dissolving the list below it) and bottom of the gradient for a footer
  // (transparent → solid, dissolving the list above it). Both anchor to `bottom: 0`; a header
  // overflows downward by its own height, while a footer fade stays pinned to its host's bottom.
  const gradientColors: [string, string] = isTop ? [`${gradientColor}00`, gradientColor] : [gradientColor, `${gradientColor}00`];

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { height, transform: [{ translateY: isTop ? 0 : height }] }, animatedStyle]}>
      <LinearGradient colors={gradientColors} locations={[0, 1]} start={GRADIENT_START} end={GRADIENT_END} style={styles.gradient} />
    </Animated.View>
  );
}

EtScrollHeaderFade.displayName = 'EtScrollHeaderFade';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  gradient: {
    flex: 1,
  },
});
