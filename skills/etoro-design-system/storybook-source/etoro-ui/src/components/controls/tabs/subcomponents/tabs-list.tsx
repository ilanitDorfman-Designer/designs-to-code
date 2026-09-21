import { Children, cloneElement, isValidElement, type ReactElement, useCallback } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { TabsListProps } from '../api/types';
import { useScrollFade } from '../hooks/use-scroll-fade';
import { ScrollFadeOverlay } from './scroll-fade-overlay';
import { TabsIndicator } from './tabs-indicator';

/**
 * TabsList - Container for tab triggers
 *
 * Extends ViewProps for full extensibility.
 * Always horizontally scrollable. When tabs overflow, gradient fade
 * overlays appear at the edges to indicate more content.
 *
 * Supports two variants:
 * - 'line' (default): Has a divider line at the bottom and an active tab indicator
 * - 'plain': No divider line and no indicator
 *
 * @example
 * ```tsx
 * <EtTabs.List variant="line">
 *   <EtTabs.Trigger value="tab1">Tab 1</EtTabs.Trigger>
 *   <EtTabs.Trigger value="tab2">Tab 2</EtTabs.Trigger>
 * </EtTabs.List>
 * ```
 *
 * @example With custom ScrollView props
 * ```tsx
 * <EtTabs.List scrollViewProps={{ bounces: false }}>
 *   <EtTabs.Trigger value="tab1">Tab 1</EtTabs.Trigger>
 *   <EtTabs.Trigger value="tab2">Tab 2</EtTabs.Trigger>
 * </EtTabs.List>
 * ```
 */
export function TabsList({
  children,
  variant = 'line',
  stretch = false,
  scrollViewProps,
  scrollViewRef,
  style,
  contentContainerStyle,
  onLayout: consumerOnLayout,
  ...viewProps
}: TabsListProps) {
  const { colors } = useEtoroTheme();
  const { startFadeOpacity, endFadeOpacity, scrollHandler, handleContentSizeChange, handleLayout } = useScrollFade();

  const composedOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      handleLayout(event);
      consumerOnLayout?.(event);
    },
    [handleLayout, consumerOnLayout],
  );

  const isLine = variant === 'line';

  // In stretch mode each trigger gets `flex: 1` so the row fills the width evenly. We clone the
  // children rather than reading a context flag, keeping TabsTrigger untouched. `stretchTrigger`
  // is applied last so the `flex: 1` equal-width guarantee always wins over consumer styles.
  const triggers = stretch
    ? Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ style?: StyleProp<ViewStyle> }>, {
              style: [(child.props as { style?: StyleProp<ViewStyle> }).style, styles.stretchTrigger],
            })
          : child,
      )
    : children;

  const content = (
    <View style={styles.triggersContainer}>
      {triggers}
      {isLine && <View style={[styles.divider, { backgroundColor: colors.dividerSenary }]} />}
      {isLine && <TabsIndicator />}
    </View>
  );

  const containerStyle = [styles.container, style];

  // Stretch tabs are a fixed full-width bar: render the row directly (no scroll / no edge fades).
  if (stretch) {
    return (
      <View style={containerStyle} {...viewProps} onLayout={composedOnLayout} accessibilityRole="tablist">
        {content}
      </View>
    );
  }

  return (
    <View style={containerStyle} {...viewProps} onLayout={composedOnLayout} accessibilityRole="tablist">
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        {...scrollViewProps}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      >
        {content}
      </Animated.ScrollView>
      <ScrollFadeOverlay opacity={startFadeOpacity} position="start" />
      <ScrollFadeOverlay opacity={endFadeOpacity} position="end" />
    </View>
  );
}

TabsList.displayName = 'EtTabs.List';

const styles = StyleSheet.create({
  container: {},
  triggersContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stretchTrigger: {
    flex: 1,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
