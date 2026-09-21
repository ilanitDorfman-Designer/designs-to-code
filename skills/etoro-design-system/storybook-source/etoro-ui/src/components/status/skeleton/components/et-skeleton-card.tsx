import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { SkeletonCardProps } from '../api/types';
import { EtSkeleton } from '../et-skeleton';

/**
 * `EtSkeletonCard` — a preset card placeholder (avatar + header + body + image).
 *
 * Everything lives in a single `EtSkeleton.Group`, so one shimmer band sweeps
 * the whole card with one animation.
 */
export function EtSkeletonCard({ avatar = true, lines = 3, actions = false, animation = 'shimmer', style }: SkeletonCardProps) {
  const { colors } = useEtoroTheme();

  return (
    <EtSkeleton.Group style={[styles.card, { backgroundColor: colors.transparent }, style]} animated={animation !== 'none'}>
      <View style={styles.cardHeader}>
        {avatar && <EtSkeleton.Circle width={48} height={48} />}
        <View style={styles.cardHeaderText}>
          <EtSkeleton.Text width="70%" height={16} style={styles.text} />
          <EtSkeleton.Text width="50%" height={12} />
        </View>
      </View>

      <View style={styles.body}>
        {Array.from({ length: lines }, (_, index) => (
          <EtSkeleton.Text key={index} width={index === lines - 1 ? '70%' : '100%'} height={16} />
        ))}
      </View>

      <EtSkeleton.Box width="100%" height={120} style={styles.bottom} />

      {actions && (
        <View style={styles.cardActions}>
          <EtSkeleton.Box width={80} height={32} />
          <EtSkeleton.Box width={60} height={32} />
        </View>
      )}
    </EtSkeleton.Group>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  text: {
    marginBottom: 8,
  },
  body: {
    marginVertical: 16,
    gap: 8,
  },
  bottom: {
    marginBottom: 16,
  },
});
