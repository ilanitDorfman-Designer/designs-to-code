import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { X8 } from '../../../core/styles/spacing';
import {
  EXPANDED_PADDING_X,
  getCollapsedHeight,
  getCollapsedRadius,
  getCollapsedWidth,
  getExpandedHeight,
  MAX_EXPANDED_WIDTH,
  SNAP_INTERVAL,
} from '../utils';

/** Resolved pixel geometry for both island states. */
export interface IslandLayout {
  collapsedWidth: number;
  collapsedHeight: number;
  collapsedRadius: number;
  expandedWidth: number;
  expandedHeight: number;
  expandedRadius: number;
}

/**
 * Resolves the collapsed and expanded geometry of the island. The expanded
 * width sizes to its content (rail items), clamped so it never spans the whole
 * screen and always keeps its compact "island" character. A caller can still
 * pin an explicit width via `expandedWidthProp`.
 */
export function useIslandLayout(expandedWidthProp?: number, itemCount = 0): IslandLayout {
  const { width: windowWidth } = useWindowDimensions();

  return useMemo(() => {
    const collapsedWidth = getCollapsedWidth();
    const collapsedHeight = getCollapsedHeight();
    const contentWidth = itemCount * SNAP_INTERVAL + EXPANDED_PADDING_X * 2;
    const maxWidth = Math.min(windowWidth - X8 * 2, MAX_EXPANDED_WIDTH);
    const expandedWidth = expandedWidthProp ?? Math.min(maxWidth, Math.max(collapsedWidth, contentWidth));
    const expandedHeight = getExpandedHeight();

    return {
      collapsedWidth,
      collapsedHeight,
      collapsedRadius: getCollapsedRadius(),
      expandedWidth,
      expandedHeight,
      // A true capsule: ends are fully round (half the height).
      expandedRadius: expandedHeight / 2,
    };
  }, [expandedWidthProp, itemCount, windowWidth]);
}
