import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { EtKeyboard } from './et-keyboard';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({ colors: colorsMock.colors })),
  };
});

jest.mock('../../../foundations/text', () => {
  const { Text } = require('react-native');
  return {
    EtText: function MockEtText({ children, ...props }: any) {
      return <Text {...props}>{children}</Text>;
    },
  };
});

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    Svg: function MockSvg({ children }: any) {
      return <View testID="svg-clear-badge">{children}</View>;
    },
    Path: function MockPath() {
      return null;
    },
  };
});

// ─── helpers ────────────────────────────────────────────────────────────────

const ALL_NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

// ============================================================================
// Compound static shape
// ============================================================================

describe('EtKeyboard — compound shape', () => {
  it('exposes Header, Keys and Actions subcomponents', () => {
    expect(EtKeyboard.Header).toBeDefined();
    expect(EtKeyboard.Keys).toBeDefined();
    expect(EtKeyboard.Actions).toBeDefined();
  });

  it('has correct displayNames', () => {
    expect(EtKeyboard.displayName).toBe('EtKeyboard');
    expect(EtKeyboard.Header.displayName).toBe('EtKeyboard.Header');
    expect(EtKeyboard.Keys.displayName).toBe('EtKeyboard.Keys');
    expect(EtKeyboard.Actions.displayName).toBe('EtKeyboard.Actions');
  });
});

// ============================================================================
// EtKeyboard.Keys — key press callbacks
// ============================================================================

describe('EtKeyboard.Keys — onKeyPress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(ALL_NUMBER_KEYS)('emits "%s" when the numeric key is pressed', (digit) => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} testID="kb" />);
    fireEvent.press(getByTestId(`kb-key-${digit}`));
    expect(onKeyPress).toHaveBeenCalledTimes(1);
    expect(onKeyPress).toHaveBeenCalledWith(digit);
  });

  it('emits "." when the dot key is pressed', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-.'));
    expect(onKeyPress).toHaveBeenCalledWith('.');
  });
});

// ============================================================================
// EtKeyboard.Keys — clear (C) button
// ============================================================================

describe('EtKeyboard.Keys — onClear', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClear when the C key is pressed', () => {
    const onKeyPress = jest.fn();
    const onClear = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} onClear={onClear} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does NOT forward C to onKeyPress', () => {
    const onKeyPress = jest.fn();
    const onClear = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} onClear={onClear} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('does not throw when onClear is not provided and C is pressed', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} testID="kb" />);
    expect(() => fireEvent.press(getByTestId('kb-key-C'))).not.toThrow();
  });

  it('C key is disabled when onClear is not provided', () => {
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} testID="kb" />);
    expect(getByTestId('kb-key-C').props.accessibilityState?.disabled).toBe(true);
  });

  it('C key is enabled when onClear is provided', () => {
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} onClear={() => undefined} testID="kb" />);
    expect(getByTestId('kb-key-C').props.accessibilityState?.disabled).not.toBe(true);
  });
});

// ============================================================================
// EtKeyboard.Keys — onClearAll (long-press on C)
// ============================================================================

describe('EtKeyboard.Keys — onClearAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClearAll when the C key is long-pressed', () => {
    const onClear = jest.fn();
    const onClearAll = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} onClear={onClear} onClearAll={onClearAll} testID="kb" />);
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClear on long-press (RN suppresses onPress when onLongPress fires)', () => {
    const onClear = jest.fn();
    const onClearAll = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} onClear={onClear} onClearAll={onClearAll} testID="kb" />);
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(onClear).not.toHaveBeenCalled();
  });

  it('still calls onClear on a short press when onClearAll is also provided', () => {
    const onClear = jest.fn();
    const onClearAll = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} onClear={onClear} onClearAll={onClearAll} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onClearAll).not.toHaveBeenCalled();
  });

  it('does not fire onClearAll when onClearAll is not provided', () => {
    const onClear = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} onClear={onClear} testID="kb" />);
    expect(() => fireEvent(getByTestId('kb-key-C'), 'longPress')).not.toThrow();
  });

  it('does not call onClearAll when disabled', () => {
    const onClearAll = jest.fn();
    const { getByTestId } = render(
      <EtKeyboard.Keys onKeyPress={() => undefined} onClear={() => undefined} onClearAll={onClearAll} disabled testID="kb" />,
    );
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(onClearAll).not.toHaveBeenCalled();
  });

  it('fires a Medium haptic on long-press when haptics is enabled (default)', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(
      <EtKeyboard.Keys onKeyPress={() => undefined} onClear={() => undefined} onClearAll={() => undefined} testID="kb" />,
    );
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('does not fire haptic on long-press when haptics={false}', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(
      <EtKeyboard.Keys onKeyPress={() => undefined} onClear={() => undefined} onClearAll={() => undefined} haptics={false} testID="kb" />,
    );
    fireEvent(getByTestId('kb-key-C'), 'longPress');
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});

// ============================================================================
// EtKeyboard.Keys — haptics
// ============================================================================

describe('EtKeyboard.Keys — haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls impactAsync on key press when haptics is enabled (default)', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-1'));
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('does not call impactAsync when haptics={false}', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} haptics={false} testID="kb" />);
    fireEvent.press(getByTestId('kb-key-1'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('does not call impactAsync when disabled', () => {
    const Haptics = require('expo-haptics');
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} disabled testID="kb" />);
    fireEvent.press(getByTestId('kb-key-1'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});

// ============================================================================
// EtKeyboard.Keys — disabled state
// ============================================================================

describe('EtKeyboard.Keys — disabled', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not call onKeyPress when disabled', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} disabled testID="kb" />);
    fireEvent.press(getByTestId('kb-key-5'));
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('does not call onClear when disabled', () => {
    const onKeyPress = jest.fn();
    const onClear = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} onClear={onClear} disabled testID="kb" />);
    fireEvent.press(getByTestId('kb-key-C'));
    expect(onClear).not.toHaveBeenCalled();
  });
});

