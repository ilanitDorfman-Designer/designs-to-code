# EtCryptoCard Component - Agent Guide

## Overview

`EtCryptoCard` is a crypto asset card component that displays a crypto asset with a gradient background. It uses a compound component pattern for flexible composition.

**Location:** `/libs/etoro-ui/src/components/crypto-card/`

## Key Features

- **Compound Component Pattern**: Flexible composition with subcomponents
- **Automatic Color Extraction**: Background color extracted from CDN URL, with optional explicit override
- **Simple Architecture**: Subcomponents render directly (no registration pattern)
- **Flexible Sizing**: Default width with aspect ratio, customizable via style prop
- **TypeScript Support**: Full type safety

## Compound Component API

```tsx
<EtCryptoCard logoUrl="https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F7931A_FFFFFF.svg">
  <EtCryptoCard.LogoSection>
    <EtCryptoCard.Logo />
  </EtCryptoCard.LogoSection>
  <EtCryptoCard.BottomSection>
    <EtCryptoCard.Info>
      <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
      <EtCryptoCard.Name>Bitcoin</EtCryptoCard.Name>
    </EtCryptoCard.Info>
    <EtCryptoCard.Pricing>
      <EtCryptoCard.Price>$42,150.23</EtCryptoCard.Price>
      <EtCryptoCard.Units>0.5 BTC</EtCryptoCard.Units>
    </EtCryptoCard.Pricing>
  </EtCryptoCard.BottomSection>
</EtCryptoCard>
```

## Subcomponents

### Layout Subcomponents

| Component                    | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `EtCryptoCard.LogoSection`   | Centered container for logo (place at top)         |
| `EtCryptoCard.BottomSection` | Row container for Info and Pricing (space-between) |

### Content Subcomponents

| Component              | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `EtCryptoCard.Logo`    | Crypto logo image (size prop optional, default 100) |
| `EtCryptoCard.Info`    | Container for Symbol and Name (left-aligned)        |
| `EtCryptoCard.Symbol`  | Crypto symbol text (e.g., "BTC")                    |
| `EtCryptoCard.Name`    | Crypto name text (e.g., "Bitcoin")                  |
| `EtCryptoCard.Pricing` | Container for Price and Units (right-aligned)       |
| `EtCryptoCard.Price`   | Price display                                       |
| `EtCryptoCard.Units`   | Units owned display                                 |

## Sizing

The card has flexible sizing:

- **Default width**: 343px
- **Aspect ratio**: 343:200 (maintained automatically)
- **Customizable**: Override width via `style` prop

```tsx
// Default size (343px width)
<EtCryptoCard logoUrl={url}>...</EtCryptoCard>

// Full width
<EtCryptoCard logoUrl={url} style={{ width: '100%' }}>...</EtCryptoCard>

// Custom width
<EtCryptoCard logoUrl={url} style={{ width: 280 }}>...</EtCryptoCard>
```

## Color Resolution

Brand background colour is resolved in this order:

1. **`backgroundColor` prop** — when the caller supplies an explicit colour (e.g. BFF `InstrumentLogo.backgroundColor`).
2. **URL extraction** — hex embedded in eToro CDN filenames (`ID_COLOR_FFFFFF.svg`).
3. **Component default** — `#1A1A2E` when neither source yields a colour.

```tsx
// BFF explicit colour on a raster logo URL (no hex in the path)
<EtCryptoCard logoUrl={rasterLogoUrl} backgroundColor="#3D9970">
  ...
</EtCryptoCard>
```

A single color is automatically extracted from CDN URLs that embed it:

```text
URL Format:
https://etoro-cdn.etorostatic.com/market-avatars/ID/ID_COLOR_FFFFFF.svg
                                                      ^^^^^^
                                                    Primary Color

Example:
https://etoro-cdn.etorostatic.com/market-avatars/100000/100000_F7931A_FFFFFF.svg
Extracts: #F7931A (orange) for the background
```

## Props Reference

### EtCryptoCardProps (Root)

| Prop              | Type                   | Required | Description                                                              |
| ----------------- | ---------------------- | -------- | ------------------------------------------------------------------------ |
| `logoUrl`         | `string`               | Yes      | CDN URL for the logo image                                               |
| `backgroundColor` | `string`               | No       | Explicit brand colour; overrides URL extraction when set               |
| `children`        | `ReactNode`            | Yes      | Subcomponents                                                            |
| `style`           | `StyleProp<ViewStyle>` | No       | Style overrides (use for custom width)                                   |
| `testID`          | `string`               | No       | Test ID; surface layer uses `${testID}-surface`                          |

### CryptoLogoProps

