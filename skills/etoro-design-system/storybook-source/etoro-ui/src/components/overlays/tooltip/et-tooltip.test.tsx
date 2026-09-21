import { fireEvent, render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { Text } from 'react-native';

import type { EtTooltipRef } from './api/types';
import { EtTooltip } from './et-tooltip';

jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ dark: false }),
  DefaultTheme: {
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      notification: '#FF3B30',
    },
  },
  DarkTheme: {
    colors: {
      primary: '#0A84FF',
      background: '#000000',
      card: '#1C1C1E',
      text: '#FFFFFF',
      border: '#38383A',
      notification: '#FF453A',
    },
  },
}));

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#1A1A1A',
      textSecondaryNeutral: '#666666',
      bgNeutralPrimary: '#FFFFFF',
    },
  }),
  useReducedMotion: () => false,
}));

jest.mock('../../topbar', () => {
  const React = require('react');
  const RN = require('react-native');

  function MockTopbar({ children }: any) {
    return React.createElement(RN.View, { testID: 'et-topbar' }, children);
  }

  MockTopbar.Start = function MockStart({ children }: any) {
    return React.createElement(RN.View, { testID: 'et-topbar-start' }, children);
  };

  MockTopbar.Middle = function MockMiddle({ children }: any) {
    return React.createElement(RN.View, null, children);
  };

  MockTopbar.End = function MockEnd({ children }: any) {
    return React.createElement(RN.View, { testID: 'et-topbar-end' }, children);
  };

  MockTopbar.Action = function MockAction({ children, onPress, testID, accessibilityLabel }: any) {
    return React.createElement(RN.Pressable, { onPress, testID, accessibilityLabel, accessibilityRole: 'button' }, children);
  };

  MockTopbar.Title = function MockTitle({ children }: any) {
    return React.createElement(RN.Text, null, children);
  };

  return { EtTopbar: MockTopbar };
});

jest.mock('../../../foundations/icon-assets/et-icon', () => {
  const React = require('react');
  const RN = require('react-native');

  return {
    EtoroIcon: function MockEtoroIcon({ icon }: any) {
      return React.createElement(RN.View, {
        testID: `icon-${icon?.iconName ?? 'unknown'}`,
      });
    },
  };
});

jest.mock('../bottom-sheet-v2', () => {
  const React = require('react');
  const RN = require('react-native');

  function MockBottomSheet({ children, testID, accessibilityLabel, bottomSheetRef, onClose }: any) {
    React.useEffect(() => {
      if (bottomSheetRef) {
        // eslint-disable-next-line react-compiler/react-compiler -- test mock: must assign imperative handle to prop ref
        bottomSheetRef.current = {
          present: jest.fn(),
          dismiss: () => onClose?.(),
        };
      }
    }, [bottomSheetRef, onClose]);
    return React.createElement(RN.View, { testID, accessibilityLabel }, children);
  }

  MockBottomSheet.Header = Object.assign(
    function MockHeader({ children }: any) {
      const MockedView = require('react-native').View;
      return <MockedView testID="bottom-sheet-header">{children}</MockedView>;
    },
    {
      Title: function MockTitle({ children }: any) {
        const MockedText = require('react-native').Text;
        return <MockedText testID="bottom-sheet-header-title">{children}</MockedText>;
      },
      Action: function MockAction({ children, onPress, ...props }: any) {
        const MockedPressable = require('react-native').Pressable;
        return (
          <MockedPressable onPress={onPress} {...props}>
            {children}
          </MockedPressable>
        );
      },
    },
  );

  MockBottomSheet.Content = function MockContent({ children }: any) {
    return React.createElement(RN.View, { testID: 'et-tooltip-content' }, children);
  };

  MockBottomSheet.List = function MockList() {
    return null;
  };

  MockBottomSheet.SectionList = function MockSectionList() {
    return null;
  };

  MockBottomSheet.FlashList = function MockFlashList() {
    return null;
  };

  MockBottomSheet.Footer = function MockFooter() {
    return null;
  };

  return { EtBottomSheet: MockBottomSheet };
});

