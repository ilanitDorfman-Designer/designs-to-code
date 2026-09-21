import { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { computeScrollIntoViewX } from '../../../../utils/compute-scroll-into-view-x';

interface UseScrollSelectedChipIntoViewOptions {
  /** Feature is opt-in; when false every callback is inert. */
  enabled: boolean;
  /** Chip to keep visible, or `undefined` when nothing is selected. */
  selectedId: string | undefined;
  /**
   * Live scroll offset, written on the UI thread by the rail's scroll handler.
   * Read only when aligning, so tracking it costs no per-frame JS work.
   */
  scrollOffsetX: Readonly<SharedValue<number>>;
  /** Whether a real native `onScroll` has ever reported `scrollOffsetX` — see `alignSelected`. */
  hasScrolledValue: Readonly<SharedValue<boolean>>;
  /** Current layout direction; a fresh RTL rail rests at its right edge, not `0`. */
  isRTL: boolean;
  /** Whether the host restored a real starting offset via `initialScrollOffsetX` — see `alignSelected`. */
  hasInitialOffset: boolean;
}

/**
 * Keeps the selected chip inside the rail's viewport.
 *
 * Alignment is attempted from four places because the inputs arrive in an
 * order we don't control: the chip's own measurement, the container's
 * measurement, the content width, and any later change of selection. Each
 * attempt is a no-op until both measurements exist, and no-ops again once the
 * chip is already visible, so the rail never fights the user's own scrolling.
 */
export function useScrollSelectedChipIntoView({
  enabled,
  selectedId,
  scrollOffsetX,
  hasScrolledValue,
  isRTL,
  hasInitialOffset,
}: UseScrollSelectedChipIntoViewOptions) {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const chipLayoutsRef = useRef(new Map<string, LayoutRectangle>());
  const viewportWidthRef = useRef(0);
  const contentWidthRef = useRef(0);
  // The first alignment happens while the rail is being revealed, so it jumps
  // instead of animating — otherwise opening a screen on its last tab plays a
  // scroll the user never asked for. Later selections animate.
  const hasAlignedRef = useRef(false);
  const requestedScrollXRef = useRef<number | null>(null);

  const alignSelected = useCallback(() => {
    if (!enabled || selectedId == null) return;

    const layout = chipLayoutsRef.current.get(selectedId);
    const viewportWidth = viewportWidthRef.current;
    if (!layout || viewportWidth <= 0) return;

    // A fresh RTL rail natively rests at its right edge (contentOffset.x ===
    // contentWidth - viewportWidth) without ever firing `onScroll` to report it —
    // Android jumps there silently on first layout, iOS is simply born there. Until
    // a real scroll event arrives (or a host restores a known offset via
    // `initialScrollOffsetX`), trust that native resting position instead of
    // `scrollOffsetX`'s LTR-only `0` default, or the reveal would measure against a
    // window that was never actually on screen.
    const trustScrollOffsetX = hasScrolledValue.value || hasInitialOffset;
    const nativeRestingScrollX = isRTL ? Math.max(0, contentWidthRef.current - viewportWidth) : 0;

    // A scroll we requested only reaches `scrollOffsetX` a frame later. Measuring
    // against the pre-scroll offset in the meantime would scroll a second time,
    // so prefer what we asked for until the rail reports it.
    const observedScrollX = trustScrollOffsetX ? scrollOffsetX.value : nativeRestingScrollX;
    if (requestedScrollXRef.current === observedScrollX) requestedScrollXRef.current = null;

    const targetScrollX = computeScrollIntoViewX({
      chipX: layout.x,
      chipWidth: layout.width,
      viewportWidth,
      scrollX: requestedScrollXRef.current ?? observedScrollX,
    });

    // The reveal is over once a full measurement has been judged, even when the
    // chip was already visible and needed no scroll. Leaving the flag unset in
    // that case would spend the silent first jump on the user's next selection.
    const animated = hasAlignedRef.current;
    hasAlignedRef.current = true;

    if (targetScrollX == null) return;

    requestedScrollXRef.current = targetScrollX;
    scrollRef.current?.scrollTo({ x: targetScrollX, animated });
  }, [enabled, selectedId, scrollOffsetX, hasScrolledValue, isRTL, hasInitialOffset]);

  const handleChipLayout = useCallback(
    (id: string, layout: LayoutRectangle) => {
      const existing = chipLayoutsRef.current.get(id);
      if (existing && existing.x === layout.x && existing.width === layout.width) return;

      chipLayoutsRef.current.set(id, layout);
      if (id === selectedId) alignSelected();
    },
    [alignSelected, selectedId],
  );

  const handleContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      viewportWidthRef.current = event.nativeEvent.layout.width;
      alignSelected();
    },
    [alignSelected],
  );

  // Needed only to derive `nativeRestingScrollX` above; re-aligning here too
  // covers the case where content width resolves after the container/chip.
  const handleContentSizeChange = useCallback(
    (width: number) => {
      contentWidthRef.current = width;
      alignSelected();
    },
    [alignSelected],
  );

  // `alignSelected` is re-created whenever the selection changes, so this covers
  // "the selection moved" as well as "the rail became enabled".
  useEffect(() => {
    alignSelected();
  }, [alignSelected]);

  return { scrollRef, handleChipLayout, handleContainerLayout, handleContentSizeChange };
}
