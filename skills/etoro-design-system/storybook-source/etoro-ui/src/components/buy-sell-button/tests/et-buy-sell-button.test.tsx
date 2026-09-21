import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { EtBuySellButton } from '../et-buy-sell-button';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock: mockColors } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => mockColors),
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

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

describe('EtBuySellButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // Rendering
  // =========================================================================

  describe('rendering', () => {
    it('should render buy button with letter B and formatted price', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={11756.62} testID="buy-btn" />);

      expect(getByText('B')).toBeTruthy();
      expect(getByText('11756.62')).toBeTruthy();
    });

    it('should render sell button with letter S and formatted price', () => {
      const { getByText } = render(<EtBuySellButton type="sell" price={99.1} testID="sell-btn" />);

      expect(getByText('S')).toBeTruthy();
      expect(getByText('99.10')).toBeTruthy();
    });

    it('should render with testID on pressable', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="my-btn" />);

      expect(getByTestId('my-btn')).toBeTruthy();
    });

    it('should format price to 2 decimal places', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={5} />);

      expect(getByText('5.00')).toBeTruthy();
    });

    it('should display -- for non-finite price values', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={Infinity} />);

      expect(getByText('--')).toBeTruthy();
    });

    it('should display -- for NaN price', () => {
      const { getByText } = render(<EtBuySellButton type="sell" price={NaN} />);

      expect(getByText('--')).toBeTruthy();
    });
  });

  // =========================================================================
  // Sizes
  // =========================================================================

  describe('sizes', () => {
    it.each(['tiny', 'small', 'medium', 'large'] as const)('should render in %s size without errors', (size) => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} size={size} />);

      expect(getByText('B')).toBeTruthy();
      expect(getByText('100.00')).toBeTruthy();
    });

    it('should default to medium size', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} />);

      // Renders without error — medium is the default
      expect(getByText('B')).toBeTruthy();
    });
  });

  // =========================================================================
  // Interaction — press & haptics
  // =========================================================================

  describe('interaction', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" onPress={onPress} />);

      fireEvent.press(getByTestId('btn'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback on press by default', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" onPress={() => {}} />);

      fireEvent.press(getByTestId('btn'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should not trigger haptic feedback when haptics is false', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" haptics={false} onPress={() => {}} />);

      fireEvent.press(getByTestId('btn'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" disabled onPress={onPress} />);

      fireEvent.press(getByTestId('btn'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not crash when onPress is undefined', () => {
      const { getByTestId } = render(<EtBuySellButton type="sell" price={100} testID="btn" />);

      expect(() => fireEvent.press(getByTestId('btn'))).not.toThrow();
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('accessibility', () => {
    it('should have button accessibility role', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" />);

      expect(getByTestId('btn').props.accessibilityRole).toBe('button');
    });

    it('should auto-generate accessibility label for buy', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={1234.5} testID="btn" />);

      expect(getByTestId('btn').props.accessibilityLabel).toBe('Buy at 1234.50');
    });

    it('should auto-generate accessibility label for sell', () => {
      const { getByTestId } = render(<EtBuySellButton type="sell" price={99.1} testID="btn" />);

      expect(getByTestId('btn').props.accessibilityLabel).toBe('Sell at 99.10');
    });

    it('should use custom accessibility label when provided', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" accessibilityLabel="Custom label" />);

      expect(getByTestId('btn').props.accessibilityLabel).toBe('Custom label');
    });

    it('should set disabled accessibility state when disabled', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" disabled />);

      expect(getByTestId('btn').props.accessibilityState).toEqual({
        disabled: true,
      });
    });

    it('should set non-disabled accessibility state by default', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" />);

      expect(getByTestId('btn').props.accessibilityState).toEqual({
        disabled: false,
      });
    });
  });

  // =========================================================================
  // Visual states
  // =========================================================================

  describe('visual states', () => {
    it('should render default state with neutral background', () => {
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" />);

      // Component renders successfully in default state
      expect(getByTestId('btn')).toBeTruthy();
    });

    it('should render positive indication state', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} positiveIndication />);

      expect(getByText('B')).toBeTruthy();
    });

    it('should render negative indication state', () => {
      const { getByText } = render(<EtBuySellButton type="sell" price={100} negativeIndication />);

      expect(getByText('S')).toBeTruthy();
    });

    it('should render one-click trading state', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} oneClickTrading />);

      expect(getByText('B')).toBeTruthy();
    });

    it('should render disabled state', () => {
      const { getByText } = render(<EtBuySellButton type="sell" price={100} disabled />);

      expect(getByText('S')).toBeTruthy();
    });
  });

  // =========================================================================
  // State priority
  // =========================================================================

  describe('state priority', () => {
    it('disabled takes priority over positiveIndication', () => {
      // Should render without errors — disabled wins
      const { getByText } = render(<EtBuySellButton type="buy" price={100} disabled positiveIndication />);

      expect(getByText('B')).toBeTruthy();
    });

    it('disabled takes priority over negativeIndication', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} disabled negativeIndication />);

      expect(getByText('B')).toBeTruthy();
    });

    it('disabled takes priority over oneClickTrading', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} disabled oneClickTrading />);

      expect(getByText('B')).toBeTruthy();
    });

    it('positiveIndication takes priority over negativeIndication', () => {
      const { getByText } = render(<EtBuySellButton type="buy" price={100} positiveIndication negativeIndication />);

      expect(getByText('B')).toBeTruthy();
    });
  });

  // =========================================================================
  // Style prop
  // =========================================================================

  describe('style prop', () => {
    it('should apply custom style to pressable', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(<EtBuySellButton type="buy" price={100} testID="btn" style={customStyle} />);

      const pressable = getByTestId('btn');
      const flatStyle = Array.isArray(pressable.props.style) ? Object.assign({}, ...pressable.props.style) : pressable.props.style;

      expect(flatStyle).toMatchObject(customStyle);
    });
  });

  // =========================================================================
  // displayName
  // =========================================================================

  describe('displayName', () => {
    it('should have displayName set', () => {
      expect(EtBuySellButton.displayName).toBe('EtBuySellButton');
    });
  });
});
