import { getAnimatedCountWidth } from './get-animated-count-width';

describe('getAnimatedCountWidth', () => {
  it('sums digit slots at full width', () => {
    expect(getAnimatedCountWidth('100', 40)).toBe(120);
  });

  it('counts separators (comma) at half width', () => {
    // 4 digits * 40 + 1 comma * 20 = 180
    expect(getAnimatedCountWidth('1,000', 40)).toBe(180);
  });

  it('counts the decimal point at half width', () => {
    // 3 digits * 40 + 1 dot * 20 = 140
    expect(getAnimatedCountWidth('1.55', 40)).toBe(140);
  });

  it('adds spacing per character when provided', () => {
    // 3 digits * (40 + 2) = 126
    expect(getAnimatedCountWidth('100', 40, 2)).toBe(126);
  });

  it('returns 0 for an empty string', () => {
    expect(getAnimatedCountWidth('', 40)).toBe(0);
  });
});
