import React from 'react';
import { StyleSheet, View } from 'react-native';

import { X2 } from '../../../../core/styles/spacing';
import { EtBadge } from '../../../status/badge';
import type { AssetItemLabelProps, SlotType } from '../api';

/**
 * `EtAssetItem.Label` - Optional middle-slot pill.
 *
 * Tailored, opinionated wrapper around `EtBadge`. Uses `size="small"` and a single
 * `EtBadge.Label` child. The public API is intentionally narrow (`children`,
 * `color`) so consumers cannot drift from the design system.
 *
 * Positioned between `Content` and `Price`/`Change`, vertically centered and
 * content-sized (no flex stretching), with a small left margin.
 */
function AssetItemLabelBase({ children, color = 'neutral', style, testID }: AssetItemLabelProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <EtBadge color={color} size="small">
        <EtBadge.Label>{children}</EtBadge.Label>
      </EtBadge>
    </View>
  );
}

export const AssetItemLabel = React.memo(AssetItemLabelBase) as React.MemoExoticComponent<typeof AssetItemLabelBase> & { __SLOT_TYPE: SlotType };
AssetItemLabel.displayName = 'EtAssetItem.Label';
AssetItemLabel.__SLOT_TYPE = 'label';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginLeft: X2,
  },
});
