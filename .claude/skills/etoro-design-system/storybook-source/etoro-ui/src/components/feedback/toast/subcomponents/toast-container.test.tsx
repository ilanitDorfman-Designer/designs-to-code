import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import type { ToastConfig } from '../api/types';
import { TOAST_ANIMATION } from '../api/types';
import { ToastContainer } from './toast-container';

const TOAST_DURATION = 3000;

// Mock react-native-reanimated: `withTiming` resolves synchronously so exit
// animations complete (and report the dismiss) inside `act`. Shared values must
// keep a stable identity across renders like the real ones do — otherwise every
// callback built on them is rebuilt and the auto-dismiss timer restarts.
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  const AnimatedView = React.forwardRef((props: any, ref: any) => React.createElement(View, { ...props, ref }));

  return {
    __esModule: true,
    default: { View: AnimatedView },
    useSharedValue: (initial: any) => React.useRef({ value: initial, set: jest.fn() }).current,
    useAnimatedStyle: (fn: () => any) => fn(),
    withSpring: (value: any) => value,
    withTiming: (value: any, _config?: any, callback?: (finished: boolean) => void) => {
      if (callback) callback(true);
      return value;
    },
    runOnJS: (fn: any) => fn,
    Easing: {
      out: () => (t: number) => t,
      in: () => (t: number) => t,
      cubic: (t: number) => t,
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, right: 0, bottom: 34, left: 0 }),
}));

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    GestureHandlerRootView: ({ children, ...props }: { children: React.ReactNode }) => React.createElement(View, props, children),
    Gesture: {
      Pan: () => ({ enabled: () => ({ onUpdate: () => ({ onEnd: () => ({}) }) }) }),
      LongPress: () => ({ enabled: () => ({ minDuration: () => ({ onStart: () => ({ onEnd: () => ({}) }) }) }) }),
      Simultaneous: () => ({}),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    FullWindowOverlay: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
  };
});

// The pile's timer behaviour is what's under test — the toast's insides are not.
jest.mock('./toast-media', () => ({ ToastMedia: () => null }));
jest.mock('./toast-message', () => ({ ToastMessage: () => null }));

function makeToast(id: string): ToastConfig {
  return {
    id,
    type: 'asset',
    status: 'neutral',
    message: `Message ${id}`,
    duration: TOAST_DURATION,
    asset: { logoUrl: 'https://example.com/logo.png' },
  };
}

describe('ToastContainer auto-dismiss while expanded', () => {
  const advanceBy = (ms: number) => act(() => void jest.advanceTimersByTime(ms));

  /**
   * Renders a two-toast pile. The newest toast is the front of the stack, so
   * its `Pressable` is the last one in render order.
   */
  function renderStack({ expandByDefault = false }: { expandByDefault?: boolean } = {}) {
    const onDismiss = jest.fn();
    const toasts = [makeToast('toast-1'), makeToast('toast-2')];
    const view = render(<ToastContainer toasts={toasts} onDismiss={onDismiss} expandByDefault={expandByDefault} />);

    const pressFrontToast = () => {
      const buttons = view.getAllByRole('button');
      fireEvent.press(buttons[buttons.length - 1]);
    };

    return { ...view, onDismiss, pressFrontToast };
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('auto-dismisses a collapsed pile once each duration elapses', () => {
    const { onDismiss } = renderStack();

    advanceBy(TOAST_DURATION);

    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('freezes the timers while the user has the stack expanded', () => {
    const { onDismiss, pressFrontToast } = renderStack();

    advanceBy(1000);
    act(() => pressFrontToast());
    advanceBy(TOAST_DURATION * 2);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('resumes with a short grace period when the stack is collapsed again', () => {
    const { onDismiss, pressFrontToast } = renderStack();

    // Expanding mid-duration used to resume leftover time; after a read we
    // discard that and give a short grace period instead.
    advanceBy(1000);
    act(() => pressFrontToast());
    advanceBy(TOAST_DURATION);
    act(() => pressFrontToast());

    advanceBy(TOAST_ANIMATION.POST_READ_DISMISS_DURATION - 1);
    expect(onDismiss).not.toHaveBeenCalled();

    advanceBy(1);
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('collapses itself after the idle timeout so a forgotten stack still clears', () => {
    const { onDismiss, pressFrontToast } = renderStack();

    advanceBy(1000);
    act(() => pressFrontToast());

    advanceBy(TOAST_ANIMATION.EXPANDED_IDLE_TIMEOUT);
    expect(onDismiss).not.toHaveBeenCalled();

    // Idle collapse also uses the short post-read grace, not leftover duration.
    advanceBy(TOAST_ANIMATION.POST_READ_DISMISS_DURATION);
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('keeps dismissing on schedule when the stack is expanded by default', () => {
    const { onDismiss } = renderStack({ expandByDefault: true });

    advanceBy(TOAST_DURATION);

    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
