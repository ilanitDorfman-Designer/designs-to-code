import { afterEach, describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { I18nManager } from 'react-native';

import { useLayoutDirection } from './use-layout-direction';

// I18nManager.isRTL is a plain boolean field in the RN mock; set it directly.
function setIsRTL(value: boolean) {
  (I18nManager as { isRTL: boolean }).isRTL = value;
}

const ORIGINAL_IS_RTL = I18nManager.isRTL;

afterEach(() => {
  setIsRTL(ORIGINAL_IS_RTL);
});

describe('useLayoutDirection (native)', () => {
  it('GIVEN I18nManager reports LTR, WHEN rendered, THEN returns "ltr"', () => {
    setIsRTL(false);

    const { result } = renderHook(() => useLayoutDirection());

    expect(result.current).toBe('ltr');
  });

  it('GIVEN I18nManager reports RTL, WHEN rendered, THEN returns "rtl"', () => {
    setIsRTL(true);

    const { result } = renderHook(() => useLayoutDirection());

    expect(result.current).toBe('rtl');
  });
});
