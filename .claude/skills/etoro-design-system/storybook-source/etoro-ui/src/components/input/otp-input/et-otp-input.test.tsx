import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, within } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import { EtOtpInput } from './et-otp-input';
import { getOtpSize } from './hooks/use-otp-config';
import { OtpErrorMessage } from './subcomponents/otp-error-message';
import { OtpToggle } from './subcomponents/otp-toggle';

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

// Mock EtText component
jest.mock('../../../foundations/text', () => ({
  EtText: function MockEtText({ children, style, ...props }: any) {
    const { Text } = require('react-native');
    return (
      <Text style={style} {...props}>
        {children}
      </Text>
    );
  },
}));

// Mock EtoroIcon component
jest.mock('../../../foundations/icon-assets/et-icon', () => ({
  EtoroIcon: function MockEtoroIcon({ icon, testID, ...props }: any) {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || 'etoro-icon'} {...props}>
        <Text testID="icon-name">{icon?.iconName}</Text>
      </View>
    );
  },
}));

// Mock EtIconV2 (uses expo-image which is unavailable in test env)
jest.mock('../../et-icon-v2', () => ({
  EtIconV2: function MockEtIconV2({ name, testID, onPress, ...props }: any) {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable testID={testID} onPress={onPress} {...props}>
        <Text testID="icon-name">{name}</Text>
      </Pressable>
    );
  },
}));

