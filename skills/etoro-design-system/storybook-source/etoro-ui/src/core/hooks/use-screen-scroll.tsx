import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { SharedValue, useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { useOptionalGlobalScroll } from '../contexts/scroll/scroll.context';

export function useScreenScroll(scrollY: SharedValue<number>, shouldAnimateHalo: boolean, options?: { isNearBottom?: SharedValue<boolean> }) {
  const globalScroll = useOptionalGlobalScroll();
  const isFocused = useSharedValue(false);

  // Create a derived value that syncs scroll only when screen is focused
  useDerivedValue(() => {
    if (isFocused.get() && globalScroll) {
      globalScroll.updateGlobalScroll(scrollY.get(), {
        isNearBottom: options?.isNearBottom?.get(),
      });
    }
    return scrollY.get();
  }, [globalScroll, scrollY]);

  // Handle focus/blur (tab switching in bottom tabs)
  useFocusEffect(
    useCallback(() => {
      isFocused.set(true);
      if (!globalScroll) {
        return () => {
          isFocused.set(false);
        };
      }

      // Re-seed the global scroll position from this screen's current offset BEFORE enabling
      // the halo animation. On blur we reset globalScrollY to 0, so a screen returned-to in a
      // scrolled state would otherwise compute full halo opacity on the first frame and then
      // fade out once the next scroll event propagates — a visible flash. Seeding here makes
      // the first painted frame already reflect the scrolled (faded) state.
      globalScroll.updateGlobalScroll(scrollY.get(), { isNearBottom: options?.isNearBottom?.get() });
      globalScroll.setAnimateHalo(shouldAnimateHalo);

      return () => {
        isFocused.set(false);
        globalScroll.unregisterActiveScroll();
      };
    }, [globalScroll, shouldAnimateHalo, isFocused, scrollY, options?.isNearBottom]),
  );

  // Handle unmount (if screen is completely removed)
  useEffect(() => {
    return () => {
      // Cleanup if component unmounts while focused (tab switching)
      globalScroll?.unregisterActiveScroll();
    };
  }, [globalScroll]);
}
