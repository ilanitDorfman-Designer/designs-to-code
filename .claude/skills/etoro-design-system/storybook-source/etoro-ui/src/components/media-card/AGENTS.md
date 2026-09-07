# EtMediaCard Component - Agent Guide

## Overview

`EtMediaCard` is a **new** Design System media / asset card with size variants. It is intentionally separate from `EtCard` — do not merge them.

**Location:** `/libs/etoro-ui/src/components/media-card/`  
**Figma:** [DS — React Card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38716-443435) (PAH-823)

## When to use

| Component                              | Use for                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------ |
| **`EtTrendingStockCard`**              | Large image asset hero — wraps `EtAssetCard`                             |
| **`EtTopTraderCard`**                  | Large person / PI hero — wraps `EtMediaCard` + person/gain footer        |
| **`EtAssetCard`**                      | Instrument / asset cards with price + % change — builds on `EtMediaCard` |
| **`EtCard`**                           | Flat sentiment surfaces (portfolio tiles). Do not extend for media cards |
| **`FooterCard`** (discover-page local) | Existing Discovery PI hero until migrated                                |
| **`EtLegacyAssetCard`**                | `@deprecated` — do not use                                               |

## Sizes (Figma)

| Size     | Dimensions | Typical content                                                       |
| -------- | ---------- | --------------------------------------------------------------------- |
| `small`  | 128 × 164  | Logo + Title + Subtitle; padding `34 / X6 / 24 / X6`, `space-between` |
| `medium` | 327 × 230  | Optional Header / Logo / Content / Footer (**default**)               |
| `large`  | 327 × 377  | Optional Header / Logo / Content / Footer                             |

`size` selects the layout + default dimensions (`small` renders the logo/title/subtitle
stack; `medium` / `large` render the header/content/footer layout). Smart components can
**override** the preset width / height with the `width` / `height` props (both accept a
`DimensionValue`, e.g. `260` or `'100%'`) — the `size` preset is only the fallback:

```tsx
<EtMediaCard size="medium" width="100%" height={260} … />
```

## Padding (`medium` / `large` only)

Header uses a uniform `X5` (20px) padding; content uses `X5 X5 X4 X5`
(20 top / right / left, 16 bottom); the footer uses `X5` (20) horizontal + `X4`
(16) vertical (Figma "Blur card footer", fixed regardless of card padding).
There is no small / medium density prop. `size="small"` keeps its own Figma
insets (`34 / X6 / 24 / X6`).

## Variants

| Variant    | Default solid fill (no media)                           | Text (`foregroundColor`) |
| ---------- | ------------------------------------------------------- | ------------------------ |
| `standard` | `backgroundColor` (asset brand) or `bgNeutralSecondary` | `carbonStatic050`        |
| `bright`   | `carbonStatic050` (white) + hairline border             | `carbonStatic900`        |
| `dark`     | `bgDarkSurface` (charcoal; closest to Figma `#2C2C2C`)  | `carbonStatic050`        |

`variant` is the primary source of truth for text colour via
`resolveMediaCardVariantColors` → MediaCard context `foregroundColor`.
Slots / `EtAssetCard` content must read that context — do not pick text
colour independently of `variant`.

On `standard` **solid** fills (no image/video):

| Concern                            | Helper                   | Rule                                                                   |
| ---------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| Chrome (`isBright`, footer, frost) | `classifyBackgroundTone` | Near-white only → bright. Yellow / gold / magenta stay `standard`.     |
| Label colour                       | `prefersDarkForeground`  | Dark text when white-on-fill is below WCAG AA **4.5:1** (normal text). |

Explicit `variant="bright"` / `variant="dark"` always win over colour classification.

### Card fill (colour / image / video)

Pass any of these on the root — precedence **video → image → colour**:

| Prop                    | Use for                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `backgroundColor`       | Any solid colour (e.g. asset logo brand colour on `standard`) |
| `backgroundImage`       | Full-bleed image (overrides default solid on bright/dark too) |
| `backgroundVideo`       | Full-bleed looping muted video URI                            |
| `backgroundVideoPaused` | Pause background video (off-screen / inactive)                |

