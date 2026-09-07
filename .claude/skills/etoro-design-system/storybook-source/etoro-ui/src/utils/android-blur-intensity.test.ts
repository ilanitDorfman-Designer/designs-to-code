import { Platform } from 'react-native';

import {
  ANDROID_RENDER_SCRIPT_MAX_BLUR_RADIUS,
  clampAndroidDimezisBlurIntensity,
  EXPO_BLUR_DEFAULT_REDUCTION_FACTOR,
} from './android-blur-intensity';

describe('clampAndroidDimezisBlurIntensity', () => {
  const originalOS = Platform.OS;
  let versionSpy: jest.SpyInstance;

  afterEach(() => {
    Platform.OS = originalOS;
    versionSpy?.mockRestore();
  });

  it('GIVEN iOS WHEN clamping THEN returns intensity unchanged', () => {
    Platform.OS = 'ios';

    expect(clampAndroidDimezisBlurIntensity(95, 1)).toBe(95);
  });

  it('GIVEN Android 12+ WHEN clamping THEN returns intensity unchanged', () => {
    Platform.OS = 'android';
    versionSpy = jest.spyOn(Platform, 'Version', 'get').mockReturnValue(31);

    expect(clampAndroidDimezisBlurIntensity(95, 1)).toBe(95);
  });

  it('GIVEN Android 11 and blurReductionFactor 1 WHEN intensity exceeds cap THEN clamps to 25', () => {
    Platform.OS = 'android';
    versionSpy = jest.spyOn(Platform, 'Version', 'get').mockReturnValue(30);

    expect(clampAndroidDimezisBlurIntensity(95, 1)).toBe(ANDROID_RENDER_SCRIPT_MAX_BLUR_RADIUS);
  });

  it('GIVEN Android 11 and blurReductionFactor 2 WHEN intensity exceeds cap THEN clamps to 50', () => {
    Platform.OS = 'android';
    versionSpy = jest.spyOn(Platform, 'Version', 'get').mockReturnValue(30);

    expect(clampAndroidDimezisBlurIntensity(58, 2)).toBe(ANDROID_RENDER_SCRIPT_MAX_BLUR_RADIUS * 2);
  });

  it('GIVEN Android 11 and default reduction factor WHEN intensity is within cap THEN returns unchanged', () => {
    Platform.OS = 'android';
    versionSpy = jest.spyOn(Platform, 'Version', 'get').mockReturnValue(30);

    expect(clampAndroidDimezisBlurIntensity(55)).toBe(55);
    expect(clampAndroidDimezisBlurIntensity(100, EXPO_BLUR_DEFAULT_REDUCTION_FACTOR)).toBe(100);
  });
});
