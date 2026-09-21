import { render } from '@testing-library/react-native';
import React from 'react';
import { Dimensions } from 'react-native';

import { MAX_FONT_SIZE_MULTIPLIER } from '../utils/variant-config';
import { EtBlurredText } from './et-blurred-text';

const mockUseFont = jest.fn();

// Pin the dimensions feed so the scaling math has a deterministic
// baseline (`fontScale === 1`). The jest-expo preset otherwise hands
// back a non-1 default (`fontScale === 2`) that would silently
// exercise the clamp path on every render. We mock `Dimensions.get`
// (which `useWindowDimensions` polls under the hood) rather than
// spying on `useWindowDimensions` directly — babel's CJS interop in
// this preset captures the destructured hook at import time, so a
// `jest.spyOn(ReactNative, 'useWindowDimensions')` doesn't reach the
// component's call site. Individual tests can override per-call via
// `mockReturnValueOnce` to drive the scaled path explicitly.
const mockDimensionsGet = jest.spyOn(Dimensions, 'get').mockReturnValue({
  width: 375,
  height: 812,
  scale: 2,
  fontScale: 1,
});

// Skia components are replaced with primitive host components so the
// test renderer can find them by their testID. The fake font object
// returned by `useFont` is the minimum surface `EtBlurredText` reads
// from (it never measures or queries metrics in the multi-line path —
// RN drives layout via `onTextLayout`).
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: ({ children, style, testID }: { children: React.ReactNode; style?: unknown; testID?: string }) => {
    const { View } = require('react-native');
    return (
      <View style={style} testID={testID ?? 'skia-canvas'}>
        {children}
      </View>
    );
  },
  Text: ({
    children,
    text,
    color,
    x,
    y,
    font,
  }: {
    children?: React.ReactNode;
    text?: string;
    color?: string;
    x?: number;
    y?: number;
    font?: unknown;
  }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="skia-text" accessibilityValue={{ text: `${text}|x=${x}|y=${y}|color=${color}|font=${font ? 'loaded' : 'null'}` }}>
        <Text>{text}</Text>
        {children}
      </View>
    );
  },
  BlurMask: ({ blur, style }: { blur: number; style: string }) => {
    const { View } = require('react-native');
    return <View testID="skia-blur-mask" accessibilityValue={{ text: `blur=${blur}|style=${style}` }} />;
  },
  useFont: (asset: number, size: number) => mockUseFont(asset, size),
}));

jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#111111',
      textSecondaryNeutral: '#444444',
      textTertiaryNeutral: '#888888',
    },
  }),
  EtCanvas: ({ children, style, testID }: { children: React.ReactNode; style?: unknown; testID?: string }) => {
    const { View } = require('react-native');
    return (
      <View style={style} testID={testID ?? 'skia-canvas'}>
        {children}
      </View>
    );
  },
  useSkiaReady: () => true,
}));

// Stand in for `react-i18next` so the component's `useTranslation` call
// resolves the localized fallback key without spinning up the real
// i18next backend. The pinned value matches `ui-kit.json`'s English
// copy so tests fail loudly if the namespace / key drift apart.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'blurredText.accessibility.lockedContent': 'Locked content',
      };
      return translations[key] ?? key;
    },
  }),
}));

// Replace `EtText` with a minimal stub that synthesizes a layout event
// matching RN's `onTextLayout` payload. Each `\n`-separated segment
// becomes one line; widths are 6px per character so per-line geometry
// is predictable without standing up a real text-shaping pass.
//
// This lets the tests focus on what `EtBlurredText` does with the
// reported lines (Skia replay, Canvas sizing, halo padding) rather
// than how RN happens to wrap the string.
jest.mock('../et-text', () => ({
  EtText: ({
    children,
    onTextLayout,
    style,
    numberOfLines,
    importantForAccessibility,
  }: {
    children: React.ReactNode;
    onTextLayout?: (event: { nativeEvent: { lines: unknown[] } }) => void;
    style?: unknown;
    numberOfLines?: number;
    importantForAccessibility?: string;
  }) => {
    const { View, Text } = require('react-native');
    const { useEffect } = require('react');
    useEffect(() => {
      if (typeof onTextLayout !== 'function' || typeof children !== 'string') return;

      // Mirror RN: `onTextLayout` reports only the lines that survive
      // `numberOfLines` truncation.
      const segments = typeof numberOfLines === 'number' ? children.split('\n').slice(0, numberOfLines) : children.split('\n');
      const lines = segments.map((text: string, i: number) => ({
        x: 0,
        y: i * 22,
        width: text.length * 6,
        height: 22,
        ascender: 16,
        descender: 6,
        capHeight: 12,
        xHeight: 8,
        text,
      }));
      onTextLayout({ nativeEvent: { lines } });
    }, [children, onTextLayout, numberOfLines]);
    return (
      <View style={style} importantForAccessibility={importantForAccessibility}>
        <Text>{children}</Text>
      </View>
    );
  },
}));

