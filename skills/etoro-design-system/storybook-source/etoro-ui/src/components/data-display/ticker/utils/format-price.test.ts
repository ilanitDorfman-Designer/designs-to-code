import { formatPrice } from './format-price';

describe('formatPrice', () => {
  describe('Prices >= $1000', () => {
    it('should format large integers without decimals', () => {
      expect(formatPrice(1000)).toBe('$1,000');
      expect(formatPrice(1234)).toBe('$1,234');
      expect(formatPrice(10000)).toBe('$10,000');
      expect(formatPrice(1000000)).toBe('$1,000,000');
    });

    it('should format large decimals without decimals (rounded)', () => {
      expect(formatPrice(1000.5)).toBe('$1,001');
      expect(formatPrice(1234.789)).toBe('$1,235');
      expect(formatPrice(9999.99)).toBe('$10,000');
    });

    it('should handle edge case at exactly $1000', () => {
      expect(formatPrice(1000)).toBe('$1,000');
      expect(formatPrice(1000.0)).toBe('$1,000');
    });
  });

  describe('Prices >= $1 and < $1000', () => {
    it('should format with 2 decimal places', () => {
      expect(formatPrice(1)).toBe('$1.00');
      expect(formatPrice(1.5)).toBe('$1.50');
      expect(formatPrice(12.34)).toBe('$12.34');
      expect(formatPrice(156.79)).toBe('$156.79');
      expect(formatPrice(999.99)).toBe('$999.99');
    });

    it('should handle integers by adding .00', () => {
      expect(formatPrice(5)).toBe('$5.00');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(500)).toBe('$500.00');
    });

    it('should round to 2 decimal places when needed', () => {
      expect(formatPrice(1.234)).toBe('$1.23');
      expect(formatPrice(1.235)).toBe('$1.24'); // Rounds up
      expect(formatPrice(99.999)).toBe('$100.00');
    });

    it('should handle edge case at exactly $1', () => {
      expect(formatPrice(1)).toBe('$1.00');
      expect(formatPrice(1.0)).toBe('$1.00');
    });
  });

  describe('Prices < $1', () => {
    it('should format with 4 decimal places', () => {
      expect(formatPrice(0.1234)).toBe('$0.1234');
      expect(formatPrice(0.5678)).toBe('$0.5678');
      expect(formatPrice(0.9999)).toBe('$0.9999');
    });

    it('should handle very small values', () => {
      expect(formatPrice(0.0001)).toBe('$0.0001');
      expect(formatPrice(0.0123)).toBe('$0.0123');
    });

    it('should round to 4 decimal places when needed', () => {
      expect(formatPrice(0.12345)).toBe('$0.1235'); // Rounds up
      expect(formatPrice(0.99999)).toBe('$1.0000');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.0000');
      expect(formatPrice(0.0)).toBe('$0.0000');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      expect(formatPrice(1000000000)).toBe('$1,000,000,000');
      expect(formatPrice(999999999999)).toBe('$999,999,999,999');
    });

    it('should handle numbers just below thresholds', () => {
      expect(formatPrice(999.99)).toBe('$999.99'); // Just below $1000
      expect(formatPrice(0.9999)).toBe('$0.9999'); // Just below $1
    });

    it('should handle numbers just above thresholds', () => {
      expect(formatPrice(1000.01)).toBe('$1,000'); // Just above $1000
      expect(formatPrice(1.0001)).toBe('$1.00'); // Just above $1
    });
  });

  describe('Negative Numbers', () => {
    it('should handle negative values correctly', () => {
      expect(formatPrice(-1000)).toBe('-$1,000');
      expect(formatPrice(-156.79)).toBe('-$156.79');
      expect(formatPrice(-0.1234)).toBe('-$0.1234');
    });
  });

  describe('Real-world Examples', () => {
    it('should format common stock prices correctly', () => {
      // Apple stock price example
      expect(formatPrice(186.79)).toBe('$186.79');

      // Tesla stock price example
      expect(formatPrice(245.67)).toBe('$245.67');

      // Google stock price example
      expect(formatPrice(2820.45)).toBe('$2,820');

      // Penny stock example
      expect(formatPrice(0.0523)).toBe('$0.0523');

      // Berkshire Hathaway example
      expect(formatPrice(534850)).toBe('$534,850');
    });
  });

  describe('Type Safety', () => {
    it('should handle decimal precision edge cases', () => {
      // JavaScript floating point precision tests
      expect(formatPrice(0.1 + 0.2)).toBe('$0.3000'); // 0.30000000000000004
      expect(formatPrice(1.005)).toBe('$1.01'); // Rounding behavior (rounds up to nearest)
    });
  });
});
