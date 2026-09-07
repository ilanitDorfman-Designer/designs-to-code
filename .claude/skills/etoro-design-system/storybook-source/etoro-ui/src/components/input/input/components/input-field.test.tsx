import { fireEvent, render } from '@testing-library/react-native';

import { InputType } from '../api/types';
import { InputField } from './input-field';

// Mock the getKeyboardType utility
jest.mock('../utils', () => ({
  getKeyboardType: jest.fn((type: InputType) => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  }),
}));

const defaultProps = {
  value: '',
  onChangeText: jest.fn(),
  onFocus: jest.fn(),
  onBlur: jest.fn(),
  type: 'text' as InputType,
  isPasswordVisible: false,
  isFocused: false,
  textColor: '#000000',
  cursorColor: '#007AFF',
  selectionColor: '#007AFF',
};

describe('InputField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} />);

    expect(getByDisplayValue('')).toBeTruthy();
  });

  it('displays the provided value', () => {
    const testValue = 'Test input value';
    const { getByDisplayValue } = render(<InputField {...defaultProps} value={testValue} />);

    expect(getByDisplayValue(testValue)).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByDisplayValue } = render(<InputField {...defaultProps} onChangeText={onChangeTextMock} />);

    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'new text');

    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });

  it('calls onFocus when input is focused', () => {
    const onFocusMock = jest.fn();
    const { getByDisplayValue } = render(<InputField {...defaultProps} onFocus={onFocusMock} />);

    const input = getByDisplayValue('');
    fireEvent(input, 'focus');

    expect(onFocusMock).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', () => {
    const onBlurMock = jest.fn();
    const { getByDisplayValue } = render(<InputField {...defaultProps} onBlur={onBlurMock} />);

    const input = getByDisplayValue('');
    fireEvent(input, 'blur');

    expect(onBlurMock).toHaveBeenCalled();
  });

  it('sets secureTextEntry to true for password type when not visible', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} type="password" isPasswordVisible={false} />);

    const input = getByDisplayValue('');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('sets secureTextEntry to false for password type when visible', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} type="password" isPasswordVisible={true} />);

    const input = getByDisplayValue('');
    expect(input.props.secureTextEntry).toBe(false);
  });

  it('sets secureTextEntry to false for non-password types', () => {
    const types: InputType[] = ['text', 'email', 'number', 'phone'];

    types.forEach((type) => {
      const { getByDisplayValue } = render(<InputField {...defaultProps} type={type} isPasswordVisible={false} />);

      const input = getByDisplayValue('');
      expect(input.props.secureTextEntry).toBe(false);
    });
  });

  it('applies correct keyboard type based on input type', () => {
    const testCases = [
      { type: 'text' as InputType, expected: 'default' },
      { type: 'email' as InputType, expected: 'email-address' },
      { type: 'number' as InputType, expected: 'numeric' },
      { type: 'phone' as InputType, expected: 'phone-pad' },
      { type: 'password' as InputType, expected: 'default' },
    ];

    testCases.forEach(({ type, expected }) => {
      const { getByDisplayValue } = render(<InputField {...defaultProps} type={type} />);

      const input = getByDisplayValue('');
      expect(input.props.keyboardType).toBe(expected);
    });
  });

  it('shows placeholder regardless of focus state', () => {
    const placeholder = 'Enter text here';

    // When not focused
    const { getByDisplayValue: getByDisplayValueNotFocused } = render(<InputField {...defaultProps} placeholder={placeholder} isFocused={false} />);

    const inputNotFocused = getByDisplayValueNotFocused('');
    expect(inputNotFocused.props.placeholder).toBe(placeholder);

    // When focused
    const { getByDisplayValue: getByDisplayValueFocused } = render(<InputField {...defaultProps} placeholder={placeholder} isFocused={true} />);

    const inputFocused = getByDisplayValueFocused('');
    expect(inputFocused.props.placeholder).toBe(placeholder);
  });

  it('disables input when disabled prop is true', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} disabled={true} />);

    const input = getByDisplayValue('');
    expect(input.props.editable).toBe(false);
  });

  it('enables input when disabled prop is false', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} disabled={false} />);

    const input = getByDisplayValue('');
    expect(input.props.editable).toBe(true);
  });

  it('applies maxLength prop correctly', () => {
    const maxLength = 10;
    const { getByDisplayValue } = render(<InputField {...defaultProps} maxLength={maxLength} />);

    const input = getByDisplayValue('');
    expect(input.props.maxLength).toBe(maxLength);
  });

  it('applies text colors correctly', () => {
    const textColor = '#FF0000';
    const { getByDisplayValue } = render(<InputField {...defaultProps} textColor={textColor} />);

    const input = getByDisplayValue('');
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: textColor,
        }),
      ]),
    );
  });

  it('applies cursor and selection colors correctly', () => {
    const cursorColor = '#00FF00';
    const selectionColor = '#0000FF';
    const { getByDisplayValue } = render(<InputField {...defaultProps} cursorColor={cursorColor} selectionColor={selectionColor} />);

    const input = getByDisplayValue('');
    expect(input.props.cursorColor).toBe(cursorColor);
    expect(input.props.selectionColor).toBe(selectionColor);
  });

  it('applies custom input styles', () => {
    const customStyle = { fontSize: 20, fontWeight: 'bold' as const };
    const { getByDisplayValue } = render(<InputField {...defaultProps} inputStyle={customStyle} />);

    const input = getByDisplayValue('');
    expect(input.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
  });

  it('applies testID correctly', () => {
    const testID = 'input-field-test';
    const { getByTestId } = render(<InputField {...defaultProps} testID={testID} />);

    expect(getByTestId(testID)).toBeTruthy();
  });

  it('applies accessibility properties correctly', () => {
    const accessibilityLabel = 'Username input';
    const accessibilityHint = 'Enter your username';
    const { getByDisplayValue } = render(
      <InputField {...defaultProps} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint} />,
    );

    const input = getByDisplayValue('');
    expect(input.props.accessibilityLabel).toBe(accessibilityLabel);
    expect(input.props.accessibilityHint).toBe(accessibilityHint);
  });

  it('merges additional TextInput props correctly', () => {
    const textInputProps = {
      autoCapitalize: 'none' as const,
      autoCorrect: false,
      blurOnSubmit: true,
    };
    const { getByDisplayValue } = render(<InputField {...defaultProps} textInputProps={textInputProps} />);

    const input = getByDisplayValue('');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
    expect(input.props.blurOnSubmit).toBe(true);
  });

  it('sets keyboard appearance based on color scheme', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} />);

    const input = getByDisplayValue('');
    expect(input.props.keyboardAppearance).toMatch(/^(light|dark)$/);
  });

  it('sets submitBehavior correctly', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} />);

    const input = getByDisplayValue('');
    expect(input.props.submitBehavior).toBe('blurAndSubmit');
  });

  it('applies platform-specific height styles', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} />);

    const input = getByDisplayValue('');
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: expect.any(Number),
        }),
      ]),
    );
  });

  it('applies default styles correctly', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} />);

    const input = getByDisplayValue('');
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          padding: 0,
          margin: 0,
        }),
      ]),
    );
  });

  it('handles null and undefined values gracefully', () => {
    const { getByDisplayValue } = render(
      <InputField
        {...defaultProps}
        placeholder={undefined}
        maxLength={undefined}
        inputStyle={undefined}
        testID={undefined}
        accessibilityLabel={undefined}
        accessibilityHint={undefined}
        textInputProps={undefined}
      />,
    );

    const input = getByDisplayValue('');
    expect(input).toBeTruthy();
  });

  it('handles empty string values correctly', () => {
    const { getByDisplayValue } = render(<InputField {...defaultProps} value="" placeholder="" />);

    const input = getByDisplayValue('');
    expect(input).toBeTruthy();
  });

  it('handles multiple prop combinations correctly', () => {
    const { getByTestId } = render(
      <InputField
        {...defaultProps}
        value="test value"
        type="email"
        isPasswordVisible={false}
        isFocused={true}
        placeholder="Enter email"
        disabled={false}
        maxLength={50}
        textColor="#333333"
        cursorColor="#FF5733"
        selectionColor="#C70039"
        testID="email-input"
        accessibilityLabel="Email address"
        accessibilityHint="Enter your email address"
        textInputProps={{
          autoCapitalize: 'none',
          autoCorrect: false,
        }}
      />,
    );

    const input = getByTestId('email-input');
    expect(input).toBeTruthy();
    expect(input.props.value).toBe('test value');
    expect(input.props.keyboardType).toBe('email-address');
    expect(input.props.placeholder).toBe('Enter email');
    expect(input.props.editable).toBe(true);
    expect(input.props.maxLength).toBe(50);
    expect(input.props.accessibilityLabel).toBe('Email address');
    expect(input.props.accessibilityHint).toBe('Enter your email address');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
  });

  it('preserves all required TextInput functionality', () => {
    const props = {
      ...defaultProps,
      value: 'test',
      onChangeText: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
    };

    const { getByDisplayValue } = render(<InputField {...props} />);

    const input = getByDisplayValue('test');

    // Test that all core TextInput props are properly set
    expect(input.props.value).toBe('test');
    expect(input.props.onChangeText).toBe(props.onChangeText);
    expect(input.props.onFocus).not.toBe(props.onFocus); // onFocus is wrapped in handleFocus
    expect(input.props.onBlur).toBe(props.onBlur); // onBlur is passed directly

    // Test that text input events work correctly
    fireEvent.changeText(input, 'new value');
    expect(props.onChangeText).toHaveBeenCalledWith('new value');

    fireEvent(input, 'focus');
    expect(props.onFocus).toHaveBeenCalled();

    fireEvent(input, 'blur');
    expect(props.onBlur).toHaveBeenCalled();
  });
});
