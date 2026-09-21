import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useHardwareKeyboard } from './use-hardware-keyboard.web';

// Fake document.
// The native jest env has no DOM. We inject a minimal document that captures the
// listeners the web hook attaches, then invoke them to simulate physical input.

type Listener = (event: unknown) => void;

function createFakeDocument() {
  const listeners: Record<string, Set<Listener>> = {};
  return {
    document: {
      addEventListener: (type: string, listener: Listener) => {
        (listeners[type] ??= new Set()).add(listener);
      },
      removeEventListener: (type: string, listener: Listener) => {
        listeners[type]?.delete(listener);
      },
    },
    dispatch: (type: string, event: unknown) => {
      listeners[type]?.forEach((l) => l(event));
    },
    count: (type: string) => listeners[type]?.size ?? 0,
  };
}

const keyEvent = (overrides: Record<string, unknown>) => ({
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  target: {},
  preventDefault: jest.fn(),
  ...overrides,
});

const pasteEvent = (text: string, overrides: Record<string, unknown> = {}) => ({
  clipboardData: { getData: () => text },
  target: {},
  preventDefault: jest.fn(),
  ...overrides,
});

describe('useHardwareKeyboard (web)', () => {
  let fake: ReturnType<typeof createFakeDocument>;
  let onKeyPress: jest.Mock;
  let onClear: jest.Mock;
  let onClearAll: jest.Mock;

  beforeEach(() => {
    fake = createFakeDocument();
    (globalThis as { document?: unknown }).document = fake.document;
    onKeyPress = jest.fn();
    onClear = jest.fn();
    onClearAll = jest.fn();
  });

  afterEach(() => {
    delete (globalThis as { document?: unknown }).document;
  });

  const setup = (params: Record<string, unknown> = {}) => renderHook(() => useHardwareKeyboard({ onKeyPress, onClear, onClearAll, ...params }));

  it('routes digit keys to onKeyPress and prevents default', () => {
    setup();
    const event = keyEvent({ key: '7' });
    fake.dispatch('keydown', event);

    expect(onKeyPress).toHaveBeenCalledWith('7');
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('maps "." "," and numpad "Decimal" to the dot key', () => {
    setup();
    fake.dispatch('keydown', keyEvent({ key: '.' }));
    fake.dispatch('keydown', keyEvent({ key: ',' }));
    fake.dispatch('keydown', keyEvent({ key: 'Decimal' }));

    expect(onKeyPress.mock.calls).toEqual([['.'], ['.'], ['.']]);
  });

  it('maps Backspace and Delete to onClear', () => {
    setup();
    fake.dispatch('keydown', keyEvent({ key: 'Backspace' }));
    fake.dispatch('keydown', keyEvent({ key: 'Delete' }));

    expect(onClear).toHaveBeenCalledTimes(2);
  });

  it('maps Cmd/Ctrl + Backspace to onClearAll (not onClear)', () => {
    setup();
    fake.dispatch('keydown', keyEvent({ key: 'Backspace', metaKey: true }));
    fake.dispatch('keydown', keyEvent({ key: 'Delete', ctrlKey: true }));

    expect(onClearAll).toHaveBeenCalledTimes(2);
    expect(onClear).not.toHaveBeenCalled();
  });

  it('ignores unrelated keys and shortcut combos', () => {
    setup();
    fake.dispatch('keydown', keyEvent({ key: 'a' }));
    fake.dispatch('keydown', keyEvent({ key: 'Enter' }));
    fake.dispatch('keydown', keyEvent({ key: 'c', metaKey: true })); // copy
    fake.dispatch('keydown', keyEvent({ key: '5', ctrlKey: true })); // shortcut

    expect(onKeyPress).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
    expect(onClearAll).not.toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    setup({ disabled: true });
    fake.dispatch('keydown', keyEvent({ key: '5' }));
    fake.dispatch('keydown', keyEvent({ key: 'Backspace' }));

    expect(onKeyPress).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('does nothing when inactive (active=false)', () => {
    setup({ active: false });
    fake.dispatch('keydown', keyEvent({ key: '5' }));

    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('ignores keys while a real text input is focused', () => {
    setup();
    fake.dispatch('keydown', keyEvent({ key: '5', target: { tagName: 'INPUT' } }));
    fake.dispatch('keydown', keyEvent({ key: '5', target: { isContentEditable: true } }));

    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('skips onClear when the delete handler is undefined (empty value)', () => {
    renderHook(() => useHardwareKeyboard({ onKeyPress, onClear: undefined, onClearAll: undefined }));
    const event = keyEvent({ key: 'Backspace' });
    fake.dispatch('keydown', event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('feeds pasted digits and decimals through onKeyPress and prevents default', () => {
    setup();
    const event = pasteEvent('1,2.3x9');
    fake.dispatch('paste', event);

    expect(onKeyPress.mock.calls).toEqual([['1'], ['.'], ['2'], ['.'], ['3'], ['9']]);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('ignores an empty / non-numeric paste without preventing default', () => {
    setup();
    const event = pasteEvent('abc');
    fake.dispatch('paste', event);

    expect(onKeyPress).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('ignores paste when inactive or into a focused input', () => {
    setup({ active: false });
    fake.dispatch('paste', pasteEvent('123'));
    expect(onKeyPress).not.toHaveBeenCalled();

    setup({ active: true });
    fake.dispatch('paste', pasteEvent('123', { target: { tagName: 'TEXTAREA' } }));
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('removes its document listeners on unmount', () => {
    const { unmount } = setup();
    expect(fake.count('keydown')).toBe(1);
    expect(fake.count('paste')).toBe(1);

    unmount();
    expect(fake.count('keydown')).toBe(0);
    expect(fake.count('paste')).toBe(0);
  });

  it('uses the latest handlers without re-binding listeners across re-renders', () => {
    const { rerender } = renderHook(({ cb }) => useHardwareKeyboard({ onKeyPress: cb }), {
      initialProps: { cb: onKeyPress },
    });
    expect(fake.count('keydown')).toBe(1);

    const nextOnKeyPress = jest.fn();
    rerender({ cb: nextOnKeyPress });

    // Still exactly one listener (bound once), and it calls the newest handler.
    expect(fake.count('keydown')).toBe(1);
    fake.dispatch('keydown', keyEvent({ key: '4' }));
    expect(nextOnKeyPress).toHaveBeenCalledWith('4');
    expect(onKeyPress).not.toHaveBeenCalled();
  });
});
