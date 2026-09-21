// NATIVE TWIN: the advanced watchlist table renders EtListItemV2.Divider (the advanced table row separator) natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/AdvancedTableView.swift (AdvancedTableRowDivider) and
// apps/etoro-mobile/modules/advanced-table/android/.../AdvancedTableView.kt (Modifier.rowDivider). A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import type { ListItemDividerProps, SlotType } from '../api';

/**
 * EtListItem.Divider - Full-width hairline separator.
 *
 * Use as a compound subcomponent of EtListItem:
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Start>...</EtListItem.Start>
 *   <EtListItem.End>...</EtListItem.End>
 *   <EtListItem.Divider />
 * </EtListItem>
 * ```
 */
function ListItemDividerBase({ style, testID }: ListItemDividerProps) {
  const { colors, dark } = useEtoroTheme();
  const backgroundColor = dark ? colors.dividerSenary : colors.dividerQuinary;

  return <View style={[styles.divider, { backgroundColor }, style]} testID={testID} />;
}

export const ListItemDivider = React.memo(ListItemDividerBase) as React.MemoExoticComponent<typeof ListItemDividerBase> & { __SLOT_TYPE: SlotType };
ListItemDivider.displayName = 'EtListItem.Divider';
ListItemDivider.__SLOT_TYPE = 'divider';

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
