# EtTopTraderCard — Agent Guide

## Overview

`EtTopTraderCard` is a **smart** large-image person card built on {@link EtMediaCard}.
It locks the Figma “Top Trader” recipe (DS node `63763:418671`).

**Location:** `/libs/etoro-ui/src/components/top-trader-card/`  
**Ticket:** PAH-823  
**Figma:** [Top Trader card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63763-418671)

## When to use

| Component                 | Use for                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| **`EtTopTraderCard`**     | Large editorial PI / top trader hero with photo fill + person footer |
| **`EtTrendingStockCard`** | Large image asset hero (asset footer)                                |
| **`EtMediaCard`**         | Chassis when building a custom recipe                                |

Does **not** wrap `EtAssetCard` — footer is {@link EtUserInfo} + rates, not an instrument.

## Fixed recipe

| Setting           | Value                                                  |
| ----------------- | ------------------------------------------------------ |
| `size`            | `'large'`                                              |
| `variant`         | `'standard'`                                           |
| `backgroundImage` | **required**                                           |
| Content           | `EtMediaCard.Content` eyebrow + title + description    |
| `contentBlur`     | `true`                                                 |
| `footerOverlay`   | `'media'` (Carbon 900 scrim)                           |
| `eyebrow`         | optional — pass localized copy from the feature edge   |
| Footer start      | `EtUserInfo` (avatar + name / handle) + optional badge |
| Footer end        | `EtNumber` (currency) + `EtPrice.Change` (rates)       |

## Usage

```tsx
import { EtTopTraderCard } from 'etoro-ui';

<EtTopTraderCard
  user={{
    avatar: { source: 'https://…/avatar.jpg', size: 'medium', alt: 'Robert Steven' },
    title: 'Robert Steven',
    subtitle: '@reobertsteven',
  }}
  badge={<InvestorCrownBadge badgeType="Pi" />}
  backgroundImage={{ uri: heroUrl }}
  title="Global Markets Investor"
  description="Long-term, diversified strategy across tech, ETFs, and digital assets…"
  price={204.13}
  change={0.09}
  changePercent={0.0005}
  onPress={openProfile}
/>;
```

## Props

| Prop                 | Type                  | Default | Description                          |
| -------------------- | --------------------- | ------- | ------------------------------------ |
| `user`               | `EtUserData`          | —       | Same shape as `EtUserInfo` `data`    |
| `badge`              | `ReactNode`           | —       | Optional avatar corner badge         |
| `backgroundImage`    | `ImageSourcePropType` | —       | Required hero photo                  |
| `eyebrow`            | `string`              | —       | Localized content eyebrow            |
| `title`              | `string`              | —       | Required headline                    |
| `description`        | `string`              | —       | Optional body copy                   |
| `price`              | `number`              | —       | Footer primary rate (currency)       |
| `currency`           | `string`              | —       | Currency code (omit → no `$` symbol) |
| `changePercent`      | `number`              | —       | Ratio (`0.0005` → +0.05%)            |
| `change`             | `number`              | derived | Absolute change for `EtPrice.Change` |
| `headerEnd`          | `ReactNode`           | —       | Optional header action               |
| `onPress` / `testID` | —                     | —       | Forwarded                            |

## Do's and Don'ts

### Do

- Pass `user` as `EtUserData` (`avatar` / `title` / `subtitle`) — reuses `EtUserInfo`
- Pass PI/Pro crown as `badge` from the feature edge (`InvestorCrownBadge`)
- Pass `changePercent` as a **ratio** (same as `EtAssetCard`)
- Reuse `EtMediaCard.Content` structured props — do not reinvent the stack

### Don't

- Don't wrap `EtAssetCard` for this design
- Don't put a static “Subtitle” label under the rate — use `EtPrice.Change`
- Don't put watchlist / navigation / rates streams inside the kit wrapper
