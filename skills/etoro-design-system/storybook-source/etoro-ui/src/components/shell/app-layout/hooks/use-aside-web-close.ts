export interface UseAsideWebCloseOptions {
  /** Only an open OVERLAY aside is dismissible: in-flow it is part of the page. */
  dismissible: boolean;
  requestClose: () => void;
}

/**
 * Native variant: no-op. Escape-to-dismiss is a web-only DOM behaviour — see
 * `use-aside-web-close.web.ts` (platform-split per kit convention; no
 * `Platform.OS` branches).
 */
export function useAsideWebClose(_options: UseAsideWebCloseOptions): void {
  // Intentionally empty on native.
}
