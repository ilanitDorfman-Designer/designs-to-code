import { getMarqueeScrollReverse } from './get-marquee-scroll-reverse';

describe('getMarqueeScrollReverse', () => {
  it.each([
    { reverse: false, rtl: false, expected: false, label: 'LTR default scrolls right-to-left' },
    { reverse: true, rtl: false, expected: true, label: 'LTR reverse scrolls left-to-right' },
    { reverse: false, rtl: true, expected: true, label: 'RTL default scrolls left-to-right' },
    { reverse: true, rtl: true, expected: false, label: 'RTL reverse scrolls right-to-left' },
  ])('$label', ({ reverse, rtl, expected }) => {
    expect(getMarqueeScrollReverse(reverse, rtl)).toBe(expected);
  });
});
