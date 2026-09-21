import { memo } from 'react';

import { EtNumericKeypadProps } from './api';
import { useNumericKeypadConfig, useNumericKeypadState } from './hooks';
import { NumericKeypadView } from './subcomponents';

/**
 * EtNumericKeypad — the premium numeric keypad with built-in value management.
 *
 * Renders the animated {@link NumericKeypadView} grid and owns the value/validation logic.
 * Supports both **uncontrolled** (internal state via `defaultValue`) and
 * **controlled** (parent-owned state via `value` + `onValueChange`) modes.
 *
 * Behaviour:
 * - C (clear) key is disabled when the current value is empty.
 * - Key presses that would exceed `max` are rejected.
 * - Clears that would produce a parseable number below `min` clamp the value
 *   to `String(min)` instead of removing the last character.
 * - `onValueChange` fires after every accepted key press or clear (including clamps).
 * - When `disabled` is `true`, all keys are non-interactive (e.g. during an API call).
 * - When `allowDecimal` is `false`, the `.` key is visually disabled and non-interactive.
 * - Once `maxDecimalPlaces` is reached, all digit keys are visually disabled until a digit is cleared,
 *   unless `disableKeysAtLimit` is `false` (then keys stay interactive and limit presses are reported
 *   via `onInputRejected` instead).
 *
 * @example Uncontrolled
 * ```tsx
 * <EtNumericKeypad
 *   defaultValue="10"
 *   min={0.1}
 *   max={999999}
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [amount, setAmount] = useState('');
 *
 * <EtNumericKeypad
 *   value={amount}
 *   min={0.1}
 *   max={999999}
 *   onValueChange={setAmount}
 * />
 * ```
 */
function EtNumericKeypadBase({
  defaultValue,
  value,
  min,
  max,
  allowDecimal,
  maxDecimalPlaces,
  disableKeysAtLimit,
  onValueChange,
  onInputRejected,
  disabled,
  enableLongPressClear,
  style,
  testID,
  accessibilityLabel,
  deleteLabel,
  fillHeight,
  animateEntrance,
  topBand,
  onTopBandSwipeDown,
}: EtNumericKeypadProps) {
  const {
    value: currentValue,
    isClearDisabled,
    handleKeyPress,
    handleClear,
    handleClearAll,
  } = useNumericKeypadState({
    defaultValue,
    value,
    min,
    max,
    allowDecimal,
    maxDecimalPlaces,
    onValueChange,
    onInputRejected,
  });

  // Keep the delete key interactive at the zero floor when a rejection consumer is present, so a
  // `delete-at-zero` press is reported (e.g. to shake) instead of being swallowed by the disabled key.
  const clearHandler = !isClearDisabled || onInputRejected ? handleClear : undefined;

  const { disabledKeys } = useNumericKeypadConfig({ value: currentValue, allowDecimal, maxDecimalPlaces, disableKeysAtLimit });

  return (
    <NumericKeypadView
      onKeyPress={handleKeyPress}
      onClear={clearHandler}
      onClearAll={enableLongPressClear && !isClearDisabled ? handleClearAll : undefined}
      disabled={disabled}
      disabledKeys={disabledKeys}
      fillHeight={fillHeight}
      animateEntrance={animateEntrance}
      topBand={topBand}
      onTopBandSwipeDown={onTopBandSwipeDown}
      style={style}
      accessibilityLabel={accessibilityLabel}
      deleteLabel={deleteLabel}
      testID={testID}
    />
  );
}

EtNumericKeypadBase.displayName = 'EtNumericKeypad';

export const EtNumericKeypad = memo(EtNumericKeypadBase);

EtNumericKeypad.displayName = 'EtNumericKeypad';
