/* eslint-disable simple-import-sort/imports -- Import order is load-bearing here:
 * `@etoro/common/infra/app-float-overlay` is `jest.mock`-ed below, and babel-jest
 * runs that (hoisted) mock factory the first time the module is imported. The
 * factory calls `jest.fn()`, so `jest` from `@jest/globals` must be imported
 * FIRST — placing app-float-overlay above `@jest/globals` (as alphabetical
 * sorting would) throws "Cannot read properties of undefined (reading 'jest')".
 * A static import (not `require()`) is required so nx's enforce-module-boundaries
 * sees a static edge consistent with the source, not a forbidden lazy import. */
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { notifySheetDismissed, notifySheetPresented, notifySheetPresenting } from '@etoro/common/infra/app-float-overlay';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { BackHandler, InteractionManager, Platform, StyleSheet, Text, View } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { ToastContext, ToastProvider, useToast } from '../../feedback/toast';
import { EtBottomSheet } from './et-bottom-sheet';
import {
  EtBottomSheetContent,
  EtBottomSheetFlashList,
  EtBottomSheetFooter,
  EtBottomSheetHeader,
  EtBottomSheetList,
  EtBottomSheetSectionList,
} from './subcomponents';
import { BOUNCY_SPRING_CONFIG, FAST_SPRING_CONFIG, resolveBottomSheetContainerComponent, SMOOTH_SPRING_CONFIG, SPRING_CONFIG } from './utils';

function footerHasBackgroundColor(footer: ReactTestInstance, backgroundColor: string): boolean {
  return [footer, ...footer.findAllByType(View)].some((view) => StyleSheet.flatten(view.props.style)?.backgroundColor === backgroundColor);
}

// Mock the app-float-overlay lifecycle callbacks so the spec can assert how
// many times each fires without pulling the real store (module-scoped state)
// into the test process.
jest.mock('@etoro/common/infra/app-float-overlay', () => ({
  // Returns a token — EtBottomSheetV2 stores it and passes it back to
  // notifySheetDismissed (the store pairs present/dismiss by identity).
  notifySheetPresented: jest.fn(() => 1),
  notifySheetDismissed: jest.fn(),
  // Early, counter-only bump fired at onAnimate-open-start. No token.
  notifySheetPresenting: jest.fn(),
  // PM-866 tests import ToastProvider, which on iOS calls this hook via a
  // module-level ToastOverlayRegistrar. Mock as a no-op so those tests can
  // wrap a Backdrop in <ToastProvider> without pulling in the real overlay
  // registration graph. OverlayPriority.Toast is only accessed as a numeric
  // priority argument here — the value doesn't affect the tests.
  useRegisterOverlaySurface: jest.fn(),
  OverlayPriority: { Toast: 30, NetworkStatus: 20, InAppWeb: 40, Critical: 50 },
}));

// Stable close spy for the gorhom mock's `useBottomSheet().close`.
// Prefixed with `mock` so Jest allows the out-of-scope reference from inside
// the hoisted `jest.mock` factory below. `jest.clearAllMocks()` in the outer
// `beforeEach` resets its call log between tests without breaking identity.
const mockBottomSheetClose = jest.fn();

// Stable (module-level, not recreated per render) so `remountOnPresent` tests can assert on the
// "real" modal instance's imperative methods regardless of how many times it's been remounted.
const mockRealModalPresent = jest.fn();
const mockRealModalDismiss = jest.fn();

// Mock dependencies
jest.mock('@gorhom/bottom-sheet', () => ({
  // `ref` is read as a plain prop (React 19 ref-as-prop) instead of being discarded, so
  // `remountOnPresent` tests can observe imperative calls that reach the "real" modal instance.
  BottomSheetModal: jest.fn(({ children, footerComponent, ref, ...props }) => {
    const { useImperativeHandle } = require('react');
    const MockedView = require('react-native').View;
    useImperativeHandle(ref, () => ({
      present: mockRealModalPresent,
      dismiss: mockRealModalDismiss,
      snapToIndex: jest.fn(),
      snapToPosition: jest.fn(),
      expand: jest.fn(),
      collapse: jest.fn(),
      close: jest.fn(),
      forceClose: jest.fn(),
    }));
    // Render footer if provided (simulating library behavior)
    const footer = footerComponent ? footerComponent({ animatedFooterPosition: { value: 0 } }) : null;
    return (
      <MockedView testID="bottom-sheet-modal" {...props}>
        {children}
        {footer}
      </MockedView>
    );
  }),
  BottomSheetView: jest.fn(({ children, ...props }) => {
    const MockedView = require('react-native').View;
    return (
      <MockedView testID="bottom-sheet-view" {...props}>
        {children}
      </MockedView>
    );
  }),
  BottomSheetScrollView: jest.fn(({ children, ...props }) => {
    const MockedScrollView = require('react-native').ScrollView;
    return (
      <MockedScrollView testID="bottom-sheet-scroll-view" {...props}>
        {children}
      </MockedScrollView>
    );
  }),
  BottomSheetFooter: jest.fn(({ children, ...props }) => {
    const MockedView = require('react-native').View;
    return (
      <MockedView testID="bottom-sheet-footer" {...props}>
        {children}
      </MockedView>
    );
  }),
  // Render children so the internal Pressable actually mounts and PM-866
  // tests can `fireEvent.press` on it to exercise the toast-visibility gate.
  BottomSheetBackdrop: jest.fn(({ children, ...props }) => {
    const MockedView = require('react-native').View;
    return (
      <MockedView testID="bottom-sheet-backdrop-mock" {...props}>
        {children}
      </MockedView>
    );
  }),
  // PM-866: the pinned backdrop component calls `useBottomSheet().close()`
  // directly (bypassing gorhom's own pressBehavior='close' path, which would
  // toggle the internal GestureDetector/AnimatedView ternary and cause a
  // subtree remount on every toast appear/dismiss). The single stable
  // `mockBottomSheetClose` reference below is what tests assert on;
  // `jest.clearAllMocks()` in the outer `beforeEach` resets its call log
  // between tests without breaking the reference identity.
  useBottomSheet: () => ({
    close: mockBottomSheetClose,
    snapToIndex: jest.fn(),
    snapToPosition: jest.fn(),
    expand: jest.fn(),
    collapse: jest.fn(),
    forceClose: jest.fn(),
  }),
  BottomSheetFlatList: jest.fn(({ data, renderItem, keyExtractor, ...props }) => {
    const MockedView = require('react-native').View;
    return (
      <MockedView testID="bottom-sheet-flat-list" {...props}>
        {data?.map((item: any, index: number) => (
          <MockedView key={keyExtractor?.(item, index) ?? index}>{renderItem?.({ item, index, separators: {} as any })}</MockedView>
        ))}
      </MockedView>
    );
  }),
  BottomSheetSectionList: jest.fn(({ sections, renderItem, renderSectionHeader, keyExtractor, ...props }) => {
    const MockedView = require('react-native').View;
    return (
      <MockedView testID="bottom-sheet-section-list" {...props}>
        {sections?.map((section: any, sectionIndex: number) => (
          <MockedView key={section.title ?? sectionIndex}>
            {renderSectionHeader?.({ section })}
            {section.data?.map((item: any, itemIndex: number) => (
              <MockedView key={keyExtractor?.(item, itemIndex) ?? itemIndex}>
                {renderItem?.({
                  item,
                  index: itemIndex,
                  section,
                  separators: {} as any,
                })}
              </MockedView>
            ))}
          </MockedView>
        ))}
      </MockedView>
    );
  }),
  useBottomSheetScrollableCreator: jest.fn(() => {
    // Return a mock scroll component creator
    return jest.fn().mockReturnValue(require('react-native').ScrollView);
  }),
}));

