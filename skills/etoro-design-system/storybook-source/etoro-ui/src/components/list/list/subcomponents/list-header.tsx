import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X3, X4 } from '../../../../core/styles/spacing';
import type { ListHeaderProps, SlotType } from '../api';

/**
 * `EtList.Header` - Pinned-at-top row of column headers.
 *
 * Renders as a horizontal flex row with theme background and a hairline
 * bottom divider. The header is positioned as a sibling above the list
 * surface so it stays visible during scroll.
 *
 * Place `EtList.Column` children inside.
 */
function ListHeaderBase({ children, style, testID }: ListHeaderProps) {
  const { colors } = useEtoroTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bgNeutralPrimary, borderBottomColor: colors.dividerSenary }, style]}
      testID={testID}
      accessibilityRole="header"
    >
      {children}
    </View>
  );
}

export const ListHeader = React.memo(ListHeaderBase) as React.MemoExoticComponent<typeof ListHeaderBase> & { __SLOT_TYPE: SlotType };
ListHeader.displayName = 'EtList.Header';
ListHeader.__SLOT_TYPE = 'header';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: X4,
    paddingVertical: X3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
