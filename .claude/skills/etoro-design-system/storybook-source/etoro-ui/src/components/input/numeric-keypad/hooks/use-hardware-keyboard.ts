import type { NumericKeyValue } from '../api';

export interface UseHardwareKeyboardParams {
  /** The keypad's accept/clamp handler, matching the on-screen digit/dot keys. */
  onKeyPress: (key: NumericKeyValue) => void;
  /** Delete-last-character handler. Pass `undefined` when the C key is disabled (empty value). */
  onClear?: () => void;
  /** Clear-all handler (on-screen long-press analog). Pass `undefined` when unavailable. */
  onClearAll?: () => void;
  /** When `true`, the keypad is frozen and ignores all physical input. */
  disabled?: boolean;
  /**
   * Focus/active gate. When `false`, this instance ignores physical keys so that
   * multiple mounted keypads don't all capture the same keystroke. Defaults to `true`.
   */
  active?: boolean;
}

/**
 * Bridges a physical/hardware keyboard to the on-screen keypad handlers.
 *
 * Native no-op: mobile already has a real OS keyboard and there is no DOM
 * `document` to listen on. The web implementation lives in the sibling
 * `use-hardware-keyboard.web.ts`, picked automatically by Metro / the web bundler,
 * so native behaviour is byte-identical to before this bridge existed.
 */
export function useHardwareKeyboard(_params: UseHardwareKeyboardParams): void {
  // Intentionally empty on native.
}
