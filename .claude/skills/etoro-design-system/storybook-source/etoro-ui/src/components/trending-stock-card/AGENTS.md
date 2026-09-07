# EtTrendingStockCard — Agent Guide

## Overview

`EtTrendingStockCard` is a **smart** large-image asset card built on {@link EtAssetCard}.
It locks the Figma “Trending Stock” recipe (DS node `63763:418667`) so consumers
don’t re-assemble size / media / content stack / glass each time.

**Location:** `/libs/etoro-ui/src/components/trending-stock-card/`  
**Ticket:** PAH-823  
**Figma:** [Trending Stock card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63763-418667)

## When to use

| Component                  | Use for                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| **`EtTrendingStockCard`**  | Large editorial “Trending Stock” hero with photo fill + content stack |
| **`EtTrendingAssetsCard`** | Large “Trending” hero with related-asset logo row in the footer       |
| **`EtTopTraderCard`**      | Large person / PI hero — same content stack, person footer            |
| **`EtSmartPortfolioCard`** | Large SP hero — title + gain % / period / sparkline content           |
| **`EtAssetCard`**          | Generic asset card — pick size / fill / overlay yourself              |
| **`EtMediaCard`**          | Non-asset media chassis                                               |

## Fixed recipe

| Setting           | Value                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| `size`            | `'large'` (327 × 377)                                                      |
| `variant`         | `'standard'` (light text on media)                                         |
| `backgroundImage` | **required** — full-bleed photo                                            |
| Content           | `eyebrow` + `title` (+ optional `description`) — **no header badge**       |
| `footerOverlay`   | `'media'` — dark Carbon 900 `#1B1E21` scrim (Figma @ 0.12 → preset @ 0.15) |
| `contentBlur`     | `true`                                                                     |
| `logoInFooter`    | `true`                                                                     |
| `eyebrow`         | `'Trending Stock'` (overridable)                                           |

## Usage

```tsx
import { EtTrendingStockCard } from 'etoro-ui';

<EtTrendingStockCard
  asset={{
    symbol: 'AAPL',
    name: 'Apple',
    logoUrl: 'https://…/logo.svg',
    price: 186.79,
    changePercent: 0.0435,
  }}
  backgroundImage={{ uri: heroUrl }}
  title="Tesla experienced a significant sales slump in early 2026"
  onPress={openInstrument}
/>;
```

## Props

| Prop                 | Type                  | Default            | Description                |
| -------------------- | --------------------- | ------------------ | -------------------------- |
| `asset`              | `EtAssetCardAsset`    | —                  | Required asset snapshot    |
| `backgroundImage`    | `ImageSourcePropType` | —                  | Required full-bleed photo  |
| `eyebrow`            | `string`              | `'Trending Stock'` | Content eyebrow            |
| `title`              | `string`              | —                  | Required content headline  |
| `description`        | `string`              | —                  | Optional tertiary subtitle |
| `headerEnd`          | `ReactNode`           | —                  | Header trailing action     |
| `onPress`            | `() => void`          | —                  | Card press                 |
| `accessibilityLabel` | `string`              | auto from asset    | A11y label                 |
| `style` / `testID`   | —                     | —                  | Forwarded                  |

## Do's and Don'ts

### Do

- Pass a real editorial / hero image URI for `backgroundImage`
- Put the long editorial copy in `title`, not in a header badge
- Map BFF instruments to `EtAssetCardAsset` at the render edge
- Pass `changePercent` as a **ratio** (`0.05`, not `5`)

### Don't

- Don't pass `label` expecting a header badge — this card uses in-content `eyebrow`
- Don't omit `backgroundImage` or `title`
- Don't put rates streams / navigation / watchlist inside this kit wrapper
