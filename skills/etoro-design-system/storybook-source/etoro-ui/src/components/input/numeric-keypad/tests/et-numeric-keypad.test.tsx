import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, renderHook } from '@testing-library/react-native';

import { EtNumericKeypad } from '../et-numeric-keypad';
import { useNumericKeypadState } from '../hooks';

// ─── mocks ──────────────────────────────────────────────────────────────────

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('../../../../foundations/text', () => {
  const { Text } = require('react-native');
  return {
    EtText: function MockEtText({ children, ...props }: any) {
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('react-native-svg', () => require('./keypad-test-mocks').createSvgMock());

// This suite only presses/long-presses keys, so the shared gesture-handler mock is used without pan
// wiring (see `keypad-test-mocks` for why a bespoke mock is needed over the inert global one).
jest.mock('react-native-gesture-handler', () => require('./keypad-test-mocks').createGestureHandlerMock());

// ─── helpers ─────────────────────────────────────────────────────────────────

const TEST_ID = 'ck';

const pressKey = (key: string) => (queries: ReturnType<typeof render>) => fireEvent.press(queries.getByTestId(`${TEST_ID}-key-${key}`));

const pressDigit = (digit: string) => pressKey(digit);
const pressDot = pressKey('.');
const pressClear = pressKey('C');
const longPressClear = (queries: ReturnType<typeof render>) => fireEvent(queries.getByTestId(`${TEST_ID}-key-C`), 'longPress');

// Entrance animation is disabled in tests for determinism; behavior is identical.
const renderKeypad = (props: Record<string, unknown> = {}) => render(<EtNumericKeypad testID={TEST_ID} animateEntrance={false} {...props} />);

// ============================================================================
// useNumericKeypadState — unit tests
// ============================================================================

describe('useNumericKeypadState', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('initial value', () => {
    it('starts empty when no defaultValue is given', () => {
      const { result } = renderHook(() => useNumericKeypadState({}));
      expect(result.current.value).toBe('');
    });

    it('starts with defaultValue when provided', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '42' }));
      expect(result.current.value).toBe('42');
    });

    it('isClearDisabled is true when value is empty', () => {
      const { result } = renderHook(() => useNumericKeypadState({}));
      expect(result.current.isClearDisabled).toBe(true);
    });

    it('isClearDisabled is false when defaultValue is non-empty', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5' }));
      expect(result.current.isClearDisabled).toBe(false);
    });
  });

  describe('handleKeyPress — digit appending', () => {
    it('appends a digit to the current value', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1' }));
      act(() => result.current.handleKeyPress('2'));
      expect(result.current.value).toBe('12');
    });

    it('fires onValueChange with the new value', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ onValueChange }));
      act(() => result.current.handleKeyPress('5'));
      expect(onValueChange).toHaveBeenCalledWith('5');
    });

    it('replaces a bare "0" when a non-zero digit is pressed', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '0' }));
      act(() => result.current.handleKeyPress('7'));
      expect(result.current.value).toBe('7');
    });

    it('ignores a "0" press when value is already "0"', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '0', onValueChange }));
      act(() => result.current.handleKeyPress('0'));
      expect(result.current.value).toBe('0');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyPress — dot key', () => {
    it('prefixes "0." when dot is pressed on an empty value', () => {
      const { result } = renderHook(() => useNumericKeypadState({}));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('0.');
    });

    it('appends "." to an existing integer value', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5' }));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('5.');
    });

    it('ignores a second dot press when value already contains "."', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1.', onValueChange }));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('1.');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyPress — allowDecimal', () => {
    it('rejects dot when allowDecimal is false', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ allowDecimal: false, onValueChange }));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('rejects dot on a non-empty value when allowDecimal is false', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5', allowDecimal: false, onValueChange }));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('5');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('still allows dot when allowDecimal is true', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5', allowDecimal: true }));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('5.');
    });

    it('still allows dot when allowDecimal is omitted (default behaviour)', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5' }));
      act(() => result.current.handleKeyPress('.'));
      expect(result.current.value).toBe('5.');
    });
  });

  describe('handleKeyPress — maxDecimalPlaces', () => {
    it('rejects a digit that would exceed maxDecimalPlaces', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1.23', maxDecimalPlaces: 2, onValueChange }));
      act(() => result.current.handleKeyPress('4')); // "1.234" — 3 dp > 2
      expect(result.current.value).toBe('1.23');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('allows a digit that stays within maxDecimalPlaces', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1.2', maxDecimalPlaces: 2 }));
      act(() => result.current.handleKeyPress('3')); // "1.23" — 2 dp === 2
      expect(result.current.value).toBe('1.23');
    });

    it('allows the dot key itself regardless of maxDecimalPlaces', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1', maxDecimalPlaces: 2 }));
      act(() => result.current.handleKeyPress('.')); // "1." — 0 dp
      expect(result.current.value).toBe('1.');
    });

    it('does not constrain integer input when no decimal point is present', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '12', maxDecimalPlaces: 2 }));
      act(() => result.current.handleKeyPress('3')); // "123" — no decimal
      expect(result.current.value).toBe('123');
    });
  });

  describe('handleKeyPress — max enforcement', () => {
    it('rejects a key press that would exceed max', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '9', max: 10, onValueChange }));
      act(() => result.current.handleKeyPress('5')); // "95" > 10
      expect(result.current.value).toBe('9');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('allows a key press that stays within max', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1', max: 100 }));
      act(() => result.current.handleKeyPress('0')); // "10" <= 100
      expect(result.current.value).toBe('10');
    });

    it('allows a key press exactly equal to max', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '9', max: 99 }));
      act(() => result.current.handleKeyPress('9')); // "99" === 99
      expect(result.current.value).toBe('99');
    });
  });

  describe('handleClear', () => {
    it('removes the last character', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '123' }));
      act(() => result.current.handleClear());
      expect(result.current.value).toBe('12');
    });

    it('fires onValueChange with the trimmed value', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5', onValueChange }));
      act(() => result.current.handleClear());
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('clears to empty string regardless of min', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '5', min: 2, onValueChange }));
      act(() => result.current.handleClear()); // "" bypasses min guard
      expect(result.current.value).toBe('');
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('allows partial strings like "0." through without clamping', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '0.5', min: 0.1, onValueChange }));
      act(() => result.current.handleClear()); // "0." is not a complete number
      expect(result.current.value).toBe('0.');
      expect(onValueChange).toHaveBeenCalledWith('0.');
    });

    it('clamps a complete number below min to String(min)', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '25', min: 3, onValueChange }));
      act(() => result.current.handleClear()); // "2" < 3 → clamp
      expect(result.current.value).toBe('3');
      expect(onValueChange).toHaveBeenCalledWith('3');
    });

    it('does not clamp a complete number equal to min', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '25', min: 2 }));
      act(() => result.current.handleClear()); // "2" === 2 → no clamp
      expect(result.current.value).toBe('2');
    });

    it('does not clamp a complete number above min', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '15', min: 1 }));
      act(() => result.current.handleClear()); // "1" === 1 ≥ min → no clamp
      expect(result.current.value).toBe('1');
    });
  });

  describe('handleClearAll', () => {
    it('commits an empty string regardless of current value', () => {
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '12345' }));
      act(() => result.current.handleClearAll());
      expect(result.current.value).toBe('');
    });

    it('fires onValueChange with an empty string', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '7', onValueChange }));
      act(() => result.current.handleClearAll());
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('bypasses the min clamp (explicit "start over" gesture)', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '25', min: 3, onValueChange }));
      act(() => result.current.handleClearAll());
      expect(result.current.value).toBe('');
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('does not update internal state in controlled mode — only fires onValueChange', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ value: '42', onValueChange }));
      act(() => result.current.handleClearAll());
      expect(onValueChange).toHaveBeenCalledWith('');
      expect(result.current.value).toBe('42');
    });
  });

  describe('onInputRejected', () => {
    it('reports "leading-zero" when 0 is pressed on a bare "0"', () => {
      const onInputRejected = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '0', onInputRejected }));
      act(() => result.current.handleKeyPress('0'));
      expect(onInputRejected).toHaveBeenCalledWith('leading-zero');
    });

    it('reports "decimal-disabled" when dot is pressed and allowDecimal is false', () => {
      const onInputRejected = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ allowDecimal: false, onInputRejected }));
      act(() => result.current.handleKeyPress('.'));
      expect(onInputRejected).toHaveBeenCalledWith('decimal-disabled');
    });

    it('reports "decimal-exists" when a second dot is pressed', () => {
      const onInputRejected = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1.', onInputRejected }));
      act(() => result.current.handleKeyPress('.'));
      expect(onInputRejected).toHaveBeenCalledWith('decimal-exists');
    });

    it('reports "max-decimals" when the press would exceed maxDecimalPlaces', () => {
      const onInputRejected = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1.23', maxDecimalPlaces: 2, onInputRejected }));
      act(() => result.current.handleKeyPress('4'));
      expect(onInputRejected).toHaveBeenCalledWith('max-decimals');
    });

    it('reports "max" when the press would exceed max', () => {
      const onInputRejected = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '9', max: 10, onInputRejected }));
      act(() => result.current.handleKeyPress('5'));
      expect(onInputRejected).toHaveBeenCalledWith('max');
    });

    it('reports "delete-at-zero" and does not commit when deleting an empty value', () => {
      const onInputRejected = jest.fn();
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ value: '', onInputRejected, onValueChange }));
      act(() => result.current.handleClear());
      expect(onInputRejected).toHaveBeenCalledWith('delete-at-zero');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('reports "delete-at-zero" and does not commit when deleting a bare "0"', () => {
      const onInputRejected = jest.fn();
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ value: '0', onInputRejected, onValueChange }));
      act(() => result.current.handleClear());
      expect(onInputRejected).toHaveBeenCalledWith('delete-at-zero');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not report a rejection for an accepted press', () => {
      const onInputRejected = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ defaultValue: '1', onInputRejected }));
      act(() => result.current.handleKeyPress('2'));
      expect(onInputRejected).not.toHaveBeenCalled();
    });
  });

  describe('controlled mode', () => {
    it('uses the controlled value instead of internal state', () => {
      const { result } = renderHook(() => useNumericKeypadState({ value: '99' }));
      expect(result.current.value).toBe('99');
    });

    it('does not update internal state on key press — only fires onValueChange', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ value: '5', onValueChange }));
      act(() => result.current.handleKeyPress('1'));
      expect(onValueChange).toHaveBeenCalledWith('51');
      // value stays "5" because parent hasn't updated the prop
      expect(result.current.value).toBe('5');
    });

    it('does not update internal state on clear — only fires onValueChange', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useNumericKeypadState({ value: '5', onValueChange }));
      act(() => result.current.handleClear());
      expect(onValueChange).toHaveBeenCalledWith('');
      expect(result.current.value).toBe('5');
    });
  });
});

