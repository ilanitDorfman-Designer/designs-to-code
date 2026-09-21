import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Platform, Text } from 'react-native';

import { ToastProvider } from './api/context';
import type { ToastConfig } from './api/types';
import { DEFAULT_TOAST_POSITION, TOAST_ANIMATION, toastExitSign } from './api/types';
import { EtToast } from './et-toast';
import { useToast } from './hooks/use-toast';

/** Anchor expected for top toasts: mocked safe-area top inset + the margin below it. */
const EXPECTED_TOP_ANCHOR = 59 + TOAST_ANIMATION.TOP_INSET_MARGIN;

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  const AnimatedView = React.forwardRef((props: any, ref: any) => React.createElement(View, { ...props, ref }));

  const Animated = {
    View: AnimatedView,
  };

  return {
    __esModule: true,
    default: Animated,
    useSharedValue: (value: any) => ({
      value,
      set: jest.fn((newValue: any) => {
        value.value = newValue;
      }),
    }),
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

// Mock safe-area insets — a fixed top inset (59, iPhone Dynamic Island) lets the anchor math be asserted exactly
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, right: 0, bottom: 34, left: 0 }),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    GestureHandlerRootView: ({ children, ...props }: { children: React.ReactNode }) => React.createElement(View, props, children),
    Gesture: {
      Pan: () => ({
        enabled: () => ({
          onUpdate: () => ({
            onEnd: () => ({}),
          }),
        }),
      }),
      LongPress: () => ({
        enabled: () => ({
          minDuration: () => ({
            onStart: () => ({
              onEnd: () => ({}),
            }),
          }),
        }),
      }),
      Simultaneous: () => ({}),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock react-native-screens FullWindowOverlay (native-only, undefined in jest)
jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    FullWindowOverlay: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
  };
});

// Mock useEtoroTheme
jest.mock('../../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    colors: {
      actionBrandText: '#00C853',
      actionBrandVarText: '#FF1744',
      bgNeutralPrimary: '#FFFFFF',
      bgNeutralTertiary: '#F5F5F5',
      bgOverlayTop: 'rgba(0,0,0,0.5)',
      carbon050: '#FAFAFA',
      carbon800: '#424242',
      carbon900: '#212121',
      textInvertedPrimaryNeutral: '#FFFFFF',
      textPrimaryNeutral: '#212121',
    },
  }),
}));

// Mock icon components
jest.mock('../../../core/icons/v', () => ({
  V: () => null,
}));

jest.mock('../../../core/icons/error', () => ({
  ErrorIcon: () => null,
}));

jest.mock('../../../core/icons/loader', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock EtoroIcon
jest.mock('../../../foundations/icon-assets/et-icon', () => ({
  EtoroIcon: () => null,
}));

// Mock EtIconV2 (close control uses xmark)
jest.mock('../../et-icon-v2', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    EtIconV2: ({ name }: { name: string }) => React.createElement(View, { testID: `et-icon-v2-${name}` }),
  };
});

// Mock EtText
jest.mock('../../../foundations/text/et-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    EtText: ({ children }: { children: React.ReactNode }) => React.createElement(Text, null, children),
  };
});

// IMPORTANT: Mock the auto-dismiss timer to prevent automatic dismissal during tests
// This must be mocked before importing the component
jest.mock('./gestures/use-auto-dismiss-timer', () => ({
  useAutoDismissTimer: jest.fn(() => ({
    pauseTimer: jest.fn(),
    resumeTimer: jest.fn(),
  })),
}));

// Mock the exit animation to not auto-complete in tests
jest.mock('./animations/use-exit-animation', () => ({
  useExitAnimation: jest.fn(() => ({
    triggerExit: jest.fn(),
    triggerExitFromPosition: jest.fn(),
  })),
}));

// Test component that uses the useToast hook
function TestConsumer({ onMount }: { onMount?: (toast: ReturnType<typeof useToast>) => void }) {
  const toast = useToast();
  const onMountRef = React.useRef(onMount);

  // Keep onMount ref up to date
  React.useEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);

  // Call onMount only once on mount with the toast API
  React.useEffect(() => {
    if (onMountRef.current) {
      onMountRef.current(toast);
    }
  }, [toast]); // Depend on toast so it's called when toast is available

  return <Text testID="consumer">Consumer</Text>;
}

