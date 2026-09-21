import React from 'react';
import { StyleSheet, View } from 'react-native';

import { X2, X3, X4 } from '../../../../core/styles/spacing';
import { EtSkeleton } from '../../../status/skeleton/et-skeleton';
import type { AssetItemSize, AssetItemSkeletonProps, SlotType } from '../api';

const SIZE_PADDING: Record<AssetItemSize, number> = {
  large: X4,
  small: X3,
};

const LOGO_SIZE: Record<AssetItemSize, number> = {
  large: 36,
  small: 28,
};

const RATE_CHIP_PLACEHOLDER_WIDTH = 88;
const RATE_CHIP_PLACEHOLDER_HEIGHT = 28;
const RATE_CHIP_PLACEHOLDER_RADIUS = 20;

/**
 * `EtAssetItem.Skeleton` - Loading placeholder shaped like a real asset row.
 *
 * Variants:
 * - `'symbol-only'`: square logo + single primary line + small trailing bar
 * - `'2-lines'` (default): square logo + two left bars + trailing bar
 * - `'rate-chips'`: square logo + two stacked left bars + two chip-shaped placeholders
 *   (matches the `layout="trading-view"` row shape)
 *
 * Inherits `size` from the parent `EtAssetItem` unless explicitly overridden.
 */
function AssetItemSkeletonBase({ variant = '2-lines', size = 'large', style, testID }: AssetItemSkeletonProps) {
  const paddingVertical = SIZE_PADDING[size];
  const logoSize = LOGO_SIZE[size];

  let content: React.ReactNode;

  if (variant === 'symbol-only') {
    content = (
      <View style={styles.row}>
        <EtSkeleton width={logoSize} height={logoSize} variant="rounded" borderRadius={6} />
        <View style={styles.startFill}>
          <EtSkeleton width="60%" height={14} borderRadius={4} />
        </View>
        <EtSkeleton width={48} height={10} borderRadius={4} />
      </View>
    );
  } else if (variant === 'rate-chips') {
    content = (
      <View style={styles.row}>
        <EtSkeleton width={logoSize} height={logoSize} variant="rounded" borderRadius={6} />
        <View style={styles.startFill}>
          <EtSkeleton width="50%" height={14} borderRadius={4} />
          <EtSkeleton width={72} height={10} borderRadius={4} style={styles.secondLine} />
        </View>
        <View style={styles.rateChipRow}>
          <EtSkeleton
            width={RATE_CHIP_PLACEHOLDER_WIDTH}
            height={RATE_CHIP_PLACEHOLDER_HEIGHT}
            variant="rounded"
            borderRadius={RATE_CHIP_PLACEHOLDER_RADIUS}
          />
          <EtSkeleton
            width={RATE_CHIP_PLACEHOLDER_WIDTH}
            height={RATE_CHIP_PLACEHOLDER_HEIGHT}
            variant="rounded"
            borderRadius={RATE_CHIP_PLACEHOLDER_RADIUS}
          />
        </View>
      </View>
    );
  } else {
    content = (
      <View style={styles.row}>
        <EtSkeleton width={logoSize} height={logoSize} variant="rounded" borderRadius={6} />
        <View style={styles.startFill}>
          <EtSkeleton width="60%" height={14} borderRadius={4} />
          <EtSkeleton width={48} height={10} borderRadius={4} style={styles.secondLine} />
        </View>
        <EtSkeleton width={48} height={10} borderRadius={4} />
      </View>
    );
  }

  return (
    <View style={[{ paddingVertical, paddingHorizontal: X4 }, style]} testID={testID}>
      {content}
    </View>
  );
}

export const AssetItemSkeleton = React.memo(AssetItemSkeletonBase) as React.MemoExoticComponent<typeof AssetItemSkeletonBase> & {
  __SLOT_TYPE: SlotType;
};
AssetItemSkeleton.displayName = 'EtAssetItem.Skeleton';
AssetItemSkeleton.__SLOT_TYPE = 'skeleton';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X3,
  },
  startFill: {
    flex: 1,
    justifyContent: 'center',
  },
  secondLine: {
    marginTop: X2,
  },
  rateChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
});
