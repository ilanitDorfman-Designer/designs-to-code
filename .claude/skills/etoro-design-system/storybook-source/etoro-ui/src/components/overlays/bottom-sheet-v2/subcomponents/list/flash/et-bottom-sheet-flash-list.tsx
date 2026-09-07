import { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { ActivityIndicator, type LayoutChangeEvent, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { EtFadeMask } from '../../../../../data-display/fade-mask';
import { useBottomSheetState } from '../../../context';
import { LIST_PADDING_VERTICAL, LOADING_CONTAINER_MIN_HEIGHT } from '../et-bottom-sheet-list.const';
import type { EtBottomSheetFlashListProps } from './et-bottom-sheet-flash-list.types';

// Platform-specific draw distance to minimize blank cells during fast scrolling
// Android needs higher values due to slower rendering pipeline
const DEFAULT_DRAW_DISTANCE = Platform.select({
  android: 1700, // Android needs more aggressive pre-rendering
  ios: 1200,
  default: 1200,
});

/**
 * EtBottomSheet.FlashList - High-performance virtualized list using @shopify/flash-list
 *
 * Use this for the best performance with large lists (100+ items) or complex item components.
 * FlashList uses cell recycling for better memory efficiency and smoother scrolling.
 *
 * Features:
 * - Cell recycling for optimal performance
 * - Bottom sheet gesture integration (handled internally)
 * - Consistent padding matching other subcomponents
 * - Loading state integration with parent sheet (customizable via `loadingPlaceholder`)
 * - Automatic size estimation (no need to provide `estimatedItemSize`)
 *
 * **Important:** When using FlashList, you should provide `snapPoints` to the parent
 * EtBottomSheet instead of relying on dynamic sizing.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet bottomSheetRef={sheetRef} snapPoints={['50%', '90%']}>
 *   <EtBottomSheet.Header>
 *     <EtBottomSheet.Header.Title>Select Item</EtBottomSheet.Header.Title>
 *   </EtBottomSheet.Header>
 *   <EtBottomSheet.FlashList
 *     data={items}
 *     renderItem={({ item }) => <ItemRow item={item} />}
 *     keyExtractor={(item) => item.id}
 *   />
 * </EtBottomSheet>
 * ```
 */
export function EtBottomSheetFlashList<T>({
  loadingPlaceholder,
  contentContainerStyle,
  style,
  drawDistance = DEFAULT_DRAW_DISTANCE,
  showEdgeFades = false,
  edgeFadeColor,
  edgeFadeHeight,
  ...props
}: EtBottomSheetFlashListProps<T>) {
  const { isLoading } = useBottomSheetState();
  const { height: screenHeight } = useWindowDimensions();

  // Track container height - FlashList needs explicit dimensions to virtualize properly
  // Without this, FlashList renders ALL items instead of only visible ones (GitHub issue #1972)
  // Use 70% of screen height as initial estimate until actual measurement
  const [containerHeight, setContainerHeight] = useState<number>(screenHeight * 0.7);

  // Create a scroll component that integrates with bottom sheet gestures
  const BottomSheetScrollComponent = useBottomSheetScrollableCreator();

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== containerHeight) {
      setContainerHeight(height);
    }
  };

  if (isLoading) {
    return <View style={[styles.loadingContainer, style]}>{loadingPlaceholder ?? <ActivityIndicator size="large" />}</View>;
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <FlashList
        {...props}
        // Aggressive draw distance to minimize blank cells during fast scrolling
        drawDistance={drawDistance}
        renderScrollComponent={BottomSheetScrollComponent}
        // FlashList needs explicit pixel height to virtualize properly in bottom sheets
        // flex: 1 alone doesn't work - FlashList needs actual numeric dimensions
        style={StyleSheet.flatten([{ height: containerHeight }, style])}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        // maintainVisibleContentPosition is enabled by default in FlashList v2
        // to reduce visible glitches when content changes. Do not disable.
      />
      {showEdgeFades ? (
        <>
          <EtFadeMask position="top" offset={0} height={edgeFadeHeight} color={edgeFadeColor} />
          <EtFadeMask position="bottom" offset={0} height={edgeFadeHeight} color={edgeFadeColor} />
        </>
      ) : null}
    </View>
  );
}

EtBottomSheetFlashList.displayName = 'EtBottomSheet.FlashList';

const styles = StyleSheet.create({
  container: {
    // Container measures itself and provides explicit height to FlashList
    // This fixes the virtualization issue where FlashList renders all items
    // instead of only visible ones (GitHub gorhom/bottom-sheet issue #1972)
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: LIST_PADDING_VERTICAL,
  },
  loadingContainer: {
    flex: 1,
    minHeight: LOADING_CONTAINER_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
