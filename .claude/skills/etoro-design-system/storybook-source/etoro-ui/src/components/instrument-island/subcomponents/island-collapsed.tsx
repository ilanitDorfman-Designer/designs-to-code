import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X4 } from '../../../core/styles/spacing';
import { useInstrumentIslandContext } from '../api/context';
import { COLLAPSED_AVATAR_SIZE, DOT_GAP, DOTS_PER_SIDE } from '../utils';
import { IslandAvatar } from './island-avatar';
import { IslandDot } from './island-dot';

/**
 * The resting "pill" state: the focused instrument framed by a few neighbour
 * dots on each side. Long-pressing it expands the island into the full rail.
 */
function IslandCollapsedBase() {
  const { items, focusedIndex } = useInstrumentIslandContext();
  const focused = items[focusedIndex];
  if (focused == null) return null;

  const dots = Array.from({ length: DOTS_PER_SIDE });

  return (
    <View style={styles.row}>
      <View style={styles.dots}>
        {dots.map((_, index) => (
          <IslandDot key={`l-${index}`} faded={index === 0} />
        ))}
      </View>
      <View style={styles.avatar}>
        <IslandAvatar item={focused} size="medium" />
      </View>
      <View style={styles.dots}>
        {dots.map((_, index) => (
          <IslandDot key={`r-${index}`} faded={index === DOTS_PER_SIDE - 1} />
        ))}
      </View>
    </View>
  );
}

export const IslandCollapsed = memo(IslandCollapsedBase);
IslandCollapsed.displayName = 'EtInstrumentIsland.Collapsed';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X4,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DOT_GAP,
  },
  avatar: {
    width: COLLAPSED_AVATAR_SIZE,
    height: COLLAPSED_AVATAR_SIZE,
  },
});