| Prop                 | Type     | Default | Description                                               |
| -------------------- | -------- | ------- | --------------------------------------------------------- |
| `size`               | `number` | 100     | Logo size in pixels                                       |
| `accessibilityLabel` | `string` | -       | Accessibility label for the logo (used by screen readers) |
| `testID`             | `string` | -       | Test ID for the logo element                              |

## Architecture

### Direct Children Rendering

The component uses a flexible architecture where:

1. **Context only shares data** (logoUrl, color) - no registration functions
2. **Subcomponents render directly** - no `useEffect`, no `null` returns
3. **Children are rendered directly** - `{children}` instead of slot extraction
4. **Layout subcomponents** provide semantic structure without magic placement

This approach gives developers full control over composition while maintaining semantic components.

### File Structure

```text
crypto-card/
├── et-crypto-card.tsx       # Root component (renders children directly)
├── et-crypto-card.test.tsx  # Tests
├── index.ts                 # Exports
├── AGENTS.md                # This file
├── api/
│   ├── types.ts             # TypeScript types
│   ├── context.tsx          # Context provider
│   └── index.ts
├── subcomponents/
│   ├── crypto-logo-section.tsx  # Layout: centered logo container
│   ├── crypto-bottom-section.tsx # Layout: row for Info/Pricing
│   ├── crypto-logo.tsx      # Content: logo image
│   ├── crypto-info.tsx      # Content: info container
│   ├── crypto-symbol.tsx    # Content: symbol text
│   ├── crypto-name.tsx      # Content: name text
│   ├── crypto-pricing.tsx   # Content: pricing container
│   ├── crypto-price.tsx     # Content: price text
│   ├── crypto-units.tsx     # Content: units text
│   └── index.ts
├── hooks/
│   ├── use-color-extraction.ts
│   └── index.ts
└── utils/
    ├── color-utils.ts
    ├── overlay-util.ts
    └── index.ts
```

## Usage Examples

### Basic Card

```tsx
<EtCryptoCard logoUrl={cdnUrl}>
  <EtCryptoCard.LogoSection>
    <EtCryptoCard.Logo />
  </EtCryptoCard.LogoSection>
  <EtCryptoCard.BottomSection>
    <EtCryptoCard.Info>
      <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
      <EtCryptoCard.Name>Bitcoin</EtCryptoCard.Name>
    </EtCryptoCard.Info>
    <EtCryptoCard.Pricing>
      <EtCryptoCard.Price>$42,150</EtCryptoCard.Price>
      <EtCryptoCard.Units>0.5 BTC</EtCryptoCard.Units>
    </EtCryptoCard.Pricing>
  </EtCryptoCard.BottomSection>
</EtCryptoCard>
```

### Without Pricing

```tsx
<EtCryptoCard logoUrl={cdnUrl}>
  <EtCryptoCard.LogoSection>
    <EtCryptoCard.Logo />
  </EtCryptoCard.LogoSection>
  <EtCryptoCard.BottomSection>
    <EtCryptoCard.Info>
      <EtCryptoCard.Symbol>ETH</EtCryptoCard.Symbol>
      <EtCryptoCard.Name>Ethereum</EtCryptoCard.Name>
    </EtCryptoCard.Info>
  </EtCryptoCard.BottomSection>
</EtCryptoCard>
```

### Custom Logo Size

```tsx
<EtCryptoCard logoUrl={cdnUrl}>
  <EtCryptoCard.LogoSection>
    <EtCryptoCard.Logo size={80} />
  </EtCryptoCard.LogoSection>
  ...
</EtCryptoCard>
```

### Flexible Layout (Custom Structure)

Children are rendered directly, so you can compose the layout freely:

```tsx
<EtCryptoCard logoUrl={cdnUrl}>
  {/* Custom layout - info on top, logo below */}
  <EtCryptoCard.Info>
    <EtCryptoCard.Symbol>BTC</EtCryptoCard.Symbol>
  </EtCryptoCard.Info>
  <EtCryptoCard.LogoSection>
    <EtCryptoCard.Logo size={64} />
  </EtCryptoCard.LogoSection>
</EtCryptoCard>
```

## Do's and Don'ts

### Do:

- Use `LogoSection` for standard centered logo placement
- Use `BottomSection` for standard Info/Pricing row layout
- Use `Info` container for Symbol and Name together
- Use `Pricing` container for Price and Units together
- Provide a valid CDN URL with color segments
- Use `style` prop to customize width
- Compose layout freely when non-standard structure is needed

### Don't:

- Don't nest EtCryptoCard components
- Don't use subcomponents outside of EtCryptoCard
- Don't skip the LogoSection if you want centered logo with proper spacing
