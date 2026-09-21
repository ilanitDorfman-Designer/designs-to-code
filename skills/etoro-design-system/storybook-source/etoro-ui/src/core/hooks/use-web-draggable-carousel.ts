import type { RefObject } from 'react';

import { useWebDragToScroll } from './use-web-drag-to-scroll';
import { useWebScrollSettle, type WebScrollSettleOffset } from './use-web-scroll-settle';

export interface UseWebDraggableCarouselParams {
  /** Ref to the horizontal `ScrollView` / `FlatList` scroll host. Ignored on native. */
  scrollRef: RefObject<unknown> | { current: unknown };
  /**
   * Item pitch in px (card width + gap). On web the carousel snaps to the nearest
   * multiple of this on scroll settle, since react-native-web ignores
   * `snapToInterval` / `snapToOffsets`. Omit for a free-scrolling (non-paged) rail.
   */
  snapInterval?: number;
  /**
   * Exact item offsets in px. Prefer this when the caller already has the card
   * count/positions (e.g. RN `snapToOffsets`) so web settles to cards, not to a
   * generic page width. Takes precedence over `snapInterval`.
   */
  snapOffsets?: number[];
  /**
   * Optional: called on web scroll settle with the (snapped) resting offset - use
   * it to sync a selected index / pagination dot. Never called on native.
   */
  onSettle?: (offset: WebScrollSettleOffset) => void;
  /**
   * Optional imperative scroll setter for lists that reset DOM `scrollLeft` (e.g. FlashList's
   * recyclerview, which fights direct `scrollLeft` writes). When provided, both the drag and the
   * snap route through it instead of the DOM node. Typically:
   * `(offset, animated) => listRef.current?.scrollToOffset({ offset, animated })`.
   */
  scrollToOffset?: (left: number, animated: boolean) => void;
  /** Gate; defaults to `true`. */
  enabled?: boolean;
}

const NOOP = () => {};

function nearestOffset(offsets: number[], x: number): number | undefined {
  let nearest: number | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const offset of offsets) {
    if (!Number.isFinite(offset) || offset < 0) continue;
    const distance = Math.abs(offset - x);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = offset;
    }
  }

  return nearest;
}

function getSnapTarget(x: number, snapInterval?: number, snapOffsets?: number[]): number | undefined {
  const exactTarget = snapOffsets?.length ? nearestOffset(snapOffsets, x) : undefined;
  if (exactTarget !== undefined) return exactTarget;
  return snapInterval && snapInterval > 0 ? Math.round(x / snapInterval) * snapInterval : undefined;
}

/**
 * One-call web carousel behavior for a horizontal `ScrollView` / `FlatList`.
 *
 * Composes the two web bridges so a single call gives a react-native-web carousel
 * the interactions it otherwise lacks:
 * - {@link useWebDragToScroll} - mouse click-drag to scroll (there's no touch to swipe with).
 * - {@link useWebScrollSettle} with `snapToInterval` - snap to the nearest item on settle
 *   (RNW ignores `snapToInterval` / `snapToOffsets`, so a drag/wheel would rest mid-item).
 *
 * Both underlying hooks are native no-ops, so this whole hook is a no-op on native -
 * touch drag + real momentum/snap already work there. Pass `onSettle` when the
 * component also tracks a selected index / pagination dot.
 *
 * @example
 * ```tsx
 * const listRef = useRef<FlatList>(null);
 * useWebDraggableCarousel({ scrollRef: listRef, snapInterval: CARD_WIDTH + CARD_GAP });
 * ```
 */
export function useWebDraggableCarousel({
  scrollRef,
  snapInterval,
  snapOffsets,
  onSettle,
  scrollToOffset,
  enabled = true,
}: UseWebDraggableCarouselParams): void {
  useWebDragToScroll({
    scrollRef,
    enabled,
    scrollToOffset,
    onDragEnd: ({ x }) => {
      // DOM-backed rails are already snapped by useWebScrollSettle's debounced scroll listener.
      // Only snap immediately when the caller provides an imperative setter; otherwise we could
      // update pagination before the visible rail has landed on the snapped card.
      if (!scrollToOffset) return;
      const target = getSnapTarget(x, snapInterval, snapOffsets);
      if (target === undefined) return;
      scrollToOffset(target, true);
      onSettle?.({ x: target, y: 0 });
    },
  });
  useWebScrollSettle({ scrollRef, enabled, snapToInterval: snapInterval, snapOffsets, scrollToOffset, onSettle: onSettle ?? NOOP });
}
