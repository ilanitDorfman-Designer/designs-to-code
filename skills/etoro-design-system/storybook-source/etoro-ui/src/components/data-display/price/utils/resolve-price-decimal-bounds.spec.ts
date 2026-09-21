import { resolvePriceDecimalBounds } from './resolve-price-decimal-bounds';

describe('resolvePriceDecimalBounds', () => {
  describe('no overrides (built-in magnitude rule)', () => {
    it('GIVEN a price above $1 WHEN resolved THEN caps at 2 decimals', () => {
      expect(resolvePriceDecimalBounds({ price: 1.1565 })).toEqual({ minDecimals: 0, maxDecimals: 2 });
    });

    it('GIVEN a sub-dollar price WHEN resolved THEN caps at 5 decimals', () => {
      expect(resolvePriceDecimalBounds({ price: 0.19 })).toEqual({ minDecimals: 0, maxDecimals: 5 });
    });

    it('GIVEN a zero price WHEN resolved THEN caps at 2 decimals', () => {
      expect(resolvePriceDecimalBounds({ price: 0 })).toEqual({ minDecimals: 0, maxDecimals: 2 });
    });
  });

  describe('fixed decimals', () => {
    it('GIVEN decimals WHEN resolved THEN pins min and max so trailing zeros are kept', () => {
      expect(resolvePriceDecimalBounds({ price: 1.1565, decimals: 5 })).toEqual({ minDecimals: 5, maxDecimals: 5 });
    });

    it('GIVEN zero decimals WHEN resolved THEN pins both to zero rather than falling through', () => {
      expect(resolvePriceDecimalBounds({ price: 1.1565, decimals: 0 })).toEqual({ minDecimals: 0, maxDecimals: 0 });
    });

    it('GIVEN negative decimals WHEN resolved THEN clamps to zero', () => {
      expect(resolvePriceDecimalBounds({ price: 1.1565, decimals: -2 })).toEqual({ minDecimals: 0, maxDecimals: 0 });
    });
  });

  describe('unusable overrides', () => {
    it.each([NaN, Infinity])('GIVEN the non-finite decimals value %p WHEN resolved THEN falls back to the magnitude rule', (decimals) => {
      expect(resolvePriceDecimalBounds({ price: 1.1565, decimals })).toEqual({ minDecimals: 0, maxDecimals: 2 });
    });

    it('GIVEN a non-finite decimals on a sub-dollar price WHEN resolved THEN falls back to the sub-dollar rule', () => {
      expect(resolvePriceDecimalBounds({ price: 0.19, decimals: NaN })).toEqual({ minDecimals: 0, maxDecimals: 5 });
    });
  });
});