// ============================================================================
// EtKeyboard.Keys — layout (all keys rendered)
// ============================================================================

describe('EtKeyboard.Keys — layout', () => {
  it('renders all 12 key buttons (0–9, dot, C)', () => {
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} testID="kb" />);
    [...ALL_NUMBER_KEYS, '.', 'C'].forEach((key) => {
      expect(getByTestId(`kb-key-${key}`)).toBeTruthy();
    });
  });

  it('renders the SVG clear badge', () => {
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={() => undefined} testID="kb" />);
    expect(getByTestId('svg-clear-badge')).toBeTruthy();
  });
});

// ============================================================================
// EtKeyboard.Keys — accessibility
// ============================================================================

describe('EtKeyboard.Keys — accessibility', () => {
  it('has the default accessibilityLabel on the keys container', () => {
    const { getByLabelText } = render(<EtKeyboard.Keys onKeyPress={() => undefined} />);
    expect(getByLabelText('Numeric keyboard')).toBeTruthy();
  });

  it('uses a custom accessibilityLabel when provided', () => {
    const { getByLabelText } = render(<EtKeyboard.Keys onKeyPress={() => undefined} accessibilityLabel="Amount keyboard" />);
    expect(getByLabelText('Amount keyboard')).toBeTruthy();
  });

  it('sets accessibilityLabel "Delete" on the C button by default', () => {
    const { getByLabelText } = render(<EtKeyboard.Keys onKeyPress={() => undefined} />);
    expect(getByLabelText('Delete')).toBeTruthy();
  });

  it('uses a custom deleteLabel when provided', () => {
    const { getByLabelText } = render(<EtKeyboard.Keys onKeyPress={() => undefined} deleteLabel="Backspace" />);
    expect(getByLabelText('Backspace')).toBeTruthy();
  });

  it('sets accessibilityLabel "Decimal point" on the dot key', () => {
    const { getByLabelText } = render(<EtKeyboard.Keys onKeyPress={() => undefined} testID="kb" />);
    expect(getByLabelText('Decimal point')).toBeTruthy();
  });

  it('sets descriptive "Keyboard key N" labels on numeric keys', () => {
    const { getByLabelText } = render(<EtKeyboard.Keys onKeyPress={() => undefined} />);
    expect(getByLabelText('Keyboard key 1')).toBeTruthy();
    expect(getByLabelText('Keyboard key 0')).toBeTruthy();
  });
});

// ============================================================================
// EtKeyboard.Header & EtKeyboard.Actions — slot rendering
// ============================================================================

describe('EtKeyboard.Header', () => {
  it('renders arbitrary children', () => {
    const { getByText } = render(
      <EtKeyboard.Header testID="header">
        <Text>Header content</Text>
      </EtKeyboard.Header>,
    );
    expect(getByText('Header content')).toBeTruthy();
  });

  it('applies testID to the wrapper', () => {
    const { getByTestId } = render(
      <EtKeyboard.Header testID="my-header">
        <Text>x</Text>
      </EtKeyboard.Header>,
    );
    expect(getByTestId('my-header')).toBeTruthy();
  });
});

describe('EtKeyboard.Actions', () => {
  it('renders arbitrary children', () => {
    const { getByText } = render(
      <EtKeyboard.Actions testID="actions">
        <Text>Action content</Text>
      </EtKeyboard.Actions>,
    );
    expect(getByText('Action content')).toBeTruthy();
  });

  it('applies testID to the wrapper', () => {
    const { getByTestId } = render(
      <EtKeyboard.Actions testID="my-actions">
        <Text>x</Text>
      </EtKeyboard.Actions>,
    );
    expect(getByTestId('my-actions')).toBeTruthy();
  });
});

// ============================================================================
// EtKeyboard — full composition
// ============================================================================

describe('EtKeyboard — full composition', () => {
  it('renders header, keys and actions together', () => {
    const onKeyPress = jest.fn();
    const { getByText, getByTestId } = render(
      <EtKeyboard testID="root">
        <EtKeyboard.Header>
          <Text>Header</Text>
        </EtKeyboard.Header>
        <EtKeyboard.Keys onKeyPress={onKeyPress} testID="kb" />
        <EtKeyboard.Actions>
          <Text>Confirm</Text>
        </EtKeyboard.Actions>
      </EtKeyboard>,
    );
    expect(getByTestId('root')).toBeTruthy();
    expect(getByText('Header')).toBeTruthy();
    expect(getByTestId('kb-key-5')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
  });

  it('can use Keys standalone without the root wrapper', () => {
    const onKeyPress = jest.fn();
    const { getByTestId } = render(<EtKeyboard.Keys onKeyPress={onKeyPress} testID="kb" />);
    expect(getByTestId('kb-key-1')).toBeTruthy();
  });

  it('forwards style to root container', () => {
    const { getByTestId } = render(
      <EtKeyboard testID="root" style={{ marginTop: 20 }}>
        <View />
      </EtKeyboard>,
    );
    const root = getByTestId('root');
    expect(root.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ marginTop: 20 })]));
  });
});
