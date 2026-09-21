import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useBottomSheetState } from '../../../context';
import { LIST_PADDING_HORIZONTAL, LIST_PADDING_VERTICAL, LOADING_CONTAINER_MIN_HEIGHT } from '../et-bottom-sheet-list.const';
import type { EtBottomSheetSectionListProps } from './et-bottom-sheet-section-list.types';

/**
 * EtBottomSheet.SectionList - Virtualized SectionList for grouped data
 *
 * Use this for sectioned/grouped data with headers, such as:
 * - Alphabetically sorted contacts
 * - Categorized settings
 * - Grouped search results
 *
 * Features:
 * - Full virtualization via BottomSheetSectionList
 * - Section header support with sticky headers
 * - Consistent padding matching other subcomponents
 * - Loading state integration with parent sheet
 *
 * **Important:** When using SectionList, you should provide `snapPoints` to the
 * parent EtBottomSheet instead of relying on dynamic sizing.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet bottomSheetRef={sheetRef} snapPoints={['50%', '90%']}>
 *   <EtBottomSheet.Header>
 *     <EtBottomSheet.Header.Title>Contacts</EtBottomSheet.Header.Title>
 *   </EtBottomSheet.Header>
 *   <EtBottomSheet.SectionList
 *     sections={[
 *       { title: 'A', data: contactsStartingWithA },
 *       { title: 'B', data: contactsStartingWithB },
 *     ]}
 *     renderItem={({ item }) => <ContactRow contact={item} />}
 *     renderSectionHeader={({ section }) => (
 *       <SectionHeader title={section.title} />
 *     )}
 *     keyExtractor={(item) => item.id}
 *   />
 * </EtBottomSheet>
 * ```
 */
export function EtBottomSheetSectionList<T, S>({ loadingPlaceholder, contentContainerStyle, style, ...props }: EtBottomSheetSectionListProps<T, S>) {
  const { isLoading } = useBottomSheetState();

  if (isLoading) {
    return <Animated.View style={[styles.loadingContainer, style]}>{loadingPlaceholder ?? <ActivityIndicator size="large" />}</Animated.View>;
  }

  return <BottomSheetSectionList {...props} style={[styles.list, style]} contentContainerStyle={[styles.contentContainer, contentContainerStyle]} />;
}

EtBottomSheetSectionList.displayName = 'EtBottomSheet.SectionList';

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: LIST_PADDING_HORIZONTAL,
    paddingVertical: LIST_PADDING_VERTICAL,
  },
  loadingContainer: {
    flex: 1,
    minHeight: LOADING_CONTAINER_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
