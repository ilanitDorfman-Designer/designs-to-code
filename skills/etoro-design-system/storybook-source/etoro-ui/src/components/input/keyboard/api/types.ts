import { MemoExoticComponent, ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type KeyboardKeyValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | '.';

/** @deprecated Part of the legacy `EtKeyboard`. Use `EtNumericKeypad` instead. */
export interface EtKeyboardSlotProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** @deprecated Part of the legacy `EtKeyboard`. Use `EtNumericKeypad` (and `EtNumericKeypadProps`) instead. */
export interface EtKeyboardKeysProps {
  onKeyPress: (value: KeyboardKeyValue) => void;
  onClear?: () => void;
  /**
   * Called when the C key is long-pressed (default 500ms).
   * Intended for a "clear-all / wipe value" gesture; consumers decide what that means.
   * When omitted, no `onLongPress` handler is attached and the C key behaves as a plain delete.
   * Suppresses the subsequent `onPress` per React Native's `Pressable` semantics.
   */
  onClearAll?: () => void;
  /** When `true`, disables all keys at once. */
  disabled?: boolean;
  /**
   * Individual keys to render as disabled (greyed out, non-interactive).
   * Use this to suppress specific keys without disabling the whole keyboard.
   * @example ['.'] // disable the decimal key for integer-only inputs
   */
  disabledKeys?: KeyboardKeyValue[];
  style?: StyleProp<ViewStyle>;
  /**
   * Overrides the key label color. When set, it is applied to every key
   * (enabled and disabled alike), so the keys keep a uniform color instead of
   * dimming to the disabled token. Also used for the "C" badge outline.
   */
  keyColor?: string;
  /** Style override merged into each key label (e.g. `fontSize`, `fontWeight`, `lineHeight`). */
  keyTextStyle?: StyleProp<TextStyle>;
  testID?: string;
  /** Accessibility label for the keys container. Defaults to "Numeric keyboard". */
  accessibilityLabel?: string;
  /** Accessibility label announced for the C (delete) key. Defaults to "Delete". */
  deleteLabel?: string;
  /** Enable haptic feedback on key press. Defaults to true. */
  haptics?: boolean;
}

/** @deprecated Part of the legacy `EtKeyboard`. Use `EtNumericKeypad` instead. */
export interface EtKeyboardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** @deprecated Part of the legacy `EtKeyboard`. Use `EtNumericKeypad` instead. */
export interface EtKeyboardCompound extends MemoExoticComponent<(props: EtKeyboardProps) => ReactNode> {
  Header: (props: EtKeyboardSlotProps) => ReactNode;
  Keys: (props: EtKeyboardKeysProps) => ReactNode;
  Actions: (props: EtKeyboardSlotProps) => ReactNode;
}
