import { Platform } from 'react-native';

import { resolveMediaCardFooterOverlay, resolveMediaCardFooterOverlayPreset, resolveMediaCardFooterScrimOpacity } from './footer-overlay';

describe('resolveMediaCardFooterOverlayPreset', () => {
  it('GIVEN standard non-bright surface WHEN resolving THEN uses media', () => {
    expect(resolveMediaCardFooterOverlayPreset('standard', false)).toBe('media');
  });

  it('GIVEN near-white standard surface WHEN resolving THEN uses muted like bright', () => {
    expect(resolveMediaCardFooterOverlayPreset('standard', true)).toBe('muted');
  });

  it('GIVEN bright or dark variant WHEN resolving THEN uses muted', () => {
    expect(resolveMediaCardFooterOverlayPreset('bright', true)).toBe('muted');
    expect(resolveMediaCardFooterOverlayPreset('dark', false)).toBe('muted');
  });
});

describe('resolveMediaCardFooterOverlay', () => {
  it('resolves media → Carbon Neutral 900 static @ 0.15', () => {
    expect(resolveMediaCardFooterOverlay('media', '#123456')).toEqual({
      color: '#123456',
      opacity: 0.15,
    });
  });

  it('resolves muted → Carbon Neutral 500 @ 0.1', () => {
    expect(resolveMediaCardFooterOverlay('muted', '#123456')).toEqual({
      color: '#999999',
      opacity: 0.1,
    });
  });

  it('GIVEN Android bright surface WHEN muted THEN uses white scrim instead of grey', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    expect(resolveMediaCardFooterOverlay('muted', '#123456', true, '#FAFAFA')).toEqual({
      color: '#FAFAFA',
      opacity: 0.08,
    });
  });

  it('defaults to media', () => {
    expect(resolveMediaCardFooterOverlay(undefined, '#123456').opacity).toBe(0.15);
  });
});

describe('resolveMediaCardFooterScrimOpacity', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('GIVEN iOS WHEN no override THEN keeps preset opacity', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
    expect(resolveMediaCardFooterScrimOpacity('media', 0.15)).toBe(0.15);
  });

  it('GIVEN Android WHEN no override THEN applies a light scrim bump', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    expect(resolveMediaCardFooterScrimOpacity('media', 0.15)).toBe(0.17);
    expect(resolveMediaCardFooterScrimOpacity('muted', 0.1)).toBe(0.11);
  });

  it('GIVEN Android bright surface WHEN muted overlay THEN keeps preset opacity', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    expect(resolveMediaCardFooterScrimOpacity('muted', 0.08, undefined, true)).toBe(0.08);
  });

  it('GIVEN explicit override THEN uses override on any platform', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    expect(resolveMediaCardFooterScrimOpacity('media', 0.15, 0.5)).toBe(0.5);
  });
});
