# EtAssetCard Component - Agent Guide

## Overview

`EtAssetCard` is an **asset-specialized** card built on `EtMediaCard`. Pass an `asset` object; the card maps logo / price / change into the correct slots for each size.

**Location:** `/libs/etoro-ui/src/components/asset-card/`  
**Ticket:** PAH-823  
**Figma:** [DS Card — small asset](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38716-443435)

This replaces the deprecated prop-driven card formerly at `data-display/asset-card` (still available as `EtLegacyAssetCard` for reference only).

## When to use

| Component                 | Use for                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------- |
| **`EtTrendingStockCard`** | Large image “Trending Stock” recipe — wraps this card                                 |
| **`EtTopTraderCard`**     | Large person / PI hero — composes `EtMediaCard` directly (not this card)              |
| **`EtAssetCard`**         | Instrument / asset cards with price + % change (small ticker, medium/large editorial) |
| **`EtMediaCard`**         | Generic media chassis when content is not a single asset                              |
| **`EtLegacyAssetCard`**   | Do not use — deprecated                                                               |

## Asset input

Matches the app instrument logo contract (`logoUrl` + brand `backgroundColor`).
Card fill can also be an explicit image or video on the card props.

```ts
interface EtAssetCardAsset {
  symbol: string;
  name?: string;
  logoUrl: string; // InstrumentImage.Uri / images.svg.uri / AssetIdentityData.logoUrl
  backgroundColor?: string; // images.svg.backgroundColor — default colour fill for variant="standard"
  price: number;
  currency?: string;
  change?: number; // absolute price change; derived as price * changePercent when omitted
  changePercent: number; // decimal ratio, e.g. 0.0435 → +4.35%
}
```

Fill precedence (same as `EtMediaCard`): `backgroundVideo` → `backgroundImage` → `asset.backgroundColor`.
Always enables `EtMediaCard`’s full-card Figma **Overlay** gloss (`overlay`).

## Usage

```tsx
import { EtAssetCard } from 'etoro-ui';

// Colour fill from asset logo brand colour
<EtAssetCard
  asset={{
    symbol: 'TSLA',
    logoUrl: 'https://etoro-cdn.etorostatic.com/market-avatars/1001/1001_CC2914_FFFFFF.svg',
    backgroundColor: '#CC2914',
    price: 186.79,
    changePercent: 0.0435,
  }}
/>

// Image / video fill overrides colour
<EtAssetCard size="medium" asset={asset} backgroundImage={{ uri: heroUrl }} />
<EtAssetCard size="large" asset={asset} backgroundVideo="https://…/clip.mp4" />
```

## Props

| Prop                   | Type                               | Default         | Description                                                           |
| ---------------------- | ---------------------------------- | --------------- | --------------------------------------------------------------------- |
| `asset`                | `EtAssetCardAsset`                 | —               | Required — `logoUrl` + `backgroundColor` + price fields               |
| `size`                 | `'small' \| 'medium' \| 'large'`   | `'small'`       | Forwards to `EtMediaCard`                                             |
| `variant`              | `'standard' \| 'bright' \| 'dark'` | `'standard'`    | Surface / foreground treatment                                        |
| `backgroundImage`      | `ImageSourcePropType`              | —               | Full-bleed image fill                                                 |
| `backgroundVideo`      | `string`                           | —               | Full-bleed video fill URI                                             |
| `label`                | `string`                           | —               | Header start — `EtBadge`                                              |
| `headerEnd`            | `ReactNode`                        | —               | Header end — e.g. `EtIconButton` / `EtButton`                         |
| `eyebrow`              | `string`                           | —               | Content eyebrow above title (in-content, not a badge)                 |
| `title`                | `string`                           | —               | Content headline                                                      |
| `description`          | `string`                           | —               | Content body / tertiary subtitle under title                          |
| `logoInFooter`         | `boolean`                          | auto            | Logo in glass footer (vs bg watermark); on by default for image/video |
| `footerOverlay`        | `'media' \| 'muted'`               | auto            | Glass footer preset (`media` = `#1B1E21` @ 0.15)                      |
| `footerOverlayColor`   | `string`                           | —               | Custom footer scrim colour                                            |
| `footerOverlayOpacity` | `0.1 \| 0.15`                      | —               | Custom footer scrim opacity                                           |
| `footerStyle`          | `StyleProp<ViewStyle>`             | —               | Style override on glass footer root                                   |
| `contentBlur`          | `boolean`                          | auto            | Content glass blur (on for image/video/bg logo)                       |
| `onPress`              | `() => void`                       | —               | Card press                                                            |
| `accessibilityLabel`   | `string`                           | auto from asset | A11y label                                                            |
| `style` / `testID`     | —                                  | —               | Forwarded                                                             |

## Architecture

```text
asset-card/
├── et-asset-card.tsx          # Composes EtMediaCard
├── et-asset-card.test.tsx
├── index.ts
├── AGENTS.md
├── api/types.ts               # EtAssetCardAsset, EtAssetCardProps
└── hooks/use-asset-card-model.ts  # standard → asset bg colour
```

Numbers use `EtNumber` (price + percentage + arrow). Default colour fill for `standard` comes from `asset.backgroundColor` or `extractImageBackgroundColor(logoUrl)`.

## Do's and Don'ts

### Do

- Map BFF/domain instruments to `EtAssetCardAsset` at the render edge (`images.svg.uri` → `logoUrl`, `images.svg.backgroundColor` → `backgroundColor`)
- Pass `changePercent` as a **ratio** (`0.05`, not `5`)
- Prefer passing explicit `backgroundColor` from `InstrumentImages.svg` / market-data `BackgroundColor`
- Use `backgroundImage` / `backgroundVideo` when the design calls for media fills
- For medium / large, the glass footer preset is keyed by `variant`: `standard`
  → `overlay="media"` (Carbon 900 static @ 0.15), `dark` / `bright` →
  `overlay="muted"` (Carbon 500 static @ 0.1). Media-filled `standard` surfaces
  keep `media`; bright solid (near-white) `standard` fills use `muted`.
- Override with `footerOverlay`, or fully custom via `footerOverlayColor` / `footerOverlayOpacity` / `footerStyle`
- Content strip blurs by default over image / video / background logo; force with `contentBlur`
- For editorial image cards, prefer in-content `eyebrow` + `title` (+ `description`) over a header `label` badge — these pass through to `EtMediaCard.Content`
- `logoInFooter` defaults **on** for image / video fills (watermark would clash); pass `logoInFooter={false}` to force the background watermark;
  footer start uses `EtAssetInfo` (avatar + symbol/name), end uses `EtNumber` + `EtPrice.Change`

### Don't

- Don't use `EtLegacyAssetCard`
- Don't compose `EtMediaCard` manually for standard asset price cards — use this
- Don't put business logic (rates streams, navigation) inside this kit component
- Don't expect `bright` / `dark` to tint the card with the asset brand colour when no media is passed
- Don't hardcode footer scrim colour when the presets fit — prefer `footerOverlay="media" | "muted"`;
  use `footerOverlayColor` / `footerOverlayOpacity` only for custom designs
