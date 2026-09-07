import { interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useScreenContext } from '../api/context';
import { HeaderAnimationType } from '../api/types';

/**
 * Hook that manages TopBar scroll-driven animations.
 * Handles collapse/fade animations based on scroll position and direction.
 *
 * By default, the collapse animation translates up by the TopBar-only height,
 * so the extended header slides up to take its place. When `collapseHeaderWithTopBar`
 * is true, the full header area height is used, collapsing everything off-screen.
 */
export function useTopBarAnimation() {
  const { topBarConfig, shouldShowTopBar, hasScrollView, scrollY, direction, topBarHeightShared, headerAreaHeightShared, collapseHeaderWithTopBar } =
    useScreenContext();

  const animationType: HeaderAnimationType = topBarConfig?.animation || 'collapse';
  const hasTopBarAnimation = animationType !== 'none' && hasScrollView;

  const animationOptions = topBarConfig?.animationOptions || {};
  const threshold = animationOptions.threshold ?? 5;
  const animationDuration = animationOptions.animationDuration ?? 300;
  const minScrollPosition = animationOptions.minScrollPosition ?? 10;

  const lastScrollY = useSharedValue(0);

  // Direction tracking - separate from style computation to avoid side effects
  // Guard the reaction to prevent worklet execution when animation is disabled
  useAnimatedReaction(
    () => (hasTopBarAnimation ? scrollY.value : null),
    (currentY, _previousY) => {
      'worklet';

      if (currentY === null) {
        return;
      }

      const diff = currentY - lastScrollY.value;

      // Always at top - show TopBar
      if (currentY < minScrollPosition) {
        direction.value = withTiming(1, { duration: animationDuration });
        lastScrollY.value = currentY;
        return;
      }

      // Check if scroll movement exceeds threshold
      if (Math.abs(diff) >= threshold) {
        if (diff > 0) {
          // Scrolling down - hide TopBar
          direction.value = withTiming(0, { duration: animationDuration });
        } else {
          // Scrolling up - show TopBar
          direction.value = withTiming(1, { duration: animationDuration });
        }
        lastScrollY.value = currentY;
      }
    },
    [hasTopBarAnimation, threshold, animationDuration, minScrollPosition],
  );

  // Pure style computation - no side effects, only reads shared values
  const animatedHeaderStyle = useAnimatedStyle(() => {
    if (!hasTopBarAnimation) {
      return {};
    }

    if (animationType === 'fade') {
      return {
        opacity: direction.value,
      };
    } else if (animationType === 'collapse') {
      const collapseHeight = collapseHeaderWithTopBar ? headerAreaHeightShared.value : topBarHeightShared.value;
      return {
        transform: [
          {
            translateY: interpolate(direction.value, [0, 1], [-collapseHeight, 0]),
          },
        ],
      };
    }

    return {};
  });

  return {
    shouldShowTopBar,
    hasTopBarAnimation,
    animatedHeaderStyle,
  };
}
