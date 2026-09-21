import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { ListItemSlotProps, SlotType } from '../api';
import { useListItemContext } from '../context';

/**
 * EtListItem.Middle - Center slot for secondary content.
 *
 * Default alignment: center (alignItems: 'center').
 * Override via the `style` prop, e.g. `style={{ alignItems: 'flex-start' }}`.
 *
 * Only used in 3-slot mode (start-middle-end).
 * All three slots get equal width (flex: 1).
 */
export function ListItemMiddleBase({ children, style, testID }: ListItemSlotProps) {
  // Access context to validate we're inside EtListItem
  useListItemContext();

  return (
    <View style={[styles.base, style]} testID={testID}>
      {children}
    </View>
  );
}

export const ListItemMiddle = React.memo(ListItemMiddleBase) as React.MemoExoticComponent<typeof ListItemMiddleBase> & { __SLOT_TYPE: SlotType };
ListItemMiddle.displayName = 'EtListItem.Middle';
ListItemMiddle.__SLOT_TYPE = 'middle';

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
