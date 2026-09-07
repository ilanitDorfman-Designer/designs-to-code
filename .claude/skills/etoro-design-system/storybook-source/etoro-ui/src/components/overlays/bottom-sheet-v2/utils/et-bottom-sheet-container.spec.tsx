import { describe, expect, it } from '@jest/globals';
import { Platform } from 'react-native';

import { resolveBottomSheetContainerComponent } from './et-bottom-sheet-container';

describe('resolveBottomSheetContainerComponent', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('returns a FullWindowOverlay container on iOS by default', () => {
    Platform.OS = 'ios';
    const container = resolveBottomSheetContainerComponent();
    expect(container).toBeDefined();
    expect(typeof container).toBe('function');
    expect(resolveBottomSheetContainerComponent(false)).toBe(container);
  });

  it('returns undefined on iOS when FullWindowOverlay is disabled', () => {
    Platform.OS = 'ios';
    expect(resolveBottomSheetContainerComponent(true)).toBeUndefined();
  });

  it('returns undefined on Android regardless of the flag', () => {
    Platform.OS = 'android';
    expect(resolveBottomSheetContainerComponent()).toBeUndefined();
    expect(resolveBottomSheetContainerComponent(false)).toBeUndefined();
    expect(resolveBottomSheetContainerComponent(true)).toBeUndefined();
  });
});
