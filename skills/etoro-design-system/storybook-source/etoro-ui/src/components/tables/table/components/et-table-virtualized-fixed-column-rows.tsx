import { FlashList, FlashListRef } from '@shopify/flash-list';
import { memo, type Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type AnimatedStyle,
  cancelAnimation,
  clamp,
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import { DEFAULT_LAYOUT_PADDING } from '../../../../core/styles/constants';
import { X1, X4 } from '../../../../core/styles/spacing';
import { EtTableBodyFlashListProps, EtTableColumn, EtTableGlassEffect, EtTableRowProps } from '../api';
import { tableRowStyles, tableStyles } from '../styles';
import { computeColumnSnapOffsets, computeColumnsTotalWidth, MIN_COLUMN_WIDTH } from '../utils';
import GlassOverlay from './glass-overlay';

/** Horizontal travel that claims the gesture for the moving track. */
const HORIZONTAL_ACTIVATION_THRESHOLD = 10;
/** Vertical travel that hands the gesture back to the list's own scroll. */
const VERTICAL_FAIL_THRESHOLD = 10;
/**
 * How far a fling coasts, expressed as the seconds of travel at release velocity
 * that feed the snap target. Tuned to feel like the ScrollView's `decelerationRate="fast"`.
 */
const FLING_PROJECTION_SECONDS = 0.12;
/** Empty space scrollable past the last column, matching `tableStyles.scrollableContent`. */
const TRAILING_GUTTER = X4;
const SNAP_ANIMATION = { duration: 220, easing: Easing.out(Easing.cubic) };

/** Nearest column boundary to `target`, with every candidate capped to the scroll range. */
function nearestSnapOffset(target: number, snapOffsets: number[], maxScrollX: number): number {
  'worklet';
  let nearest = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;
  for (const snapOffset of snapOffsets) {
    const candidate = Math.min(snapOffset, maxScrollX);
    const distance = Math.abs(candidate - target);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearest = candidate;
    }
  }
  return nearest;
}

interface VirtualizedFixedColumnRowProps<T> {
  item: T;
  firstColumn: EtTableColumn;
  movingColumns: EtTableColumn[];
  renderColumn: EtTableRowProps<T>['renderColumn'];
  onRowClick?: EtTableRowProps<T>['onRowClick'];
  rowStyle?: EtTableRowProps<T>['style'];
  movingTrackStyle: AnimatedStyle<StyleProp<ViewStyle>>;
  movingTrackWidth: number;
}

/**
 * A single virtualized row: a static pinned cell followed by a clipped track of
 * moving cells. Nothing here scrolls natively — the track is positioned purely by
 * `movingTrackStyle` (one shared `translateX` for the whole table, the same one
 * the header uses), so the pinned cell needs no counter-animation and cannot drift
 * out of alignment with the moving cells or the header.
 */