// ============================================================================
// EtNumericKeypad — component integration tests
// ============================================================================

describe('EtNumericKeypad', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('C key enabled/disabled state', () => {
    it('renders with C key disabled when no value exists', () => {
      const queries = renderKeypad();
      expect(queries.getByTestId(`${TEST_ID}-key-C`).props.accessibilityState?.disabled).toBe(true);
    });

    it('enables C key after a digit is pressed', () => {
      const queries = renderKeypad();
      pressDigit('5')(queries);
      expect(queries.getByTestId(`${TEST_ID}-key-C`).props.accessibilityState?.disabled).not.toBe(true);
    });

    it('renders with C key enabled when defaultValue is non-empty', () => {
      const queries = renderKeypad({ defaultValue: '10' });
      expect(queries.getByTestId(`${TEST_ID}-key-C`).props.accessibilityState?.disabled).not.toBe(true);
    });

    it('disables C key again after value is fully cleared', () => {
      const queries = renderKeypad({ defaultValue: '5' });
      pressClear(queries);
      expect(queries.getByTestId(`${TEST_ID}-key-C`).props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('disabled prop', () => {
    it('marks all keys as disabled when disabled is true', () => {
      const queries = renderKeypad({ disabled: true });
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C'].forEach((key) => {
        expect(queries.getByTestId(`${TEST_ID}-key-${key}`).props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('does not mark keys as disabled when disabled is false', () => {
      const queries = renderKeypad({ defaultValue: '5', disabled: false });
      expect(queries.getByTestId(`${TEST_ID}-key-1`).props.accessibilityState?.disabled).not.toBe(true);
    });

    it('does not fire onValueChange when a key is pressed while disabled', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ disabled: true, onValueChange });
      pressDigit('5')(queries);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('allowDecimal={false} — dot key visually disabled', () => {
    it('renders the dot key as disabled when allowDecimal is false', () => {
      const queries = renderKeypad({ allowDecimal: false });
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).toBe(true);
    });

    it('keeps digit keys enabled when allowDecimal is false', () => {
      const queries = renderKeypad({ allowDecimal: false });
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((digit) => {
        expect(queries.getByTestId(`${TEST_ID}-key-${digit}`).props.accessibilityState?.disabled).not.toBe(true);
      });
    });

    it('renders the dot key as enabled when allowDecimal is not set and value has no dot', () => {
      const queries = renderKeypad({ defaultValue: '5' });
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).not.toBe(true);
    });
  });

  describe('dot key — disabled once value contains a dot', () => {
    it('disables the dot key once value already contains a dot', () => {
      const queries = renderKeypad({ defaultValue: '2.2' });
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).toBe(true);
    });

    it('disables the dot key for a partial value ending in "."', () => {
      const queries = renderKeypad({ defaultValue: '2.' });
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).toBe(true);
    });

    it('re-enables the dot key after the dot is cleared from the value', () => {
      const queries = renderKeypad({ defaultValue: '2.' });
      pressClear(queries); // "2" — no dot anymore
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).not.toBe(true);
    });

    it('keeps digits enabled while dot is disabled but decimal places are below limit', () => {
      const queries = renderKeypad({ defaultValue: '1.2', maxDecimalPlaces: 2 });
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).toBe(true);
      expect(queries.getByTestId(`${TEST_ID}-key-3`).props.accessibilityState?.disabled).not.toBe(true);
    });
  });

  describe('maxDecimalPlaces — digit keys visually disabled when limit reached', () => {
    it('disables all digit keys and dot once maxDecimalPlaces is reached', () => {
      const queries = renderKeypad({ defaultValue: '1.23', maxDecimalPlaces: 2 });
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].forEach((key) => {
        expect(queries.getByTestId(`${TEST_ID}-key-${key}`).props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('keeps digit keys enabled when decimal places are below the limit', () => {
      const queries = renderKeypad({ defaultValue: '1.2', maxDecimalPlaces: 2 });
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((digit) => {
        expect(queries.getByTestId(`${TEST_ID}-key-${digit}`).props.accessibilityState?.disabled).not.toBe(true);
      });
    });

    it('re-enables digit keys after a decimal digit is cleared', () => {
      const queries = renderKeypad({ defaultValue: '1.23', maxDecimalPlaces: 2 });
      pressClear(queries); // "1.2" — 1 dp < 2
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((digit) => {
        expect(queries.getByTestId(`${TEST_ID}-key-${digit}`).props.accessibilityState?.disabled).not.toBe(true);
      });
    });

    it('re-enables both dot and digit keys after clearing past the decimal point', () => {
      const queries = renderKeypad({ defaultValue: '1.', maxDecimalPlaces: 2 });
      pressClear(queries); // "1" — no dot at all
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).not.toBe(true);
      expect(queries.getByTestId(`${TEST_ID}-key-5`).props.accessibilityState?.disabled).not.toBe(true);
    });

    it('keeps digit keys enabled when value has no decimal point', () => {
      const queries = renderKeypad({ defaultValue: '123', maxDecimalPlaces: 2 });
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((digit) => {
        expect(queries.getByTestId(`${TEST_ID}-key-${digit}`).props.accessibilityState?.disabled).not.toBe(true);
      });
    });

    it('keeps dot key enabled when value has no decimal point', () => {
      const queries = renderKeypad({ defaultValue: '123', maxDecimalPlaces: 2 });
      expect(queries.getByTestId(`${TEST_ID}-key-.`).props.accessibilityState?.disabled).not.toBe(true);
    });
  });

  describe('onValueChange callback', () => {
    it('fires onValueChange when a digit is pressed', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ onValueChange });
      pressDigit('7')(queries);
      expect(onValueChange).toHaveBeenCalledWith('7');
    });

    it('fires onValueChange when C is pressed', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ defaultValue: '42', onValueChange });
      pressClear(queries);
      expect(onValueChange).toHaveBeenCalledWith('4');
    });

    it('fires onValueChange when dot is pressed on empty value', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ onValueChange });
      pressDot(queries);
      expect(onValueChange).toHaveBeenCalledWith('0.');
    });

    it('does not fire onValueChange for rejected presses (max exceeded)', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ defaultValue: '9', max: 10, onValueChange });
      pressDigit('5')(queries); // "95" > 10
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('onInputRejected — delete-at-zero wall', () => {
    it('keeps the C key interactive at empty when onInputRejected is provided', () => {
      const queries = renderKeypad({ onInputRejected: jest.fn() });
      expect(queries.getByTestId(`${TEST_ID}-key-C`).props.accessibilityState?.disabled).not.toBe(true);
    });

    it('fires delete-at-zero (and does not change the value) when C is pressed at empty', () => {
      const onInputRejected = jest.fn();
      const onValueChange = jest.fn();
      const queries = renderKeypad({ onInputRejected, onValueChange });
      pressClear(queries);
      expect(onInputRejected).toHaveBeenCalledWith('delete-at-zero');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('keeps the C key disabled at empty when onInputRejected is not provided', () => {
      const queries = renderKeypad();
      expect(queries.getByTestId(`${TEST_ID}-key-C`).props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('enableLongPressClear', () => {
    it('wipes the value to empty string on long-press of C', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ defaultValue: '12345', enableLongPressClear: true, onValueChange });
      longPressClear(queries);
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('bypasses min clamp on long-press clear', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ defaultValue: '25', min: 3, enableLongPressClear: true, onValueChange });
      longPressClear(queries);
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('short-press on C still removes only the last character when long-press is enabled', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ defaultValue: '42', enableLongPressClear: true, onValueChange });
      pressClear(queries);
      expect(onValueChange).toHaveBeenCalledWith('4');
    });

    it('does not wipe the value on long-press when enableLongPressClear is omitted', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ defaultValue: '12345', onValueChange });
      longPressClear(queries);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not attempt to clear when value is empty even with enableLongPressClear', () => {
      const onValueChange = jest.fn();
      const queries = renderKeypad({ enableLongPressClear: true, onValueChange });
      longPressClear(queries);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
