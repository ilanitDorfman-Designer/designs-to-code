import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { NumericKeypadView } from '../subcomponents/numeric-keypad-view';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('../../../../foundations/text', () => {
  const { Text } = require('react-native');
  return {
    EtText: function MockEtText({ children, ...props }: any) {
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('react-native-svg', () => require('./keypad-test-mocks').createSvgMock({ svgTestID: 'svg-clear-badge' }));

// This suite also exercises the top-band drag-to-dismiss pan, so it opts into the shared mock's pan
// wiring (`onSwipeDown` / `onSwipeDownShort`); see `keypad-test-mocks` for details.
jest.mock('react-native-gesture-handler', () => require('./keypad-test-mocks').createGestureHandlerMock({ panSwipe: true }));

const ALL_NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

// Entrance animation is disabled in tests for determinism; behavior is identical.
const baseProps = { accessibilityLabel: 'Numeric keyboard', animateEntrance: false, deleteLabel: 'Delete' } as const;

describe('NumericKeypadView — onKeyPress', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each(ALL_NUMBER_KEYS)('emits "%s" when the numeric key is pressed', (digit) => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={onKeyPress} testID="kb" />);
    fireEvent.press(getByTestId(`kb-key-${digit}`));
    expect(onKeyPress).toHaveBeenCalledTimes(1);
    expect(onKeyPress).toHaveBeenCalledWith(digit);
  });

  it('emits "." when the dot key is pressed', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={onKeyPress} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-.'));
    expect(onKeyPress).toHaveBeenCalledWith('.');
  });
});

describe('NumericKeypadView — onClear', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls onClear when the C key is pressed', () => {
    const onClear = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={onClear} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does NOT forward C to onKeyPress', () => {
    const onKeyPress = jest.fn();
    const onClear = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={onKeyPress} onClear={onClear} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('does not throw when onClear is not provided and C is pressed', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);
    expect(() => fireEvent.press(getByTestId('kb-key-C'))).not.toThrow();
  });

  it('C key is disabled when onClear is not provided', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);
    expect(getByTestId('kb-key-C').props.accessibilityState?.disabled).toBe(true);
  });

  it('C key is enabled when onClear is provided', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={jest.fn()} testID="kb" />);
    expect(getByTestId('kb-key-C').props.accessibilityState?.disabled).not.toBe(true);
  });
});

describe('NumericKeypadView — onClearAll (long-press on C)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls onClearAll when the C key is long-pressed', () => {
    const onClearAll = jest.fn();
    const { getByTestId } = render(
      <NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={jest.fn()} onClearAll={onClearAll} testID="kb" />,
    );
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClear on long-press (RN suppresses onPress when onLongPress fires)', () => {
    const onClear = jest.fn();
    const onClearAll = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={onClear} onClearAll={onClearAll} testID="kb" />);
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(onClear).not.toHaveBeenCalled();
  });

  it('still calls onClear on a short press when onClearAll is also provided', () => {
    const onClear = jest.fn();
    const onClearAll = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={onClear} onClearAll={onClearAll} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onClearAll).not.toHaveBeenCalled();
  });

  it('fires a Medium haptic on long-press when haptics is enabled (default)', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(
      <NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={jest.fn()} onClearAll={jest.fn()} testID="kb" />,
    );
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });
});

describe('NumericKeypadView — haptics', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls impactAsync (Light) on key press when haptics is enabled (default)', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-1'));
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('does not call impactAsync when haptics={false}', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} haptics={false} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-1'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('does not call impactAsync when disabled', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} disabled testID="kb" />);
    fireEvent.press(getByTestId('kb-key-1'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});

describe('NumericKeypadView — disabled & disabledKeys', () => {
  beforeEach(() => jest.clearAllMocks());

  it('does not call onKeyPress when fully disabled', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={onKeyPress} disabled testID="kb" />);
    fireEvent.press(getByTestId('kb-key-5'));
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('does not call onClear when fully disabled', () => {
    const onClear = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={onClear} disabled testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onClear).not.toHaveBeenCalled();
  });

  it('disables only the keys listed in disabledKeys', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={onKeyPress} disabledKeys={['.']} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-.'));
    expect(onKeyPress).not.toHaveBeenCalled();
    fireEvent.press(getByTestId('kb-key-7'));
    expect(onKeyPress).toHaveBeenCalledWith('7');
  });
});

