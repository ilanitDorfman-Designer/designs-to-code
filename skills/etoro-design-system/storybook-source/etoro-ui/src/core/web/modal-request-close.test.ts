import { describe, expect, it, jest } from '@jest/globals';

import { modalRequestClose as nativeModalRequestClose } from './modal-request-close';
import { modalRequestClose as webModalRequestClose } from './modal-request-close.web';

describe('modalRequestClose (platform seam)', () => {
  it('native: passes the handler through — Modal onRequestClose wires the Android back button', () => {
    const close = jest.fn();
    expect(nativeModalRequestClose(close)).toBe(close);
  });

  it('web: returns undefined — RNW Modal would fire onRequestClose on Escape keyup, behind the dismiss stack (keydown), double-closing stacked layers on one press', () => {
    const close = jest.fn();
    expect(webModalRequestClose(close)).toBeUndefined();
  });
});
