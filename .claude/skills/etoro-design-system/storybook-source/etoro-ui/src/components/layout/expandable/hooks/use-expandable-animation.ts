import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

const DEFAULT_ANIMATION_DURATION = 300;

interface UseExpandableAnimationOptions {
  initialExpanded: boolean;
  calculatedCollapsedHeight: number;
  animationDuration?: number;
  onExpandedChange?: (expanded: boolean) => void;
  forceNeedsExpansion?: boolean;
}

export function useExpandableAnimation({
  initialExpanded,
  calculatedCollapsedHeight,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onExpandedChange,
  forceNeedsExpansion = false,
}: UseExpandableAnimationOptions) {
  const [needsExpansion, setNeedsExpansion] = useState(false);

  // Animation SharedValues
  const contentHeight = useSharedValue(0);
  const expandProgress = useSharedValue(initialExpanded ? 1 : 0);

  // Refs for values (avoid re-renders)
  const fullHeightRef = useRef(0);
  const collapsedHeightRef = useRef(0);
  const isExpandedRef = useRef(initialExpanded);
  const hasMeasured = useRef(false);
  const collapseRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (collapseRafRef.current !== null) {
        cancelAnimationFrame(collapseRafRef.current);
      }
    };
  }, []);

  const animationConfig = useMemo(
    () => ({
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    }),
    [animationDuration],
  );

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;

      if (!hasMeasured.current) {
        hasMeasured.current = true;
        const collapsed = Math.min(height, calculatedCollapsedHeight);
        collapsedHeightRef.current = collapsed;
        contentHeight.value = initialExpanded ? height : collapsed;
        fullHeightRef.current = height;
        setNeedsExpansion(forceNeedsExpansion || height > calculatedCollapsedHeight);
        return;
      }

      fullHeightRef.current = height;
      if (!isExpandedRef.current) {
        collapsedHeightRef.current = Math.min(height, calculatedCollapsedHeight);
      }
      setNeedsExpansion(forceNeedsExpansion || height > calculatedCollapsedHeight);

      if (isExpandedRef.current) {
        contentHeight.value = withTiming(height, animationConfig);
      } else if (!forceNeedsExpansion) {
        contentHeight.value = collapsedHeightRef.current;
      }
    },
    [calculatedCollapsedHeight, initialExpanded, contentHeight, forceNeedsExpansion, animationConfig],
  );

  const handleToggle = useCallback(() => {
    if (collapseRafRef.current !== null) {
      cancelAnimationFrame(collapseRafRef.current);
      collapseRafRef.current = null;
    }

    const newExpanded = !isExpandedRef.current;
    isExpandedRef.current = newExpanded;

    const targetHeight = newExpanded ? fullHeightRef.current : collapsedHeightRef.current;

    if (newExpanded) {
      onExpandedChange?.(true);
      contentHeight.value = withTiming(targetHeight, animationConfig);
      expandProgress.value = withTiming(1, animationConfig);
    } else {
      onExpandedChange?.(false);
      collapseRafRef.current = requestAnimationFrame(() => {
        contentHeight.value = withTiming(targetHeight, animationConfig);
        expandProgress.value = withTiming(0, animationConfig);
        collapseRafRef.current = null;
      });
    }
  }, [contentHeight, expandProgress, onExpandedChange, animationConfig]);

  return {
    needsExpansion,
    contentHeight,
    expandProgress,
    isExpandedRef,
    handleContentLayout,
    handleToggle,
  };
}
