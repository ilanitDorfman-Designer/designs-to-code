import type { UseSideMenuWebCloseOptions } from '../api/types';

/**
 * Native variant: no-op. Escape/focusout/focus-restore are web-only DOM
 * behaviors — see `use-side-menu-web-close.web.ts` (platform-split per kit
 * convention; no `Platform.OS` branches).
 */
export function useSideMenuWebClose(_options: UseSideMenuWebCloseOptions): void {
  // Intentionally empty on native.
}
