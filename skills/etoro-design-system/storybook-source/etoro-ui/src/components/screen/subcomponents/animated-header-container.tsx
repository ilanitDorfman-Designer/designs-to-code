import { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEtoroTheme } from '../../../core/hooks';
import { useScreenContext } from '../api/context';
import { useTopBarAnimation } from '../hooks';
import { TopBarRenderer } from './topbar-renderer';

/**
 * Animated wrapper that contains the TopBar and extended header.
 * Owns layout measurement, safe area insets, and scroll-driven animation.
 *
 * Only rendered when the screen has a visible TopBar.
 */
export function AnimatedHeaderContainer() {
  const { topBarConfig, headerContent, setTopBarHeight, setHeaderAreaHeight } = useScreenContext();
  const { hasTopBarAnimation, animatedHeaderStyle } = useTopBarAnimation();
  const { colors } = useEtoroTheme();
  const insets = useSafeAreaInsets();

  const handleTopBarLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setTopBarHeight(event.nativeEvent.layout.height);
    },
    [setTopBarHeight],
  );

  const handleFullAreaLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setHeaderAreaHeight(event.nativeEvent.layout.height);
    },
    [setHeaderAreaHeight],
  );

  const topPaddingStyle = useMemo(() => ({ paddingTop: insets.top }), [insets.top]);

  const backgroundStyle = useMemo(
    () => (topBarConfig?.transparent ? undefined : { backgroundColor: colors.backgroundBase }),
    [topBarConfig?.transparent, colors.backgroundBase],
  );

  return (
    <Animated.View onLayout={handleFullAreaLayout} style={[styles.container, backgroundStyle, hasTopBarAnimation ? animatedHeaderStyle : undefined]}>
      <View style={topPaddingStyle} onLayout={handleTopBarLayout}>
        {topBarConfig?.raw ? (topBarConfig.rawContent ?? null) : topBarConfig ? <TopBarRenderer config={topBarConfig} /> : null}
      </View>
      {headerContent}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
