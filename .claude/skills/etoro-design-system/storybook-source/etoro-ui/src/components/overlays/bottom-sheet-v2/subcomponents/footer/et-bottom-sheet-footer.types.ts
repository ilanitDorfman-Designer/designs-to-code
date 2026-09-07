import { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Props for EtBottomSheet.Footer
 *
 * Note: This is a marker component - styling is handled by the parent EtBottomSheet
 * via BottomSheetFooter. The footer content is rendered with consistent padding
 * and safe area handling.
 */
export interface EtBottomSheetFooterProps {
  /** Footer children - typically EtButton components */
  children: ReactNode;

  /**
   * Render this footer without its solid background layer, so the sheet's own
   * background and any content scrolling beneath it show through.
   * The footer still keeps its padding and stays pinned at the bottom.
   * Ignored for the `glass` variant, whose footer is already transparent.
   * Default: false
   */
  transparent?: boolean;

  /**
   * Renders a gradient just above the footer that dissolves the scrolling content into it,
   * signalling there is more to scroll. Pass the **remaining distance to the bottom** in px —
   * `max(contentHeight - viewportHeight - scrollOffset, 0)` — so the gradient is visible while
   * content is still hidden below and fades out once the user bottoms out.
   *
   * Drive it from the sheet's `onScroll` / `onContentSizeChange` / `onScrollViewLayout` props;
   * the last two matter because RN never fires `onScroll` from mounting alone, so without them
   * the gradient would stay invisible until the first scroll gesture.
   *
   * Positioning is owned by the footer: the gradient sits entirely above the footer's own
   * (opaque) box, which a consumer can't place itself without knowing the footer's padding.
   */
  scrollFade?: SharedValue<number>;
}
