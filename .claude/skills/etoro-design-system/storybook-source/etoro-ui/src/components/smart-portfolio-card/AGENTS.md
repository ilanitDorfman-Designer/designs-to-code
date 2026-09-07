# EtSmartPortfolioCard — Agent Guide

## Overview

`EtSmartPortfolioCard` is a **smart** large media card built on {@link EtMediaCard}.
It locks the Figma “Smart Portfolio” recipe (DS node `63763:418679`).

**Location:** `/libs/etoro-ui/src/components/smart-portfolio-card/`  
**Figma:** [Smart Portfolio card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63763-418679)

## When to use

| Component                  | Use for                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| **`EtSmartPortfolioCard`** | Editorial SP hero — title + gain % / period / sparkline + description |
| **`EtTrendingAssetsCard`** | Trending hero with asset logo row footer                              |
| **`EtTrendingStockCard`**  | Large image + single asset price footer                               |
| **`EtTopTraderCard`**      | Large person / PI hero — `EtUserInfo` + rates footer                  |
| **`EtMediaCard`**          | Chassis when building a custom recipe                                 |

Does **not** wrap `EtAssetCard` — content is a custom gain stack, not price/rates footer.

## Fixed recipe

| Setting                     | Value                                                               |
| --------------------------- | ------------------------------------------------------------------- |
| `size`                      | `'large'`                                                           |
| `variant`                   | `'standard'`                                                        |
| `backgroundImage` / `Video` | at least one (video wins if both)                                   |
| Header                      | optional `label` → {@link EtMediaCard.Badge} + optional `headerEnd` |
| Content                     | custom stack (title + gain/period/sparkline + description) + `blur` |
| Footer                      | none (stats live in Content)                                        |

## Usage

```tsx
import { EtIconButton, EtSmartPortfolioCard } from 'etoro-ui';

<EtSmartPortfolioCard
  backgroundImage={{ uri: heroUrl }}
  // or: backgroundVideo="https://…/clip.mp4"
  label="Smart Portfolio"
  headerEnd={<EtIconButton iconName="star" size={24} onPress={toggleWatchlist} />}
  title="Chip-Tech"
  changePercent={0.1551}
  periodLabel="Last 24 hours"
  description="Tesla (TSLA) is experiencing a surge in investor interest…"
  chartData={[
    { timestamp: '2024-01-01T00:00:00Z', equity: 1 },
    { timestamp: '2024-01-02T00:00:00Z', equity: 1.15 },
  ]}
  onPress={openPortfolio}
/>;
```

## Props

| Prop                 | Type                   | Default | Description                                |
| -------------------- | ---------------------- | ------- | ------------------------------------------ |
| `title`              | `string`               | —       | Portfolio / chip name                      |
| `changePercent`      | `number`               | —       | Gain ratio (`0.1551` → `+15.51%`)          |
| `periodLabel`        | `string`               | —       | Caption under the gain (caller owns i18n)  |
| `description`        | `string`               | —       | Optional body copy                         |
| `chartData`          | `ChartDataApiEquity[]` | —       | Sparkline series; omit/empty to hide chart |
| `label`              | `string`               | —       | Header badge via `EtMediaCard.Badge`       |
| `headerEnd`          | `ReactNode`            | —       | Trailing header action                     |
| `backgroundImage`    | `ImageSourcePropType`  | —       | Full-bleed photo                           |
| `backgroundVideo`    | `string`               | —       | Full-bleed video URI                       |
| `onPress` / `testID` | —                      | —       | Forwarded                                  |

## Header reuse

Header chrome is shared with Asset Card via MediaCard:

```tsx
<EtMediaCard.Header start={<EtMediaCard.Badge>{label}</EtMediaCard.Badge>} end={headerEnd} />
```

- `EtMediaCard.Badge` — translucent pill (lifted from former AssetCard-private badge)
- `Header` `start` / `end` — pins badge + action with an automatic leading spacer when end-only

## Do's and Don'ts

### Do

- Pass `changePercent` as a **ratio** (same as `EtAssetCard`)
- Pass already-localized `periodLabel` (kit has no i18n)
- Prefer `verdict*400Static` for gains on dark media (card does this for you)

### Don't

- Don't put watchlist / BFF / Discovery types inside the kit wrapper
- Don't use the shared Content `eyebrow`/`title`/`description` props — this recipe's content is custom
- Don't force a Footer for stats — Figma keeps everything in the Content strip
