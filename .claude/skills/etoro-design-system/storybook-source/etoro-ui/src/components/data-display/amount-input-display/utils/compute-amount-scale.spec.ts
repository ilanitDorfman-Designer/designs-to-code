import { computeAmountScale } from './compute-amount-scale';

const BASE = { availableWidth: 100000, digitWidth: 35 } as const;

describe('computeAmountScale', () => {
  it('stays at full scale up to the digit threshold', () => {
    expect(computeAmountScale({ ...BASE, value: '12345' })).toBe(1);
  });

  it('shrinks progressively from the 6th digit', () => {
    // 6 digits -> 1 - (6-5)*0.08 = 0.92
    expect(computeAmountScale({ ...BASE, value: '123456' })).toBeCloseTo(0.92, 5);
    // 8 digits -> 1 - 3*0.08 = 0.76
    expect(computeAmountScale({ ...BASE, value: '12345678' })).toBeCloseTo(0.76, 5);
  });

  it('ignores separators when counting digits', () => {
    // "12,345" is 5 digits -> no shrink
    expect(computeAmountScale({ ...BASE, value: '12,345' })).toBe(1);
  });

  it('clamps the progressive term to its floor', () => {
    // Many digits -> below 0.5 progressive, floored at 0.5 (wide container so overflow does not bind)
    expect(computeAmountScale({ ...BASE, value: '123456789012345' })).toBe(0.5);
  });

  it('applies the overflow guard and takes the smaller scale', () => {
    // Narrow container forces overflow below the progressive value.
    const scale = computeAmountScale({ value: '123456', availableWidth: 100, affixWidth: 20, digitWidth: 35 });
    expect(scale).toBeLessThan(0.92);
    expect(scale).toBeGreaterThanOrEqual(0.3);
  });

  it('never drops below the overflow floor for extreme values', () => {
    const scale = computeAmountScale({ value: '123456789', availableWidth: 50, affixWidth: 20, digitWidth: 35 });
    expect(scale).toBe(0.3);
  });

  it('returns full scale before the container is measured', () => {
    expect(computeAmountScale({ ...BASE, value: '123', availableWidth: 0 })).toBe(1);
  });
});
