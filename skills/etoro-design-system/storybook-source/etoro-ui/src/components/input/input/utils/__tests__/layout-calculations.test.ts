/**
 * Unit tests for layout calculation utilities
 */

import { calculatePrefixWidth } from '../layout-calculations';

describe('layout-calculations', () => {
  describe('calculatePrefixWidth', () => {
    it('returns 0 when hasPrefix is false', () => {
      expect(calculatePrefixWidth(false)).toBe(0);
      expect(calculatePrefixWidth(false, 20)).toBe(0);
      expect(calculatePrefixWidth(false, 100)).toBe(0);
    });

    it('calculates correct width with custom size', () => {
      expect(calculatePrefixWidth(true, 16)).toBe(22); // 16 + 6
      expect(calculatePrefixWidth(true, 18)).toBe(24); // 18 + 6
      expect(calculatePrefixWidth(true, 24)).toBe(30); // 24 + 6
      expect(calculatePrefixWidth(true, 32)).toBe(38); // 32 + 6
    });

    it('uses default size (20) when not provided', () => {
      expect(calculatePrefixWidth(true)).toBe(26); // 20 + 6
      expect(calculatePrefixWidth(true, undefined)).toBe(26); // 20 + 6
    });

    it('handles edge case sizes', () => {
      // Note: 0 is falsy, so it uses default size 20
      expect(calculatePrefixWidth(true, 0)).toBe(26); // 20 (default) + 6
      expect(calculatePrefixWidth(true, 1)).toBe(7); // 1 + 6
      expect(calculatePrefixWidth(true, 100)).toBe(106); // 100 + 6
    });

    it('maintains consistent 6px gap formula', () => {
      const sizes = [10, 15, 20, 25, 30];
      sizes.forEach((size) => {
        const result = calculatePrefixWidth(true, size);
        expect(result).toBe(size + 6);
      });
    });

    it('real-world scenarios: search input with prefix icon (18px)', () => {
      const result = calculatePrefixWidth(true, 18);
      expect(result).toBe(24); // 18 + 6
    });

    it('real-world scenarios: email input with prefix (18px)', () => {
      const result = calculatePrefixWidth(true, 18);
      expect(result).toBe(24); // 18 + 6
    });

    it('real-world scenarios: username input with user icon (18px)', () => {
      const result = calculatePrefixWidth(true, 18);
      expect(result).toBe(24); // 18 + 6
    });
  });
});
