import { StyleSheet } from 'react-native';

import { SkeletonGroupProps } from '../api/types';
import { EtSkeleton } from '../et-skeleton';

/**
 * `EtSkeletonGroup` — a preset block of stacked text-line placeholders.
 *
 * Composes shape atoms inside a single `EtSkeleton.Group`, so all lines share
 * one shimmer band and one animation.
 */
export function EtSkeletonGroup({ lines = 3, spacing = 8, animation = 'shimmer', style }: SkeletonGroupProps) {
  const getLineWidth = (index: number) => {
    if (index === lines - 1) return '70%';
    if (index % 3 === 0) return '90%';
    return '100%';
  };

  return (
    <EtSkeleton.Group style={[styles.group, style]} animated={animation !== 'none'}>
      {Array.from({ length: lines }, (_, index) => (
        <EtSkeleton.Text key={index} width={getLineWidth(index)} height={16} style={index < lines - 1 ? { marginBottom: spacing } : undefined} />
      ))}
    </EtSkeleton.Group>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
  },
});
