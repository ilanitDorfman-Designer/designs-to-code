import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

/**
 * Hook to manage horizontal scrollable footer state and handlers.
 * Extracts scroll/pagination logic from the component for better separation of concerns.
 */
export function useFooterScrollable(children: React.ReactNode) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const contentItems = useMemo(() => React.Children.toArray(children).filter(React.isValidElement), [children]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      if (layoutMeasurement.width <= 0) return;

      const newIndex = Math.round(contentOffset.x / layoutMeasurement.width);
      const clampedIndex = Math.max(0, Math.min(newIndex, contentItems.length - 1));
      setActiveIndex(clampedIndex);
    },
    [contentItems.length],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) setContainerWidth(width);
  }, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth],
  );

  return {
    activeIndex,
    containerWidth,
    contentItems,
    handleScroll,
    handleLayout,
    getItemLayout,
    hasMultipleItems: contentItems.length > 1,
    isReady: containerWidth > 0,
  };
}
