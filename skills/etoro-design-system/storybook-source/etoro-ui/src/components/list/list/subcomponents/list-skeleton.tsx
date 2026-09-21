import React, { Fragment, isValidElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { X4 } from '../../../../core/styles/spacing';
import { EtSkeleton } from '../../../status/skeleton/et-skeleton';
import type { ListSkeletonProps, SlotType } from '../api';

const DEFAULT_ROW_COUNT = 6;
const DEFAULT_ROW_HEIGHT = 56;
const DEFAULT_ROW_RADIUS = 8;

/**
 * `EtList.Skeleton` - Initial-loading placeholder rendered below the header.
 *
 * - When `children` is provided (typically the consumer's row component), it
 *   is cloned `rows` times so each placeholder matches the real row shape.
 * - Otherwise, a generic shimmer block is rendered `rows` times.
 *
 * Only rendered when `data.length === 0 && isLoading === true`.
 */
function ListSkeletonBase({ rows = DEFAULT_ROW_COUNT, children, style, testID }: ListSkeletonProps) {
  const placeholders = Array.from({ length: rows });

  // Consumer-provided row component: clone it `rows` times. The consumer owns
  // the shape (and any shimmer grouping), so we don't wrap it.
  if (children && isValidElement(children)) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        {placeholders.map((_, index) => (
          <Fragment key={`row-${index}`}>{children}</Fragment>
        ))}
      </View>
    );
  }

  // Generic placeholder rows share a single synchronized shimmer band.
  return (
    <EtSkeleton.Group style={[styles.container, style]} testID={testID}>
      {placeholders.map((_, index) => (
        <View key={`row-${index}`} style={styles.defaultRow}>
          <EtSkeleton.Box width="100%" height={DEFAULT_ROW_HEIGHT} borderRadius={DEFAULT_ROW_RADIUS} />
        </View>
      ))}
    </EtSkeleton.Group>
  );
}

export const ListSkeleton = React.memo(ListSkeletonBase) as React.MemoExoticComponent<typeof ListSkeletonBase> & { __SLOT_TYPE: SlotType };
ListSkeleton.displayName = 'EtList.Skeleton';
ListSkeleton.__SLOT_TYPE = 'skeleton';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  defaultRow: {
    paddingHorizontal: X4,
    paddingVertical: X4,
  },
});
