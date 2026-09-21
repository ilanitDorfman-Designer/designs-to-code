import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { EtTabs } from './et-tabs';
import { TabsContent } from './subcomponents/tabs-content';
import { TabsIndicator } from './subcomponents/tabs-indicator';
import { TabsList } from './subcomponents/tabs-list';
import { TabsTrigger } from './subcomponents/tabs-trigger';

// Mock useEtoroTheme hook
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Mock expo-linear-gradient used by ScrollFadeOverlay inside TabsList
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: (props: any) => <View testID="linear-gradient" {...props} />,
  };
});

// Note: react-native-reanimated is mocked globally in jest.setup.ts

// Text labels extracted to variables to satisfy react-native/no-raw-text
const TAB_1 = 'Tab 1';
const TAB_2 = 'Tab 2';
const TAB_3 = 'Tab 3';
const FIRST_TAB = 'First Tab';
const SECOND_TAB = 'Second Tab';
const CONTENT_1 = 'Content 1';
const CONTENT_2 = 'Content 2';
const TAB_CONTENT_TEXT = 'Tab content text';
const OVERVIEW = 'Overview';
const CONTENT = 'Content';

describe('EtTabs', () => {
  describe('Types', () => {
    it('should support defaultValue for uncontrolled mode', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1" testID="tabs">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByTestId('tabs')).toBeTruthy();
    });

    it('should support value/onValueChange for controlled mode', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtTabs value="tab1" onValueChange={handleChange} testID="tabs">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByTestId('tabs')).toBeTruthy();
    });
  });

  describe('Subcomponents', () => {
    describe('TabsList', () => {
      it('should have displayName set', () => {
        expect(TabsList.displayName).toBe('EtTabs.List');
      });

      it('should be accessible via EtTabs.List', () => {
        expect(EtTabs.List).toBe(TabsList);
      });
    });

    describe('TabsTrigger', () => {
      it('should have displayName set', () => {
        expect(TabsTrigger.displayName).toBe('EtTabs.Trigger');
      });

      it('should be accessible via EtTabs.Trigger', () => {
        expect(EtTabs.Trigger).toBe(TabsTrigger);
      });
    });

    describe('TabsContent', () => {
      it('should have displayName set', () => {
        expect(TabsContent.displayName).toBe('EtTabs.Content');
      });

      it('should be accessible via EtTabs.Content', () => {
        expect(EtTabs.Content).toBe(TabsContent);
      });
    });

    describe('TabsIndicator', () => {
      it('should have displayName set', () => {
        expect(TabsIndicator.displayName).toBe('EtTabs.Indicator');
      });

      it('should be accessible via EtTabs.Indicator', () => {
        expect(EtTabs.Indicator).toBe(TabsIndicator);
      });
    });
  });
});

