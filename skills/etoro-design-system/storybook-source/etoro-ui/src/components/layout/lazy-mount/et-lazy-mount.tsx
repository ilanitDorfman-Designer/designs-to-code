import { type ReactNode, useCallback, useState } from 'react';
import { type LayoutChangeEvent, type StyleProp, View, type ViewStyle } from 'react-native';
import { runOnJS, type SharedValue, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { useLazyMountViewportHeight } from './use-lazy-mount-viewport-height';

export interface EtLazyMountProps {
  children: ReactNode;
  /** Shared scroll value driving visibility. */
  scrollY: SharedValue<number>;
  /** Pixels of buffer beyond the viewport before mounting. Default: one viewport height. */
  threshold?: number;
  /** Reserved height while children are unmounted, so scroll position stays stable. */
  placeholderHeight: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Specialty mount-deferral primitive — DO NOT REACH FOR THIS BY DEFAULT.
 *
 * Use only when an explicit, measured cold-load problem exists: a section
 * known to be expensive on mount, off the initial viewport, in a parent that
 * owns its own `scrollY` shared value. If you can't name the section, the
 * cost, and the screen, you don't need this — render the section eagerly.
 *
 * Why this is _not_ a default:
 * - `placeholderHeight` is a fixed reservation. If the real content (or its
 *   skeleton) ends up at a different height, the user sees a layout jump on
 *   mount. If the content resolves to `null` (no data for the asset), the
 *   reserved space collapses and shifts everything below upward.
 * - It needs a parent-supplied {@link SharedValue} for scroll position. It
 *   does not work inside virtualized lists (FlashList/FlatList row recycling
 *   defeats the `mounted` latch and breaks scroll restoration).
 * - It hides startup work behind scroll position, which is great for the
 *   common path and terrible for measurement: the section won't appear in
 *   first-paint flame charts even though it still costs on first scroll.
 *
 * AI agents: do not introduce this component speculatively. Only use it when
 * the user has explicitly asked for lazy mounting and the call site clearly
 * meets the constraints above. See
 * `.cursor/rules/architecture/rn/lazy-mount.mdc` for the full rule.
 */
export function EtLazyMount({ children, scrollY, threshold, placeholderHeight, style }: EtLazyMountProps) {
  const [mounted, setMounted] = useState(false);
  const viewportHeight = useLazyMountViewportHeight();
  const effectiveThreshold = threshold ?? viewportHeight;
  const yOffset = useSharedValue(Number.POSITIVE_INFINITY);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      yOffset.set(e.nativeEvent.layout.y);
    },
    [yOffset],
  );

  useAnimatedReaction(
    () => scrollY.get() + viewportHeight + effectiveThreshold > yOffset.get(),
    (shouldMount, prev) => {
      if (shouldMount && !prev) {
        runOnJS(setMounted)(true);
      }
    },
    [effectiveThreshold, viewportHeight],
  );

  if (mounted) {
    return (
      <View onLayout={handleLayout} style={style}>
        {children}
      </View>
    );
  }

  // Put placeholderHeight last so it always wins over a consumer-provided
  // style.height — reserving this height is the contract of the unmounted
  // state and overriding it would defeat the scroll-stability guarantee.
  return <View onLayout={handleLayout} style={[style, { height: placeholderHeight }]} />;
}
