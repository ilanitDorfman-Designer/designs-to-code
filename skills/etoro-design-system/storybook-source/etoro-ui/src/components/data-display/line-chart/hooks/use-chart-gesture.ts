/**
 * useChartGesture Hook
 *
 * Creates and configures the pan gesture for chart interaction.
 * Uses context for stable values, receives geometry as parameter.
 */

import { ChartDataApiEquity } from '@etoro/common/types';
import * as Haptics from 'expo-haptics';
import { Gesture } from 'react-native-gesture-handler';
import { clamp, SharedValue, withTiming } from 'react-native-reanimated';
import { getYForX } from 'react-native-redash';
import { scheduleOnRN } from 'react-native-worklets';

import { useLineChartContext } from '../api';
import { FADE_ANIMATION_DURATION, LONG_PRESS_DELAY, MARKER_HIT_BUFFER, OVERLAY_ACTIVE_OPACITY } from '../constants';
import { ChartGeometry, findDataIndexAtPosition, findNearestMarkerX, MarkerPosition } from '../utils';

// ============================================================================
// Types
// ============================================================================

export interface ChartGestureParams {
  /** Chart geometry (reactive - changes with data) */
  geometry: ChartGeometry;
  /** Chart data (reactive) */
  data: ChartDataApiEquity[];
  /** Latest equity value from data */
  latestEquity: number;
  /** Selected value shared value (from parent) */
  selectedValue: SharedValue<number>;
  /** Marker positions for hit area detection */
  markerPositions: MarkerPosition[];
}

// ============================================================================
// Haptic Feedback
// ============================================================================

const triggerHaptic = () => {
  // Ignore errors (e.g., Low-Power-Mode)
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

// ============================================================================
// Hook
// ============================================================================

/**
 * Creates and returns a configured pan gesture for chart interaction.
 * Reads stable values from context, receives reactive data as parameters.
 */
export function useChartGesture({ geometry, data, latestEquity, selectedValue, markerPositions }: ChartGestureParams) {
  // Get stable values from context
  const { sharedValues, config, handlers } = useLineChartContext();

  const { width, isInteractive } = config;
  const { stepX, parsedPath } = geometry;

  const { cx, cy, overlayWidth, overlayOpacity, cursorOpacity, lastIndex, currentEquityRef, pnLRef, timestampRef, firstEquityRef } = sharedValues;

  const { onFocusModeStart, onFocusModeEnd, emitCursorData } = handlers;

  /**
   * Updates cursor position and data based on touch position.
   * Snaps to nearest marker if within hit buffer distance.
   * @param x - Chart-relative x coordinate (0 to width)
   */
  const updateCursorPosition = (x: number) => {
    'worklet';
    // Early exit if no data
    if (data.length === 0) {
      return;
    }

    let xPos = clamp(x, 0, width);

    // Check if cursor is near any marker and snap to it
    const nearestMarkerX = findNearestMarkerX(xPos, markerPositions, MARKER_HIT_BUFFER);
    if (nearestMarkerX !== null) {
      xPos = nearestMarkerX;
    }

    const boundedIndex = findDataIndexAtPosition(xPos, stepX, data.length);

    // Update cursor X position
    cx.set(xPos);

    // Safely get Y position, skip update if null
    const yPos = getYForX(parsedPath, xPos);
    if (yPos !== null) {
      cy.set(yPos);
    }

    overlayWidth.set(width - xPos);

    // Validate index bounds and only update when data point changes
    if (boundedIndex >= 0 && boundedIndex < data.length && boundedIndex !== lastIndex.get()) {
      lastIndex.set(boundedIndex);
      scheduleOnRN(triggerHaptic);

      const dataPoint = data[boundedIndex];
      selectedValue.set(dataPoint.equity);
      currentEquityRef.set(dataPoint.equity);
      pnLRef.set(dataPoint.pnL ?? 0);
      timestampRef.set(dataPoint.timestamp);
      scheduleOnRN(emitCursorData);
    }
  };

  // Configure pan gesture with dual activation:
  // 1. Long press (LONG_PRESS_DELAY) for stationary touch
  // 2. Immediate activation on horizontal pan (activeOffsetX)
  // With vertical tolerance (failOffsetY) to allow natural hand drift
  const gesture = Gesture.Pan()
    .enabled(isInteractive)
    .activateAfterLongPress(LONG_PRESS_DELAY)
    .activeOffsetX([-3, 3]) // Activate on 3px horizontal movement
    .failOffsetY([-30, 30]) // Only fail if vertical movement exceeds 30px
    .onStart((e) => {
      'worklet';
      scheduleOnRN(onFocusModeStart);
      firstEquityRef.set(data[0]?.equity ?? 0);
      selectedValue.set(withTiming(latestEquity));
      overlayOpacity.set(
        withTiming(OVERLAY_ACTIVE_OPACITY, {
          duration: FADE_ANIMATION_DURATION,
        }),
      );
      cursorOpacity.set(withTiming(1, { duration: FADE_ANIMATION_DURATION }));

      // Position cursor at initial touch point (view-relative coordinates)
      updateCursorPosition(e.x);
    })
    .onUpdate((e) => {
      'worklet';
      updateCursorPosition(e.x);
    })
    .onEnd(() => {
      'worklet';
      scheduleOnRN(onFocusModeEnd);
      selectedValue.set(withTiming(latestEquity));
      overlayOpacity.set(withTiming(0, { duration: FADE_ANIMATION_DURATION }));
      cursorOpacity.set(withTiming(0, { duration: FADE_ANIMATION_DURATION }));
      // Reset lastIndex so the same point can be selected again
      lastIndex.set(-1);
    });

  return gesture;
}