describe('EtToast', () => {
  const mockDismiss = jest.fn();

  const baseConfig: ToastConfig = {
    id: 'test-toast-1',
    type: 'asset',
    status: 'neutral',
    message: 'Test message',
    duration: 3000,
    asset: { logoUrl: 'https://example.com/logo.png' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('position', () => {
    /** Flattens the style array RN test output gives us into one object. */
    function anchorStyleOf(json: any): Record<string, unknown> {
      const style = json.props.style;
      return Array.isArray(style) ? Object.assign({}, ...style.flat(Infinity).filter(Boolean)) : style;
    }

    it('anchors to the top by default', () => {
      const { toJSON } = render(<EtToast config={baseConfig} onDismiss={mockDismiss} />);

      const style = anchorStyleOf(toJSON());
      expect(style.top).toBe(EXPECTED_TOP_ANCHOR);
      expect(style.bottom).toBeUndefined();
    });

    it("anchors to the bottom when a toast opts into position 'bottom'", () => {
      const config: ToastConfig = { ...baseConfig, position: 'bottom' };

      const { toJSON } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      const style = anchorStyleOf(toJSON());
      expect(style.bottom).toBe(TOAST_ANIMATION.BOTTOM_OFFSET);
      expect(style.top).toBeUndefined();
    });

    it("anchors to the top when position is explicitly 'top'", () => {
      const config: ToastConfig = { ...baseConfig, position: 'top' };

      const { toJSON } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(anchorStyleOf(toJSON()).top).toBe(EXPECTED_TOP_ANCHOR);
    });
  });

  describe('toastExitSign', () => {
    it('travels up for top-anchored toasts and down for bottom-anchored ones', () => {
      expect(toastExitSign('top')).toBe(-1);
      expect(toastExitSign('bottom')).toBe(1);
    });

    it('defaults to the top direction when no position is given', () => {
      expect(toastExitSign()).toBe(-1);
      expect(DEFAULT_TOAST_POSITION).toBe('top');
    });
  });

  describe('rendering', () => {
    it('renders with asset type', () => {
      const { getByText } = render(<EtToast config={baseConfig} onDismiss={mockDismiss} />);

      expect(getByText('Test message')).toBeTruthy();
    });

    it('renders with image type', () => {
      const config: ToastConfig = {
        ...baseConfig,
        type: 'image',
        image: { uri: 'https://example.com/image.png' },
      };

      const { getByText } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(getByText('Test message')).toBeTruthy();
    });

    it('renders with icon type', () => {
      const config: ToastConfig = {
        ...baseConfig,
        type: 'icon',
        icon: { name: 'notification' },
      };

      const { getByText } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(getByText('Test message')).toBeTruthy();
    });

    it('renders with assetGroup type', () => {
      const config: ToastConfig = {
        ...baseConfig,
        type: 'assetGroup',
        assetGroup: {
          assets: [{ logoUrl: 'https://example.com/logo1.png' }, { logoUrl: 'https://example.com/logo2.png' }],
        },
      };

      const { getByText } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(getByText('Test message')).toBeTruthy();
    });

    it("renders with 'custom' type using the caller-supplied media", () => {
      const config: ToastConfig = {
        id: 'test-toast-custom',
        type: 'custom',
        status: 'neutral',
        message: 'Custom message',
        media: <Text testID="custom-media">my-media</Text>,
      };

      const { getByText, getByTestId } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(getByText('Custom message')).toBeTruthy();
      expect(getByTestId('custom-media')).toBeTruthy();
    });
  });

  describe('surface variant', () => {
    it('renders the default variant as a solid surface (no blur)', () => {
      const { queryByTestId, getByText } = render(<EtToast config={baseConfig} onDismiss={mockDismiss} />);

      // The toast no longer uses `expo-blur` — every surface is a solid card.
      expect(queryByTestId('blur-view')).toBeNull();
      expect(getByText('Test message')).toBeTruthy();
    });

    it("renders the 'inverted' variant as a solid surface (no blur)", () => {
      const config: ToastConfig = {
        ...baseConfig,
        variant: 'inverted',
      };

      const { queryByTestId, getByText } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(queryByTestId('blur-view')).toBeNull();
      expect(getByText('Test message')).toBeTruthy();
    });
  });

  describe('status variants', () => {
    it.each(['neutral', 'loader', 'success', 'error', 'disconnect'] as const)('renders with %s status', (status) => {
      const config: ToastConfig = {
        ...baseConfig,
        status,
      };

      const { getByText } = render(<EtToast config={config} onDismiss={mockDismiss} />);

      expect(getByText('Test message')).toBeTruthy();
    });
  });

  describe('closable (PBD-1105)', () => {
    it('does not render a close control when closable is omitted', () => {
      const { queryByTestId } = render(<EtToast config={{ ...baseConfig, testID: 'toast' }} onDismiss={mockDismiss} />);

      expect(queryByTestId('toast-close')).toBeNull();
    });

    it('renders a close control when closable is true', () => {
      const { getByTestId } = render(<EtToast config={{ ...baseConfig, testID: 'toast', closable: true }} onDismiss={mockDismiss} />);

      expect(getByTestId('toast-close')).toBeTruthy();
      expect(getByTestId('et-icon-v2-xmark')).toBeTruthy();
    });

    it('dismisses via onDismiss when the close control is pressed', () => {
      const { getByTestId } = render(<EtToast config={{ ...baseConfig, testID: 'toast', closable: true }} onDismiss={mockDismiss} />);

      fireEvent.press(getByTestId('toast-close'));

      expect(mockDismiss).toHaveBeenCalledTimes(1);
      expect(mockDismiss).toHaveBeenCalledWith('test-toast-1');
    });

    it('does not fire onPress when the close control is pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(<EtToast config={{ ...baseConfig, testID: 'toast', closable: true, onPress }} onDismiss={mockDismiss} />);

      fireEvent.press(getByTestId('toast-close'));

      expect(mockDismiss).toHaveBeenCalledTimes(1);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('fires onPress when the toast body is pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<EtToast config={{ ...baseConfig, closable: true, onPress }} onDismiss={mockDismiss} />);

      fireEvent.press(getByText('Test message'));

      expect(onPress).toHaveBeenCalledTimes(1);
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });
  });
});

describe('ToastProvider', () => {
  it('provides toast context to children', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    expect(getByTestId('consumer')).toBeTruthy();
  });

  it('showToast adds a toast and returns id', () => {
    const toastApiRef = { current: null as ReturnType<typeof useToast> | null };
    const currentCountRef = { current: 0 };

    function CountTracker() {
      const api = useToast();

      React.useEffect(() => {
        toastApiRef.current = api;
        currentCountRef.current = api.toastCount;
      }, [api, api.toastCount]);

      return null;
    }

    const { rerender } = render(
      <ToastProvider>
        <TestConsumer
          onMount={(api) => {
            toastApiRef.current = api;
          }}
        />
        <CountTracker />
      </ToastProvider>,
    );

    // API should be available synchronously
    expect(toastApiRef.current).not.toBeNull();

    const config = {
      type: 'asset' as const,
      status: 'success' as const,
      message: 'Order executed',
      asset: { logoUrl: 'https://example.com/logo.png' },
    };

    let toastId: string | undefined;
    act(() => {
      toastId = toastApiRef.current!.showToast(config);
      rerender(
        <ToastProvider>
          <TestConsumer
            onMount={(api) => {
              toastApiRef.current = api;
            }}
          />
          <CountTracker />
        </ToastProvider>,
      );
    });

    expect(toastId).toBeDefined();
    expect(toastId).toMatch(/^toast-/);
    expect(currentCountRef.current).toBe(1);
  });

  it('dismissAll clears all toasts', () => {
    const toastApiRef = { current: null as ReturnType<typeof useToast> | null };
    const currentCountRef = { current: 0 };

    function CountTracker() {
      const api = useToast();

      React.useEffect(() => {
        toastApiRef.current = api;
        currentCountRef.current = api.toastCount;
      }, [api, api.toastCount]);

      return null;
    }

    const { rerender } = render(
      <ToastProvider>
        <TestConsumer
          onMount={(api) => {
            toastApiRef.current = api;
          }}
        />
        <CountTracker />
      </ToastProvider>,
    );

    // API should be available synchronously
    expect(toastApiRef.current).not.toBeNull();

    // Add toasts
    act(() => {
      const toast1 = {
        type: 'asset' as const,
        status: 'success' as const,
        message: 'Toast 1',
        asset: { logoUrl: 'https://example.com/logo.png' },
        duration: 999999,
      };

      const toast2 = {
        type: 'asset' as const,
        status: 'error' as const,
        message: 'Toast 2',
        asset: { logoUrl: 'https://example.com/logo.png' },
        duration: 999999,
      };

      toastApiRef.current!.showToast(toast1);
      toastApiRef.current!.showToast(toast2);

      rerender(
        <ToastProvider>
          <TestConsumer
            onMount={(api) => {
              toastApiRef.current = api;
            }}
          />
          <CountTracker />
        </ToastProvider>,
      );
    });

    // Verify toasts were added synchronously
    expect(currentCountRef.current).toBe(2);

    // Dismiss all
    act(() => {
      toastApiRef.current!.dismissAll();
      rerender(
        <ToastProvider>
          <TestConsumer
            onMount={(api) => {
              toastApiRef.current = api;
            }}
          />
          <CountTracker />
        </ToastProvider>,
      );
    });

    // Verify all toasts were removed synchronously
    expect(currentCountRef.current).toBe(0);
  });
});

describe('toast placement through the provider', () => {
  // On iOS, ToastProvider registers ToastContainer with AppFloatOverlayHost and
  // does not render it inline. These placement assertions walk the provider
  // tree for top/bottom anchors, so they must run on the non-iOS path where
  // the container is still a direct child of ToastProvider.
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = 'android';
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  /** Collects every style object in the rendered tree that carries a top/bottom anchor. */
  function anchorsInTree(json: any): Array<Record<string, unknown>> {
    const found: Array<Record<string, unknown>> = [];
    const walk = (node: any) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      const raw = node.props?.style;
      if (raw) {
        const flat = Array.isArray(raw) ? Object.assign({}, ...raw.flat(Infinity).filter(Boolean)) : raw;
        if (flat && (flat.top !== undefined || flat.bottom !== undefined)) found.push(flat);
      }
      (Array.isArray(node.children) ? node.children : []).forEach(walk);
    };
    walk(json);
    return found;
  }

  function showAndRender(config: Record<string, unknown>) {
    const apiRef: { current: ReturnType<typeof useToast> | null } = { current: null };

    const utils = render(
      <ToastProvider>
        <TestConsumer
          onMount={(api) => {
            apiRef.current = api;
          }}
        />
      </ToastProvider>,
    );

    act(() => {
      apiRef.current?.showToast(config as never);
    });

    return utils;
  }

  const asset = { logoUrl: 'https://example.com/logo.png' };

  it('anchors a toast shown via showToast to the top when no position is given', () => {
    const { toJSON } = showAndRender({ type: 'asset', status: 'success', message: 'Added to My Watchlist', asset });

    const anchors = anchorsInTree(toJSON());
    expect(anchors.some((style) => style.top === EXPECTED_TOP_ANCHOR)).toBe(true);
    expect(anchors.some((style) => style.bottom === TOAST_ANIMATION.BOTTOM_OFFSET)).toBe(false);
  });

  it("anchors to the bottom when the caller passes position 'bottom'", () => {
    const { toJSON } = showAndRender({
      type: 'asset',
      status: 'success',
      message: 'Added to My Watchlist',
      asset,
      position: 'bottom',
    });

    const anchors = anchorsInTree(toJSON());
    expect(anchors.some((style) => style.bottom === TOAST_ANIMATION.BOTTOM_OFFSET)).toBe(true);
    expect(anchors.some((style) => style.top === EXPECTED_TOP_ANCHOR)).toBe(false);
  });
});

describe('useToast hook', () => {
  it('throws error when used outside ToastProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useToastContext must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });
});
