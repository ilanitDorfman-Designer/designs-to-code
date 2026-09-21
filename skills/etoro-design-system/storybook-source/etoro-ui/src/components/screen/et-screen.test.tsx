import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { ScrollProvider } from '../../core/contexts/scroll/scroll.context';
import { useTopBarContext } from './api/top-bar-context';
import { EtScreen } from './et-screen';

// Mock @shopify/flash-list with a simple View-based renderer.
// Using FlatList would pull in VirtualizedList/ScrollView mocks that
// conflict with ScreenFlashList's renderScrollComponent injection.
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  return {
    FlashList: ({ data, renderItem, testID, keyExtractor, ...rest }: any) => (
      <View testID={testID} {...rest}>
        {data?.map((item: any, index: number) => (
          <View key={keyExtractor?.(item, index) ?? index}>
            {renderItem?.({
              item,
              index,
              target: 'Cell',
              extraData: undefined,
            })}
          </View>
        ))}
      </View>
    ),
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, testID, style, colors, start, end, ...props }: any) => {
    const { View } = require('react-native');
    return (
      <View testID={testID || 'linear-gradient'} style={style} colors={colors} start={start} end={end} {...props}>
        {children}
      </View>
    );
  },
}));

// Mock @react-navigation/core
jest.mock('@react-navigation/core', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    openDrawer: jest.fn(),
  })),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Stack: ({ children }: any) => children,
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
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
}));

// Mock the GreenHalo component
jest.mock('../../core/components/green-halo', () => ({
  GreenHalo: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="green-halo">{children}</View>;
  },
}));

// Mock the NeutralHalo component
jest.mock('../../core/components/neutral-halo', () => ({
  NeutralHalo: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="neutral-halo">{children}</View>;
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock etoro-core/hooks
jest.mock('etoro-core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      cardDefault: '#FFFFFF',
      backgroundBase: '#F5F5F5',
      carbon500: '#888888',
    },
  })),
}));

// Mock core hooks (relative path imports)
jest.mock('../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      cardDefault: '#FFFFFF',
      backgroundBase: '#F5F5F5',
      carbon500: '#888888',
    },
  })),
  useScreenScroll: jest.fn(),
  useAnimatedHeader: jest.fn(),
  useScrollHandler: jest.fn(),
}));

const mockText = 'Test Content';
const mockTestId = 'et-screen-test';

const containerStyle = {
  backgroundColor: 'red',
  margin: 10,
};

function TestComponent() {
  return <Text>Test Component</Text>;
}

// Helper function to wrap components with ScrollProvider
function renderWithProviders(component: React.ReactElement) {
  return render(<ScrollProvider>{component}</ScrollProvider>);
}

