// NATIVE TWIN: the advanced watchlist table renders the horizontal end fade of the advanced table natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/AdvancedTableView.swift (AdvancedTableEndFade) and
// apps/etoro-mobile/modules/advanced-table/android/.../AdvancedTableView.kt (AdvancedTableEndFade). A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import { memo, useCallback, useMemo } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X4, X5, X8 } from '../../../../core/styles';
import { EtFadeMask } from '../../../data-display/fade-mask';
import type { EtTableColumn } from '../api';
import { computeColumnsTotalWidth, MIN_COLUMN_WIDTH } from '../utils';

const OVERFLOW_THRESHOLD = 1;

export interface EtTableHorizontalEndFadeProps {
  columns: ReadonlyArray<EtTableColumn>;
  scrollOffsetX: SharedValue<number>;
  color?: string;
  width?: number;
  fadeOutDistance?: number;
  testID?: string;
}

/**
 * Physical right-edge fade for a fixed-first-column table.
 *
 * Layout width and horizontal offset are SharedValues, so scrolling and endpoint
 * visibility stay on the UI thread without React state updates or rerenders.
 */
function EtTableHorizontalEndFadeComponent({
  columns,
  scrollOffsetX,
  color,
  width = X8,
  fadeOutDistance = X5,
  testID,
}: EtTableHorizontalEndFadeProps) {
  const { colors } = useEtoroTheme();
  const viewportWidth = useSharedValue(0);

  const { fixedColumnWidth, movingColumnsWidth } = useMemo(() => {
    const visibleColumns = columns.filter((column) => column.visible !== false);
    return {
      fixedColumnWidth: visibleColumns[0]?.width ?? MIN_COLUMN_WIDTH,
      movingColumnsWidth: computeColumnsTotalWidth(visibleColumns.slice(1)),
    };
  }, [columns]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      viewportWidth.set(event.nativeEvent.layout.width);
    },
    [viewportWidth],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const movingViewportWidth = Math.max(0, viewportWidth.get() - fixedColumnWidth - X1);
    const hasOverflow = movingColumnsWidth > movingViewportWidth + OVERFLOW_THRESHOLD;
    if (!hasOverflow) return { opacity: 0 };

    const maxScrollX = Math.max(0, movingColumnsWidth + X4 - movingViewportWidth);
    const remainingScroll = maxScrollX - scrollOffsetX.get();
    return { opacity: Math.min(Math.max(remainingScroll / Math.max(fadeOutDistance, OVERFLOW_THRESHOLD), 0), 1) };
  }, [fadeOutDistance, fixedColumnWidth, movingColumnsWidth, scrollOffsetX, viewportWidth]);

  return (
    <Animated.View pointerEvents="none" onLayout={handleLayout} style={[styles.container, animatedStyle]} testID={testID}>
      <EtFadeMask position="right" width={width} color={color ?? colors.backgroundBase} />
    </Animated.View>
  );
}

export const EtTableHorizontalEndFade = memo(EtTableHorizontalEndFadeComponent);
EtTableHorizontalEndFade.displayName = 'EtTableHorizontalEndFade';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    direction: 'ltr',
  },
});
