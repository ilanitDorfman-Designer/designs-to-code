import { memo, ReactNode, useCallback, useMemo } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { ScreenContextProvider, useScreenContext } from './api/context';
import { EtScreenProps } from './api/types';
import { useHideTabBarOnScroll } from './hooks/use-hide-tab-bar-on-scroll';
import { EtScreenContent, ScreenOverlay } from './subcomponents';

export interface EtScreenV2Props extends EtScreenProps {
  /** Disable the automatic top inset added by any internally registered screen chrome. */
  noHeaderOffset?: boolean;
  /**
   * Hide the app's bottom tab bar on scroll-down and reveal it on scroll-up, in lock-step with the
   * screen header. Requires an `EtTabBarVisibilityProvider` ancestor (mounted at the tab navigator)
   * and a scroll owner wired via `useScrollHandlers()`; no-ops otherwise. @default false
   */
  hideTabBarOnScroll?: boolean;
}

export interface UseScrollHandlersOptions {
  /** Composed callback fired alongside the internal scrollY update. JS-side. */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  /**
   * Optional content inset owned by the screen scroll owner.
   *
   * Use `{ top: 'header' }` for full-bleed overlay screens whose body scrolls
   * behind floating chrome: the scroll content starts below the measured
   * header area, then slides underneath it during scroll.
   */
  contentInset?: { top?: 'header' };
  /** Existing scroll content style to compose with the screen-owned inset. */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export interface EtScrollHandlers extends Pick<ScrollViewProps, 'onScroll' | 'scrollEventThrottle'> {
  /**
   * Position of the screen's scroll owner. Owners ignore this; siblings read it
   * inside `useAnimatedReaction` / `useAnimatedStyle` for scroll-driven UI.
   */
  scrollY: SharedValue<number>;
  /** Remaining scrollable distance to the end of the scroll owner. */
  scrollBottomDistance: SharedValue<number>;
  /** Composed content container style for scroll owners that accept one. */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Single hook for both scroll owners and siblings on an EtScreenV2.
 *
 * - The scroll owner (e.g. a FlatList) spreads `onScroll` + `scrollEventThrottle`
 *   onto its scroll component. The handler writes to the screen's `scrollY`
 *   Reanimated shared value, so frames never trigger React renders.
 * - Sibling components (e.g. a top bar that wants to hide on scroll) ignore
 *   `onScroll` and read `scrollY` directly in worklets.
 *
 * This shape mirrors Bluesky's `useScrollHandlers` terminology while staying
 * single-hook because EtScreenV2 is our universal scroll owner — see
 * Bluesky's social-app/src/lib/ScrollContext.tsx for the
 * worklet-handler variant we can evolve toward when re-adding header hiding.
 */
export function useScrollHandlers({
  onScroll,
  scrollEventThrottle = 16,
  contentInset,
  contentContainerStyle,
}: UseScrollHandlersOptions = {}): EtScrollHandlers {
  const { scrollY, scrollBottomDistance, headerAreaHeight } = useScreenContext();

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      scrollY.set(contentOffset.y);
      scrollBottomDistance.set(Math.max(0, contentSize.height - layoutMeasurement.height - contentOffset.y));
      onScroll?.(event);
    },
    [onScroll, scrollBottomDistance, scrollY],
  );

  const composedContentContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => (contentInset?.top === 'header' ? [contentContainerStyle, { paddingTop: headerAreaHeight }] : contentContainerStyle),
    [contentContainerStyle, contentInset?.top, headerAreaHeight],
  );

  return useMemo(
    () => ({
      onScroll: handleScroll,
      scrollEventThrottle,
      scrollY,
      scrollBottomDistance,
      contentContainerStyle: composedContentContainerStyle,
    }),
    [composedContentContainerStyle, handleScroll, scrollBottomDistance, scrollEventThrottle, scrollY],
  );
}

interface EtScreenV2InnerProps {
  noHeaderOffset?: boolean;
  children: ReactNode;
}

/**
 * Owns the top offset for a registered TopBar. Lives inside the SafeAreaView
 * from {@link EtScreenContent} so its padding does not double the safe-area
 * insets.
 *
 * The screen is full-bleed by default — it applies no horizontal padding. A
 * consumer that wants gutters adds them itself (e.g. `style={{ paddingHorizontal }}`
 * on EtScreenV2, or padding on its own content container).
 *
 * Top inset resolution:
 * - With an Overlay registered → 0. Registering `<EtScreenOverlay>` opts the screen into the
 *   "stuff scrolls behind the topbar/status bar" pattern (progressive blur, scroll-driven titles,
 *   etc.), so V2 stops protecting the body — the consumer is now responsible for top spacing
 *   (typically `contentContainerStyle.paddingTop = headerAreaHeight` on the scroll owner, or a
 *   `paddingTop: headerAreaHeight` wrapper for static content). Without this, the body would clip
 *   the scrolling content at the topbar's bottom edge and the blur would have nothing to blur.
 * - With a registered TopBar (no overlay) → push down by the measured `headerAreaHeight` so
 *   content sits below the topbar. Default convenience for typical screens.
 * - Otherwise → no top padding (SafeAreaView already handled the inset).
 */
function EtScreenV2Inner({ noHeaderOffset, children }: EtScreenV2InnerProps) {
  const { shouldShowTopBar, headerAreaHeight, hasOverlay } = useScreenContext();

  const topInset = useMemo(() => {
    if (noHeaderOffset) return 0;
    if (hasOverlay) return 0;
    if (shouldShowTopBar) return headerAreaHeight;
    return 0;
  }, [noHeaderOffset, hasOverlay, shouldShowTopBar, headerAreaHeight]);

  return <View style={[styles.inner, topInset > 0 && { paddingTop: topInset }]}>{children}</View>;
}

/**
 * Mounts the scroll-driven bottom-tab-bar hide behavior. Rendered as a child of
 * {@link ScreenContextProvider} (so it can read the screen's `scrollY`) and paints nothing.
 */
function TabBarHideOnScrollController() {
  useHideTabBarOnScroll();
  return null;
}

function EtScreenV2Component({
  children,
  gradient = false,
  entering,
  exiting,
  animateHalo = false,
  style,
  noHeaderOffset,
  hideTabBarOnScroll = false,
  ...safeAreaProps
}: EtScreenV2Props) {
  return (
    <ScreenContextProvider animateHalo={animateHalo}>
      <EtScreenContent gradient={gradient} entering={entering} exiting={exiting} style={style} safeAreaProps={safeAreaProps}>
        <EtScreenV2Inner noHeaderOffset={noHeaderOffset}>{children}</EtScreenV2Inner>
      </EtScreenContent>
      {hideTabBarOnScroll ? <TabBarHideOnScrollController /> : null}
    </ScreenContextProvider>
  );
}

const EtScreenV2Base = memo(EtScreenV2Component);
EtScreenV2Base.displayName = 'EtScreenV2';

export const EtScreenOverlay = ScreenOverlay;
export const EtScreenV2 = EtScreenV2Base;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
  },
});