describe('EtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
      const { queryByTestId } = renderWithProviders(
        <EtScreen>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(queryByTestId(mockTestId)).toBeNull();
    });

    it('renders React component children', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            <TestComponent />
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText('Test Component')).toBeTruthy();
    });

    it('renders multiple children', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.TopBar />
          <EtScreen.View>
            <TestComponent />
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText('Test Component')).toBeTruthy();
      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Compound Component Pattern', () => {
    it('supports EtScreen.TopBar subcomponent', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar />
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('supports EtScreen.ScrollView subcomponent', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar />
          <EtScreen.ScrollView>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('supports EtScreen.View subcomponent', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('renders TopBar when EtScreen.TopBar is present', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen />
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('TopBar Configuration', () => {
    it('accepts isInnerScreen prop', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen />
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('accepts Start slot content', () => {
      function BackButton() {
        return <Text>Back</Text>;
      }
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen>
            <EtScreen.TopBar.Start>
              <BackButton />
            </EtScreen.TopBar.Start>
          </EtScreen.TopBar>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
      expect(getByText('Back')).toBeTruthy();
    });

    it('accepts Middle slot content', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen>
            <EtScreen.TopBar.Middle>
              <EtScreen.TopBar.Title>Settings</EtScreen.TopBar.Title>
            </EtScreen.TopBar.Middle>
          </EtScreen.TopBar>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });

    it('accepts End slot content', () => {
      function MoreButton() {
        return <Text>More</Text>;
      }
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen>
            <EtScreen.TopBar.End>
              <MoreButton />
            </EtScreen.TopBar.End>
          </EtScreen.TopBar>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
      expect(getByText('More')).toBeTruthy();
    });

    it('renders all slots together (Start, Middle, End)', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen>
            <EtScreen.TopBar.Start>
              <Text>Back</Text>
            </EtScreen.TopBar.Start>
            <EtScreen.TopBar.Middle>
              <EtScreen.TopBar.Title>Portfolio</EtScreen.TopBar.Title>
            </EtScreen.TopBar.Middle>
            <EtScreen.TopBar.End>
              <Text>Search</Text>
            </EtScreen.TopBar.End>
          </EtScreen.TopBar>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText('Back')).toBeTruthy();
      expect(getByText('Portfolio')).toBeTruthy();
      expect(getByText('Search')).toBeTruthy();
    });

    // PAH-788 regression: a parent re-render hands the TopBar slots a new `children` reference.
    // The slot register/unregister effects are split so unregister only fires on unmount — the
    // registered content must stay continuously present (never briefly nulled), otherwise the
    // painted TopBar (incl. iOS Liquid Glass capsules) rematerializes and flickers.
    it('keeps Start/End slot content across parent re-renders with new child identities', () => {
      const presenceSnapshots: Array<{ startPresent: boolean; endPresent: boolean }> = [];

      /** Records every TopBar slot presence snapshot (must never clear on rerender). */
      function SlotLifecycleProbe() {
        const { state } = useTopBarContext();
        presenceSnapshots.push({ startPresent: state.start != null, endPresent: state.end != null });
        return null;
      }

      function Harness({ label }: { label: string }) {
        return (
          <EtScreen>
            <EtScreen.TopBar>
              <SlotLifecycleProbe />
              {/* New JSX element identity every render (inline) — mimics HomeScreen chrome. */}
              <EtScreen.TopBar.Start>
                <Text>Menu</Text>
              </EtScreen.TopBar.Start>
              <EtScreen.TopBar.End>
                <Text>{label}</Text>
              </EtScreen.TopBar.End>
            </EtScreen.TopBar>
            <EtScreen.View>
              <Text>{mockText}</Text>
            </EtScreen.View>
          </EtScreen>
        );
      }

      const { getByText, queryByText, rerender } = render(
        <ScrollProvider>
          <Harness label="Search" />
        </ScrollProvider>,
      );

      expect(getByText('Menu')).toBeTruthy();
      expect(getByText('Search')).toBeTruthy();
      // Slots have registered; clear mount noise before asserting the rerender transition.
      const settledIndex = presenceSnapshots.length;

      rerender(
        <ScrollProvider>
          <Harness label="Notifications" />
        </ScrollProvider>,
      );

      // Start slot unchanged, End slot updated — both remain rendered (no drop/flicker).
      expect(getByText('Menu')).toBeTruthy();
      expect(getByText('Notifications')).toBeTruthy();
      expect(queryByText('Search')).toBeNull();

      // Presence must never briefly clear during the rerender — the old combined effect would
      // null then re-register before the settled tree assertions above could catch it.
      // Observing state transitions covers unregister-on-churn without mutating TopBar actions
      // (react-compiler forbids assigning over context action methods).
      const duringRerender = presenceSnapshots.slice(settledIndex);
      expect(duringRerender.length).toBeGreaterThan(0);
      expect(duringRerender.every((snapshot) => snapshot.startPresent && snapshot.endPresent)).toBe(true);
    });

    it('exposes Action subcomponent for pressable buttons', () => {
      const onPress = jest.fn();
      const { getByText, getByLabelText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen>
            <EtScreen.TopBar.Start>
              <EtScreen.TopBar.Action accessibilityLabel="Go back" onPress={onPress}>
                <Text>Back</Text>
              </EtScreen.TopBar.Action>
            </EtScreen.TopBar.Start>
          </EtScreen.TopBar>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText('Back')).toBeTruthy();
      fireEvent.press(getByLabelText('Go back'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('accepts animation prop', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar animation="collapse" />
          <EtScreen.ScrollView>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('accepts animation="none" prop', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar animation="none" />
          <EtScreen.ScrollView>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('accepts animation="fade" prop', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar animation="fade" />
          <EtScreen.ScrollView>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('renders with EtScreen.Header as sibling of TopBar', () => {
      const headerText = 'Extended Header Content';
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar />
          <EtScreen.Header>
            <Text>{headerText}</Text>
          </EtScreen.Header>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(headerText)).toBeTruthy();
      expect(getByText(mockText)).toBeTruthy();
    });

    it('renders EtScreen.Header with collapseWithTopBar prop', () => {
      const headerText = 'Collapsing Header';
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar />
          <EtScreen.Header collapseWithTopBar>
            <Text>{headerText}</Text>
          </EtScreen.Header>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(headerText)).toBeTruthy();
      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Container Component Selection', () => {
    it('uses regular View by default', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('uses Animated.View when entering animation is provided', () => {
      const mockEntering = jest.fn();
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} entering={mockEntering}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('uses Animated.View when exiting animation is provided', () => {
      const mockExiting = jest.fn();
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} exiting={mockExiting}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Style Props', () => {
    it('applies custom style to container', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} style={containerStyle}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('handles array of styles', () => {
      const styleArray = [containerStyle, { padding: 5 }];
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} style={styleArray}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('handles null/undefined style', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} style={undefined}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Animation Props', () => {
    it('applies entering animation when provided', () => {
      const mockEntering = jest.fn();
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} entering={mockEntering}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('applies exiting animation when provided', () => {
      const mockExiting = jest.fn();
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} exiting={mockExiting}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('applies both entering and exiting animations', () => {
      const mockEntering = jest.fn();
      const mockExiting = jest.fn();
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId} entering={mockEntering} exiting={mockExiting}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Gradient Functionality', () => {
    it('renders content without gradient when gradient is false', () => {
      const { getByText, queryByTestId } = renderWithProviders(
        <EtScreen gradient={false}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
      expect(queryByTestId('linear-gradient')).toBeNull();
    });

    it('wraps content in LinearGradient when gradient is true', () => {
      const { getByText, getByTestId } = renderWithProviders(
        <EtScreen gradient={true}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
      expect(getByTestId('linear-gradient')).toBeTruthy();
    });

    it('defaults to no gradient when gradient prop is not provided', () => {
      const { getByText, queryByTestId } = renderWithProviders(
        <EtScreen>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
      expect(queryByTestId('linear-gradient')).toBeNull();
    });

    it('applies gradient colors from theme', () => {
      const { getByTestId } = renderWithProviders(
        <EtScreen gradient={true}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      const gradientElement = getByTestId('linear-gradient');
      expect(gradientElement.props.colors).toEqual(['#FFFFFF', '#F5F5F5']);
    });

    it('applies gradient direction correctly', () => {
      const { getByTestId } = renderWithProviders(
        <EtScreen gradient={true}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      const gradientElement = getByTestId('linear-gradient');
      expect(gradientElement.props.start).toEqual({ x: 0, y: 0 });
      expect(gradientElement.props.end).toEqual({ x: 0, y: 1 });
    });
  });

  describe('Halo Animation', () => {
    it('accepts animateHalo prop', () => {
      const { getByText } = renderWithProviders(
        <EtScreen animateHalo>
          <EtScreen.TopBar />
          <EtScreen.ScrollView>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('animateHalo defaults to false', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar />
          <EtScreen.ScrollView>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles null children inside EtScreen.View', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            {null}
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('handles undefined children inside EtScreen.View', () => {
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            {undefined}
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('handles conditional children', () => {
      const showText = true;
      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>{showText && <Text>{mockText}</Text>}</EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('handles array of children', () => {
      const children = [<Text key="1">Child 1</Text>, <Text key="2">Child 2</Text>];

      const { getByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>{children}</EtScreen.View>
        </EtScreen>,
      );

      expect(getByText('Child 1')).toBeTruthy();
      expect(getByText('Child 2')).toBeTruthy();
    });
  });

  describe('ScrollView Specific', () => {
    it('EtScreen.ScrollView accepts ScrollView props', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });

    it('EtScreen.ScrollView accepts contentContainerStyle', () => {
      const contentContainerStyle = { padding: 16 };
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.ScrollView contentContainerStyle={contentContainerStyle}>
            <Text>{mockText}</Text>
          </EtScreen.ScrollView>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('View Specific', () => {
    it('EtScreen.View accepts View props', () => {
      const viewStyle = { flex: 1 };
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.View style={viewStyle} accessibilityLabel="test-view">
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();
    });
  });

  describe('Component Lifecycle', () => {
    it('handles component unmounting gracefully', () => {
      const { unmount } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(() => unmount()).not.toThrow();
    });

    it('handles prop changes correctly', () => {
      const { rerender, queryByTestId, getByTestId } = renderWithProviders(
        <EtScreen testID={mockTestId} gradient={false}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(queryByTestId('linear-gradient')).toBeNull();

      rerender(
        <ScrollProvider>
          <EtScreen testID={mockTestId} gradient={true}>
            <EtScreen.View>
              <Text>{mockText}</Text>
            </EtScreen.View>
          </EtScreen>
        </ScrollProvider>,
      );

      expect(getByTestId('linear-gradient')).toBeTruthy();
    });

    it('handles children changes correctly', () => {
      const { rerender, getByText, queryByText } = renderWithProviders(
        <EtScreen testID={mockTestId}>
          <EtScreen.View>
            <Text>{mockText}</Text>
          </EtScreen.View>
        </EtScreen>,
      );

      expect(getByText(mockText)).toBeTruthy();

      const newText = 'New Content';
      rerender(
        <ScrollProvider>
          <EtScreen testID={mockTestId}>
            <EtScreen.View>
              <Text>{newText}</Text>
            </EtScreen.View>
          </EtScreen>
        </ScrollProvider>,
      );

      expect(getByText(newText)).toBeTruthy();
      expect(queryByText(mockText)).toBeNull();
    });
  });

  describe('FlashList Specific', () => {
    const mockData = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
    ];

    it('supports EtScreen.FlashList subcomponent', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar isInnerScreen />
          <EtScreen.FlashList data={mockData} renderItem={({ item }) => <Text>{item.title}</Text>} keyExtractor={(item) => item.id} />
        </EtScreen>,
      );

      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
    });

    it('EtScreen.FlashList accepts FlashList props', () => {
      const onEndReached = jest.fn();
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.FlashList
            data={mockData}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            keyExtractor={(item) => item.id}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        </EtScreen>,
      );

      expect(getByText('Item 1')).toBeTruthy();
    });

    it('EtScreen.FlashList accepts contentContainerStyle', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.FlashList
            data={mockData}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </EtScreen>,
      );

      expect(getByText('Item 1')).toBeTruthy();
    });

    it('EtScreen.FlashList works with TopBar', () => {
      const { getByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.TopBar animation="collapse" />
          <EtScreen.FlashList data={mockData} renderItem={({ item }) => <Text>{item.title}</Text>} keyExtractor={(item) => item.id} />
        </EtScreen>,
      );

      expect(getByText('Item 1')).toBeTruthy();
    });

    it('EtScreen.FlashList renders empty list', () => {
      const { queryByText } = renderWithProviders(
        <EtScreen>
          <EtScreen.FlashList data={[]} renderItem={({ item }: { item: any }) => <Text>{item.title}</Text>} keyExtractor={(item: any) => item.id} />
        </EtScreen>,
      );

      expect(queryByText('Item 1')).toBeNull();
    });
  });

  describe('Context Error Handling', () => {
    it('throws error when subcomponents are used outside EtScreen', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <EtScreen.View>
            <Text>Test</Text>
          </EtScreen.View>,
        );
      }).toThrow('useScreenContext must be used within an EtScreen component');

      consoleSpy.mockRestore();
    });
  });
});
