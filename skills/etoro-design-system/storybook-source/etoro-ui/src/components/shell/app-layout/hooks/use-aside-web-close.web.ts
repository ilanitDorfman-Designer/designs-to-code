import { useDismissable } from '../../../../core/web/use-dismissable';
import type { UseAsideWebCloseOptions } from './use-aside-web-close';

/**
 * Escape dismisses the aside while it floats over main content, matching the
 * side menu's panel. Registered on the shared dismiss stack only while
 * dismissible, so when other layers (side-menu panel, FAB menu) are stacked
 * on top, one Escape closes only the topmost — never several at once.
 *
 * In-flow (≥1440) the aside is part of the page rather than something covering
 * it, so Escape does not close it — dismissing what is not overlaying anything
 * is what ARIA APG warns against.
 */
export function useAsideWebClose({ dismissible, requestClose }: UseAsideWebCloseOptions): void {
  useDismissable({ active: dismissible, onDismiss: requestClose });
}
