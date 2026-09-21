import React, { useState } from 'react';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { PaginationDotProps } from '../api';
import { getDotDimensions } from '../utils';

/**
 * PaginationDot - Individual dot indicator for pagination
 * Animates smoothly between selected and unselected states.
 * Supports both discrete changes (with timing animation) and
 * scroll-driven animations (using distance-based interpolation).
 *
 * Note: This is a non-interactive visual indicator, so we don't use
 * accessibilityRole="button" or "tab". Instead we use accessibilityLabel
 * and accessibilityState to communicate the current state to screen readers.
 */
function PaginationDotBase({ index, totalPages, currentPage, size, selectedColor, defaultColor }: PaginationDotProps) {
  const { height, width, selectedWidth, borderRadius } = getDotDimensions(size);

  // Calculate raw selection progress based on distance from current page
  // Distance of 0 = fully selected (progress 1), distance of 1+ = not selected (progress 0)
  // This enables smooth partial selection states during scroll
  const rawProgress = useDerivedValue(() => {
    const distance = Math.abs(currentPage.value - index);
    return interpolate(distance, [0, 1], [1, 0], Extrapolation.CLAMP);
  });

  // Animate the progress for smooth transitions when page changes discretely
  const selectionProgress = useDerivedValue(() => {
    return withTiming(rawProgress.value, {
      duration: 250,
      easing: Easing.linear,
    });
  });

  // React state for accessibility (synced from animation thread)
  // Initialize with false - useAnimatedReaction runs on mount (prevValue is null) to set the correct value
  const [selected, setSelected] = useState(false);

  // Derive whether this dot is currently selected (for accessibility)
  const isSelected = useDerivedValue(() => {
    return Math.round(currentPage.value) === index;
  });

  // Sync the isSelected SharedValue to React state for accessibility
  // On first run, prevValue is null - we always update to set the correct initial value
  useAnimatedReaction(
    () => isSelected.value,
    (newValue, prevValue) => {
      if (prevValue === null || newValue !== prevValue) {
        scheduleOnRN(setSelected, newValue);
      }
    },
    [isSelected],
  );

  // Animated style using interpolation for smooth transitions
  const animatedStyle = useAnimatedStyle(() => {
    const progress = selectionProgress.value;

    // Interpolate width: defaultWidth -> selectedWidth
    const interpolatedWidth = interpolate(progress, [0, 1], [width, selectedWidth]);

    // Interpolate color: defaultColor -> selectedColor
    const backgroundColor = interpolateColor(progress, [0, 1], [defaultColor, selectedColor]);

    return {
      width: interpolatedWidth,
      backgroundColor,
    };
  }, [width, selectedWidth, selectedColor, defaultColor]);

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Page ${index + 1} of ${totalPages}`}
      accessibilityState={{ selected }}
      style={[{ height, borderRadius }, animatedStyle]}
    />
  );
}

PaginationDotBase.displayName = 'EtPagination.Dot';

export const PaginationDot: React.NamedExoticComponent<PaginationDotProps> = React.memo(PaginationDotBase);
PaginationDot.displayName = 'EtPagination.Dot';
