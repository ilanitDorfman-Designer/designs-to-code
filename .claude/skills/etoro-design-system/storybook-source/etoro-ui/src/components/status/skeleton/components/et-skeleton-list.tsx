import { StyleSheet, View } from 'react-native';

import { SkeletonAnimation } from '../api/types';
import { EtSkeleton } from '../et-skeleton';

/**
 * `EtSkeletonList` — a preset list of avatar + two-line rows.
 *
 * All rows live in a single `EtSkeleton.Group`, so the whole list shimmers with
 * one synchronized band and one animation regardless of item count.
 */
export function EtSkeletonList({ items = 5, animation = 'shimmer' }: { items?: number; animation?: SkeletonAnimation }) {
  return (
    <EtSkeleton.Group style={styles.list} animated={animation !== 'none'}>
      {Array.from({ length: items }, (_, index) => (
        <View key={index} style={styles.listItem}>
          <EtSkeleton.Box width={40} height={40} animation={animation} />
          <View style={styles.listItemContent}>
            <EtSkeleton.Text width="80%" height={14} animation={animation} style={styles.listItemContentText} />
            <EtSkeleton.Text width="60%" height={12} animation={animation} />
          </View>
          <EtSkeleton.Text width={60} height={12} animation={animation} />
        </View>
      ))}
    </EtSkeleton.Group>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemContentText: {
    marginBottom: 6,
  },
});
