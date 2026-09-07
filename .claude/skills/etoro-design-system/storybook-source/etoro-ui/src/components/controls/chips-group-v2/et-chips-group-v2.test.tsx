import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { SCROLL_EDGE_PADDING } from '../../../utils/compute-scroll-into-view-x';
import { ChipsGroupItem } from './api';
import { EtChipsGroupV2 } from './et-chips-group-v2';

// Mock etoro-core/hooks
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Mock the localization DI token so `isRTL` genuinely follows the `I18nManager.isRTL`
// toggle used by the `RTL Support` / `Scroll selected chip into view` suites below,
// instead of resolving through the real i18next adapter.
jest.mock('@etoro/common/di/core', () => ({
  etInject: () => ({
    getCurrentDirection: () => (require('react-native').I18nManager.isRTL ? 'rtl' : 'ltr'),
  }),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const { View: MockView } = require('react-native');
  return {
    LinearGradient: ({ children, style }: { children?: React.ReactNode; style?: object }) => (
      <MockView testID="linear-gradient" style={style}>
        {children}
      </MockView>
    ),
  };
});

// Note: react-native-reanimated is mocked globally in jest.setup.ts

// Test data
const mockItems: ChipsGroupItem[] = [
  { id: '1', label: 'Technology' },
  { id: '2', label: 'Finance' },
  { id: '3', label: 'Healthcare' },
  { id: '4', label: 'Energy' },
];

const mockItemsWithIcons: ChipsGroupItem[] = [
  { id: '1', label: 'Favorites', icon: 'heart' as any },
  { id: '2', label: 'Watchlist', icon: 'watched' as any },
];

describe('EtChipsGroupV2', () => {
  describe('Component Structure', () => {
    it('has displayName set', () => {
      // React.memo wraps the component, so we check the inner component
      expect(EtChipsGroupV2.displayName).toBe('EtChipsGroupV2');
    });

    it('is a valid React component (memo wrapped)', () => {
      expect(EtChipsGroupV2).toBeDefined();
      expect(EtChipsGroupV2.$$typeof).toBeDefined();
    });
  });
});

describe('EtChipsGroupV2 Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} testID="chips-group" />);

      expect(getByTestId('chips-group')).toBeTruthy();
    });

    it('renders all items', () => {
      const { getByText } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" />);

      expect(getByText('Technology')).toBeTruthy();
      expect(getByText('Finance')).toBeTruthy();
      expect(getByText('Healthcare')).toBeTruthy();
      expect(getByText('Energy')).toBeTruthy();
    });

    it('renders with testID inheritance for chips', () => {
      const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" testID="test-group" />);

      expect(getByTestId('test-group')).toBeTruthy();
      expect(getByTestId('test-group-chip-1')).toBeTruthy();
      expect(getByTestId('test-group-chip-2')).toBeTruthy();
    });

    it('renders with role "radiogroup" for single selection mode', () => {
      const { UNSAFE_getByProps } = render(<EtChipsGroupV2 items={mockItems} selectionMode="single" value={null} onChange={jest.fn()} />);

      const scrollView = UNSAFE_getByProps({ role: 'radiogroup' });
      expect(scrollView).toBeTruthy();
      expect(scrollView.props.role).toBe('radiogroup');
    });

    it('renders with role "group" for multi selection mode', () => {
      const { UNSAFE_getByProps } = render(<EtChipsGroupV2 items={mockItems} selectionMode="multi" value={[]} onChange={jest.fn()} />);

      const scrollView = UNSAFE_getByProps({ role: 'group' });
      expect(scrollView).toBeTruthy();
      expect(scrollView.props.role).toBe('group');
    });

    it('renders with accessibility label', () => {
      const { getByLabelText } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" accessibilityLabel="Category filters" />);

      expect(getByLabelText('Category filters')).toBeTruthy();
    });
  });

  describe('Layout Modes', () => {
    it('renders in scroll layout by default', () => {
      const { UNSAFE_getByType } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" />);

      // ScrollView should be present
      const ScrollView = require('react-native').ScrollView;
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });

    it('renders in wrap layout when specified', () => {
      const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="wrap" testID="wrap-group" />);

      expect(getByTestId('wrap-group')).toBeTruthy();
      // In wrap mode, there should be no ScrollView wrapping
    });
  });
});

