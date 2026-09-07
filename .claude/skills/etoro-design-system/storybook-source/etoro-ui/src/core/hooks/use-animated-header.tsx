import { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { HEADER_HEIGHT } from '../styles/constants';

export function useAnimatedHeader() {
  const headerOffset = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const previousScrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      scrollY.set(currentY);
      const diff = currentY - previousScrollY.get();
      previousScrollY.set(currentY);

      let newOffset = headerOffset.get() - diff;
      if (newOffset < -HEADER_HEIGHT + 10) {
        newOffset = -HEADER_HEIGHT;
      } else if (newOffset + 10 > 0) {
        newOffset = 0;
      }
      headerOffset.set(newOffset);
    },
  });
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerOffset.get() }],
    };
  });

  return {
    handleScroll,
    animatedHeaderStyle,
    scrollY,
  };
}
