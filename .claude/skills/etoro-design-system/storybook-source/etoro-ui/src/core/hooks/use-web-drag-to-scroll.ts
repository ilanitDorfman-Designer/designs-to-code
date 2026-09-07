import type { RefObject } from 'react';

export interface UseWebDragToScrollParams {
  /**
   * Ref to the (Animated) `ScrollView` / `FlatList` scroll host whose DOM node
   * the web implementation drives. Ignored on native.
   */
  scrollRef: RefObject<unknown> | { current: unknown };
  /** Gate; when `false` the web listeners detach and the grab cursor clears. Defaults to `true`. */
  enabled?: boolean;
  /**
   * Optional imperative scroll setter for lists that manage their own scroll and reset the DOM
   * `scrollLeft` (e.g. FlashList's recyclerview). When provided, the drag calls this instead of
   * writing `node.scrollLeft`. `animated` is always `false` here (the drag follows the cursor 1:1).
   */
  scrollToOffset?: (left: number, animated: boolean) => void;
  /** Called after a real mouse drag ends, with the final scroll offset. No-op on native. */
  onDragEnd?: (offset: { x: number }) => void;
}

/**
 * Adds mouse "click-and-drag to scroll" to a horizontal scroll host on web.
 *
 * react-native-web's `ScrollView` scrolls with the wheel / trackpad, but a plain
 * mouse can only scroll horizontally via the (usually hidden) scrollbar - there
 * is no touch to swipe with. Carousels/swipers that a touch user flicks are
 * therefore effectively stuck on their first page for a mouse user. This hook
 * bridges that: on web (see the sibling `use-web-drag-to-scroll.web.ts`) it wires
 * pointer-drag on the scroll host's DOM node to `scrollLeft`, using pointer
 * capture so the drag continues outside the element, temporarily disabling CSS
 * scroll-snap for a smooth drag and restoring it on release (so it snaps to the
 * nearest item), and swallowing the trailing click so a drag never fires a tap on
 * a card. Touch pointers are ignored - native touch scrolling already handles them.
 *
 * On native it is an intentional no-op - touch drag already scrolls, so native
 * behavior is byte-identical to before this hook existed.
 *
 * @example
 * ```tsx
 * const listRef = useRef<FlatList>(null);
 * useWebDragToScroll({ scrollRef: listRef });
 * ```
 */
export function useWebDragToScroll(_params: UseWebDragToScrollParams): void {
  // Intentionally empty on native - touch drag already scrolls.
}