describe('NumericKeypadView — layout', () => {
  it('renders all 12 keys (0–9, dot, C)', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);
    [...ALL_NUMBER_KEYS, '.', 'C'].forEach((key) => {
      expect(getByTestId(`kb-key-${key}`)).toBeTruthy();
    });
  });

  it('renders the SVG clear badge', () => {
    const { getAllByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);
    expect(getAllByTestId('svg-clear-badge').length).toBeGreaterThan(0);
  });

  it('renders all keys with fillHeight enabled', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<NumericKeypadView {...baseProps} fillHeight onKeyPress={onKeyPress} testID="kb" />);
    [...ALL_NUMBER_KEYS, '.', 'C'].forEach((key) => {
      expect(getByTestId(`kb-key-${key}`)).toBeTruthy();
    });
    fireEvent.press(getByTestId('kb-key-3'));
    expect(onKeyPress).toHaveBeenCalledWith('3');
  });
});

describe('NumericKeypadView — accessibility', () => {
  it('uses the provided accessibilityLabel on the container', () => {
    const { getByLabelText } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} />);
    expect(getByLabelText('Numeric keyboard')).toBeTruthy();
  });

  it('uses a custom accessibilityLabel when provided', () => {
    const { getByLabelText } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} accessibilityLabel="Amount keyboard" />);
    expect(getByLabelText('Amount keyboard')).toBeTruthy();
  });

  it('uses the provided deleteLabel on the C button', () => {
    const { getByLabelText } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={jest.fn()} />);
    expect(getByLabelText('Delete')).toBeTruthy();
  });

  it('uses a custom deleteLabel when provided', () => {
    const { getByLabelText } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} onClear={jest.fn()} deleteLabel="Backspace" />);
    expect(getByLabelText('Backspace')).toBeTruthy();
  });

  it('renders dot and numeric keys as accessible controls without hardcoded English labels', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);

    expect(getByTestId('kb-key-.').props.accessibilityLabel).toBeUndefined();
    expect(getByTestId('kb-key-1').props.accessibilityLabel).toBeUndefined();
  });

  it('keeps dot and numeric keys discoverable by testID', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);

    expect(getByTestId('kb-key-.')).toBeTruthy();
    expect(getByTestId('kb-key-1')).toBeTruthy();
    expect(getByTestId('kb-key-0')).toBeTruthy();
  });
});

describe('NumericKeypadView — meta', () => {
  it('exposes a displayName', () => {
    expect(NumericKeypadView.displayName).toBe('NumericKeypadView');
  });
});

describe('NumericKeypadView — topBand', () => {
  beforeEach(() => jest.clearAllMocks());

  it('does NOT render the top band by default', () => {
    const { queryByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} testID="kb" />);
    expect(queryByTestId('kb-top-band')).toBeNull();
  });

  it('renders the top band when topBand={true}', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} topBand testID="kb" />);
    expect(getByTestId('kb-top-band')).toBeTruthy();
  });

  it('uses the provided accessibility label for an interactive top band', () => {
    const { getByLabelText } = render(
      <NumericKeypadView
        {...baseProps}
        onKeyPress={jest.fn()}
        topBand
        onTopBandSwipeDown={jest.fn()}
        topBandAccessibilityLabel="Dismiss keyboard"
        testID="kb"
      />,
    );

    expect(getByLabelText('Dismiss keyboard')).toBeTruthy();
  });

  it('dismisses (calls onTopBandSwipeDown) once the drag crosses the threshold mid-gesture', () => {
    const onTopBandSwipeDown = jest.fn();
    const { getByTestId } = render(
      <NumericKeypadView {...baseProps} onKeyPress={jest.fn()} topBand onTopBandSwipeDown={onTopBandSwipeDown} testID="kb" />,
    );
    fireEvent(getByTestId('kb-top-band'), 'swipeDown');
    expect(onTopBandSwipeDown).toHaveBeenCalledTimes(1);
  });

  it('does NOT dismiss when the drag is released below the threshold (snaps back)', () => {
    const onTopBandSwipeDown = jest.fn();
    const { getByTestId } = render(
      <NumericKeypadView {...baseProps} onKeyPress={jest.fn()} topBand onTopBandSwipeDown={onTopBandSwipeDown} testID="kb" />,
    );
    fireEvent(getByTestId('kb-top-band'), 'swipeDownShort');
    expect(onTopBandSwipeDown).not.toHaveBeenCalled();
  });

  it('does NOT call onTopBandSwipeDown when band is decorative (no callback)', () => {
    const { getByTestId } = render(<NumericKeypadView {...baseProps} onKeyPress={jest.fn()} topBand testID="kb" />);
    // Pressing a decorative band (no GestureDetector wrapper) should not throw.
    expect(() => fireEvent.press(getByTestId('kb-top-band'))).not.toThrow();
  });
});
