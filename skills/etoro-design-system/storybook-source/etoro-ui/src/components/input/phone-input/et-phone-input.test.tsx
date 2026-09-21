import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { createRef } from 'react';
import { TextInput } from 'react-native';

import { EtPhoneInput } from './et-phone-input';

// Mock useEtoroTheme hook
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

// Mock EtText component
jest.mock('../../../foundations/text/et-text', () => ({
  EtText: function MockEtText({ children, testID, style, ...props }: any) {
    const { Text } = require('react-native');
    return (
      <Text testID={testID || 'et-text'} style={style} {...props}>
        {children}
      </Text>
    );
  },
}));

// Mock ChevronDown SVG icon
jest.mock('../../../core/icons/chevron-down', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: function MockChevronDown({ size }: any) {
      return <View testID="chevron-down" style={{ width: size, height: size }} />;
    },
  };
});

// Mock EtCountryFlag component
jest.mock('../../country-flag', () => {
  const { View } = require('react-native');
  return {
    EtCountryFlag: function MockEtCountryFlag({ isoCode, size }: any) {
      return <View testID="country-flag" accessibilityLabel={isoCode} style={{ width: size }} />;
    },
  };
});

const defaultProps = {
  prefix: '+44',
  isoCode: 'GB',
  placeholder: 'Number',
};

describe('EtPhoneInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders prefix and number field', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      expect(getByTestId('phone-prefix')).toBeTruthy();
      expect(getByTestId('phone-number')).toBeTruthy();
    });

    it('renders country flag', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      expect(getByTestId('country-flag')).toBeTruthy();
    });

    it('renders prefix text', () => {
      const { getByText } = render(<EtPhoneInput {...defaultProps} />);

      expect(getByText('+44')).toBeTruthy();
    });

    it('renders chevron icon', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      expect(getByTestId('chevron-down')).toBeTruthy();
    });

    it('renders with defaultValue', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} defaultValue="233233233" testID="phone" />);

      const input = getByTestId('phone-number');
      expect(input.props.defaultValue).toBe('233233233');
    });

    it('renders placeholder', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      const input = getByTestId('phone-number');
      expect(input.props.placeholder).toBe('Number');
    });
  });

  describe('Text Input Events', () => {
    it('calls onChangeText when text changes', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} onChangeText={handleChange} testID="phone" />);

      fireEvent.changeText(getByTestId('phone-number'), '123456');
      expect(handleChange).toHaveBeenCalledWith('123456');
    });

    it('calls onFocus when number field is focused', () => {
      const handleFocus = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} onFocus={handleFocus} testID="phone" />);

      fireEvent(getByTestId('phone-number'), 'focus');
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur when number field loses focus', () => {
      const handleBlur = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} onBlur={handleBlur} testID="phone" />);

      fireEvent(getByTestId('phone-number'), 'blur');
      expect(handleBlur).toHaveBeenCalled();
    });

    it('exposes blur via ref to dismiss the number field focus', () => {
      const blurSpy = jest.spyOn(TextInput.prototype, 'blur').mockImplementation(function blur(this: TextInput) {});
      const ref = createRef<{ blur: () => void }>();
      render(<EtPhoneInput {...defaultProps} ref={ref} testID="phone" />);

      expect(ref.current).toEqual({ blur: expect.any(Function) });
      expect(() => ref.current?.blur()).not.toThrow();
      expect(blurSpy).toHaveBeenCalledTimes(1);
      blurSpy.mockRestore();
    });

    it('calls onSubmitEditing when Enter is pressed', () => {
      const handleSubmit = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} defaultValue="123456" onSubmitEditing={handleSubmit} testID="phone" />);

      fireEvent(getByTestId('phone-number'), 'submitEditing');
      expect(handleSubmit).toHaveBeenCalledWith('123456');
    });
  });

  describe('Prefix Press', () => {
    it('calls onPrefixPress when prefix is pressed', () => {
      const handlePrefixPress = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} onPrefixPress={handlePrefixPress} testID="phone" />);

      fireEvent.press(getByTestId('phone-prefix'));
      expect(handlePrefixPress).toHaveBeenCalled();
    });

    it('does not call onPrefixPress when prefixDisabled', () => {
      const handlePrefixPress = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} prefixDisabled onPrefixPress={handlePrefixPress} testID="phone" />);

      fireEvent.press(getByTestId('phone-prefix'));
      expect(handlePrefixPress).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('renders number field as non-editable when disabled', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} disabled testID="phone" />);

      const input = getByTestId('phone-number');
      expect(input.props.editable).toBe(false);
    });

    it('does not fire onChangeText when disabled', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} disabled onChangeText={handleChange} testID="phone" />);

      const input = getByTestId('phone-number');

      // Verify input is not editable
      expect(input.props.editable).toBe(false);

      // Attempt to change text and verify callback was not called
      // Note: fireEvent.changeText still fires even when editable=false in tests
      // In real usage, the native TextInput respects editable prop
      fireEvent.changeText(input, '123456');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('renders error message when error is provided', () => {
      const { getByText } = render(<EtPhoneInput {...defaultProps} error="Invalid phone number" />);

      expect(getByText('Invalid phone number')).toBeTruthy();
    });

    it('does not render error when error is null', () => {
      const { queryByText } = render(<EtPhoneInput {...defaultProps} error={null} />);

      expect(queryByText('Invalid phone number')).toBeNull();
    });

    it('does not render error when error is not provided', () => {
      const { queryByText } = render(<EtPhoneInput {...defaultProps} />);

      expect(queryByText('Invalid phone number')).toBeNull();
    });
  });

  describe('Keyboard Type', () => {
    it('uses phone-pad keyboard', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      const input = getByTestId('phone-number');
      expect(input.props.keyboardType).toBe('phone-pad');
    });
  });

  describe('Accessibility', () => {
    it('prefix has correct accessibility label', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      const prefix = getByTestId('phone-prefix');
      expect(prefix.props.accessibilityLabel).toBe('Country code +44');
    });

    it('prefix has button accessibility role', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      const prefix = getByTestId('phone-prefix');
      expect(prefix.props.accessibilityRole).toBe('button');
    });
  });

  describe('displayName', () => {
    it('has correct displayName on inner component', () => {
      // Check displayName directly, fallback to inner type if needed
      const displayName = EtPhoneInput.displayName || (EtPhoneInput as any).type?.displayName;
      expect(displayName).toBe('EtPhoneInput');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty defaultValue', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} defaultValue="" testID="phone" />);

      const input = getByTestId('phone-number');
      expect(input.props.defaultValue).toBe('');
    });

    it('handles rapid text changes', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} onChangeText={handleChange} testID="phone" />);

      const input = getByTestId('phone-number');
      fireEvent.changeText(input, '1');
      fireEvent.changeText(input, '12');
      fireEvent.changeText(input, '123');

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('renders without optional callbacks', () => {
      const { getByTestId } = render(<EtPhoneInput {...defaultProps} testID="phone" />);

      // Should not throw when interacting without callbacks
      fireEvent.changeText(getByTestId('phone-number'), '123');
      fireEvent(getByTestId('phone-number'), 'focus');
      fireEvent(getByTestId('phone-number'), 'blur');
    });
  });
});
