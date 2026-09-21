import { useEffect, useRef } from 'react';

import type { UseWebScrollSettleParams, WebScrollSettleOffset } from './use-web-scroll-settle';

// Minimal DOM typings: this lib does not include the TS "dom" lib. Model only
// the scroll node surface this hook touches.
interface WheelLike {
  deltaX?: number;
  deltaY?: number;
  shiftKey?: boolean;
}

interface ScrollableNode {
  addEventListener: (type: string, listener: (event?: unknown) => void, options?: unknown) => void;
  removeEventListener: (type: string, listener: (event?: unknown) => void, options?: unknown) => void;
  scrollTo?: (options: { left?: number; top?: number; behavior?: string }) => void;
  clientWidth?: number;
  scrollLeft: number;
  scrollWidth?: number;
  scrollTop: number;
}

/** RNW `ScrollView` (and reanimated's wrapper) expose the scrollable DOM node here. */
interface ScrollNodeHost {
  getScrollableNode?: () => unknown;
}

const DEFAULT_DEBOUNCE_MS = 120;
const MIN_WHEEL_SNAP_DELTA_PX = 8;

function hasEventListener(value: unknown): value is ScrollableNode {
  return typeof value === 'object' && value !== null && typeof (value as ScrollableNode).addEventListener === 'function';
}

function resolveScrollableNode(ref: { current: unknown } | null | undefined): ScrollableNode | undefined {
  const current = ref?.current;
  if (!current) return undefined;

  const host = current as ScrollNodeHost;
  if (typeof host.getScrollableNode === 'function') {
    const node = host.getScrollableNode();
    if (hasEventListener(node)) return node;
  }

  return hasEventListener(current) ? current : undefined;
}

function clampOffset(node: ScrollableNode, offset: number): number {
  if (typeof node.scrollWidth !== 'number' || typeof node.clientWidth !== 'number') return Math.max(0, offset);
  return Math.max(0, Math.min(offset, Math.max(0, node.scrollWidth - node.clientWidth)));
}

function findNearestOffsetIndex(offsets: number[], x: number): number {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  offsets.forEach((offset, index) => {
    const distance = Math.abs(offset - x);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

/**
 * Web implementation of {@link useWebScrollSettle}.
 */
export function useWebScrollSettle({
  scrollRef,
  onSettle,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  enabled = true,
  snapToInterval,
  snapOffsets,
  scrollToOffset,
}: UseWebScrollSettleParams): void {
  const onSettleRef = useRef(onSettle);
  onSettleRef.current = onSettle;
  const scrollToOffsetRef = useRef(scrollToOffset);
  scrollToOffsetRef.current = scrollToOffset;

  useEffect(() => {
    if (!enabled) return;

    const node = resolveScrollableNode(scrollRef);
    if (!node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let wheelStartX: number | undefined;
    let wheelDirection = 0;
    let lastWheelAt = 0;

    const handleWheel = (event?: unknown) => {
      const wheel = event as WheelLike;
      const deltaX = typeof wheel.deltaX === 'number' ? wheel.deltaX : 0;
      const deltaY = typeof wheel.deltaY === 'number' ? wheel.deltaY : 0;
      const horizontalDelta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : wheel.shiftKey ? deltaY : 0;
      if (horizontalDelta === 0) return;

      const now = Date.now();
      if (wheelStartX === undefined || now - lastWheelAt > debounceMs) {
        wheelStartX = node.scrollLeft;
      }
      wheelDirection = horizontalDelta > 0 ? 1 : -1;
      lastWheelAt = now;
    };

    const handleScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        let x = node.scrollLeft;
        const offsets = snapOffsets?.filter((offset) => Number.isFinite(offset) && offset >= 0);

        if (offsets?.length) {
          const nearestIndex = findNearestOffsetIndex(offsets, x);
          const startIndex = wheelStartX === undefined ? undefined : findNearestOffsetIndex(offsets, wheelStartX);
          const wheelMoved = wheelStartX === undefined ? 0 : Math.abs(x - wheelStartX);
          let targetIndex = nearestIndex;

          if (startIndex !== undefined && wheelDirection !== 0 && nearestIndex === startIndex && wheelMoved >= MIN_WHEEL_SNAP_DELTA_PX) {
            targetIndex = Math.max(0, Math.min(startIndex + wheelDirection, offsets.length - 1));
          }

          const target = clampOffset(node, offsets[targetIndex]);
          if (Math.abs(target - x) > 1) {
            if (scrollToOffsetRef.current) scrollToOffsetRef.current(target, true);
            else if (typeof node.scrollTo === 'function') node.scrollTo({ left: target, behavior: 'smooth' });
          }
          x = target;
        } else if (snapToInterval && snapToInterval > 0) {
          const nearest = Math.round(x / snapToInterval) * snapToInterval;
          const startIndex = wheelStartX === undefined ? undefined : Math.round(wheelStartX / snapToInterval);
          const nearestIndex = Math.round(nearest / snapToInterval);
          const wheelMoved = wheelStartX === undefined ? 0 : Math.abs(x - wheelStartX);
          let target = nearest;

          if (startIndex !== undefined && wheelDirection !== 0 && nearestIndex === startIndex && wheelMoved >= MIN_WHEEL_SNAP_DELTA_PX) {
            target = (startIndex + wheelDirection) * snapToInterval;
          }

          target = clampOffset(node, target);
          if (Math.abs(target - x) > 1) {
            if (scrollToOffsetRef.current) scrollToOffsetRef.current(target, true);
            else if (typeof node.scrollTo === 'function') node.scrollTo({ left: target, behavior: 'smooth' });
          }
          x = target;
        }
        wheelStartX = undefined;
        wheelDirection = 0;
        const offset: WebScrollSettleOffset = { x, y: node.scrollTop };
        onSettleRef.current(offset);
      }, debounceMs);
    };

    node.addEventListener('wheel', handleWheel, { passive: true });
    node.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timer) clearTimeout(timer);
      node.removeEventListener('wheel', handleWheel);
      node.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef, enabled, debounceMs, snapToInterval, snapOffsets]);
}
