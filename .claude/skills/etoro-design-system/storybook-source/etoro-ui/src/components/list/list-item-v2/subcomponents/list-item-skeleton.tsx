import React from 'react';
import { StyleSheet, View } from 'react-native';

import { X2, X3, X4 } from '../../../../core/styles/spacing';
import { EtSkeleton } from '../../../status/skeleton';
import type { ListItemSize, ListItemSkeletonProps, SlotType } from '../api';

const SIZE_PADDING: Record<ListItemSize, number> = {
  large: X4,
  small: X3,
};

/**
 * EtListItem.Skeleton - Skeleton loading placeholder subcomponent.
 *
 * Must be used within an EtListItem parent (not standalone).
 * Size, style, and testID are inherited from the parent if not provided.
 *
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Skeleton variant="asset-2-lines" />
 * </EtListItem>
 * ```
 *
 * Variants:
 * - '1-line': Single bar left + small bar right
 * - '2-lines': Two bars left + one bar right
 * - 'asset-1-line': Small square + bar left + small bar right
 * - 'asset-2-lines': Large square + two bars left + bar right
 */
function ListItemSkeletonBase({ variant, size = 'large', style, testID }: ListItemSkeletonProps) {
  const paddingVertical = SIZE_PADDING[size] ?? SIZE_PADDING.large;

  const content = (() => {
    switch (variant) {
      case '1-line':
        return (
          <View style={styles.row}>
            <View style={styles.startFill}>
              <EtSkeleton width="60%" height={14} borderRadius={4} />
            </View>
            <EtSkeleton width={48} height={10} borderRadius={4} />
          </View>
        );

      case '2-lines':
        return (
          <View style={styles.row}>
            <View style={styles.startFill}>
              <EtSkeleton width="60%" height={14} borderRadius={4} />
              <EtSkeleton width={48} height={10} borderRadius={4} style={styles.secondLine} />
            </View>
            <EtSkeleton width={48} height={10} borderRadius={4} />
          </View>
        );

      case 'asset-1-line':
        return (
          <View style={styles.row}>
            <EtSkeleton width={28} height={28} variant="rounded" borderRadius={6} />
            <View style={styles.startFill}>
              <EtSkeleton width="60%" height={14} borderRadius={4} />
            </View>
            <EtSkeleton width={48} height={10} borderRadius={4} />
          </View>
        );

      case 'asset-2-lines':
        return (
          <View style={styles.row}>
            <EtSkeleton width={36} height={36} variant="rounded" borderRadius={8} />
            <View style={styles.startFill}>
              <EtSkeleton width="60%" height={14} borderRadius={4} />
              <EtSkeleton width={48} height={10} borderRadius={4} style={styles.secondLine} />
            </View>
            <EtSkeleton width={48} height={10} borderRadius={4} />
          </View>
        );

      default:
        return null;
    }
  })();

  return (
    <View style={[{ paddingVertical, paddingHorizontal: X4 }, style]} testID={testID}>
      {content}
    </View>
  );
}

export const ListItemSkeleton = React.memo(ListItemSkeletonBase) as React.MemoExoticComponent<typeof ListItemSkeletonBase> & {
  __SLOT_TYPE: SlotType;
};
ListItemSkeleton.displayName = 'EtListItem.Skeleton';
ListItemSkeleton.__SLOT_TYPE = 'skeleton';

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
});
