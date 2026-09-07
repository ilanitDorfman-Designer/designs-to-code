import { useEffect } from 'react';
import { useAnimatedReaction } from 'react-native-reanimated';

import { useScreenContext } from '../api/context';
import { useTabBarVisibility } from '../api/tab-bar-visibility.context';
import { useHideOnScroll } from './use-hide-on-scroll';

/** Inputs for {@link useHideTabBarOnScroll}. */
export interface UseHideTabBarOnScrollOptions {
  /** When false, the tab bar is left visible and scroll is ignored. @default true */
  enabled?: boolean;
}

/**
 * Hides the app's bottom tab bar on scroll-down and reveals it on scroll-up, in lock-step with the
 * collapsible screen header (same UI-thread velocity model). Reads the per-screen `scrollY` from the
 * `EtScreenV2`/`EtScreen` context and writes the shared `EtTabBarVisibilityProvider` flag the app's
 * tab bar reacts to.
 *
 * Must be called inside an `EtScreen`/`EtScreenV2` subtree. No-ops gracefully when no
 * {@link EtTabBarVisibilityProvider} is mounted (e.g. screens outside the tab navigator, Storybook).
 *
 * Prefer the `EtScreenV2` `hideTabBarOnScroll` prop over calling this directly.
 */
export function useHideTabBarOnScroll({ enabled = true }: UseHideTabBarOnScrollOptions = {}): void {
  const { scrollY, scrollBottomDistance } = useScreenContext();
  const tabBarVisible = useTabBarVisibility();
  // Only drive the model when a tab bar is actually present to hide.
  const isVisible = useHideOnScroll({ scrollY, scrollBottomDistance, enabled: enabled && tabBarVisible != null });

  useAnimatedReaction(
    () => isVisible.value,
    (visible) => {
      if (tabBarVisible == null) return;
      tabBarVisible.set(visible);
    },
  );

  // Always restore the bar when this screen stops driving it (disabled or unmounted); otherwise
  // leaving a screen while the bar is hidden would strand it off-screen on the next screen.
  useEffect(() => {
    if (tabBarVisible == null) return undefined;
    if (!enabled) {
      tabBarVisible.set(true);
      return undefined;
    }
    return () => {
      tabBarVisible.set(true);
    };
  }, [enabled, tabBarVisible]);
}