describe('Selection Modes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Non-selectable Mode (none)', () => {
    it('chips are not interactive when selectionMode is none', () => {
      const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" testID="test-group" />);

      // Should not throw when pressing
      const chip = getByTestId('test-group-chip-1');
      fireEvent.press(chip);

      // Chip should remain in non-selected state
      expect(chip.props.accessibilityState?.selected).toBe(false);
    });

    it('chips render as non-selected in none mode', () => {
      const { getAllByRole } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" />);

      const chips = getAllByRole('button');
      chips.forEach((chip) => {
        expect(chip.props.accessibilityState?.selected).toBe(false);
      });
    });
  });

  describe('Single Selection Mode', () => {
    it('calls onChange with chip id when pressed', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = render(
        <EtChipsGroupV2 items={mockItems} selectionMode="single" value={null} onChange={mockOnChange} testID="test-group" />,
      );

      fireEvent.press(getByTestId('test-group-chip-1'));
      expect(mockOnChange).toHaveBeenCalledWith('1');
    });

    it('calls onChange with null when selected chip is pressed again', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = render(
        <EtChipsGroupV2 items={mockItems} selectionMode="single" value="1" onChange={mockOnChange} testID="test-group" />,
      );

      fireEvent.press(getByTestId('test-group-chip-1'));
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('marks selected chip correctly', () => {
      const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="single" value="2" onChange={jest.fn()} testID="test-group" />);

      const selectedChip = getByTestId('test-group-chip-2');
      expect(selectedChip.props.accessibilityState?.selected).toBe(true);

      const unselectedChip = getByTestId('test-group-chip-1');
      expect(unselectedChip.props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('Multi Selection Mode', () => {
    it('calls onChange with added id when unselected chip is pressed', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = render(
        <EtChipsGroupV2 items={mockItems} selectionMode="multi" value={['1']} onChange={mockOnChange} testID="test-group" />,
      );

      fireEvent.press(getByTestId('test-group-chip-2'));
      expect(mockOnChange).toHaveBeenCalledWith(['1', '2']);
    });

    it('calls onChange with removed id when selected chip is pressed', () => {
      const mockOnChange = jest.fn();
      const { getByTestId } = render(
        <EtChipsGroupV2 items={mockItems} selectionMode="multi" value={['1', '2']} onChange={mockOnChange} testID="test-group" />,
      );

      fireEvent.press(getByTestId('test-group-chip-1'));
      expect(mockOnChange).toHaveBeenCalledWith(['2']);
    });

    it('marks multiple selected chips correctly', () => {
      const { getByTestId } = render(
        <EtChipsGroupV2 items={mockItems} selectionMode="multi" value={['1', '3']} onChange={jest.fn()} testID="test-group" />,
      );

      expect(getByTestId('test-group-chip-1').props.accessibilityState?.selected).toBe(true);
      expect(getByTestId('test-group-chip-2').props.accessibilityState?.selected).toBe(false);
      expect(getByTestId('test-group-chip-3').props.accessibilityState?.selected).toBe(true);
    });
  });
});

describe('Haptic Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers haptic feedback by default on selection', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="single" value={null} onChange={jest.fn()} testID="test-group" />);

    fireEvent.press(getByTestId('test-group-chip-1'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('does not trigger haptic feedback when haptics is false', () => {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync.mockClear();

    const { getByTestId } = render(
      <EtChipsGroupV2 items={mockItems} selectionMode="single" value={null} onChange={jest.fn()} haptics={false} testID="test-group" />,
    );

    fireEvent.press(getByTestId('test-group-chip-1'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});

describe('Scroll Fade Overlays', () => {
  it('renders fade overlays in scroll layout', () => {
    const { queryAllByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" />);

    // LinearGradient mocks should be present
    const gradients = queryAllByTestId('linear-gradient');
    expect(gradients.length).toBeGreaterThan(0);
  });

  it('does not render fade overlays in wrap layout', () => {
    const { queryAllByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="wrap" />);

    const gradients = queryAllByTestId('linear-gradient');
    expect(gradients.length).toBe(0);
  });
});

describe('Edge Cases', () => {
  it('handles empty items array', () => {
    const { getByTestId } = render(<EtChipsGroupV2 items={[]} selectionMode="none" testID="empty-group" />);

    expect(getByTestId('empty-group')).toBeTruthy();
  });

  it('handles single item', () => {
    const { getByText } = render(<EtChipsGroupV2 items={[{ id: '1', label: 'Single' }]} selectionMode="none" />);

    expect(getByText('Single')).toBeTruthy();
  });

  it('handles items with icons', () => {
    const { getByText } = render(<EtChipsGroupV2 items={mockItemsWithIcons} selectionMode="none" />);

    expect(getByText('Favorites')).toBeTruthy();
    expect(getByText('Watchlist')).toBeTruthy();
  });

  it('handles rapid selection changes', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="multi" value={[]} onChange={mockOnChange} testID="test-group" />);

    // Rapid fire selections
    fireEvent.press(getByTestId('test-group-chip-1'));
    fireEvent.press(getByTestId('test-group-chip-2'));
    fireEvent.press(getByTestId('test-group-chip-3'));

    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });

  it('handles style props', () => {
    const customStyle = { marginTop: 10 };
    const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" style={customStyle} testID="styled-group" />);

    expect(getByTestId('styled-group')).toBeTruthy();
  });

  it('handles contentContainerStyle props', () => {
    const customContentStyle = { paddingHorizontal: 16 };
    const { getByTestId } = render(
      <EtChipsGroupV2 items={mockItems} selectionMode="none" contentContainerStyle={customContentStyle} testID="styled-content-group" />,
    );

    expect(getByTestId('styled-content-group')).toBeTruthy();
  });

  it('handles custom gap prop', () => {
    const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" gap={16} testID="gap-group" />);

    expect(getByTestId('gap-group')).toBeTruthy();
  });
});

describe('Scroll Fade Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Note: With SharedValue-based animations, visibility state is driven by opacity
  // values on the UI thread. These tests verify the scroll handlers work correctly
  // and don't throw errors. Visual fade behavior is best tested with visual regression.

  it('handles initial content overflow without errors', () => {
    const { getByTestId, UNSAFE_getByType } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="scroll-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    // Simulate content overflow - should not throw
    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Verify fade overlays are rendered
    expect(getByTestId('scroll-group-fade-start')).toBeTruthy();
    expect(getByTestId('scroll-group-fade-end')).toBeTruthy();
  });

  it('handles scroll to middle without errors', () => {
    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="scroll-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Scroll to middle - should not throw
    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 250, y: 0 },
          contentSize: { width: 1000, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    // Verify fade overlays are still rendered
    expect(getByTestId('scroll-group-fade-start')).toBeTruthy();
    expect(getByTestId('scroll-group-fade-end')).toBeTruthy();
  });

  it('handles scroll to start without errors', () => {
    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="scroll-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Scroll to start - should not throw
    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 0, y: 0 },
          contentSize: { width: 1000, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    expect(getByTestId('scroll-group-fade-start')).toBeTruthy();
    expect(getByTestId('scroll-group-fade-end')).toBeTruthy();
  });

  it('handles scroll to end without errors', () => {
    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="scroll-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Scroll to end - should not throw
    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 500, y: 0 },
          contentSize: { width: 1000, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    expect(getByTestId('scroll-group-fade-start')).toBeTruthy();
    expect(getByTestId('scroll-group-fade-end')).toBeTruthy();
  });

  it('handles content that does not overflow without errors', () => {
    const { UNSAFE_getByType, getByTestId } = render(
      <EtChipsGroupV2 items={mockItems.slice(0, 2)} selectionMode="none" layout="scroll" testID="scroll-group" />,
    );

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    // No overflow scenario - should not throw
    act(() => {
      scrollView.props.onContentSizeChange(300, 50);
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 0, y: 0 },
          contentSize: { width: 300, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    expect(getByTestId('scroll-group-fade-start')).toBeTruthy();
    expect(getByTestId('scroll-group-fade-end')).toBeTruthy();
  });

  it('handles layout changes without errors', () => {
    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="scroll-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    // Initial overflow state
    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Layout change - should not throw
    act(() => {
      container.props.onLayout({
        nativeEvent: { layout: { width: 1100, height: 50 } },
      });
    });

    expect(getByTestId('scroll-group-fade-start')).toBeTruthy();
    expect(getByTestId('scroll-group-fade-end')).toBeTruthy();
  });
});

describe('Horizontal scroll position persistence (PE-954)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies initialScrollOffsetX as the scroll view contentOffset in scroll layout', () => {
    const { UNSAFE_getByType } = render(
      <EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" initialScrollOffsetX={120} testID="restore-group" />,
    );

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);

    expect(scrollView.props.contentOffset).toEqual({ x: 120, y: 0 });
  });

  it('does not set contentOffset when initialScrollOffsetX is omitted', () => {
    const { UNSAFE_getByType } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);

    expect(scrollView.props.contentOffset).toBeUndefined();
  });

  it('applies an explicit zero initialScrollOffsetX rather than treating it as absent', () => {
    // Zero is a position a host can legitimately capture, and in RTL it is not
    // where the rail would rest on its own — dropping it would move the rail.
    const { UNSAFE_getByType } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" initialScrollOffsetX={0} />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);

    expect(scrollView.props.contentOffset).toEqual({ x: 0, y: 0 });
  });

  it('reports the live horizontal offset via onScrollOffsetXChange while scrolling', () => {
    const onScrollOffsetXChange = jest.fn();
    const { UNSAFE_getByType, getByTestId } = render(
      <EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="scroll-group" onScrollOffsetXChange={onScrollOffsetXChange} />,
    );

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('scroll-group');

    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
      container.props.onLayout({ nativeEvent: { layout: { width: 500, height: 50 } } });
    });

    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 250, y: 0 },
          contentSize: { width: 1000, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    expect(onScrollOffsetXChange).toHaveBeenCalledWith(250);
  });
});

