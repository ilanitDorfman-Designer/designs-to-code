import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X3 } from '../../../core/styles/spacing';
import { EtSectionProps } from './api/types';
import { SectionContext, SectionContextValue } from './context';
import { SectionChips, SectionContent, SectionPagination, SectionSelectTitle, SectionTitle } from './subcomponents';

/**
 * EtSection - A flexible section container component
 *
 * Provides consistent layout for section-based UI patterns with:
 * - Static title (EtSection.Title)
 * - Pressable select title with chevron (EtSection.SelectTitle)
 * - Chips group (EtSection.Chips) - wraps EtChipsGroupV2 with auto fadeColor
 * - Pagination dots (EtSection.Pagination) - wraps EtPagination with section defaults
 * - Flexible content area (EtSection.Content)
 *
 * Layout specs:
 * - Gap between elements: 12px (X3)
 * - Title style: heading-base (22px semibold)
 *
 * @example With chips
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>My Watchlist</EtSection.Title>
 *   <EtSection.Chips
 *     items={chips}
 *     selectionMode="single"
 *     value={selected}
 *     onChange={setSelected}
 *   />
 * </EtSection>
 * ```
 *
 * @example With custom content
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>Settings</EtSection.Title>
 *   <EtSection.Content>
 *     <EtListItem ... />
 *   </EtSection.Content>
 * </EtSection>
 * ```
 *
 * @example With select title and chips
 * ```tsx
 * <EtSection>
 *   <EtSection.SelectTitle
 *     text="Selected Option"
 *     onPress={openPicker}
 *   />
 *   <EtSection.Chips
 *     items={chips}
 *     selectionMode="single"
 *     value={selected}
 *     onChange={setSelected}
 *   />
 * </EtSection>
 * ```
 *
 * @example With carousel and pagination
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>Featured</EtSection.Title>
 *   <Animated.FlatList horizontal data={items} onScroll={scrollHandler} ... />
 *   <EtSection.Pagination totalPages={5} currentPage={currentPageAnimated} />
 * </EtSection>
 * ```
 */
function EtSectionBase({ children, title, style, testID }: EtSectionProps) {
  const { colors } = useEtoroTheme();

  // Build context value for subcomponents
  // Memoized to prevent unnecessary re-renders of context consumers
  const contextValue: SectionContextValue = useMemo(
    () => ({
      textColor: colors.carbon900,
    }),
    [colors.carbon900],
  );

  // Handle shorthand title prop
  const hasShorthandTitle = typeof title === 'string';

  return (
    <SectionContext.Provider value={contextValue}>
      <View style={[styles.container, style]} testID={testID}>
        {hasShorthandTitle && <SectionTitle>{title}</SectionTitle>}
        {children}
      </View>
    </SectionContext.Provider>
  );
}

EtSectionBase.displayName = 'EtSection';

/**
 * Export with compound components attached
 */
export const EtSection = Object.assign(memo(EtSectionBase), {
  Title: SectionTitle,
  SelectTitle: SectionSelectTitle,
  Chips: SectionChips,
  Content: SectionContent,
  Pagination: SectionPagination,
});

const styles = StyleSheet.create({
  container: {
    gap: X3, // 12px
  },
});
