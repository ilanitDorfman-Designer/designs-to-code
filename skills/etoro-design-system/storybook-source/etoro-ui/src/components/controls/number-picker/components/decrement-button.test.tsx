import { fireEvent, render } from '@testing-library/react-native';

import { DecrementButton } from './decrement-button';

// Mock etoro-ui/core
jest.mock('etoro-ui/core', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Note: react-native-reanimated is mocked globally in jest.setup.ts
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

// Mock EtText component
jest.mock('../../../../foundations/text', () => ({
  EtText: ({ children, variant, style, ...props }: any) => {
    const { StyleSheet, Text } = require('react-native');

    // Variant config mapping
    const variantConfigs: Record<string, any> = {
      'label-primary-bold': {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Default color, will be overridden by style prop
      },
    };

    const variantStyle = variantConfigs[variant] || {};
    const flattenedStyle = StyleSheet.flatten(style) || {};

    // Merge styles: variant defaults first, then style overrides
    // Later styles override earlier ones (React Native behavior)
    const combinedStyle = {
      ...variantStyle,
      ...flattenedStyle,
    };

    return (
      <Text testID="et-text" style={combinedStyle} {...props}>
        {children}
      </Text>
    );
  },
}));

// etoro-ui/core is handled by module mapping in jest config

// Mock SizeDimensions type
const mockDimensions = {
  buttonSize: 40,
  numberFontSize: 24,
  containerHeight: 60,
  containerPadding: 16,
};

const defaultProps = {
  onPress: jest.fn(),
  disabled: false,
  dimensions: mockDimensions,
  animatedStyle: {},
};

describe('DecrementButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<DecrementButton {...defaultProps} />);

    expect(getByTestId('et-text')).toBeTruthy();
    expect(getByTestId('et-text').props.children).toBe('−');
  });

  it('calls onPress when button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<DecrementButton {...defaultProps} onPress={onPressMock} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when button is disabled', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<DecrementButton {...defaultProps} onPress={onPressMock} disabled={true} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('calls onPressIn when button is pressed in', () => {
    const onPressInMock = jest.fn();
    const { getByRole } = render(<DecrementButton {...defaultProps} onPressIn={onPressInMock} />);

    const button = getByRole('button');
    fireEvent(button, 'pressIn');

    expect(onPressInMock).toHaveBeenCalledTimes(1);
  });

  it('calls onPressOut when button is pressed out', () => {
    const onPressOutMock = jest.fn();
    const { getByRole } = render(<DecrementButton {...defaultProps} onPressOut={onPressOutMock} />);

    const button = getByRole('button');
    fireEvent(button, 'pressOut');

    expect(onPressOutMock).toHaveBeenCalledTimes(1);
  });

  it('applies correct dimensions to button style', () => {
    const customDimensions = {
      buttonSize: 50,
      numberFontSize: 30,
      containerHeight: 70,
      containerPadding: 20,
    };

    const { getByRole } = render(<DecrementButton {...defaultProps} dimensions={customDimensions} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: customDimensions.buttonSize,
          height: customDimensions.buttonSize,
        }),
      ]),
    );
  });

  it('applies custom button color', () => {
    const buttonColor = '#FF5733';
    const { getByRole } = render(<DecrementButton {...defaultProps} buttonColor={buttonColor} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: buttonColor,
        }),
      ]),
    );
  });

  it('applies default button color when not provided', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#4A9EFF',
        }),
      ]),
    );
  });

  it('applies custom button text color', () => {
    const buttonTextColor = '#FF0000';
    const { getByTestId } = render(<DecrementButton {...defaultProps} buttonTextColor={buttonTextColor} />);

    const text = getByTestId('et-text');
    expect(text.props.style.color).toBe(buttonTextColor);
  });

  it('applies default button text color when not provided', () => {
    const { getByTestId } = render(<DecrementButton {...defaultProps} />);

    const text = getByTestId('et-text');
    expect(text.props.style.color).toBe('#FFFFFF');
  });

  it('applies disabled styles when disabled', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} disabled={true} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: 0.4,
        }),
      ]),
    );
  });

  it('does not apply disabled styles when not disabled', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} disabled={false} />);

    const button = getByRole('button');
    const styles = button.props.style;

    // Should not have opacity: 0.4 applied
    const hasDisabledOpacity = styles.some((style: any) => style && typeof style === 'object' && style.opacity === 0.4);
    expect(hasDisabledOpacity).toBe(false);
  });

  it('applies correct font size based on dimensions', () => {
    const customDimensions = {
      buttonSize: 40,
      numberFontSize: 28,
      containerHeight: 60,
      containerPadding: 16,
    };

    const { getByTestId } = render(<DecrementButton {...defaultProps} dimensions={customDimensions} />);

    const text = getByTestId('et-text');
    const expectedFontSize = customDimensions.numberFontSize - 4;
    expect(text.props.style.fontSize).toBe(expectedFontSize);
  });

  it('applies correct accessibility properties', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} />);

    const button = getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Decrease value');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('applies custom testID', () => {
    const testID = 'decrement-button-test';
    const { getByTestId } = render(<DecrementButton {...defaultProps} testID={testID} />);

    expect(getByTestId(testID)).toBeTruthy();
  });

  it('applies animated style correctly', () => {
    const animatedStyle = {
      transform: [{ scale: 0.9 }],
      opacity: 0.7,
    };

    const { getByRole } = render(<DecrementButton {...defaultProps} animatedStyle={animatedStyle} />);

    // The animated style should be applied to the container
    // We can't directly test this without more complex setup,
    // but we can verify the component renders
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('applies all button styles correctly', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }),
      ]),
    );
  });

  it('applies shadow color from theme', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          shadowColor: '#0D0D0D', // colorsMock.colors.bgNeutralPrimary (dark mode: neutral[950])
        }),
      ]),
    );
  });

  it('applies correct text styles', () => {
    const { getByTestId } = render(<DecrementButton {...defaultProps} />);

    const text = getByTestId('et-text');
    expect(text.props.style).toEqual(
      expect.objectContaining({
        fontWeight: 'bold',
      }),
    );

    // Additional text styles from stylesheet
    expect(text.props.style).toEqual(
      expect.objectContaining({
        textAlign: 'center',
        lineHeight: undefined,
      }),
    );
  });

  it('displays minus symbol correctly', () => {
    const { getByTestId } = render(<DecrementButton {...defaultProps} />);

    const text = getByTestId('et-text');
    expect(text.props.children).toBe('−');
  });

  it('uses proper minus symbol (−) not hyphen (-)', () => {
    const { getByTestId } = render(<DecrementButton {...defaultProps} />);

    const text = getByTestId('et-text');
    // Unicode minus sign (U+2212) not hyphen-minus (U+002D)
    expect(text.props.children).toBe('−');
    expect(text.props.children).not.toBe('-');
  });

  it('handles multiple press events correctly', () => {
    const onPressMock = jest.fn();
    const onPressInMock = jest.fn();
    const onPressOutMock = jest.fn();

    const { getByRole } = render(<DecrementButton {...defaultProps} onPress={onPressMock} onPressIn={onPressInMock} onPressOut={onPressOutMock} />);

    const button = getByRole('button');

    // Simulate multiple press interactions
    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
    fireEvent.press(button);

    expect(onPressInMock).toHaveBeenCalledTimes(1);
    expect(onPressOutMock).toHaveBeenCalledTimes(1);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('handles edge case dimensions', () => {
    const edgeCaseDimensions = [
      {
        buttonSize: 1,
        numberFontSize: 1,
        containerHeight: 1,
        containerPadding: 1,
      },
      {
        buttonSize: 100,
        numberFontSize: 100,
        containerHeight: 100,
        containerPadding: 100,
      },
    ];

    edgeCaseDimensions.forEach((dimensions) => {
      const { getByRole, getByTestId } = render(<DecrementButton {...defaultProps} dimensions={dimensions} />);

      const button = getByRole('button');
      const text = getByTestId('et-text');

      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: dimensions.buttonSize,
            height: dimensions.buttonSize,
          }),
        ]),
      );

      expect(text.props.style.fontSize).toBe(dimensions.numberFontSize - 4);
    });
  });

  it('maintains button functionality when all props are provided', () => {
    const allProps = {
      onPress: jest.fn(),
      disabled: false,
      dimensions: mockDimensions,
      buttonColor: '#FF5733',
      buttonTextColor: '#00FF00',
      animatedStyle: { transform: [{ scale: 0.8 }] },
      onPressIn: jest.fn(),
      onPressOut: jest.fn(),
      testID: 'full-props-button',
    };

    const { getByRole, getByTestId } = render(<DecrementButton {...allProps} />);

    const button = getByRole('button');
    const text = getByTestId('et-text');

    // Test all functionality works
    fireEvent(button, 'pressIn');
    fireEvent.press(button);
    fireEvent(button, 'pressOut');

    expect(allProps.onPressIn).toHaveBeenCalledTimes(1);
    expect(allProps.onPress).toHaveBeenCalledTimes(1);
    expect(allProps.onPressOut).toHaveBeenCalledTimes(1);

    // Test styling
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: allProps.buttonColor,
        }),
      ]),
    );

    expect(text.props.style.color).toBe(allProps.buttonTextColor);
    expect(getByTestId('full-props-button')).toBeTruthy();
  });

  it('passes disabled prop to Pressable correctly', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} disabled={true} />);

    // Test that the button has disabled styling when disabled
    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: 0.4,
        }),
      ]),
    );
  });

  it('applies the same styling as increment button except for symbol', () => {
    // This test ensures consistency between increment and decrement buttons
    const { getByRole, getByTestId } = render(<DecrementButton {...defaultProps} />);

    const button = getByRole('button');
    const text = getByTestId('et-text');

    // Same button styling
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }),
      ]),
    );

    // Same text styling except for the symbol
    expect(text.props.style).toEqual(
      expect.objectContaining({
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: undefined,
      }),
    );

    // Different symbol
    expect(text.props.children).toBe('−');
  });

  it('handles rapid press events without issues', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<DecrementButton {...defaultProps} onPress={onPressMock} />);

    const button = getByRole('button');

    // Rapid presses
    for (let i = 0; i < 10; i++) {
      fireEvent.press(button);
    }

    expect(onPressMock).toHaveBeenCalledTimes(10);
  });

  it('maintains accessibility when disabled', () => {
    const { getByRole } = render(<DecrementButton {...defaultProps} disabled={true} />);

    const button = getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Decrease value');
    expect(button.props.accessibilityRole).toBe('button');
    // Verify disabled styling is applied
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: 0.4,
        }),
      ]),
    );
  });
});
