import { useCallback, useRef, useState } from 'react';

import type { EtNumericKeypadProps, NumericKeyValue } from '../api';

// Matches only complete numeric literals (e.g. "1", "0.5") — not partials like "0." or "".
const FULL_NUMERIC_RE = /^\d+(\.\d+)?$/;

export type UseNumericKeypadStateParams = Pick<
  EtNumericKeypadProps,
  'defaultValue' | 'value' | 'min' | 'max' | 'allowDecimal' | 'maxDecimalPlaces' | 'onValueChange' | 'onInputRejected'
>;

export function useNumericKeypadState({
  defaultValue,
  value: controlledValue,
  min,
  max,
  allowDecimal,
  maxDecimalPlaces,
  onValueChange,
  onInputRejected,
}: UseNumericKeypadStateParams) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const value = isControlled ? controlledValue : internalValue;

  // In controlled mode the parent owns state — only fire the callback.
  // In uncontrolled mode update internal state and fire the callback.
  const commit = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  // Ref holds all volatile inputs so handleKeyPress and handleClear stay stable
  // across value changes. Without this, every accepted key rebuilds both callbacks,
  // breaks memo() on all 12 KeypadKey instances, and re-creates RNGH gestures.
  const keyStateRef = useRef({ value, allowDecimal, maxDecimalPlaces, max, min, onInputRejected });
  keyStateRef.current = { value, allowDecimal, maxDecimalPlaces, max, min, onInputRejected };

  const commitAndSyncRef = useCallback(
    (nextValue: string) => {
      commit(nextValue);
      if (!isControlled) {
        keyStateRef.current.value = nextValue;
      }
    },
    [commit, isControlled],
  );

  const handleKeyPress = useCallback(
    (key: NumericKeyValue) => {
      const { value: v, allowDecimal: aD, maxDecimalPlaces: mDP, max: mx, onInputRejected: onReject } = keyStateRef.current;
      let newValue: string;

      if (key === '.') {
        if (aD === false) {
          onReject?.('decimal-disabled');
          return;
        }
        if (v.includes('.')) {
          onReject?.('decimal-exists');
          return;
        }
        newValue = v === '' ? '0.' : `${v}.`;
      } else if (v === '0' && key === '0') {
        onReject?.('leading-zero');
        return;
      } else if (v === '0' && key !== '0') {
        newValue = key;
      } else {
        newValue = `${v}${key}`;
      }

      if (mDP !== undefined) {
        const dotIndex = newValue.indexOf('.');
        if (dotIndex !== -1 && newValue.length - dotIndex - 1 > mDP) {
          onReject?.('max-decimals');
          return;
        }
      }

      if (mx !== undefined) {
        const num = parseFloat(newValue);
        if (!isNaN(num) && num > mx) {
          onReject?.('max');
          return;
        }
      }

      commitAndSyncRef(newValue);
    },
    [commitAndSyncRef],
  );

  const handleClear = useCallback(() => {
    const { value: v, min: mn, onInputRejected: onReject } = keyStateRef.current;

    // Already at the zero floor: nothing meaningful to delete. Report the rejected press (so consumers
    // can react, e.g. shake) instead of committing a redundant empty value.
    if (onReject && (v === '' || v === '0')) {
      onReject('delete-at-zero');
      return;
    }

    const newValue = v.slice(0, -1);

    if (mn !== undefined && newValue !== '' && FULL_NUMERIC_RE.test(newValue)) {
      if (parseFloat(newValue) < mn) {
        commitAndSyncRef(String(mn));
        return;
      }
    }

    commitAndSyncRef(newValue);
  }, [commitAndSyncRef]);

  // Long-press "wipe value" gesture. Always commits an empty string regardless
  // of `min` — single-char delete is responsible for the min-clamp safety net,
  // whereas this gesture is an explicit "start over" from the user.
  const handleClearAll = useCallback(() => {
    commitAndSyncRef('');
  }, [commitAndSyncRef]);

  return {
    value,
    isClearDisabled: value.length === 0,
    handleKeyPress,
    handleClear,
    handleClearAll,
  };
}
