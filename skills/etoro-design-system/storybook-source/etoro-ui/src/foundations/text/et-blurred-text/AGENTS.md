---
description: Agent guide for EtBlurredText — Skia-rendered text primitive with a Gaussian blur mask filter applied to the glyphs, used to gate unauthorized values behind an unreadable placeholder
alwaysApply: false
---

# EtBlurredText

## Purpose & Scope

`EtBlurredText` renders a string through Skia with a Gaussian blur mask filter applied directly to the glyphs. The visual is a true cross-platform Gaussian blur — not a `BlurView` overlay, not a `textShadow` smudge, not an `experimentalBlurMethod` workaround.

It exists for one concrete UX pattern: **gating an unauthorized value behind an unreadable placeholder**. The API returns lorem-ipsum-style filler for users without access; the component blurs that filler into "unreadable but shape-preserving" copy so the user understands there's content there, paired with an `EtClubBadge showLock` (or equivalent) to indicate why.

**The `children` string is decorative filler, not data.** Treat it as visual texture, not as content. Specifically:

- It IS rendered to the Skia surface (so don't pass anything sensitive).
- It is NOT exposed to assistive tech — the layout-anchor `<EtText>` is marked `importantForAccessibility="no-hide-descendants"`.
- Screen readers announce **only** `accessibilityLabel`. If you pass the filler string as the label, screen-reader users hear lorem ipsum.

**Does NOT handle:**

- Privacy-mode redactions (hide balance / amount until tap). The string IS painted to the Skia surface and could in principle be inspected via native surface snapshots — treat the blur as a visual effect, not a redaction primitive. Use a real masking strategy for sensitive content.
- Animated blurs (focus / blur transitions). The component renders one static blur once.
- Non-eToro typefaces. Skia loads the eToro TTFs from `foundations/text/assets/fonts/`; arbitrary fonts aren't wired in.
- Inline / styled text spans. `<EtText>` mixes nested children; `<EtBlurredText>` takes a single flat string.

## Entry Point & Contract

```tsx
<EtBlurredText
  variant?: TextVariant        // default: 'body-base-regular'
  color?: string               // default: variant's color token
  accessibilityLabel?: string  // default: 'Locked content' via i18n (pass feature-specific copy when you know why it's gated)
  testID?: string
>
  {placeholderFromApi}
</EtBlurredText>
```

| Prop                 | Type          | Default                                              | Notes                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | ------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`           | `string`      | —                                                    | Decorative filler (typically lorem-ipsum from a "no access" API response). Plain string only; Skia's `<Text>` doesn't accept nested JSX. Long strings wrap; `\n` forces a line break.                                                                                                                                                                     |
| `variant`            | `TextVariant` | `'body-base-regular'`                                | Drives Skia font weight (via `getSkiaFontAsset`), size, and line height. Same union as `EtText`.                                                                                                                                                                                                                                                          |
| `color`              | `string`      | —                                                    | Override the glyph fill. Defaults to the variant's `colorKey` resolved against the active theme.                                                                                                                                                                                                                                                          |
| `accessibilityLabel` | `string`      | `t('uiKit:blurredText.accessibility.lockedContent')` | Describes the **gating state**, not the placeholder children. When omitted, the component reads the fallback from `ui-kit.json` (`"Locked content"` in en-us; every other locale aliases en-us today — see `resource-loaders.js`). Feature-specific copy that names _why_ the value is gated ("…eToro Club required…") should still be passed explicitly. |
| `testID`             | `string`      | —                                                    | Forwarded to the outer `<View>` wrapper.                                                                                                                                                                                                                                                                                                                  |

The blur radius is **not** a prop — it's locked to a calibrated internal constant (`BLUR_RADIUS = 4`). Callers shouldn't have to tune it, and a wrong value (too low → readable, too high → visibly blurred-out region) is worse than no choice. Re-tune in source if the design system shifts.

## How It Works

Skia's `<Text>` is single-line by design — it doesn't wrap. To get OS-grade line-breaking without re-implementing Unicode word-wrap, the component delegates wrapping to RN's native text engine:

1. An invisible `<EtText>` (opacity 0, same variant) is rendered as a layout anchor inside a `position: relative` container.
2. `onTextLayout` reports the per-line `TextLayoutLine[]` — each entry carries `x`, `y`, `width`, `height`, `ascender`, `descender`, and the substring on that line.
3. Once both Skia's typeface has resolved (`useFont`) **and** RN has emitted layout lines, an absolutely-positioned `<Canvas>` overlay paints one `<SkText>` per line at `(line.x, line.y + line.ascender)`, each wrapped in a `<BlurMask blur={BLUR_RADIUS} style="normal">`.
4. The Canvas is inflated by `BLUR_PADDING` (= `BLUR_RADIUS * 2`) on every side (with matching negative `top` / `left`) so the halo on the outermost glyphs has room to fade instead of clipping.

The opacity-0 anchor stays in the tree permanently — it reserves the slot during the brief `useFont`-loading / `onTextLayout`-pending window so the surrounding row doesn't jitter into place.

## Usage Patterns

### Gating an analyst-rating value behind Club

```tsx
import { EtBlurredText, EtClubBadge } from 'etoro-ui';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('market');

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
  <EtBlurredText variant="caption-regular" accessibilityLabel={t('analystForecasts.accessibility.ratingLocked')}>
    {ratingPlaceholder /* lorem-ipsum filler returned by the API */}
  </EtBlurredText>
  <EtClubBadge showLock />
</View>;
```

### Multi-line teaser copy

```tsx
<EtBlurredText variant="body-secondary-regular" accessibilityLabel={t('analysisTab.etoroScore.accessibility.descriptionLocked')}>
  {model.description /* placeholder lorem ipsum from the BFF */}
</EtBlurredText>
```

RN wraps naturally inside the parent's width; the Skia overlay replays line-by-line. The screen reader announces only the gating-state label.

## Anti-patterns

### Don't use it for sensitive data

```tsx
// BAD — the SSN string IS painted to the Skia surface
<EtBlurredText accessibilityLabel="SSN, tap to reveal">{user.ssn}</EtBlurredText>
```

The blur is a visual effect, not a redaction primitive. Sensitive content needs an actual mask (replace with `***-**-****` and reveal on tap).

### Don't nest elements as children

```tsx
// BAD — children must be a plain string
<EtBlurredText accessibilityLabel="Locked">
  <EtText>MODERATE BUY</EtText>
</EtBlurredText>
```

Skia's `<Text>` is single-string. Pass the string directly.

### Don't announce the filler children as the `accessibilityLabel`

```tsx
// BAD — `description` is API-returned lorem ipsum; screen-reader users hear gibberish
<EtBlurredText accessibilityLabel={description}>{description}</EtBlurredText>
```

```tsx
// GOOD — label describes the GATING STATE; children stays decorative filler
<EtBlurredText accessibilityLabel={t('analysisTab.etoroScore.accessibility.descriptionLocked')}>{description}</EtBlurredText>
```

The component intentionally hides children from VoiceOver / TalkBack (`importantForAccessibility="no-hide-descendants"`) precisely because the children are meaningless filler. The label is the **only** assistive-tech surface — make it describe why the content is gated, not what the filler happens to say.

### Don't rely on the default label when feature-specific copy exists

```tsx
// OK as a last-resort fallback (announces "Locked content" via i18n)
<EtBlurredText>{placeholder}</EtBlurredText>

// BETTER — names WHY the value is gated
<EtBlurredText accessibilityLabel={t('analysisTab.etoroScore.accessibility.descriptionLocked')}>
  {placeholder}
</EtBlurredText>
```

The default reads `uiKit:blurredText.accessibility.lockedContent` so a missed prop isn't a screen-reader gap. The lookup goes through `react-i18next`, so per-locale copy is picked up as soon as the RN resource loaders ship one — today every locale aliases en-us (see `libs/common/infra/translations/rn/src/lib/resources/resource-loaders.js`). But it's intentionally generic — the lib has no idea _why_ a value is gated. When the consumer knows (Club / paywall / pre-auth / etc.), pass that copy explicitly.

## Performance

For one or two short strings, the cost is negligible — there's no per-frame work after first paint.

Things that scale:

- **Many instances on one screen** — each `<Canvas>` has its own JSI bridge overhead. Prefer one parent Canvas with N `<SkText>` if you're rendering a grid of blurred cells (would require a different composition than this primitive).
- **First-time shader compilation** — the very first `BlurMask` draw in a session can stutter a frame while Skia compiles the blur shader. Subsequent draws are cached.
- **Parent re-renders with unstable props** — the component is `React.memo`'d, and the per-line Skia children + canvas style are memoized on `(font, lines, resolvedColor)`. A parent that recreates `accessibilityLabel` / inline styles every render defeats the memo.

## Accessibility

- `accessibilityRole="text"`, `accessible={true}` on the wrapper — the badge is announced as a single node, not two (string + label).
- The opacity-0 layout-anchor `<EtText>` is marked `importantForAccessibility="no-hide-descendants"` so VoiceOver / TalkBack don't read the raw placeholder string (which is API-returned lorem-ipsum filler and would only confuse the user).
- The Skia Canvas is `pointerEvents="none"` and not a11y-traversable — it's purely decorative paint.
- The `accessibilityLabel` is the **only** assistive-tech surface. Make it describe the **gating state** (`t('…descriptionLocked')` → `"Locked, eToro Club required to view the analysis"`), not the placeholder text. Passing the children string would announce lorem ipsum to screen-reader users.
- A `uiKit:blurredText.accessibility.lockedContent` default fires when `accessibilityLabel` is omitted, so a missed prop isn't silently a screen-reader gap. The string is routed through `react-i18next` (en-us today; per-locale copy lands automatically as soon as the RN resource loaders ship translated `ui-kit.json` files). Consumers that know _why_ the value is gated should still pass a feature-specific translated label.

## Design Tokens

| Element               | Token                                                                                              | Notes                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Glyph fill (default)  | `colors[VARIANT_CONFIG[variant].colorKey]` — usually `textPrimaryNeutral` or `textTertiaryNeutral` | Resolved against the active theme.               |
| Glyph fill (override) | `color` prop                                                                                       | Any CSS-compatible color string.                 |
| Typeface              | eToro TTFs in `foundations/text/assets/fonts/`                                                     | Loaded into Skia via `getSkiaFontAsset(weight)`. |
| Blur kernel           | `BASE_BLUR_RADIUS = 4` (locked, at `fontScale === 1`); Canvas inflated by `2 × radius` per side    | Scales with the OS font scale (see below).       |

## Dependencies & Edges

### Internal

- `EtText` — opacity-0 layout anchor (drives wrapping via `onTextLayout`).
- `getVariantConfig`, `TextVariant` (`libs/etoro-ui/src/foundations/text/utils/`) — same source of truth `EtText` uses.
- `getSkiaFontAsset` (`libs/etoro-ui/src/foundations/text/utils/skia-fonts.ts`) — `FontWeightKey → Metro asset id` lookup; reads from the lib-local TTFs in `libs/etoro-ui/src/foundations/text/assets/fonts/`.
- `useEtoroTheme` (`core/hooks`) — theme tokens for the default fill color.

### External

- `@shopify/react-native-skia` — `<Canvas>`, `<Text>`, `<BlurMask>`, `useFont`. Lib-level peer; already in use by `LineChart` and `gradient-border`.

### Font asset sourcing

The Skia-side TTFs ship with `etoro-ui` (`foundations/text/assets/fonts/eToro0.7-{Light,Regular,Medium,Semibold,Bold,Extrabold}.ttf`) so the lib stays a leaf in the project graph. The app continues to register its own copy of the same TTFs with `expo-font` for the RN `<Text>` render path. Consolidating onto a single canonical copy is a follow-up — see the TODO in `skia-fonts.ts`.

### OS-level font scaling

RN's `<Text>` participates in OS-level font scaling (iOS Dynamic Type, Android display-size). The invisible `EtText` anchor inherits that — at fontScale > 1 it lays out _bigger_ lines via `onTextLayout`. If Skia kept drawing glyphs at the unscaled `config.size`, you'd get small glyphs floating inside a too-large layout slot, with a now-undersized blur halo that could leak the placeholder text.

The component compensates by reading `useWindowDimensions().fontScale`, clamping it with `MAX_FONT_SIZE_MULTIPLIER` (the same upper bound `EtText` applies via `maxFontSizeMultiplier`), and multiplying both the Skia font size and `BASE_BLUR_RADIUS` by the result:

```ts
const effectiveFontScale = Math.min(fontScale, MAX_FONT_SIZE_MULTIPLIER);
const scaledFontSize = config.size * effectiveFontScale;
const blurRadius = BASE_BLUR_RADIUS * effectiveFontScale;
```

This keeps the painted glyphs aligned with the layout slot and the blur visually proportional, so the placeholder stays unreadable at every scale the rest of the app supports. Changing OS font scale at runtime triggers a re-render (and a one-frame typeface reload while Skia rehydrates the larger font), which is acceptable for a setting users rarely toggle while the app is open.

## Related Context

- `EtText (libs/etoro-ui/src/foundations/text/et-text.tsx)` — the un-blurred sibling. Same variant union, same typeface registry, but rendered through RN's native text engine. Reach for `EtText` unless you specifically need the blurred look.
- `EtClubBadge (libs/etoro-ui/src/components/status/club-badge/)` — the primary-bordered Club pill commonly paired with `EtBlurredText` to signal Club gating.
- `skia-fonts.ts (libs/etoro-ui/src/foundations/text/utils/skia-fonts.ts)` — the Skia typeface registry. Source of truth for `weight → TTF` resolution.