const buildFakeFont = () => ({
  measureText: (text: string) => ({ width: text.length * 6, height: 12 }),
  getMetrics: () => ({ ascent: -10, descent: 2, leading: 0 }),
});

describe('EtBlurredText', () => {
  beforeEach(() => {
    mockUseFont.mockReset();
    // Restore the deterministic fontScale=1 baseline between tests so
    // a leftover override from a scaling test can't poison unrelated
    // assertions further down.
    mockDimensionsGet.mockReturnValue({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    });
  });

  describe('font-loading fallback', () => {
    it('does not render the Skia canvas while the typeface is unresolved', () => {
      mockUseFont.mockReturnValue(null);

      const { queryByTestId } = render(<EtBlurredText accessibilityLabel="Locked">MODERATE BUY</EtBlurredText>);

      expect(queryByTestId('skia-canvas')).toBeNull();
    });

    it('still exposes the parent wrapper to assistive tech via accessibilityLabel', () => {
      mockUseFont.mockReturnValue(null);

      const { getByLabelText } = render(<EtBlurredText accessibilityLabel="Locked, eToro Club required">MODERATE BUY</EtBlurredText>);

      expect(getByLabelText('Locked, eToro Club required')).toBeTruthy();
    });
  });

  describe('accessibility contract', () => {
    beforeEach(() => {
      mockUseFont.mockReturnValue(buildFakeFont());
    });

    it('falls back to the localized uiKit:blurredText.accessibility.lockedContent label when accessibilityLabel is omitted', () => {
      // The children are API-returned lorem-ipsum filler — pinning the
      // localized fallback here guards against (a) silently exposing the
      // (decorative) children to screen readers, and (b) the
      // namespace/key drifting away from `ui-kit.json`.
      const { getByLabelText } = render(<EtBlurredText>Lorem ipsum dolor sit amet consectetur</EtBlurredText>);

      expect(getByLabelText('Locked content')).toBeTruthy();
    });

    it('never exposes the children string as the accessibilityLabel', () => {
      // Regression guard for the consumer bug where `accessibilityLabel`
      // was set to the (lorem-ipsum) children string. The component must
      // NOT default the label to children — screen-reader users would
      // hear gibberish.
      const filler = 'Lorem ipsum dolor sit amet consectetur';
      const { queryByLabelText } = render(<EtBlurredText>{filler}</EtBlurredText>);

      expect(queryByLabelText(filler)).toBeNull();
    });
  });

  describe('after Skia resolves the typeface', () => {
    beforeEach(() => {
      mockUseFont.mockReturnValue(buildFakeFont());
    });

    it('renders the Skia canvas with one Text + BlurMask per layout line', () => {
      const { getByTestId, getAllByTestId } = render(<EtBlurredText accessibilityLabel="Locked">MODERATE BUY</EtBlurredText>);

      expect(getByTestId('skia-canvas')).toBeTruthy();
      expect(getAllByTestId('skia-text')).toHaveLength(1);
      expect(getAllByTestId('skia-blur-mask')).toHaveLength(1);
    });

    it('applies the locked blur radius (4) in "normal" mode', () => {
      // `blurRadius` is intentionally not part of the public API —
      // pinning the constant here guards against a regression that
      // accidentally exposes it (or shifts the calibrated value
      // without a corresponding design-system review).
      const { getByTestId } = render(<EtBlurredText accessibilityLabel="Locked">MODERATE BUY</EtBlurredText>);

      const mask = getByTestId('skia-blur-mask');
      expect(mask.props.accessibilityValue.text).toBe('blur=4|style=normal');
    });

    it('forwards a custom color to the Skia text glyphs', () => {
      const { getByTestId } = render(
        <EtBlurredText accessibilityLabel="Locked" color="#abcdef">
          MODERATE BUY
        </EtBlurredText>,
      );

      expect(getByTestId('skia-text').props.accessibilityValue.text).toContain('color=#abcdef');
    });

    it('forwards testID to the outer wrapper', () => {
      const { getByTestId } = render(
        <EtBlurredText accessibilityLabel="Locked" testID="my-blur">
          MODERATE BUY
        </EtBlurredText>,
      );

      expect(getByTestId('my-blur')).toBeTruthy();
    });

    it('positions the Skia text at `line.x + blurPadding` so the halo has room to fade', () => {
      // Default blur radius is 4 → blurPadding = 8. The line's `x` is
      // 0 (single-line, left-aligned), so the Skia text should land
      // at `x = 8` to push the halo inside the inflated Canvas.
      const { getByTestId } = render(<EtBlurredText accessibilityLabel="Locked">MODERATE BUY</EtBlurredText>);

      expect(getByTestId('skia-text').props.accessibilityValue.text).toContain('x=8');
    });

    it('renders one Skia Text per wrapped line and offsets each by its baseline', () => {
      // Two lines, separated by `\n` in the mock → y = 0 and y = 22.
      // Baseline = y + ascender (16) + blurPadding (8).
      const { getAllByTestId } = render(<EtBlurredText accessibilityLabel="Locked">{'LINE ONE\nLINE TWO'}</EtBlurredText>);

      const skiaTexts = getAllByTestId('skia-text');
      expect(skiaTexts).toHaveLength(2);

      // Line 1: y = 0 + 16 + 8 = 24
      expect(skiaTexts[0]?.props.accessibilityValue.text).toContain('y=24');
      // Line 2: y = 22 + 16 + 8 = 46
      expect(skiaTexts[1]?.props.accessibilityValue.text).toContain('y=46');

      // The lines carry the right substrings, in order.
      expect(skiaTexts[0]?.props.accessibilityValue.text).toContain('LINE ONE');
      expect(skiaTexts[1]?.props.accessibilityValue.text).toContain('LINE TWO');
    });

    it('caps the Skia replay to `numberOfLines` so a constrained value stays single-line', () => {
      // Without the cap this two-line string replays two Skia texts;
      // `numberOfLines={1}` must collapse it to a single rendered line.
      const { getAllByTestId } = render(
        <EtBlurredText accessibilityLabel="Locked" numberOfLines={1}>
          {'MODERATE\nBUY'}
        </EtBlurredText>,
      );

      expect(getAllByTestId('skia-text')).toHaveLength(1);
    });

    it('passes a different Skia font asset when the variant uses a different weight', () => {
      render(
        <EtBlurredText accessibilityLabel="Locked" variant="label-secondary-semibold">
          MODERATE BUY
        </EtBlurredText>,
      );

      // The first arg to useFont is the Metro asset id for the
      // weight; we just assert the size matches the variant's spec
      // (14 for label-secondary-semibold).
      expect(mockUseFont).toHaveBeenCalledWith(expect.anything(), 14);
    });

    it('uses the caption-regular size (10) when the variant is set to caption-regular', () => {
      render(
        <EtBlurredText accessibilityLabel="Locked" variant="caption-regular">
          MODERATE BUY
        </EtBlurredText>,
      );

      expect(mockUseFont).toHaveBeenCalledWith(expect.anything(), 10);
    });

    it('scales the Skia font size and blur with the OS font scale, clamped to MAX_FONT_SIZE_MULTIPLIER', () => {
      // OS font scale of 1.5 is above the design-system clamp.
      // Skia size: 16 (body-base-regular) * MAX_FONT_SIZE_MULTIPLIER.
      // Blur radius: 4 * MAX_FONT_SIZE_MULTIPLIER.
      // Without this scaling, RN's `EtText` anchor lays out larger
      // glyphs than Skia paints, leaving the blur halo under-sized and
      // the placeholder potentially readable.
      mockDimensionsGet.mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1.5 });

      const { getByTestId } = render(<EtBlurredText accessibilityLabel="Locked">MODERATE BUY</EtBlurredText>);

      expect(mockUseFont).toHaveBeenLastCalledWith(expect.anything(), 16 * MAX_FONT_SIZE_MULTIPLIER);
      expect(getByTestId('skia-blur-mask').props.accessibilityValue.text).toBe(`blur=${4 * MAX_FONT_SIZE_MULTIPLIER}|style=normal`);
    });

    it('passes the OS font scale through unchanged when it is below the clamp', () => {
      // 0.85 < 1.25, so no clamping; Skia size 16 * 0.85 = 13.6.
      mockDimensionsGet.mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 0.85 });

      render(<EtBlurredText accessibilityLabel="Locked">MODERATE BUY</EtBlurredText>);

      expect(mockUseFont).toHaveBeenLastCalledWith(expect.anything(), 16 * 0.85);
    });
  });
});
