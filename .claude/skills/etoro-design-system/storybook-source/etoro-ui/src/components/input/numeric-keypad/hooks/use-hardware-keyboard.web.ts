import { useEffect, useRef } from 'react';

import type { NumericKeyValue } from '../api';
import type { UseHardwareKeyboardParams } from './use-hardware-keyboard';

// Minimal DOM typings.
// This lib does not include the TS "dom" lib, so we model only the tiny surface
// we touch and reach it through `globalThis` casts (no new dependencies).

interface HardwareKeyEvent {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  target: unknown;
  preventDefault: () => void;
}

interface HardwarePasteEvent {
  clipboardData: { getData: (type: string) => string } | null;
  target: unknown;
  preventDefault: () => void;
}

interface HardwareKeyboardDocument {
  addEventListener: (type: string, listener: (event: unknown) => void) => void;
  removeEventListener: (type: string, listener: (event: unknown) => void) => void;
}

const DIGITS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

function getDocument(): HardwareKeyboardDocument | undefined {
  return (globalThis as { document?: HardwareKeyboardDocument }).document;
}

// A real focused text field (search box, address input, contenteditable, etc.)
// must keep its own typing/paste; never hijack keys while the user edits another control.
function isEditableTarget(target: unknown): boolean {
  if (!target || typeof target !== 'object') return false;
  const el = target as { tagName?: string; isContentEditable?: boolean };
  const tag = typeof el.tagName === 'string' ? el.tagName.toUpperCase() : '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return el.isContentEditable === true;
}

/**
 * Web implementation: while mounted (and `active` + not `disabled`), listens on
 * `document` for physical-keyboard input and routes it through the SAME handlers
 * the on-screen keys call, so max / maxDecimalPlaces / allowDecimal / min clamping
 * all apply identically to typing, pasting, and tapping.
 *
 * - `0`-`9` -> `onKeyPress(digit)`
 * - `.` / `,` / numpad `Decimal` -> `onKeyPress('.')` (rejected downstream if decimals off)
 * - `Backspace` / `Delete` -> `onClear()`
 * - `Cmd`/`Ctrl` + `Backspace`/`Delete` -> `onClearAll()` (long-press analog)
 * - paste -> each digit/decimal char fed through `onKeyPress`
 */
export function useHardwareKeyboard({ onKeyPress, onClear, onClearAll, disabled, active = true }: UseHardwareKeyboardParams): void {
  // Latest params live in a ref so the document listeners bind exactly once and
  // never need re-attaching when value-derived handlers change each render.
  const paramsRef = useRef({ onKeyPress, onClear, onClearAll, disabled, active });
  paramsRef.current = { onKeyPress, onClear, onClearAll, disabled, active };

  useEffect(() => {
    const doc = getDocument();
    if (!doc) return;

    const handleKeyDown = (raw: unknown) => {
      const event = raw as HardwareKeyEvent;
      const params = paramsRef.current;
      if (params.disabled || !params.active) return;
      if (isEditableTarget(event.target)) return;

      const { key } = event;

      // Clear-all analog of the on-screen long-press: Cmd/Ctrl + Backspace/Delete.
      if ((key === 'Backspace' || key === 'Delete') && (event.metaKey || event.ctrlKey)) {
        if (!params.onClearAll) return;
        params.onClearAll();
        event.preventDefault();
        return;
      }

      // Leave every other modifier combo (copy, select-all, devtools, etc.) alone;
      // paste has its own listener below.
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (DIGITS.has(key)) {
        params.onKeyPress(key as NumericKeyValue);
        event.preventDefault();
        return;
      }

      // '.', locale decimal comma, and the numpad "Decimal" key all map to dot.
      // The shared accept/clamp logic rejects it when decimals are disallowed.
      if (key === '.' || key === ',' || key === 'Decimal') {
        params.onKeyPress('.');
        event.preventDefault();
        return;
      }

      if (key === 'Backspace' || key === 'Delete') {
        if (!params.onClear) return;
        params.onClear();
        event.preventDefault();
      }
    };

    const handlePaste = (raw: unknown) => {
      const event = raw as HardwarePasteEvent;
      const params = paramsRef.current;
      if (params.disabled || !params.active) return;
      if (isEditableTarget(event.target)) return;

      const text = event.clipboardData?.getData('text') ?? '';
      if (!text) return;

      // Feed each character through the same per-key accept/clamp path so max /
      // maxDecimalPlaces / allowDecimal are enforced exactly as they are for taps.
      let consumed = false;
      for (const char of text) {
        if (DIGITS.has(char)) {
          params.onKeyPress(char as NumericKeyValue);
          consumed = true;
        } else if (char === '.' || char === ',') {
          params.onKeyPress('.');
          consumed = true;
        }
      }
      if (consumed) event.preventDefault();
    };

    doc.addEventListener('keydown', handleKeyDown);
    doc.addEventListener('paste', handlePaste);
    return () => {
      doc.removeEventListener('keydown', handleKeyDown);
      doc.removeEventListener('paste', handlePaste);
    };
  }, []);
}
