import { type ReactNode } from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export interface EtKeyboardAvoidingViewProps {
  children: ReactNode;
  /** Container style. Usually `{ flex: 1 }` so it fills the screen below the top bar. */
  style?: StyleProp<ViewStyle>;
  /**
   * iOS keyboard-avoidance strategy. Defaults to `'padding'`, which pads the
   * container's bottom by the keyboard height so a footer child (composer)
   * rises with the keyboard while the scroll area above it shrinks.
   * Android relies on `adjustResize` (set by `KeyboardProvider`) and needs no
   * behavior — the default resolves to `undefined` there.
   */
  behavior?: 'padding' | 'height' | 'position';
  /** Distance from the top of this view to the top of the screen (e.g. a header height). */
  keyboardVerticalOffset?: number;
  enabled?: boolean;
  testID?: string;
}

const DEFAULT_IOS_BEHAVIOR = 'padding' as const;

/**
 * Keyboard-avoiding container built on `react-native-keyboard-controller`'s
 * native `KeyboardAvoidingView`.
 *
 * This is the canonical primitive for screens where an input footer (a chat /
 * comment composer) must sit above the soft keyboard with a scroll area above
 * it. Wrap the scroll surface and the footer together; on iOS the container's
 * bottom is padded by the keyboard height (footer rises, list shrinks), on
 * Android `adjustResize` handles it.
 *
 * Why native (and not a translateY sticky view): the previous
 * `EtKeyboardStickyView` drove a `translateY` from keyboard-controller's
 * animated/shared keyboard values. That JS-driven path works in the iOS
 * simulator / Debug but is silently not driven in Release builds on physical
 * iOS devices under the New Architecture, leaving the composer hidden behind
 * the keyboard. `KeyboardAvoidingView` (like `KeyboardAwareScrollView`) is a
 * native component and does not depend on that stream, so it survives Release
 * on device — the same approach the sibling app uses successfully.
 *
 * Requires `KeyboardProvider` (from `react-native-keyboard-controller`)
 * mounted above the tree. The mobile app mounts it once at the root layout.
 *
 * Safe-area note: this only handles keyboard motion. A footer that must clear
 * the Android 3-button nav bar / iOS home indicator while the keyboard is
 * closed should add its own `paddingBottom` (e.g. `insets.bottom`), gated to
 * the keyboard-closed state so it doesn't leave a gap once the keyboard pads
 * the container.
 *
 * @example
 * ```tsx
 * <EtScreen>
 *   <EtScreen.TopBar isInnerScreen />
 *   <EtKeyboardAvoidingView style={{ flex: 1 }}>
 *     <CommentList />
 *     <View style={{ paddingBottom: isKeyboardVisible ? 0 : insets.bottom }}>
 *       <CommentComposer />
 *     </View>
 *   </EtKeyboardAvoidingView>
 * </EtScreen>
 * ```
 */
export function EtKeyboardAvoidingView({
  children,
  style,
  behavior,
  keyboardVerticalOffset = 0,
  enabled = true,
  testID,
}: EtKeyboardAvoidingViewProps) {
  const resolvedBehavior = behavior ?? (Platform.OS === 'ios' ? DEFAULT_IOS_BEHAVIOR : undefined);

  return (
    <KeyboardAvoidingView style={style} behavior={resolvedBehavior} keyboardVerticalOffset={keyboardVerticalOffset} enabled={enabled} testID={testID}>
      {children}
    </KeyboardAvoidingView>
  );
}
