import { BlurMask, Text as SkText, useFont } from '@shopify/react-native-skia';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, type TextLayoutEvent, type TextLayoutLine, useWindowDimensions, View } from 'react-native';

import { EtCanvas, useEtoroTheme, useSkiaReady } from '../../../core/hooks';
import { EtText } from '../et-text';
import { getSkiaFontAsset, getVariantConfig, type TextVariant } from '../utils';
import { MAX_FONT_SIZE_MULTIPLIER } from '../utils/variant-config';

/**
 * Gaussian blur radius (in pixels) at the unscaled (`fontScale === 1`)
 * baseline. Calibrated so a normal-cased placeholder string is
 * "unreadable but shape-preserving" — enough to gate the content
 * without looking like a rendering bug.
 *
 * At runtime this is multiplied by the effective font scale (see
 * `effectiveFontScale` below) so the blur stays proportional to the
 * glyphs; otherwise OS-level font scaling would grow the letters
 * without growing the blur, making the placeholder readable.
 *
 * Intentionally not exposed as a prop: callers shouldn't have to pick
 * a number, and a wrong number (too low → readable, too high →
 * visibly blurred-out region) is worse than no choice. Re-tune here if
 * the design system shifts.
 */
const BASE_BLUR_RADIUS = 4;

/** Canvas inflate per side, expressed as a multiple of the (scaled) blur radius. */
const BLUR_PADDING_FACTOR = 2;

/**
 * i18n namespace + key for the generic gating-state announcement used
 * when a caller doesn't pass an explicit `accessibilityLabel`. The
 * string lives in `libs/common/infra/translations/rn/.../ui-kit.json`
 * (`blurredText.accessibility.lockedContent`) — routed through the
 * translation layer so per-locale copy is picked up as soon as the RN
 * resource loaders ship one. Today every locale falls back to en-us
 * (see `libs/common/infra/translations/rn/src/lib/resources/resource-loaders.js`),
 * but going through `react-i18next` rather than a hardcoded literal
 * keeps the wiring in place for that future copy. It is *not* the
 * lorem-ipsum filler the API returns for unauthorized users — that's
 * what `children` carries.
 *
 * Consumers with feature-specific copy ("Locked, eToro Club required
 * to view AI sentiment") should still override via the prop.
 */
const UI_KIT_NS = 'uiKit';
const DEFAULT_ACCESSIBILITY_LABEL_KEY = 'blurredText.accessibility.lockedContent';

export interface EtBlurredTextProps {
  /**
   * The placeholder string to render through the Gaussian blur. This
   * is decorative filler — typically lorem-ipsum-style copy the API
   * returns when the user lacks access — and is hidden from assistive
   * tech (`importantForAccessibility="no-hide-descendants"`).
   *
   * Plain string only; Skia's `<Text>` doesn't accept nested children.
   *
   * Do NOT pipe sensitive content through here. The blur is a visual
   * effect, not a redaction primitive — the string IS painted to the
   * Skia surface and could be inspected via native surface snapshots.
   */
  children: string;
  /** Design-system text variant. Defaults to `body-base-regular`. */
  variant?: TextVariant;
  /** Override the glyph fill color. Defaults to the variant's color token. */
  color?: string;
  /**
   * Announcement for assistive tech in place of the (visually
   * blurred, a11y-hidden) glyphs. **MUST describe the gating state,
   * not the children string** — the children are lorem-ipsum-style
   * filler returned by the API for unauthorized users and would be
   * meaningless to a screen-reader user.
   *
   * Example (do): `t('analysisTab.etoroScore.accessibility.descriptionLocked')`
   * Example (don't): `children` (i.e. the raw placeholder text)
   *
   * If omitted, falls back to the
   * `uiKit:blurredText.accessibility.lockedContent` key ("Locked
   * content" in en-us; every other locale aliases en-us today via
   * `resource-loaders.js`). Feature-specific copy that names *why*
   * the value is gated should still be passed explicitly.
   */
  accessibilityLabel?: string;
  /**
   * Caps the number of rendered lines, mirroring RN `Text`'s
   * `numberOfLines`. Wrapping is delegated to the hidden `EtText`
   * anchor, so this constrains the Skia replay too: pass `1` to keep a
   * short value (e.g. a gated metric like "Moderate Buy") on a single
   * line instead of letting a narrow column wrap it. Omitted →
   * unbounded (natural wrapping), preserving prior behaviour.
   */
  numberOfLines?: number;
  /** Test id forwarded to the outer wrapper. */
  testID?: string;
}

/**
 * `<EtBlurredText>` — renders a string through Skia with a Gaussian
 * blur mask filter on the glyphs, giving a true cross-platform blur
 * (no `BlurView`, no Android fallback, no `experimentalBlurMethod`).
 *
 * Wrapping is delegated to RN's native text engine: an invisible
 * `<EtText>` lays the string out in its natural container width,
 * `onTextLayout` reports the per-line geometry, and we replay each
 * line through a Skia `<Text>` node at the same `(x, baseline)`.
 *
 * The `children` string is decorative filler (typically lorem-ipsum
 * from a "no access" API response); `accessibilityLabel` is the only
 * thing screen readers announce. Never pass `children` as the label.
 *
 * See `AGENTS.md` for the full design notes, anti-patterns, and
 * perf characteristics.
 *
 * @example
 * ```tsx
 * <EtBlurredText
 *   variant="caption-regular"
 *   accessibilityLabel={t('a11y.locked.clubRequired')}
 * >
 *   {placeholderFromApi}
 * </EtBlurredText>
 * ```
 */
