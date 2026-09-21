import { renderHook } from '@testing-library/react-native';

import { useScrollFade } from './use-scroll-fade';

jest.mock('@etoro/common/di/core', () => ({
  etInject: () => ({
    getCurrentDirection: () => 'ltr',
  }),
}));

describe('useScrollFade', () => {
  it('anchors initial fade to the start edge by default when content overflows', () => {
    const { result } = renderHook(() => useScrollFade('start'));

    result.current.handleLayout({ nativeEvent: { layout: { width: 100 } } });
    result.current.handleContentSizeChange(200);

    expect(result.current.startFadeOpacity.value).toBe(0);
    expect(result.current.endFadeOpacity.value).toBe(1);
  });

  it('anchors initial fade to the end edge when initialAnchor is end', () => {
    const { result } = renderHook(() => useScrollFade('end'));

    result.current.handleLayout({ nativeEvent: { layout: { width: 100 } } });
    result.current.handleContentSizeChange(200);

    expect(result.current.startFadeOpacity.value).toBe(1);
    expect(result.current.endFadeOpacity.value).toBe(0);
  });

  it('seeds scrollOffsetX with the restored offset', () => {
    const { result } = renderHook(() => useScrollFade('start', undefined, 120));

    expect(result.current.scrollOffsetX.value).toBe(120);
  });

  it('applyScrollFade updates opacities for a programmatic scroll offset', () => {
    const { result } = renderHook(() => useScrollFade('end'));

    result.current.handleLayout({ nativeEvent: { layout: { width: 100 } } });
    result.current.handleContentSizeChange(200);
    result.current.applyScrollFade(100);

    expect(result.current.startFadeOpacity.value).toBe(1);
    expect(result.current.endFadeOpacity.value).toBe(0);
  });
});
