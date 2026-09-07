import { useEffect, useRef } from 'react';

import type { UseWebDragToScrollParams } from './use-web-drag-to-scroll';

// Minimal DOM typings: this lib does not include the TS "dom" lib. Model only
// the scroll node and pointer-event surface this hook touches.
interface PointerLike {
  button?: number;
  pointerType?: string;
  pointerId?: number;
  clientX: number;
  preventDefault: () => void;
  stopPropagation: () => void;
}

interface MutableStyle {
  cursor: string;
  userSelect: string;
  scrollSnapType: string;
}

interface RootStyle {
  setProperty?: (name: string, value: string, priority?: string) => void;
  removeProperty?: (name: string) => void;
}

interface ScrollableNode {
  addEventListener: (type: string, listener: (event: PointerLike) => void, options?: unknown) => void;
  removeEventListener: (type: string, listener: (event: PointerLike) => void, options?: unknown) => void;
  setPointerCapture?: (pointerId: number) => void;
  releasePointerCapture?: (pointerId: number) => void;
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
  style?: Partial<MutableStyle>;
  ownerDocument?: { documentElement?: { style?: RootStyle } };
}

/** RNW `ScrollView` (and reanimated's wrapper) expose the scrollable DOM node here. */
interface ScrollNodeHost {
  getScrollableNode?: () => unknown;
}

/** Movement past this many px counts as a drag (vs a click), so a tap on a card still works. */
const DRAG_THRESHOLD_PX = 3;

function hasEventListener(value: unknown): value is ScrollableNode {
  return typeof value === 'object' && value !== null && typeof (value as ScrollableNode).addEventListener === 'function';
}

/** Mirrors `resolveScrollableNode` in use-web-scroll-settle.web.ts (kept local so each hook is self-contained). */
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

/**
 * Web implementation of {@link useWebDragToScroll}. See that file for the rationale.
 */
export function useWebDragToScroll({ scrollRef, enabled = true, scrollToOffset, onDragEnd }: UseWebDragToScrollParams): void {
  const scrollToOffsetRef = useRef(scrollToOffset);
  scrollToOffsetRef.current = scrollToOffset;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  useEffect(() => {
    if (!enabled) return;

    const node = resolveScrollableNode(scrollRef);
    if (!node) return;

    let isDown = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let pointerId: number | undefined;
    let snapBeforeDrag = '';

    const setCursor = (value: string) => {
      if (node.style) node.style.cursor = value;
    };

    const rootStyle = node.ownerDocument?.documentElement?.style;
    const setDocGrabbing = (on: boolean) => {
      if (on) rootStyle?.setProperty?.('cursor', 'grabbing', 'important');
      else rootStyle?.removeProperty?.('cursor');
    };

    const onPointerDown = (event: PointerLike) => {
      // Left button only; let native touch scrolling handle touch pointers.
      if (event.button != null && event.button !== 0) return;
      if (event.pointerType === 'touch') return;
      // Nothing to drag if the content fits.
      if (node.scrollWidth <= node.clientWidth) return;

      isDown = true;
      moved = false;
      startX = event.clientX;
      startScroll = node.scrollLeft;
      pointerId = event.pointerId;
    };

    const beginDrag = () => {
      moved = true;
      if (pointerId != null) node.setPointerCapture?.(pointerId);
      if (node.style) {
        snapBeforeDrag = node.style.scrollSnapType ?? '';
        node.style.scrollSnapType = 'none';
        node.style.userSelect = 'none';
        node.style.cursor = 'grabbing';
      }
      setDocGrabbing(true);
    };

    const onPointerMove = (event: PointerLike) => {
      if (!isDown) return;
      const dx = event.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
        beginDrag();
      }
      const target = startScroll - dx;
      if (scrollToOffsetRef.current) scrollToOffsetRef.current(target, false);
      else node.scrollLeft = target;
    };

    const endDrag = () => {
      if (!isDown) return;
      const wasDragging = moved;
      isDown = false;
      if (wasDragging) {
        if (pointerId != null) node.releasePointerCapture?.(pointerId);
        if (node.style) {
          node.style.scrollSnapType = snapBeforeDrag;
          node.style.userSelect = '';
          node.style.cursor = 'grab';
        }
        setDocGrabbing(false);
        onDragEndRef.current?.({ x: node.scrollLeft });
      }
      pointerId = undefined;
    };

    const onClickCapture = (event: PointerLike) => {
      if (!moved) return;
      moved = false;
      event.preventDefault();
      event.stopPropagation();
    };

    node.addEventListener('pointerdown', onPointerDown, true);
    node.addEventListener('pointermove', onPointerMove, true);
    node.addEventListener('pointerup', endDrag, true);
    node.addEventListener('pointercancel', endDrag, true);
    node.addEventListener('click', onClickCapture, true);
    setCursor('grab');

    return () => {
      node.removeEventListener('pointerdown', onPointerDown, true);
      node.removeEventListener('pointermove', onPointerMove, true);
      node.removeEventListener('pointerup', endDrag, true);
      node.removeEventListener('pointercancel', endDrag, true);
      node.removeEventListener('click', onClickCapture, true);
      setCursor('');
      setDocGrabbing(false);
    };
  }, [scrollRef, enabled]);
}
