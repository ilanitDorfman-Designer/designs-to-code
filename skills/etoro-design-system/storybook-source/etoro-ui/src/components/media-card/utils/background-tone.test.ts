import {
  classifyBackgroundTone,
  contrastRatio,
  getRelativeLuminance,
  isNearWhiteColor,
  MIN_NORMAL_TEXT_CONTRAST,
  prefersDarkForeground,
} from './background-tone';

describe('getRelativeLuminance', () => {
  it('returns 1 for white and 0 for black', () => {
    expect(getRelativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('parses shorthand hex, 8-digit hex, and rgb()/rgba()', () => {
    expect(getRelativeLuminance('#fff')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('#FFFFFF00')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('rgb(255, 255, 255)')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('rgba(0, 0, 0, 0.5)')).toBeCloseTo(0, 5);
  });

  it('parses named colours, space-separated rgb, and hsl()', () => {
    expect(getRelativeLuminance('white')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('black')).toBeCloseTo(0, 5);
    expect(getRelativeLuminance('rgb(255 255 255)')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('rgba(0 0 0 / 0.5)')).toBeCloseTo(0, 5);
    expect(getRelativeLuminance('hsl(0, 0%, 100%)')).toBeCloseTo(1, 5);
    expect(getRelativeLuminance('hsl(0 0% 0%)')).toBeCloseTo(0, 5);
  });

  it('returns null for missing, malformed, or out-of-range colours', () => {
    expect(getRelativeLuminance(undefined)).toBeNull();
    expect(getRelativeLuminance('not-a-color')).toBeNull();
    expect(getRelativeLuminance('#12')).toBeNull();
    expect(getRelativeLuminance('#FFFFFZ')).toBeNull(); // non-hex digit
    expect(getRelativeLuminance('#FFFFFFZZ')).toBeNull(); // non-hex alpha
    expect(getRelativeLuminance('rgb(300, 300, 300)')).toBeNull(); // channel > 255
    expect(getRelativeLuminance('rgba(255, 255, 255, 2)')).toBeNull(); // alpha > 1
  });
});

describe('classifyBackgroundTone', () => {
  it('keeps brand yellow / gold as standard (not near-white)', () => {
    expect(classifyBackgroundTone('#FFCC00')).toBe('standard');
    expect(classifyBackgroundTone('#FFE566')).toBe('standard');
    expect(classifyBackgroundTone('#F5C518')).toBe('standard');
  });

  it('returns bright for white / off-white / very light grey', () => {
    expect(classifyBackgroundTone('#FFFFFF')).toBe('bright');
    expect(classifyBackgroundTone('#F2F3F7')).toBe('bright');
    expect(classifyBackgroundTone('#E2E2E2')).toBe('bright');
    expect(classifyBackgroundTone('rgb(240, 240, 240)')).toBe('bright');
    expect(classifyBackgroundTone('white')).toBe('bright');
    expect(classifyBackgroundTone('rgb(255 255 255)')).toBe('bright');
    expect(classifyBackgroundTone('hsl(0 0% 100%)')).toBe('bright');
  });

  it('returns dark for near-black / charcoal fills', () => {
    expect(classifyBackgroundTone('#000000')).toBe('dark');
    expect(classifyBackgroundTone('#1B1E21')).toBe('dark'); // carbonStatic900
    expect(classifyBackgroundTone('#2C2C2C')).toBe('dark'); // dark surface
    expect(classifyBackgroundTone('rgb(20, 20, 20)')).toBe('dark');
    expect(classifyBackgroundTone('black')).toBe('dark');
    expect(classifyBackgroundTone('hsl(0, 0%, 0%)')).toBe('dark');
  });

  it('returns standard for brand / mid tones (chrome), including yellow and magenta', () => {
    expect(classifyBackgroundTone('#CC2914')).toBe('standard'); // brand red (low luminance, but not near-dark)
    expect(classifyBackgroundTone('#666666')).toBe('standard'); // mid grey above near-dark
    expect(classifyBackgroundTone('#4A4A4A')).toBe('standard'); // dark grey above near-dark ceiling
    expect(classifyBackgroundTone('#FF00FF')).toBe('standard'); // magenta — not near-white
  });

  it('falls back to standard for missing, transparent, or malformed input', () => {
    expect(classifyBackgroundTone(undefined)).toBe('standard');
    expect(classifyBackgroundTone('transparent')).toBe('standard');
    expect(classifyBackgroundTone('#FFFFFF00')).toBe('standard');
    expect(classifyBackgroundTone('#FFF0')).toBe('standard');
    expect(classifyBackgroundTone('rgba(255, 255, 255, 0.5)')).toBe('standard');
    expect(classifyBackgroundTone('#FFFFFZ')).toBe('standard');
    expect(classifyBackgroundTone('rgb(300, 300, 300)')).toBe('standard');
    expect(classifyBackgroundTone('rgba(255, 255, 255, 2)')).toBe('standard');
  });
});

describe('prefersDarkForeground', () => {
  it('GIVEN white on magenta (~3.14:1) WHEN checking normal-text AA THEN requires dark text', () => {
    const magentaLuminance = getRelativeLuminance('#FF00FF');
    expect(magentaLuminance).not.toBeNull();
    expect(contrastRatio(1, magentaLuminance ?? 0)).toBeCloseTo(3.14, 2);
    expect(contrastRatio(1, magentaLuminance ?? 0)).toBeLessThan(MIN_NORMAL_TEXT_CONTRAST);
    expect(prefersDarkForeground('#FF00FF')).toBe(true);
    expect(classifyBackgroundTone('#FF00FF')).toBe('standard');
  });

  it('GIVEN gold WHEN white fails 4.5:1 THEN requires dark text without bright chrome', () => {
    expect(prefersDarkForeground('#FFCC00')).toBe(true);
    expect(classifyBackgroundTone('#FFCC00')).toBe('standard');
  });

  it('GIVEN brand red with usable white text WHEN checking THEN keeps light text', () => {
    expect(prefersDarkForeground('#CC2914')).toBe(false);
  });

  it('GIVEN unparseable colour WHEN checking THEN does not flip', () => {
    expect(prefersDarkForeground(undefined)).toBe(false);
    expect(prefersDarkForeground('not-a-color')).toBe(false);
  });

  it('GIVEN CSS named aliceblue WHEN checking THEN requires dark text', () => {
    expect(prefersDarkForeground('aliceblue')).toBe(true);
  });

  it('GIVEN hwb white WHEN checking THEN requires dark text', () => {
    expect(prefersDarkForeground('hwb(0 100% 0%)')).toBe(true);
  });
});

describe('isNearWhiteColor', () => {
  it('is a bright-tone convenience wrapper', () => {
    expect(isNearWhiteColor('#FFFFFF')).toBe(true);
    expect(isNearWhiteColor('#CC2914')).toBe(false);
    expect(isNearWhiteColor('#FFCC00')).toBe(false);
    expect(isNearWhiteColor('#1B1E21')).toBe(false);
    expect(isNearWhiteColor(undefined)).toBe(false);
  });
});