describe('EtTooltip', () => {
  describe('Rendering', () => {
    it('should render with title prop and string children', () => {
      render(<EtTooltip title="Info Title">Body text content</EtTooltip>);

      expect(screen.getByTestId('et-tooltip')).toBeTruthy();
      expect(screen.getByText('Info Title')).toBeTruthy();
      expect(screen.getByText('Body text content')).toBeTruthy();
    });

    it('should render with compound Title and Body children', () => {
      render(
        <EtTooltip>
          <EtTooltip.Title>Compound Title</EtTooltip.Title>
          <EtTooltip.Body>Compound body text</EtTooltip.Body>
        </EtTooltip>,
      );

      expect(screen.getByText('Compound Title')).toBeTruthy();
      expect(screen.getByText('Compound body text')).toBeTruthy();
    });

    it('should prefer title prop over compound Title child', () => {
      render(
        <EtTooltip title="Prop Title">
          <EtTooltip.Title>Compound Title</EtTooltip.Title>
          <EtTooltip.Body>Body</EtTooltip.Body>
        </EtTooltip>,
      );

      expect(screen.getByText('Prop Title')).toBeTruthy();
      expect(screen.queryByText('Compound Title')).toBeNull();
    });

    it('should render with custom testID', () => {
      render(
        <EtTooltip title="Title" testID="custom-tooltip">
          Body
        </EtTooltip>,
      );

      expect(screen.getByTestId('custom-tooltip')).toBeTruthy();
    });

    it('should render close button in header', () => {
      render(<EtTooltip title="Title">Body</EtTooltip>);

      expect(screen.getByTestId('et-tooltip-close-button')).toBeTruthy();
    });

    it('should pass accessibilityLabel to bottom sheet', () => {
      render(
        <EtTooltip title="Title" accessibilityLabel="Info about feature">
          Body
        </EtTooltip>,
      );

      expect(screen.getByLabelText('Info about feature')).toBeTruthy();
    });
  });

  describe('Imperative handle', () => {
    it('should expose present and dismiss via ref', () => {
      const ref = createRef<EtTooltipRef>();
      render(
        <EtTooltip ref={ref} title="Title">
          Body
        </EtTooltip>,
      );

      expect(ref.current).toBeTruthy();
      expect(typeof ref.current?.present).toBe('function');
      expect(typeof ref.current?.dismiss).toBe('function');
    });
  });

  describe('Close behavior', () => {
    it('should call onClose when close button is pressed', () => {
      const onClose = jest.fn();
      render(
        <EtTooltip title="Title" onClose={onClose}>
          Body
        </EtTooltip>,
      );

      fireEvent.press(screen.getByTestId('et-tooltip-close-button'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Body content', () => {
    it('should render Body with custom ReactNode children', () => {
      render(
        <EtTooltip title="Title">
          <EtTooltip.Body>
            <Text testID="custom-body-content">Custom content</Text>
          </EtTooltip.Body>
        </EtTooltip>,
      );

      expect(screen.getByTestId('custom-body-content')).toBeTruthy();
      expect(screen.getByText('Custom content')).toBeTruthy();
    });
  });

  describe('Body standalone', () => {
    it('should render Body outside EtTooltip without crashing', () => {
      render(<EtTooltip.Body>Standalone content</EtTooltip.Body>);

      expect(screen.getByText('Standalone content')).toBeTruthy();
    });
  });

  describe('__DEV__ warnings', () => {
    it('should warn when title is missing', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <EtTooltip>
          <EtTooltip.Body>Body without title</EtTooltip.Body>
        </EtTooltip>,
      );

      expect(consoleWarn).toHaveBeenCalledWith('EtTooltip: Missing title. Provide a title prop or use <EtTooltip.Title>.');

      consoleWarn.mockRestore();
    });
  });
});
