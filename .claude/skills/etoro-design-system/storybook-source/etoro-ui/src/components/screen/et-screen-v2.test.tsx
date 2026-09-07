import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, Text, View, ViewProps, ViewStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { ScrollProvider } from '../../core/contexts/scroll/scroll.context';
import { EtTopbar } from '../topbar';
import { EtScreenOverlay, EtScreenV2, useScrollHandlers } from './et-screen-v2';

type MockGradientCoordinate = { x: number; y: number };

type MockLinearGradientProps = {
  children?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  colors?: readonly string[];
  start?: MockGradientCoordinate;
  end?: MockGradientCoordinate;
};

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, testID, style, colors, start, end, ...props }: MockLinearGradientProps) => {
    const { View } = require('react-native');
    return (
      <View testID={testID || 'linear-gradient'} style={style} colors={colors} start={start} end={end} {...props}>
        {children}
      </View>
    );
  },
}));

jest.mock('@react-navigation/core', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    openDrawer: jest.fn(),
  })),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    openDrawer: jest.fn(),
  })),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: React.PropsWithChildren<ViewProps>) => <View {...props}>{children}</View>,
    SafeAreaProvider: ({ children }: React.PropsWithChildren) => <View>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      bgNeutralPrimary: '#F5F5F5',
      bgNeutralSecondary: '#FFFFFF',
    },
  })),
  useScreenScroll: jest.fn(),
}));

function renderWithProviders(component: React.ReactElement) {
  return render(<ScrollProvider>{component}</ScrollProvider>);
}

/** Walks up the rendered tree to find the first ancestor View whose style includes `paddingHorizontal`. */
function findHorizontalPaddingOnAncestors(element: ReactTestInstance): number | null {
  let current: ReactTestInstance | null = element;
  while (current) {
    const styles = current.props?.style as StyleProp<ViewStyle>;
    const flat = Array.isArray(styles) ? styles.flat(Infinity).filter(Boolean) : [styles].filter(Boolean);
    for (const s of flat) {
      if (s && typeof s === 'object' && 'paddingHorizontal' in s) return s.paddingHorizontal as number;
    }
    current = current.parent;
  }
  return null;
}

