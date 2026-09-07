import { describe, expect, it } from '@jest/globals';

import { isErrorActive, isFocusActive } from './use-datepicker-animations';

/**
 * Pins the border-channel policy for `useDatepickerAnimations`:
 *
 *   disabled|readonly (hard override) → both channels suppressed (idle only)
 *     — D8 + quiet-chrome
 *   focus channel                     → active only when isFocused
 *   error channel                     → active only when hasError
 *
 * Two independent drivers replace the previous single 0..1..2 stop driver, so
 * non-adjacent transitions (idle ↔ error) no longer pass through the focus
 * color. The predicates below are the correctness core of that policy — the
 * effect body in the hook calls each with the same override semantics and
 * routes both to `withTiming(0)` when the hard override is on.
 */

describe('isFocusActive', () => {
  it('suppresses focus when disabled, even if isFocused is true', () => {
    expect(isFocusActive(true, false, true)).toBe(false);
  });

  it('suppresses focus when readonly, even if isFocused is true', () => {
    expect(isFocusActive(false, true, true)).toBe(false);
  });

  it('suppresses focus when both disabled and readonly, even if isFocused is true', () => {
    expect(isFocusActive(true, true, true)).toBe(false);
  });

  it('reports isFocused unchanged when neither disabled nor readonly', () => {
    expect(isFocusActive(false, false, true)).toBe(true);
    expect(isFocusActive(false, false, false)).toBe(false);
  });
});

describe('isErrorActive', () => {
  it('suppresses error when disabled, even if hasError is true (D8)', () => {
    expect(isErrorActive(true, false, true)).toBe(false);
  });

  it('suppresses error when readonly, even if hasError is true (quiet chrome)', () => {
    expect(isErrorActive(false, true, true)).toBe(false);
  });

  it('suppresses error when both disabled and readonly, even if hasError is true', () => {
    expect(isErrorActive(true, true, true)).toBe(false);
  });

  it('reports hasError unchanged when neither disabled nor readonly', () => {
    expect(isErrorActive(false, false, true)).toBe(true);
    expect(isErrorActive(false, false, false)).toBe(false);
  });
});

describe('channel independence — the non-adjacent transition fix', () => {
  it('idle → error: focus channel stays false, error channel flips true (no focus-color flash on ramp)', () => {
    expect(isFocusActive(false, false, false)).toBe(false);
    expect(isErrorActive(false, false, true)).toBe(true);
  });

  it('error → idle: focus channel stays false, error channel flips false (no focus-color flash on ramp)', () => {
    expect(isFocusActive(false, false, false)).toBe(false);
    expect(isErrorActive(false, false, false)).toBe(false);
  });

  it('disabled + error: both channels suppressed, border stays on idle stop', () => {
    expect(isFocusActive(true, false, false)).toBe(false);
    expect(isErrorActive(true, false, true)).toBe(false);
  });

  it('readonly + error: both channels suppressed, border stays on idle stop', () => {
    expect(isFocusActive(false, true, false)).toBe(false);
    expect(isErrorActive(false, true, true)).toBe(false);
  });
});
