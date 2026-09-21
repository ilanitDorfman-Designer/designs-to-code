import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { HelperText } from './helper-text';

// Mock the EtText component
jest.mock('../../../../foundations/text', () => ({
  EtText: ({ children, style, accessibility, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text style={style} testID={accessibility?.testID} {...props}>
        {children}
      </Text>
    );
  },
}));

const defaultProps = {
  text: 'Helper text message',
  isError: false,
  color: '#666666',
};

describe('HelperText', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<HelperText {...defaultProps} />);

    expect(getByText('Helper text message')).toBeTruthy();
  });

  it('displays the provided text content', () => {
    const customText = 'Custom helper message';
    const { getByText } = render(<HelperText {...defaultProps} text={customText} />);

    expect(getByText(customText)).toBeTruthy();
  });

  it('applies the correct color style', () => {
    const customColor = '#ff0000';
    const { getByText } = render(<HelperText {...defaultProps} color={customColor} />);

    const textElement = getByText('Helper text message');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: customColor,
        }),
      ]),
    );
  });

  it('applies default style properties correctly', () => {
    const { getByText } = render(<HelperText {...defaultProps} />);

    const textElement = getByText('Helper text message');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 12,
          lineHeight: 18,
        }),
        expect.objectContaining({
          color: '#666666',
        }),
      ]),
    );
  });

  it('renders with different colors', () => {
    const colors = ['#000000', '#ffffff', '#ff5733', '#33ff57', '#3357ff'];

    colors.forEach((color) => {
      const { getByText } = render(<HelperText {...defaultProps} color={color} />);

      const textElement = getByText('Helper text message');
      const styles = Array.isArray(textElement.props.style) ? textElement.props.style : [textElement.props.style];
      const colorStyle = styles.find((s: any) => s?.color);
      expect(colorStyle?.color).toBe(color);
    });
  });

  it('renders with different text lengths', () => {
    const texts = [
      'Short',
      'Medium length text',
      'This is a very long helper text message that should still render correctly',
      'Special chars: !@#$%^&*()_+-={}[]|\\:";\'<>?,./',
      '',
    ];

    texts.forEach((text) => {
      const { queryByText } = render(<HelperText {...defaultProps} text={text} />);

      if (text) {
        expect(queryByText(text)).toBeTruthy();
      } else {
        // Empty text should not render anything
        expect(queryByText('')).toBeNull();
      }
    });
  });

  it('applies testID when provided', () => {
    const testID = 'helper-text-test-id';
    const { getByTestId } = render(<HelperText {...defaultProps} testID={testID} />);

    expect(getByTestId(testID)).toBeTruthy();
  });

  it('does not break when testID is not provided', () => {
    const { getByText } = render(<HelperText {...defaultProps} />);

    expect(getByText('Helper text message')).toBeTruthy();
  });

  it('renders with error state (isError prop)', () => {
    // Note: Currently isError prop is defined but not used in implementation
    // This test ensures the component doesn't break when isError is set
    const { getByText } = render(<HelperText {...defaultProps} isError={true} />);

    expect(getByText('Helper text message')).toBeTruthy();
  });

  it('renders with non-error state (isError prop)', () => {
    const { getByText } = render(<HelperText {...defaultProps} isError={false} />);

    expect(getByText('Helper text message')).toBeTruthy();
  });

  it('renders correctly with all props provided', () => {
    const props = {
      text: 'Complete helper text',
      isError: true,
      color: '#e74c3c',
      testID: 'complete-helper-text',
    };

    const { getByTestId, getByText } = render(<HelperText {...props} />);

    const textElement = getByTestId('complete-helper-text');
    expect(textElement).toBeTruthy();
    expect(getByText('Complete helper text')).toBeTruthy();
    const styles = Array.isArray(textElement.props.style) ? textElement.props.style : [textElement.props.style];
    const colorStyle = styles.find((s: any) => s?.color);
    expect(colorStyle?.color).toBe('#e74c3c');
  });

  it('maintains consistent styling structure', () => {
    const { getByText } = render(<HelperText {...defaultProps} />);

    const textElement = getByText('Helper text message');
    const style = textElement.props.style;

    // Verify style is an array
    expect(Array.isArray(style)).toBe(true);

    // Verify all required style properties are present in the array
    const flattenedStyle = StyleSheet.flatten(style) || {};
    expect(flattenedStyle).toHaveProperty('fontSize', 12);
    expect(flattenedStyle).toHaveProperty('lineHeight', 18);
    expect(flattenedStyle).toHaveProperty('color');
  });

  it('handles empty string text gracefully', () => {
    const { root } = render(<HelperText {...defaultProps} text="" />);

    // Component should render even with empty text
    expect(root).toBeTruthy();
  });

  it('handles special characters in text', () => {
    const specialText = 'Special: àáâãäåæçèéêë 中文 😀🎉 <>&"\'';
    const { getByText } = render(<HelperText {...defaultProps} text={specialText} />);

    expect(getByText(specialText)).toBeTruthy();
  });

  it('handles extremely long text', () => {
    const longText = 'A'.repeat(1000);
    const { getByText } = render(<HelperText {...defaultProps} text={longText} />);

    expect(getByText(longText)).toBeTruthy();
  });

  it('passes through the text content to EtText component', () => {
    const testText = 'Test content for EtText';
    const { getByText } = render(<HelperText {...defaultProps} text={testText} />);

    const textElement = getByText(testText);
    expect(textElement.children).toContain(testText);
  });

  it('uses inline styles correctly', () => {
    const { getByText } = render(<HelperText {...defaultProps} />);

    const textElement = getByText('Helper text message');
    const style = textElement.props.style;

    // Verify the style is an array
    expect(Array.isArray(style)).toBe(true);

    // Flatten the array to check properties
    const flattenedStyle = StyleSheet.flatten(style) || {};
    expect(flattenedStyle.fontSize).toBe(12);
    expect(flattenedStyle.lineHeight).toBe(18);
    expect(flattenedStyle.color).toBe('#666666');
  });

  it('accepts different color formats', () => {
    const colorFormats = [
      '#ff0000', // hex
      '#f00', // short hex
      'red', // named color
      'rgb(255, 0, 0)', // rgb
      'rgba(255, 0, 0, 0.5)', // rgba
      'hsl(0, 100%, 50%)', // hsl
    ];

    colorFormats.forEach((color) => {
      const { getByText } = render(<HelperText {...defaultProps} color={color} />);

      const textElement = getByText('Helper text message');
      const styles = Array.isArray(textElement.props.style) ? textElement.props.style : [textElement.props.style];
      const colorStyle = styles.find((s: any) => s?.color);
      expect(colorStyle?.color).toBe(color);
    });
  });
});
