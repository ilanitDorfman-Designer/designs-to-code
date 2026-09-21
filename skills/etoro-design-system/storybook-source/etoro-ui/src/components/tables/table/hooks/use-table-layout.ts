import { useCallback } from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';

interface UseTableLayoutProps {
  onLayoutChange?: (width: number) => void;
  threshold?: number;
}

export function useTableLayout({ onLayoutChange, threshold = 10 }: UseTableLayoutProps = {}) {
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      const currentWidth = Dimensions.get('window').width;

      if (Math.abs(width - currentWidth) > threshold) {
        onLayoutChange?.(width);
      }
    },
    [onLayoutChange, threshold],
  );

  return { handleLayout };
}
