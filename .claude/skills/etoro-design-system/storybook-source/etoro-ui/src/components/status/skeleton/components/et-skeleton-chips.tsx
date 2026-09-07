import { StyleSheet } from 'react-native';

import { X2 } from '../../../../core/styles';
import { SkeletonChipsProps } from '../api/types';
import { EtSkeleton } from '../et-skeleton';

/** Pill height matches `EtChip` (label lineHeight 16 + paddingVertical X2 * 2). */
const CHIP_HEIGHT = 32;
const CHIP_RADIUS = 20;
const DEFAULT_WIDTHS = [64, 84, 72, 90];

/**
 * `EtSkeleton.Chips` — a horizontal row of pill placeholders that mirrors a
 * filter-chips rail (`EtChipsGroupV2` / `EtSection.Chips`). Reserve this in the
 * exact slot the real chips will occupy during loading so the chips appearing on
 * load does not push the list down. Shimmer is synchronized through its own
 * group context; dissolve is owned by the parent EtView / EtScrollView.
 */
export function EtSkeletonChips({ count = DEFAULT_WIDTHS.length, widths, animation = 'shimmer', style, testID }: SkeletonChipsProps) {
  const pillWidths = widths ?? Array.from({ length: count }, (_, i) => DEFAULT_WIDTHS[i % DEFAULT_WIDTHS.length]);

  return (
    <EtSkeleton.Group style={[styles.row, style]} animated={animation !== 'none'} testID={testID}>
      {pillWidths.map((width, index) => (
        <EtSkeleton.Box key={index} width={width} height={CHIP_HEIGHT} borderRadius={CHIP_RADIUS} />
      ))}
    </EtSkeleton.Group>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
});
