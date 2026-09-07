import { describe, expect, it } from '@jest/globals';

import { BOUNCY_SPRING_CONFIG, FAST_SPRING_CONFIG, REDUCED_MOTION_SPRING_CONFIG, SMOOTH_SPRING_CONFIG } from './et-bottom-sheet.const';
import { resolveAccessibilityAnnouncementDelay, resolveBottomSheetAnimationConfig } from './resolve-bottom-sheet-animation-config';

describe('resolveBottomSheetAnimationConfig', () => {
  it('returns bouncy config by default preset', () => {
    expect(resolveBottomSheetAnimationConfig('bouncy', false)).toEqual(BOUNCY_SPRING_CONFIG);
  });

  it('returns smooth config for smooth preset', () => {
    expect(resolveBottomSheetAnimationConfig('smooth', false)).toEqual(SMOOTH_SPRING_CONFIG);
  });

  it('returns fast config for fast preset', () => {
    expect(resolveBottomSheetAnimationConfig('fast', false)).toEqual(FAST_SPRING_CONFIG);
  });

  it('returns reduced motion config regardless of preset', () => {
    expect(resolveBottomSheetAnimationConfig('bouncy', true)).toEqual(REDUCED_MOTION_SPRING_CONFIG);
    expect(resolveBottomSheetAnimationConfig('smooth', true)).toEqual(REDUCED_MOTION_SPRING_CONFIG);
    expect(resolveBottomSheetAnimationConfig('fast', true)).toEqual(REDUCED_MOTION_SPRING_CONFIG);
  });
});

describe('resolveAccessibilityAnnouncementDelay', () => {
  it('returns preset-specific delays when motion is enabled', () => {
    expect(resolveAccessibilityAnnouncementDelay('smooth', false)).toBe(350);
    expect(resolveAccessibilityAnnouncementDelay('bouncy', false)).toBe(450);
    expect(resolveAccessibilityAnnouncementDelay('fast', false)).toBe(250);
  });

  it('returns 0 when reduced motion is enabled', () => {
    expect(resolveAccessibilityAnnouncementDelay('bouncy', true)).toBe(0);
  });
});
