import { useMemo } from 'react';

import type { NumericKeyValue } from '../api/types';

const DOT_KEY: NumericKeyValue[] = ['.'];
const DIGIT_KEYS: NumericKeyValue[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const DOT_AND_DIGIT_KEYS: NumericKeyValue[] = ['.', ...DIGIT_KEYS];

export interface UseNumericKeypadConfigParams {
  value: string;
  allowDecimal?: boolean;
  maxDecimalPlaces?: number;
  disableKeysAtLimit?: boolean;
}

/**
 * Resolves which keys should render disabled for the current value:
 * - the `.` key whenever `allowDecimal` is `false` (a permanent, structural rule), and
 * - the value-dependent "limit" disabling: the `.` key once a dot exists, plus every digit + `.`
 *   once `maxDecimalPlaces` is reached (until a digit is cleared).
 *
 * The value-dependent limit disabling can be suppressed with `disableKeysAtLimit=false` so keys stay
 * interactive and a limit press is reported via `onInputRejected` (e.g. to shake) instead of being
 * swallowed by a disabled key. The `allowDecimal=false` dot rule is always enforced.
 *
 * Returns `undefined` when no key needs disabling.
 */
export function useNumericKeypadConfig({ value, allowDecimal, maxDecimalPlaces, disableKeysAtLimit = true }: UseNumericKeypadConfigParams) {
  const disabledKeys = useMemo(() => {
    // Structural rule: no decimals at all → the dot is always disabled, regardless of limit behavior.
    if (allowDecimal === false) return DOT_KEY;
    if (!disableKeysAtLimit) return undefined;

    const dotIndex = value.indexOf('.');
    const hasDot = dotIndex !== -1;
    const digitsDisabled = maxDecimalPlaces !== undefined && hasDot && value.length - dotIndex - 1 >= maxDecimalPlaces;

    if (digitsDisabled) return DOT_AND_DIGIT_KEYS;
    if (hasDot) return DOT_KEY;
    return undefined;
  }, [allowDecimal, maxDecimalPlaces, value, disableKeysAtLimit]);

  return { disabledKeys };
}
