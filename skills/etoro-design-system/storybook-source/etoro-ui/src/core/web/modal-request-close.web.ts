/**
 * Web: never hand Escape to react-native-web's Modal (it fires
 * `onRequestClose` on keyUP, bypassing the dismiss stack's keyDOWN
 * `preventDefault()`) — Escape is owned by the dismiss stack alone.
 * Full reasoning on the native twin.
 */
export const modalRequestClose = (_close: () => void): (() => void) | undefined => undefined;
