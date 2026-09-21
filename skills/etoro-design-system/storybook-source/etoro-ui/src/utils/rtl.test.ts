import { I18nManager } from 'react-native';

import { isRTL, isRtlMirroredIconName, rtlMirrorTransform, rtlSign } from './rtl';

function setRTL(value: boolean): void {
  // I18nManager.isRTL is a plain boolean field in the RN mock; set it directly.
  (I18nManager as { isRTL: boolean }).isRTL = value;
}

describe('rtl utils', () => {
  const originalIsRTL = I18nManager.isRTL;

  afterEach(() => {
    setRTL(originalIsRTL);
  });

  describe('isRTL', () => {
    it('reflects I18nManager.isRTL', () => {
      setRTL(true);
      expect(isRTL()).toBe(true);
      setRTL(false);
      expect(isRTL()).toBe(false);
    });
  });

  describe('rtlSign', () => {
    it('returns -1 in RTL and +1 in LTR', () => {
      setRTL(true);
      expect(rtlSign()).toBe(-1);
      setRTL(false);
      expect(rtlSign()).toBe(1);
    });
  });

  describe('isRtlMirroredIconName', () => {
    it.each(['angle-left', 'angle-right-small-fill', 'arrow-right', 'arrow-left-fill', 'chevronLeft', 'chevronRight'])(
      'mirrors registered navigation glyph "%s"',
      (name) => {
        expect(isRtlMirroredIconName(name)).toBe(true);
      },
    );

    it.each([
      // trend / external-link / swap arrows keep their physical direction
      'arrow-up-right-fill',
      'arrow-down-right-small-fill',
      'arrow-up-right-from-square',
      'arrow-right-left',
      // vertical & direction-neutral glyphs
      'angle-up',
      'caret-down',
      'play',
      'settings',
      'copyright',
      'feedback',
      undefined,
      null,
      '',
    ])('does not mirror "%s"', (name) => {
      expect(isRtlMirroredIconName(name)).toBe(false);
    });
  });

  describe('rtlMirrorTransform', () => {
    it('mirrors a registered icon only in RTL', () => {
      setRTL(true);
      expect(rtlMirrorTransform('chevronLeft')).toEqual([{ scaleX: -1 }]);
      setRTL(false);
      expect(rtlMirrorTransform('chevronLeft')).toBeUndefined();
    });

    it('never mirrors an unregistered icon by default', () => {
      setRTL(true);
      expect(rtlMirrorTransform('play')).toBeUndefined();
      expect(rtlMirrorTransform('arrow-up-right-fill')).toBeUndefined();
    });

    it('honours the flipInRTL override in RTL', () => {
      setRTL(true);
      expect(rtlMirrorTransform('play', true)).toEqual([{ scaleX: -1 }]);
      expect(rtlMirrorTransform('chevronLeft', false)).toBeUndefined();
    });

    it('ignores the flipInRTL override in LTR', () => {
      setRTL(false);
      expect(rtlMirrorTransform('play', true)).toBeUndefined();
    });
  });
});
