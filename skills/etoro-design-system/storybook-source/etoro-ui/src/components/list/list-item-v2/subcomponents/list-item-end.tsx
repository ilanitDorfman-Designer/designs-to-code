import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { ListItemSlotProps, SlotType } from '../api';
import { useListItemContext } from '../context';

/**
 * EtListItem.End - Right slot for secondary/trailing content.
 *
 * Default alignment: right (alignItems: 'flex-end').
 * Override via the `style` prop, e.g. `style={{ alignItems: 'center' }}`.
 *
 * Layout behavior:
 * - start-end: flexShrink: 0 (sizes to content, not forced to 50%)
 * - start-middle-end: flex: 1 (equal width with siblings)
 */
export function ListItemEndBase({ children, style, testID }: ListItemSlotProps) {
  const { layoutMode } = useListItemContext();

  const slotStyle = layoutMode === 'start-end' ? styles.startEnd : styles.startMiddleEnd;

  return (
    <View style={[styles.base, slotStyle, style]} testID={testID}>
      {children}
    </View>
  );
}

export const ListItemEnd = React.memo(ListItemEndBase) as React.MemoExoticComponent<typeof ListItemEndBase> & {
  __SLOT_TYPE: SlotType;
};
ListItemEnd.displayName = 'EtListItem.End';
ListItemEnd.__SLOT_TYPE = 'end';

const styles = StyleSheet.create({
  base: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  startEnd: {
    flexShrink: 0,
  },
  startMiddleEnd: {
    flex: 1,
  },
});
