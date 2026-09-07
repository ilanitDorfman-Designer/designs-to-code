import React from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text';
import type { AssetItemSymbolProps, SlotType } from '../api';

const SYMBOL_LINE_HEIGHT = 20;

/**
 * `EtAssetItem.Symbol` - Primary line (e.g. "AAPL").
 *
 * Single-line, ellipsized, label-primary-semibold variant.
 */
function AssetItemSymbolBase({ children, style, testID }: AssetItemSymbolProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText
      variant="label-primary-semibold"
      numberOfLines={1}
      ellipsizeMode="tail"
      style={[styles.symbol, { color: colors.carbon900 }, style]}
      testID={testID}
    >
      {children}
    </EtText>
  );
}

export const AssetItemSymbol = React.memo(AssetItemSymbolBase) as React.MemoExoticComponent<typeof AssetItemSymbolBase> & {
  __SLOT_TYPE: SlotType;
};
AssetItemSymbol.displayName = 'EtAssetItem.Symbol';
AssetItemSymbol.__SLOT_TYPE = 'symbol';

const styles = StyleSheet.create({
  symbol: {
    lineHeight: SYMBOL_LINE_HEIGHT,
  },
});
