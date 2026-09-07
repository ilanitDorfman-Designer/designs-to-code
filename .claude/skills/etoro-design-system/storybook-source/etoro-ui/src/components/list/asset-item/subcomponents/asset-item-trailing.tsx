import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { AssetItemTrailingProps, SlotType } from '../api';

/**
 * `EtAssetItem.Trailing` - Arbitrary right-side slot.
 *
 * Replaces the legacy `rightElement` prop. Use it to compose any content next
 * to the price/change column — e.g. an `EtButton`, `EtCheckbox`, icon, etc.
 *
 * Sized to its content (no flex stretching) and vertically centered.
 */
function AssetItemTrailingBase({ children, style, testID }: AssetItemTrailingProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const AssetItemTrailing = React.memo(AssetItemTrailingBase) as React.MemoExoticComponent<typeof AssetItemTrailingBase> & {
  __SLOT_TYPE: SlotType;
};
AssetItemTrailing.displayName = 'EtAssetItem.Trailing';
AssetItemTrailing.__SLOT_TYPE = 'trailing';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