Always on top of the fill (behind header / content / footer) is an optional Figma
full-card **Overlay** gloss — opt-in via `overlay` (`EtAssetCard` enables it):

| Prop / Layer | Spec                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `overlay`    | `@default false` — when `true`: `rgba(255,255,255,0.75) → rgba(44,44,44,0)` + `mix-blend: overlay` (omitted on Android API ≤ 28) |

```tsx
<EtMediaCard size="small" variant="standard" backgroundColor="#CC2914" />
<EtMediaCard size="small" variant="bright" />
<EtMediaCard size="small" variant="dark" />
<EtMediaCard size="medium" backgroundImage={{ uri: heroUrl }} />
<EtMediaCard size="large" backgroundVideo="https://cdn.example/clip.mp4" />
```

## Compound API

```tsx
import { EtMediaCard, EtText } from 'etoro-ui';

// Small asset card — colour fill from logo brand
<EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
  <EtMediaCard.Logo source={{ uri: logoUrl }} />
  <EtMediaCard.Title>186.79</EtMediaCard.Title>
  <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
</EtMediaCard>

// Medium / large — all slots optional
<EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914">
  <EtMediaCard.Logo source={{ uri: logoUrl }} placement="background" />
  <EtMediaCard.Header>
    <EtText variant="body-tiny-medium">Label</EtText>
  </EtMediaCard.Header>
  <EtMediaCard.Content>
    <EtText variant="body-tiny-medium">Body copy…</EtText>
  </EtMediaCard.Content>
  <EtMediaCard.Footer overlay="media">
    {/* e.g. ticker / price */}
  </EtMediaCard.Footer>
</EtMediaCard>
```

### Subcomponents

| Slot       | Purpose                                                                |
| ---------- | ---------------------------------------------------------------------- |
| `Logo`     | Asset logo. `placement="inline"` (default) or `"background"` watermark |
| `Title`    | Primary value (Num ML Medium) — small card                             |
| `Subtitle` | Secondary value (Num XS Medium) — small card                           |
| `Header`   | Full-width row — `start` / `end` (badge + action) or custom `children` |
| `Badge`    | Translucent header pill — use as `Header` `start`                      |
| `Content`  | Body region — stretch; padding `X5 X5 X4 X5`; subtle progressive frost |
| `Footer`   | Glass strip — light blur + `overlay` preset (`media` \| `muted`)       |

### Content

Stretch column above the footer (`justifyContent: flex-end`).

Padding is **fixed** (not tied to card `padding`):

| Side   | Token | Px  |
| ------ | ----- | --- |
| Top    | `X5`  | 20  |
| Right  | `X5`  | 20  |
| Bottom | `X4`  | 16  |
| Left   | `X5`  | 20  |

Structured text (Figma Trending Stock / Top Trader stack) — preferred when shared:

```tsx
<EtMediaCard.Content blur eyebrow="Trending Stock" title="NVIDIA Corp" description="AI chip demand…" />
```

| Prop          | Typography               | Notes                                    |
| ------------- | ------------------------ | ---------------------------------------- |
| `eyebrow`     | `body-secondary-medium`  | Gap `X1` to title                        |
| `title`       | `body-base-semibold`     |                                          |
| `description` | `label-tertiary-regular` | Gap `X2` below headline group            |
| `children`    | —                        | Custom override when no structured props |

Description-only (no eyebrow/title) keeps legacy `body-tiny-medium` (AssetCard).

Progressive frost is **always** present on the content overlay slot (Figma), feathered
transparent→opaque top→bottom (stronger where the text sits). On `medium` / `large` the
frost is **pulled 40 / 48 px above** the content top so it covers the lower half of the
background logo watermark (no hard seam — mask starts transparent at the elevated top):

| Layer                         | Spec                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Progressive BG blur           | Soft at frost top → strong at bottom (no hard seam); intensity `20` / tint per variant (`light` for bright, `default` otherwise) |
| Mask gradient (dark/standard) | White `rgba(255,255,255,0→1)` transparent→opaque top→bottom                                                                      |
| Mask gradient (bright)        | Dark `rgba(0,0,0,0→1)` transparent→opaque top→bottom                                                                             |
| Tint scrim (dark/standard)    | `#FFF` (Carbon 050) @ `0.08`, progressive clear→full top→bottom                                                                  |
| Tint scrim (bright)           | `#1B1E21` (Carbon 900) @ `0.08`, progressive clear→full top→bottom                                                               |

