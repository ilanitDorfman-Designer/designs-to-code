import { TimeFrame } from '@etoro/common/types';
import { fireEvent, render } from '@testing-library/react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { TimeFrameButton } from './timeframe-button';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

const mockColors = colorsMock;

const defaultProps = {
  frame: '1M' as TimeFrame,
  isSelected: false,
  onPress: jest.fn(),
  fontSize: 14,
  colors: mockColors.colors,
};

describe('TimeFrameButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<TimeFrameButton {...defaultProps} />);

    expect(getByText('1M')).toBeTruthy();
  });

  it('renders correctly when selected', () => {
    const { getByText } = render(<TimeFrameButton {...defaultProps} isSelected={true} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: mockColors.colors.textPrimaryNeutral,
        }),
      ]),
    );
  });

  it('renders correctly when not selected', () => {
    const { getByText } = render(<TimeFrameButton {...defaultProps} isSelected={false} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: `${mockColors.colors.textPrimaryNeutral}80`,
        }),
      ]),
    );
  });

  it('calls onPress when button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<TimeFrameButton {...defaultProps} onPress={onPressMock} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('triggers haptic feedback by default when pressed', () => {
    const { impactAsync } = require('expo-haptics');
    const { getByRole } = render(<TimeFrameButton {...defaultProps} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(impactAsync).toHaveBeenCalledWith('light');
  });

  it('does not trigger haptic feedback when withHaptics is false', () => {
    const { impactAsync } = require('expo-haptics');
    const { getByRole } = render(<TimeFrameButton {...defaultProps} withHaptics={false} />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(impactAsync).not.toHaveBeenCalled();
  });

  it('applies correct font size', () => {
    const customFontSize = 18;
    const { getByText } = render(<TimeFrameButton {...defaultProps} fontSize={customFontSize} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: customFontSize,
        }),
      ]),
    );
  });

  it('displays different time frame values correctly', () => {
    const timeFrames: TimeFrame[] = ['1W', '3M', '6M', '1Y', '5Y', 'MAX'];

    timeFrames.forEach((frame) => {
      const { getByText } = render(<TimeFrameButton {...defaultProps} frame={frame} />);
      expect(getByText(frame)).toBeTruthy();
    });
  });

  it('handles press in and press out events', () => {
    const { getByRole } = render(<TimeFrameButton {...defaultProps} />);

    const button = getByRole('button');

    // These should not throw errors
    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
  });

  it('applies correct button styles', () => {
    const { getByRole } = render(<TimeFrameButton {...defaultProps} />);

    const button = getByRole('button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          minWidth: 44,
          justifyContent: 'center',
          alignItems: 'center',
        }),
      ]),
    );
  });

  it('applies correct text styles', () => {
    const { getByText } = render(<TimeFrameButton {...defaultProps} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontWeight: 'bold',
          textAlign: 'center',
        }),
      ]),
    );
  });

  it('handles color parsing correctly with valid hex color', () => {
    const validHexColor = '#FF5733';
    const customColors = {
      ...mockColors.colors,
      textPrimaryNeutral: validHexColor,
    };

    const { getByText } = render(<TimeFrameButton {...defaultProps} colors={customColors} isSelected={true} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: validHexColor,
        }),
      ]),
    );
  });

  it('handles color parsing correctly with short hex color', () => {
    const shortHexColor = '#FFF';
    const customColors = { ...mockColors, text: shortHexColor };

    // Should not throw error and render correctly
    const { getByText } = render(<TimeFrameButton {...defaultProps} colors={customColors.colors} />);

    expect(getByText('1M')).toBeTruthy();
  });

  it('handles color parsing correctly with invalid color format', () => {
    const invalidColor = 'invalid-color';
    const customColors = { ...mockColors, text: invalidColor };

    // Should not throw error and use fallback
    const { getByText } = render(<TimeFrameButton {...defaultProps} colors={customColors.colors} />);

    expect(getByText('1M')).toBeTruthy();
  });

  it('maintains button functionality with all optional props', () => {
    const onPressMock = jest.fn();
    const { impactAsync } = require('expo-haptics');

    const { getByRole, getByText } = render(
      <TimeFrameButton frame="1Y" isSelected={true} onPress={onPressMock} fontSize={16} colors={mockColors.colors} withHaptics={true} />,
    );

    const button = getByRole('button');
    const text = getByText('1Y');

    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(impactAsync).toHaveBeenCalledWith('light');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          color: mockColors.colors.textPrimaryNeutral,
        }),
      ]),
    );
  });

  it('handles multiple rapid presses correctly', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<TimeFrameButton {...defaultProps} onPress={onPressMock} />);

    const button = getByRole('button');

    // Simulate rapid presses
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(3);
  });

  it('handles press interactions correctly', () => {
    const { getByRole } = render(<TimeFrameButton {...defaultProps} />);

    const button = getByRole('button');

    // Test press sequence
    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
    fireEvent.press(button);

    // Should not throw errors
    expect(button).toBeTruthy();
  });

  it('works correctly with extreme font sizes', () => {
    const extremeSizes = [1, 100];

    extremeSizes.forEach((fontSize) => {
      const { getByText } = render(<TimeFrameButton {...defaultProps} fontSize={fontSize} />);

      const text = getByText('1M');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: fontSize,
          }),
        ]),
      );
    });
  });

  it('renders correctly with edge case time frame values', () => {
    const edgeCases: TimeFrame[] = ['1D', 'MAX'];

    edgeCases.forEach((frame) => {
      const { getByText } = render(<TimeFrameButton {...defaultProps} frame={frame} />);
      expect(getByText(frame)).toBeTruthy();
    });
  });

  it('maintains state consistency when selection changes rapidly', () => {
    const { rerender, getByText } = render(<TimeFrameButton {...defaultProps} isSelected={false} />);

    // Rapid selection changes
    rerender(<TimeFrameButton {...defaultProps} isSelected={true} />);
    rerender(<TimeFrameButton {...defaultProps} isSelected={false} />);
    rerender(<TimeFrameButton {...defaultProps} isSelected={true} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: mockColors.colors.textPrimaryNeutral,
        }),
      ]),
    );
  });

  it('handles disabled haptics with different time frames', () => {
    const { impactAsync } = require('expo-haptics');
    const timeFrames: TimeFrame[] = ['1W', '3M', '1Y'];

    timeFrames.forEach((frame) => {
      jest.clearAllMocks();

      const { getByRole } = render(<TimeFrameButton {...defaultProps} frame={frame} withHaptics={false} />);

      const button = getByRole('button');
      fireEvent.press(button);

      expect(impactAsync).not.toHaveBeenCalled();
    });
  });

  it('applies animated styles correctly', () => {
    const { getByRole } = render(<TimeFrameButton {...defaultProps} />);

    const button = getByRole('button');

    // The animated styles should be applied (we can't test the exact values
    // due to mocking, but we can verify the component renders)
    expect(button).toBeTruthy();
    expect(button.props.style).toBeDefined();
  });

  it('has proper testID for automation', () => {
    const { getByTestId } = render(<TimeFrameButton {...defaultProps} frame="1Y" />);

    expect(getByTestId('timeframe-button-1Y')).toBeTruthy();
    expect(getByTestId('timeframe-text-1Y')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByRole } = render(<TimeFrameButton {...defaultProps} frame="3M" />);

    const button = getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Select 3M timeframe');
  });

  it('handles withHaptics default value correctly', () => {
    const { impactAsync } = require('expo-haptics');
    const propsWithoutHaptics = {
      frame: '1M' as TimeFrame,
      isSelected: false,
      onPress: jest.fn(),
      fontSize: 14,
      colors: mockColors.colors,
    };

    const { getByRole } = render(<TimeFrameButton {...propsWithoutHaptics} />);

    const button = getByRole('button');
    fireEvent.press(button);

    // Should trigger haptics by default
    expect(impactAsync).toHaveBeenCalledWith('light');
  });

  it('renders correctly with minimal required props', () => {
    const minimalProps = {
      frame: '1W' as TimeFrame,
      isSelected: true,
      onPress: jest.fn(),
      fontSize: 12,
      colors: mockColors.colors,
    };

    const { getByText, getByRole } = render(<TimeFrameButton {...minimalProps} />);

    expect(getByText('1W')).toBeTruthy();
    expect(getByRole('button')).toBeTruthy();
  });

  it('handles selection state changes correctly', () => {
    const { rerender, getByText } = render(<TimeFrameButton {...defaultProps} isSelected={false} />);

    let text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: `${mockColors.colors.textPrimaryNeutral}80`,
        }),
      ]),
    );

    rerender(<TimeFrameButton {...defaultProps} isSelected={true} />);

    text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: mockColors.colors.textPrimaryNeutral,
        }),
      ]),
    );
  });

  it('maintains consistent text styling', () => {
    const { getByText } = render(<TimeFrameButton {...defaultProps} />);

    const text = getByText('1M');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontWeight: 'bold',
          textAlign: 'center',
        }),
      ]),
    );
  });

  it('handles all TimeFrame union type values', () => {
    const allTimeFrames: TimeFrame[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

    allTimeFrames.forEach((frame) => {
      const { getByText, getByTestId } = render(<TimeFrameButton {...defaultProps} frame={frame} />);

      expect(getByText(frame)).toBeTruthy();
      expect(getByTestId(`timeframe-button-${frame}`)).toBeTruthy();
      expect(getByTestId(`timeframe-text-${frame}`)).toBeTruthy();
    });
  });

  it('does not break with unusual color values', () => {
    const unusualColors = {
      ...mockColors,
      text: '', // Empty string
    };

    // Should not throw error
    const { getByText } = render(<TimeFrameButton {...defaultProps} colors={unusualColors.colors} />);

    expect(getByText('1M')).toBeTruthy();
  });

  it('handles zero and negative fontSize values', () => {
    const sizes = [0, -1, -10];

    sizes.forEach((fontSize) => {
      const { getByText } = render(<TimeFrameButton {...defaultProps} fontSize={fontSize} />);

      const text = getByText('1M');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: fontSize,
          }),
        ]),
      );
    });
  });
});
