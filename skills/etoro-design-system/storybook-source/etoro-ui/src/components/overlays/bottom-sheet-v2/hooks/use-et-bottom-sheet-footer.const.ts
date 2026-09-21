import { X3, X6, X12 } from '../../../../core/styles/spacing';

/**
 * Footer horizontal padding.
 * Figma: px-[var(--x6,24px)]
 */
export const FOOTER_PADDING_HORIZONTAL = X6; // 24px

/**
 * Footer top padding.
 * Figma: pt-[var(--x6,24px)]
 */
export const FOOTER_PADDING_TOP = X6; // 24px

/**
 * Footer bottom padding (minimum, before safe area).
 * Figma: pb-[var(--x12,48px)]
 */
export const FOOTER_PADDING_BOTTOM = X12; // 48px

/**
 * Gap between footer buttons.
 * Figma: gap-[12px]
 */
export const FOOTER_BUTTON_GAP = X3; // 12px

/**
 * Height of the scroll fade rendered above the footer (see `EtBottomSheet.Footer`'s
 * `scrollFade` prop). Sits entirely outside the footer's own box, so it overlays the
 * scrolling content rather than the footer's opaque background.
 */
export const FOOTER_SCROLL_FADE_HEIGHT = X6; // 24px

/** testID of the scroll-fade wrapper above the footer. */
export const FOOTER_SCROLL_FADE_TEST_ID = 'et-bottom-sheet-footer-scroll-fade';

/**
 * Typical button height in the footer.
 * Based on EtButtonV2 default height.
 */
export const FOOTER_BUTTON_HEIGHT = 48;

/**
 * Calculated estimate for footer height before measurement.
 * Formula: paddingTop + buttonHeight + gap + buttonHeight + paddingBottom
 *
 * For single button: FOOTER_PADDING_TOP + FOOTER_BUTTON_HEIGHT + FOOTER_PADDING_BOTTOM = 120px
 * For two buttons: FOOTER_PADDING_TOP + FOOTER_BUTTON_HEIGHT + FOOTER_BUTTON_GAP + FOOTER_BUTTON_HEIGHT + FOOTER_PADDING_BOTTOM = 180px
 *
 * We use the TWO-button estimate as default because:
 * 1. Overestimating causes the spacer to shrink (less jarring than growing)
 * 2. Two-button footers are common (Confirm + Cancel pattern)
 * 3. After first measurement, the actual height is cached for subsequent opens
 */
export const FOOTER_HEIGHT_ESTIMATE = FOOTER_PADDING_TOP + FOOTER_BUTTON_HEIGHT + FOOTER_BUTTON_GAP + FOOTER_BUTTON_HEIGHT + FOOTER_PADDING_BOTTOM; // 24 + 48 + 12 + 48 + 48 = 180px
