/**
 * Default marquee auto-scroll follows reading direction:
 * LTR → right-to-left (`false`), RTL → left-to-right (`true`).
 * Passing `reverse` flips whichever locale default applies.
 */
export function getMarqueeScrollReverse(reverse: boolean, rtl: boolean): boolean {
  return rtl ? !reverse : reverse;
}
