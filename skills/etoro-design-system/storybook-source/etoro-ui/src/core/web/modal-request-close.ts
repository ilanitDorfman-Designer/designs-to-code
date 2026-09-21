/**
 * Platform seam for RN `Modal`'s `onRequestClose`.
 *
 * Native: the handler wires the Android back button — pass it through.
 *
 * Web twin returns undefined: react-native-web's Modal ALSO routes the Escape
 * key through `onRequestClose` — on keyUP — so a layer that registers on the
 * shared dismiss stack (`use-dismissable`, keyDOWN) would own two independent
 * Escape paths. The stack's `preventDefault()` marks only the keydown event;
 * the Modal's keyup listener never sees it, and one physical Escape press
 * could close two stacked layers (the stack's topmost on keydown, the Modal
 * on keyup). On web, Escape belongs to the dismiss stack alone.
 */
export const modalRequestClose = (close: () => void): (() => void) | undefined => close;
