import { type SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

/**
 * Manages horizontal scroll state and animations for the table body.
 * Synchronizes the scroll offset between the table body and the fixed column header.
 */
export default function useEtTableHorizontalScroll(externalScrollOffsetX?: SharedValue<number>) {
  const internalScrollOffsetX = useSharedValue(0);
  const scrollOffsetX = externalScrollOffsetX ?? internalScrollOffsetX;

  const animatedBodyScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffsetX.set(event.contentOffset.x);
    },
  });

  const headerTranslateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollOffsetX.value }],
  }));

  return { scrollOffsetX, animatedBodyScrollHandler, headerTranslateStyle };
}
