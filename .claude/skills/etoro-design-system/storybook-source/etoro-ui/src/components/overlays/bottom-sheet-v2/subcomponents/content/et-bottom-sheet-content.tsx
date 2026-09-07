import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useBottomSheetState } from '../../context';
import { CONTENT_LOADING_MIN_HEIGHT, CONTENT_PADDING_HORIZONTAL } from './et-bottom-sheet-content.const';
import { EtBottomSheetContentProps } from './et-bottom-sheet-content.types';

/**
 * EtBottomSheet.Content - Main content area for the sheet
 *
 * Features:
 * - Optional scrolling via `scrollable` prop (parent EtBottomSheet handles the scroll container)
 * - Loading state support with customizable placeholder
 * - Dynamic sizing by default (content determines sheet height)
 *
 * Note: When `scrollable={true}`, the parent EtBottomSheet uses BottomSheetScrollView
 * as the container instead of BottomSheetView. This component just renders the content.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet.Content>
 *   <Text>Your content here</Text>
 * </EtBottomSheet.Content>
 * ```
 *
 * @example Scrollable content
 * ```tsx
 * <EtBottomSheet.Content scrollable>
 *   <LongList />
 * </EtBottomSheet.Content>
 * ```
 *
 * @example Custom loading placeholder
 * ```tsx
 * <EtBottomSheet.Content loadingPlaceholder={<MySkeleton />}>
 *   <AsyncContent />
 * </EtBottomSheet.Content>
 * ```
 */
export function EtBottomSheetContent({ children, style, loadingPlaceholder }: EtBottomSheetContentProps) {
  const { isLoading } = useBottomSheetState();

  // Show loading state
  if (isLoading) {
    return <View style={[styles.content, styles.loadingContainer, style]}>{loadingPlaceholder ?? <ActivityIndicator size="large" />}</View>;
  }

  // Content is always rendered in a View with padding
  // The parent EtBottomSheet handles the scroll container when scrollable=true
  return <View style={[styles.content, style]}>{children}</View>;
}

EtBottomSheetContent.displayName = 'EtBottomSheet.Content';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
  },
  loadingContainer: {
    minHeight: CONTENT_LOADING_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
