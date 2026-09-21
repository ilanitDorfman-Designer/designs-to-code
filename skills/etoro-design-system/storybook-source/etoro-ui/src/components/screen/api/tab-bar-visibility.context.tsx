import { createContext, ReactNode, useContext } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';

/**
 * Shared visibility flag for the app's bottom tab bar.
 *
 * Lives in etoro-ui (not the app) so that feature-library screens — which cannot import from
 * `apps/etoro-mobile` — can drive the bar's visibility, while the app's tab bar reads the same
 * source of truth. `true` = bar shown, `false` = bar hidden.
 *
 * It is a Reanimated `SharedValue` so scroll-driven updates stay on the UI thread and never
 * trigger a React re-render per frame (mirrors how `EtScreenV2`'s `scrollY` is published).
 */
const TabBarVisibilityContext = createContext<SharedValue<boolean> | null>(null);

export interface EtTabBarVisibilityProviderProps {
  children: ReactNode;
}

/**
 * Provides the shared tab-bar visibility flag. Mount it above both the bottom tab bar and the
 * screens that should be able to hide it (e.g. at the tab navigator layout root).
 */
export function EtTabBarVisibilityProvider({ children }: EtTabBarVisibilityProviderProps) {
  const isTabBarVisible = useSharedValue(true);
  return <TabBarVisibilityContext.Provider value={isTabBarVisible}>{children}</TabBarVisibilityContext.Provider>;
}

/**
 * Returns the shared tab-bar visibility flag, or `null` when no {@link EtTabBarVisibilityProvider}
 * is mounted (e.g. screens rendered outside the tab navigator, or Storybook). Callers MUST no-op
 * when this is `null`.
 */
export function useTabBarVisibility(): SharedValue<boolean> | null {
  return useContext(TabBarVisibilityContext);
}