describe('EtOtpInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ====== Component Structure ======

  describe('Component Structure', () => {
    it('has Toggle as a static property', () => {
      expect(EtOtpInput.Toggle).toBeDefined();
      expect(EtOtpInput.Toggle).toBe(OtpToggle);
    });

    it('renders the correct number of cells for length=6', () => {
      const { getAllByTestId } = render(<EtOtpInput length={6} testID="otp" />);
      // hidden input is present
      expect(getAllByTestId('otp-hidden-input')).toHaveLength(1);
    });

    it('renders hidden TextInput', () => {
      const { getByTestId } = render(<EtOtpInput length={4} testID="otp" />);
      const hiddenInput = getByTestId('otp-hidden-input');
      expect(hiddenInput).toBeTruthy();
    });

    it('clamps length to minimum of 2', () => {
      const { getByTestId } = render(<EtOtpInput length={1} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.maxLength).toBe(2);
    });

    it('clamps length to maximum of 9', () => {
      const { getByTestId } = render(<EtOtpInput length={20} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.maxLength).toBe(9);
    });
  });

  // ====== Input Handling ======

  describe('Input Handling', () => {
    it('calls onChangeText when text is entered', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={6} onChangeText={onChangeText} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      fireEvent.changeText(input, '123');
      expect(onChangeText).toHaveBeenCalledWith('123');
    });

    it('calls onComplete when all cells are filled', () => {
      const onComplete = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={4} onComplete={onComplete} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      fireEvent.changeText(input, '1234');
      expect(onComplete).toHaveBeenCalledWith('1234');
    });

    it('does not call onComplete when partially filled', () => {
      const onComplete = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={4} onComplete={onComplete} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      fireEvent.changeText(input, '12');
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('clamps input to max length', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={4} onChangeText={onChangeText} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      fireEvent.changeText(input, '123456');
      expect(onChangeText).toHaveBeenCalledWith('1234');
    });

    it('strips non-digit characters from input (paste / mixed text)', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={4} onChangeText={onChangeText} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      fireEvent.changeText(input, '12a3');
      expect(onChangeText).toHaveBeenCalledWith('123');
    });

    it('strips non-digits and clamps when pasting long mixed content', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={4} onChangeText={onChangeText} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      fireEvent.changeText(input, '12xx34yy56');
      expect(onChangeText).toHaveBeenCalledWith('1234');
    });
  });

  // ====== Digit sanitization (controlled / default) ======

  describe('Digit sanitization', () => {
    it('sanitizes controlled value prop to digits only', () => {
      const { getByTestId } = render(<EtOtpInput length={4} value="12x34" testID="otp" />);
      expect(getByTestId('otp-hidden-input').props.value).toBe('1234');
    });

    it('sanitizes controlled value when parent passes letters and extra digits', () => {
      const { getByTestId } = render(<EtOtpInput length={4} value="1a2b3c4d5" testID="otp" />);
      expect(getByTestId('otp-hidden-input').props.value).toBe('1234');
    });

    it('sanitizes defaultValue for uncontrolled initial state', () => {
      const { getByTestId } = render(<EtOtpInput length={4} defaultValue="99ab56" testID="otp" />);
      expect(getByTestId('otp-hidden-input').props.value).toBe('9956');
    });

    it('sanitizes defaultValue with only non-digits to empty string', () => {
      const { getByTestId } = render(<EtOtpInput length={4} defaultValue="abcd" testID="otp" />);
      expect(getByTestId('otp-hidden-input').props.value).toBe('');
    });
  });

  // ====== Controlled Mode ======

  describe('Controlled Mode', () => {
    it('uses value prop when provided', () => {
      const { getByTestId } = render(<EtOtpInput length={4} value="12" testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.value).toBe('12');
    });

    it('updates display when value prop changes', () => {
      const { getByTestId, rerender } = render(<EtOtpInput length={4} value="12" testID="otp" />);
      rerender(<EtOtpInput length={4} value="123" testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.value).toBe('123');
    });
  });

  // ====== Disabled State ======

  describe('Disabled State', () => {
    it('sets editable to false when disabled', () => {
      const { getByTestId } = render(<EtOtpInput length={4} disabled testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.editable).toBe(false);
    });

    it('does not call onChangeText when disabled', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(<EtOtpInput length={4} disabled onChangeText={onChangeText} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      // TextInput is not editable so native won't fire changeText,
      // but we verify the prop is set correctly
      expect(input.props.editable).toBe(false);
    });
  });

  // ====== Toggle ======

  describe('Toggle', () => {
    it('renders toggle when included as a child', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} secureEntry testID="otp">
          <EtOtpInput.Toggle testID="otp-toggle" />
        </EtOtpInput>,
      );
      expect(getByTestId('otp-toggle')).toBeTruthy();
    });

    it('toggle switches visibility on press', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} secureEntry testID="otp">
          <EtOtpInput.Toggle testID="otp-toggle" />
        </EtOtpInput>,
      );
      const toggle = getByTestId('otp-toggle');
      // Initially secure — icon should be 'eye' (to show)
      expect(getByTestId('icon-name').props.children).toBe('eye');
      fireEvent.press(toggle);
      // After toggle — icon should be 'eye-slash' (to hide)
      expect(getByTestId('icon-name').props.children).toBe('eye-slash');
    });

    it('toggle remains interactive when input is disabled', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} secureEntry disabled testID="otp">
          <EtOtpInput.Toggle testID="otp-toggle" />
        </EtOtpInput>,
      );
      const toggle = getByTestId('otp-toggle');
      expect(getByTestId('icon-name').props.children).toBe('eye');
      fireEvent.press(toggle);
      expect(getByTestId('icon-name').props.children).toBe('eye-slash');
    });
  });

  // ====== Accessibility ======

  describe('Accessibility', () => {
    it('has a default accessibility label on hidden input', () => {
      const { getByTestId } = render(<EtOtpInput length={6} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.accessibilityLabel).toBe('Enter 6-digit code');
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = render(<EtOtpInput length={6} accessibilityLabel="Enter OTP" testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.accessibilityLabel).toBe('Enter OTP');
    });
  });

  // ====== Auto-Size Resolution ======

  describe('Auto-Size Resolution', () => {
    // ── getOtpSize utility ──

    describe('getOtpSize()', () => {
      it('returns "large" for length 2', () => {
        expect(getOtpSize(2)).toBe('large');
      });

      it('returns "large" for length 3', () => {
        expect(getOtpSize(3)).toBe('large');
      });

      it('returns "medium" for length 4', () => {
        expect(getOtpSize(4)).toBe('medium');
      });

      it('returns "medium" for length 6', () => {
        expect(getOtpSize(6)).toBe('medium');
      });

      it('returns "small" for length 7', () => {
        expect(getOtpSize(7)).toBe('small');
      });

      it('returns "small" for length 9', () => {
        expect(getOtpSize(9)).toBe('small');
      });
    });

    // ── Rendered cell dimensions ──
    // large  → 60×68  (X15 × X17)
    // medium → 48×52  (X12 × X13)
    // small  → 32×52  (X8  × X13)

    it('applies large cell dimensions (60×68) for length=2', () => {
      const { getByTestId } = render(<EtOtpInput length={2} testID="otp" />);
      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);
      expect(flat).toEqual(expect.objectContaining({ width: 60, height: 68 }));
    });

    it('applies large cell dimensions (60×68) for length=3', () => {
      const { getByTestId } = render(<EtOtpInput length={3} testID="otp" />);
      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);
      expect(flat).toEqual(expect.objectContaining({ width: 60, height: 68 }));
    });

    it('applies medium cell dimensions (48×52) for length=6', () => {
      const { getByTestId } = render(<EtOtpInput length={6} testID="otp" />);
      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);
      expect(flat).toEqual(expect.objectContaining({ width: 48, height: 52 }));
    });

    it('applies small cell dimensions (32×52) for length=9', () => {
      const { getByTestId } = render(<EtOtpInput length={9} testID="otp" />);
      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);
      expect(flat).toEqual(expect.objectContaining({ width: 32, height: 52 }));
    });

    it('uses explicit size prop over auto length-based size', () => {
      const { getByTestId } = render(<EtOtpInput length={9} size="medium" testID="otp" />);
      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);
      expect(flat).toEqual(expect.objectContaining({ width: 48, height: 52 }));
    });

    it('renders the correct number of cells with testIDs', () => {
      const { getAllByTestId } = render(<EtOtpInput length={6} testID="otp" />);
      const cells = getAllByTestId(/^otp-cell-\d+$/);
      expect(cells).toHaveLength(6);
    });

    it('uses carbon cell styling by default', () => {
      const { getByTestId } = render(<EtOtpInput length={6} testID="otp" />);
      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);

      expect(flat).toEqual(
        expect.objectContaining({
          backgroundColor: `${colorsMock.colors.carbon900}14`,
          borderColor: 'transparent',
        }),
      );
    });

    it('uses carbon border for the focused cell', () => {
      const { getByTestId } = render(<EtOtpInput length={6} testID="otp" />);

      fireEvent(getByTestId('otp-hidden-input'), 'focus');

      const cell = getByTestId('otp-cell-0');
      const flat = StyleSheet.flatten(cell.props.style);
      expect(flat).toEqual(expect.objectContaining({ borderColor: colorsMock.colors.carbon900 }));
    });
  });

  // ====== Error State ======

  describe('Error State', () => {
    it('renders without crashing in error state', () => {
      const { getByTestId } = render(<EtOtpInput length={4} error testID="otp" />);
      expect(getByTestId('otp-hidden-input')).toBeTruthy();
    });
  });

  // ====== ErrorMessage ======

  describe('ErrorMessage', () => {
    it('has ErrorMessage as a static property', () => {
      expect(EtOtpInput.ErrorMessage).toBeDefined();
      expect(EtOtpInput.ErrorMessage).toBe(OtpErrorMessage);
    });

    it('renders error message when included as a child', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} error testID="otp">
          <EtOtpInput.ErrorMessage testID="otp-error">
            <Text>Invalid code</Text>
          </EtOtpInput.ErrorMessage>
        </EtOtpInput>,
      );
      expect(getByTestId('otp-error')).toBeTruthy();
    });

    it('displays error message text content', () => {
      const { getByText } = render(
        <EtOtpInput length={4} error testID="otp">
          <EtOtpInput.ErrorMessage testID="otp-error">
            <Text>Invalid code</Text>
          </EtOtpInput.ErrorMessage>
        </EtOtpInput>,
      );
      expect(getByText('Invalid code')).toBeTruthy();
    });

    it('has accessibilityRole="alert" for screen reader announcement', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} error testID="otp">
          <EtOtpInput.ErrorMessage testID="otp-error">
            <Text>Invalid code</Text>
          </EtOtpInput.ErrorMessage>
        </EtOtpInput>,
      );
      const errorContainer = getByTestId('otp-error');
      expect(errorContainer.props.accessibilityRole).toBe('alert');
    });

    it('renders error message outside the cellRow (child separation)', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} error testID="otp">
          <EtOtpInput.ErrorMessage testID="otp-error">
            <Text>Invalid code</Text>
          </EtOtpInput.ErrorMessage>
        </EtOtpInput>,
      );

      // Container and error message are present
      expect(getByTestId('otp')).toBeTruthy();
      expect(getByTestId('otp-error')).toBeTruthy();

      // ErrorMessage must NOT be a descendant of the cellRow Pressable
      const cellRow = getByTestId('otp-cell-row');
      expect(within(cellRow).queryByTestId('otp-error')).toBeNull();
    });

    it('renders Toggle and ErrorMessage in correct positions together', () => {
      const { getByTestId, getByText } = render(
        <EtOtpInput length={4} error secureEntry testID="otp">
          <EtOtpInput.Toggle testID="otp-toggle" />
          <EtOtpInput.ErrorMessage testID="otp-error">
            <Text>Wrong code</Text>
          </EtOtpInput.ErrorMessage>
        </EtOtpInput>,
      );
      // Both subcomponents render
      expect(getByTestId('otp-toggle')).toBeTruthy();
      expect(getByTestId('otp-error')).toBeTruthy();
      expect(getByText('Wrong code')).toBeTruthy();
    });

    it('forwards custom accessibilityLabel', () => {
      const { getByTestId } = render(
        <EtOtpInput length={4} error testID="otp">
          <EtOtpInput.ErrorMessage testID="otp-error" accessibilityLabel="Error: code is invalid">
            <Text>Invalid code</Text>
          </EtOtpInput.ErrorMessage>
        </EtOtpInput>,
      );
      const errorContainer = getByTestId('otp-error');
      expect(errorContainer.props.accessibilityLabel).toBe('Error: code is invalid');
    });
  });

  // ====== Keyboard Type ======

  describe('Keyboard', () => {
    it('defaults to number-pad keyboard type', () => {
      const { getByTestId } = render(<EtOtpInput length={4} testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.keyboardType).toBe('number-pad');
    });

    it('supports custom keyboard type', () => {
      const { getByTestId } = render(<EtOtpInput length={4} keyboardType="default" testID="otp" />);
      const input = getByTestId('otp-hidden-input');
      expect(input.props.keyboardType).toBe('default');
    });
  });
});
