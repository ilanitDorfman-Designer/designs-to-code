import type { RefObject } from 'react';

/** Resting scroll offset reported when web scrolling comes to rest. */
export interface WebScrollSettleOffset {
  x: number;
  y: number;
}

export interface UseWebScrollSettleParams {
  /**
   * Ref to the (Animated) `ScrollView` / `FlashList` scroll host whose DOM node
   * the web implementation watches. Ignored on native.
   */
  scrollRef: RefObject<unknown> | { current: unknown };
  /**
   * Fired once when scrolling settles - the web analog of the RN
   * `onMomentumScrollEnd` / `onScrollEndDrag` pair. Never called on native.
   */
  onSettle: (offset: WebScrollSettleOffset) => void;
  /** Idle window (ms) after the final scroll event before a settle fires. */
  debounceMs?: number;
  /** Gate; when `false` the web listener detaches. Defaults to `true`. */
  enabled?: boolean;
  /**
   * When set (> 0), snap the scroll node to the nearest multiple of this interval
   * on settle before invoking `onSettle` (which receives the snapped offset). This
   * reproduces the paging/snap that react-native-web does NOT implement for
   * `snapToInterval` / `snapToOffsets` (it maps them to no-op props, so a web
   * drag/wheel can rest mid-item). Omit for free-scrolling lists. Ignored on native.
   */
  snapToInterval?: number;
  /**
   * Exact item offsets for carousels where the web scroller needs to settle to
   * known card positions rather than infer them from a repeated interval. Takes
   * precedence over `snapToInterval` on web. Ignored on native.
   */
  snapOffsets?: number[];
  /**
   * Optional imperative scroll setter for lists that reset DOM `scrollLeft` (e.g. FlashList
   * recyclerview). When provided, the web snap calls this (with `animated: true`)
   * instead of `node.scrollTo`. The resting offset is still read from the DOM node.
   */
  scrollToOffset?: (left: number, animated: boolean) => void;
}

/**
 * Synthesizes a "scroll settled" event on web.
 *
 * react-native-web's `ScrollView` only surfaces the DOM `scroll` event (mapped to
 * `onScroll`). The RN-only `onMomentumScrollEnd` / `onScrollEndDrag` / `onScrollBeginDrag`
 * props are wired onto a `<div>` that never emits them, so any behavior gated only on
 * those callbacks (snap-to-item, settle-to-index, load-more-on-settle) silently never
 * runs in the browser.
 *
 * This hook is the shared bridge: on web (see the sibling `use-web-scroll-settle.web.ts`)
 * it attaches a debounced `scroll` listener to the scroll host's DOM node and invokes
 * `onSettle` once the scroll comes to rest. On native it is an intentional no-op - RN
 * fires the real momentum/drag-end events, so native behavior is byte-identical to before
 * this hook existed.
 *
 * @example
 * ```tsx
 * const scrollRef = useAnimatedRef<Animated.ScrollView>();
 * useWebScrollSettle({
 *   scrollRef,
 *   onSettle: ({ x }) => onSettle(nearestIndexForOffset(x, SNAP_INTERVAL, items.length)),
 * });
 * ```
 */
export function useWebScrollSettle(_params: UseWebScrollSettleParams): void {
  // Intentionally empty on native - the real momentum/drag-end events fire.
}
