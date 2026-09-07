import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { X2, X3, X4, X6 } from '../../../../core/styles/spacing';
import type { ListItemLayoutMode } from '../api';

interface ListItemLayout {
  /** Padding for the list item container (same for `large` / `small`) */
  sizeStyles: ViewStyle;
  /** Horizontal gap between slots based on layout mode */
  slotGap: number;
  /** Context value to provide to slot children */
  contextValue: { layoutMode: ListItemLayoutMode };
}

const LIST_ITEM_CONTAINER_STYLE: ViewStyle = {
  paddingHorizontal: X6,
  paddingVertical: X4,
};

const SLOT_GAP: Record<ListItemLayoutMode, number> = {
  'start-only': 0,
  'start-end': X3,
  'start-middle-end': X2,
};

/**
 * Layout values for EtListItem: container padding, slot gap, and context.
 */
export function useListItemLayout(layoutMode: ListItemLayoutMode): ListItemLayout {
  const slotGap = SLOT_GAP[layoutMode];

  const contextValue = useMemo(() => ({ layoutMode }), [layoutMode]);

  return {
    sizeStyles: LIST_ITEM_CONTAINER_STYLE,
    slotGap,
    contextValue,
  };
}
