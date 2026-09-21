export interface UseDismissableOptions {
  /** The layer sits on the dismiss stack only while true (open, overlaying). */
  active: boolean;
  /** Called when this layer is the topmost one and Escape is pressed. */
  onDismiss: () => void;
}

/**
 * Native variant: no-op. Escape-to-dismiss is a web-only DOM behaviour — see
 * `use-dismissable.web.ts` (platform-split per kit convention; no
 * `Platform.OS` branches).
 */
export function useDismissable(_options: UseDismissableOptions): void {
  // Intentionally empty on native.
}
