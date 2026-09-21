import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { ReactNode, useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { EtScrollHeaderFade } from '../../../data-display/scroll-header-fade';
import {
  FOOTER_BUTTON_GAP,
  FOOTER_HEIGHT_ESTIMATE,
  FOOTER_PADDING_BOTTOM,
  FOOTER_PADDING_HORIZONTAL,
  FOOTER_PADDING_TOP,
  FOOTER_SCROLL_FADE_HEIGHT,
  FOOTER_SCROLL_FADE_TEST_ID,
} from './use-et-bottom-sheet-footer.const';

interface UseEtBottomSheetFooterOptions {
  /** Footer child element */
  footerChild: ReactNode | undefined;
  /** Background color for the footer */
  backgroundColor: string;
  /** Bottom safe area inset */
  bottomInset: number;
  /** Visual variant — glass makes the footer transparent so the sheet's glass background shows through */
  variant?: 'default' | 'glass';
  /** When true, omit the solid background layer so the footer is transparent (ignored for glass, which is already transparent). */
  transparent?: boolean;
  /** Remaining scroll distance driving the fade above the footer. See `EtBottomSheetFooterProps.scrollFade`. */
  scrollFade?: SharedValue<number>;
}

interface UseEtBottomSheetFooterResult {
  /** Render function for BottomSheetModal's footerComponent prop */
  renderFooter: ((props: BottomSheetFooterProps) => ReactNode) | undefined;
  /** Current measured footer height (or estimate if not yet measured) */
  footerHeight: number;
  /** Reset footer height (call when sheet closes) */
  resetFooterHeight: () => void;
}

/**
 * Hook to manage footer rendering for the bottom sheet.
 *
 * Handles:
 * - Keyboard-aware sticky footer using BottomSheetFooter
 * - Safe area padding with solid background
 * - Footer height measurement for spacer calculation
 *
 * Height Measurement Strategy:
 * 1. Initial render uses calculated estimate (based on typical button + padding)
 * 2. onLayout measures actual height and caches it
 * 3. Subsequent opens use cached height (no flash)
 * 4. Reset preserves cache to avoid flash on reopen
 *
 * @param options - Footer configuration options
 * @returns Footer render function and height state
 */
export function useEtBottomSheetFooter({
  footerChild,
  backgroundColor,
  bottomInset,
  variant = 'default',
  transparent = false,
  scrollFade,
}: UseEtBottomSheetFooterOptions): UseEtBottomSheetFooterResult {
  const isGlass = variant === 'glass';
  // Glass is already transparent; `transparent` opts a default sheet into the same.
  const hideBackground = isGlass || transparent;

  // Cache the last measured height to avoid visual flash on reopen
  const lastMeasuredHeightRef = useRef<number | null>(null);

  // Initialize with cached height or estimate to prevent layout jump
  const [footerHeight, setFooterHeight] = useState(lastMeasuredHeightRef.current ?? FOOTER_HEIGHT_ESTIMATE);

  // Calculate bottom padding: use the larger of design padding (X12) or safe area inset
  const bottomPadding = Math.max(FOOTER_PADDING_BOTTOM, bottomInset);

  // Measure footer height for spacer calculation
  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    lastMeasuredHeightRef.current = height;
    setFooterHeight((prevHeight) => (prevHeight !== height ? height : prevHeight));
  }, []);

  // Reset footer height to last measured value (or estimate if never measured)
  const resetFooterHeight = useCallback(() => {
    setFooterHeight(lastMeasuredHeightRef.current ?? FOOTER_HEIGHT_ESTIMATE);
  }, []);

  // Keep a ref to the latest footer child so the memoized render function
  // always reads fresh content without needing footerChild as a dependency.
  const footerChildRef = useRef(footerChild);
  footerChildRef.current = footerChild;

  // Render keyboard-aware sticky footer using BottomSheetFooter.
  // Memoized with useCallback — BottomSheetModal uses footerComponent as a
  // component type, so a new reference causes a full unmount/remount of the
  // footer subtree (killing TextInput focus, animations, etc.).
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => {
      const child = footerChildRef.current;
      if (!child) return null;

      // Transparent footer (glass variant or opt-in): skip the solid background —
      // the sheet's own/glass background shows through. The scroll spacer keeps
      // content above the footer.
      return (
        <BottomSheetFooter {...props}>
          <View style={[styles.footer, { paddingBottom: bottomPadding }]} onLayout={handleFooterLayout}>
            {hideBackground ? null : <View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} />}
            {/* Negative `top` lifts the fade clear of the footer's own box — inside it, the gradient
                would paint the surface color over the identical opaque background and stay invisible.
                The footer container has no `overflow: hidden`, so it isn't clipped. */}
            {scrollFade ? (
              <View style={styles.scrollFade} pointerEvents="none" testID={FOOTER_SCROLL_FADE_TEST_ID}>
                <EtScrollHeaderFade edge="top" scrollY={scrollFade} color={backgroundColor} height={FOOTER_SCROLL_FADE_HEIGHT} />
              </View>
            ) : null}
            {child}
          </View>
        </BottomSheetFooter>
      );
    },
    [bottomPadding, handleFooterLayout, hideBackground, backgroundColor, scrollFade],
  );

  return {
    renderFooter: footerChild ? renderFooter : undefined,
    footerHeight,
    resetFooterHeight,
  };
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: FOOTER_PADDING_HORIZONTAL,
    paddingTop: FOOTER_PADDING_TOP,
    gap: FOOTER_BUTTON_GAP,
    overflow: 'visible',
  },
  scrollFade: {
    position: 'absolute',
    top: -FOOTER_SCROLL_FADE_HEIGHT,
    left: 0,
    right: 0,
    height: FOOTER_SCROLL_FADE_HEIGHT,
  },
});
