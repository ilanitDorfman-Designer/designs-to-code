import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X3 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import type { AssetItemRateChipProps, SlotType } from '../api';
import { useAssetItemContext } from '../context';
import { getRateChipColors } from '../utils/get-rate-chip-colors';

const RATE_CHIP_MIN_WIDTH = 88;
const RATE_CHIP_RADIUS = 20;

/**
 * `EtAssetItem.RateChip` - Display-only sentiment-colored pill for the
 * `'trading-view'` layout.
 *
 * Compose two of them inside `EtAssetItem` (typically a Buy and a Sell rate);
 * the parent renders them in a horizontal row with a fixed gap.
 *
 * The chip is purely visual — wrap in a `Pressable` if you need an order flow.
 */
function AssetItemRateChipBase({ value, sentiment = 'neutral', label, style, testID }: AssetItemRateChipProps) {
  const { colors } = useEtoroTheme();
  // Subscribe to context so the chip cannot be used standalone; the layout
  // mismatch (chip in default layout) is warned about at the root level.
  useAssetItemContext();
  const { bg, fg } = getRateChipColors(sentiment, colors);

  return (
    <View style={[styles.container, { backgroundColor: bg }, style]} testID={testID}>
      {label ? (
        <EtText variant="caption-medium" numberOfLines={1} style={[styles.label, { color: fg }]}>
          {label}
        </EtText>
      ) : null}
      <EtText variant="num-xs" weight="medium" numberOfLines={1} style={[styles.value, { color: fg }]}>
        {value}
      </EtText>
    </View>
  );
}

export const AssetItemRateChip = React.memo(AssetItemRateChipBase) as React.MemoExoticComponent<typeof AssetItemRateChipBase> & {
  __SLOT_TYPE: SlotType;
};
AssetItemRateChip.displayName = 'EtAssetItem.RateChip';
AssetItemRateChip.__SLOT_TYPE = 'rate-chip';

const styles = StyleSheet.create({
  container: {
    minWidth: RATE_CHIP_MIN_WIDTH,
    borderRadius: RATE_CHIP_RADIUS,
    paddingHorizontal: X3,
    paddingVertical: X1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  value: {
    textAlign: 'center',
  },
});