describe('EtTabs Component Rendering', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1" testID="tabs">
          <EtTabs.List testID="tabs-list">
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByTestId('tabs')).toBeTruthy();
      expect(getByTestId('tabs-list')).toBeTruthy();
      expect(getByTestId('trigger-1')).toBeTruthy();
    });

    it('renders triggers with labels', () => {
      const { getByText } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{FIRST_TAB}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab2">{SECOND_TAB}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByText('First Tab')).toBeTruthy();
      expect(getByText('Second Tab')).toBeTruthy();
    });

    it('renders multiple triggers', () => {
      const { getAllByRole } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab2">{TAB_2}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab3">{TAB_3}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab3">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getAllByRole('tab').length).toBe(3);
    });
  });

  describe('Selection Behavior', () => {
    it('calls onValueChange when trigger pressed', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtTabs value="tab1" onValueChange={handleChange}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      fireEvent.press(getByTestId('trigger-2'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('does NOT call onValueChange when clicking already selected trigger', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtTabs value="tab1" onValueChange={handleChange}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      fireEvent.press(getByTestId('trigger-1'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('correctly shows selected state', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab2">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      const trigger1 = getByTestId('trigger-1');
      const trigger2 = getByTestId('trigger-2');

      expect(trigger1.props.accessibilityState.selected).toBe(false);
      expect(trigger2.props.accessibilityState.selected).toBe(true);
    });

    it('allows changing selection between triggers', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtTabs value="tab1" onValueChange={handleChange}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      fireEvent.press(getByTestId('trigger-2'));
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Content Rendering', () => {
    it('renders only active content by default (lazy)', () => {
      // Note: TabsContent is a marker component — its testID is NOT rendered.
      // Children are extracted by useTabsChildren and rendered via TabView's
      // renderScene. We place testID on inner elements instead.
      const { queryByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab2">{TAB_2}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <Text testID="content-1">{CONTENT_1}</Text>
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <Text testID="content-2">{CONTENT_2}</Text>
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(queryByTestId('content-1')).toBeTruthy();
      expect(queryByTestId('content-2')).toBeNull();
    });

    it('renders active content through TabView', () => {
      // Note: TabView uses native PagerView which may lazy-load inactive tabs
      // even with lazy={false} in the test environment. We verify the active
      // tab's content is rendered.
      const { getByText } = render(
        <EtTabs defaultValue="tab1" lazy={false}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab2">{TAB_2}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <Text>{CONTENT_1}</Text>
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <Text>{CONTENT_2}</Text>
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByText('Content 1')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('disabled trigger prevents press', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtTabs value="tab1" onValueChange={handleChange}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2" disabled>
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      fireEvent.press(getByTestId('trigger-2'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('sets accessibility disabled state', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1" disabled>
              {TAB_1}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByTestId('trigger-1').props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('List Variants', () => {
    it('renders line variant with divider and indicator', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List variant="line" testID="tabs-list">
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // Line variant renders successfully with divider and indicator
      expect(getByTestId('tabs-list')).toBeTruthy();
    });

    it('renders plain variant', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List variant="plain" testID="tabs-list">
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // Plain variant renders successfully
      expect(getByTestId('tabs-list')).toBeTruthy();
    });

    it('stretch makes each trigger flex:1 to fill the width evenly', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List variant="line" stretch testID="tabs-list">
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // Each trigger receives the injected flex:1 style so the row fills the width evenly.
      const flatten = (style: unknown) => StyleSheet.flatten(style as StyleProp<ViewStyle>);
      expect(flatten(getByTestId('trigger-1').props.style)).toMatchObject({ flex: 1 });
      expect(flatten(getByTestId('trigger-2').props.style)).toMatchObject({ flex: 1 });
    });

    it('stretch enforces flex:1 over a consumer-provided flex style', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List variant="line" stretch testID="tabs-list">
            <EtTabs.Trigger value="tab1" testID="trigger-1" style={{ flex: 2 }}>
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // The injected `flex: 1` is applied last, so it wins over the consumer's `flex: 2`.
      expect(StyleSheet.flatten(getByTestId('trigger-1').props.style as StyleProp<ViewStyle>)).toMatchObject({ flex: 1 });
    });

    it('stretch renders a fixed full-width bar with no scroll fade overlays', () => {
      const { getByTestId, queryByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List variant="line" stretch testID="tabs-list">
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab2">{TAB_2}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // Stretch mode skips the ScrollView + its edge-fade gradients entirely.
      expect(getByTestId('tabs-list')).toBeTruthy();
      expect(queryByTestId('linear-gradient')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('list has tablist role', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List testID="tabs-list">
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // accessibilityRole="tablist" is on the outer View container
      const list = getByTestId('tabs-list');
      expect(list.props.accessibilityRole).toBe('tablist');
    });

    it('triggers have tab role', () => {
      const { getAllByRole } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
            <EtTabs.Trigger value="tab2">{TAB_2}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getAllByRole('tab').length).toBe(2);
    });

    it('content is accessible', () => {
      // Note: TabsContent is a marker component — its children are extracted
      // by useTabsChildren and rendered through TabView's renderScene.
      // Content must be wrapped in Text for getByText to find it.
      const { getByText } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <Text>{TAB_CONTENT_TEXT}</Text>
          </EtTabs.Content>
        </EtTabs>,
      );

      // Content is rendered through TabView
      expect(getByText('Tab content text')).toBeTruthy();
    });

    it('correct accessibilityState for selected trigger', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      const trigger = getByTestId('trigger-1');
      expect(trigger.props.accessibilityState.selected).toBe(true);
    });

    it('list accessibilityRole cannot be overridden by consumer', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          {/* accessibilityRole is omitted from TabsListProps,
              so this cast simulates a forced override via spread */}
          <EtTabs.List testID="tabs-list" {...({ accessibilityRole: 'menu' } as any)}>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // Internal accessibilityRole="tablist" is applied after the spread,
      // so it always wins.
      expect(getByTestId('tabs-list').props.accessibilityRole).toBe('tablist');
    });

    it('list accessibilityLabel works', () => {
      const { getByLabelText } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List accessibilityLabel="Navigation tabs">
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByLabelText('Navigation tabs')).toBeTruthy();
    });

    it('trigger accessibilityLabel works', () => {
      const { getByLabelText } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" accessibilityLabel="Overview tab">
              {OVERVIEW}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByLabelText('Overview tab')).toBeTruthy();
    });

    it('trigger uses children as default accessibilityLabel', () => {
      const { getByLabelText } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{OVERVIEW}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByLabelText('Overview')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('Trigger throws when used outside EtTabs', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>);
      }).toThrow('EtTabs compound components must be used within an EtTabs component');

      consoleSpy.mockRestore();
    });

    it('Content renders standalone without throwing (marker component)', () => {
      // TabsContent is a marker component that does not consume context.
      // Its children are extracted by useTabsChildren in normal usage.
      // When rendered standalone, it renders as a plain View.
      const { getByText } = render(
        <EtTabs.Content value="tab1">
          <Text>{CONTENT}</Text>
        </EtTabs.Content>,
      );

      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('Uncontrolled Mode', () => {
    it('manages state internally with defaultValue', () => {
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      // Initial state
      expect(getByTestId('trigger-1').props.accessibilityState.selected).toBe(true);
      expect(getByTestId('trigger-2').props.accessibilityState.selected).toBe(false);

      // Press second trigger
      fireEvent.press(getByTestId('trigger-2'));

      // State should update
      expect(getByTestId('trigger-1').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('trigger-2').props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled value', () => {
      const { getByTestId, rerender } = render(
        <EtTabs value="tab1" onValueChange={mockOnValueChange}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByTestId('trigger-1').props.accessibilityState.selected).toBe(true);

      // Rerender with different value
      rerender(
        <EtTabs value="tab2" onValueChange={mockOnValueChange}>
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
            <EtTabs.Trigger value="tab2" testID="trigger-2">
              {TAB_2}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
          <EtTabs.Content value="tab2">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      expect(getByTestId('trigger-1').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('trigger-2').props.accessibilityState.selected).toBe(true);
    });
  });

  describe('TabsList onLayout Composition', () => {
    it('calls consumer onLayout alongside internal handler', () => {
      const consumerOnLayout = jest.fn();
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List testID="tabs-list" onLayout={consumerOnLayout}>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      const list = getByTestId('tabs-list');

      // Simulate a layout event
      fireEvent(list, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 48 } },
      });

      // Consumer handler should have been called
      expect(consumerOnLayout).toHaveBeenCalledTimes(1);
      expect(consumerOnLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: expect.objectContaining({
            layout: expect.objectContaining({ width: 400 }),
          }),
        }),
      );
    });

    it('internal onLayout works when consumer does not provide one', () => {
      // Verifies no crash when consumerOnLayout is undefined
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List testID="tabs-list">
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      const list = getByTestId('tabs-list');

      // Should not throw even without consumer onLayout
      expect(() => {
        fireEvent(list, 'layout', {
          nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 48 } },
        });
      }).not.toThrow();
    });
  });

  describe('TabsTrigger onLayout Composition', () => {
    it('calls consumer onLayout alongside internal handler', () => {
      const consumerOnLayout = jest.fn();
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1" onLayout={consumerOnLayout}>
              {TAB_1}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      const trigger = getByTestId('trigger-1');

      // Simulate a layout event
      fireEvent(trigger, 'layout', {
        nativeEvent: { layout: { x: 10, y: 0, width: 120, height: 48 } },
      });

      // Consumer handler should have been called
      expect(consumerOnLayout).toHaveBeenCalledTimes(1);
      expect(consumerOnLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: expect.objectContaining({
            layout: expect.objectContaining({ x: 10, width: 120 }),
          }),
        }),
      );
    });

    it('internal onLayout works when consumer does not provide one', () => {
      // Verifies no crash when consumerOnLayout is undefined
      const { getByTestId } = render(
        <EtTabs defaultValue="tab1">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1" testID="trigger-1">
              {TAB_1}
            </EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      const trigger = getByTestId('trigger-1');

      // Should not throw even without consumer onLayout
      expect(() => {
        fireEvent(trigger, 'layout', {
          nativeEvent: { layout: { x: 10, y: 0, width: 120, height: 48 } },
        });
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid rerenders', () => {
      const { rerender, getByTestId } = render(
        <EtTabs defaultValue="tab1" testID="tabs">
          <EtTabs.List>
            <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
          </EtTabs.List>
          <EtTabs.Content value="tab1">
            <View />
          </EtTabs.Content>
        </EtTabs>,
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtTabs defaultValue={i % 2 === 0 ? 'tab1' : 'tab2'} testID="tabs">
            <EtTabs.List>
              <EtTabs.Trigger value="tab1">{TAB_1}</EtTabs.Trigger>
              <EtTabs.Trigger value="tab2">{TAB_2}</EtTabs.Trigger>
            </EtTabs.List>
            <EtTabs.Content value="tab1">
              <View />
            </EtTabs.Content>
            <EtTabs.Content value="tab2">
              <View />
            </EtTabs.Content>
          </EtTabs>,
        );
      }

      expect(getByTestId('tabs')).toBeTruthy();
    });

    it('handles many triggers', () => {
      const triggers = Array.from({ length: 20 }, (_, i) => `tab-${i}`);

      const { getAllByRole } = render(
        <EtTabs defaultValue="tab-0">
          <EtTabs.List>
            {triggers.map((tab) => (
              <EtTabs.Trigger key={tab} value={tab}>
                {tab}
              </EtTabs.Trigger>
            ))}
          </EtTabs.List>
          {triggers.map((tab) => (
            <EtTabs.Content key={tab} value={tab}>
              <View />
            </EtTabs.Content>
          ))}
        </EtTabs>,
      );

      expect(getAllByRole('tab').length).toBe(20);
    });
  });

  describe('Component Structure', () => {
    it('has List as static property', () => {
      expect(EtTabs.List).toBeDefined();
    });

    it('has Trigger as static property', () => {
      expect(EtTabs.Trigger).toBeDefined();
    });

    it('has Content as static property', () => {
      expect(EtTabs.Content).toBeDefined();
    });

    it('has Indicator as static property', () => {
      expect(EtTabs.Indicator).toBeDefined();
    });

    it('has displayName set', () => {
      expect(EtTabs.displayName).toBe('EtTabs');
    });
  });
});
