import { render, renderHook } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { useAmountAutoScale } from '../animations/use-amount-auto-scale';
import { useCaretBlinkAnimation } from '../animations/use-caret-blink-animation';
import { useShakeAnimation } from '../animations/use-shake-animation';
import { EtAmountInputDisplay } from '../et-amount-input-display';
import { computeAmountScale } from '../utils/compute-amount-scale';

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Error: 'error' },
}));

jest.mock('../../../../foundations/animated-digits', () => {
  const RN = require('react-native');
  return {
    EtAnimatedCount: ({ number }: { number: number | string }) => <RN.Text testID="amount-input-display-count">{String(number)}</RN.Text>,
  };
});

describe('EtAmountInputDisplay', () => {
  describe('props API', () => {
    it('feeds the value to the animated count', () => {
      const { getByTestId } = render(<EtAmountInputDisplay value="1,234.56" currencySymbol="$" />);

      expect(getByTestId('amount-input-display-count').props.children).toBe('1,234.56');
    });

    it('renders the currency symbol prefix', () => {
      const { getByText } = render(<EtAmountInputDisplay value="100" currencySymbol="$" />);

      expect(getByText('$')).toBeTruthy();
    });

    it('renders the unit label suffix when provided', () => {
      const { getByText } = render(<EtAmountInputDisplay value="100" currencySymbol="$" unitLabel="Shares" />);

      expect(getByText('Shares')).toBeTruthy();
    });

    it('does not render a unit label when none is provided', () => {
      const { queryByTestId } = render(<EtAmountInputDisplay value="100" currencySymbol="$" />);

      expect(queryByTestId('amount-input-display-unit')).toBeNull();
    });

    it('wraps the parts in a single scalable row', () => {
      const { getByTestId } = render(<EtAmountInputDisplay value="100" currencySymbol="$" />);

      expect(getByTestId('amount-input-display-row')).toBeTruthy();
      expect(getByTestId('amount-input-display-container')).toBeTruthy();
    });

    it('accepts a shakeTrigger prop and still renders the amount', () => {
      const { getByTestId } = render(<EtAmountInputDisplay value="100" currencySymbol="$" shakeTrigger={2} />);

      expect(getByTestId('amount-input-display-count').props.children).toBe('100');
    });
  });

  describe('compound API', () => {
    it('renders provided compound children instead of the props arrangement', () => {
      const { getByText, getByTestId } = render(
        <EtAmountInputDisplay value="42">
          <EtAmountInputDisplay.Currency>€</EtAmountInputDisplay.Currency>
          <EtAmountInputDisplay.Value />
          <EtAmountInputDisplay.Unit>Units</EtAmountInputDisplay.Unit>
        </EtAmountInputDisplay>,
      );

      expect(getByText('€')).toBeTruthy();
      expect(getByText('Units')).toBeTruthy();
      expect(getByTestId('amount-input-display-count').props.children).toBe('42');
    });
  });

  describe('useShakeAnimation', () => {
    beforeEach(() => jest.clearAllMocks());

    it('skips the mount run so it does not shake on first render', () => {
      renderHook(({ trigger }) => useShakeAnimation(trigger), { initialProps: { trigger: 0 } });

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it('re-fires the error haptic each time the trigger advances', () => {
      const { rerender } = renderHook(({ trigger }) => useShakeAnimation(trigger), { initialProps: { trigger: 0 } });

      rerender({ trigger: 1 });
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);

      rerender({ trigger: 2 });
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('useCaretBlinkAnimation', () => {
    it('holds the caret hidden when the cursor is off', () => {
      const { result } = renderHook(({ showCursor }) => useCaretBlinkAnimation(showCursor), { initialProps: { showCursor: false } });

      expect(result.current.get()).toBe(0);
    });

    it('resets opacity to 0 when the cursor turns back off', () => {
      const { result, rerender } = renderHook(({ showCursor }) => useCaretBlinkAnimation(showCursor), { initialProps: { showCursor: true } });

      rerender({ showCursor: false });
      expect(result.current.get()).toBe(0);
    });
  });

  describe('useAmountAutoScale', () => {
    it('stays at full scale for short values', () => {
      const params = { value: '123', availableWidth: 1000, digitWidth: 35 };
      const { result } = renderHook(() => useAmountAutoScale(params));

      expect(result.current.targetScale).toBe(1);
      expect(result.current.scaleStyle).toBeTruthy();
    });

    it('shrinks to the computed target when the row would overflow', () => {
      const params = { value: '123456', availableWidth: 100, affixWidth: 20, digitWidth: 35 };
      const { result } = renderHook(() => useAmountAutoScale(params));

      expect(result.current.targetScale).toBeLessThan(1);
      expect(result.current.targetScale).toBe(computeAmountScale(params));
    });
  });
});
