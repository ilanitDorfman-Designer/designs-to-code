import React from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text';
import type { AssetItemPriceProps, SlotType } from '../api';

/**
 * `EtAssetItem.Price` - Right-aligned, pre-formatted price string.
 *
 * The component does not format numbers — consumers pass already-formatted
 * strings (e.g. "$186.79"). This keeps the UI kit free of locale/currency logic.
 */
function AssetItemPriceBase({ value, style, testID }: AssetItemPriceProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText variant="num-ml" style={[styles.text, { color: colors.carbon900 }, style]} testID={testID}>
      {value}
    </EtText>
  );
}

export const AssetItemPrice = React.memo(AssetItemPriceBase) as React.MemoExoticComponent<typeof AssetItemPriceBase> & { __SLOT_TYPE: SlotType };
AssetItemPrice.displayName = 'EtAssetItem.Price';
AssetItemPrice.__SLOT_TYPE = 'price';

const styles = StyleSheet.create({
  text: {
    textAlign: 'right',
  },
});
