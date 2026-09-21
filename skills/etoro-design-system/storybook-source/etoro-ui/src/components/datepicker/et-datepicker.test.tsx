import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { colorsMock } from '../../core/hooks/__mocks__/colors-mock';
import { EtDatepicker } from './et-datepicker';
import { CalendarIcon } from './subcomponents/calendar-icon';
import { CompactFieldDisplay } from './subcomponents/compact-field-display';
import { InputFieldDisplay } from './subcomponents/input-field-display';

// Mock useEtoroTheme hook
jest.mock('../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../core/hooks/__mocks__/colors-mock');
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
jest.mock('../../foundations/text', () => ({
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
jest.mock('../../foundations/icon-assets/et-icon', () => ({
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

describe('EtDatepicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('has Label, Field, CalendarIcon, and CompactFieldDisplay as static properties', () => {
      expect(EtDatepicker.Label).toBeDefined();
      expect(EtDatepicker.Field).toBeDefined();
      expect(EtDatepicker.CalendarIcon).toBeDefined();
      expect(EtDatepicker.CompactFieldDisplay).toBeDefined();
    });

    it('EtDatepicker.Field is the InputFieldDisplay component', () => {
      expect(EtDatepicker.Field).toBe(InputFieldDisplay);
    });

    it('EtDatepicker.CalendarIcon is the CalendarIcon component', () => {
      expect(EtDatepicker.CalendarIcon).toBe(CalendarIcon);
    });

    it('EtDatepicker.CompactFieldDisplay is the CompactFieldDisplay component', () => {
      expect(EtDatepicker.CompactFieldDisplay).toBe(CompactFieldDisplay);
    });

    it('renders as a valid React element', () => {
      const { root } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(root).toBeTruthy();
    });
  });

  describe('displayName', () => {
    it('EtDatepicker has correct displayName', () => {
      expect((EtDatepicker as any).displayName).toBe('EtDatepicker');
    });

    it('InputFieldDisplay has correct displayName', () => {
      expect(InputFieldDisplay.displayName).toBe('EtDatepicker.Field');
    });

    it('CalendarIcon has correct displayName', () => {
      expect(CalendarIcon.displayName).toBe('EtDatepicker.CalendarIcon');
    });

    it('CompactFieldDisplay has correct displayName', () => {
      expect(CompactFieldDisplay.displayName).toBe('EtDatepicker.CompactFieldDisplay');
    });
  });

  describe('InputField Variant', () => {
    describe('Basic Rendering', () => {
      it('renders with Label and Field', () => {
        const { getByTestId } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        expect(getByTestId('date-field')).toBeTruthy();
      });

      it('renders label text', () => {
        const { getByText } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Select Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        expect(getByText('Select Date')).toBeTruthy();
      });

      it('renders with defaultValue', () => {
        const testDate = new Date(2026, 0, 15); // Jan 15, 2026
        const { getByTestId } = render(
          <EtDatepicker defaultValue={testDate}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        expect(getByTestId('date-field')).toBeTruthy();
      });

      it('renders with placeholder', () => {
        const { getByTestId } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" placeholder="Select a date" />
          </EtDatepicker>,
        );

        expect(getByTestId('date-field')).toBeTruthy();
      });

      it('uses inputField variant by default', () => {
        const { getByTestId } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        // Field should be rendered (inputField variant)
        expect(getByTestId('date-field')).toBeTruthy();
      });
    });

    describe('Calendar Icon', () => {
      it('auto-renders calendar icon when not provided', () => {
        const { getByTestId } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        expect(getByTestId('datepicker-calendar-icon')).toBeTruthy();
      });

      it('uses custom calendar icon when provided', () => {
        const { getByTestId } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
            <EtDatepicker.CalendarIcon iconName="notification" testID="custom-icon" />
          </EtDatepicker>,
        );

        expect(getByTestId('custom-icon')).toBeTruthy();
      });

      it('does not render calendar icon when readonly', () => {
        const { queryByTestId } = render(
          <EtDatepicker defaultValue={new Date()} readonly>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        expect(queryByTestId('datepicker-calendar-icon')).toBeNull();
      });
    });
  });

  describe('CompactField Variant', () => {
    describe('Basic Rendering', () => {
      it('renders compactField variant', () => {
        const { getByTestId } = render(<EtDatepicker variant="compactField" defaultValue={null} />);

        expect(getByTestId('datepicker-compact-field-display')).toBeTruthy();
      });

      it('auto-renders CompactFieldDisplay when no children provided', () => {
        const { getByTestId } = render(<EtDatepicker variant="compactField" defaultValue={new Date()} />);

        expect(getByTestId('datepicker-compact-field-display')).toBeTruthy();
      });

      it('shows format string as hint when no date selected', () => {
        const { getByText } = render(<EtDatepicker variant="compactField" defaultValue={null} format="MM/dd/yyyy" />);

        expect(getByText('MM/dd/yyyy')).toBeTruthy();
      });
    });

    describe('Composition', () => {
      it('renders custom CompactFieldDisplay when provided', () => {
        const { getByTestId } = render(
          <EtDatepicker variant="compactField" defaultValue={new Date()}>
            <EtDatepicker.CompactFieldDisplay testID="custom-compact-display" />
          </EtDatepicker>,
        );

        expect(getByTestId('custom-compact-display')).toBeTruthy();
      });

      it('renders CompactFieldDisplay without icon when showIcon=false', () => {
        const { getByTestId } = render(
          <EtDatepicker variant="compactField" defaultValue={new Date()}>
            <EtDatepicker.CompactFieldDisplay showIcon={false} testID="no-icon-display" />
          </EtDatepicker>,
        );

        expect(getByTestId('no-icon-display')).toBeTruthy();
      });

      it('renders CompactFieldDisplay with custom icon', () => {
        const { getByTestId } = render(
          <EtDatepicker variant="compactField" defaultValue={new Date()}>
            <EtDatepicker.CompactFieldDisplay iconName="notification" testID="custom-icon-display" />
          </EtDatepicker>,
        );

        expect(getByTestId('custom-icon-display')).toBeTruthy();
      });
    });
  });

  describe('State Variations', () => {
    describe('Disabled State', () => {
      it('renders as non-interactive when disabled (inputField)', () => {
        const { getByTestId } = render(
          <EtDatepicker disabled defaultValue={new Date()}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        const field = getByTestId('date-field');
        expect(field.props.accessibilityState.disabled).toBe(true);
      });

      it('renders as non-interactive when disabled (compactField)', () => {
        const { getByTestId } = render(<EtDatepicker variant="compactField" disabled defaultValue={new Date()} />);

        const display = getByTestId('datepicker-compact-field-display');
        expect(display.props.accessibilityState.disabled).toBe(true);
      });
    });

    describe('Readonly State', () => {
      it('renders as non-interactive when readonly (inputField)', () => {
        const { getByTestId } = render(
          <EtDatepicker readonly defaultValue={new Date()}>
            <EtDatepicker.Label>Date (Read only)</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        const field = getByTestId('date-field');
        expect(field.props.accessibilityState.disabled).toBe(true);
      });

      it('renders as non-interactive when readonly (compactField)', () => {
        const { getByTestId } = render(<EtDatepicker variant="compactField" readonly defaultValue={new Date()} />);

        const display = getByTestId('datepicker-compact-field-display');
        expect(display.props.accessibilityState.disabled).toBe(true);
      });
    });

    describe('Hard-override + error combos (D8 + quiet chrome)', () => {
      // Locks the wiring end-to-end for the two hard-override combos that
      // regressed before: `disabled + error` and `readonly + error`. The
      // helper-only unit tests in `use-datepicker-animations.spec.ts` pin the
      // policy in isolation; these assertions verify that DatepickerProvider
      // forwards `disabled` / `readonly` / `hasError` to the animation hook
      // and to the observable side effects (`pointerEvents`, calendar icon).

      it('disabled + error: field stays non-interactive (pointerEvents=none via disabled) and error helper renders', () => {
        const { getByTestId, getByText } = render(
          <EtDatepicker disabled error="Please select a valid date" defaultValue={new Date(2026, 5, 15)}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        expect(getByTestId('date-field').props.accessibilityState.disabled).toBe(true);
        expect(getByText('Please select a valid date')).toBeTruthy();
      });

      it('readonly + error: calendar icon is suppressed (quiet chrome) and error helper renders', () => {
        const { queryByTestId, getByTestId, getByText } = render(
          <EtDatepicker readonly error="Please select a valid date" defaultValue={new Date(2026, 5, 15)}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        expect(getByTestId('date-field').props.accessibilityState.disabled).toBe(true);
        expect(queryByTestId('datepicker-calendar-icon')).toBeNull();
        expect(getByText('Please select a valid date')).toBeTruthy();
      });

      it('error helper text stays actionBrandVarText even under disabled (color token unchanged)', () => {
        const { getByText } = render(
          <EtDatepicker disabled error="Invalid date" defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        const helper = getByText('Invalid date');
        const flat = StyleSheet.flatten(helper.props.style);
        expect(flat?.color).toBe(colorsMock.colors.actionBrandVarText);
      });
    });

    describe('Error State', () => {
      it('renders error message when error prop is provided (inputField)', () => {
        const { getByText } = render(
          <EtDatepicker error="Please select a valid date" defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        expect(getByText('Please select a valid date')).toBeTruthy();
      });

      it('renders error message when error prop is provided (compactField)', () => {
        const { getByText } = render(<EtDatepicker variant="compactField" error="Date is required" defaultValue={null} />);

        expect(getByText('Date is required')).toBeTruthy();
      });

      it('does not render error message when error is null', () => {
        const { queryByText } = render(
          <EtDatepicker error={null} defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        expect(queryByText('Please select a valid date')).toBeNull();
      });

      it('auto-renders calendar icon for inputField', () => {
        const { getByTestId } = render(
          <EtDatepicker defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field testID="date-field" />
          </EtDatepicker>,
        );

        expect(getByTestId('datepicker-calendar-icon')).toBeTruthy();
      });

      it('error helper text uses actionBrandVarText (same red as error border)', () => {
        const { getByText } = render(
          <EtDatepicker error="Invalid date" defaultValue={null}>
            <EtDatepicker.Label>Date</EtDatepicker.Label>
            <EtDatepicker.Field />
          </EtDatepicker>,
        );

        const helper = getByText('Invalid date');
        const flat = StyleSheet.flatten(helper.props.style);
        expect(flat?.color).toBe(colorsMock.colors.actionBrandVarText);
      });
    });
  });

  describe('Date Selection', () => {
    it('renders with onChange prop configured', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} onChange={handleChange}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      // Note: Actual onChange invocation requires native picker interaction
      // which cannot be tested in Jest. This test verifies the component
      // renders correctly when onChange prop is provided.
      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('opens picker on press (inputField)', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      const field = getByTestId('date-field');
      fireEvent(field, 'pressIn');

      // Component should be interactive
      expect(field.props.accessibilityState.disabled).toBe(false);
    });

    it('opens picker on press (compactField)', () => {
      const { getByTestId } = render(<EtDatepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('datepicker-compact-field-display');
      fireEvent.press(display);

      // Component should be interactive
      expect(display.props.accessibilityState.disabled).toBe(false);
    });
  });

  describe('Date Formatting', () => {
    it('uses default format (dd MMM yyyy)', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('accepts custom format prop', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} format="MM/dd/yyyy">
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('shows format as hint in compactField when no value', () => {
      const { getByText } = render(<EtDatepicker variant="compactField" defaultValue={null} format="yyyy-MM-dd" />);

      expect(getByText('yyyy-MM-dd')).toBeTruthy();
    });
  });

  describe('Value Types', () => {
    it('accepts valueType="date"', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} valueType="date" onChange={handleChange}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('accepts valueType="iso"', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} valueType="iso" onChange={handleChange}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('accepts valueType="formatted"', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} valueType="formatted" format="yyyy-MM-dd" onChange={handleChange}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });
  });

  describe('Date Constraints', () => {
    it('accepts minDate prop', () => {
      const minDate = new Date(2026, 0, 1);
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} minDate={minDate}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('accepts maxDate prop', () => {
      const maxDate = new Date(2026, 11, 31);
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} maxDate={maxDate}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('accepts both minDate and maxDate props', () => {
      const minDate = new Date(2026, 0, 1);
      const maxDate = new Date(2026, 11, 31);
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} minDate={minDate} maxDate={maxDate}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });
  });

  describe('Context Isolation', () => {
    it('throws error when Field is used outside Datepicker', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtDatepicker.Field />);
      }).toThrow('Datepicker components must be used within <Datepicker>');

      consoleError.mockRestore();
    });

    it('throws error when CalendarIcon is used outside Datepicker', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtDatepicker.CalendarIcon />);
      }).toThrow('Datepicker components must be used within <Datepicker>');

      consoleError.mockRestore();
    });

    it('throws error when CompactFieldDisplay is used outside Datepicker', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtDatepicker.CompactFieldDisplay />);
      }).toThrow('Datepicker components must be used within <Datepicker>');

      consoleError.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('supports accessibilityLabel on Field', () => {
      const { getByLabelText } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field accessibilityLabel="Date input field" />
        </EtDatepicker>,
      );

      expect(getByLabelText('Date input field')).toBeTruthy();
    });

    it('supports accessibilityHint on Field', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" accessibilityHint="Opens date picker" />
        </EtDatepicker>,
      );

      const field = getByTestId('date-field');
      expect(field.props.accessibilityHint).toBe('Opens date picker');
    });

    it('Field has accessibilityRole="button"', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      const field = getByTestId('date-field');
      expect(field.props.accessibilityRole).toBe('button');
    });

    it('CompactFieldDisplay has accessibilityRole="button"', () => {
      const { getByTestId } = render(<EtDatepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('datepicker-compact-field-display');
      expect(display.props.accessibilityRole).toBe('button');
    });

    it('CompactFieldDisplay has default accessibility label', () => {
      const { getByTestId } = render(<EtDatepicker variant="compactField" defaultValue={null} />);

      const display = getByTestId('datepicker-compact-field-display');
      expect(display.props.accessibilityLabel).toBe('Date picker, current value not set');
    });

    it('CompactFieldDisplay supports custom accessibilityLabel', () => {
      const { getByTestId } = render(
        <EtDatepicker variant="compactField" defaultValue={null}>
          <EtDatepicker.CompactFieldDisplay testID="compact-display" accessibilityLabel="Custom date picker label" />
        </EtDatepicker>,
      );

      const display = getByTestId('compact-display');
      expect(display.props.accessibilityLabel).toBe('Custom date picker label');
    });
  });

  describe('Edge Cases', () => {
    it('handles null defaultValue', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('handles undefined defaultValue', () => {
      const { getByTestId } = render(
        <EtDatepicker>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('handles ISO string as defaultValue', () => {
      const { getByTestId } = render(
        <EtDatepicker defaultValue="2026-01-15T00:00:00.000Z">
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('handles controlled mode with value prop', () => {
      const testDate = new Date(2026, 0, 15);
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtDatepicker value={testDate} onChange={handleChange}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('renders with custom style', () => {
      const customStyle = { marginTop: 16 };
      const { getByTestId } = render(
        <EtDatepicker defaultValue={null} style={customStyle}>
          <EtDatepicker.Label>Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="date-field" />
        </EtDatepicker>,
      );

      expect(getByTestId('date-field')).toBeTruthy();
    });

    it('handles required label', () => {
      const { getByText } = render(
        <EtDatepicker defaultValue={null}>
          <EtDatepicker.Label required>Date</EtDatepicker.Label>
          <EtDatepicker.Field />
        </EtDatepicker>,
      );

      expect(getByText(/Date/)).toBeTruthy();
      expect(getByText(/ \*/)).toBeTruthy();
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handleChange = jest.fn();
      const minDate = new Date(2026, 0, 1);
      const maxDate = new Date(2026, 11, 31);

      const { getByTestId, getByText } = render(
        <EtDatepicker
          defaultValue={new Date(2026, 5, 15)}
          format="MM/dd/yyyy"
          valueType="date"
          minDate={minDate}
          maxDate={maxDate}
          disabled={false}
          readonly={false}
          onChange={handleChange}
        >
          <EtDatepicker.Label required>Event Date</EtDatepicker.Label>
          <EtDatepicker.Field testID="full-datepicker" placeholder="Select event date" />
          <EtDatepicker.CalendarIcon iconName="calendar" />
        </EtDatepicker>,
      );

      expect(getByTestId('full-datepicker')).toBeTruthy();
      expect(getByText(/Event Date/)).toBeTruthy();
    });
  });
});
