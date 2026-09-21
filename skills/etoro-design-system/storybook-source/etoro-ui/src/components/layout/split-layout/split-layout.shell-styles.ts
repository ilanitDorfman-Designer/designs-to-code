import { StyleSheet, type ViewStyle } from 'react-native';

import { X4, X5, X6, X9, X10 } from '../../../core/styles/spacing';
import { SPLIT_LAYOUT_COLUMN_LOGO_SLOT_HEIGHT, SPLIT_LAYOUT_CONTENT_COLUMN_WIDTH } from './split-layout.constants';

/**
 * Shared visual tokens for EtSplitLayout web shells (auth login / registration /
 * 2FA / lost-phone, and future split adoptions).
 *
 * Compose in screen `.styles.web.ts`:
 *   `style={[splitLayoutShellStyles.asideCard, local.override]}`
 * Keep screen-only rhythm (scroll base padding, stretch justify, UAE insets,
 * form↔actions gaps) in the local StyleSheet — do not fork these shared keys.
 */

const contentColumnFixed: ViewStyle = {
  alignSelf: 'center',
  width: '100%',
  maxWidth: SPLIT_LAYOUT_CONTENT_COLUMN_WIDTH,
};

export const splitLayoutShellStyles = StyleSheet.create({
  fill: {
    flex: 1,
  },

  // --- TopBar chrome (absolute overlay; never displaces content) ---
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRowMobile: {
    paddingHorizontal: X6,
    paddingVertical: X4,
  },
  /** Figma navbar: 36px (X9) padding around a 44px control row. */
  topBarRowDesktop: {
    padding: X9,
  },
  topBarStart: {
    flex: 1,
    alignItems: 'flex-start',
  },
  topBarMiddle: {
    alignItems: 'center',
  },
  topBarEnd: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // --- Main column ---
  /** Cap + center Main content (View or ScrollView contentContainer). */
  contentColumnFixed,
  /**
   * Full-width scroller with capped, vertically centered content
   * (contentContainerStyle — never a wrapping maxWidth View).
   */
  scrollContentFixed: {
    ...contentColumnFixed,
    justifyContent: 'center',
    paddingTop: X10,
    paddingBottom: X10,
  },
  /** In-column wordmark slot above titles/forms at the desktop split. */
  logoSlot: {
    height: SPLIT_LAYOUT_COLUMN_LOGO_SLOT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: X4,
  },

  // --- Aside brand card ---
  /** Full-height right card: rounded LEFT corners + 2px seam (paint bg/border via style). */
  asideCard: {
    borderTopLeftRadius: X5,
    borderBottomLeftRadius: X5,
    borderLeftWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: X6,
  },
});
