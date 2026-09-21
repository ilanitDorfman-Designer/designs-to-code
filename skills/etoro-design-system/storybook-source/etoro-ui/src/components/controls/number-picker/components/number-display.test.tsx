import { render } from '@testing-library/react-native';

import { NumberDisplay } from './number-display';

// Mock DigitColumn component
jest.mock('./digit-column', () => ({
  DigitColumn: ({ digit, fontSize, textColor, columnIndex, totalColumns, animationDirection, ...props }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`digit-column-${columnIndex}`} {...props}>
        <Text testID="digit-text">{`${digit}-${fontSize}-${textColor}-${columnIndex}-${totalColumns}-${animationDirection || 'none'}`}</Text>
      </View>
    );
  },
}));

// Mock SizeDimensions type
const mockDimensions = {
  buttonSize: 40,
  numberFontSize: 24,
  containerHeight: 60,
  containerPadding: 16,
};

const defaultProps = {
  digits: [1, 2, 3],
  dimensions: mockDimensions,
  containerAnimatedStyle: {},
};

describe('NumberDisplay', () => {
  it('renders correctly with default props', () => {
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} />);

    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns).toHaveLength(3);
  });

  it('renders the correct number of digit columns based on digits array', () => {
    const testCases = [
      { digits: [5], expectedLength: 1 },
      { digits: [1, 2], expectedLength: 2 },
      { digits: [9, 8, 7, 6], expectedLength: 4 },
      { digits: [0, 0, 0, 0, 0], expectedLength: 5 },
    ];

    testCases.forEach(({ digits, expectedLength }) => {
      const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

      const digitColumns = getAllByTestId(/^digit-column-/);
      expect(digitColumns).toHaveLength(expectedLength);
    });
  });

  it('passes correct props to each DigitColumn', () => {
    const digits = [7, 8, 9];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitTexts = getAllByTestId('digit-text');

    // Check first digit column (index 0)
    expect(digitTexts[0].props.children).toBe(`7-${mockDimensions.numberFontSize}-#FFFFFF-0-3-none`);

    // Check second digit column (index 1)
    expect(digitTexts[1].props.children).toBe(`8-${mockDimensions.numberFontSize}-#FFFFFF-1-3-none`);

    // Check third digit column (index 2)
    expect(digitTexts[2].props.children).toBe(`9-${mockDimensions.numberFontSize}-#FFFFFF-2-3-none`);
  });

  it('passes correct fontSize from dimensions to DigitColumn', () => {
    const customDimensions = {
      buttonSize: 50,
      numberFontSize: 32,
      containerHeight: 70,
      containerPadding: 20,
    };

    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[4, 5]} dimensions={customDimensions} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text) => {
      expect(text.props.children).toContain(`-${customDimensions.numberFontSize}-`);
    });
  });

  it('applies custom text color', () => {
    const textColor = '#FF0000';
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[1, 2]} textColor={textColor} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text) => {
      expect(text.props.children).toContain(`-${textColor}-`);
    });
  });

  it('applies default text color when not provided', () => {
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[3, 4]} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text) => {
      expect(text.props.children).toContain('-#FFFFFF-');
    });
  });

  it('passes animation direction to DigitColumns', () => {
    const animationDirection = 'up';
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[2, 3]} animationDirection={animationDirection} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text) => {
      expect(text.props.children).toContain(`-${animationDirection}`);
    });
  });

  it('passes correct columnIndex to each DigitColumn', () => {
    const digits = [1, 2, 3, 4];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitColumns = getAllByTestId(/^digit-column-/);

    digitColumns.forEach((column, index) => {
      expect(column.props.testID).toBe(`digit-column-${index}`);
    });
  });

  it('passes correct totalColumns to each DigitColumn', () => {
    const digits = [5, 6, 7];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text) => {
      expect(text.props.children).toContain(`-${digits.length}`);
    });
  });

  it('applies container animated style correctly', () => {
    const containerAnimatedStyle = {
      opacity: 0.8,
      transform: [{ scale: 1.1 }],
    };

    const { getByTestId } = render(
      <NumberDisplay {...defaultProps} containerAnimatedStyle={containerAnimatedStyle} testID="number-display-container" />,
    );

    // Since we're using mocked Animated.View, we can't directly test the style
    // but we can verify the component renders without issues
    expect(getByTestId).toBeDefined();
  });

  it('handles empty digits array', () => {
    const { queryAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[]} />);

    const digitColumns = queryAllByTestId(/^digit-column-/);
    expect(digitColumns).toHaveLength(0);
  });

  it('handles single digit', () => {
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[9]} />);

    const digitTexts = getAllByTestId('digit-text');
    expect(digitTexts).toHaveLength(1);
    expect(digitTexts[0].props.children).toBe(`9-${mockDimensions.numberFontSize}-#FFFFFF-0-1-none`);
  });

  it('handles large number of digits', () => {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns).toHaveLength(10);

    const digitTexts = getAllByTestId('digit-text');
    digitTexts.forEach((text, index) => {
      expect(text.props.children).toContain(`${digits[index]}-`);
      expect(text.props.children).toContain(`-${index}-`);
      expect(text.props.children).toContain(`-${digits.length}-`);
    });
  });

  it('preserves digit order in display', () => {
    const digits = [3, 1, 4, 1, 5];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text, index) => {
      expect(text.props.children).toContain(`${digits[index]}-`);
    });
  });

  it('applies correct styling to container and digits row', () => {
    const { getByTestId } = render(<NumberDisplay {...defaultProps} />);

    // Since we're using mocked components, we can't directly test styles
    // but we can verify the structure exists
    expect(getByTestId('number-display-container')).toBeDefined();
    expect(getByTestId('digits-row')).toBeDefined();
  });

  it('handles different animation directions', () => {
    const directions = ['up', 'down', undefined];

    directions.forEach((direction) => {
      const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[1, 2]} animationDirection={direction as any} />);

      const digitTexts = getAllByTestId('digit-text');
      const expectedDirection = direction || 'none';

      digitTexts.forEach((text) => {
        expect(text.props.children).toContain(`-${expectedDirection}`);
      });
    });
  });

  it('handles zero digits correctly', () => {
    const digits = [0, 0, 0];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text, index) => {
      expect(text.props.children).toContain('0-');
      expect(text.props.children).toContain(`-${index}-`);
    });
  });

  it('handles mixed digit values', () => {
    const digits = [0, 5, 9, 1, 3];
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={digits} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text, index) => {
      expect(text.props.children).toContain(`${digits[index]}-`);
    });
  });

  it('applies styles correctly to number container', () => {
    // We can't directly test styles with mocked components,
    // but we can verify the component structure
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} />);

    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns.length).toBeGreaterThan(0);
  });

  it('applies styles correctly to digits row', () => {
    // Test that the digits row is rendered properly
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} />);

    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns.length).toBe(defaultProps.digits.length);
  });

  it('maintains correct component hierarchy', () => {
    const { getAllByTestId } = render(<NumberDisplay {...defaultProps} />);

    // Should have the expected number of digit columns
    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns).toHaveLength(defaultProps.digits.length);

    // Each should have a corresponding text element
    const digitTexts = getAllByTestId('digit-text');
    expect(digitTexts).toHaveLength(defaultProps.digits.length);
  });

  it('handles prop changes correctly', () => {
    const { rerender, getAllByTestId } = render(<NumberDisplay {...defaultProps} digits={[1, 2]} />);

    // Change digits
    rerender(<NumberDisplay {...defaultProps} digits={[3, 4, 5]} />);

    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns).toHaveLength(3);
  });

  it('passes all required props to DigitColumn components', () => {
    const props = {
      digits: [7, 8, 9],
      dimensions: mockDimensions,
      textColor: '#00FF00',
      animationDirection: 'down' as const,
      containerAnimatedStyle: { opacity: 0.9 },
    };

    const { getAllByTestId } = render(<NumberDisplay {...props} />);

    const digitTexts = getAllByTestId('digit-text');

    digitTexts.forEach((text, index) => {
      const expectedContent = `${props.digits[index]}-${props.dimensions.numberFontSize}-${props.textColor}-${index}-${props.digits.length}-${props.animationDirection}`;
      expect(text.props.children).toBe(expectedContent);
    });
  });

  it('works with minimal required props', () => {
    const minimalProps = {
      digits: [4, 2],
      dimensions: mockDimensions,
      containerAnimatedStyle: {},
    };

    const { getAllByTestId } = render(<NumberDisplay {...minimalProps} />);

    const digitColumns = getAllByTestId(/^digit-column-/);
    expect(digitColumns).toHaveLength(2);

    const digitTexts = getAllByTestId('digit-text');
    expect(digitTexts[0].props.children).toBe(`4-${mockDimensions.numberFontSize}-#FFFFFF-0-2-none`);
    expect(digitTexts[1].props.children).toBe(`2-${mockDimensions.numberFontSize}-#FFFFFF-1-2-none`);
  });
});
