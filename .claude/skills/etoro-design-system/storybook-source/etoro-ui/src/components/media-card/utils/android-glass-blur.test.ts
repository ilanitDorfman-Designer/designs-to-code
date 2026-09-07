import { Platform } from 'react-native';

import { resolveMediaCardBlurLayerProps } from './android-glass-blur';

describe('resolveMediaCardBlurLayerProps', () => {
  const originalPlatform = Platform.OS;
  const originalVersion = Platform.Version;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: originalVersion });
  });

  it('GIVEN iOS WHEN resolving THEN keeps caller tint and intensity', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });

    expect(resolveMediaCardBlurLayerProps(30, 'dark', 16)).toEqual({
      intensity: 30,
      tint: 'dark',
      experimentalBlurMethod: 'dimezisBlurView',
    });
  });

  it('GIVEN Android dark tint WHEN resolving THEN uses default tint', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: 33 });

    expect(resolveMediaCardBlurLayerProps(30, 'dark', 16)).toEqual({
      intensity: 16,
      tint: 'default',
      blurReductionFactor: 2,
      experimentalBlurMethod: 'dimezisBlurView',
    });
  });

  it('GIVEN Android light tint WHEN resolving THEN preserves light tint', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    Object.defineProperty(Platform, 'Version', { configurable: true, value: 33 });

    expect(resolveMediaCardBlurLayerProps(30, 'light', 20)).toEqual({
      intensity: 20,
      tint: 'light',
      blurReductionFactor: 2,
      experimentalBlurMethod: 'dimezisBlurView',
    });
  });
});
