import { describe, expect, it } from '@jest/globals';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import { BUTTON_BORDER_RADIUS, DIVIDER_HEIGHT, DIVIDER_WIDTH, formatPrice, getSizeConfig, getStateStyles, resolveVisualState } from '../utils/styles';

const colors = colorsMock.colors;

// =============================================================================
// Constants
// =============================================================================

describe('constants', () => {
  it('DIVIDER_WIDTH should be 1', () => {
    expect(DIVIDER_WIDTH).toBe(1);
  });

  it('DIVIDER_HEIGHT should be 12 (X3)', () => {
    expect(DIVIDER_HEIGHT).toBe(12);
  });

  it('BUTTON_BORDER_RADIUS should be 50', () => {
    expect(BUTTON_BORDER_RADIUS).toBe(50);
  });
});

// =============================================================================
// getSizeConfig
// =============================================================================

describe('getSizeConfig', () => {
  it('should return config for tiny size', () => {
    const config = getSizeConfig('tiny');
    expect(config).toEqual({
      borderRadius: 50,
      paddingVertical: 4,
      paddingHorizontal: 12,
      gap: 8,
    });
  });

  it('should return config for small size', () => {
    const config = getSizeConfig('small');
    expect(config).toEqual({
      borderRadius: 50,
      paddingVertical: 4,
      paddingHorizontal: 12,
      gap: 8,
    });
  });

  it('should return config for medium size', () => {
    const config = getSizeConfig('medium');
    expect(config).toEqual({
      borderRadius: 50,
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 8,
    });
  });

  it('should return config for large size', () => {
    const config = getSizeConfig('large');
    expect(config).toEqual({
      borderRadius: 50,
      paddingVertical: 8,
      paddingHorizontal: 16,
      gap: 12,
    });
  });

  it('all sizes should have borderRadius of 50', () => {
    const sizes = ['tiny', 'small', 'medium', 'large'] as const;
    for (const size of sizes) {
      expect(getSizeConfig(size).borderRadius).toBe(50);
    }
  });
});

// =============================================================================
// resolveVisualState
// =============================================================================

describe('resolveVisualState', () => {
  describe('default behavior', () => {
    it('should return "default" when no flags are set', () => {
      expect(resolveVisualState({})).toBe('default');
    });

    it('should return "default" when all flags are false', () => {
      expect(
        resolveVisualState({
          disabled: false,
          positiveIndication: false,
          negativeIndication: false,
          oneClickTrading: false,
          pressed: false,
        }),
      ).toBe('default');
    });
  });

  describe('pressed state', () => {
    it('should return "pressed" when only pressed is true', () => {
      expect(resolveVisualState({ pressed: true })).toBe('pressed');
    });
  });

  describe('disabled state (highest priority)', () => {
    it('should return "disabled" when disabled is true', () => {
      expect(resolveVisualState({ disabled: true })).toBe('disabled');
    });

    it('should return "disabled" even when positiveIndication is true', () => {
      expect(resolveVisualState({ disabled: true, positiveIndication: true })).toBe('disabled');
    });

    it('should return "disabled" even when negativeIndication is true', () => {
      expect(resolveVisualState({ disabled: true, negativeIndication: true })).toBe('disabled');
    });

    it('should return "disabled" even when oneClickTrading is true', () => {
      expect(resolveVisualState({ disabled: true, oneClickTrading: true })).toBe('disabled');
    });

    it('should return "disabled" even when all flags are true', () => {
      expect(
        resolveVisualState({
          disabled: true,
          positiveIndication: true,
          negativeIndication: true,
          oneClickTrading: true,
          pressed: true,
        }),
      ).toBe('disabled');
    });
  });

  describe('positiveIndication state', () => {
    it('should return "positiveIndication" when positiveIndication is true', () => {
      expect(resolveVisualState({ positiveIndication: true })).toBe('positiveIndication');
    });

    it('should take priority over negativeIndication', () => {
      expect(
        resolveVisualState({
          positiveIndication: true,
          negativeIndication: true,
        }),
      ).toBe('positiveIndication');
    });

    it('should take priority over oneClickTrading', () => {
      expect(
        resolveVisualState({
          positiveIndication: true,
          oneClickTrading: true,
        }),
      ).toBe('positiveIndication');
    });
  });

  describe('negativeIndication state', () => {
    it('should return "negativeIndication" when negativeIndication is true', () => {
      expect(resolveVisualState({ negativeIndication: true })).toBe('negativeIndication');
    });

    it('should take priority over oneClickTrading', () => {
      expect(
        resolveVisualState({
          negativeIndication: true,
          oneClickTrading: true,
        }),
      ).toBe('negativeIndication');
    });
  });

  describe('oneClickTrading state', () => {
    it('should return "oneClickTrading" when oneClickTrading is true and not pressed', () => {
      expect(resolveVisualState({ oneClickTrading: true })).toBe('oneClickTrading');
    });

    it('should return "oneClickTradingPressed" when oneClickTrading and pressed are true', () => {
      expect(resolveVisualState({ oneClickTrading: true, pressed: true })).toBe('oneClickTradingPressed');
    });
  });
});

