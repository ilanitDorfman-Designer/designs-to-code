import { StyleSheet } from 'react-native';

import { DEFAULT_LAYOUT_PADDING } from '../../../../core/styles/constants';
import { X1, X4 } from '../../../../core/styles/spacing';

export const tableStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullHeight: {
    height: '100%',
  },
  // Locked LTR: this outer row wasn't locked like its already-LTR inner content,
  // so ambient RTL still swapped which physical edge the pinned
  // column landed on, desyncing it from the physically-left-pinned glass overlay.
  header: {
    flexDirection: 'row',
    zIndex: 1,
    direction: 'ltr',
  },
  fixedColumnContainer: {
    flexDirection: 'row',
    flex: 1,
    direction: 'ltr',
  },
  fixedColumnSection: {
    position: 'relative',
    // Logical (not paddingLeft): this section's row-order flips under RTL,
    // so the inset must track whichever physical edge it lands on.
    paddingStart: DEFAULT_LAYOUT_PADDING,
  },
  scrollableSection: {
    flex: 1,
  },
  // Locks the ScrollView's own native host (not just its `scrollableContent`)
  // to LTR — otherwise the host can still inherit an ambient RTL direction and
  // report scroll offsets from the opposite physical edge, desyncing from the
  // header's translateX compensation (PAH-676, same pattern as
  // `et-time-frame-toggle.tsx`'s `scrollableContainer`).
  scrollableScrollView: {
    direction: 'ltr',
  },
  scrollableWrapper: {
    // The scrolling section is exactly as wide as the sum of its columns. Tables
    // whose columns exceed the viewport still overflow and scroll naturally; tables
    // whose columns already fit are not forced into a horizontal scroll (PE-655).
    marginLeft: X1,
    // Locked LTR so column order here can't drift from the header's identically
    // locked `headerColumnsRow` — see that style's comment (PAH-676).
    direction: 'ltr',
  },
  // Trailing gutter at the end of the horizontal scroll. Cell content already sits
  // X2 inside its column, so this lands the last value the same visual distance
  // from the right edge as DEFAULT_LAYOUT_PADDING puts the pinned column from the left.
  //
  // Locked LTR: Android otherwise auto-mirrors a horizontal ScrollView's native
  // scroll gravity under RTL, desyncing the raw `scrollOffsetX` this content
  // reports from the header's translateX compensation (PAH-676, same pattern as
  // `financial-summary-table.tsx`'s `scrollContent`).
  scrollableContent: {
    paddingRight: X4,
    direction: 'ltr',
  },
  headerCell: {
    paddingLeft: DEFAULT_LAYOUT_PADDING,
  },
  glassContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    zIndex: -1,
  },
});
