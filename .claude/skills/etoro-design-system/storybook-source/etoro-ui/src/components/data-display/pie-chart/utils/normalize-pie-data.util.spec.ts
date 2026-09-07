import { normalizePieData, OTHER_SEGMENT_KEY } from './normalize-pie-data.util';

describe('normalizePieData', () => {
  it('returns an empty array for undefined / empty input', () => {
    expect(normalizePieData()).toEqual([]);
    expect(normalizePieData([])).toEqual([]);
  });

  it('drops non-finite and non-positive values', () => {
    const result = normalizePieData([
      { key: 'a', value: 10 },
      { key: 'b', value: 0 },
      { key: 'c', value: -5 },
      { key: 'd', value: Number.NaN },
      { key: 'e', value: Number.POSITIVE_INFINITY },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('a');
    expect(result[0].fraction).toBe(1);
  });

  it('normalizes fractions to sum to 1', () => {
    const result = normalizePieData([
      { key: 'a', value: 30 },
      { key: 'b', value: 10 },
    ]);

    expect(result.map((s) => s.fraction)).toEqual([0.75, 0.25]);
    expect(result.reduce((sum, s) => sum + s.fraction, 0)).toBeCloseTo(1);
  });

  it('normalizes even when values do not total 100', () => {
    const result = normalizePieData([
      { key: 'a', value: 1 },
      { key: 'b', value: 1 },
      { key: 'c', value: 2 },
    ]);

    expect(result.map((s) => s.fraction)).toEqual([0.25, 0.25, 0.5]);
  });

  it('keeps all segments when count is within the limit', () => {
    const data = [
      { key: 'a', value: 1 },
      { key: 'b', value: 1 },
      { key: 'c', value: 1 },
    ];
    const result = normalizePieData(data, 7);
    expect(result.map((s) => s.key)).toEqual(['a', 'b', 'c']);
  });

  it('folds overflow into a single "Other" segment respecting maxSegments', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ key: `k${i}`, value: i + 1 }));
    const result = normalizePieData(data, 7);

    expect(result).toHaveLength(7);
    expect(result[6].key).toBe(OTHER_SEGMENT_KEY);
    expect(result[6].isOther).toBe(true);
    expect(result.slice(0, 6).every((s) => s.isOther === false)).toBe(true);

    // Other aggregates the folded raw values (k6..k9 => 7+8+9+10 = 34)
    expect(result[6].value).toBe(34);
    expect(result.reduce((sum, s) => sum + s.fraction, 0)).toBeCloseTo(1);
  });

  it('falls back to the default cap when maxSegments is non-finite', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ key: `k${i}`, value: i + 1 }));

    for (const badMax of [Number.NaN, Number.POSITIVE_INFINITY] as const) {
      const result = normalizePieData(data, badMax);
      // Non-finite maxSegments must not disable folding — cap stays at the default 7.
      expect(result).toHaveLength(7);
      expect(result[6].key).toBe(OTHER_SEGMENT_KEY);
    }
  });

  it('keeps fractions finite and summing to 1 for extreme finite values', () => {
    const result = normalizePieData([
      { key: 'a', value: Number.MAX_VALUE },
      { key: 'b', value: Number.MAX_VALUE },
    ]);

    expect(result).toHaveLength(2);
    expect(result.every((s) => Number.isFinite(s.fraction))).toBe(true);
    expect(result.map((s) => s.fraction)).toEqual([0.5, 0.5]);
    expect(result.reduce((sum, s) => sum + s.fraction, 0)).toBeCloseTo(1);
  });

  it('treats maxSegments below 1 as 1', () => {
    const data = [
      { key: 'a', value: 5 },
      { key: 'b', value: 5 },
    ];
    const result = normalizePieData(data, 0);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe(OTHER_SEGMENT_KEY);
    expect(result[0].fraction).toBe(1);
  });

  it('preserves per-segment color through folding', () => {
    const result = normalizePieData([{ key: 'a', value: 5, color: '#fff' }], 7);
    expect(result[0].color).toBe('#fff');
  });
});