function EtBlurredTextBase({ children, variant = 'body-base-regular', color, accessibilityLabel, numberOfLines, testID }: EtBlurredTextProps) {
  const { colors } = useEtoroTheme();
  const { t } = useTranslation(UI_KIT_NS);
  const { fontScale } = useWindowDimensions();
  const config = getVariantConfig(variant);

  // OS-level font scale clamped by the same upper bound `EtText` applies
  // via `maxFontSizeMultiplier`. The invisible `EtText` anchor below uses
  // that clamped scale to lay glyphs out, so Skia must paint at the same
  // scale or the painted text will mismatch the reserved layout slot —
  // smaller glyphs floating inside a larger box, with a now-undersized
  // blur halo that risks making the placeholder readable.
  const effectiveFontScale = Math.min(fontScale, MAX_FONT_SIZE_MULTIPLIER);
  const scaledFontSize = config.size * effectiveFontScale;
  const blurRadius = BASE_BLUR_RADIUS * effectiveFontScale;
  const blurPadding = blurRadius * BLUR_PADDING_FACTOR;

  // Gate font loading on CanvasKit readiness (web); native is ready immediately.
  // Avoids calling into Skia before the WASM runtime is available.
  const skiaReady = useSkiaReady();
  const font = useFont(skiaReady ? getSkiaFontAsset(config.weight) : null, scaledFontSize);
  const resolvedColor = color ?? colors[config.colorKey];
  const resolvedAccessibilityLabel = accessibilityLabel ?? t(DEFAULT_ACCESSIBILITY_LABEL_KEY);

  const [lines, setLines] = useState<readonly TextLayoutLine[] | null>(null);

  const handleTextLayout = useCallback((event: TextLayoutEvent) => {
    setLines(event.nativeEvent.lines);
  }, []);

  // Memo-ed on `lines` so a parent re-render with the same wrapping
  // doesn't redo the bounding-box pass.
  const contentBox = useMemo(() => {
    if (lines === null || lines.length === 0) return null;
    let width = 0;
    let height = 0;
    for (const line of lines) {
      const right = line.x + line.width;
      const bottom = line.y + line.height;
      if (right > width) width = right;
      if (bottom > height) height = bottom;
    }
    return { width, height };
  }, [lines]);

  const canvasStyle = useMemo(
    () =>
      contentBox === null
        ? null
        : [
            styles.canvasOverlay,
            {
              width: Math.ceil(contentBox.width) + blurPadding * 2,
              height: Math.ceil(contentBox.height) + blurPadding * 2,
              top: -blurPadding,
              left: -blurPadding,
            },
          ],
    [contentBox, blurPadding],
  );

  // Building one `<SkText>` + `<BlurMask>` per wrapped line is the
  // allocation-heaviest part of this render; memo defends against
  // parent re-renders that don't change geometry / theming / typeface
  // / scale.
  const skiaLines = useMemo(() => {
    if (font === null || lines === null) return null;
    return lines.map((line, index) => (
      <SkText
        key={index}
        x={line.x + blurPadding}
        // RN's `ascender` is the distance from the line's top to the
        // baseline. Skia's `<Text>` is anchored at the baseline, so
        // this lands each line in the same spot RN would have drawn it.
        y={line.y + line.ascender + blurPadding}
        text={line.text}
        font={font}
        color={resolvedColor}
      >
        {/* eslint-disable-next-line react/style-prop-object -- Skia mask filter `style` is a string enum ("normal" | "solid" | "outer" | "inner"). "normal" applies the Gaussian blur to the entire glyph. */}
        <BlurMask blur={blurRadius} style="normal" />
      </SkText>
    ));
  }, [font, lines, resolvedColor, blurPadding, blurRadius]);

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={resolvedAccessibilityLabel} testID={testID}>
      <View style={styles.relativeContainer}>
        {/*
         * Invisible RN text drives the natural wrapping and reserves
         * the layout slot during the brief `useFont` / `onTextLayout`
         * window. `no-hide-descendants` keeps the (filler) string out
         * of VoiceOver / TalkBack.
         */}
        <EtText
          variant={variant}
          numberOfLines={numberOfLines}
          importantForAccessibility="no-hide-descendants"
          style={styles.layoutAnchor}
          onTextLayout={handleTextLayout}
        >
          {children}
        </EtText>
        {skiaLines !== null && canvasStyle !== null && (
          <EtCanvas style={canvasStyle} pointerEvents="none">
            {skiaLines}
          </EtCanvas>
        )}
      </View>
    </View>
  );
}

EtBlurredTextBase.displayName = 'EtBlurredText';
export const EtBlurredText = React.memo(EtBlurredTextBase);

const styles = StyleSheet.create({
  relativeContainer: {
    position: 'relative',
  },
  layoutAnchor: {
    opacity: 0,
  },
  canvasOverlay: {
    position: 'absolute',
  },
});
