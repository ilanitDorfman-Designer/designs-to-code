import React from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text';
import type { AssetItemNameProps, SlotType } from '../api';

const NAME_LINE_HEIGHT = 20;

/**
 * `EtAssetItem.Name` - Secondary line (e.g. "Apple Inc").
 *
 * Single-line, ellipsized, label-tertiary-regular variant.
 */
function AssetItemNameBase({ children, style, testID }: AssetItemNameProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtText
      variant="label-tertiary-regular"
      numberOfLines={1}
      ellipsizeMode="tail"
      style={[styles.name, { color: colors.carbon600 }, style]}
      testID={testID}
    >
      {children}
    </EtText>
  );
}

export const AssetItemName = React.memo(AssetItemNameBase) as React.MemoExoticComponent<typeof AssetItemNameBase> & { __SLOT_TYPE: SlotType };
AssetItemName.displayName = 'EtAssetItem.Name';
AssetItemName.__SLOT_TYPE = 'name';

const styles = StyleSheet.create({
  name: {
    lineHeight: NAME_LINE_HEIGHT,
  },
});
