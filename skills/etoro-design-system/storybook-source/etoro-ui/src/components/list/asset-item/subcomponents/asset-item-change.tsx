import React from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text';
import type { AssetItemChangeProps, SlotType } from '../api';
import { useAssetItemContext } from '../context';
import { getChangeColor } from '../utils/get-change-color';

/**
 * `EtAssetItem.Change` - Pre-formatted change string with sentiment-driven color.
 *
 * Layout-aware: in the `'default'` layout it renders right-aligned (paired with
 * `Price` in the right column); in `'trading-view'` it renders left-aligned and
 * slightly smaller, sitting directly under `Symbol`/`Name`.
 *
 * Consumers pass an already-formatted string (e.g. `"1.95 (-1.03%)"`) and the
 * `sentiment` to drive the color. The component intentionally does not format
 * numbers itself.
 */
function AssetItemChangeBase({ value, sentiment = 'neutral', shrinkToFit, style, testID }: AssetItemChangeProps) {
  const { colors } = useEtoroTheme();
  const { layout } = useAssetItemContext();
  const color = getChangeColor(sentiment, colors);

  const isTradingView = layout === 'trading-view';
  // Defaults preserve prior behavior (shrink on in trading-view, off in default);
  // consumers can override — e.g. pass `false` when the value is statically sized.
  const enableShrink = shrinkToFit ?? isTradingView;

  return (
    <EtText
      variant={isTradingView ? 'num-xs' : 'num-s'}
      weight="medium"
      numberOfLines={1}
      shrinkToFit={enableShrink}
      minimumFontScale={enableShrink ? 0.75 : undefined}
      style={[isTradingView ? styles.textLeft : styles.textRight, { color }, style]}
      testID={testID}
    >
      {value}
    </EtText>
  );
}

export const AssetItemChange = React.memo(AssetItemChangeBase) as React.MemoExoticComponent<typeof AssetItemChangeBase> & { __SLOT_TYPE: SlotType };
AssetItemChange.displayName = 'EtAssetItem.Change';
AssetItemChange.__SLOT_TYPE = 'change';

const styles = StyleSheet.create({
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
});
