import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useDismissable } from './use-dismissable.web';

interface KeyboardEventStub {
  key: string;
  defaultPrevented: boolean;
  preventDefault: jest.Mock;
}

// Jest runs in a node environment — stub the global document per test. The
// stack captures its document reference at first registration, so the stub is
// installed before every test and removed after.
const globalWithDocument = globalThis as unknown as { document?: unknown };
const ORIGINAL_DOCUMENT = globalWithDocument.document;

const handlers = new Set<(event: KeyboardEventStub) => void>();
const addEventListener = jest.fn((_type: string, handler: (event: KeyboardEventStub) => void) => {
  handlers.add(handler);
});
const removeEventListener = jest.fn((_type: string, handler: (event: KeyboardEventStub) => void) => {
  handlers.delete(handler);
});

const pressEscape = (overrides: Partial<KeyboardEventStub> = {}): KeyboardEventStub => {
  const event: KeyboardEventStub = { key: 'Escape', defaultPrevented: false, preventDefault: jest.fn(), ...overrides };
  [...handlers].forEach((handler) => handler(event));
  return event;
};

beforeEach(() => {
  jest.clearAllMocks();
  handlers.clear();
  globalWithDocument.document = { addEventListener, removeEventListener };
});

afterEach(() => {
  globalWithDocument.document = ORIGINAL_DOCUMENT;
});

const renderLayer = (active = true, onDismiss: jest.Mock = jest.fn()) => {
  const rendered = renderHook((props: { active: boolean; onDismiss: () => void }) => useDismissable(props), {
    initialProps: { active, onDismiss },
  });
  return { ...rendered, onDismiss };
};

describe('useDismissable (the web dismiss stack)', () => {
  it('GIVEN one active layer WHEN Escape is pressed THEN it is dismissed and the event is marked consumed', () => {
    const { onDismiss } = renderLayer();

    const event = pressEscape();

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('GIVEN two active layers WHEN Escape is pressed THEN only the last-activated one is dismissed', () => {
    const bottom = renderLayer();
    const top = renderLayer();

    pressEscape();

    expect(top.onDismiss).toHaveBeenCalledTimes(1);
    expect(bottom.onDismiss).not.toHaveBeenCalled();
  });

  it('GIVEN the top layer deactivated WHEN Escape is pressed again THEN the remaining layer is dismissed', () => {
    const bottom = renderLayer();
    const top = renderLayer();

    top.rerender({ active: false, onDismiss: top.onDismiss });
    pressEscape();

    expect(top.onDismiss).not.toHaveBeenCalled();
    expect(bottom.onDismiss).toHaveBeenCalledTimes(1);
  });

  it('GIVEN activation AFTER mount THEN activation order wins, not mount order', () => {
    // First-mounted but activated last — it must be on top.
    const late = renderLayer(false);
    const early = renderLayer();

    late.rerender({ active: true, onDismiss: late.onDismiss });
    pressEscape();

    expect(late.onDismiss).toHaveBeenCalledTimes(1);
    expect(early.onDismiss).not.toHaveBeenCalled();
  });

  it('GIVEN a re-render with a new onDismiss identity THEN the layer keeps its stack position and uses the new callback', () => {
    const bottom = renderLayer();
    const top = renderLayer();

    const replacement = jest.fn();
    bottom.rerender({ active: true, onDismiss: replacement });
    pressEscape();

    // Identity churn on the bottom layer must not hoist it above the top one.
    expect(top.onDismiss).toHaveBeenCalledTimes(1);
    expect(replacement).not.toHaveBeenCalled();

    top.rerender({ active: false, onDismiss: top.onDismiss });
    pressEscape();

    expect(replacement).toHaveBeenCalledTimes(1);
    expect(bottom.onDismiss).not.toHaveBeenCalled();
  });

  it('GIVEN an event already defaultPrevented by outside code THEN no layer is dismissed', () => {
    const { onDismiss } = renderLayer();

    pressEscape({ defaultPrevented: true });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('GIVEN a non-Escape key THEN nothing happens', () => {
    const { onDismiss } = renderLayer();

    pressEscape({ key: 'Enter' });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('GIVEN many layers THEN one document listener is shared, and it is removed when the last layer leaves', () => {
    const first = renderLayer();
    const second = renderLayer();

    expect(addEventListener).toHaveBeenCalledTimes(1);

    first.unmount();
    expect(removeEventListener).not.toHaveBeenCalled();

    second.unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(handlers.size).toBe(0);
  });

  it('GIVEN an inactive layer THEN nothing is registered', () => {
    renderLayer(false);

    expect(addEventListener).not.toHaveBeenCalled();
  });

  it('GIVEN no document at all WHEN a layer activates and deactivates THEN nothing throws', () => {
    globalWithDocument.document = undefined;

    const { onDismiss, unmount } = renderLayer();

    expect(onDismiss).not.toHaveBeenCalled();
    expect(() => unmount()).not.toThrow();
  });
});
