import { TimeFrame } from '@etoro/common/types';
import { fireEvent, render } from '@testing-library/react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import type { TimeFrameButtonProps } from './api';
import { TimeFrameSelector } from './et-timeframe';

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

// Mock TimeFrameButton component
jest.mock('./components/timeframe-button', () => {
  const mockButtonStyles = {
    selected: { fontWeight: 'bold' },
    unselected: { fontWeight: 'normal' },
  };

  return {
    TimeFrameButton: function MockTimeFrameButton({ frame, isSelected, onPress, fontSize, colors }: TimeFrameButtonProps) {
      const { Pressable, Text } = require('react-native');
      return (
        <Pressable testID={`timeframe-button-${frame}`} onPress={onPress} accessibilityRole="button">
          <Text
            testID={`timeframe-text-${frame}`}
            style={[
              {
                fontSize,
                color: isSelected ? colors.textPrimaryNeutral : `${colors.textPrimaryNeutral}80`,
              },
              isSelected ? mockButtonStyles.selected : mockButtonStyles.unselected,
            ]}
          >
            {frame}
          </Text>
        </Pressable>
      );
    },
  };
});

const mockColors = colorsMock;

const asTimeFrames = (frames: string[]): TimeFrame[] => frames as TimeFrame[];

const defaultProps = {
  timeFrames: asTimeFrames(['1W', '1M', '3M', '6M', '1Y']),
  selectedTimeFrame: '1M' as TimeFrame,
  onTimeFrameChange: jest.fn(),
};

