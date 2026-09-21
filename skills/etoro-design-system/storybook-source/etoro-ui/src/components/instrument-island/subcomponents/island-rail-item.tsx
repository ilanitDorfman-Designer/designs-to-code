import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { IslandInstrument } from '../api/types';
import { RAIL_AVATAR_SIZE, RAIL_CENTER_SPREAD, RAIL_FOCUSED_SCALE, RAIL_UNFOCUSED_SCALE, SNAP_INTERVAL, SPREAD_SIGMA } from '../utils';
import { IslandAvatar } from './island-avatar';

interface IslandRailItemProps {
  item: IslandInstrument;
  index: number;
  /** Live rail scroll offset — drives the continuous carousel scale/opacity. */
  scrollX: SharedValue<number>;
  isFocused: boolean;
  onActivate: (id: string) => void;
}

/**
 * A single avatar in the expanded rail. Its scale and opacity are derived
 * continuously from how far its slot is from the rail center, so the whole row
 * glides like a premium carousel (no per-item springs, no re-render on scroll).
 */
function IslandRailItemBase({ item, index, scrollX, isFocused, onActivate }: IslandRailItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const n = (index * SNAP_INTERVAL - scrollX.value) / SNAP_INTERVAL;
    const distance = Math.abs(n);
    // Push items away from the center (saturating with distance) so the focused
    // item gets distinct space while far items keep their tight spacing.
    const spread = RAIL_CENTER_SPREAD * Math.tanh(n / SPREAD_SIGMA);
    return {
      transform: [{ translateX: spread }, { scale: interpolate(distance, [0, 1], [RAIL_FOCUSED_SCALE, RAIL_UNFOCUSED_SCALE], Extrapolation.CLAMP) }],
      opacity: interpolate(distance, [0, 1], [1, 0.6], Extrapolation.CLAMP),
    };
  });

  return (
    <Pressable
      onPress={() => onActivate(item.id)}
      accessibilityRole="button"
      accessibilityLabel={item.label ?? item.symbol}
      accessibilityState={{ selected: isFocused }}
      style={styles.slot}
    >
      <Animated.View style={animatedStyle}>
        <IslandAvatar item={item} size="large" />
      </Animated.View>
    </Pressable>
  );
}

export const IslandRailItem = memo(IslandRailItemBase);
IslandRailItem.displayName = 'EtInstrumentIsland.RailItem';

const styles = StyleSheet.create({
  slot: {
    width: SNAP_INTERVAL,
    height: RAIL_AVATAR_SIZE * RAIL_FOCUSED_SCALE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
