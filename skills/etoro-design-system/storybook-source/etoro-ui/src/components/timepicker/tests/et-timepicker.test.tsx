import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { EtTimepicker } from '../et-timepicker';
import { ClockIcon } from '../subcomponents/clock-icon';
import { CompactFieldDisplay } from '../subcomponents/compact-field-display';
import { InputFieldDisplay } from '../subcomponents/input-field-display';
import { dateToTimeValue, formatTimeDisplay, getFormatHint, timeValueToDate, to12HourFormat } from '../utils/time-formatters';

// Mock useEtoroTheme hook
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
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

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: function MockDateTimePicker({ testID, ...props }: any) {
      return <View testID={testID || 'mock-datetime-picker'} {...props} />;
    },
  };
});

// Mock EtText component
jest.mock('../../../foundations/text', () => ({
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
jest.mock('../../../foundations/icon-assets/et-icon', () => ({
  EtoroIcon: function MockEtoroIcon({ icon, appearance, testID, ...props }: any) {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || 'etoro-icon'} {...props}>
        <Text testID="icon-name">{icon?.iconName}</Text>
        <Text testID="icon-size">{appearance?.size}</Text>
        <Text testID="icon-color">{appearance?.color}</Text>
      </View>
    );
  },
}));

// ─── Utility Function Tests ─────────────────────────────────────────────────

describe('Time Formatter Utilities', () => {
  describe('formatTimeDisplay', () => {
    it('returns empty string for null time', () => {
      expect(formatTimeDisplay(null, '24h')).toBe('');
      expect(formatTimeDisplay(null, '12h')).toBe('');
    });

    it('formats time in 24h format with zero-padded hours', () => {
      expect(formatTimeDisplay({ hours: 9, minutes: 5 }, '24h')).toBe('09:05');
    });

    it('formats time in 24h format', () => {
      expect(formatTimeDisplay({ hours: 14, minutes: 30 }, '24h')).toBe('14:30');
    });

    it('formats midnight in 24h format', () => {
      expect(formatTimeDisplay({ hours: 0, minutes: 0 }, '24h')).toBe('00:00');
    });

    it('formats 23:59 in 24h format', () => {
      expect(formatTimeDisplay({ hours: 23, minutes: 59 }, '24h')).toBe('23:59');
    });

    it('formats time in 12h format with AM', () => {
      expect(formatTimeDisplay({ hours: 9, minutes: 30 }, '12h')).toBe('9:30 AM');
    });

    it('formats time in 12h format with PM', () => {
      expect(formatTimeDisplay({ hours: 14, minutes: 30 }, '12h')).toBe('2:30 PM');
    });

    it('formats noon in 12h format', () => {
      expect(formatTimeDisplay({ hours: 12, minutes: 0 }, '12h')).toBe('12:00 PM');
    });

    it('formats midnight in 12h format', () => {
      expect(formatTimeDisplay({ hours: 0, minutes: 0 }, '12h')).toBe('12:00 AM');
    });

    it('pads minutes to 2 digits', () => {
      expect(formatTimeDisplay({ hours: 9, minutes: 5 }, '12h')).toBe('9:05 AM');
    });
  });

  describe('getFormatHint', () => {
    it('returns "HH:mm" for 24h format', () => {
      expect(getFormatHint('24h')).toBe('HH:mm');
    });

    it('returns "hh:mm AM" for 12h format', () => {
      expect(getFormatHint('12h')).toBe('hh:mm AM');
    });
  });

  describe('to12HourFormat', () => {
    it('converts midnight (0) to 12 AM', () => {
      expect(to12HourFormat(0)).toEqual({ hours: 12, period: 'AM' });
    });

    it('converts 1 to 1 AM', () => {
      expect(to12HourFormat(1)).toEqual({ hours: 1, period: 'AM' });
    });

    it('converts 11 to 11 AM', () => {
      expect(to12HourFormat(11)).toEqual({ hours: 11, period: 'AM' });
    });

    it('converts noon (12) to 12 PM', () => {
      expect(to12HourFormat(12)).toEqual({ hours: 12, period: 'PM' });
    });

    it('converts 13 to 1 PM', () => {
      expect(to12HourFormat(13)).toEqual({ hours: 1, period: 'PM' });
    });

    it('converts 23 to 11 PM', () => {
      expect(to12HourFormat(23)).toEqual({ hours: 11, period: 'PM' });
    });
  });

  describe('timeValueToDate', () => {
    it('converts a TimeValue to Date with correct hours and minutes', () => {
      const date = timeValueToDate({ hours: 14, minutes: 30 });
      expect(date.getHours()).toBe(14);
      expect(date.getMinutes()).toBe(30);
      expect(date.getSeconds()).toBe(0);
      expect(date.getMilliseconds()).toBe(0);
    });

    it('converts midnight TimeValue to Date', () => {
      const date = timeValueToDate({ hours: 0, minutes: 0 });
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
    });

    it('returns a Date for null time (current time)', () => {
      const date = timeValueToDate(null);
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('dateToTimeValue', () => {
    it('converts a Date to TimeValue', () => {
      const date = new Date();
      date.setHours(14, 30, 0, 0);
      expect(dateToTimeValue(date)).toEqual({ hours: 14, minutes: 30 });
    });

    it('converts midnight Date to TimeValue', () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      expect(dateToTimeValue(date)).toEqual({ hours: 0, minutes: 0 });
    });

    it('round-trips through timeValueToDate', () => {
      const original = { hours: 9, minutes: 45 };
      const result = dateToTimeValue(timeValueToDate(original));
      expect(result).toEqual(original);
    });
  });
});

// ─── Component Tests ────────────────────────────────────────────────────────

describe('EtTimepicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('has Label, Field, ClockIcon, and CompactFieldDisplay as static properties', () => {
      expect(EtTimepicker.Label).toBeDefined();
      expect(EtTimepicker.Field).toBeDefined();
      expect(EtTimepicker.ClockIcon).toBeDefined();
      expect(EtTimepicker.CompactFieldDisplay).toBeDefined();
    });

    it('EtTimepicker.Field is the InputFieldDisplay component', () => {
      expect(EtTimepicker.Field).toBe(InputFieldDisplay);
    });

    it('EtTimepicker.ClockIcon is the ClockIcon component', () => {
      expect(EtTimepicker.ClockIcon).toBe(ClockIcon);
    });

    it('EtTimepicker.CompactFieldDisplay is the CompactFieldDisplay component', () => {
      expect(EtTimepicker.CompactFieldDisplay).toBe(CompactFieldDisplay);
    });

    it('is a valid React memo component', () => {
      expect(typeof EtTimepicker).toBe('object');
      expect((EtTimepicker as any).$$typeof).toBe(Symbol.for('react.memo'));
    });

    it('has exactly 4 subcomponent static properties', () => {
      const subcomponents = ['Label', 'Field', 'ClockIcon', 'CompactFieldDisplay'];
      subcomponents.forEach((name) => {
        expect((EtTimepicker as any)[name]).toBeDefined();
      });
    });
  });

  describe('displayName', () => {
    it('EtTimepicker has correct displayName', () => {
      expect((EtTimepicker as any).displayName).toBe('EtTimepicker');
    });

    it('InputFieldDisplay has correct displayName', () => {
      expect(InputFieldDisplay.displayName).toBe('EtTimepicker.Field');
    });

    it('ClockIcon has correct displayName', () => {
      expect(ClockIcon.displayName).toBe('EtTimepicker.ClockIcon');
    });

    it('CompactFieldDisplay has correct displayName', () => {
      expect(CompactFieldDisplay.displayName).toBe('EtTimepicker.CompactFieldDisplay');
    });
  });

  describe('InputField Variant', () => {
    describe('Basic Rendering', () => {
      it('renders with Label and Field', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        expect(getByTestId('time-field')).toBeTruthy();
      });

      it('renders label text', () => {
        const { getByText } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Select Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        expect(getByText('Select Time')).toBeTruthy();
      });

      it('renders with defaultValue', () => {
        const testTime = { hours: 14, minutes: 30 };
        const { getByTestId } = render(
          <EtTimepicker defaultValue={testTime}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        expect(getByTestId('time-field')).toBeTruthy();
      });

      it('renders with placeholder', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" placeholder="Select a time" />
          </EtTimepicker>,
        );

        expect(getByTestId('time-field')).toBeTruthy();
      });

      it('uses inputField variant by default', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        // Field should be rendered (inputField variant)
        expect(getByTestId('time-field')).toBeTruthy();
      });
    });

    describe('Clock Icon', () => {
      it('auto-renders clock icon when not provided', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        expect(getByTestId('timepicker-clock-icon')).toBeTruthy();
      });

      it('uses custom clock icon when provided', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
            <EtTimepicker.ClockIcon iconName="notification" testID="custom-icon" />
          </EtTimepicker>,
        );

        expect(getByTestId('custom-icon')).toBeTruthy();
      });

      it('does not render clock icon when readonly', () => {
        const { queryByTestId } = render(
          <EtTimepicker defaultValue={{ hours: 9, minutes: 30 }} readonly>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        expect(queryByTestId('timepicker-clock-icon')).toBeNull();
      });

      it('ClockIcon has default accessibilityLabel "Open time picker"', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        const icon = getByTestId('timepicker-clock-icon');
        expect(icon.props.accessibilityLabel).toBe('Open time picker');
      });

      it('ClockIcon has accessibilityRole="button"', () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        const icon = getByTestId('timepicker-clock-icon');
        expect(icon.props.accessibilityRole).toBe('button');
      });
    });
  });

  describe('CompactField Variant', () => {
    describe('Basic Rendering', () => {
      it('renders compactField variant', () => {
        const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={null} />);

        expect(getByTestId('timepicker-compact-field-display')).toBeTruthy();
      });

      it('auto-renders CompactFieldDisplay when no children provided', () => {
        const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} />);

        expect(getByTestId('timepicker-compact-field-display')).toBeTruthy();
      });

      it('shows format hint when no time selected', () => {
        const { getByText } = render(<EtTimepicker variant="compactField" defaultValue={null} format="24h" />);

        expect(getByText('HH:mm')).toBeTruthy();
      });

      it('shows 12h format hint when no time selected with 12h format', () => {
        const { getByText } = render(<EtTimepicker variant="compactField" defaultValue={null} format="12h" />);

        expect(getByText('hh:mm AM')).toBeTruthy();
      });
    });

    describe('Composition', () => {
      it('renders custom CompactFieldDisplay when provided', () => {
        const { getByTestId } = render(
          <EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }}>
            <EtTimepicker.CompactFieldDisplay testID="custom-compact-display" />
          </EtTimepicker>,
        );

        expect(getByTestId('custom-compact-display')).toBeTruthy();
      });

      it('renders CompactFieldDisplay without icon when showIcon=false', () => {
        const { getByTestId } = render(
          <EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }}>
            <EtTimepicker.CompactFieldDisplay showIcon={false} testID="no-icon-display" />
          </EtTimepicker>,
        );

        expect(getByTestId('no-icon-display')).toBeTruthy();
      });

      it('renders CompactFieldDisplay with custom icon', () => {
        const { getByTestId } = render(
          <EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }}>
            <EtTimepicker.CompactFieldDisplay iconName="notification" testID="custom-icon-display" />
          </EtTimepicker>,
        );

        expect(getByTestId('custom-icon-display')).toBeTruthy();
      });
    });
  });

  describe('State Variations', () => {
    describe('Disabled State', () => {
      it('renders as non-interactive when disabled (inputField)', () => {
        const { getByTestId } = render(
          <EtTimepicker disabled defaultValue={{ hours: 9, minutes: 30 }}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        const field = getByTestId('time-field');
        expect(field.props.accessibilityState.disabled).toBe(true);
      });

      it('renders as non-interactive when disabled (compactField)', () => {
        const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} disabled />);

        const display = getByTestId('timepicker-compact-field-display');
        expect(display.props.accessibilityState.disabled).toBe(true);
      });

      it('does not trigger onPress when disabled (compactField)', () => {
        const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} disabled />);

        const display = getByTestId('timepicker-compact-field-display');
        fireEvent.press(display);

        // Haptics should NOT be called when disabled
        expect(Haptics.impactAsync).not.toHaveBeenCalled();
      });

      it('does not trigger haptics when disabled (inputField)', () => {
        const { getByTestId } = render(
          <EtTimepicker disabled defaultValue={{ hours: 9, minutes: 30 }}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        const field = getByTestId('time-field');
        fireEvent(field, 'pressIn');

        expect(Haptics.impactAsync).not.toHaveBeenCalled();
      });
    });

    describe('Readonly State', () => {
      it('renders as non-interactive when readonly (inputField)', () => {
        const { getByTestId } = render(
          <EtTimepicker readonly defaultValue={{ hours: 9, minutes: 30 }}>
            <EtTimepicker.Label>Time (Read only)</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        const field = getByTestId('time-field');
        expect(field.props.accessibilityState.disabled).toBe(true);
      });

      it('renders as non-interactive when readonly (compactField)', () => {
        const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} readonly />);

        const display = getByTestId('timepicker-compact-field-display');
        expect(display.props.accessibilityState.disabled).toBe(true);
      });

      it('does not trigger onPress when readonly (compactField)', () => {
        const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 30 }} readonly />);

        const display = getByTestId('timepicker-compact-field-display');
        fireEvent.press(display);

        expect(Haptics.impactAsync).not.toHaveBeenCalled();
      });
    });

    describe('Error State', () => {
      it('renders error text when error prop provided (inputField)', () => {
        const { getByText } = render(
          <EtTimepicker error="Please select a valid time" defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        expect(getByText('Please select a valid time')).toBeTruthy();
      });

      it('renders error text when error prop provided (compactField)', () => {
        const { getByText } = render(<EtTimepicker variant="compactField" defaultValue={null} error="Please select a time" />);

        expect(getByText('Please select a time')).toBeTruthy();
      });

      it('does not render error text when error is null', () => {
        const { queryByText } = render(
          <EtTimepicker error={null} defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        expect(queryByText('Please select a valid time')).toBeNull();
      });

      it('does not render error text when error is undefined', () => {
        const { queryByText } = render(
          <EtTimepicker defaultValue={null}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field />
          </EtTimepicker>,
        );

        // Should not find any error text element
        expect(queryByText(/error/i)).toBeNull();
      });
    });
  });

  describe('Time Display Formatting', () => {
    it('displays time in 24h format (inputField)', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 14, minutes: 30 }} format="24h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('14:30');
    });

    it('displays time in 12h format (inputField)', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 14, minutes: 30 }} format="12h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('2:30 PM');
    });

    it('displays midnight in 24h format as 00:00', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 0, minutes: 0 }} format="24h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('00:00');
    });

    it('displays midnight in 12h format as 12:00 AM', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 0, minutes: 0 }} format="12h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('12:00 AM');
    });

    it('displays noon in 12h format as 12:00 PM', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 12, minutes: 0 }} format="12h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('12:00 PM');
    });

    it('displays empty value when no time selected', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('');
    });

    it('displays formatted time in compactField variant (24h)', () => {
      const { getByText } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 9, minutes: 5 }} format="24h" />);

      expect(getByText('09:05')).toBeTruthy();
    });

    it('displays formatted time in compactField variant (12h)', () => {
      const { getByText } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 15, minutes: 45 }} format="12h" />);

      expect(getByText('3:45 PM')).toBeTruthy();
    });
  });

  describe('Press Events', () => {
    it('Field has onPressIn handler when enabled', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.onPressIn).toBeDefined();
    });

    it('Field does not have onPressIn handler when disabled', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null} disabled>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.onPressIn).toBeUndefined();
    });

    it('triggers haptic feedback when compact field is pressed', () => {
      const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('timepicker-compact-field-display');
      fireEvent.press(display);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('triggers haptic feedback when clock icon is pressed', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field />
        </EtTimepicker>,
      );

      const icon = getByTestId('timepicker-clock-icon');
      fireEvent.press(icon);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });
  });

  describe('Time Formats', () => {
    it('accepts format="24h"', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null} format="24h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByTestId('time-field')).toBeTruthy();
    });

    it('accepts format="12h"', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null} format="12h">
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByTestId('time-field')).toBeTruthy();
    });

    it('defaults to 24h format when format not specified', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 14, minutes: 30 }}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('14:30');
    });
  });

  describe('Minute Intervals', () => {
    it('accepts minuteInterval prop', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null} minuteInterval={15}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByTestId('time-field')).toBeTruthy();
    });

    const validIntervals = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;
    validIntervals.forEach((interval) => {
      it(`renders with minuteInterval=${interval}`, () => {
        const { getByTestId } = render(
          <EtTimepicker defaultValue={null} minuteInterval={interval}>
            <EtTimepicker.Label>Time</EtTimepicker.Label>
            <EtTimepicker.Field testID="time-field" />
          </EtTimepicker>,
        );

        expect(getByTestId('time-field')).toBeTruthy();
      });
    });
  });

  describe('Context Isolation', () => {
    it('throws error when Field is used outside Timepicker', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtTimepicker.Field />);
      }).toThrow('Timepicker components must be used within <Timepicker>');

      consoleError.mockRestore();
    });

    it('throws error when ClockIcon is used outside Timepicker', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtTimepicker.ClockIcon />);
      }).toThrow('Timepicker components must be used within <Timepicker>');

      consoleError.mockRestore();
    });

    it('throws error when CompactFieldDisplay is used outside Timepicker', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtTimepicker.CompactFieldDisplay />);
      }).toThrow('Timepicker components must be used within <Timepicker>');

      consoleError.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('supports accessibilityLabel on Field', () => {
      const { getByLabelText } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field accessibilityLabel="Time input field" />
        </EtTimepicker>,
      );

      expect(getByLabelText('Time input field')).toBeTruthy();
    });

    it('supports accessibilityHint on Field', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" accessibilityHint="Opens time picker" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.accessibilityHint).toBe('Opens time picker');
    });

    it('Field has accessibilityRole="button"', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.accessibilityRole).toBe('button');
    });

    it('Field accessibilityState reflects enabled state', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.accessibilityState.disabled).toBe(false);
    });

    it('CompactFieldDisplay has accessibilityRole="button"', () => {
      const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('timepicker-compact-field-display');
      expect(display.props.accessibilityRole).toBe('button');
    });

    it('CompactFieldDisplay has default accessibility label', () => {
      const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('timepicker-compact-field-display');
      expect(display.props.accessibilityLabel).toBe('Time picker, current value not set');
    });

    it('CompactFieldDisplay accessibility label includes time value', () => {
      const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={{ hours: 14, minutes: 30 }} />);

      const display = getByTestId('timepicker-compact-field-display');
      expect(display.props.accessibilityLabel).toBe('Time picker, current value 14:30');
    });

    it('CompactFieldDisplay supports custom accessibilityLabel', () => {
      const { getByTestId } = render(
        <EtTimepicker variant="compactField" defaultValue={null}>
          <EtTimepicker.CompactFieldDisplay testID="compact-display" accessibilityLabel="Custom time picker label" />
        </EtTimepicker>,
      );

      const display = getByTestId('compact-display');
      expect(display.props.accessibilityLabel).toBe('Custom time picker label');
    });

    it('CompactFieldDisplay accessibilityState reflects enabled state', () => {
      const { getByTestId } = render(<EtTimepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('timepicker-compact-field-display');
      expect(display.props.accessibilityState.disabled).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles null defaultValue', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByTestId('time-field')).toBeTruthy();
    });

    it('handles undefined defaultValue', () => {
      const { getByTestId } = render(
        <EtTimepicker>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByTestId('time-field')).toBeTruthy();
    });

    it('handles controlled mode with value prop', () => {
      const testTime = { hours: 14, minutes: 30 };
      const handleChange = jest.fn();
      const { getByTestId, getByText } = render(
        <EtTimepicker value={testTime} onChange={handleChange}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field).toBeTruthy();

      // Open the picker by pressing the clock icon
      const clockIcon = getByTestId('timepicker-clock-icon');
      fireEvent.press(clockIcon);

      // The native picker should now be visible
      const picker = getByTestId('mock-datetime-picker');
      expect(picker).toBeTruthy();

      // Simulate selecting a new time on the native picker (iOS flow)
      const newDate = new Date(2000, 0, 1, 16, 45);
      act(() => {
        picker.props.onChange({ type: 'set', nativeEvent: { timestamp: newDate.getTime() } }, newDate);
      });

      // Press Done to commit the selection
      const doneButton = getByText('Done');
      fireEvent.press(doneButton);

      // Assert handleChange was called with the new time value
      expect(handleChange).toHaveBeenCalledWith({ hours: 16, minutes: 45 });
    });

    it('displays controlled value correctly', () => {
      const testTime = { hours: 9, minutes: 15 };
      const { getByTestId } = render(
        <EtTimepicker value={testTime} onChange={jest.fn()}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('09:15');
    });

    it('handles controlled null value', () => {
      const { getByTestId } = render(
        <EtTimepicker value={null} onChange={jest.fn()}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('');
    });

    it('renders with custom style', () => {
      const customStyle = { marginTop: 16 };
      const { getByTestId } = render(
        <EtTimepicker defaultValue={null} style={customStyle}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByTestId('time-field')).toBeTruthy();
    });

    it('handles required label', () => {
      const { getByText } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label required>Time</EtTimepicker.Label>
          <EtTimepicker.Field />
        </EtTimepicker>,
      );

      expect(getByText(/Time/)).toBeTruthy();
      expect(getByText(/ \*/)).toBeTruthy();
    });

    it('renders with edge-case time value hours=23, minutes=59', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 23, minutes: 59 }}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('23:59');
    });

    it('renders with edge-case time value hours=0, minutes=0', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 0, minutes: 0 }}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      const field = getByTestId('time-field');
      expect(field.props.value).toBe('00:00');
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handleChange = jest.fn();

      const { getByTestId, getByText } = render(
        <EtTimepicker
          defaultValue={{ hours: 14, minutes: 30 }}
          format="12h"
          minuteInterval={15}
          disabled={false}
          readonly={false}
          onChange={handleChange}
        >
          <EtTimepicker.Label required>Event Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="full-timepicker" placeholder="Select event time" />
          <EtTimepicker.ClockIcon iconName="calendar" />
        </EtTimepicker>,
      );

      expect(getByTestId('full-timepicker')).toBeTruthy();
      expect(getByText(/Event Time/)).toBeTruthy();
    });

    it('displays correct formatted value with all props', () => {
      const { getByTestId } = render(
        <EtTimepicker defaultValue={{ hours: 14, minutes: 30 }} format="12h" minuteInterval={15}>
          <EtTimepicker.Label>Event Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="full-timepicker" />
        </EtTimepicker>,
      );

      const field = getByTestId('full-timepicker');
      expect(field.props.value).toBe('2:30 PM');
    });
  });

  describe('Performance', () => {
    it('renders multiple timepickers without errors', () => {
      const timepickers = Array.from({ length: 10 }, (_, i) => (
        <EtTimepicker key={i} defaultValue={{ hours: i + 8, minutes: 0 }}>
          <EtTimepicker.Label>{`Time ${i + 1}`}</EtTimepicker.Label>
          <EtTimepicker.Field testID={`time-field-${i}`} />
        </EtTimepicker>
      ));

      const { getByTestId } = render(<>{timepickers}</>);

      // Verify first and last rendered correctly
      expect(getByTestId('time-field-0')).toBeTruthy();
      expect(getByTestId('time-field-9')).toBeTruthy();
    });

    it('renders multiple compact timepickers without errors', () => {
      const timepickers = Array.from({ length: 10 }, (_, i) => (
        <EtTimepicker key={i} variant="compactField" defaultValue={{ hours: i + 8, minutes: 0 }} />
      ));

      const { getAllByTestId } = render(<>{timepickers}</>);

      expect(getAllByTestId('timepicker-compact-field-display')).toHaveLength(10);
    });
  });

  describe('Variant Rendering', () => {
    it('renders inputField variant with label, field, and clock icon', () => {
      const { getByTestId, getByText } = render(
        <EtTimepicker defaultValue={null}>
          <EtTimepicker.Label>Time</EtTimepicker.Label>
          <EtTimepicker.Field testID="time-field" />
        </EtTimepicker>,
      );

      expect(getByText('Time')).toBeTruthy();
      expect(getByTestId('time-field')).toBeTruthy();
      expect(getByTestId('timepicker-clock-icon')).toBeTruthy();
    });

    it('renders compactField variant without label or separate field', () => {
      const { getByTestId, queryByTestId } = render(<EtTimepicker variant="compactField" defaultValue={null} />);

      expect(getByTestId('timepicker-compact-field-display')).toBeTruthy();
      // Should not have the inputField elements
      expect(queryByTestId('timepicker-clock-icon')).toBeNull();
    });
  });
});
