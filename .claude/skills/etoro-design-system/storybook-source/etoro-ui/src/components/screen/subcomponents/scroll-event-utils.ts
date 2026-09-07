import { type HostInstance, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { ScrollEvent } from 'react-native-reanimated';

// Placeholder for target/currentTarget in synthetic scroll events.
// Consumers only access nativeEvent, so the host instance is never used.
const EMPTY_HOST_INSTANCE = null as unknown as HostInstance;

/**
 * Wraps a Reanimated scroll event into the NativeSyntheticEvent structure
 * that consumers expect (event.nativeEvent.contentOffset, etc.)
 */
export function wrapReanimatedScrollEvent(event: ScrollEvent): NativeSyntheticEvent<NativeScrollEvent> {
  return {
    nativeEvent: {
      contentOffset: event.contentOffset,
      contentSize: event.contentSize,
      layoutMeasurement: event.layoutMeasurement,
      velocity: event.velocity,
      contentInset: event.contentInset || {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      zoomScale: event.zoomScale || 1,
    },
    currentTarget: EMPTY_HOST_INSTANCE,
    target: EMPTY_HOST_INSTANCE,
    timeStamp: Date.now(),
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: true,
    type: 'scroll',
    persist: noop,
    stopPropagation: noop,
    preventDefault: noop,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
  };
}

function noop(): void {
  return;
}
function returnFalse() {
  return false;
}
