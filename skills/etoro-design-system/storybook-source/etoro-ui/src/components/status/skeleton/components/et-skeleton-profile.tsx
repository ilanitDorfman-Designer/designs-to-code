import { StyleSheet, View, ViewStyle } from 'react-native';

import { SkeletonAnimation } from '../api/types';
import { EtSkeleton } from '../et-skeleton';

/**
 * `EtSkeletonProfile` — a preset profile header placeholder (avatar, name,
 * username, stats), composed inside a single `EtSkeleton.Group`.
 */
export function EtSkeletonProfile({ animation = 'shimmer', style }: { animation?: SkeletonAnimation; style?: ViewStyle }) {
  return (
    <EtSkeleton.Group style={[styles.profile, style]} animated={animation !== 'none'}>
      <EtSkeleton.Box width={80} height={80} animation={animation} style={styles.largeAvatar} />
      <EtSkeleton.Text width="60%" height={20} animation={animation} style={styles.name} />
      <EtSkeleton.Text width="40%" height={14} animation={animation} style={styles.username} />

      <View style={styles.profileStats}>
        {Array.from({ length: 3 }, (_, index) => (
          <View key={index} style={styles.profileStat}>
            <EtSkeleton.Text width={30} height={20} animation={animation} style={styles.profileStatText} />
            <EtSkeleton.Text width={50} height={12} animation={animation} />
          </View>
        ))}
      </View>
    </EtSkeleton.Group>
  );
}

const styles = StyleSheet.create({
  profile: {
    padding: 20,
    alignItems: 'center',
  },
  profileStats: {
    flexDirection: 'row',
    gap: 24,
  },
  profileStat: {
    alignItems: 'center',
  },
  largeAvatar: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  username: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  profileStatText: {
    marginBottom: 4,
  },
});
