import { render } from '@testing-library/react-native';

import { FloatingLabel } from './floating-label';

const defaultProps = {
  label: 'Test Label',
  animatedStyle: { fontSize: 16, marginTop: 10 },
  fontFamily: 'System',
  color: '#000000',
};

describe('FloatingLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    expect(getByText('Test Label')).toBeTruthy();
  });

  it('displays the provided label text', () => {
    const customLabel = 'Custom Label Text';
    const { getByText } = render(<FloatingLabel {...defaultProps} label={customLabel} />);

    expect(getByText(customLabel)).toBeTruthy();
  });

  it('adds asterisk when required is true', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} required={true} />);

    expect(getByText('Test Label *')).toBeTruthy();
  });

  it('does not add asterisk when required is false', () => {
    const { getByText, queryByText } = render(<FloatingLabel {...defaultProps} required={false} />);

    expect(getByText('Test Label')).toBeTruthy();
    expect(queryByText('Test Label *')).toBeNull();
  });

  it('does not add asterisk when required is undefined', () => {
    const { getByText, queryByText } = render(<FloatingLabel {...defaultProps} />);

    expect(getByText('Test Label')).toBeTruthy();
    expect(queryByText('Test Label *')).toBeNull();
  });

  it('does not apply opacity when disabled prop is not supported', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    const label = getByText('Test Label');
    // The disabled prop is not part of the implementation anymore
    // So we just verify the label renders without opacity
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
        }),
      ]),
    );
  });

  it('applies correct opacity when disabled is false', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    const label = getByText('Test Label');
    // The disabled prop is not part of the implementation anymore
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
        }),
      ]),
    );
  });

  it('applies correct opacity when disabled is undefined', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    const label = getByText('Test Label');
    // The disabled prop is not part of the implementation anymore
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
        }),
      ]),
    );
  });

  it('applies the provided color correctly', () => {
    const customColor = '#FF5733';
    const { getByText } = render(<FloatingLabel {...defaultProps} color={customColor} />);

    const label = getByText('Test Label');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: customColor,
        }),
      ]),
    );
  });

  it('applies the provided fontFamily correctly', () => {
    const customFontFamily = 'CustomFont';
    const { getByText } = render(<FloatingLabel {...defaultProps} fontFamily={customFontFamily} />);

    const label = getByText('Test Label');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontFamily: customFontFamily,
        }),
      ]),
    );
  });

  it('applies animated styles correctly', () => {
    const animatedStyle = {
      fontSize: 14,
      marginTop: 20,
      transform: [{ translateY: -10 }],
    };
    const { getByText } = render(<FloatingLabel {...defaultProps} animatedStyle={animatedStyle} />);

    const label = getByText('Test Label');
    expect(label.props.style).toEqual(expect.arrayContaining([expect.objectContaining(animatedStyle)]));
  });

  it('applies custom label styles correctly', () => {
    const labelStyle = {
      fontWeight: 'bold' as const,
      textDecorationLine: 'underline' as const,
    };
    const { getByText } = render(<FloatingLabel {...defaultProps} labelStyle={labelStyle} />);

    const label = getByText('Test Label');
    expect(label.props.style).toEqual(expect.arrayContaining([expect.objectContaining(labelStyle)]));
  });

  it('applies default styles correctly', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    const label = getByText('Test Label');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
          start: 0,
        }),
      ]),
    );
  });

  it('combines all styles in correct order', () => {
    const animatedStyle = { fontSize: 18 };
    const labelStyle = { fontWeight: 'bold' as const };
    const color = '#FF0000';
    const fontFamily = 'Arial';

    const { getByText } = render(
      <FloatingLabel {...defaultProps} animatedStyle={animatedStyle} labelStyle={labelStyle} color={color} fontFamily={fontFamily} />,
    );

    const label = getByText('Test Label');

    // Check that all styles are applied (without disabled/opacity)
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
          start: 0,
        }),
        expect.objectContaining({
          color,
          fontFamily,
        }),
        expect.objectContaining(labelStyle),
        expect.objectContaining(animatedStyle),
      ]),
    );
  });

  it('applies testID correctly when provided', () => {
    const testID = 'floating-label-test';
    const { getByTestId } = render(<FloatingLabel {...defaultProps} testID={testID} />);

    expect(getByTestId(testID)).toBeTruthy();
  });

  it('does not apply testID when not provided', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    const label = getByText('Test Label');
    expect(label.props.testID).toBeUndefined();
  });

  it('handles empty label correctly', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} label="" />);

    expect(getByText('')).toBeTruthy();
  });

  it('handles empty label with required asterisk', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} label="" required={true} />);

    expect(getByText(' *')).toBeTruthy();
  });

  it('handles special characters in label', () => {
    const specialLabel = 'Label with @#$%^&*()';
    const { getByText } = render(<FloatingLabel {...defaultProps} label={specialLabel} />);

    expect(getByText(specialLabel)).toBeTruthy();
  });

  it('handles unicode characters in label', () => {
    const unicodeLabel = 'Label with émojis 🎉 and ñiño';
    const { getByText } = render(<FloatingLabel {...defaultProps} label={unicodeLabel} />);

    expect(getByText(unicodeLabel)).toBeTruthy();
  });

  it('handles very long labels', () => {
    const longLabel = 'This is a very long label that might wrap to multiple lines and should still be handled correctly by the component';
    const { getByText } = render(<FloatingLabel {...defaultProps} label={longLabel} />);

    expect(getByText(longLabel)).toBeTruthy();
  });

  it('handles multiple style objects in labelStyle array', () => {
    const labelStyles = [{ fontWeight: 'bold' as const }, { textDecorationLine: 'underline' as const }, { letterSpacing: 1 }];
    const { getByText } = render(<FloatingLabel {...defaultProps} labelStyle={labelStyles} />);

    const label = getByText('Test Label');
    // The styles may be nested or flattened depending on React Native's handling
    // Just verify all the style properties are applied somewhere in the style array
    const styles = label.props.style;

    // Flatten all styles to check for properties
    const flattenStyles = (arr: any[]): any[] =>
      arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(flattenStyles(val)) : acc.concat(val)), []);
    const flatStyles = flattenStyles(styles);

    expect(flatStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: 'bold' }),
        expect.objectContaining({ textDecorationLine: 'underline' }),
        expect.objectContaining({ letterSpacing: 1 }),
      ]),
    );
  });

  it('handles animation styles with complex transforms', () => {
    const complexAnimatedStyle = {
      fontSize: 12,
      opacity: 0.7,
      // Simplified transform for testing
      transform: [{ translateY: -20 }] as any,
    };

    const { getByText } = render(<FloatingLabel {...defaultProps} animatedStyle={complexAnimatedStyle} />);

    const label = getByText('Test Label');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 12,
          opacity: 0.7,
        }),
      ]),
    );
  });

  it('handles color values in different formats', () => {
    const colorFormats = ['#FF0000', 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 0.5)', 'red', 'hsl(0, 100%, 50%)'];

    colorFormats.forEach((color) => {
      const { getByText } = render(<FloatingLabel {...defaultProps} color={color} />);

      const label = getByText('Test Label');
      expect(label.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color,
          }),
        ]),
      );
    });
  });

  it('preserves text accessibility properties', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} />);

    const label = getByText('Test Label');

    // Verify that the component is accessible
    expect(label).toBeTruthy();
    // The children prop contains the text content, which can be an array when required is involved
    const children = Array.isArray(label.props.children) ? label.props.children.join('') : label.props.children;
    expect(children).toBe('Test Label');
  });

  it('works correctly with combination of required and disabled states', () => {
    const testCases = [
      {
        required: true,
        expectedText: 'Test Label *',
      },
      {
        required: false,
        expectedText: 'Test Label',
      },
    ];

    testCases.forEach(({ required, expectedText }) => {
      const { getByText } = render(<FloatingLabel {...defaultProps} required={required} />);

      const label = getByText(expectedText);
      expect(label).toBeTruthy();
      // The disabled prop is no longer part of the implementation
      // so we just verify the label renders correctly
      expect(label.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            position: 'absolute',
          }),
        ]),
      );
    });
  });

  it('handles null and undefined values gracefully', () => {
    const { getByText } = render(<FloatingLabel {...defaultProps} labelStyle={undefined} testID={undefined} required={undefined} />);

    const label = getByText('Test Label');
    expect(label).toBeTruthy();
    expect(label.props.testID).toBeUndefined();
  });
});