// =============================================================================
// getStateStyles
// =============================================================================

describe('getStateStyles', () => {
  describe('default state', () => {
    it('should return neutral background for buy', () => {
      const styles = getStateStyles(colors, 'default', 'buy');
      expect(styles.backgroundColor).toBe(colors.bgNeutralPrimary);
    });

    it('should use actionBrandText for buy letter color', () => {
      const styles = getStateStyles(colors, 'default', 'buy');
      expect(styles.letterColor).toBe(colors.actionBrandText);
    });

    it('should use actionBrandVarText for sell letter color', () => {
      const styles = getStateStyles(colors, 'default', 'sell');
      expect(styles.letterColor).toBe(colors.actionBrandVarText);
    });

    it('should use dividerTertiary for divider color', () => {
      const styles = getStateStyles(colors, 'default', 'buy');
      expect(styles.dividerColor).toBe(colors.dividerTertiary);
    });

    it('should use dividerTertiary for border color', () => {
      const styles = getStateStyles(colors, 'default', 'buy');
      expect(styles.borderColor).toBe(colors.dividerTertiary);
    });

    it('should have borderWidth of 1', () => {
      const styles = getStateStyles(colors, 'default', 'buy');
      expect(styles.borderWidth).toBe(1);
    });

    it('should use textPrimaryNeutral for price color', () => {
      const styles = getStateStyles(colors, 'default', 'buy');
      expect(styles.priceColor).toBe(colors.textPrimaryNeutral);
    });
  });

  describe('pressed state', () => {
    it('should use type letter color for buy border', () => {
      const styles = getStateStyles(colors, 'pressed', 'buy');
      expect(styles.borderColor).toBe(colors.actionBrandText);
    });

    it('should use type letter color for sell border', () => {
      const styles = getStateStyles(colors, 'pressed', 'sell');
      expect(styles.borderColor).toBe(colors.actionBrandVarText);
    });

    it('should keep same background as default', () => {
      const styles = getStateStyles(colors, 'pressed', 'buy');
      expect(styles.backgroundColor).toBe(colors.bgNeutralPrimary);
    });
  });

  describe('oneClickTrading state', () => {
    it('should use bgActionInfo background', () => {
      const styles = getStateStyles(colors, 'oneClickTrading', 'buy');
      expect(styles.backgroundColor).toBe(colors.bgActionInfo);
    });

    it('should use inverted text colors for all text', () => {
      const styles = getStateStyles(colors, 'oneClickTrading', 'buy');
      expect(styles.letterColor).toBe(colors.textInvertedPrimaryNeutral);
      expect(styles.dividerColor).toBe(colors.textInvertedPrimaryNeutral);
      expect(styles.priceColor).toBe(colors.textInvertedPrimaryNeutral);
    });

    it('should have transparent border', () => {
      const styles = getStateStyles(colors, 'oneClickTrading', 'buy');
      expect(styles.borderColor).toBe('transparent');
    });
  });

  describe('oneClickTradingPressed state', () => {
    it('should use bgActionInfoHover background', () => {
      const styles = getStateStyles(colors, 'oneClickTradingPressed', 'buy');
      expect(styles.backgroundColor).toBe(colors.bgActionInfoHover);
    });

    it('should use inverted text colors', () => {
      const styles = getStateStyles(colors, 'oneClickTradingPressed', 'sell');
      expect(styles.letterColor).toBe(colors.textInvertedPrimaryNeutral);
      expect(styles.priceColor).toBe(colors.textInvertedPrimaryNeutral);
    });
  });

  describe('positiveIndication state', () => {
    it('should use bgActionBrand background', () => {
      const styles = getStateStyles(colors, 'positiveIndication', 'buy');
      expect(styles.backgroundColor).toBe(colors.bgActionBrand);
    });

    it('should use inverted text colors', () => {
      const styles = getStateStyles(colors, 'positiveIndication', 'buy');
      expect(styles.letterColor).toBe(colors.textInvertedPrimaryNeutral);
      expect(styles.priceColor).toBe(colors.textInvertedPrimaryNeutral);
    });

    it('should have transparent border', () => {
      const styles = getStateStyles(colors, 'positiveIndication', 'buy');
      expect(styles.borderColor).toBe('transparent');
    });
  });

  describe('negativeIndication state', () => {
    it('should use bgActionBrandVar background', () => {
      const styles = getStateStyles(colors, 'negativeIndication', 'sell');
      expect(styles.backgroundColor).toBe(colors.bgActionBrandVar);
    });

    it('should use inverted text colors', () => {
      const styles = getStateStyles(colors, 'negativeIndication', 'sell');
      expect(styles.letterColor).toBe(colors.textInvertedPrimaryNeutral);
      expect(styles.priceColor).toBe(colors.textInvertedPrimaryNeutral);
    });
  });

  describe('disabled state', () => {
    it('should use bgActionDisabled background', () => {
      const styles = getStateStyles(colors, 'disabled', 'buy');
      expect(styles.backgroundColor).toBe(colors.bgActionDisabled);
    });

    it('should use actionDisabledText for all text', () => {
      const styles = getStateStyles(colors, 'disabled', 'sell');
      expect(styles.letterColor).toBe(colors.actionDisabledText);
      expect(styles.dividerColor).toBe(colors.actionDisabledText);
      expect(styles.priceColor).toBe(colors.actionDisabledText);
    });

    it('should have transparent border', () => {
      const styles = getStateStyles(colors, 'disabled', 'buy');
      expect(styles.borderColor).toBe('transparent');
    });
  });

  describe('all states', () => {
    it('every state should have borderWidth of 1', () => {
      const states = [
        'default',
        'pressed',
        'oneClickTrading',
        'oneClickTradingPressed',
        'positiveIndication',
        'negativeIndication',
        'disabled',
      ] as const;

      for (const state of states) {
        const styles = getStateStyles(colors, state, 'buy');
        expect(styles.borderWidth).toBe(1);
      }
    });

    it('should return valid config for unexpected state (fallback)', () => {
      const styles = getStateStyles(colors, 'unknownState' as any, 'buy');

      expect(styles).toBeDefined();
      expect(styles.backgroundColor).toBe(colors.bgNeutralPrimary);
      expect(styles.borderWidth).toBe(1);
    });
  });
});

// =============================================================================
// formatPrice
// =============================================================================

describe('formatPrice', () => {
  it('should format integer to 2 decimal places', () => {
    expect(formatPrice(100)).toBe('100.00');
  });

  it('should format single decimal to 2 places', () => {
    expect(formatPrice(99.1)).toBe('99.10');
  });

  it('should keep 2 decimal places', () => {
    expect(formatPrice(11756.62)).toBe('11756.62');
  });

  it('should truncate beyond 2 decimal places', () => {
    expect(formatPrice(1.999)).toBe('2.00');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-5.5)).toBe('-5.50');
  });

  it('should return -- for Infinity', () => {
    expect(formatPrice(Infinity)).toBe('--');
  });

  it('should return -- for -Infinity', () => {
    expect(formatPrice(-Infinity)).toBe('--');
  });

  it('should return -- for NaN', () => {
    expect(formatPrice(NaN)).toBe('--');
  });
});
