import React from 'react';
import { StyleSheet, View } from 'react-native';

import { EtAvatar } from '../../../social/avatar/et-avatar';
import type { AvatarSize } from '../../../social/avatar/utils/types';
import type { AssetItemLogoProps, AssetItemSize, SlotType } from '../api';
import { useAssetItemContext } from '../context';

const SIZE_MAP: Record<AssetItemSize, AvatarSize> = {
  large: 'medium',
  small: 'small',
};

/**
 * `EtAssetItem.Logo` - Square instrument avatar.
 *
 * Wraps `EtAvatar` with `variant="instrument"` and `shape="square"`. The avatar
 * size is derived from the parent `EtAssetItem` `size`, and optional fallback /
 * market-status props are forwarded to the matching avatar subcomponents:
 * - `large` → `medium` (36px)
 * - `small` → `small` (24px)
 */
function AssetItemLogoBase({
  source,
  fallback,
  imageBackgroundColor,
  marketStatus,
  marketStatusBackgroundColor,
  marketStatusTestID,
  style,
  testID,
  onError,
  accessibilityLabel,
}: AssetItemLogoProps) {
  const { size } = useAssetItemContext();
  const avatarSize = SIZE_MAP[size];

  return (
    <View style={[styles.container, style]} testID={testID}>
      <EtAvatar size={avatarSize} shape="square" variant="instrument" imageBackgroundColor={imageBackgroundColor}>
        {source ? <EtAvatar.Image src={source} onError={onError} accessibilityLabel={accessibilityLabel} /> : null}
        {fallback != null ? <EtAvatar.Fallback>{fallback}</EtAvatar.Fallback> : null}
        {marketStatus ? (
          <EtAvatar.MarketOpen testID={marketStatusTestID} status={marketStatus} backgroundColor={marketStatusBackgroundColor} />
        ) : null}
      </EtAvatar>
    </View>
  );
}

export const AssetItemLogo = React.memo(AssetItemLogoBase) as React.MemoExoticComponent<typeof AssetItemLogoBase> & { __SLOT_TYPE: SlotType };
AssetItemLogo.displayName = 'EtAssetItem.Logo';
AssetItemLogo.__SLOT_TYPE = 'logo';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
