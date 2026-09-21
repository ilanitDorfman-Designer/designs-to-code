import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { AssetItemContentProps, SlotType } from '../api';
import { useAssetItemContext } from '../context';

/**
 * `EtAssetItem.Content` - Vertical container for `Symbol`/`Name`.
 *
 * Takes the remaining horizontal space (`flex: 1`) so the trailing slots
 * can hug the right edge.
 */
function AssetItemContentBase({ children, style, testID }: AssetItemContentProps) {
  useAssetItemContext();

  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const AssetItemContent = React.memo(AssetItemContentBase) as React.MemoExoticComponent<typeof AssetItemContentBase> & {
  __SLOT_TYPE: SlotType;
};
AssetItemContent.displayName = 'EtAssetItem.Content';
AssetItemContent.__SLOT_TYPE = 'content';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