// Mock @shopify/flash-list
jest.mock('@shopify/flash-list', () => ({
  FlashList: jest.fn(({ data, renderItem, keyExtractor, ...props }) => {
    const MockedView = require('react-native').View;
    return (
      <MockedView testID="flash-list" {...props}>
        {data?.map((item: any, index: number) => (
          <MockedView key={keyExtractor?.(item, index) ?? index}>
            {renderItem?.({
              item,
              index,
              target: 'Cell',
              extraData: undefined,
            })}
          </MockedView>
        ))}
      </MockedView>
    );
  }),
  useMasonry: jest.fn(),
}));

// Mock useEtoroTheme hook and useReducedMotion
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => colorsMock),
    useReducedMotion: jest.fn(() => false),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    right: 0,
    bottom: 34,
    left: 0,
  })),
}));

// Mock the useReducedMotion hook directly to avoid AccessibilityInfo TurboModule issues
jest.mock('etoro-ui/core/hooks/accessibility', () => ({
  useReducedMotion: jest.fn(() => false),
}));

// Mock EtText component
jest.mock('etoro-ui/foundations/text', () => ({
  EtText: function MockEtText({ children, testID, style, ...props }: any) {
    const { Text } = require('react-native');
    return (
      <Text testID={testID || 'et-text'} style={style} {...props}>
        {children}
      </Text>
    );
  },
}));

// Mock EtoroIcon component
jest.mock('etoro-ui/foundations/icon-assets/et-icon', () => ({
  EtoroIcon: function MockEtoroIcon({ icon, appearance: _appearance, testID, ...props }: any) {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || 'etoro-icon'} {...props}>
        <Text testID="icon-name">{icon?.iconName}</Text>
      </View>
    );
  },
}));