describe('Scroll selected chip into view', () => {
  const VIEWPORT_WIDTH = 300;

  /**
   * Lays the rail out at {@link VIEWPORT_WIDTH} and reports a measurement for
   * every chip, returning a spy standing in for the ScrollView's `scrollTo`.
   * Chip 4 lands beyond the viewport, so it is the off-screen case.
   */
  const renderRail = (props: { value: string | null; scrollSelectedIntoView?: boolean; initialScrollOffsetX?: number }) => {
    const utils = render(
      <EtChipsGroupV2
        items={mockItems}
        selectionMode="single"
        layout="scroll"
        onChange={jest.fn()}
        testID="rail"
        value={props.value}
        scrollSelectedIntoView={props.scrollSelectedIntoView}
        initialScrollOffsetX={props.initialScrollOffsetX}
      />,
    );

    const ScrollView = require('react-native').ScrollView;
    const scrollView = utils.UNSAFE_getByType(ScrollView);
    const scrollTo = jest.fn();
    // Fail loudly rather than leaving the spy unwired — an unwired spy would make
    // every "did not scroll" assertion below trivially true.
    expect(scrollView.instance).toBeTruthy();
    scrollView.instance.scrollTo = scrollTo;

    const container = utils.getByTestId('rail');

    act(() => {
      container.props.onLayout({ nativeEvent: { layout: { width: VIEWPORT_WIDTH, height: 40 } } });
    });

    return { ...utils, scrollTo, container };
  };

  /**
   * Chip index → x within the content; each chip is 100 wide.
   *
   * `expectedMeasured` is asserted rather than assumed: the rail only wraps chips
   * in a measuring `View` when it tracks the selection, so a silent zero would
   * otherwise let the opt-out tests below pass without exercising anything.
   */
  const layoutChips = (utils: ReturnType<typeof renderRail>, expectedMeasured: number) => {
    const wrappers = utils.UNSAFE_getAllByType(require('react-native').View).filter((node: any) => typeof node.props.onLayout === 'function');

    let measured = 0;
    mockItems.forEach((item, index) => {
      const wrapper = wrappers.find((node: any) => node.props.children?.key === item.id);
      if (!wrapper) return;
      measured += 1;
      act(() => {
        wrapper.props.onLayout({ nativeEvent: { layout: { x: index * 110, y: 0, width: 100, height: 40 } } });
      });
    });

    expect(measured).toBe(expectedMeasured);
  };

  it('scrolls an off-screen selected chip into view', () => {
    // Chip 4 spans 330-430, past the 300 viewport.
    const utils = renderRail({ value: '4', scrollSelectedIntoView: true });
    layoutChips(utils, mockItems.length);

    // Un-animated: this scroll is part of revealing the rail, not a reaction to
    // anything the user did.
    expect(utils.scrollTo).toHaveBeenCalledWith({ x: 430 - VIEWPORT_WIDTH + SCROLL_EDGE_PADDING, animated: false });
  });

  it('leaves the rail alone when the selected chip is already visible', () => {
    // Chip 1 spans 0-100, comfortably inside the viewport.
    const utils = renderRail({ value: '1', scrollSelectedIntoView: true });
    layoutChips(utils, mockItems.length);

    expect(utils.scrollTo).not.toHaveBeenCalled();
  });

  it('animates a later selection even when the first one needed no scroll', () => {
    // Chip 1 (0-100) is visible on mount, so the reveal passes without scrolling.
    // Selecting chip 4 afterwards is a user action and must animate — the silent
    // first jump belongs to the reveal, not to whichever selection scrolls first.
    const utils = renderRail({ value: '1', scrollSelectedIntoView: true });
    layoutChips(utils, mockItems.length);

    act(() => {
      utils.rerender(
        <EtChipsGroupV2
          items={mockItems}
          selectionMode="single"
          layout="scroll"
          onChange={jest.fn()}
          testID="rail"
          value="4"
          scrollSelectedIntoView
        />,
      );
    });

    expect(utils.scrollTo).toHaveBeenCalledWith({ x: 430 - VIEWPORT_WIDTH + SCROLL_EDGE_PADDING, animated: true });
  });

  it('measures against a restored offset instead of assuming the rail starts at zero', () => {
    // Mounting with `contentOffset` suppresses the first `onScroll`, so the
    // restored position is only known from the prop. At 200 the viewport spans
    // 200-500 and chip 4 (330-430) is already visible; reading 0 instead would
    // scroll the rail away from where the host restored it.
    const utils = renderRail({ value: '4', scrollSelectedIntoView: true, initialScrollOffsetX: 200 });
    layoutChips(utils, mockItems.length);

    expect(utils.scrollTo).not.toHaveBeenCalled();
  });

  it('does not measure or scroll when the caller has not opted in', () => {
    const utils = renderRail({ value: '4' });

    // Zero measurable wrappers is the assertion, not an accident: opting out must
    // leave the chip tree unwrapped, which is what makes `scrollTo` unreachable.
    layoutChips(utils, 0);

    expect(utils.scrollTo).not.toHaveBeenCalled();
  });

  describe('in RTL, before any real scroll event', () => {
    const originalIsRTL = require('react-native').I18nManager.isRTL;

    beforeEach(() => {
      require('react-native').I18nManager.isRTL = true;
    });

    afterEach(() => {
      require('react-native').I18nManager.isRTL = originalIsRTL;
    });

    it('reveals a chip that sits outside the native right-anchored resting window', () => {
      const utils = renderRail({ value: '1', scrollSelectedIntoView: true });

      const ScrollView = require('react-native').ScrollView;
      const scrollView = utils.UNSAFE_getByType(ScrollView);
      // A fresh RTL rail natively rests at its right edge (contentWidth - viewportWidth = 430
      // - 300 = 130), not at 0 — no `onScroll` ever fires to say so. Chip 1 (0-100) is outside
      // that [130, 430) window, so without the RTL-aware fallback this would wrongly be judged
      // already visible (against an assumed offset of 0) and never scroll.
      act(() => {
        scrollView.props.onContentSizeChange(430, 40);
      });

      layoutChips(utils, mockItems.length);

      expect(utils.scrollTo).toHaveBeenCalledWith({ x: 0, animated: false });
    });

    it('honors a restored offset of zero instead of assuming the native right-anchored rest', () => {
      // Same rail as above, except the host restored the offset to 0. Chip 1
      // (0-100) is then inside the [0, 300) viewport and needs no scroll —
      // reading the RTL resting position of 130 instead would scroll the rail
      // away from where the host put it.
      const utils = renderRail({ value: '1', scrollSelectedIntoView: true, initialScrollOffsetX: 0 });

      const ScrollView = require('react-native').ScrollView;
      const scrollView = utils.UNSAFE_getByType(ScrollView);
      act(() => {
        scrollView.props.onContentSizeChange(430, 40);
      });

      layoutChips(utils, mockItems.length);

      expect(utils.scrollTo).not.toHaveBeenCalled();
    });
  });
});

