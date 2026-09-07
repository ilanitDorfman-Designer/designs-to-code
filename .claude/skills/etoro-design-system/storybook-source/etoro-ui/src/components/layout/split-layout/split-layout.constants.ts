import { X4 } from '../../../core/styles/spacing';

/**
 * Shared metrics for EtSplitLayout web shells (auth login / registration /
 * 2FA / lost-phone, and any future split adoption).
 *
 * TopBar is `position: 'absolute'` and never displaces content — consumers
 * inset with `topBarHeight` from context. Until the first `onLayout`, that
 * value is `0`; seed short-viewport padding with
 * {@link SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT} so first paint does not jump.
 */

/** Hit-target height of a typical TopBar control (icon button / selector). */
export const SPLIT_LAYOUT_TOP_BAR_CONTROL_HEIGHT = 44;

/**
 * Pre-measure mobile TopBar height: control row + `paddingVertical: X4` top/bottom
 * (see auth `topBarRowMobile` styles). Use as
 * `paddingTop: topBarHeight || SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT`.
 */
export const SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT = SPLIT_LAYOUT_TOP_BAR_CONTROL_HEIGHT + 2 * X4;

/**
 * Fixed Main content column width for auth / marketing split screens
 * (Figma DS - React login split — includes the screen's own side padding).
 */
export const SPLIT_LAYOUT_CONTENT_COLUMN_WIDTH = 375;

/** Wordmark size inside the absolute TopBar. */
export const SPLIT_LAYOUT_TOP_BAR_WORDMARK_HEIGHT = 22;

/** Wordmark size when placed inside the Main content column (desktop/tablet). */
export const SPLIT_LAYOUT_COLUMN_WORDMARK_HEIGHT = 16;

/**
 * Vertical slot reserved for the in-column wordmark above titles/forms
 * (44px slot; wordmark itself is {@link SPLIT_LAYOUT_COLUMN_WORDMARK_HEIGHT}).
 */
export const SPLIT_LAYOUT_COLUMN_LOGO_SLOT_HEIGHT = 44;
