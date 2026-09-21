import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useWebScrollSettle } from './use-web-scroll-settle.web';

type Listener = (event?: unknown) => void;

function createFakeNode() {
  const listeners: Record<string, Set<Listener>> = {};
  const node = {
    clientWidth: 400,
    scrollLeft: 0,
    scrollWidth: 1000,
    scrollTop: 0,
    scrollTo: jest.fn((opts: { left?: number }) => {
      if (typeof opts.left === 'number') node.scrollLeft = opts.left;
    }),
    addEventListener: (type: string, listener: Listener) => {
      (listeners[type] ??= new Set()).add(listener);
    },
    removeEventListener: (type: string, listener: Listener) => {
      listeners[type]?.delete(listener);
    },
  };
  return {
    node,
    dispatch: (type: string, event?: unknown) => listeners[type]?.forEach((listener) => listener(event)),
    count: (type: string) => listeners[type]?.size ?? 0,
  };
}

function refFromHost(node: unknown) {
  return { current: { getScrollableNode: () => node } };
}

describe('useWebScrollSettle (web)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('fires onSettle once with the resting offset after scrolling goes idle', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100 }));

    fake.node.scrollLeft = 40;
    fake.node.scrollTop = 5;
    fake.dispatch('scroll');
    expect(onSettle).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(onSettle).toHaveBeenCalledTimes(1);
    expect(onSettle).toHaveBeenCalledWith({ x: 40, y: 5 });
  });

  it('debounces a burst of scroll events into a single settle', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100 }));

    fake.node.scrollLeft = 10;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(50);
    fake.node.scrollLeft = 80;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(50);
    expect(onSettle).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(onSettle).toHaveBeenCalledTimes(1);
    expect(onSettle).toHaveBeenCalledWith({ x: 80, y: 0 });
  });

  it('snaps to the nearest interval on settle and reports the snapped offset', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100, snapToInterval: 100 }));

    fake.node.scrollLeft = 268;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(fake.node.scrollTo).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
    expect(onSettle).toHaveBeenCalledWith({ x: 300, y: 0 });
  });

  it('prefers exact snap offsets over interval multiples', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() =>
      useWebScrollSettle({
        scrollRef: refFromHost(fake.node),
        onSettle,
        debounceMs: 100,
        snapToInterval: 100,
        snapOffsets: [0, 140, 300],
      }),
    );

    fake.node.scrollLeft = 121;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(fake.node.scrollTo).toHaveBeenCalledWith({ left: 140, behavior: 'smooth' });
    expect(onSettle).toHaveBeenCalledWith({ x: 140, y: 0 });
  });

  it('does not scroll when already resting on a snap point', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100, snapToInterval: 100 }));

    fake.node.scrollLeft = 200;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(fake.node.scrollTo).not.toHaveBeenCalled();
    expect(onSettle).toHaveBeenCalledWith({ x: 200, y: 0 });
  });

  it('uses wheel direction to advance to the next snap point when a small wheel scroll would round back', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100, snapToInterval: 100 }));

    fake.dispatch('wheel', { deltaX: 24, deltaY: 0 });
    fake.node.scrollLeft = 24;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(fake.node.scrollTo).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' });
    expect(onSettle).toHaveBeenCalledWith({ x: 100, y: 0 });
  });

  it('uses wheel direction with exact snap offsets when a small wheel scroll would stay on the same card', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() =>
      useWebScrollSettle({
        scrollRef: refFromHost(fake.node),
        onSettle,
        debounceMs: 100,
        snapOffsets: [0, 278, 556],
      }),
    );

    fake.dispatch('wheel', { deltaX: 24, deltaY: 0 });
    fake.node.scrollLeft = 24;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(fake.node.scrollTo).toHaveBeenCalledWith({ left: 278, behavior: 'smooth' });
    expect(onSettle).toHaveBeenCalledWith({ x: 278, y: 0 });
  });

  it('routes exact-offset snapping through scrollToOffset when provided', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();
    const scrollToOffset = jest.fn((left: number) => {
      fake.node.scrollLeft = left;
    });

    renderHook(() =>
      useWebScrollSettle({
        scrollRef: refFromHost(fake.node),
        onSettle,
        debounceMs: 100,
        snapOffsets: [0, 250, 500],
        scrollToOffset,
      }),
    );

    fake.node.scrollLeft = 232;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(scrollToOffset).toHaveBeenCalledWith(250, true);
    expect(fake.node.scrollTo).not.toHaveBeenCalled();
    expect(onSettle).toHaveBeenCalledWith({ x: 250, y: 0 });
  });

  it('uses wheel direction to move back a snap point when a small reverse wheel scroll would round forward', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100, snapToInterval: 100 }));

    fake.node.scrollLeft = 200;
    fake.dispatch('wheel', { deltaX: -24, deltaY: 0 });
    fake.node.scrollLeft = 176;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);

    expect(fake.node.scrollTo).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' });
    expect(onSettle).toHaveBeenCalledWith({ x: 100, y: 0 });
  });

  it('resolves the node directly when the ref itself is the scrollable element', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: { current: fake.node }, onSettle, debounceMs: 100 }));

    fake.node.scrollLeft = 25;
    fake.dispatch('scroll');
    jest.advanceTimersByTime(100);
    expect(onSettle).toHaveBeenCalledWith({ x: 25, y: 0 });
  });

  it('does not attach a listener while disabled', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, enabled: false }));

    expect(fake.count('scroll')).toBe(0);
  });

  it('is a no-op when the ref resolves no scrollable node', () => {
    const onSettle = jest.fn();
    expect(() => renderHook(() => useWebScrollSettle({ scrollRef: { current: null }, onSettle }))).not.toThrow();
    jest.advanceTimersByTime(200);
    expect(onSettle).not.toHaveBeenCalled();
  });

  it('detaches the listener and cancels a pending settle on unmount', () => {
    const fake = createFakeNode();
    const onSettle = jest.fn();

    const { unmount } = renderHook(() => useWebScrollSettle({ scrollRef: refFromHost(fake.node), onSettle, debounceMs: 100 }));

    fake.node.scrollLeft = 30;
    fake.dispatch('scroll');
    unmount();
    expect(fake.count('scroll')).toBe(0);

    jest.advanceTimersByTime(200);
    expect(onSettle).not.toHaveBeenCalled();
  });
});