describe('EtScreenV2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children directly (no Body wrapper needed)', () => {
    const { getByText } = renderWithProviders(
      <EtScreenV2>
        <Text>Body content</Text>
      </EtScreenV2>,
    );

    expect(getByText('Body content')).toBeTruthy();
  });

  it('does not expose subcomponents; body/chrome are rendered as direct children', () => {
    const subcomponents = EtScreenV2 as unknown as Record<string, unknown>;
    expect(subcomponents.Body).toBeUndefined();
    expect(subcomponents.ScrollView).toBeUndefined();
    expect(subcomponents.FlashList).toBeUndefined();
    expect(subcomponents.Header).toBeUndefined();
    expect(subcomponents.TopBar).toBeUndefined();
    expect(subcomponents.Overlay).toBeUndefined();
  });

  it('is full-bleed by default (applies no horizontal padding)', () => {
    const { getByTestId } = renderWithProviders(
      <EtScreenV2>
        <View testID="probe" />
      </EtScreenV2>,
    );

    const padding = findHorizontalPaddingOnAncestors(getByTestId('probe'));
    expect(padding).toBeNull();
  });

  it('applies a requested top edge as a manual inset, never via SafeAreaView', () => {
    const { getByTestId } = renderWithProviders(
      <EtScreenV2 edges={['left', 'right', 'top']} testID="screen">
        <View />
      </EtScreenV2>,
    );

    const screen = getByTestId('screen');
    // SafeAreaView keeps left/right but drops top: the top inset is applied manually from a
    // first-frame-stable value so freshly presented modals don't flash content under the status bar.
    expect(screen.props.edges).toEqual(['left', 'right']);
    const flat = (Array.isArray(screen.props.style) ? screen.props.style.flat(Infinity) : [screen.props.style]).filter(Boolean);
    expect(flat.some((s: ViewStyle) => typeof s === 'object' && 'paddingTop' in s)).toBe(true);
  });

  it('does not apply a top inset when the requested edges exclude top', () => {
    const { getByTestId } = renderWithProviders(
      <EtScreenV2 edges={['left', 'right']} testID="screen">
        <View />
      </EtScreenV2>,
    );

    const screen = getByTestId('screen');
    expect(screen.props.edges).toEqual(['left', 'right']);
    const flat = (Array.isArray(screen.props.style) ? screen.props.style.flat(Infinity) : [screen.props.style]).filter(Boolean);
    expect(flat.some((s: ViewStyle) => typeof s === 'object' && 'paddingTop' in s)).toBe(false);
  });

  it('renders EtTopbar as a normal direct child', () => {
    const { getByText } = renderWithProviders(
      <EtScreenV2>
        <EtTopbar>
          <EtTopbar.Middle>
            <EtTopbar.Title>Watchlist</EtTopbar.Title>
          </EtTopbar.Middle>
        </EtTopbar>
        <Text>List content</Text>
      </EtScreenV2>,
    );

    expect(getByText('Watchlist')).toBeTruthy();
    expect(getByText('List content')).toBeTruthy();
  });

  it('connects explicit scroll owners without rerendering on each scroll', async () => {
    const onScroll = jest.fn();
    const renders = { count: 0 };
    const captured: { scrollBottomDistance: { value: number } | null } = { scrollBottomDistance: null };

    function ExplicitScrollOwner() {
      // eslint-disable-next-line react-compiler/react-compiler -- test-only render counter; intentionally writes to an out-of-component holder
      renders.count += 1;
      const { onScroll: handleScroll, scrollEventThrottle, scrollBottomDistance } = useScrollHandlers({ onScroll });

      captured.scrollBottomDistance = scrollBottomDistance;

      return (
        <ScrollView testID="scroll-owner" onScroll={handleScroll} scrollEventThrottle={scrollEventThrottle}>
          <Text>Scrollable content</Text>
        </ScrollView>
      );
    }

    const { getByTestId } = renderWithProviders(
      <EtScreenV2>
        <ExplicitScrollOwner />
      </EtScreenV2>,
    );

    await waitFor(() => expect(renders.count).toBeGreaterThan(0));
    const renderCountAfterMount = renders.count;

    fireEvent.scroll(getByTestId('scroll-owner'), {
      nativeEvent: {
        contentOffset: { y: 120 },
        contentSize: { height: 600, width: 320 },
        layoutMeasurement: { height: 300, width: 320 },
      },
    });

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(captured.scrollBottomDistance?.value).toBe(180);
    expect(renders.count).toBe(renderCountAfterMount);
  });

  it('exposes scrollY shared value so siblings can read scroll without re-rendering', () => {
    const captured: { scrollY: { value: number } | null } = { scrollY: null };

    function SiblingThatReads() {
      const { scrollY } = useScrollHandlers();
      // eslint-disable-next-line react-compiler/react-compiler -- test-only capture; intentionally writes to an out-of-component holder
      captured.scrollY = scrollY;
      return <Text>Sibling</Text>;
    }

    renderWithProviders(
      <EtScreenV2>
        <SiblingThatReads />
      </EtScreenV2>,
    );

    expect(captured.scrollY).not.toBeNull();
    expect(typeof (captured.scrollY as { value: number }).value).toBe('number');
  });

  // ===========================================================================
  // Overlay slot
  // ===========================================================================

  describe('Overlay slot', () => {
    it('hoists Overlay children into the screen shell even when declared deep in the tree', () => {
      // Context-based registration is the whole point of Overlay — consumers can declare it next
      // to the content that owns its state, without prop-drilling it up to the screen root.
      function DeeplyNestedOverlay() {
        return (
          <EtScreenOverlay>
            <View testID="hoisted-overlay" />
          </EtScreenOverlay>
        );
      }

      const { getByTestId } = renderWithProviders(
        <EtScreenV2>
          <View>
            <View>
              <DeeplyNestedOverlay />
            </View>
          </View>
          <Text>Body</Text>
        </EtScreenV2>,
      );

      expect(getByTestId('hoisted-overlay')).toBeTruthy();
    });

    it('coexists with a normal EtTopbar child', () => {
      const { getByTestId } = renderWithProviders(
        <EtScreenV2>
          <EtTopbar>
            <EtTopbar.Middle>
              <View testID="watchlist-topnav" />
            </EtTopbar.Middle>
          </EtTopbar>
          <Text>Body</Text>
          <EtScreenOverlay>
            <View testID="watchlist-blur" />
          </EtScreenOverlay>
        </EtScreenV2>,
      );

      // Both slots resolve on the same screen — this is the exact pattern the watchlist relies on
      // to keep its progressive blur extending behind the status bar.
      expect(getByTestId('watchlist-topnav')).toBeTruthy();
      expect(getByTestId('watchlist-blur')).toBeTruthy();
    });
  });
});
