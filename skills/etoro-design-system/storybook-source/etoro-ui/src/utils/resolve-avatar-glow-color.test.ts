import {
  DARK_MODE_AVATAR_GLOW_FALLBACK,
  LIGHT_MODE_WHITE_AVATAR_GLOW_FALLBACK,
  pickAvatarBrandColor,
  pickAvatarGlowSource,
  resolveAvatarGlowColor,
} from './resolve-avatar-glow-color';

describe('pickAvatarBrandColor', () => {
  it('GIVEN a light paper background and a navy logo WHEN picking THEN returns the navy', () => {
    expect(pickAvatarBrandColor('#F7F7F7', '#0A2240')).toBe('#0A2240');
  });

  it('GIVEN a navy background and a white logo WHEN picking THEN returns the navy', () => {
    expect(pickAvatarBrandColor('#0A2240', '#FFFFFF')).toBe('#0A2240');
  });

  it('GIVEN only a background WHEN picking THEN returns the background', () => {
    expect(pickAvatarBrandColor('#0A2240')).toBe('#0A2240');
  });
});

describe('pickAvatarGlowSource', () => {
  it('GIVEN a white pad and black ink WHEN picking THEN returns the white pad', () => {
    expect(pickAvatarGlowSource('#FFFFFF', '#000000')).toBe('#FFFFFF');
  });

  it('GIVEN a black pad and white ink WHEN picking THEN returns the black pad', () => {
    expect(pickAvatarGlowSource('#000000', '#FFFFFF')).toBe('#000000');
  });

  it('GIVEN a black pad and a navy logo WHEN picking THEN returns the navy', () => {
    expect(pickAvatarGlowSource('#000000', '#0A2240')).toBe('#0A2240');
  });

  it('GIVEN a light paper background and a navy logo WHEN picking THEN returns the navy', () => {
    expect(pickAvatarGlowSource('#F7F7F7', '#0A2240')).toBe('#0A2240');
  });

  it('GIVEN a navy background and a white logo WHEN picking THEN returns the navy', () => {
    expect(pickAvatarGlowSource('#0A2240', '#FFFFFF')).toBe('#0A2240');
  });
});

describe('resolveAvatarGlowColor', () => {
  describe('dark mode', () => {
    it('GIVEN a black avatar WHEN resolving THEN returns white', () => {
      expect(resolveAvatarGlowColor('#000000', true)).toBe(DARK_MODE_AVATAR_GLOW_FALLBACK);
      expect(resolveAvatarGlowColor('#000', true)).toBe(DARK_MODE_AVATAR_GLOW_FALLBACK);
    });

    it('GIVEN a near-black charcoal WHEN resolving THEN returns white', () => {
      expect(resolveAvatarGlowColor('#1A1A1A', true)).toBe(DARK_MODE_AVATAR_GLOW_FALLBACK);
      expect(resolveAvatarGlowColor('rgb(10, 10, 10)', true)).toBe(DARK_MODE_AVATAR_GLOW_FALLBACK);
    });

    it('GIVEN a white avatar WHEN resolving THEN keeps white', () => {
      expect(resolveAvatarGlowColor('#FFFFFF', true)).toBe('#FFFFFF');
      expect(resolveAvatarGlowColor('#FFF', true)).toBe('#FFF');
    });

    it('GIVEN a navy avatar WHEN resolving THEN keeps the original tint', () => {
      expect(resolveAvatarGlowColor('#0A2240', true)).toBe('#0A2240');
    });

    it('GIVEN a saturated brand color WHEN resolving THEN keeps the original tint', () => {
      expect(resolveAvatarGlowColor('#F7931A', true)).toBe('#F7931A');
      expect(resolveAvatarGlowColor('#0052FF', true)).toBe('#0052FF');
    });

    it('GIVEN an unparseable color WHEN resolving THEN keeps the original value', () => {
      expect(resolveAvatarGlowColor('transparent', true)).toBe('transparent');
    });
  });

  describe('light mode', () => {
    it('GIVEN a black avatar WHEN resolving THEN keeps black', () => {
      expect(resolveAvatarGlowColor('#000000', false)).toBe('#000000');
      expect(resolveAvatarGlowColor('#000', false)).toBe('#000');
    });

    it('GIVEN a near-black charcoal WHEN resolving THEN keeps the original tint', () => {
      expect(resolveAvatarGlowColor('#1A1A1A', false)).toBe('#1A1A1A');
    });

    it('GIVEN a white avatar WHEN resolving THEN returns gray', () => {
      expect(resolveAvatarGlowColor('#FFFFFF', false)).toBe(LIGHT_MODE_WHITE_AVATAR_GLOW_FALLBACK);
      expect(resolveAvatarGlowColor('#FFF', false)).toBe(LIGHT_MODE_WHITE_AVATAR_GLOW_FALLBACK);
    });

    it('GIVEN a navy avatar WHEN resolving THEN keeps the original tint', () => {
      expect(resolveAvatarGlowColor('#0A2240', false)).toBe('#0A2240');
    });

    it('GIVEN a brand color WHEN resolving THEN keeps the original color', () => {
      expect(resolveAvatarGlowColor('#F7931A', false)).toBe('#F7931A');
    });
  });

  it('GIVEN no color WHEN resolving THEN returns undefined', () => {
    expect(resolveAvatarGlowColor(undefined, true)).toBeUndefined();
    expect(resolveAvatarGlowColor(undefined, false)).toBeUndefined();
  });

  describe('see-through tints', () => {
    it('GIVEN a fully transparent black WHEN resolving THEN reports no color instead of the opaque fallback', () => {
      expect(resolveAvatarGlowColor('#00000000', true)).toBeUndefined();
      expect(resolveAvatarGlowColor('rgba(0, 0, 0, 0)', true)).toBeUndefined();
      expect(resolveAvatarGlowColor('#0000', true)).toBeUndefined();
    });

    it('GIVEN a fully transparent white WHEN resolving THEN reports no color instead of the light-mode gray', () => {
      expect(resolveAvatarGlowColor('#FFFFFF00', false)).toBeUndefined();
      expect(resolveAvatarGlowColor('rgba(255, 255, 255, 0)', false)).toBeUndefined();
    });

    it('GIVEN a partially transparent tint WHEN resolving THEN keeps it verbatim rather than making it opaque', () => {
      expect(resolveAvatarGlowColor('rgba(0, 0, 0, 0.5)', true)).toBe('rgba(0, 0, 0, 0.5)');
      expect(resolveAvatarGlowColor('#FFFFFF80', false)).toBe('#FFFFFF80');
    });

    it('GIVEN a fully opaque alpha channel WHEN resolving THEN the greyscale fallback still applies', () => {
      expect(resolveAvatarGlowColor('#000000FF', true)).toBe(DARK_MODE_AVATAR_GLOW_FALLBACK);
      expect(resolveAvatarGlowColor('rgba(255, 255, 255, 1)', false)).toBe(LIGHT_MODE_WHITE_AVATAR_GLOW_FALLBACK);
    });
  });
});