function VirtualizedFixedColumnRowComponent<T>({
  item,
  firstColumn,
  movingColumns,
  renderColumn,
  onRowClick,
  rowStyle,
  movingTrackStyle,
  movingTrackWidth,
}: VirtualizedFixedColumnRowProps<T>) {
  const handlePress = useCallback(() => onRowClick?.(item), [onRowClick, item]);

  const firstColumnWidth = firstColumn.width ?? MIN_COLUMN_WIDTH;

  return (
    <Pressable
      testID="et-table-virtualized-fixed-column-row"
      disabled={!onRowClick}
      onPress={onRowClick ? handlePress : undefined}
      style={[tableRowStyles.container, styles.row, rowStyle]}
    >
      <View testID="et-table-virtualized-pinned-cell" style={[styles.pinnedCell, { width: firstColumnWidth }]}>
        {renderColumn(item, firstColumn)}
      </View>
      <View style={styles.movingClip}>
        <Animated.View style={[styles.movingTrack, { width: movingTrackWidth }, movingTrackStyle]}>
          {movingColumns.map((column) => (
            // Cells get the column's full width and stretch; the cell content
            // self-aligns (e.g. centered numbers, right-aligned values). Bounding
            // the width is what lets value renderers like `EtNumber` shrink-to-fit.
            <View key={column.name} style={[tableRowStyles.cell, { width: column.width ?? MIN_COLUMN_WIDTH }]}>
              {renderColumn(item, column)}
            </View>
          ))}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const VirtualizedFixedColumnRow = memo(VirtualizedFixedColumnRowComponent) as typeof VirtualizedFixedColumnRowComponent;

interface EtTableVirtualizedFixedColumnRowsProps<T> {
  items: T[];
  firstColumn: EtTableColumn;
  movingColumns: EtTableColumn[];
  renderColumn: EtTableRowProps<T>['renderColumn'];
  onRowClick?: EtTableRowProps<T>['onRowClick'];
  rowStyle?: EtTableRowProps<T>['style'];
  keyExtractor: (item: T, index: number) => string;
  scrollOffsetX: SharedValue<number>;
  onVerticalScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  footer?: React.ReactNode;
  flashListProps?: EtTableBodyFlashListProps<T>;
  flashListRef?: Ref<FlashListRef<T>>;
  glassEffect?: EtTableGlassEffect;
  /** Snap horizontal flings to column boundaries. @default true */
  snapToColumns?: boolean;
}

/**
 * Vertically-virtualized fixed-column table body.
 *
 * The `FlashList` is the outermost scroller and owns the vertical axis natively.
 * The horizontal axis has no scroller at all: a pan gesture writes `scrollOffsetX`
 * on the UI thread and every row's moving track — plus the lifted header — reads
 * that one shared value. Because the pinned column is laid out normally and never
 * transformed, and because nothing moves natively sideways, there is nothing for
 * the frozen column to race against.
 */
export default function EtTableVirtualizedFixedColumnRows<T>({
  items,
  firstColumn,
  movingColumns,
  renderColumn,
  onRowClick,
  rowStyle,
  keyExtractor,
  scrollOffsetX,
  onVerticalScroll,
  footer,
  flashListProps,
  flashListRef: externalFlashListRef,
  glassEffect,
  snapToColumns = true,
}: EtTableVirtualizedFixedColumnRowsProps<T>) {
  const internalFlashListRef = useRef<FlashListRef<T>>(null);
  const flashListRef = externalFlashListRef ?? internalFlashListRef;

  const firstColumnWidth = firstColumn.width ?? MIN_COLUMN_WIDTH;
  const movingTrackWidth = useMemo(() => computeColumnsTotalWidth(movingColumns), [movingColumns]);
  const columnSnapOffsets = useMemo(() => computeColumnSnapOffsets(movingColumns), [movingColumns]);

  // The moving track is clipped to whatever the pinned column and its X1 gap leave
  // over, so the scroll range is measured against that — not the full row width.
  // Offsets therefore share an origin with `columnSnapOffsets` and the header's
  // `translateX`, all three counted from the first moving column.
  const [viewportWidth, setViewportWidth] = useState(0);
  const movingViewportWidth = Math.max(0, viewportWidth - firstColumnWidth - X1);
  // The scroll range runs X4 past the last column, standing in for the trailing
  // gutter `tableStyles.scrollableContent` gives the non-virtualized body: at full
  // scroll the last value keeps the same distance from the right edge as
  // DEFAULT_LAYOUT_PADDING puts the pinned column from the left. Extending the
  // range rather than the track width keeps column geometry — and so the header's
  // matching translateX — untouched.
  const maxScrollX = Math.max(0, movingTrackWidth + TRAILING_GUTTER - movingViewportWidth);

  const handleLayout = useCallback((event: LayoutChangeEvent) => setViewportWidth(event.nativeEvent.layout.width), []);

  // A narrower viewport (rotation, column changes) can strand the offset past the
  // new end of the track, leaving a gap where the last column used to be. An
  // in-flight snap is cancelled unconditionally: its target was computed against
  // the old range, so even an offset that is still in bounds right now would
  // animate past the new end.
  useEffect(() => {
    cancelAnimation(scrollOffsetX);
    scrollOffsetX.set(Math.min(scrollOffsetX.get(), maxScrollX));
  }, [maxScrollX, scrollOffsetX]);

  const dragStartOffsetX = useSharedValue(0);
  // True while a free-scroll fling coasts. Drives the touch shield below; snap-mode
  // animations are short and end on a column edge, so only the decay path sets it.
  const isGliding = useSharedValue(false);
  // Bumped per decay so only the CURRENT decay's completion may lower the shield. Reanimated
  // reports a cancelled animation's `finished=false` on its next frame step, not at cancel
  // time — without the generation check, a fling started in the same frame its predecessor
  // was cancelled would have its shield dropped by the predecessor's late callback.
  const glideGeneration = useSharedValue(0);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        // Claim horizontal intent only: a vertical drag fails the gesture so the
        // FlashList keeps its native scroll, and a tap never activates it at all,
        // which leaves row presses working.
        .activeOffsetX([-HORIZONTAL_ACTIVATION_THRESHOLD, HORIZONTAL_ACTIVATION_THRESHOLD])
        .failOffsetY([-VERTICAL_FAIL_THRESHOLD, VERTICAL_FAIL_THRESHOLD])
        // Stop a coasting fling on touch-down, on the UI thread and in order with the pan
        // worklets. Cancelling from the shield's JS responder instead raced them under JS
        // load: a cancel arriving after `onEnd` killed the NEXT fling, not the one the touch
        // meant to stop. Snap-mode animations are left alone — a tap mid-snap must still land
        // on a column edge.
        .onTouchesDown(() => {
          if (!isGliding.get()) {
            return;
          }
          cancelAnimation(scrollOffsetX);
          isGliding.set(false);
        })
        .onStart(() => {
          cancelAnimation(scrollOffsetX);
          dragStartOffsetX.set(scrollOffsetX.get());
        })
        .onUpdate((event) => {
          scrollOffsetX.set(clamp(dragStartOffsetX.get() - event.translationX, 0, maxScrollX));
        })
        .onEnd((event) => {
          // Free scroll: a clamped decay lets the fling settle anywhere; snap mode
          // animates to the nearest column boundary.
          if (!snapToColumns) {
            const generation = glideGeneration.get() + 1;
            glideGeneration.set(generation);
            isGliding.set(true);
            // deceleration matches the non-virtualized path's ScrollView `decelerationRate="fast"`
            // (~0.99) — withDecay's 0.998 default coasts noticeably longer than the native feel.
            scrollOffsetX.set(
              withDecay({ velocity: -event.velocityX, deceleration: 0.99, clamp: [0, maxScrollX] }, () => {
                if (glideGeneration.get() === generation) {
                  isGliding.set(false);
                }
              }),
            );
            return;
          }
          const projected = scrollOffsetX.get() - event.velocityX * FLING_PROJECTION_SECONDS;
          scrollOffsetX.set(withTiming(nearestSnapOffset(projected, columnSnapOffsets, maxScrollX), SNAP_ANIMATION));
        }),
    [scrollOffsetX, dragStartOffsetX, maxScrollX, columnSnapOffsets, snapToColumns, isGliding, glideGeneration],
  );

  // A touch during a coasting fling must STOP the glide, never press whatever cell happens
  // to be passing under the finger — the same swallow a native ScrollView gives the
  // momentum-stopping tap. The shield intercepts only while gliding (pointerEvents flips on
  // the shared value, so an idle table pays nothing). Stopping is the pan gesture's job
  // (`onTouchesDown` above); the shield only claims the responder so the press never reaches
  // the cell underneath.
  const glideShieldStyle = useAnimatedStyle(() => ({ pointerEvents: isGliding.get() ? ('auto' as const) : ('none' as const) }));

  // One animated style drives every row's track. Reanimated applies it to all of
  // them from a single worklet run, so rows can't disagree about where the track is.
  const movingTrackStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ translateX: -scrollOffsetX.get() }],
  }));

  const { onScroll: flashListOnScroll, ListFooterComponent: flashListFooter, ...restFlashListProps } = flashListProps ?? {};

  // Both the table-level vertical scroll handler and any consumer-supplied
  // FlashList onScroll must fire — spreading flashListProps must neither clobber
  // nor be clobbered by our onVerticalScroll.
  const handleVerticalScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onVerticalScroll?.(event);
      flashListOnScroll?.(event);
    },
    [onVerticalScroll, flashListOnScroll],
  );

  // Our footer takes precedence; otherwise honor a consumer-supplied
  // ListFooterComponent instead of silently discarding it. Hand FlashList an
  // *element* rather than a component (it accepts either): a freshly-declared
  // component is a new element type on every render, so React would unmount and
  // remount the footer subtree — tearing down any state it owns, such as a
  // disclosures bottom sheet the user has open. An element keeps the type stable.
  const listFooterComponent = footer ? (
    <Animated.View testID="et-table-virtualized-footer" style={{ width: viewportWidth }}>
      {footer}
    </Animated.View>
  ) : (
    flashListFooter
  );

  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <VirtualizedFixedColumnRow<T>
        item={item}
        firstColumn={firstColumn}
        movingColumns={movingColumns}
        renderColumn={renderColumn}
        onRowClick={onRowClick}
        rowStyle={rowStyle}
        movingTrackStyle={movingTrackStyle}
        movingTrackWidth={movingTrackWidth}
      />
    ),
    [firstColumn, movingColumns, renderColumn, onRowClick, rowStyle, movingTrackStyle, movingTrackWidth],
  );

  return (
    <View testID="et-table-virtualized-fixed-column-body" style={styles.wrapper} onLayout={handleLayout}>
      {/* Mirrors the non-virtualized fixed-column body: a scroll-reactive glass edge
          behind the frozen column that fades in on horizontal scroll. The pinned
          cells must stay unfilled for it to read through — an opaque column would
          hide it outright, since the overlay sits behind the list. */}
      {!glassEffect?.disabled && (
        <View style={[tableStyles.glassContainer, { width: firstColumnWidth }]} pointerEvents="none" testID="et-table-fixed-column-body-glass">
          <GlassOverlay
            scrollOffsetX={scrollOffsetX}
            glassEffect={{
              blurIntensity: 10,
              ...glassEffect,
            }}
          />
        </View>
      )}
      <GestureDetector gesture={panGesture}>
        <View style={styles.listContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.glideShield, glideShieldStyle]} onStartShouldSetResponder={returnTrue} />
          <FlashList<T>
            ref={flashListRef}
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            // FlashList v2 enables this by default, which re-anchors scroll position by
            // guessing which row stayed visible across a data change. With filter toggles
            // changing both item count and order, it misattributes the anchor — a stale row
            // stays pinned at the top and the list jumps to an offset the user never scrolled
            // to. This is FlashList's own documented workaround for that failure mode
            // (https://shopify.github.io/flash-list/docs/known-issues#3-data-re-ordering-can-cause-items-to-move).
            maintainVisibleContentPosition={{ disabled: true }}
            {...restFlashListProps}
            onScroll={handleVerticalScroll}
            ListFooterComponent={listFooterComponent}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

/** Stable responder predicate for the glide shield. */
const returnTrue = () => true;

const styles = StyleSheet.create({
  glideShield: {
    zIndex: 1,
  },
  wrapper: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  // Locked LTR to match the header's identically locked `headerColumnsRow`,
  // otherwise ambient RTL flips which physical edge the pinned column lands on
  // while the header's translateX keeps counting from the other one (PAH-676).
  row: {
    direction: 'ltr',
  },
  // Frozen first column. Plain layout, no transform: it is outside the moving
  // track, so nothing can push it sideways.
  pinnedCell: {
    justifyContent: 'center',
    paddingStart: DEFAULT_LAYOUT_PADDING,
  },
  // Clips the track to the space the pinned column leaves, standing in for the
  // scroll viewport that used to do the clipping.
  movingClip: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  movingTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: X1,
    direction: 'ltr',
  },
});
