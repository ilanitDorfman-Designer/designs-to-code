import { useCallback, useMemo, useRef } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { TabsMeta, TriggerLayout } from '../api/types';

/** Default animation duration in milliseconds */
const DEFAULT_ANIMATION_DURATION = 200;

interface UseTabIndicatorParams {
  /** Currently active tab value */
  activeValue: string;

  /** Duration of the indicator animation in milliseconds */
  animationDuration?: number;
}

interface UseTabIndicatorReturn {
  meta: TabsMeta;
}

/**
 * Hook for managing tab indicator animation
 *
 * Tracks trigger layouts and animates the indicator position
 * when the active tab changes. All animation logic is consolidated
 * into a single `animateToValue` method exposed on meta.
 */
export function useTabIndicator({ activeValue, animationDuration = DEFAULT_ANIMATION_DURATION }: UseTabIndicatorParams): UseTabIndicatorReturn {
  // Shared values for reanimated
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Store layouts in a ref to avoid re-renders
  const layoutsRef = useRef<Map<string, TriggerLayout>>(new Map());

  // Single source of truth for animating the indicator to a layout
  const animateToLayout = useCallback(
    (layout: TriggerLayout) => {
      indicatorX.value = withTiming(layout.x, {
        duration: animationDuration,
      });
      indicatorWidth.value = withTiming(layout.width, {
        duration: animationDuration,
      });
    },
    [animationDuration, indicatorX, indicatorWidth],
  );

  // Animate the indicator to the given tab value's registered layout
  const animateToValue = useCallback(
    (value: string) => {
      const layout = layoutsRef.current.get(value);
      if (layout) {
        animateToLayout(layout);
      }
    },
    [animateToLayout],
  );

  // Register a trigger's layout
  const registerTrigger = useCallback(
    (value: string, layout: TriggerLayout) => {
      const current = layoutsRef.current.get(value);

      // Skip if layout hasn't changed
      if (current?.x === layout.x && current?.width === layout.width) {
        return;
      }

      layoutsRef.current.set(value, layout);

      // If this is the active tab, update indicator position
      if (value === activeValue) {
        animateToLayout(layout);
      }
    },
    [activeValue, animateToLayout],
  );

  // Returns a read-only snapshot so callers cannot mutate the internal map
  const getTriggerLayouts = useCallback(() => new Map(layoutsRef.current) as ReadonlyMap<string, TriggerLayout>, []);

  // Build meta object
  const meta = useMemo<TabsMeta>(
    () => ({
      getTriggerLayouts,
      registerTrigger,
      animateToValue,
      indicatorX,
      indicatorWidth,
      animationDuration,
    }),
    [getTriggerLayouts, registerTrigger, animateToValue, indicatorX, indicatorWidth, animationDuration],
  );

  return { meta };
}
