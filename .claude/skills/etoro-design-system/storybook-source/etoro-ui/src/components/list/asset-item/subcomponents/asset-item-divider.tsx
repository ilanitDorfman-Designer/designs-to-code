import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import type { AssetItemDividerProps, SlotType } from '../api';

/**
 * `EtAssetItem.Divider` - Hairline separator below the row.
 */
function AssetItemDividerBase({ style, testID }: AssetItemDividerProps) {
  const { colors } = useEtoroTheme();

  return <View style={[styles.divider, { backgroundColor: colors.carbonSecondaryDivider }, style]} testID={testID} />;
}

export const AssetItemDivider = React.memo(AssetItemDividerBase) as React.MemoExoticComponent<typeof AssetItemDividerBase> & {
  __SLOT_TYPE: SlotType;
};
AssetItemDivider.displayName = 'EtAssetItem.Divider';
AssetItemDivider.__SLOT_TYPE = 'divider';

const styles = StyleSheet.create({
  divider: {
    height: 1.2,
    width: '100%',
  },
});
