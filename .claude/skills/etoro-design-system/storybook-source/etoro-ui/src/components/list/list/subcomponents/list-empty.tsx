import React from 'react';
import { StyleSheet, View } from 'react-native';

import { X4, X10 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import type { ListEmptyProps, SlotType } from '../api';

/**
 * `EtList.Empty` - Rendered when `data.length === 0` and no `isLoading`/`error`.
 *
 * String children are wrapped in an `EtText` for convenience; other nodes
 * pass through unchanged so consumers can render richer empty states.
 */
function ListEmptyBase({ children, style, testID }: ListEmptyProps) {
  return (
    <View style={[styles.container, style]} testID={testID} accessibilityRole="text">
      {typeof children === 'string' ? <EtText variant="body-base-medium">{children}</EtText> : children}
    </View>
  );
}

export const ListEmpty = React.memo(ListEmptyBase) as React.MemoExoticComponent<typeof ListEmptyBase> & { __SLOT_TYPE: SlotType };
ListEmpty.displayName = 'EtList.Empty';
ListEmpty.__SLOT_TYPE = 'empty';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: X4,
    paddingTop: X10,
  },
});