On **medium** and **large**, content height hugs its children:

- **min** `68` (height / width)
- **max** = card − header (if any) − footer (if any) — flex spacer above clamps it

Large does **not** force-fill the body; it stretches with the content inside up to that max.

```tsx
<EtMediaCard.Content>…</EtMediaCard.Content>             {/* on */}
<EtMediaCard.Content blur={false}>…</EtMediaCard.Content> {/* force off */}
```

`EtAssetCard` / `EtTopTraderCard` expose the same control as `contentBlur`.

### Header

Full-width `space-between` row. Prefer `start` / `end` for the badge + action recipe:

```tsx
<EtMediaCard.Header
  start={<EtMediaCard.Badge>Daily gainer</EtMediaCard.Badge>}
  end={<EtIconButton iconName="close" size={24} onPress={…} />}
/>
```

`EtMediaCard.Badge` is the shared translucent pill (used by Asset Card + Smart Portfolio).
When only `end` is set, Header inserts a leading spacer so the action stays trailing.

`EtAssetCard` / `EtSmartPortfolioCard` map `label` → `Badge` and `headerEnd` → `end`.

### Footer glass

Padding (Figma "Blur card footer"): `X5` (20px) horizontal, `X4` (16px) vertical —
fixed, regardless of the card padding.

| `overlay` | Colour                              | Opacity | Variant                                  |
| --------- | ----------------------------------- | ------- | ---------------------------------------- |
| `'media'` | Carbon Neutral 900 static `#1B1E21` | `0.15`  | **`standard`** (text: Carbon 050 static) |
| `'muted'` | Carbon Neutral 500 static `#999999` | `0.1`   | `dark` (text 050) / `bright` (text 900)  |

```tsx
<EtMediaCard.Footer overlay="media">{/* ticker / price */}</EtMediaCard.Footer>
<EtMediaCard.Footer overlay="muted">{/* … */}</EtMediaCard.Footer>
```

`EtAssetCard` picks the preset by `variant`: `media` for `standard`, `muted` for `dark` / `bright` (explicit `footerOverlay` still wins).

**Footer content colour**: the glass footer only allows its own variant foreground colour
(Carbon 050 static on `standard` / `dark`, Carbon 900 static on `bright`) — **no red/green**.
Price change inside the footer uses `EtPrice.Change color={foregroundColor}` (never the
green/red verdict tokens).

Slots use `__SLOT_TYPE` for detection (survives minification). Fragment wrappers
(`<>...</>`) are unwrapped before matching — otherwise those slots are unknown
children and dropped in production (dev-only warning).

## File Structure

```text
media-card/
├── et-media-card.tsx
├── et-media-card.test.tsx
├── index.ts
├── AGENTS.md
├── api/
│   ├── types.ts
│   ├── context.tsx
│   └── index.ts
├── hooks/
│   ├── use-media-card-children.ts
│   ├── use-media-card-config.ts
│   └── index.ts
├── utils/
│   ├── sizes.ts
│   └── index.ts
└── subcomponents/
    ├── media-card-background-video.tsx
    ├── media-card-header.tsx
    ├── media-card-badge.tsx
    ├── media-card-content.tsx
    ├── media-card-footer.tsx
    ├── media-card-logo.tsx
    ├── media-card-title.tsx
    ├── media-card-subtitle.tsx
    └── index.ts
```

## Do's and Don'ts

### Do

- Use `EtMediaCard` for new DS asset / media card work (PAH-823+)
- Pass logo brand colour via `backgroundColor`, or image / video via the media props
- Compose footer content freely inside `EtMediaCard.Footer`
- Use spacing tokens (`X*`) and theme colours

### Don't

- Don't modify `EtCard` to add these sizes / slots
- Don't use `displayName` for slot detection — use `__SLOT_TYPE`
- Don't nest `EtMediaCard` inside itself
- Don't use subcomponents outside `EtMediaCard` (context required)
