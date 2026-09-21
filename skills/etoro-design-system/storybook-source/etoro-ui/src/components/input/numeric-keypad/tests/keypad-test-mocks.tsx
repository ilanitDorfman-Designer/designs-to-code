/**
 * Shared Jest mocks for the numeric-keypad test suites.
 *
 * The global test setup mocks `react-native-gesture-handler` as inert (GestureDetector → View) and
 * its chainable builder lacks `.onBegin` / `Gesture.Exclusive`. The premium keypad drives presses
 * (and, on the view, a drag-to-dismiss pan) through GestureDetector + the chainable Gesture API, so
 * both suites need a mock that records the Tap/LongPress/Pan handlers and wires them to a Pressable
 * (honoring `.enabled()`), letting `fireEvent.press` / `fireEvent(..., '<event>')` exercise the real
 * callbacks. These factories are `require()`d from inside each file's `jest.mock(...)` call so the
 * mock lives in one place instead of being duplicated per suite.
 */
import React from 'react';
import { Pressable, View } from 'react-native';

/**
 * Builds the `react-native-gesture-handler` mock.
 * @param options.panSwipe When `true`, the GestureDetector also exposes `onSwipeDown` /
 *   `onSwipeDownShort` props that fire the recorded Pan `update`/`end` handlers (used by the view
 *   suite's drag-to-dismiss tests). Omit for suites that only need tap/long-press.
 */
export function createGestureHandlerMock(options: { panSwipe?: boolean } = {}) {
  const { panSwipe = false } = options;

  const makeGesture = (type: string) => {
    const node: any = { __type: type, __handlers: {}, __enabled: true, __children: null };
    node.enabled = (value: boolean) => {
      node.__enabled = value;
      return node;
    };
    const record = (key: string) => (fn: () => void) => {
      node.__handlers[key] = fn;
      return node;
    };
    node.onBegin = record('begin');
    node.onFinalize = record('finalize');
    node.onStart = record('start');
    node.onEnd = record('end');
    node.onUpdate = record('update');
    node.onChange = () => node;
    node.onTouchesMove = () => node;
    node.minDuration = () => node;
    node.maxDistance = () => node;
    node.numberOfTaps = () => node;
    node.activeOffsetY = () => node;
    node.activeOffsetX = () => node;
    node.failOffsetX = () => node;
    node.shouldCancelWhenOutside = () => node;
    return node;
  };

  const composite =
    (type: string) =>
    (...children: any[]) => {
      const node = makeGesture(type);
      node.__children = children;
      return node;
    };

  const findByType = (node: any, type: string): any => {
    if (!node) return null;
    if (node.__children) {
      for (const child of node.__children) {
        const found = findByType(child, type);
        if (found) return found;
      }
      return null;
    }
    return node.__type === type ? node : null;
  };

  function GestureDetector({ gesture, children }: any) {
    const tap = findByType(gesture, 'tap');
    const longPress = findByType(gesture, 'longPress');
    const props: any = {
      onPress: () => {
        if (tap && tap.__enabled !== false) {
          tap.__handlers.begin?.();
          tap.__handlers.end?.({}, true);
          tap.__handlers.finalize?.();
        }
      },
      onLongPress: () => {
        if (longPress && longPress.__enabled !== false) {
          longPress.__handlers.start?.();
        }
      },
    };

    if (panSwipe) {
      const pan = findByType(gesture, 'pan');
      props.onSwipeDown = () => {
        if (pan && pan.__enabled !== false) {
          pan.__handlers.update?.({ translationY: 200 });
          pan.__handlers.end?.({ translationY: 200, velocityY: 1200 });
        }
      };
      props.onSwipeDownShort = () => {
        if (pan && pan.__enabled !== false) {
          pan.__handlers.update?.({ translationY: 10 });
          pan.__handlers.end?.({ translationY: 10, velocityY: 0 });
        }
      };
    }

    return React.createElement(Pressable, props, children);
  }

  return {
    Gesture: {
      Tap: () => makeGesture('tap'),
      LongPress: () => makeGesture('longPress'),
      Pan: () => makeGesture('pan'),
      Exclusive: composite('exclusive'),
      Race: composite('race'),
      Simultaneous: composite('simultaneous'),
    },
    GestureDetector,
    gestureHandlerRootHOC: (component: any) => component,
    State: {},
  };
}

/**
 * Builds the `react-native-svg` mock (top-band outline + clear-key badge render as inert Views).
 * @param options.svgTestID Optional `testID` applied to the mocked `Svg` so a suite can assert the
 *   clear-key badge rendered.
 */
export function createSvgMock(options: { svgTestID?: string } = {}) {
  const { svgTestID } = options;

  function Passthrough({ children }: any) {
    return React.createElement(View, null, children);
  }
  function MockSvg({ children }: any) {
    return React.createElement(View, svgTestID ? { testID: svgTestID } : null, children);
  }
  function MockPath() {
    return null;
  }
  function MockStop() {
    return null;
  }

  return {
    Svg: MockSvg,
    Path: MockPath,
    Defs: Passthrough,
    LinearGradient: Passthrough,
    Stop: MockStop,
  };
}
