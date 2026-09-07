import { Platform } from 'react-native';

import { resolveMediaCardOverlay, supportsMediaCardOverlayMixBlend } from './card-overlay';

describe('resolveMediaCardOverlay', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOS });
  });

  it('GIVEN iOS WHEN resolving THEN keeps Figma gloss + blend mode', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
    expect(resolveMediaCardOverlay('standard')).toEqual({
      colors: ['rgba(255, 255, 255, 0.75)', 'rgba(44, 44, 44, 0)'],
      useMixBlendOverlay: true,
    });
  });

  it('GIVEN Android dark variant WHEN resolving THEN uses a soft gradient without blend mode', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    expect(resolveMediaCardOverlay('dark')).toEqual({
      colors: ['rgba(255, 255, 255, 0.12)', 'rgba(44, 44, 44, 0)'],
      useMixBlendOverlay: false,
    });
  });

  it('GIVEN Android standard variant WHEN resolving THEN uses a reduced gloss without blend mode', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    expect(resolveMediaCardOverlay('standard')).toEqual({
      colors: ['rgba(255, 255, 255, 0.32)', 'rgba(44, 44, 44, 0)'],
      useMixBlendOverlay: false,
    });
  });
});

describe('supportsMediaCardOverlayMixBlend', () => {
  const originalOS = Platform.OS;
  const originalVersion = Platform.Version;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOS });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: originalVersion });
  });

  it('returns true on iOS', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: '17.0' });
    expect(supportsMediaCardOverlayMixBlend()).toBe(true);
  });

  it('returns false on Android API 28', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: 28 });
    expect(supportsMediaCardOverlayMixBlend()).toBe(false);
  });

  it('returns true on Android API 29+', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: 29 });
    expect(supportsMediaCardOverlayMixBlend()).toBe(true);
  });
});
