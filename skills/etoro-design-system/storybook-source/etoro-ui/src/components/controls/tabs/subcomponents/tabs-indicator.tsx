import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { TabsIndicatorProps } from '../api/types';
import { useTabsContext } from '../context';

/**
 * TabsIndicator - Animated underline indicator for active tab
 *
 * Extends Animated.View props for full extensibility.
 * Positioned absolutely at the bottom of TabsList.
 * Animates position and width when active tab changes.
 *
 * @example Custom styling
 * ```tsx
 * <EtTabs.Indicator style={{ height: 4, backgroundColor: 'red' }} />
 * ```
 *
 * @example With additional props
 * ```tsx
 * <EtTabs.Indicator
 *   style={{ height: 4 }}
 *   entering={FadeIn}
 *   exiting={FadeOut}
 * />
 * ```
 */
export function TabsIndicator({ style, ...animatedViewProps }: TabsIndicatorProps) {
  const { colors } = useEtoroTheme();
  const { meta } = useTabsContext();

  // Animate translateX (GPU-accelerated) for position and width for size.
  // Width animation on a single absolutely-positioned leaf element is acceptable —
  // the layout cost is negligible for a 2px-tall indicator with no children.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: meta.indicatorX.value }],
    width: meta.indicatorWidth.value,
  }));

  return <Animated.View style={[styles.indicator, { backgroundColor: colors.textPrimaryNeutral }, animatedStyle, style]} {...animatedViewProps} />;
}

TabsIndicator.displayName = 'EtTabs.Indicator';

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    borderRadius: 1,
  },
});
