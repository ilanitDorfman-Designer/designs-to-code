import type { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import type { ComponentProps, ReactNode } from 'react';
import type { DefaultSectionT } from 'react-native';

/**
 * Extract props from BottomSheetSectionList component
 */
type BottomSheetSectionListProps<ItemT, SectionT = DefaultSectionT> = ComponentProps<typeof BottomSheetSectionList<ItemT, SectionT>>;

/**
 * Props for EtBottomSheet.SectionList
 *
 * Extends BottomSheetSectionList props with consistent styling defaults.
 * Use this for grouped/sectioned data with headers.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet.SectionList
 *   sections={[
 *     { title: 'Favorites', data: favorites },
 *     { title: 'Recent', data: recent },
 *   ]}
 *   renderItem={({ item }) => <ItemRow item={item} />}
 *   renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 */
export interface EtBottomSheetSectionListProps<T, S = DefaultSectionT> extends Omit<BottomSheetSectionListProps<T, S>, 'ref'> {
  /**
   * Custom loading placeholder shown when parent sheet is in loading state.
   * Falls back to ActivityIndicator if not provided.
   */
  loadingPlaceholder?: ReactNode;
}
