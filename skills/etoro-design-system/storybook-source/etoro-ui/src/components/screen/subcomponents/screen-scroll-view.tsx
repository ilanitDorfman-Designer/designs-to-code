import type { ComponentType } from 'react';
import { memo, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { runOnJS, useAnimatedScrollHandler } from 'react-native-reanimated';

import { useScreenContext } from '../api/context';
import { EtScreenScrollViewProps } from '../api/types';
import { wrapReanimatedScrollEvent } from './scroll-event-utils';

/** Default `bottomOffset` for `keyboardAware` — see `EtScreen.ScrollView` in AGENTS.md. */
export const DEFAULT_KEYBOARD_BOTTOM_OFFSET = 24;

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

/**
 * EtScreen.ScrollView - Scrollable content container.
 *
 * Extends React Native's ScrollViewProps for full native API access.
 * Automatically handles:
 * - Scroll position tracking for TopBar animations
 * - TopBar padding (when TopBar is present)
 * - Animated vs regular ScrollView based on animation needs
 *
 * @example Basic usage
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.ScrollView>
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 *
 * @example With custom scroll props
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar />
 *   <EtScreen.ScrollView
 *     showsVerticalScrollIndicator={false}
 *     contentContainerStyle={{ padding: 16 }}
 *   >
 *     <Content />
 *   </EtScreen.ScrollView>
 * </EtScreen>
 * ```
 */
function ScreenScrollViewComponent({
  children,
  contentContainerStyle,
  keyboardAware = false,
  keyboardBottomOffset = DEFAULT_KEYBOARD_BOTTOM_OFFSET,
  ref,
  ...scrollViewProps
}: EtScreenScrollViewProps) {
  const { scrollY, shouldShowTopBar, topBarConfig, headerAreaHeight, animateHalo, setHasScrollView } = useScreenContext();

  // Extract user's onScroll handler from props
  const { onScroll: userOnScroll, ...restScrollViewProps } = scrollViewProps;

  // Register that we have a ScrollView
  useEffect(() => {
    setHasScrollView(true);
    return () => setHasScrollView(false);
  }, [setHasScrollView]);

  // Determine if we need animated scroll handling
  const animationType = topBarConfig?.animation || 'collapse';
  const hasTopBarAnimation = animationType !== 'none' && shouldShowTopBar;
  const needsAnimatedScroll = hasTopBarAnimation || animateHalo;

  // Create scroll handler that updates shared value and calls user's handler
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      // Mutating shared value is intentional for Reanimated worklets
      // eslint-disable-next-line
      scrollY.value = event.contentOffset.y;

      // Call user's onScroll handler if provided
      if (userOnScroll) {
        runOnJS(userOnScroll)(wrapReanimatedScrollEvent(event));
      }
    },
  });

  const mergedContentContainerStyle = useMemo(
    () => [styles.contentContainer, shouldShowTopBar && { paddingTop: headerAreaHeight }, contentContainerStyle],
    [shouldShowTopBar, headerAreaHeight, contentContainerStyle],
  );

  let ScrollComponent: ComponentType<any>;
  if (keyboardAware) {
    ScrollComponent = needsAnimatedScroll ? AnimatedKeyboardAwareScrollView : KeyboardAwareScrollView;
  } else {
    ScrollComponent = needsAnimatedScroll ? Animated.ScrollView : ScrollView;
  }

  return (
    <ScrollComponent
      ref={ref}
      onScroll={needsAnimatedScroll ? handleScroll : userOnScroll}
      scrollEventThrottle={16}
      contentContainerStyle={mergedContentContainerStyle}
      {...restScrollViewProps}
      {...(keyboardAware ? { bottomOffset: keyboardBottomOffset, mode: 'layout' as const } : {})}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollComponent>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});

export const ScreenScrollView = memo(ScreenScrollViewComponent);
ScreenScrollView.displayName = 'EtScreen.ScrollView';
