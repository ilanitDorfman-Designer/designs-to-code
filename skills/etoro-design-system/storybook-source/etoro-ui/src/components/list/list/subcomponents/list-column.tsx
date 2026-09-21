import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X2 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import { EtIconV2 } from '../../../et-icon-v2';
import type { ListColumnAlign, ListColumnProps, ListSortCycle, ListSortDirection, SlotType } from '../api';

const COLUMN_HIT_SLOP = { top: X2, bottom: X2, left: X2, right: X2 };

const ALIGN_TO_FLEX: Record<ListColumnAlign, 'flex-start' | 'center' | 'flex-end'> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};

/**
 * Default tap cycle for sortable `EtList.Column` cells.
 *
 * Tri-state cycle so the user can return to the data source's natural order:
 * - inactive (`null` / `undefined`) → `'asc'`
 * - `'asc'`  → `'desc'`
 * - `'desc'` → `null` (column becomes inactive; consumer resets to default)
 *
 * Exported as a public utility so consumers can compose on top of it when
 * implementing a custom `getNextSortDirection` (e.g. two-state cycle that
 * skips the `null` reset, desc-first, etc.).
 */
export const defaultSortCycle: ListSortCycle = (current) => {
  if (current === 'asc') return 'desc';
  if (current === 'desc') return null;
  return 'asc';
};

/**
 * Picks the icon name reflecting the column's current sort state.
 *
 * - active ascending  → `'angle-up'`
 * - active descending → `'angle-down'`
 * - inactive          → `'angles-up-down'` (matches the watchlist convention)
 */
function sortIconName(direction: ListSortDirection | null | undefined) {
  if (direction === 'asc') return 'angle-up' as const;
  if (direction === 'desc') return 'angle-down' as const;
  return 'angles-up-down' as const;
}

/**
 * `EtList.Column` - Single header cell inside `EtList.Header`.
 *
 * When `sortable` is `true`, renders a `Pressable` with a sort-direction
 * indicator next to the label. Sort state is consumer-owned: pass the
 * current `sortDirection` (or `null` when this column is inactive) and
 * handle the `onSortChange` callback.
 *
 * Strings passed as `children` are wrapped in an `EtText`; other nodes
 * pass through unchanged so consumers can compose icons or custom labels.
 */
function ListColumnBase({
  id,
  children,
  flex = 1,
  align = 'start',
  sortable = false,
  sortDirection,
  onSortChange,
  getNextSortDirection,
  style,
  textStyle,
  testID,
}: ListColumnProps) {
  const { colors } = useEtoroTheme();

  const handlePress = useCallback(() => {
    if (!sortable || !onSortChange) return;
    const cycle = getNextSortDirection ?? defaultSortCycle;
    onSortChange(cycle(sortDirection ?? null));
  }, [sortable, onSortChange, sortDirection, getNextSortDirection]);

  const labelNode =
    typeof children === 'string' ? (
      <EtText variant="body-secondary-medium" numberOfLines={1} style={textStyle}>
        {children}
      </EtText>
    ) : (
      children
    );

  const cellContent = (
    <View style={[styles.inner, { justifyContent: ALIGN_TO_FLEX[align] }]}>
      {labelNode}
      {sortable && <EtIconV2 name={sortIconName(sortDirection)} size="sm" color={colors.textPrimaryNeutral} />}
    </View>
  );

  if (sortable) {
    return (
      <Pressable
        onPress={handlePress}
        hitSlop={COLUMN_HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={typeof children === 'string' ? children : id}
        accessibilityState={{ selected: sortDirection != null }}
        style={[{ flex }, style]}
        testID={testID}
      >
        {cellContent}
      </Pressable>
    );
  }

  return (
    <View style={[{ flex }, style]} testID={testID}>
      {cellContent}
    </View>
  );
}

export const ListColumn = React.memo(ListColumnBase) as React.MemoExoticComponent<typeof ListColumnBase> & { __SLOT_TYPE: SlotType };
ListColumn.displayName = 'EtList.Column';
ListColumn.__SLOT_TYPE = 'column';

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X1,
  },
});
