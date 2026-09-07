import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { ReactNode } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';

import { X5 } from '../../../../core/styles/spacing';
import { PADDING_VERTICAL } from './et-bottom-sheet.const';
import { isVirtualizedListElement } from './et-bottom-sheet-children';

/**
 * Bottom padding when no footer is present.
 * Matches horizontal content padding for visual balance.
 *
 * Exported so consumers that mirror this value in keyboard-fit or sizing
 * calculations get a compile-time reference instead of a magic number.
 */
export const BOTTOM_PADDING_NO_FOOTER = X5; // 20px

/**
 * Parameters for the layout render function
 */
export interface BottomSheetLayoutParams {
  /** Header child element */
  headerChild: ReactNode | undefined;
  /** Content child element */
  contentChild: ReactNode | undefined;
  /** Footer child element */
  footerChild: ReactNode | undefined;
  /** Whether content is scrollable */
  isScrollable: boolean;
  /** Whether content is a virtualized list */
  isVirtualizedList: boolean;
  /**
   * Forwarded to the underlying `BottomSheetScrollView` when
   * {@link isScrollable} is true. Defaults to `true` at the call site to
   * match React Native's ScrollView default.
   */
  showsVerticalScrollIndicator: boolean;
  /** Current footer height for spacer */
  footerHeight: number;
  /** Bottom safe area inset */
  bottomInset: number;
  /** Test ID for the container */
  testID: string;
  /**
   * Forwarded to `BottomSheetScrollView.onScroll` when {@link isScrollable} is true.
   * See `EtBottomSheetProps.onScroll` for the full contract.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Forwarded to `BottomSheetScrollView.onContentSizeChange` when {@link isScrollable} is true.
   * Unlike `onScroll`, this is a plain, unintercepted `ScrollView` prop — fires as soon as the
   * scrollable content mounts/resizes, before any user scroll gesture. Combine with `onLayout`
   * (viewport size) to compute an initial "remaining scroll distance" for `EtScrollHeaderFade`
   * without waiting for the user to scroll first.
   */
  onContentSizeChange?: (width: number, height: number) => void;
  /**
   * Forwarded to `BottomSheetScrollView.onLayout` when {@link isScrollable} is true — reports the
   * scroll viewport's own size (not the content's). See `onContentSizeChange`.
   */
  onScrollViewLayout?: (event: LayoutChangeEvent) => void;
}

/**
 * Renders the appropriate layout structure based on content type.
 *
 * This is a render helper function (not a React hook) that handles three layout modes:
 * 1. **Virtualized list** - Header fixed, list handles scrolling, footer spacer via contentContainerStyle
 * 2. **Scrollable content** - Header fixed, BottomSheetScrollView for content, footer spacer as View
 * 3. **Static content** - BottomSheetView for dynamic sizing, all content inline
 *
 * @returns JSX element with the appropriate layout structure
 */
export function renderBottomSheetLayout({
  headerChild,
  contentChild,
  footerChild,
  isScrollable,
  isVirtualizedList,
  showsVerticalScrollIndicator,
  footerHeight,
  bottomInset,
  testID,
  onScroll,
  onContentSizeChange,
  onScrollViewLayout,
}: BottomSheetLayoutParams): React.JSX.Element {
  // Bottom padding when no footer: use larger of design padding or safe area
  const bottomPaddingNoFooter = Math.max(BOTTOM_PADDING_NO_FOOTER, bottomInset);
  if (isVirtualizedList) {
    // Virtualized list layout:
    // - Header is fixed at top
    // - List component handles its own scrolling/virtualization
    // - Footer is fixed at bottom (via footerComponent)
    // - Padding is added via contentContainerStyle paddingBottom
    return (
      <>
        {/* Header - fixed at top */}
        {headerChild}

        {/* Virtualized list with padding injected via contentContainerStyle */}
        {isVirtualizedListElement(contentChild)
          ? React.cloneElement(contentChild, {
              contentContainerStyle: [
                contentChild.props.contentContainerStyle,
                { paddingBottom: footerChild ? footerHeight : bottomPaddingNoFooter },
              ],
            })
          : contentChild}
      </>
    );
  }

  if (isScrollable) {
    // Scrollable content layout:
    // - Header is fixed at top
    // - BottomSheetScrollView for scrollable content
    // - Footer is fixed at bottom (via footerComponent)
    return (
      <>
        {/* Header - fixed at top, not scrollable */}
        {headerChild}

        {/* Scrollable content area */}
        <BottomSheetScrollView
          testID={testID}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          onScroll={onScroll}
          onContentSizeChange={onContentSizeChange}
          onLayout={onScrollViewLayout}
        >
          {/* Content */}
          {contentChild}

          {/* Footer spacer or bottom padding when no footer */}
          <View
            style={{
              height: footerChild ? footerHeight : bottomPaddingNoFooter,
            }}
          />
        </BottomSheetScrollView>
      </>
    );
  }

  // Static content - use BottomSheetView for dynamic sizing
  return (
    <BottomSheetView testID={testID}>
      {/* Header */}
      {headerChild}

      {/* Content */}
      {contentChild}

      {/* Footer spacer or bottom padding when no footer */}
      <View style={{ height: footerChild ? footerHeight : bottomPaddingNoFooter }} />
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: PADDING_VERTICAL,
  },
});
