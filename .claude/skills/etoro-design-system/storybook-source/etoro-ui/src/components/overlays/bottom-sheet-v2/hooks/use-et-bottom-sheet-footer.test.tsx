import { act, render, renderHook } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { useEtBottomSheetFooter } from './use-et-bottom-sheet-footer';
import {
  FOOTER_HEIGHT_ESTIMATE,
  FOOTER_PADDING_BOTTOM,
  FOOTER_SCROLL_FADE_HEIGHT,
  FOOTER_SCROLL_FADE_TEST_ID,
} from './use-et-bottom-sheet-footer.const';

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    BottomSheetFooter: ({ children }: { children: React.ReactNode }) => <View testID="bottom-sheet-footer">{children}</View>,
  };
});

jest.mock('../../../data-display/scroll-header-fade', () => {
  const { View } = require('react-native');
  return {
    EtScrollHeaderFade: (props: { edge?: string; color?: string; height?: number }) => <View testID="scroll-header-fade" {...props} />,
  };
});

describe('useEtBottomSheetFooter', () => {
  const defaultOptions = {
    footerChild: <Text>Footer Content</Text>,
    backgroundColor: '#FFFFFF',
    bottomInset: 34,
  };

  describe('initial state', () => {
    it('should return footer height estimate initially', () => {
      const { result } = renderHook(() => useEtBottomSheetFooter(defaultOptions));

      expect(result.current.footerHeight).toBe(FOOTER_HEIGHT_ESTIMATE);
    });

    it('should return renderFooter function when footerChild is provided', () => {
      const { result } = renderHook(() => useEtBottomSheetFooter(defaultOptions));

      expect(result.current.renderFooter).toBeDefined();
      expect(typeof result.current.renderFooter).toBe('function');
    });

    it('should return undefined renderFooter when footerChild is undefined', () => {
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          footerChild: undefined,
        }),
      );

      expect(result.current.renderFooter).toBeUndefined();
    });
  });

  describe('bottom padding calculation', () => {
    it('should use FOOTER_PADDING_BOTTOM when bottomInset is smaller', () => {
      const smallInset = 10; // Less than X12 (48px)
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          bottomInset: smallInset,
        }),
      );

      // Render the footer to check the padding
      const footerProps = { animatedFooterPosition: { value: 0 } };
      const rendered = result.current.renderFooter?.(footerProps as any);

      // The footer View should have paddingBottom = FOOTER_PADDING_BOTTOM
      expect(rendered).toBeTruthy();
    });

    it('should use bottomInset when it is larger than FOOTER_PADDING_BOTTOM', () => {
      const largeInset = 60; // Greater than X12 (48px)
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          bottomInset: largeInset,
        }),
      );

      expect(result.current.renderFooter).toBeDefined();
    });

    it('should use FOOTER_PADDING_BOTTOM when bottomInset equals it', () => {
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          bottomInset: FOOTER_PADDING_BOTTOM,
        }),
      );

      expect(result.current.renderFooter).toBeDefined();
    });
  });

  describe('renderFooter', () => {
    it('should return null when footerChild is not provided', () => {
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          footerChild: undefined,
        }),
      );

      expect(result.current.renderFooter).toBeUndefined();
    });

    it('should render footer content when footerChild is provided', () => {
      const { result } = renderHook(() => useEtBottomSheetFooter(defaultOptions));

      const footerProps = { animatedFooterPosition: { value: 0 } };
      const rendered = result.current.renderFooter?.(footerProps as any);

      expect(rendered).toBeTruthy();
    });
  });

  describe('scrollFade', () => {
    const scrollFade = { value: 0 } as SharedValue<number>;

    function renderFooterTree(options: Parameters<typeof useEtBottomSheetFooter>[0]) {
      const { result } = renderHook(() => useEtBottomSheetFooter(options));
      const footerProps = { animatedFooterPosition: { value: 0 } };
      return render(<>{result.current.renderFooter?.(footerProps as never)}</>);
    }

    it('should not render the fade when no scrollFade is provided', () => {
      const { queryByTestId } = renderFooterTree(defaultOptions);

      expect(queryByTestId(FOOTER_SCROLL_FADE_TEST_ID)).toBeNull();
    });

    it('should render the fade in the sheet surface color, driven by the provided scroll distance', () => {
      const { getByTestId } = renderFooterTree({ ...defaultOptions, scrollFade });

      const fade = getByTestId('scroll-header-fade');
      expect(fade.props.edge).toBe('top');
      expect(fade.props.color).toBe(defaultOptions.backgroundColor);
      expect(fade.props.height).toBe(FOOTER_SCROLL_FADE_HEIGHT);
    });

    it('should position the fade fully above the footer box, not inside its padding', () => {
      const { getByTestId } = renderFooterTree({ ...defaultOptions, scrollFade });

      // Regression guard (PBD-944): a `top` anywhere inside the footer's own box paints the
      // gradient over the identical opaque background, making it invisible.
      expect(getByTestId(FOOTER_SCROLL_FADE_TEST_ID).props.style).toMatchObject({
        position: 'absolute',
        top: -FOOTER_SCROLL_FADE_HEIGHT,
        height: FOOTER_SCROLL_FADE_HEIGHT,
      });
    });
  });

  describe('resetFooterHeight', () => {
    it('should reset to FOOTER_HEIGHT_ESTIMATE when never measured', () => {
      const { result } = renderHook(() => useEtBottomSheetFooter(defaultOptions));

      // Initially should be estimate
      expect(result.current.footerHeight).toBe(FOOTER_HEIGHT_ESTIMATE);

      // Reset should keep it at estimate
      act(() => {
        result.current.resetFooterHeight();
      });

      expect(result.current.footerHeight).toBe(FOOTER_HEIGHT_ESTIMATE);
    });
  });

  describe('footer height caching', () => {
    it('should preserve cached height across hook updates', () => {
      const { result, rerender } = renderHook((props) => useEtBottomSheetFooter(props), { initialProps: defaultOptions });

      expect(result.current.footerHeight).toBe(FOOTER_HEIGHT_ESTIMATE);

      // Rerender with different backgroundColor
      rerender({ ...defaultOptions, backgroundColor: '#000000' });

      // Height should still be the estimate (no measurement happened)
      expect(result.current.footerHeight).toBe(FOOTER_HEIGHT_ESTIMATE);
    });
  });

  describe('edge cases', () => {
    it('should handle zero bottomInset', () => {
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          bottomInset: 0,
        }),
      );

      // Should use FOOTER_PADDING_BOTTOM as minimum
      expect(result.current.renderFooter).toBeDefined();
    });

    it('should handle negative bottomInset gracefully', () => {
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          bottomInset: -10,
        }),
      );

      // Should use FOOTER_PADDING_BOTTOM as minimum
      expect(result.current.renderFooter).toBeDefined();
    });

    it('should handle null footerChild', () => {
      const { result } = renderHook(() =>
        useEtBottomSheetFooter({
          ...defaultOptions,
          footerChild: null,
        }),
      );

      // null is falsy, so renderFooter should be undefined
      expect(result.current.renderFooter).toBeUndefined();
    });
  });
});
