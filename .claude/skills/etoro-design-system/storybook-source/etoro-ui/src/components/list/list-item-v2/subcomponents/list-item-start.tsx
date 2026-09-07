import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { ListItemSlotProps, SlotType } from '../api';
import { useListItemContext } from '../context';

/**
 * EtListItem.Start - Left slot for primary content.
 *
 * Default alignment: left (alignItems: 'flex-start').
 * Override via the `style` prop, e.g. `style={{ alignItems: 'center' }}`.
 *
 * Layout behavior:
 * - start-only: flex: 1 (full width, left-aligned)
 * - start-end: flex: 1 (left-aligned, takes remaining space)
 * - start-middle-end: flex: 1 (left-aligned, equal width with siblings)
 */
export function ListItemStartBase({ children, style, testID }: ListItemSlotProps) {
  // Access context to validate we're inside EtListItem
  useListItemContext();

  return (
    <View style={[styles.base, style]} testID={testID}>
      {children}
    </View>
  );
}

export const ListItemStart = React.memo(ListItemStartBase) as React.MemoExoticComponent<typeof ListItemStartBase> & { __SLOT_TYPE: SlotType };
ListItemStart.displayName = 'EtListItem.Start';
ListItemStart.__SLOT_TYPE = 'start';

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
