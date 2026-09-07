import { resolveSegmentColor } from './resolve-segment-color.util';

const FALLBACK = '#123456';

describe('resolveSegmentColor', () => {
  it('returns a solid string color as-is', () => {
    expect(resolveSegmentColor('#ff0000', FALLBACK)).toBe('#ff0000');
  });

  it('returns the second (primary) value of a gradient tuple', () => {
    expect(resolveSegmentColor(['#aaa', '#bbb'], FALLBACK)).toBe('#bbb');
  });

  it('falls back to the first tuple value when the second is missing', () => {
    expect(resolveSegmentColor(['#aaa'] as unknown as [string, string], FALLBACK)).toBe('#aaa');
  });

  it('uses the fallback for undefined color', () => {
    expect(resolveSegmentColor(undefined, FALLBACK)).toBe(FALLBACK);
  });

  it('uses the fallback for an empty string', () => {
    expect(resolveSegmentColor('', FALLBACK)).toBe(FALLBACK);
  });

  it('skips an empty second tuple entry and uses the first color', () => {
    expect(resolveSegmentColor(['#aaa', ''], FALLBACK)).toBe('#aaa');
  });

  it('falls back when both tuple entries are empty', () => {
    expect(resolveSegmentColor(['', ''], FALLBACK)).toBe(FALLBACK);
  });
});
