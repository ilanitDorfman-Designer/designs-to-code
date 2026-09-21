import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useWebDragToScroll } from './use-web-drag-to-scroll.web';

type Listener = (event: unknown) => void;

function createFakeNode(overrides: Partial<{ scrollWidth: number; clientWidth: number }> = {}) {
  const listeners: Record<string, Set<Listener>> = {};
  const rootStyle = { setProperty: jest.fn(), removeProperty: jest.fn() };
  const node = {
    scrollLeft: 0,
    scrollWidth: overrides.scrollWidth ?? 1000,
    clientWidth: overrides.clientWidth ?? 400,
    style: { cursor: '', userSelect: '', scrollSnapType: 'x mandatory' },
    ownerDocument: { documentElement: { style: rootStyle } },
    setPointerCapture: jest.fn(),
    releasePointerCapture: jest.fn(),
    addEventListener: (type: string, listener: Listener) => {
      (listeners[type] ??= new Set()).add(listener);
    },
    removeEventListener: (type: string, listener: Listener) => {
      listeners[type]?.delete(listener);
    },
  };
  return {
    node,
    dispatch: (type: string, event: unknown = {}) => listeners[type]?.forEach((listener) => listener(event)),
    count: (type: string) => listeners[type]?.size ?? 0,
  };
}

function refFromHost(node: unknown) {
  return { current: { getScrollableNode: () => node } };
}

const pointer = (over: Record<string, unknown> = {}) => ({ button: 0, pointerType: 'mouse', pointerId: 1, clientX: 0, ...over });
const clickEvent = () => ({ preventDefault: jest.fn(), stopPropagation: jest.fn() });

describe('useWebDragToScroll (web)', () => {
  it('sets a grab cursor when enabled and clears it on unmount', () => {
    const fake = createFakeNode();
    const { unmount } = renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node) }));
    expect(fake.node.style.cursor).toBe('grab');
    unmount();
    expect(fake.node.style.cursor).toBe('');
    expect(fake.count('pointerdown')).toBe(0);
  });

  it('drags scrollLeft opposite to cursor movement, capturing only once movement passes the threshold', () => {
    const fake = createFakeNode();
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node) }));

    fake.dispatch('pointerdown', pointer({ clientX: 100 }));
    expect(fake.node.setPointerCapture).not.toHaveBeenCalled();
    expect(fake.node.style.cursor).toBe('grab');

    fake.dispatch('pointermove', pointer({ clientX: 98 }));
    expect(fake.node.setPointerCapture).not.toHaveBeenCalled();
    expect(fake.node.scrollLeft).toBe(0);

    fake.dispatch('pointermove', pointer({ clientX: 60 }));
    expect(fake.node.setPointerCapture).toHaveBeenCalledWith(1);
    expect(fake.node.style.cursor).toBe('grabbing');
    expect(fake.node.style.scrollSnapType).toBe('none');
    expect(fake.node.scrollLeft).toBe(40);
    expect(fake.node.ownerDocument.documentElement.style.setProperty).toHaveBeenCalledWith('cursor', 'grabbing', 'important');

    fake.dispatch('pointerup', pointer({ clientX: 60 }));
    expect(fake.node.releasePointerCapture).toHaveBeenCalledWith(1);
    expect(fake.node.style.cursor).toBe('grab');
    expect(fake.node.style.scrollSnapType).toBe('x mandatory');
    expect(fake.node.ownerDocument.documentElement.style.removeProperty).toHaveBeenCalledWith('cursor');
  });

  it('reports the final offset after a real drag ends', () => {
    const fake = createFakeNode();
    const onDragEnd = jest.fn();
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node), onDragEnd }));

    fake.dispatch('pointerdown', pointer({ clientX: 100 }));
    fake.dispatch('pointermove', pointer({ clientX: 40 }));
    fake.dispatch('pointerup', pointer({ clientX: 40 }));

    expect(onDragEnd).toHaveBeenCalledWith({ x: 60 });
  });

  it('lets a plain click through - no capture, no style change, no swallowed click', () => {
    const fake = createFakeNode();
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node) }));

    fake.dispatch('pointerdown', pointer({ clientX: 100 }));
    fake.dispatch('pointerup', pointer({ clientX: 100 }));
    expect(fake.node.setPointerCapture).not.toHaveBeenCalled();
    expect(fake.node.style.scrollSnapType).toBe('x mandatory');
    const click = clickEvent();
    fake.dispatch('click', click);
    expect(click.preventDefault).not.toHaveBeenCalled();
    expect(click.stopPropagation).not.toHaveBeenCalled();
  });

  it('swallows the trailing click after a real drag but not after a tap', () => {
    const fake = createFakeNode();
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node) }));

    fake.dispatch('pointerdown', pointer({ clientX: 100 }));
    fake.dispatch('pointermove', pointer({ clientX: 50 }));
    fake.dispatch('pointerup', pointer({ clientX: 50 }));
    const dragClick = clickEvent();
    fake.dispatch('click', dragClick);
    expect(dragClick.preventDefault).toHaveBeenCalled();
    expect(dragClick.stopPropagation).toHaveBeenCalled();

    fake.dispatch('pointerdown', pointer({ clientX: 100 }));
    fake.dispatch('pointerup', pointer({ clientX: 100 }));
    const tapClick = clickEvent();
    fake.dispatch('click', tapClick);
    expect(tapClick.preventDefault).not.toHaveBeenCalled();
  });

  it('ignores touch pointers and non-left buttons', () => {
    const fake = createFakeNode();
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node) }));

    fake.dispatch('pointerdown', pointer({ pointerType: 'touch', clientX: 100 }));
    fake.dispatch('pointermove', pointer({ pointerType: 'touch', clientX: 20 }));
    expect(fake.node.scrollLeft).toBe(0);

    fake.dispatch('pointerdown', pointer({ button: 2, clientX: 100 }));
    fake.dispatch('pointermove', pointer({ clientX: 20 }));
    expect(fake.node.scrollLeft).toBe(0);
  });

  it('does not start a drag when the content already fits', () => {
    const fake = createFakeNode({ scrollWidth: 300, clientWidth: 400 });
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node) }));

    fake.dispatch('pointerdown', pointer({ clientX: 100 }));
    fake.dispatch('pointermove', pointer({ clientX: 20 }));
    expect(fake.node.scrollLeft).toBe(0);
    expect(fake.node.style.cursor).toBe('grab');
    expect(fake.node.setPointerCapture).not.toHaveBeenCalled();
  });

  it('does not attach listeners while disabled', () => {
    const fake = createFakeNode();
    renderHook(() => useWebDragToScroll({ scrollRef: refFromHost(fake.node), enabled: false }));
    expect(fake.count('pointerdown')).toBe(0);
    expect(fake.node.style.cursor).toBe('');
  });

  it('is a no-op when the ref resolves no scrollable node', () => {
    expect(() => renderHook(() => useWebDragToScroll({ scrollRef: { current: null } }))).not.toThrow();
  });
});
