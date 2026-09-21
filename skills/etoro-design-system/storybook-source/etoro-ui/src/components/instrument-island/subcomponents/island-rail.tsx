import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import Animated, { AnimatedRef, runOnJS, SharedValue, useAnimatedReaction, useAnimatedScrollHandler, useDerivedValue } from 'react-native-reanimated';

import { useInstrumentIslandContext } from '../api/context';
import { clampIndex, nearestIndexForOffset, SNAP_INTERVAL } from '../utils';
import { IslandRailItem } from './island-rail-item';

interface IslandRailProps {
  /** Inner width available to the rail (expanded island width minus horizontal padding). */
  innerWidth: number;
  /** Shared scroll offset, written here and read by every rail item + the scrub gesture. */
  scrollX: SharedValue<number>;
  /** Animated ref to the ScrollView so the hold-scrub can drive it on the UI thread. */
  scrollRef: AnimatedRef<Animated.ScrollView>;
}

/**
 * Horizontally scrollable, center-snapping rail of instrument avatars. Scroll
 * position is published to a shared value so items interpolate their own
 * scale/opacity (premium carousel), and focus + a per-instrument haptic fire as
 * each one crosses the center — for both a free swipe and the hold-scrub.
 */
function IslandRailBase({ innerWidth, scrollX, scrollRef }: IslandRailProps) {
  const { items, focusedIndex, displayIndex, isExpanded, isScrubbing, onCross, onSettle, onItemActivate } = useInstrumentIslandContext();

  // Pad by the slot width (not the avatar size) so snap offset i*SNAP_INTERVAL
  // lands slot i exactly on the rail center — aligned with the centered label —
  // and the first/last items can still reach the middle.
  const sidePadding = Math.max(0, (innerWidth - SNAP_INTERVAL) / 2);
  const snapOffsets = useMemo(() => items.map((_, index) => index * SNAP_INTERVAL), [items]);

  // Captured once. Bound only to mount — a live `focusedIndex * SNAP_INTERVAL`
  // would be re-applied on every settle re-render, force-jumping the native
  // snap mid-flight (the "cut"). Open-time centering is handled imperatively.
  const initialOffset = useRef(focusedIndex * SNAP_INTERVAL).current;

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Per-crossing label/haptic update (cheap, island-local). A stable callback
  // reading a ref avoids stale closures inside the worklet.
  const onCrossRef = useRef(onCross);
  onCrossRef.current = onCross;
  const emitCross = useCallback((index: number) => onCrossRef.current(index), []);

  const count = items.length;
  const derivedIndex = useDerivedValue(() => clampIndex(Math.round(scrollX.value / SNAP_INTERVAL), count), [count]);
  useAnimatedReaction(
    () => derivedIndex.value,
    (current, previous) => {
      if (previous != null && current !== previous) runOnJS(emitCross)(current);
    },
  );

  // Motion settled (free-swipe): propagate the resting focus to the parent once.
  const handleSettle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onSettle(nearestIndexForOffset(event.nativeEvent.contentOffset.x, SNAP_INTERVAL, items.length));
  };

  // Center the selected item only when the island opens — never mid-scroll, so
  // the carousel never fights the finger or the controlled focus updates.
  const hasCentered = useRef(false);
  useEffect(() => {
    if (!isExpanded) {
      hasCentered.current = false;
      return;
    }
    if (hasCentered.current) return;
    hasCentered.current = true;
    scrollRef.current?.scrollTo({ x: focusedIndex * SNAP_INTERVAL, animated: false });
  }, [isExpanded, focusedIndex, scrollRef]);

  const handleContentSizeChange = () => {
    if (!hasCentered.current) scrollRef.current?.scrollTo({ x: focusedIndex * SNAP_INTERVAL, animated: false });
  };

  return (
    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      scrollEnabled={!isScrubbing}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToOffsets={snapOffsets}
      disableIntervalMomentum
      scrollEventThrottle={16}
      onScroll={onScroll}
      onMomentumScrollEnd={handleSettle}
      onScrollEndDrag={handleSettle}
      contentOffset={{ x: initialOffset, y: 0 }}
      onContentSizeChange={handleContentSizeChange}
      contentContainerStyle={[styles.content, { paddingHorizontal: sidePadding }]}
      style={[styles.scroll, { width: innerWidth }]}
    >
      {items.map((item, index) => (
        <IslandRailItem key={item.id} item={item} index={index} scrollX={scrollX} isFocused={index === displayIndex} onActivate={onItemActivate} />
      ))}
    </Animated.ScrollView>
  );
}

export const IslandRail = memo(IslandRailBase);
IslandRail.displayName = 'EtInstrumentIsland.Rail';

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    alignItems: 'center',
  },
});
