import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { EtInput } from './et-input';
import { FloatingLabel } from './subcomponents/floating-label';
import { IconAdornment } from './subcomponents/icon-adornment';
import { InputField } from './subcomponents/input-field';
import { TextAdornment } from './subcomponents/text-adornment';

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

describe('EtInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('has Label, Field, TextAdornment, and IconAdornment as static properties', () => {
      expect(EtInput.Label).toBeDefined();
      expect(EtInput.Field).toBeDefined();
      expect(EtInput.TextAdornment).toBeDefined();
      expect(EtInput.IconAdornment).toBeDefined();
    });

    it('EtInput.Label is the FloatingLabel component', () => {
      expect(EtInput.Label).toBe(FloatingLabel);
    });

    it('EtInput.Field is the InputField component', () => {
      expect(EtInput.Field).toBe(InputField);
    });

    it('EtInput.TextAdornment is the TextAdornment component', () => {
      expect(EtInput.TextAdornment).toBe(TextAdornment);
    });

    it('EtInput.IconAdornment is the IconAdornment component', () => {
      expect(EtInput.IconAdornment).toBe(IconAdornment);
    });

    it('is callable as a function', () => {
      expect(typeof EtInput).toBe('function');
    });
  });

  describe('displayName', () => {
    it('EtInput has correct displayName', () => {
      expect((EtInput as any).displayName).toBe('EtInput');
    });

    it('FloatingLabel has correct displayName', () => {
      expect(FloatingLabel.displayName).toBe('EtInput.Label');
    });

    it('InputField has correct displayName', () => {
      expect(InputField.displayName).toBe('EtInput.Field');
    });

    it('TextAdornment has correct displayName', () => {
      expect(TextAdornment.displayName).toBe('EtInput.TextAdornment');
    });

    it('IconAdornment has correct displayName', () => {
      expect(IconAdornment.displayName).toBe('EtInput.IconAdornment');
    });
  });

  describe('Basic Rendering', () => {
    it('renders with Label and Field', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      expect(getByTestId('input-field')).toBeTruthy();
    });

    it('renders label text', () => {
      const { getByText } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Username</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText('Username')).toBeTruthy();
    });

    it('renders with defaultValue', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="test@email.com">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.defaultValue).toBe('test@email.com');
    });

    it('renders controlled value and updates when value changes', () => {
      const { getByTestId, rerender } = render(
        <EtInput defaultValue="initial">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" value="first" />
        </EtInput>,
      );

      expect(getByTestId('input-field').props.value).toBe('first');
      expect(getByTestId('input-field').props.defaultValue).toBeUndefined();

      rerender(
        <EtInput defaultValue="initial">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" value="" />
        </EtInput>,
      );

      expect(getByTestId('input-field').props.value).toBe('');
    });

    it('renders with placeholder', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" placeholder="Enter email" />
        </EtInput>,
      );

      expect(getByTestId('input-field')).toBeTruthy();
    });
  });

  describe('Label style override', () => {
    it('merges a style override on top of the default animated typography', () => {
      const { getByText } = render(
        <EtInput defaultValue="">
          <EtInput.Label style={{ color: 'blue', fontSize: 22 }}>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      const flattened = StyleSheet.flatten(getByText('Email').props.style);
      expect(flattened).toMatchObject({ color: 'blue', fontSize: 22 });
    });

    it('merges a style override on top of the disabled label typography', () => {
      const { getByText } = render(
        <EtInput defaultValue="" disabled>
          <EtInput.Label style={{ color: 'blue', fontSize: 22 }}>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      const flattened = StyleSheet.flatten(getByText('Email').props.style);
      expect(flattened).toMatchObject({ color: 'blue', fontSize: 22 });
    });

    it('renders with default typography when no style override is passed', () => {
      const { getByText } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      const flattened = StyleSheet.flatten(getByText('Email').props.style);
      expect(flattened).toMatchObject({
        textAlign: 'left',
        fontSize: 16,
      });
    });
  });

  describe('Text Input Events', () => {
    it('calls onChangeText when text changes', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onChangeText={handleChange} />
        </EtInput>,
      );

      fireEvent.changeText(getByTestId('input-field'), 'new value');
      expect(handleChange).toHaveBeenCalledWith('new value');
    });

    it('handles focus event', () => {
      const handleFocus = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onFocus={handleFocus} />
        </EtInput>,
      );

      fireEvent(getByTestId('input-field'), 'focus');
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles blur event', () => {
      const handleBlur = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onBlur={handleBlur} />
        </EtInput>,
      );

      fireEvent(getByTestId('input-field'), 'blur');
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('renders as non-editable when disabled', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" disabled>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.editable).toBe(false);
    });

    it('does not trigger haptics when disabled', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(
        <EtInput defaultValue="" disabled>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      fireEvent(getByTestId('input-field'), 'focus');
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Readonly State', () => {
    it('renders as non-editable when readonly', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="readonly value" readonly>
          <EtInput.Label>Account Number</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Error State', () => {
    it('renders error message when error prop is provided', () => {
      const { getByText } = render(
        <EtInput defaultValue="" error="Invalid email format">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText('Invalid email format')).toBeTruthy();
    });

    it('does not render error message when error is null', () => {
      const { queryByText } = render(
        <EtInput defaultValue="" error={null}>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(queryByText('Invalid email format')).toBeNull();
    });
  });

  describe('Password Type', () => {
    it('renders with secureTextEntry when type is password', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" type="password">
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field testID="password-field" />
        </EtInput>,
      );

      const input = getByTestId('password-field');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('renders password toggle button', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" type="password">
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field testID="password-field" />
        </EtInput>,
      );

      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('hides the password toggle button when disabled (read-only password field)', () => {
      const { queryByTestId, getByTestId } = render(
        <EtInput defaultValue="secret" type="password" disabled>
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field testID="password-field" />
        </EtInput>,
      );

      // Field is still secured, but the eye toggle must not render so the
      // user cannot reveal the saved value (matches legacy KYC PIN UX).
      expect(getByTestId('password-field').props.secureTextEntry).toBe(true);
      expect(queryByTestId('password-toggle-icon')).toBeNull();
    });

    it('keeps the password toggle visible and functional when disabled with showPasswordToggleWhenDisabled', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="123456789" type="password" disabled showPasswordToggleWhenDisabled>
          <EtInput.Label>SSN</EtInput.Label>
          <EtInput.Field testID="password-field" />
        </EtInput>,
      );

      // The value stays masked and non-editable, but the eye toggle renders
      // and reveals it on press (read-only-but-verifiable, e.g. prefilled SSN).
      expect(getByTestId('password-field').props.editable).toBe(false);
      expect(getByTestId('password-field').props.secureTextEntry).toBe(true);

      fireEvent.press(getByTestId('password-toggle-icon'));

      expect(getByTestId('password-field').props.secureTextEntry).toBe(false);
    });
  });

  describe('Character Counter', () => {
    it('renders character counter when showCharCounter and maxLength are set', () => {
      const { getByText } = render(
        <EtInput defaultValue="hello" maxLength={50} showCharCounter>
          <EtInput.Label>Bio</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText('5/50')).toBeTruthy();
    });

    it('does not render character counter when showCharCounter is false', () => {
      const { queryByText } = render(
        <EtInput defaultValue="hello" maxLength={50}>
          <EtInput.Label>Bio</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(queryByText('5/50')).toBeNull();
    });

    it('does not render character counter when maxLength is not set', () => {
      const { queryByText } = render(
        <EtInput defaultValue="hello" showCharCounter>
          <EtInput.Label>Bio</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(queryByText(/\//)).toBeNull();
    });

    it('error takes precedence over character counter', () => {
      const { getByText, queryByText } = render(
        <EtInput defaultValue="hello" maxLength={50} showCharCounter error="Field is required">
          <EtInput.Label>Bio</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText('Field is required')).toBeTruthy();
      expect(queryByText('5/50')).toBeNull();
    });

    it('updates character counter when input value changes', () => {
      const { getByTestId, getByText } = render(
        <EtInput defaultValue="hello" maxLength={50} showCharCounter>
          <EtInput.Label>Bio</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      // Initial count should be 5/50 for "hello"
      expect(getByText('5/50')).toBeTruthy();

      // Simulate typing to change the value
      fireEvent.changeText(getByTestId('input-field'), 'hello123');

      // Updated count should be 8/50 for "hello123"
      expect(getByText('8/50')).toBeTruthy();
    });
  });

  describe('maxLength', () => {
    it('passes maxLength to TextInput', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" maxLength={100}>
          <EtInput.Label>Description</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.maxLength).toBe(100);
    });
  });

  describe('Required Label', () => {
    it('renders asterisk when required prop is true', () => {
      const { getByText } = render(
        <EtInput defaultValue="">
          <EtInput.Label required>Email</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText(/Email/)).toBeTruthy();
      expect(getByText(/ \*/)).toBeTruthy();
    });
  });

  describe('TextAdornment', () => {
    it('renders text adornment', () => {
      const { getByText } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Amount</EtInput.Label>
          <EtInput.Field />
          <EtInput.TextAdornment>USD</EtInput.TextAdornment>
        </EtInput>,
      );

      expect(getByText('USD')).toBeTruthy();
    });
  });

  describe('IconAdornment', () => {
    it('renders icon adornment', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Search</EtInput.Label>
          <EtInput.Field />
          <EtInput.IconAdornment iconName="search" />
        </EtInput>,
      );

      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('handles icon adornment press', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Search</EtInput.Label>
          <EtInput.Field />
          <EtInput.IconAdornment iconName="search" onPress={handlePress} testID="et-input-icon-pressable" />
        </EtInput>,
      );

      const pressable = getByTestId('et-input-icon-pressable');
      fireEvent.press(pressable);
      expect(handlePress).toHaveBeenCalled();
    });
  });

  describe('Input Types', () => {
    const types = ['text', 'email', 'number', 'phone'] as const;

    types.forEach((type) => {
      it(`renders ${type} type without crashing`, () => {
        const { getByTestId } = render(
          <EtInput defaultValue="" type={type}>
            <EtInput.Label>Field</EtInput.Label>
            <EtInput.Field testID="input-field" />
          </EtInput>,
        );

        expect(getByTestId('input-field')).toBeTruthy();
      });
    });
  });

  describe('Context Isolation', () => {
    it('throws error when Label is used outside Input', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtInput.Label>Standalone Label</EtInput.Label>);
      }).toThrow('FloatingLabel must be used within an EtInput (InputProvider) tree.');

      consoleError.mockRestore();
    });

    it('throws error when Field is used outside Input', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtInput.Field />);
      }).toThrow('Input components must be used within <Input>');

      consoleError.mockRestore();
    });

    it('throws error when IconAdornment is used outside Input', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtInput.IconAdornment iconName="search" />);
      }).toThrow('Input components must be used within <Input>');

      consoleError.mockRestore();
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to container', () => {
      const customStyle = { marginTop: 16 };
      const { getByTestId } = render(
        <EtInput defaultValue="" style={customStyle}>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      expect(getByTestId('input-field')).toBeTruthy();
    });

    it('applies custom backgroundColor to input surface', () => {
      const customBackgroundColor = '#123456';
      const { toJSON } = render(
        <EtInput defaultValue="" backgroundColor={customBackgroundColor}>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const hasBackgroundColor = (node: any): boolean => {
        if (!node) return false;
        if (Array.isArray(node)) return node.some(hasBackgroundColor);
        if (typeof node !== 'object') return false;

        const nodeStyles = Array.isArray(node.props?.style) ? node.props.style : [node.props?.style];
        const matchesNodeStyle = nodeStyles.some(
          (item: unknown) => typeof item === 'object' && item !== null && 'backgroundColor' in item && item.backgroundColor === customBackgroundColor,
        );

        if (matchesNodeStyle) return true;
        return hasBackgroundColor(node.children);
      };

      expect(hasBackgroundColor(toJSON())).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty defaultValue', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.defaultValue).toBe('');
    });

    it('handles undefined defaultValue', () => {
      const { getByTestId } = render(
        <EtInput>
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      expect(getByTestId('input-field')).toBeTruthy();
    });

    it('handles multiple adornments', () => {
      const { getByText, getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Amount</EtInput.Label>
          <EtInput.Field testID="input-field" />
          <EtInput.TextAdornment>USD</EtInput.TextAdornment>
          <EtInput.IconAdornment iconName="search" />
        </EtInput>,
      );

      expect(getByText('USD')).toBeTruthy();
      expect(getByTestId('etoro-icon')).toBeTruthy();
    });

    it('handles rapid text changes', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onChangeText={handleChange} />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      fireEvent.changeText(input, 'a');
      fireEvent.changeText(input, 'ab');
      fireEvent.changeText(input, 'abc');

      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('supports accessibilityLabel on Field', () => {
      const { getByLabelText } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field accessibilityLabel="Email input field" />
        </EtInput>,
      );

      expect(getByLabelText('Email input field')).toBeTruthy();
    });

    it('supports accessibilityHint on Field', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" accessibilityHint="Enter your email address" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.accessibilityHint).toBe('Enter your email address');
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handleChange = jest.fn();
      const { getByTestId, getByText } = render(
        <EtInput defaultValue="initial" type="email" maxLength={100} showCharCounter disabled={false} readonly={false}>
          <EtInput.Label required>Email Address</EtInput.Label>
          <EtInput.Field testID="full-input" onChangeText={handleChange} placeholder="Enter email" />
          <EtInput.IconAdornment iconName="search" />
        </EtInput>,
      );

      expect(getByTestId('full-input')).toBeTruthy();
      expect(getByText(/Email Address/)).toBeTruthy();
      expect(getByText('7/100')).toBeTruthy();
    });
  });

  describe('Contained Variant', () => {
    it('renders with variant="contained" without crashing', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" variant="contained">
          <EtInput.Label>First name</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      expect(getByTestId('input-field')).toBeTruthy();
    });

    it('renders label text in contained variant', () => {
      const { getByText } = render(
        <EtInput defaultValue="" variant="contained">
          <EtInput.Label>Last name</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText('Last name')).toBeTruthy();
    });

    it('renders with defaultValue in contained variant', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="John" variant="contained">
          <EtInput.Label>First name</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      expect(getByTestId('input-field').props.defaultValue).toBe('John');
    });

    it('calls onChangeText in contained variant', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="" variant="contained">
          <EtInput.Label>First name</EtInput.Label>
          <EtInput.Field testID="input-field" onChangeText={handleChange} />
        </EtInput>,
      );

      fireEvent.changeText(getByTestId('input-field'), 'John');
      expect(handleChange).toHaveBeenCalledWith('John');
    });

    it('renders error message in contained variant', () => {
      const { getByText } = render(
        <EtInput defaultValue="" variant="contained" error="Name is required">
          <EtInput.Label>First name</EtInput.Label>
          <EtInput.Field />
        </EtInput>,
      );

      expect(getByText('Name is required')).toBeTruthy();
    });

    it('defaults to underline variant when not specified', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      expect(getByTestId('input-field')).toBeTruthy();
    });
  });

  describe('Static Label Mode', () => {
    it('renders the placeholder when empty and blurred while staticLabel is set', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" staticLabel>
          <EtInput.Label>Day</EtInput.Label>
          <EtInput.Field testID="input-field" placeholder="dd" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.placeholder).toBe('dd');
    });

    it('hides placeholder when empty and blurred while staticLabel is not set (floating label default)', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Day</EtInput.Label>
          <EtInput.Field testID="input-field" placeholder="dd" />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.placeholder).toBeUndefined();
    });

    it('does not write the placeholder text into the field value', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="" staticLabel>
          <EtInput.Label>Year</EtInput.Label>
          <EtInput.Field testID="input-field" placeholder="yyyy" onChangeText={handleChange} />
        </EtInput>,
      );

      const input = getByTestId('input-field');
      expect(input.props.defaultValue).toBe('');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Focus/Blur Event Composition', () => {
    it('calls external onBlur callback when field is blurred', () => {
      const handleBlur = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onBlur={handleBlur} />
        </EtInput>,
      );

      fireEvent(getByTestId('input-field'), 'focus');
      fireEvent(getByTestId('input-field'), 'blur');
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls external onFocus callback when field is focused', () => {
      const handleFocus = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onFocus={handleFocus} />
        </EtInput>,
      );

      fireEvent(getByTestId('input-field'), 'focus');
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls both onFocus and onBlur in sequence', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" onFocus={handleFocus} onBlur={handleBlur} />
        </EtInput>,
      );

      fireEvent(getByTestId('input-field'), 'focus');
      fireEvent(getByTestId('input-field'), 'blur');
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pressable Container Wrapper', () => {
    it('container is pressable and handles press events', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Email</EtInput.Label>
          <EtInput.Field testID="input-field" />
        </EtInput>,
      );

      const container = getByTestId('input-container-pressable');

      // Verify container exists and can be pressed without error
      expect(container).toBeTruthy();
      expect(() => fireEvent.press(container)).not.toThrow();
    });
  });

  describe('Password Toggle Interaction', () => {
    it('password toggle button is pressable', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="" type="password">
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field testID="password-field" />
        </EtInput>,
      );

      const passwordToggle = getByTestId('password-toggle-icon');
      expect(passwordToggle).toBeTruthy();

      // Verify it's pressable by checking it doesn't throw
      fireEvent.press(passwordToggle);
    });

    it('toggles visibility when password toggle is pressed', () => {
      const { getByTestId } = render(
        <EtInput defaultValue="password123" type="password">
          <EtInput.Label>Password</EtInput.Label>
          <EtInput.Field testID="password-field" />
        </EtInput>,
      );

      const input = getByTestId('password-field');

      // Initially should be secure
      expect(input.props.secureTextEntry).toBe(true);

      const passwordToggle = getByTestId('password-toggle-icon');
      fireEvent.press(passwordToggle);

      // Should toggle visibility
      expect(input.props.secureTextEntry).toBe(false);
    });
  });

  describe('Icon Adornment Interaction', () => {
    it('calls custom onPress handler when interactive icon is pressed', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Search</EtInput.Label>
          <EtInput.Field testID="input-field" />
          <EtInput.IconAdornment iconName="search" onPress={handlePress} testID="icon-pressable" />
        </EtInput>,
      );

      const iconPressable = getByTestId('icon-pressable');
      fireEvent.press(iconPressable);

      expect(handlePress).toHaveBeenCalled();
    });

    it('icon adornment with onPress is pressable', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <EtInput defaultValue="">
          <EtInput.Label>Search</EtInput.Label>
          <EtInput.Field testID="input-field" />
          <EtInput.IconAdornment iconName="search" onPress={handlePress} testID="icon-pressable" />
        </EtInput>,
      );

      const iconPressable = getByTestId('icon-pressable');

      // Verify it exists and can be pressed without error
      expect(iconPressable).toBeTruthy();
      fireEvent.press(iconPressable);

      expect(handlePress).toHaveBeenCalledTimes(1);
    });
  });
});
