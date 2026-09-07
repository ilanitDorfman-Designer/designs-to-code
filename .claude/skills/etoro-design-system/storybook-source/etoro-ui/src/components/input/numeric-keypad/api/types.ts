import { StyleProp, ViewStyle } from 'react-native';

/**
 * A single key value the numeric keypad can emit: the digits `0`–`9` and the decimal point.
 * Canonical to the numeric keypad so it does not depend on the deprecated `EtKeyboard` module.
 */
export type NumericKeyValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | '.';

/**
 * Why a key press was rejected (no value change committed). Lets consumers react to a user hitting an
 * input wall - e.g. shaking the field on `delete-at-zero` or `max`.
 * - `leading-zero`: pressed `0` while the value is already `"0"`.
 * - `decimal-exists`: pressed `.` while the value already has a decimal point.
 * - `decimal-disabled`: pressed `.` while `allowDecimal` is `false`.
 * - `max-decimals`: the press would exceed `maxDecimalPlaces`.
 * - `max`: the press would exceed `max`.
 * - `delete-at-zero`: pressed delete while already at the zero floor (`""` or `"0"`).
 */
export type EtNumericKeypadRejectionReason = 'leading-zero' | 'decimal-exists' | 'decimal-disabled' | 'max-decimals' | 'max' | 'delete-at-zero';

type EtNumericKeypadBaseProps = {
  /**
   * Callback invoked every time a key is pressed or cleared.
   * Receives the updated string value.
   */
  onValueChange?: (value: string) => void;

  /**
   * Called when a key press is rejected without changing the value (see {@link EtNumericKeypadRejectionReason}).
   * When provided, the delete key stays interactive at the zero floor so a `delete-at-zero` press can be
   * reported (instead of being swallowed by the disabled key).
   */
  onInputRejected?: (reason: EtNumericKeypadRejectionReason) => void;

  /**
   * Minimum allowed numeric value.
   * When a clear produces a complete numeric literal (e.g. `"1"`, `"0.5"`)
   * below this threshold, the value is clamped to `String(min)` instead.
   * Partial inputs (e.g. `"0."`) and empty string always pass through unchanged.
   *
   * @example 0.1
   */
  min?: number;

  /**
   * Maximum allowed numeric value.
   * Key presses that would produce a value exceeding this are rejected.
   *
   * @example 999999
   */
  max?: number;

  /**
   * When `false`, the `.` key press is rejected at source — suitable for
   * whole-number inputs such as quantity or share count.
   * Defaults to `true` (decimals allowed).
   *
   * @example
   * // Integer-only (e.g. share count)
   * <EtNumericKeypad allowDecimal={false} ... />
   */
  allowDecimal?: boolean;

  /**
   * Maximum number of digits allowed after the decimal point.
   * Key presses that would exceed this precision are rejected.
   * Has no effect when `allowDecimal` is `false`.
   *
   * @example 2  // e.g. currency: "1.23" ✓  "1.234" ✗
   */
  maxDecimalPlaces?: number;

  /**
   * Controls the value-dependent "limit reached" key disabling (the `.` key once a decimal exists, and
   * every digit once `maxDecimalPlaces` is reached). Defaults to `true`.
   *
   * Set to `false` to keep those keys interactive at their limits — presses are still rejected (no value
   * change) and reported via {@link onInputRejected}, so a screen with its own rejection feedback (e.g. a
   * shake on the amount display) can rely on that instead of greying keys out. The structural
   * `allowDecimal={false}` dot-disable is always enforced regardless of this flag.
   */
  disableKeysAtLimit?: boolean;

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test identifier */
  testID?: string;

  /**
   * When `true`, all keys are non-interactive.
   * Use this to freeze the keyboard during pending states (e.g. API call in flight).
   */
  disabled?: boolean;

  /**
   * When `true`, long-pressing the `C` key wipes the entire value to `""`.
   * Bypasses `min` clamping on purpose: this is an explicit "start over" gesture,
   * distinct from incremental delete (which still clamps to `min` when defined).
   * Defaults to `false` for backwards compatibility.
   */
  enableLongPressClear?: boolean;

  /** Accessibility label forwarded to the keyboard keys container. Optional. */
  accessibilityLabel?: string;

  /** Localized label forwarded to the `C` delete key. */
  deleteLabel?: string;

  /**
   * When `true`, the keypad stretches to fill its parent's height.
   * Use only inside a bounded/flexible parent (e.g. a stretched layout area);
   * leave unset in content-sized parents like bottom sheets or footers.
   */
  fillHeight?: boolean;

  /**
   * Disables the staggered entrance cascade on the keys.
   * In execution screens the bottom-fold already animates in, so the stagger
   * competes with it and adds unnecessary spring work. Pass `false` to suppress.
   * Defaults to `true` (entrance animation on).
   */
  animateEntrance?: boolean;

  /**
   * When `true`, renders a 28px band above the key rows containing
   * a hairline divider and a centered grabber pill (Figma "Keyboard Top").
   * Defaults to `false`.
   */
  topBand?: boolean;

  /**
   * When provided (and `topBand` is `true`), a downward swipe on
   * the top band calls this callback — use it to dismiss the keyboard.
   * Omit for a decorative band with no gesture.
   */
  onTopBandSwipeDown?: () => void;
};

type ControlledProps = {
  /**
   * Externally controlled value. The component renders this and calls
   * `onValueChange` on every key press; the parent is responsible for
   * updating the prop. Cannot be combined with `defaultValue`.
   */
  value: string;
  defaultValue?: never;
};

type UncontrolledProps = {
  /**
   * Initial value for uncontrolled mode. The component owns its own state
   * starting from this value. Cannot be combined with `value`.
   * If provided, the C (clear) key is enabled from the start.
   */
  defaultValue?: string;
  value?: never;
};

/**
 * Props for the {@link EtNumericKeypad} component — a smart, premium numeric keypad with built-in
 * value management. `value` and `defaultValue` are mutually exclusive — pass one or neither.
 *
 * **Uncontrolled** (component owns state):
 * @example
 * ```tsx
 * <EtNumericKeypad
 *   defaultValue="0"
 *   min={0.1}
 *   max={999999}
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 *
 * **Controlled** (parent owns state):
 * @example
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
export type EtNumericKeypadProps = EtNumericKeypadBaseProps & (ControlledProps | UncontrolledProps);
