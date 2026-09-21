# EtTrendingAssetsCard — Agent Guide

## Overview

`EtTrendingAssetsCard` is a **smart** large media card built on {@link EtMediaCard}.
It locks the Figma “Trending” recipe with a related-assets footer (DS node `63763:418675`).

**Location:** `/libs/etoro-ui/src/components/trending-assets-card/`  
**Ticket:** PAH-823  
**Figma:** [Trending + assets footer](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63763-418675)

## When to use

| Component                  | Use for                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| **`EtTrendingAssetsCard`** | Editorial “Trending” hero with image/video + logo row in the footer |
| **`EtTrendingStockCard`**  | Large image + **single** asset price footer                         |
| **`EtTopTraderCard`**      | Large person / PI hero — `EtUserInfo` + rates footer                |
| **`EtMediaCard`**          | Chassis when building a custom recipe                               |

Does **not** wrap `EtAssetCard` — footer is a row of instrument logos, not price/rates.

## Fixed recipe

| Setting                     | Value                                               |
| --------------------------- | --------------------------------------------------- |
| `size`                      | `'large'`                                           |
| `variant`                   | `'standard'`                                        |
| `backgroundImage` / `Video` | at least one (video wins if both)                   |
| Content                     | `EtMediaCard.Content` eyebrow + title + description |
| `contentBlur`               | `true`                                              |
| `footerOverlay`             | `'media'` (Carbon 900 scrim)                        |
| `eyebrow`                   | optional — pass localized copy                      |
| Footer                      | up to `maxVisible` logos + pressable `+N` overflow  |

### Overflow behavior

The `+N` pill is a **button**:

- With `onOverflowPress` → delegates to the consumer (e.g. navigate to a full list).
- Without it → expands the footer in place into a **horizontal carousel** of every logo.

## Usage

```tsx
import { EtTrendingAssetsCard } from 'etoro-ui';

<EtTrendingAssetsCard
  assets={[
    { symbol: 'ADBE', logoUrl: 'https://…/adbe.svg', backgroundColor: '#E4231D' },
    { symbol: 'AAPL', logoUrl: 'https://…/aapl.svg', backgroundColor: '#434351' },
    { symbol: 'TSLA', logoUrl: 'https://…/tsla.svg', backgroundColor: '#ED2520' },
    // …
  ]}
  backgroundImage={{ uri: heroUrl }}
  // or: backgroundVideo="https://…/clip.mp4"
  title="Trump – Musk feud reignites as megabill hits snags in Senate"
  description="TSLA is seeing increased investor activity amid political uncertainty"
  onPress={openStory}
/>;
```

## Props

| Prop                 | Type                          | Default | Description                                            |
| -------------------- | ----------------------------- | ------- | ------------------------------------------------------ |
| `assets`             | `EtTrendingAssetsCardAsset[]` | —       | Logos for the footer row                               |
| `maxVisible`         | `number`                      | `5`     | Logos before `+N` pill                                 |
| `backgroundImage`    | `ImageSourcePropType`         | —       | Full-bleed photo                                       |
| `backgroundVideo`    | `string`                      | —       | Full-bleed video URI                                   |
| `eyebrow`            | `string`                      | —       | Localized content eyebrow                              |
| `title`              | `string`                      | —       | Required headline                                      |
| `description`        | `string`                      | —       | Optional body copy                                     |
| `headerEnd`          | `ReactNode`                   | —       | Optional header action                                 |
| `onOverflowPress`    | `() => void`                  | —       | `+N` handler; omit to expand into an in-place carousel |
| `onPress` / `testID` | —                             | —       | Forwarded                                              |

## Do's and Don'ts

### Do

- Pass instrument CDN logos + brand `backgroundColor` when available
- Prefer `backgroundVideo` when the design calls for motion fill
- Keep overflow math at the kit edge (`assets.length - maxVisible`)

### Don't

- Don't wrap `EtAssetCard` / `EtTrendingStockCard` for this footer
- Don't put rates / watchlist / navigation inside the kit wrapper
- Don't use overlapping `EtAvatar.Group` — Figma shows spaced logos, not a stack