describe('EtBottomSheet v2', () => {
  const originalOS = Platform.OS;
  // Aliased to the mocked `BottomSheetModal`'s own stable handles: rendering re-populates
  // `bottomSheetRef.current` via `useImperativeHandle` on every render (matching real
  // ref-forwarding behavior), so pre-populating with separate jest.fn()s here would get
  // silently overwritten as soon as anything renders.
  const mockDismiss = mockRealModalDismiss;
  const mockRef = {
    current: {
      dismiss: mockDismiss,
      present: mockRealModalPresent,
      snapToIndex: jest.fn(),
      snapToPosition: jest.fn(),
      expand: jest.fn(),
      collapse: jest.fn(),
      close: jest.fn(),
      forceClose: jest.fn(),
    },
  } as unknown as React.RefObject<BottomSheetModal>;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = originalOS;
    mockDismiss.mockClear();
    mockRealModalPresent.mockClear();
    mockRealModalDismiss.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      const { getByTestId, getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Test Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByTestId('et-bottom-sheet')).toBeTruthy();
      expect(getByText('Test Content')).toBeTruthy();
    });

    it('renders with custom testID', () => {
      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef} testID="custom-sheet">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByTestId('custom-sheet')).toBeTruthy();
    });

    it('renders all subcomponents', () => {
      const { getByText, getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Title>Sheet Title</EtBottomSheet.Header.Title>
            <EtBottomSheet.Header.Action onPress={() => mockRef.current?.dismiss()} accessibilityLabel="Close" testID="et-bottom-sheet-close-button">
              <Text>X</Text>
            </EtBottomSheet.Header.Action>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
          <EtBottomSheet.Footer>
            <Text>Footer</Text>
          </EtBottomSheet.Footer>
        </EtBottomSheet>,
      );

      expect(getByText('Sheet Title')).toBeTruthy();
      expect(getByTestId('et-bottom-sheet-close-button')).toBeTruthy();
      expect(getByText('Content')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });
  });

  describe('Compound Components', () => {
    it('has Header as static property', () => {
      expect(EtBottomSheet.Header).toBe(EtBottomSheetHeader);
    });

    it('has Header.Title as static property', () => {
      expect(EtBottomSheet.Header.Title).toBeDefined();
    });

    it('has Header.Action as static property', () => {
      expect(EtBottomSheet.Header.Action).toBeDefined();
    });

    it('has Content as static property', () => {
      expect(EtBottomSheet.Content).toBe(EtBottomSheetContent);
    });

    it('has Footer as static property', () => {
      expect(EtBottomSheet.Footer).toBe(EtBottomSheetFooter);
    });
  });

  describe('Header Variants', () => {
    it('renders Header with Title only', () => {
      const { getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Title>Title Only</EtBottomSheet.Header.Title>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByText('Title Only')).toBeTruthy();
    });

    it('renders Header with Action only', () => {
      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Action onPress={() => undefined} accessibilityLabel="Close" testID="close-btn">
              <Text>X</Text>
            </EtBottomSheet.Header.Action>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByTestId('close-btn')).toBeTruthy();
    });

    it('renders Header with Title and Action', () => {
      const { getByText, getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Title>Both</EtBottomSheet.Header.Title>
            <EtBottomSheet.Header.Action onPress={() => undefined} accessibilityLabel="Close" testID="close-btn">
              <Text>X</Text>
            </EtBottomSheet.Header.Action>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByText('Both')).toBeTruthy();
      expect(getByTestId('close-btn')).toBeTruthy();
    });

    it('renders without header', () => {
      const { getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>No Header</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByText('No Header')).toBeTruthy();
    });
  });

  describe('Content Behavior', () => {
    it('renders non-scrollable content by default', () => {
      const { queryByTestId, getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      // Default is non-scrollable (dynamic sizing)
      expect(queryByTestId('bottom-sheet-scroll-view')).toBeNull();
      expect(getByText('Content')).toBeTruthy();
    });

    it('renders scrollable content when scrollable is true', () => {
      const { getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content scrollable>
            <Text>Scrollable</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      // Content should be rendered (scroll view is used internally)
      expect(getByText('Scrollable')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator when loading is true', () => {
      const { queryByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef} loading>
          <EtBottomSheet.Content>
            <Text>Should be hidden</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      // Content should be hidden when loading
      expect(queryByText('Should be hidden')).toBeNull();
    });

    it('shows custom loading placeholder when provided', () => {
      const { getByText, queryByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef} loading>
          <EtBottomSheet.Content loadingPlaceholder={<Text>Loading...</Text>}>
            <Text>Should be hidden</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByText('Loading...')).toBeTruthy();
      expect(queryByText('Should be hidden')).toBeNull();
    });
  });

  describe('Props Configuration', () => {
    it('enables dynamic sizing by default', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].enableDynamicSizing).toBe(true);
    });

    it('enables pan down to close by default', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].enablePanDownToClose).toBe(true);
    });

    it('disables pan down to close when specified', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} enablePanDownToClose={false}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].enablePanDownToClose).toBe(false);
    });

    it('provides custom handleComponent by default', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      // Custom handleComponent is provided for floating handle effect
      expect(call[0].handleComponent).toBeDefined();
      expect(typeof call[0].handleComponent).toBe('function');
    });

    it('passes showHandle=false to handleComponent', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} showHandle={false}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      // handleComponent is still provided (for gesture handling)
      // but showHandle prop is passed to hide the indicator
      expect(call[0].handleComponent).toBeDefined();
    });
  });

  describe('Footer Behavior', () => {
    it('renders footer using BottomSheetFooter for sticky positioning', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
          <EtBottomSheet.Footer>
            <Text>Footer Content</Text>
          </EtBottomSheet.Footer>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].footerComponent).toBeDefined();
    });

    it('does not render footerComponent when no footer is provided', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].footerComponent).toBeUndefined();
    });

    it('renders transparent footer without the solid footer background', () => {
      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef} backgroundColor="#ABCDEF">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
          <EtBottomSheet.Footer transparent>
            <Text>Footer Content</Text>
          </EtBottomSheet.Footer>
        </EtBottomSheet>,
      );

      expect(footerHasBackgroundColor(getByTestId('bottom-sheet-footer'), '#ABCDEF')).toBe(false);
    });

    it('renders solid footer background by default', () => {
      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef} backgroundColor="#ABCDEF">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
          <EtBottomSheet.Footer>
            <Text>Footer Content</Text>
          </EtBottomSheet.Footer>
        </EtBottomSheet>,
      );

      expect(footerHasBackgroundColor(getByTestId('bottom-sheet-footer'), '#ABCDEF')).toBe(true);
    });
  });

  describe('Backdrop Configuration', () => {
    it('enables backdrop by default', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].backdropComponent).toBeDefined();
    });

    it('disables backdrop when enabled is false', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} backdrop={{ enabled: false }}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].backdropComponent).toBeUndefined();
    });

    // PM-866: while any toast is on screen, backdrop tap must NOT close the
    // sheet. The pinned backdrop component drives close() itself through
    // `useBottomSheet()` (a stable `mockBottomSheetClose` in this file);
    // gorhom's own `pressBehavior` is always `'none'` so the internal
    // `GestureDetector <-> Animated.View` ternary never swaps (that swap
    // was the "backdrop paints on top of the sheet when a toast appears"
    // remount pathology). Tests fire a press on the backdrop's Pressable
    // (via its testID) and assert on the close spy.
    //
    // Invariant: `showToast` and the invoked backdrop component MUST share
    // one `ToastProvider` — otherwise the context the backdrop reads is
    // not the one the toast was fired into and the gate degenerates to
    // "close on tap".
    // iOS mechanism: pressBehavior is pinned to 'none' and close() is driven
    // from our own Pressable (avoids the FullWindowOverlay ternary-swap
    // remount). Android is covered separately below.
    describe('PM-866: toast visibility gate (iOS Pressable mechanism)', () => {
      // Force iOS so `ToastProvider` follows the overlay-registrar path (a
      // module-level no-op here) instead of rendering the inline
      // `ToastContainer` on Android — the container brings in EtToast +
      // reanimated + gestures, none of which this gate needs to exercise.
      let iosOverride: typeof Platform.OS;
      beforeEach(() => {
        iosOverride = Platform.OS;
        Platform.OS = 'ios';
        mockBottomSheetClose.mockClear();
      });
      afterEach(() => {
        Platform.OS = iosOverride;
      });

      const DUMMY = { animatedIndex: { value: 0 }, animatedPosition: { value: 0 } } as any;

      const getLastBackdropComponent = () => {
        const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
        return BottomSheetModalMock.mock.calls.at(-1)[0].backdropComponent as React.ComponentType<any>;
      };

      it("presses the backdrop close the sheet when no ToastProvider wraps it (today's behavior preserved)", () => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        const { getByTestId } = render(<Backdrop {...DUMMY} />);
        fireEvent.press(getByTestId('cp-sheet-backdrop'));

        expect(mockBottomSheetClose).toHaveBeenCalledTimes(1);
      });

      it('presses do NOT close the sheet while a toast is visible in the same ToastProvider', () => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        function FireToast() {
          const { showToast } = useToast();
          React.useEffect(() => {
            showToast({ type: 'icon', status: 'error', icon: { name: 'error' } as never, message: 'fail' });
          }, [showToast]);
          return <Backdrop {...DUMMY} />;
        }

        const { getByTestId } = render(
          <ToastProvider>
            <FireToast />
          </ToastProvider>,
        );
        fireEvent.press(getByTestId('cp-sheet-backdrop'));

        expect(mockBottomSheetClose).not.toHaveBeenCalled();
      });

      it('presses stay non-closing when closeOnBackdrop=false, with or without a visible toast', () => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef} closeOnBackdrop={false} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        const noProvider = render(<Backdrop {...DUMMY} />);
        fireEvent.press(noProvider.getByTestId('cp-sheet-backdrop'));
        expect(mockBottomSheetClose).not.toHaveBeenCalled();

        function FireToast() {
          const { showToast } = useToast();
          React.useEffect(() => {
            showToast({ type: 'icon', status: 'error', icon: { name: 'error' } as never, message: 'fail' });
          }, [showToast]);
          return <Backdrop {...DUMMY} />;
        }

        const withToast = render(
          <ToastProvider>
            <FireToast />
          </ToastProvider>,
        );
        fireEvent.press(withToast.getByTestId('cp-sheet-backdrop'));
        expect(mockBottomSheetClose).not.toHaveBeenCalled();
      });

      it("consumer's backdrop.onPress fires with the close when no toast gates it", () => {
        // onPress is coupled to the actual close (gorhom/base/Android parity):
        // with no toast up and closeOnBackdrop=true, a dimmer tap fires onPress
        // AND closes.
        const onBackdropPress = jest.fn();
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet" backdrop={{ onPress: onBackdropPress }}>
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        const { getByTestId } = render(<Backdrop {...DUMMY} />);
        fireEvent.press(getByTestId('cp-sheet-backdrop'));

        expect(onBackdropPress).toHaveBeenCalledTimes(1);
        expect(mockBottomSheetClose).toHaveBeenCalledTimes(1);
      });

      it("consumer's backdrop.onPress does NOT fire while a toast gates the close", () => {
        // Regression fence for the iOS onPress-before-gate defect: a consumer
        // whose onPress itself closes the sheet (watchlist onClose, my-money
        // dismissSheet, …) must NOT run while a toast is visible — otherwise the
        // sheet closes despite the gate. onPress is gated together with close().
        const onBackdropPress = jest.fn();
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet" backdrop={{ onPress: onBackdropPress }}>
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        function FireToast() {
          const { showToast } = useToast();
          React.useEffect(() => {
            showToast({ type: 'icon', status: 'error', icon: { name: 'error' } as never, message: 'fail' });
          }, [showToast]);
          return <Backdrop {...DUMMY} />;
        }

        const { getByTestId } = render(
          <ToastProvider>
            <FireToast />
          </ToastProvider>,
        );
        fireEvent.press(getByTestId('cp-sheet-backdrop'));

        expect(onBackdropPress).not.toHaveBeenCalled();
        expect(mockBottomSheetClose).not.toHaveBeenCalled();
      });

      it('does NOT toggle gorhom pressBehavior between renders (pinned to "none" — no ternary-swap remount)', () => {
        // Regression fence: gorhom's `BottomSheetBackdrop` internally does
        // `pressBehavior !== 'none' ? <GestureDetector>…</GestureDetector> :
        // <Animated.View/>`. Toggling this prop swaps the top-level element
        // type at that JSX position → React unmounts the whole backdrop
        // subtree → on iOS `FullWindowOverlay` the fresh native view lands
        // on top of the sheet body. We pin it to `'none'` and drive close()
        // ourselves; if a future refactor re-introduces `'close'` here, this
        // test fails and the reviewer knows why to stop.
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        function FireToast() {
          const { showToast } = useToast();
          React.useEffect(() => {
            showToast({ type: 'icon', status: 'error', icon: { name: 'error' } as never, message: 'fail' });
          }, [showToast]);
          return <Backdrop {...DUMMY} />;
        }

        const BottomSheetBackdropMock = require('@gorhom/bottom-sheet').BottomSheetBackdrop;
        BottomSheetBackdropMock.mockClear();

        // No provider — call 1 to gorhom's BottomSheetBackdrop.
        render(<Backdrop {...DUMMY} />);
        // Provider + toast — subsequent calls.
        render(
          <ToastProvider>
            <FireToast />
          </ToastProvider>,
        );

        const pressBehaviors = BottomSheetBackdropMock.mock.calls.map((call: any[]) => call[0].pressBehavior);
        expect(pressBehaviors.length).toBeGreaterThanOrEqual(2);
        expect(pressBehaviors.every((pb: string) => pb === 'none')).toBe(true);
      });
    });

    // Android keeps gorhom's native path: the same toast gate is applied by
    // toggling `pressBehavior` between 'close' and 'none' (the ternary-swap
    // remount is invisible without a FullWindowOverlay). We assert the prop
    // gorhom receives rather than a close spy, because on Android close is
    // driven by gorhom's own GestureDetector, not our Pressable.
    describe('PM-866: toast visibility gate (Android native toggle)', () => {
      let androidOverride: typeof Platform.OS;
      beforeEach(() => {
        androidOverride = Platform.OS;
        Platform.OS = 'android';
      });
      afterEach(() => {
        Platform.OS = androidOverride;
      });

      const DUMMY = { animatedIndex: { value: 0 }, animatedPosition: { value: 0 } } as any;

      const getLastBackdropComponent = () => {
        const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
        return BottomSheetModalMock.mock.calls.at(-1)[0].backdropComponent as React.ComponentType<any>;
      };
      const lastPressBehavior = () => {
        const BottomSheetBackdropMock = require('@gorhom/bottom-sheet').BottomSheetBackdrop;
        return BottomSheetBackdropMock.mock.calls.at(-1)[0].pressBehavior as string;
      };
      // Inject the toast state directly through the real ToastContext (the same
      // object the hook reads) so we exercise the gate without rendering the
      // Android inline ToastContainer (EtToast + reanimated + gestures).
      const oneToast = {
        toasts: [{ id: 't1', type: 'icon', status: 'error', message: 'fail' }],
        showToast: jest.fn(),
        dismissToast: jest.fn(),
        dismissAll: jest.fn(),
      } as never;

      it("gates to 'close' when no ToastProvider wraps the backdrop (today's behavior preserved)", () => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        const BottomSheetBackdropMock = require('@gorhom/bottom-sheet').BottomSheetBackdrop;
        BottomSheetBackdropMock.mockClear();
        render(<Backdrop {...DUMMY} />);

        expect(lastPressBehavior()).toBe('close');
      });

      it("gates to 'none' while a toast is visible", () => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();

        const BottomSheetBackdropMock = require('@gorhom/bottom-sheet').BottomSheetBackdrop;
        BottomSheetBackdropMock.mockClear();
        render(
          <ToastContext.Provider value={oneToast}>
            <Backdrop {...DUMMY} />
          </ToastContext.Provider>,
        );

        expect(lastPressBehavior()).toBe('none');
      });

      it("stays 'none' when closeOnBackdrop=false, with or without a visible toast", () => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef} closeOnBackdrop={false} testID="cp-sheet">
            <EtBottomSheet.Content>
              <Text>Content</Text>
            </EtBottomSheet.Content>
          </EtBottomSheet>,
        );
        const Backdrop = getLastBackdropComponent();
        const BottomSheetBackdropMock = require('@gorhom/bottom-sheet').BottomSheetBackdrop;

        BottomSheetBackdropMock.mockClear();
        render(<Backdrop {...DUMMY} />);
        expect(lastPressBehavior()).toBe('none');

        BottomSheetBackdropMock.mockClear();
        render(
          <ToastContext.Provider value={oneToast}>
            <Backdrop {...DUMMY} />
          </ToastContext.Provider>,
        );
        expect(lastPressBehavior()).toBe('none');
      });
    });
  });

  describe('Close Behavior', () => {
    it('calls onPress callback when Header.Action is pressed', () => {
      const onClose = jest.fn();

      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Action onPress={onClose} accessibilityLabel="Close" testID="close-btn">
              <Text>X</Text>
            </EtBottomSheet.Header.Action>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      fireEvent.press(getByTestId('close-btn'));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('logs error when multiple Headers are provided', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Title>First</EtBottomSheet.Header.Title>
          </EtBottomSheet.Header>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Title>Second</EtBottomSheet.Header.Title>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(consoleError).toHaveBeenCalledWith('EtBottomSheet: Only one Header component is allowed. Using first, ignoring duplicates.');

      consoleError.mockRestore();
    });

    it('logs error when multiple Contents are provided', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>First</Text>
          </EtBottomSheet.Content>
          <EtBottomSheet.Content>
            <Text>Second</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(consoleError).toHaveBeenCalledWith('EtBottomSheet: Only one Content component is allowed. Using first, ignoring duplicates.');

      consoleError.mockRestore();
    });

    it('logs error when multiple Footers are provided', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
          <EtBottomSheet.Footer>
            <Text>First</Text>
          </EtBottomSheet.Footer>
          <EtBottomSheet.Footer>
            <Text>Second</Text>
          </EtBottomSheet.Footer>
        </EtBottomSheet>,
      );

      expect(consoleError).toHaveBeenCalledWith('EtBottomSheet: Only one Footer component is allowed. Using first, ignoring duplicates.');

      consoleError.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('preserves the native iOS FullWindowOverlay container', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      Platform.OS = 'ios';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(BottomSheetModalMock.mock.calls[0][0].containerComponent).toBe(resolveBottomSheetContainerComponent());
    });

    it('preserves the native Android default portal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      Platform.OS = 'android';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(BottomSheetModalMock.mock.calls[0][0].containerComponent).toBeUndefined();
    });

    it('passes accessibility label to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} accessibilityLabel="Select an option">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].accessibilityLabel).toBe('Select an option');
    });

    it('sets accessibilityViewIsModal to true', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].accessibilityViewIsModal).toBe(true);
    });

    it('Header.Action has accessibility label', () => {
      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Action onPress={() => undefined} accessibilityLabel="Close" testID="close-btn">
              <Text>X</Text>
            </EtBottomSheet.Header.Action>
          </EtBottomSheet.Header>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const closeButton = getByTestId('close-btn');
      expect(closeButton.props.accessibilityLabel).toBe('Close');
    });
  });

  describe('Animation Configuration', () => {
    it('uses bouncy spring config by default', () => {
      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animationConfigs).toEqual(BOUNCY_SPRING_CONFIG);
    });

    it('uses smooth spring config when animationPreset is smooth', () => {
      render(
        <EtBottomSheet bottomSheetRef={mockRef} animationPreset="smooth">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animationConfigs).toEqual(SMOOTH_SPRING_CONFIG);
    });

    it('uses bouncy spring config when animationPreset is bouncy', () => {
      render(
        <EtBottomSheet bottomSheetRef={mockRef} animationPreset="bouncy">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animationConfigs.overshootClamping).toBe(false);
    });

    it('uses fast spring config when animationPreset is fast', () => {
      render(
        <EtBottomSheet bottomSheetRef={mockRef} animationPreset="fast">
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animationConfigs).toEqual(FAST_SPRING_CONFIG);
    });

    it('keeps legacy SPRING_CONFIG export for backward compatibility', () => {
      expect(SPRING_CONFIG).toEqual({
        damping: 50,
        stiffness: 500,
        mass: 1,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content gracefully', () => {
      expect(() => {
        render(
          <EtBottomSheet bottomSheetRef={mockRef}>
            <EtBottomSheet.Content>{null}</EtBottomSheet.Content>
          </EtBottomSheet>,
        );
      }).not.toThrow();
    });

    it('handles content without header or footer', () => {
      const { getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Just Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getByText('Just Content')).toBeTruthy();
    });

    it('handles all optional props', () => {
      expect(() => {
        render(
          <EtBottomSheet
            bottomSheetRef={mockRef}
            onClose={() => {}}
            closeOnBackdrop={false}
            enablePanDownToClose={false}
            showHandle={false}
            loading={false}
            accessibilityLabel="Test Sheet"
            testID="test-sheet"
          >
            <EtBottomSheet.Header>
              <EtBottomSheet.Header.Title>Title</EtBottomSheet.Header.Title>
              <EtBottomSheet.Header.Action onPress={() => undefined} accessibilityLabel="Close">
                <Text>X</Text>
              </EtBottomSheet.Header.Action>
            </EtBottomSheet.Header>
            <EtBottomSheet.Content scrollable>
              <Text>Content</Text>
            </EtBottomSheet.Content>
            <EtBottomSheet.Footer>
              <Text>Footer</Text>
            </EtBottomSheet.Footer>
          </EtBottomSheet>,
        );
      }).not.toThrow();
    });
  });

  describe('Advanced Props', () => {
    it('wraps onAnimate in an internal handler that forwards to the consumer callback', () => {
      // The modal no longer receives the raw consumer `onAnimate` — it receives
      // an internal `handleAnimate` wrapper (which also fires the early overlay
      // re-assert bump). gorhom early-returns when no `onAnimate` prop is passed,
      // so the wrapper must be present unconditionally; here we prove it forwards
      // the consumer's callback with the original 4-arg signature.
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      const onAnimate = jest.fn();

      render(
        <EtBottomSheet bottomSheetRef={mockRef} onAnimate={onAnimate}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(typeof call[0].onAnimate).toBe('function');
      expect(call[0].onAnimate).not.toBe(onAnimate);

      call[0].onAnimate(-1, 0, 800, 200);
      expect(onAnimate).toHaveBeenCalledWith(-1, 0, 800, 200);
    });

    it('passes an onAnimate wrapper to the modal even when the consumer provides none', () => {
      // gorhom's handleOnAnimate early-returns unless an onAnimate prop exists,
      // so the early bump would silently never fire if we forwarded undefined.
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(typeof call[0].onAnimate).toBe('function');
    });

    it('passes keyboard behavior props to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet
          bottomSheetRef={mockRef}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          enableBlurKeyboardOnGesture
          android_keyboardInputMode="adjustResize"
        >
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].keyboardBehavior).toBe('extend');
      expect(call[0].keyboardBlurBehavior).toBe('restore');
      expect(call[0].enableBlurKeyboardOnGesture).toBe(true);
      expect(call[0].android_keyboardInputMode).toBe('adjustResize');
    });

    it('passes detached prop to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} detached>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].detached).toBe(true);
    });

    it('passes enableOverDrag and overDragResistanceFactor to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} enableOverDrag={false} overDragResistanceFactor={5}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].enableOverDrag).toBe(false);
      expect(call[0].overDragResistanceFactor).toBe(5);
    });

    it('passes topInset and bottomInset to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} topInset={50} bottomInset={20}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].topInset).toBe(50);
      expect(call[0].bottomInset).toBe(20);
    });

    it('uses Android safe-area bottom inset by default', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      Platform.OS = 'android';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].bottomInset).toBe(34);
    });

    it('does not lift the modal on iOS by default', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      Platform.OS = 'ios';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].bottomInset).toBe(0);
    });

    it('passes animatedIndex shared value to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      const mockAnimatedIndex = { value: 0 };

      render(
        <EtBottomSheet bottomSheetRef={mockRef} animatedIndex={mockAnimatedIndex as any}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animatedIndex).toBe(mockAnimatedIndex);
    });

    it('passes animatedPosition shared value to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      const mockAnimatedPosition = { value: 0 };

      render(
        <EtBottomSheet bottomSheetRef={mockRef} animatedPosition={mockAnimatedPosition as any}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animatedPosition).toBe(mockAnimatedPosition);
    });

    it('passes both animatedIndex and animatedPosition to modal', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      const mockAnimatedIndex = { value: 0 };
      const mockAnimatedPosition = { value: 100 };

      render(
        <EtBottomSheet bottomSheetRef={mockRef} animatedIndex={mockAnimatedIndex as any} animatedPosition={mockAnimatedPosition as any}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].animatedIndex).toBe(mockAnimatedIndex);
      expect(call[0].animatedPosition).toBe(mockAnimatedPosition);
    });
  });

  describe('remountOnPresent', () => {
    let runAfterInteractionsSpy: jest.SpiedFunction<typeof InteractionManager.runAfterInteractions>;

    beforeEach(() => {
      // Synchronously invoke the scheduled callback so assertions on the "real" modal's methods
      // don't need to fight jsdom's async scheduling — matches the pattern already established
      // in `money-balances-sheet.component.spec.tsx`.
      runAfterInteractionsSpy = jest.spyOn(InteractionManager, 'runAfterInteractions').mockImplementation((callback) => {
        callback();
        return { cancel: jest.fn() } as unknown as ReturnType<typeof InteractionManager.runAfterInteractions>;
      });
    });

    afterEach(() => {
      runAfterInteractionsSpy.mockRestore();
    });

    function renderWithFreshRef(remountOnPresent: boolean) {
      const freshRef = { current: null } as unknown as React.RefObject<BottomSheetModal | null>;
      render(
        <EtBottomSheet bottomSheetRef={freshRef} remountOnPresent={remountOnPresent}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );
      return freshRef;
    }

    it('leaves bottomSheetRef pointing at the real modal when remountOnPresent is unset (default behavior unchanged)', () => {
      const freshRef = renderWithFreshRef(false);

      expect(freshRef.current?.present).toBe(mockRealModalPresent);
      expect(freshRef.current?.dismiss).toBe(mockRealModalDismiss);
    });

    it('populates bottomSheetRef with a wrapper (not the raw modal) when remountOnPresent is true', () => {
      const freshRef = renderWithFreshRef(true);

      expect(freshRef.current).toBeTruthy();
      expect(freshRef.current?.present).not.toBe(mockRealModalPresent);
      expect(typeof freshRef.current?.dismiss).toBe('function');
    });

    it('present() reaches the real modal via InteractionManager.runAfterInteractions', () => {
      const freshRef = renderWithFreshRef(true);

      act(() => {
        freshRef.current?.present();
      });

      expect(runAfterInteractionsSpy).toHaveBeenCalled();
      expect(mockRealModalPresent).toHaveBeenCalledTimes(1);
    });

    it('present() called twice in a row reliably reaches the real modal both times', () => {
      const freshRef = renderWithFreshRef(true);

      act(() => {
        freshRef.current?.present();
      });
      expect(mockRealModalPresent).toHaveBeenCalledTimes(1);

      act(() => {
        freshRef.current?.present();
      });

      // Regression coverage: this is the exact shape of the original bug — a second present()
      // must not silently no-op. Remounting via `key` on every present() call is what guarantees it.
      expect(mockRealModalPresent).toHaveBeenCalledTimes(2);
    });

    it('a superseded instance dismissing during its teardown does not fire onClose against the fresh sheet', () => {
      const onClose = jest.fn();
      const freshRef = { current: null } as unknown as React.RefObject<BottomSheetModal | null>;
      render(
        <EtBottomSheet bottomSheetRef={freshRef} remountOnPresent onClose={onClose}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      // First present → instance A opens (gorhom reports index 0), so it is no longer idle.
      act(() => {
        freshRef.current?.present();
      });
      const instanceA = BottomSheetModalMock.mock.calls.at(-1)[0];
      act(() => {
        instanceA.onChange(0);
      });

      // Second present while A is still "presented" (the wedged-modal case remountOnPresent exists
      // for): React tears A down and gorhom's portal cleanup fires A's own onDismiss.
      act(() => {
        freshRef.current?.present();
      });
      act(() => {
        instanceA.onDismiss();
      });

      // A's teardown must not reach the consumer — that handler now belongs to instance B.
      expect(onClose).not.toHaveBeenCalled();

      // B's own dismiss still does.
      const instanceB = BottomSheetModalMock.mock.calls.at(-1)[0];
      act(() => {
        instanceB.onChange(0);
        instanceB.onChange(-1);
        instanceB.onDismiss();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('forwards the present(data) payload to the recreated modal', () => {
      const freshRef = renderWithFreshRef(true);
      const data = { instrumentId: 42 };

      act(() => {
        freshRef.current?.present(data);
      });

      // The remount happens between the caller's present(data) and the real modal's present(),
      // so the payload has to survive it rather than reaching the instance being torn down.
      expect(mockRealModalPresent).toHaveBeenCalledWith(data);
    });

    it('does not leak a previous payload into a later present() with no data', () => {
      const freshRef = renderWithFreshRef(true);

      act(() => {
        freshRef.current?.present({ instrumentId: 42 });
      });
      act(() => {
        freshRef.current?.present();
      });

      expect(mockRealModalPresent).toHaveBeenLastCalledWith(undefined);
    });

    it('dismiss() delegates straight through to the real modal', () => {
      const freshRef = renderWithFreshRef(true);

      freshRef.current?.dismiss();

      expect(mockRealModalDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Virtualized Lists', () => {
    it('has List as static property', () => {
      expect(EtBottomSheet.List).toBe(EtBottomSheetList);
    });

    it('has SectionList as static property', () => {
      expect(EtBottomSheet.SectionList).toBe(EtBottomSheetSectionList);
    });

    it('has FlashList as static property', () => {
      expect(EtBottomSheet.FlashList).toBe(EtBottomSheetFlashList);
    });

    it('auto-disables dynamic sizing when List is used without snapPoints', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.List
            data={[{ id: '1' }, { id: '2' }]}
            renderItem={() => <Text>Item</Text>}
            keyExtractor={(item: { id: string }) => item.id}
          />
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      // Dynamic sizing should be auto-disabled for virtualized lists
      expect(call[0].enableDynamicSizing).toBe(false);
      // Should warn in dev mode
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('Virtualized lists'));

      consoleWarn.mockRestore();
    });

    it('uses snapPoints when provided with List', () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;

      render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%', '90%']}>
          <EtBottomSheet.List
            data={[{ id: '1' }, { id: '2' }]}
            renderItem={() => <Text>Item</Text>}
            keyExtractor={(item: { id: string }) => item.id}
          />
        </EtBottomSheet>,
      );

      const call = BottomSheetModalMock.mock.calls[0];
      expect(call[0].snapPoints).toEqual(['50%', '90%']);
      expect(call[0].enableDynamicSizing).toBe(false);
    });

    it('renders SectionList with header and footer', () => {
      const { getByText } = render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%']}>
          <EtBottomSheet.Header>
            <EtBottomSheet.Header.Title>Select Section</EtBottomSheet.Header.Title>
            <EtBottomSheet.Header.Action onPress={() => undefined} accessibilityLabel="Close">
              <Text>X</Text>
            </EtBottomSheet.Header.Action>
          </EtBottomSheet.Header>
          <EtBottomSheet.SectionList
            sections={[
              { title: 'A', data: [{ id: '1', name: 'Item 1' }] },
              { title: 'B', data: [{ id: '2', name: 'Item 2' }] },
            ]}
            renderItem={({ item }: { item: { id: string; name: string } }) => <Text>{item.name}</Text>}
            renderSectionHeader={({ section }: { section: { title: string } }) => <Text>{section.title}</Text>}
            keyExtractor={(item: { id: string }) => item.id}
          />
          <EtBottomSheet.Footer>
            <Text>Footer</Text>
          </EtBottomSheet.Footer>
        </EtBottomSheet>,
      );

      expect(getByText('Select Section')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('does not warn when snapPoints are provided with virtualized list', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%', '90%']}>
          <EtBottomSheet.List data={[{ id: '1' }]} renderItem={() => <Text>Item</Text>} keyExtractor={(item: { id: string }) => item.id} />
        </EtBottomSheet>,
      );

      // Should not warn when snapPoints are provided
      expect(consoleWarn).not.toHaveBeenCalled();

      consoleWarn.mockRestore();
    });
  });

  describe('Content Panning Gesture', () => {
    const getModalProps = () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      return BottomSheetModalMock.mock.calls[0][0];
    };

    it('disables content panning for a virtualized List on Android (prop not passed)', () => {
      Platform.OS = 'android';

      render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%', '90%']}>
          <EtBottomSheet.List data={[{ id: '1' }]} renderItem={() => <Text>Item</Text>} keyExtractor={(item: { id: string }) => item.id} />
        </EtBottomSheet>,
      );

      expect(getModalProps().enableContentPanningGesture).toBe(false);
    });

    it('keeps content panning enabled for scrollable Content on Android (PAH-430 preserved)', () => {
      Platform.OS = 'android';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content scrollable>
            <Text>Scrollable</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getModalProps().enableContentPanningGesture).toBe(true);
    });

    it('keeps content panning enabled for static Content on Android', () => {
      Platform.OS = 'android';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Static</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getModalProps().enableContentPanningGesture).toBe(true);
    });

    it('disables content panning for scrollable Content on iOS (unchanged)', () => {
      Platform.OS = 'ios';

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content scrollable>
            <Text>Scrollable</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      expect(getModalProps().enableContentPanningGesture).toBe(false);
    });

    it('keeps content panning enabled for a virtualized List on iOS (unchanged)', () => {
      Platform.OS = 'ios';

      render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%', '90%']}>
          <EtBottomSheet.List data={[{ id: '1' }]} renderItem={() => <Text>Item</Text>} keyExtractor={(item: { id: string }) => item.id} />
        </EtBottomSheet>,
      );

      expect(getModalProps().enableContentPanningGesture).toBe(true);
    });

    it('honors an explicit enableContentPanningGesture override on an Android List', () => {
      Platform.OS = 'android';

      render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%', '90%']} enableContentPanningGesture>
          <EtBottomSheet.List data={[{ id: '1' }]} renderItem={() => <Text>Item</Text>} keyExtractor={(item: { id: string }) => item.id} />
        </EtBottomSheet>,
      );

      expect(getModalProps().enableContentPanningGesture).toBe(true);
    });
  });

  describe('Android back handling', () => {
    let removeSubscription: jest.Mock;

    const getModalProps = () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      return BottomSheetModalMock.mock.calls[0][0];
    };

    const getHardwareBackHandler = () => {
      const handler = (BackHandler.addEventListener as jest.Mock).mock.calls.find(([eventName]) => eventName === 'hardwareBackPress')?.[1];

      if (!handler) {
        throw new Error('hardwareBackPress handler was not registered');
      }

      return handler as () => boolean;
    };

    const renderSheet = () =>
      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

    beforeEach(() => {
      Platform.OS = 'android';
      removeSubscription = jest.fn();
      jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove: removeSubscription });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      Platform.OS = originalOS;
    });

    it('does not register BackHandler while the sheet is closed', () => {
      renderSheet();

      expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    });

    it('registers BackHandler when the sheet is presented', () => {
      renderSheet();

      act(() => {
        getModalProps().onChange(0);
      });

      expect(BackHandler.addEventListener).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function));
    });

    it('dismisses the sheet and consumes the back press when presented', () => {
      renderSheet();

      act(() => {
        getModalProps().onChange(0);
      });

      act(() => {
        expect(getHardwareBackHandler()()).toBe(true);
      });

      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not register BackHandler when dismissOnAndroidBack is false', () => {
      render(
        <EtBottomSheet bottomSheetRef={mockRef} dismissOnAndroidBack={false}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      act(() => {
        getModalProps().onChange(0);
      });

      expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    });

    it('does not register BackHandler on iOS when presented', () => {
      Platform.OS = 'ios';

      renderSheet();

      act(() => {
        getModalProps().onChange(0);
      });

      expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    });

    it('respects onBeforeClose when back is pressed', () => {
      const onBeforeClose = jest.fn(() => false);

      render(
        <EtBottomSheet bottomSheetRef={mockRef} onBeforeClose={onBeforeClose}>
          <EtBottomSheet.Content>
            <Text>Content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      act(() => {
        getModalProps().onChange(0);
      });

      act(() => {
        expect(getHardwareBackHandler()()).toBe(true);
      });

      expect(onBeforeClose).toHaveBeenCalledTimes(1);
      expect(mockDismiss).not.toHaveBeenCalled();
    });

    it('removes BackHandler when the sheet closes', () => {
      renderSheet();

      act(() => {
        getModalProps().onChange(0);
      });

      act(() => {
        getModalProps().onChange(-1);
      });

      expect(removeSubscription).toHaveBeenCalled();
    });
  });

  describe('App-float-overlay lifecycle', () => {
    const getModalProps = () => {
      const BottomSheetModalMock = require('@gorhom/bottom-sheet').BottomSheetModal;
      return BottomSheetModalMock.mock.calls[0][0];
    };

    it('GIVEN a dismiss completes via onDismiss without a paired onChange(-1) WHEN the sheet is re-presented THEN the user-observable content and lifecycle spies both agree the second present ran', () => {
      // The pathological path: gorhom fires `onDismiss` alone (no
      // `onChange(-1)`), leaving `wasPresentedRef` stuck true and silently
      // skipping the next present. `handleDismiss` clears the latch as a
      // belt-and-suspenders reset. We assert this from both sides so the
      // test survives a refactor that keeps the mock counts happy but drops
      // the user-observable outcome (or vice versa):
      //   • user-observable: the sheet's testID + inner content stay visible
      //     across the mount / present / dismiss / re-present cycle (a
      //     regression that unmounts the modal subtree on dismiss would fail
      //     `getByText('sheet-content')` after the dismiss step);
      //   • internal spies: `notifySheetPresented` fires again on the second
      //     present (a regression to the pre-fix latch would leave the spy
      //     stuck at 1).
      (notifySheetPresented as jest.Mock).mockClear();
      (notifySheetDismissed as jest.Mock).mockClear();

      const { getByText, getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      // The mocked BottomSheetModal renders its children immediately (see the
      // `@gorhom/bottom-sheet` factory at the top of this file), so the sheet
      // subtree is visible from mount. A regression that failed to render the
      // content on initial mount would fail `getByText` here.
      expect(getByTestId('bottom-sheet-modal')).toBeTruthy();
      expect(getByText('sheet-content')).toBeTruthy();

      const modalProps = getModalProps();

      // Present transition (index 0 = first snap point).
      modalProps.onChange(0);
      expect(notifySheetPresented).toHaveBeenCalledTimes(1);
      expect(getByText('sheet-content')).toBeTruthy();

      // Dismiss via `onDismiss` only — no `onChange(-1)`.
      modalProps.onDismiss();
      expect(notifySheetDismissed).toHaveBeenCalledTimes(1);
      // The subtree is still mounted (gorhom keeps it alive between presents
      // when the modal ref is retained by the consumer). This mirrors what a
      // user sees on device: the sheet animates out but the JS tree stays.
      expect(getByText('sheet-content')).toBeTruthy();

      // Re-present. Pre-fix this was a no-op; post-fix
      // `notifySheetPresented` fires a second time AND the content the user
      // sees on the re-present is the same subtree we rendered up top.
      modalProps.onChange(0);
      expect(notifySheetPresented).toHaveBeenCalledTimes(2);
      expect(getByText('sheet-content')).toBeTruthy();
    });

    it('GIVEN a close via onChange(-1) WHEN onDismiss has not yet fired THEN the dismiss ledger is NOT cleared eagerly (yield contract: settle only on onDismiss)', () => {
      // Gorhom fires `onChange(-1)` BEFORE `onDismiss` (see
      // `BottomSheetModal.tsx` — `handleBottomSheetOnChange` runs, then
      // `handleBottomSheetOnClose` calls `unmount()` which fires
      // `_providedOnDismiss`). At `onChange(-1)` the sheet's
      // `FullWindowOverlay` is still attached to the key window.
      //
      // If we cleared `notifySheetDismissed` here, a waiting
      // `useYieldForNativeSurface` would resolve during the dismiss animation
      // and present a native VC BEHIND the still-attached overlay —
      // reintroducing the original PM-636 defect. The yield's own documented
      // contract in `use-yield-for-native-surface.ts` says the awaiter
      // resolves on `onDismiss`, not `onChange(-1)`, so the ledger clear must
      // live in `handleDismiss` alone. The store's 5s
      // `awaitAllSheetsDismissed` timeout handles the theoretical
      // onChange(-1)-without-onDismiss case that gorhom never actually
      // produces.
      (notifySheetPresented as jest.Mock).mockClear();
      (notifySheetDismissed as jest.Mock).mockClear();

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modalProps = getModalProps();

      modalProps.onChange(0);
      expect(notifySheetPresented).toHaveBeenCalledTimes(1);

      // Close via `onChange(-1)` alone. The ledger MUST NOT be cleared yet —
      // the sheet's `FullWindowOverlay` is still attached at this point.
      modalProps.onChange(-1);
      expect(notifySheetDismissed).not.toHaveBeenCalled();

      // The paired `onDismiss` fires next (gorhom's `unmount()` calls it
      // after telling React to unmount the FullWindowOverlay). Only now is
      // the ledger cleared.
      modalProps.onDismiss();
      expect(notifySheetDismissed).toHaveBeenCalledTimes(1);

      // A second onDismiss must not double-decrement (owesDismissNotifyRef
      // guard).
      modalProps.onDismiss();
      expect(notifySheetDismissed).toHaveBeenCalledTimes(1);
    });

    it('GIVEN the open transition starts (onAnimate: -1 -> 0) WHEN it fires THEN notifySheetPresenting bumps the counter early (before settle) exactly once', () => {
      // The flash fix: fire the counter bump at animation START (onAnimate) so
      // the app-overlay re-assert lands at the start of the open animation, not
      // at settle. The early bump is counter-only (no token) and must fire once.
      (notifySheetPresenting as jest.Mock).mockClear();
      (notifySheetPresented as jest.Mock).mockClear();

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modalProps = getModalProps();

      // Open animation starts: gorhom onAnimate(fromIndex=-1, toIndex=0).
      modalProps.onAnimate(-1, 0, 800, 200);
      expect(notifySheetPresenting).toHaveBeenCalledTimes(1);
      // Settle bump (the floor) has NOT fired yet — it comes from onChange.
      expect(notifySheetPresented).not.toHaveBeenCalled();

      // Settle: the token-registering bump fires — both reasserts, one token.
      modalProps.onChange(0);
      expect(notifySheetPresented).toHaveBeenCalledTimes(1);
    });

    it('GIVEN non-open animations (snap change, close) WHEN onAnimate fires THEN the early bump does NOT fire', () => {
      // onAnimate fires on EVERY animation. The early bump must be scoped to the
      // open-from-closed transition (fromIndex < 0 && toIndex >= 0) so drags,
      // snap-point changes, and close animations never spuriously re-assert.
      (notifySheetPresenting as jest.Mock).mockClear();

      render(
        <EtBottomSheet bottomSheetRef={mockRef} snapPoints={['50%', '90%']}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modalProps = getModalProps();

      modalProps.onAnimate(0, 1, 400, 100); // snap 0 -> 1 (already open)
      modalProps.onAnimate(1, 0, 100, 400); // snap 1 -> 0 (still open)
      modalProps.onAnimate(0, -1, 400, 800); // close 0 -> -1
      expect(notifySheetPresenting).not.toHaveBeenCalled();
    });

    it('GIVEN a single open animation reports onAnimate more than once WHEN both fire THEN the early bump is guarded to once per present', () => {
      (notifySheetPresenting as jest.Mock).mockClear();

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modalProps = getModalProps();
      modalProps.onAnimate(-1, 0, 800, 200);
      modalProps.onAnimate(-1, 0, 800, 200); // duplicate open report
      expect(notifySheetPresenting).toHaveBeenCalledTimes(1);
    });

    it('GIVEN the sheet closes and reopens WHEN the guard resets on close THEN the early bump fires again on the second open', () => {
      (notifySheetPresenting as jest.Mock).mockClear();

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modalProps = getModalProps();

      // First open + settle + close cycle.
      modalProps.onAnimate(-1, 0, 800, 200);
      modalProps.onChange(0);
      modalProps.onChange(-1); // close branch re-arms the early-bump guard
      expect(notifySheetPresenting).toHaveBeenCalledTimes(1);

      // Second open re-fires the early bump.
      modalProps.onAnimate(-1, 0, 800, 200);
      expect(notifySheetPresenting).toHaveBeenCalledTimes(2);
    });

    it('GIVEN the guard is reset by handleDismiss WHEN a dismiss completes before reopening THEN the early bump fires again', () => {
      // Belt-and-suspenders: the guard also resets in handleDismiss, so a
      // dismiss that arrives without a paired onChange(-1) still re-arms the
      // early bump for the next present.
      (notifySheetPresenting as jest.Mock).mockClear();

      render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text>sheet-content</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modalProps = getModalProps();

      modalProps.onAnimate(-1, 0, 800, 200);
      modalProps.onDismiss(); // reset via handleDismiss (no onChange(-1))
      modalProps.onAnimate(-1, 0, 800, 200);
      expect(notifySheetPresenting).toHaveBeenCalledTimes(2);
    });

    it('GIVEN the sheet is mounted WHEN Content children are provided THEN they render inside the bottom-sheet-modal subtree (render order)', () => {
      // Cheap render-order check: the sheet's content must live inside the
      // gorhom modal's own subtree (not float outside it). A regression that
      // teleported `EtBottomSheet.Content` elsewhere in the tree would still
      // pass a `getByText` check globally — this one won't, because we scope
      // the query to descendants of the modal's testID.
      const { getByTestId } = render(
        <EtBottomSheet bottomSheetRef={mockRef}>
          <EtBottomSheet.Content>
            <Text testID="scoped-child">child</Text>
          </EtBottomSheet.Content>
        </EtBottomSheet>,
      );

      const modal = getByTestId('bottom-sheet-modal');
      // `findByType`-style descendant scan via ReactTestInstance — no extra
      // deps and no coupling to the mock's internal shape.
      const descendants = modal.findAllByProps({ testID: 'scoped-child' });
      expect(descendants.length).toBeGreaterThan(0);
    });
  });
});
