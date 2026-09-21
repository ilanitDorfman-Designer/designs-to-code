import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useBottomSheetState } from '../../../context';
import { BOTTOM_OVERLAY_HEIGHT, LIST_PADDING_HORIZONTAL, LOADING_CONTAINER_MIN_HEIGHT } from '../et-bottom-sheet-list.const';
import type { EtBottomSheetListProps } from './et-bottom-sheet-list.types';

/**
 * EtBottomSheet.List - Virtualized FlatList for large datasets
 *
 * Use this instead of `EtBottomSheet.Content` with `scrollable` when you have:
 * - 50+ items that benefit from virtualization
 * - Complex item components that are expensive to render
 * - Performance-critical screens
 *
 * Features:
 * - Full virtualization via BottomSheetFlatList
 * - Consistent padding matching other subcomponents
 * - Loading state integration with parent sheet
 * - All FlatList props supported
 *
 * **Important:** When using List, you should provide `snapPoints` to the parent
 * EtBottomSheet instead of relying on dynamic sizing.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet bottomSheetRef={sheetRef} snapPoints={['50%', '90%']}>
 *   <EtBottomSheet.Header>
 *     <EtBottomSheet.Header.Title>Select Item</EtBottomSheet.Header.Title>
 *   </EtBottomSheet.Header>
 *   <EtBottomSheet.List
 *     data={items}
 *     renderItem={({ item }) => <ItemRow item={item} />}
 *     keyExtractor={(item) => item.id}
 *   />
 * </EtBottomSheet>
 * ```
 *
 * @example With item separator and empty state
 * ```tsx
 * <EtBottomSheet.List
 *   data={filteredItems}
 *   renderItem={({ item }) => <ItemRow item={item} />}
 *   keyExtractor={(item) => item.id}
 *   ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
 *   ListEmptyComponent={<EmptyState message="No items found" />}
 * />
 * ```
 */
export function EtBottomSheetList<T>({
  loadingPlaceholder,
  contentContainerStyle,
  style,
  bottomOverlay,
  removeClippedSubviews,
  ...props
}: EtBottomSheetListProps<T>) {
  const { isLoading } = useBottomSheetState();

  if (isLoading) {
    return <Animated.View style={[styles.loadingContainer, style]}>{loadingPlaceholder ?? <ActivityIndicator size="large" />}</Animated.View>;
  }

  return (
    <View style={styles.listWrapper}>
      <BottomSheetFlatList
        {...props}
        // `BottomSheetFlatList` is `Animated.createAnimatedComponent(RNFlatList)` and adds no guard of
        // its own, so it inherits RN's Android default of `true` and the `dispatchDraw` NPE with it.
        // EtFlatList is not usable here: the bottom sheet has to own the scrollable to drive its
        // gesture handling. Resolved with `??` so an explicit `undefined` cannot restore the default.
        removeClippedSubviews={removeClippedSubviews ?? false}
        style={[styles.list, style]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      />
      {bottomOverlay != null ? (
        <View style={styles.bottomOverlayHost} pointerEvents="none" testID="et-bottom-sheet-list-bottom-overlay-host">
          {bottomOverlay}
        </View>
      ) : null}
    </View>
  );
}

EtBottomSheetList.displayName = 'EtBottomSheet.List';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  list: {
    flex: 1,
  },
  bottomOverlayHost: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_OVERLAY_HEIGHT,
    overflow: 'visible',
    zIndex: 10,
    elevation: 10,
  },
  contentContainer: {
    paddingHorizontal: LIST_PADDING_HORIZONTAL,
  },
  loadingContainer: {
    flex: 1,
    minHeight: LOADING_CONTAINER_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