describe('Selection Mode Edge Cases', () => {
  it('handles selection in none mode gracefully', () => {
    const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" testID="test-group" />);

    // Pressing chip in none mode should not cause errors
    const chip = getByTestId('test-group-chip-1');
    fireEvent.press(chip);

    // Should not crash
    expect(chip).toBeTruthy();
  });

  it('handles multi-select with empty initial value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="multi" value={[]} onChange={mockOnChange} testID="test-group" />);

    fireEvent.press(getByTestId('test-group-chip-1'));
    expect(mockOnChange).toHaveBeenCalledWith(['1']);
  });

  it('handles single-select with null initial value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <EtChipsGroupV2 items={mockItems} selectionMode="single" value={null} onChange={mockOnChange} testID="test-group" />,
    );

    fireEvent.press(getByTestId('test-group-chip-1'));
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('handles removing last item in multi-select', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <EtChipsGroupV2 items={mockItems} selectionMode="multi" value={['1']} onChange={mockOnChange} testID="test-group" />,
    );

    // Remove the only selected item
    fireEvent.press(getByTestId('test-group-chip-1'));
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});

describe('RTL Support', () => {
  const originalIsRTL = require('react-native').I18nManager.isRTL;

  afterEach(() => {
    // Restore original RTL setting
    require('react-native').I18nManager.isRTL = originalIsRTL;
  });

  it('handles RTL mode in scroll fade overlay - start position', () => {
    // Enable RTL mode
    require('react-native').I18nManager.isRTL = true;

    const { queryAllByTestId, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="rtl-group" />);

    const container = getByTestId('rtl-group');

    // Simulate layout for overlay rendering - wrap in act
    act(() => {
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Check that overlays are rendered
    const gradients = queryAllByTestId('linear-gradient');
    expect(gradients.length).toBeGreaterThan(0);
  });

  it('handles RTL mode in scroll fade overlay - end position', () => {
    // Enable RTL mode
    require('react-native').I18nManager.isRTL = true;

    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="rtl-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('rtl-group');

    // Setup container and content - wrap in act
    act(() => {
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
      scrollView.props.onContentSizeChange(1000, 50);
    });

    // Simulate scrolling in RTL mode - wrap in act
    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 250, y: 0 },
          contentSize: { width: 1000, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    expect(scrollView).toBeTruthy();
  });

  it('handles RTL scrolling at end position', () => {
    // Enable RTL mode
    require('react-native').I18nManager.isRTL = true;

    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="rtl-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('rtl-group');

    // Setup - wrap in act
    act(() => {
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
      scrollView.props.onContentSizeChange(1000, 50);
    });

    // Simulate scrolling to end in RTL (x = 0 is at end in RTL) - wrap in act
    act(() => {
      scrollView.props.onScroll({
        nativeEvent: {
          contentOffset: { x: 0, y: 0 },
          contentSize: { width: 1000, height: 50 },
          layoutMeasurement: { width: 500, height: 50 },
        },
      });
    });

    expect(scrollView).toBeTruthy();
  });
});

describe('Content Size Edge Cases', () => {
  it('handles content size change with no overflow and no layout yet', () => {
    const { UNSAFE_getByType } = render(<EtChipsGroupV2 items={mockItems.slice(0, 1)} selectionMode="none" layout="scroll" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);

    // Content size change before layout (layoutWidth is still 0) - wrap in act
    act(() => {
      scrollView.props.onContentSizeChange(300, 50);
    });

    expect(scrollView).toBeTruthy();
  });

  it('handles content size change with overflow then layout', () => {
    const { UNSAFE_getByType, getByTestId } = render(<EtChipsGroupV2 items={mockItems} selectionMode="none" layout="scroll" testID="size-group" />);

    const ScrollView = require('react-native').ScrollView;
    const scrollView = UNSAFE_getByType(ScrollView);
    const container = getByTestId('size-group');

    // First set layout - wrap in act
    act(() => {
      container.props.onLayout({
        nativeEvent: { layout: { width: 500, height: 50 } },
      });
    });

    // Then content size with overflow - wrap in act
    act(() => {
      scrollView.props.onContentSizeChange(1000, 50);
    });

    expect(scrollView).toBeTruthy();
  });
});
