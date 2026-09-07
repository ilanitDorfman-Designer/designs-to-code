import { computeColumnSnapOffsets, computeColumnsTotalWidth, generateKeyExtractor } from '../column-utils';
import { MIN_COLUMN_WIDTH } from '../render-utils';

describe('column-utils', () => {
  describe('generateKeyExtractor', () => {
    it('should use id field when available', () => {
      const item = { id: 'test-id', name: 'Test Item' };
      const result = generateKeyExtractor(item, 0);

      expect(result).toBe('test-id');
    });

    it('should use index when id field is not available', () => {
      const item = { name: 'Test Item' };
      const result = generateKeyExtractor(item, 5);

      expect(result).toBe('5');
    });

    it('should use index when item is null', () => {
      const result = generateKeyExtractor(null, 3);

      expect(result).toBe('3');
    });

    it('should use index when item is undefined', () => {
      const result = generateKeyExtractor(undefined, 7);

      expect(result).toBe('7');
    });

    it('should use index when item is not an object', () => {
      const result1 = generateKeyExtractor('string-item', 1);
      const result2 = generateKeyExtractor(123, 2);
      const result3 = generateKeyExtractor(true, 3);

      expect(result1).toBe('1');
      expect(result2).toBe('2');
      expect(result3).toBe('3');
    });

    it('should convert numeric id to string', () => {
      const item = { id: 42, name: 'Test Item' };
      const result = generateKeyExtractor(item, 0);

      expect(result).toBe('42');
    });

    it('should handle zero index', () => {
      const item = { name: 'Test Item' };
      const result = generateKeyExtractor(item, 0);

      expect(result).toBe('0');
    });
  });

  describe('computeColumnSnapOffsets', () => {
    it('returns [0] for an empty column list', () => {
      expect(computeColumnSnapOffsets([])).toEqual([0]);
    });

    it('accumulates explicit widths', () => {
      const columns = [{ width: 80 }, { width: 100 }, { width: 80 }];
      expect(computeColumnSnapOffsets(columns)).toEqual([0, 80, 180, 260]);
    });

    it('falls back to MIN_COLUMN_WIDTH when width is undefined', () => {
      const columns = [{ width: 80 }, { width: undefined }, { width: 100 }];
      expect(computeColumnSnapOffsets(columns)).toEqual([0, 80, 80 + MIN_COLUMN_WIDTH, 80 + MIN_COLUMN_WIDTH + 100]);
    });

    it('handles a single column', () => {
      expect(computeColumnSnapOffsets([{ width: 120 }])).toEqual([0, 120]);
    });

    it('handles uniform widths', () => {
      const columns = Array.from({ length: 5 }, () => ({ width: 80 }));
      expect(computeColumnSnapOffsets(columns)).toEqual([0, 80, 160, 240, 320, 400]);
    });
  });

  describe('computeColumnsTotalWidth', () => {
    it('returns 0 for an empty column list', () => {
      expect(computeColumnsTotalWidth([])).toBe(0);
    });

    it('sums explicit widths', () => {
      const columns = [{ width: 80 }, { width: 100 }, { width: 120 }];
      expect(computeColumnsTotalWidth(columns)).toBe(300);
    });

    it('falls back to MIN_COLUMN_WIDTH when width is undefined', () => {
      const columns = [{ width: 80 }, { width: undefined }, { width: 100 }];
      expect(computeColumnsTotalWidth(columns)).toBe(80 + MIN_COLUMN_WIDTH + 100);
    });

    it('handles a single column', () => {
      expect(computeColumnsTotalWidth([{ width: 200 }])).toBe(200);
    });
  });
});
