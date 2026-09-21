import { FlashList, type FlashListRef } from '@shopify/flash-list';
import React, { type Ref, useEffect, useMemo, useRef } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useScreenContext } from '../api/context';
import { EtScreenFlashListProps } from '../api/types';
import { wrapReanimatedScrollEvent } from './scroll-event-utils';

/**
 * EtScreen.FlashList - Virtualized list container using @shopify/flash-list.
 *
 * Extends FlashListProps for full native API access.
 * Automatically handles:
 * - Scroll position tracking for TopBar animations
 * - TopBar padding (when TopBar is present)
 * - Reanimated scroll component injection for animation support
 *
 * @example Basic usage
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtScreen.FlashList
 *     data={items}
 *     renderItem={({ item }) => <ItemRow item={item} />}
 *     keyExtractor={(item) => item.id}
 *   />
 * </EtScreen>
 * ```
 *
 * @example With TopBar animation
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar animation="collapse" />
 *   <EtScreen.FlashList
 *     data={items}
 *     renderItem={({ item }) => <ItemRow item={item} />}
 *     keyExtractor={(item) => item.id}
 *     onEndReached={loadMore}
 *     onEndReachedThreshold={0.5}
 *   />
 * </EtScreen>
 * ```
 */
export function ScreenFlashList<T>({ contentContainerStyle, ref, ...flashListProps }: EtScreenFlashListProps<T> & { ref?: Ref<FlashListRef<T>> }) {
  const { scrollY, shouldShowTopBar, topBarConfig, headerAreaHeight, animateHalo, setHasScrollView } = useScreenContext();

  const { onScroll: userOnScroll, ...restFlashListProps } = flashListProps;

  useEffect(() => {
    setHasScrollView(true);
    return () => setHasScrollView(false);
  }, [setHasScrollView]);

  const animationType = topBarConfig?.animation || 'collapse';
  const hasTopBarAnimation = animationType !== 'none' && shouldShowTopBar;
  const needsAnimatedScroll = hasTopBarAnimation || animateHalo;

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.set(event.contentOffset.y);

      if (userOnScroll) {
        scheduleOnRN(userOnScroll, wrapReanimatedScrollEvent(event));
      }
    },
  });

  // Keep the latest handler in a ref so the scroll component stays stable.
  // FlashList recreates its scroll component when renderScrollComponent
  // identity changes, so we must keep the component reference stable.
  const scrollHandlerRef = useRef(handleScroll);
  scrollHandlerRef.current = handleScroll;

  // Stable animated scroll component that reads the handler from the ref.
  // The worklet handler is attached directly to Animated.ScrollView,
  // bypassing FlashList's onScroll processing which can't handle worklets.
  const AnimatedScrollComponent = useMemo(
    () =>
      React.forwardRef<ScrollView, ScrollViewProps>(function ReanimatedFlashListScroll(props, scrollViewRef) {
        return (
          <Animated.ScrollView
            {...props}
            ref={scrollViewRef}
            onScroll={scrollHandlerRef.current}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          />
        );
      }),
    [],
  );

  const mergedContentContainerStyle = useMemo(
    () => [styles.contentContainer, shouldShowTopBar && { paddingTop: headerAreaHeight }, contentContainerStyle],
    [shouldShowTopBar, headerAreaHeight, contentContainerStyle],
  );

  return (
    <FlashList
      ref={ref}
      onScroll={needsAnimatedScroll ? undefined : userOnScroll}
      scrollEventThrottle={16}
      renderScrollComponent={needsAnimatedScroll ? AnimatedScrollComponent : ScrollView}
      contentContainerStyle={mergedContentContainerStyle}
      {...restFlashListProps}
      showsVerticalScrollIndicator={false}
    />
  );
}

ScreenFlashList.displayName = 'EtScreen.FlashList';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