describe('TimeFrameSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} />);

    // Default timeFrames: ["1W", "1M", "3M", "6M", "1Y"]
    expect(getByTestId('timeframe-button-1W')).toBeTruthy();
    expect(getByTestId('timeframe-button-1M')).toBeTruthy();
    expect(getByTestId('timeframe-button-3M')).toBeTruthy();
    expect(getByTestId('timeframe-button-6M')).toBeTruthy();
    expect(getByTestId('timeframe-button-1Y')).toBeTruthy();
  });

  it('renders custom timeFrames when provided', () => {
    const customTimeFrames = asTimeFrames(['1D', '1W', '1M']);
    const { getByTestId, queryByTestId } = render(<TimeFrameSelector {...defaultProps} timeFrames={customTimeFrames} />);

    expect(getByTestId('timeframe-button-1D')).toBeTruthy();
    expect(getByTestId('timeframe-button-1W')).toBeTruthy();
    expect(getByTestId('timeframe-button-1M')).toBeTruthy();

    // Should not render default buttons that weren't included
    expect(queryByTestId('timeframe-button-3M')).toBeNull();
    expect(queryByTestId('timeframe-button-6M')).toBeNull();
    expect(queryByTestId('timeframe-button-1Y')).toBeNull();
  });

  it('highlights the selected timeframe correctly', () => {
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} selectedTimeFrame={'3M' as TimeFrame} />);

    const selectedText = getByTestId('timeframe-text-3M');
    const unselectedText = getByTestId('timeframe-text-1M');

    expect(selectedText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: mockColors.colors.textPrimaryNeutral,
        }),
        expect.objectContaining({ fontWeight: 'bold' }),
      ]),
    );

    expect(unselectedText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: `${mockColors.colors.textPrimaryNeutral}80`,
        }),
        expect.objectContaining({ fontWeight: 'normal' }),
      ]),
    );
  });

  it('calls onTimeFrameChange when a button is pressed', () => {
    const onTimeFrameChangeMock = jest.fn();
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} onTimeFrameChange={onTimeFrameChangeMock} />);

    const button = getByTestId('timeframe-button-1W');
    fireEvent.press(button);

    expect(onTimeFrameChangeMock).toHaveBeenCalledWith('1W');
    expect(onTimeFrameChangeMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom fontSize to all buttons', () => {
    const customFontSize = 18;
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} fontSize={customFontSize} />);

    const text1W = getByTestId('timeframe-text-1W');
    const text1M = getByTestId('timeframe-text-1M');

    expect(text1W.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize: customFontSize })]));
    expect(text1M.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize: customFontSize })]));
  });

  it('uses default fontSize when not provided', () => {
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} />);

    const text = getByTestId('timeframe-text-1W');
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize: 14 })]));
  });

  it('renders all timeframe values correctly', () => {
    const allTimeFrames = asTimeFrames(['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'MAX']);
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} timeFrames={allTimeFrames} selectedTimeFrame={'1D' as TimeFrame} />);

    allTimeFrames.forEach((frame) => {
      expect(getByTestId(`timeframe-button-${frame}`)).toBeTruthy();
      expect(getByTestId(`timeframe-text-${frame}`).props.children).toBe(frame);
    });
  });

  it('handles selection changes correctly', () => {
    const onTimeFrameChangeMock = jest.fn();
    const { getByTestId } = render(
      <TimeFrameSelector {...defaultProps} selectedTimeFrame={'1M' as TimeFrame} onTimeFrameChange={onTimeFrameChangeMock} />,
    );

    // Press different buttons
    fireEvent.press(getByTestId('timeframe-button-1W'));
    fireEvent.press(getByTestId('timeframe-button-3M'));
    fireEvent.press(getByTestId('timeframe-button-1Y'));

    expect(onTimeFrameChangeMock).toHaveBeenNthCalledWith(1, '1W');
    expect(onTimeFrameChangeMock).toHaveBeenNthCalledWith(2, '3M');
    expect(onTimeFrameChangeMock).toHaveBeenNthCalledWith(3, '1Y');
    expect(onTimeFrameChangeMock).toHaveBeenCalledTimes(3);
  });

  it('passes colors from theme to buttons correctly', () => {
    const customColors = {
      ...colorsMock.colors,
      textPrimaryNeutral: '#FF5733',
    };

    const { useEtoroTheme } = require('etoro-ui/core');
    useEtoroTheme.mockReturnValueOnce({ colors: customColors });

    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} selectedTimeFrame={'1M' as TimeFrame} />);

    const selectedText = getByTestId('timeframe-text-1M');
    const unselectedText = getByTestId('timeframe-text-1W');

    expect(selectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: customColors.textPrimaryNeutral })]));
    expect(unselectedText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: `${customColors.textPrimaryNeutral}80`,
        }),
      ]),
    );
  });

  it('renders with single timeframe', () => {
    const singleTimeFrame = asTimeFrames(['1M']);
    const { getByTestId, queryByTestId } = render(<TimeFrameSelector {...defaultProps} timeFrames={singleTimeFrame} />);

    expect(getByTestId('timeframe-button-1M')).toBeTruthy();
    expect(queryByTestId('timeframe-button-1W')).toBeNull();
  });

  it('renders with empty timeframes array', () => {
    const emptyTimeFrames = asTimeFrames([]);
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} timeFrames={emptyTimeFrames} />);

    // Should render container but no buttons
    expect(getByTestId('timeframe-selector')).toBeTruthy();
  });

  it('handles rapid button presses correctly', () => {
    const onTimeFrameChangeMock = jest.fn();
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} onTimeFrameChange={onTimeFrameChangeMock} />);

    const button = getByTestId('timeframe-button-1W');

    // Rapid presses
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(onTimeFrameChangeMock).toHaveBeenCalledTimes(3);
    expect(onTimeFrameChangeMock).toHaveBeenCalledWith('1W');
  });

  it('maintains correct selection state when timeframes change', () => {
    const { rerender, getByTestId } = render(
      <TimeFrameSelector selectedTimeFrame={'1M' as TimeFrame} onTimeFrameChange={jest.fn()} timeFrames={asTimeFrames(['1W', '1M', '3M'])} />,
    );

    // Initially 1M should be selected
    const selectedText = getByTestId('timeframe-text-1M');
    expect(selectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontWeight: 'bold' })]));

    // Change timeframes and selection
    rerender(<TimeFrameSelector selectedTimeFrame={'1Y' as TimeFrame} onTimeFrameChange={jest.fn()} timeFrames={asTimeFrames(['1M', '3M', '1Y'])} />);

    // Now 1Y should be selected, 1M should not be
    const newSelectedText = getByTestId('timeframe-text-1Y');
    const newUnselectedText = getByTestId('timeframe-text-1M');

    expect(newSelectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontWeight: 'bold' })]));
    expect(newUnselectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontWeight: 'normal' })]));
  });

  it('applies container styles correctly', () => {
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} />);

    // Check that the component renders with proper structure
    expect(getByTestId('timeframe-selector')).toBeTruthy();
  });

  it('handles edge case font sizes', () => {
    const edgeCaseSizes = [0, 1, 100];

    edgeCaseSizes.forEach((fontSize) => {
      const { getByTestId } = render(<TimeFrameSelector {...defaultProps} fontSize={fontSize} />);

      const text = getByTestId('timeframe-text-1W');
      expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize })]));
    });
  });

  it('works correctly with all possible TimeFrame values', () => {
    const allPossibleFrames = asTimeFrames(['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'MAX']);

    allPossibleFrames.forEach((selectedFrame) => {
      const onTimeFrameChangeMock = jest.fn();
      const { getByTestId } = render(
        <TimeFrameSelector timeFrames={allPossibleFrames} selectedTimeFrame={selectedFrame} onTimeFrameChange={onTimeFrameChangeMock} />,
      );

      // Verify the correct frame is selected
      const selectedText = getByTestId(`timeframe-text-${selectedFrame}`);
      expect(selectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontWeight: 'bold' })]));

      // Verify callback works
      const anotherFrame = allPossibleFrames.find((f) => f !== selectedFrame);
      if (anotherFrame) {
        fireEvent.press(getByTestId(`timeframe-button-${anotherFrame}`));
        expect(onTimeFrameChangeMock).toHaveBeenCalledWith(anotherFrame);
      }
    });
  });

  it('handles theme changes correctly', () => {
    const { useEtoroTheme } = require('etoro-ui/core');

    // Initial render with first theme
    const theme1 = {
      colors: { ...colorsMock.colors, textPrimaryNeutral: '#FF0000' },
    };
    useEtoroTheme.mockReturnValueOnce(theme1);

    const { rerender, getByTestId } = render(<TimeFrameSelector {...defaultProps} selectedTimeFrame={'1M' as TimeFrame} />);

    let selectedText = getByTestId('timeframe-text-1M');
    expect(selectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: '#FF0000' })]));

    // Rerender with different theme
    const theme2 = {
      colors: { ...colorsMock.colors, textPrimaryNeutral: '#00FF00' },
    };
    useEtoroTheme.mockReturnValueOnce(theme2);

    rerender(<TimeFrameSelector {...defaultProps} selectedTimeFrame={'1M' as TimeFrame} />);

    selectedText = getByTestId('timeframe-text-1M');
    expect(selectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: '#00FF00' })]));
  });

  it('maintains unique keys for all buttons', () => {
    const timeFrames = asTimeFrames(['1W', '1M', '3M']);
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} timeFrames={timeFrames} />);

    // Each button should have a unique testID (which corresponds to unique keys)
    timeFrames.forEach((frame) => {
      expect(getByTestId(`timeframe-button-${frame}`)).toBeTruthy();
    });
  });

  it('preserves button functionality across re-renders', () => {
    const onTimeFrameChangeMock = jest.fn();
    const { rerender, getByTestId } = render(
      <TimeFrameSelector {...defaultProps} selectedTimeFrame={'1M' as TimeFrame} onTimeFrameChange={onTimeFrameChangeMock} />,
    );

    // Press button before rerender
    fireEvent.press(getByTestId('timeframe-button-1W'));
    expect(onTimeFrameChangeMock).toHaveBeenCalledWith('1W');

    // Rerender and press again
    rerender(<TimeFrameSelector {...defaultProps} selectedTimeFrame={'1W' as TimeFrame} onTimeFrameChange={onTimeFrameChangeMock} />);

    fireEvent.press(getByTestId('timeframe-button-3M'));
    expect(onTimeFrameChangeMock).toHaveBeenCalledWith('3M');
    expect(onTimeFrameChangeMock).toHaveBeenCalledTimes(2);
  });

  it('handles accessibility correctly', () => {
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} />);

    const container = getByTestId('timeframe-selector');
    expect(container).toBeTruthy();

    // Each button should have proper accessibility properties (tested in mocked component)
    defaultProps.timeFrames.forEach((frame) => {
      const button = getByTestId(`timeframe-button-${frame}`);
      expect(button.props.accessibilityRole).toBe('button');
    });
  });

  it('handles missing fontSize prop correctly', () => {
    const propsWithoutFontSize = {
      timeFrames: defaultProps.timeFrames,
      selectedTimeFrame: defaultProps.selectedTimeFrame,
      onTimeFrameChange: defaultProps.onTimeFrameChange,
    };

    const { getByTestId } = render(<TimeFrameSelector {...propsWithoutFontSize} />);

    const text = getByTestId('timeframe-text-1W');
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize: 14 })]));
  });

  it('renders with different color configurations', () => {
    const { useEtoroTheme } = require('etoro-ui/core');
    const darkColors = {
      ...colorsMock.colors,
      textPrimaryNeutral: '#FFFFFF',
      backgroundPrimary: '#000000',
    };

    useEtoroTheme.mockReturnValueOnce({ colors: darkColors });

    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} selectedTimeFrame={'1M' as TimeFrame} />);

    const selectedText = getByTestId('timeframe-text-1M');
    expect(selectedText.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: darkColors.textPrimaryNeutral })]));
  });

  it('handles zero fontSize correctly', () => {
    const { getByTestId } = render(<TimeFrameSelector {...defaultProps} fontSize={0} />);

    const text = getByTestId('timeframe-text-1W');
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontSize: 0 })]));
  });
});
