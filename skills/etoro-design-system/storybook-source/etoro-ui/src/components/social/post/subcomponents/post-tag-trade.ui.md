# EtPost.Trade & EtPost.Tag

Two dumb, self-hugging pill sub-components of `EtPost`, used inside trade/social
post attachments to surface an asset reference (`EtPost.Trade`) and a
pre-composed status line (`EtPost.Tag`).

- `EtPost.Trade` — `libs/etoro-ui/src/components/social/post/subcomponents/attachments/trade-renderer.tsx`
- `EtPost.Tag` — `libs/etoro-ui/src/components/social/post/subcomponents/tag/tag-renderer.tsx`

---

## Dumb / translation-free contract

Both components are **dumb** and **translation-free**:

- They render only what the feature layer passes in via props. No i18n, no data
  fetching, no formatting decisions beyond the numeric display handled by
  `EtNumber` inside the trade chip.
- `EtPost.Tag` receives already-translated / already-styled `children` (e.g. a
  status line with a highlighted `$SYM` cashtag). It does not know what the text
  means.
- `EtPost.Trade` receives resolved asset data (symbol, display name, avatar
  sources/colors, price deltas). It decides direction/color and visibility of
  the price purely from the numeric props it is given.

---

## EtPost.Trade

A self-hugging, tappable asset chip (pill) showing, left to right:

1. Asset avatar (SVG preferred, raster fallback, or first-letter text fallback)
2. Symbol name
3. Current price as currency (e.g. `$186.79`) — **only when pricing resolves**
4. Directional daily change — caret + unsigned % (e.g. `▲ 1.95%`) — **only when pricing resolves**

### Behavior notes

- **Price gating**: the current price renders only when `currentPrice` is a
  finite number `> 0` (pricing hooks report `0` while pending). The change
  renders only when `priceChangePercent` is a finite number. The avatar and
  symbol always render.
- **Price formatting**: follows the shared price convention (`EtPrice.Value` /
  `InstrumentListCard`, PE-1040/PE-1041): `EtNumber` `format="currency"` with
  `$` symbol, `minDecimals={0}` (trailing zeros stripped, `$220` not `$220.00`)
  and adaptive `maxDecimals` — up to 5 for sub-$1 assets (cheap crypto), else 2.
- **Direction/color**: chosen from `priceChange` when it is finite, otherwise
  from `priceChangePercent`. `>= 0` → positive (green) color, `< 0` → negative
  (red) color — the same `verdictPositive600`/`verdictNegative600` tokens
  `EtNumber` `isColored` resolves to.
- **Composition**: the change is composed directly from `EtNumber`
  (`EtNumber.Arrow` + `EtNumber.Value`, `format="percentage"`,
  `showAbsoluteValue`) rather than `EtPrice.Change`, to match the design of a
  caret + unsigned % with no sign or parentheses.
- **Shared posts**: inside a shared attachment the container horizontal padding
  collapses to `0` (via `useIsSharedAttachment`).

### Props

| Prop                    | Type                   | Required | Default            | Description                                                                               |
| ----------------------- | ---------------------- | -------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `symbolName`            | `string`               | Yes      | —                  | Market symbol name (e.g. `"AAPL"`, `"BTC"`). Guarded against null/empty.                  |
| `displayName`           | `string`               | No       | `''`               | Market display name (e.g. `"Apple Inc."`).                                                |
| `avatarSource`          | `string`               | No       | `''`               | Raster avatar image URL.                                                                  |
| `avatarSvgSource`       | `string`               | No       | —                  | SVG avatar URL. Preferred over the raster source when present.                            |
| `avatarBackgroundColor` | `string`               | No       | —                  | Avatar background color (from SVG metadata, e.g. `"#76B900"`).                            |
| `avatarTextColor`       | `string`               | No       | theme fallback     | Avatar fallback text color (from SVG metadata, e.g. `"#F7F7F7"`).                         |
| `priceChange`           | `number`               | No       | —                  | Absolute daily change in currency units. Only selects direction/color.                    |
| `priceChangePercent`    | `number`               | No       | —                  | Daily change as a percentage. Rendered as the change; gates its display (must be finite). |
| `currentPrice`          | `number`               | No       | —                  | Current rate/price. Rendered as `$` currency (adaptive decimals) when finite and `> 0`.   |
| `onPress`               | `() => void`           | No       | —                  | Called when the trade chip is pressed.                                                    |
| `style`                 | `StyleProp<ViewStyle>` | No       | —                  | Override default container styles.                                                        |
| `testID`                | `string`               | No       | `'post-trade-tag'` | Test ID prefix for the chip and its sub-parts.                                            |
| `accessibilityLabel`    | `string`               | No       | `'Asset tag'`      | Accessibility label for the chip.                                                         |

### Usage

```tsx
<EtPost.Trade
  symbolName="AAPL"
  displayName="Apple Inc."
  avatarSvgSource={asset.logoSvg}
  priceChangePercent={0.86}
  onPress={() => openAsset('AAPL')}
/>
```

Minimal (no price → avatar + symbol only):

```tsx
<EtPost.Trade symbolName="AAPL" onPress={() => openAsset('AAPL')} />
```

### testIDs

| testID                  | Element                                                         |
| ----------------------- | --------------------------------------------------------------- |
| `post-trade-tag`        | Root chip (`testID` prefix, override via `testID` prop).        |
| `post-trade-tag-avatar` | Asset avatar wrapper (`${testID}-avatar`).                      |
| `post-trade-tag-price`  | Current price `EtNumber` (`${testID}-price`, when shown).       |
| `post-trade-tag-change` | Directional change `EtNumber` (`${testID}-change`, when shown). |

---

## EtPost.Tag

A translucent, self-hugging status pill that wraps caller-provided `children`
(e.g. a status line with a highlighted `$SYM` cashtag).

### Behavior notes

- **Non-interactive shell**: renders a plain `View` shell with no press handling
  of its own, so it never intercepts touches from the surrounding post.
  Interactivity is **opt-in via the children** — callers can make an individual
  inner element (e.g. the cashtag) pressable without the whole pill being a button.
- **Content-agnostic**: renders whatever pre-translated / pre-styled `children`
  it receives.

### Props

| Prop       | Type                   | Required | Default              | Description                                                      |
| ---------- | ---------------------- | -------- | -------------------- | ---------------------------------------------------------------- |
| `children` | `React.ReactNode`      | Yes      | —                    | Pre-translated / pre-styled tag content (e.g. status + cashtag). |
| `style`    | `StyleProp<ViewStyle>` | No       | —                    | Override default container styles.                               |
| `testID`   | `string`               | No       | `'post-trade-badge'` | Test ID for the tag root.                                        |

### Usage

```tsx
<EtPost.Tag>
  <EtText variant="body-tiny-medium">
    Bought <EtText color="primary">$AAPL</EtText>
  </EtText>
</EtPost.Tag>
```

### testIDs

| testID             | Element          |
| ------------------ | ---------------- |
| `post-trade-badge` | Tag root `View`. |

---

## EtChip styling note (Trade only)

`EtPost.Trade` wraps its content in `EtChip` for pressable behavior, but **the
visible surface lives on an inner pill `View`, not on the chip**. `EtChip`
forces a transparent animated background (for its press animation), so it is
used here as a borderless, padding-free pressable shell:

- The `chip` style zeroes padding and border and only carries the corner radius.
- The inner `pill` style carries the actual surface: `backgroundColor`
  (`colors.cardDefault`), horizontal padding, min height, gap, and the full-pill
  corner radius (`100`).

`EtPost.Tag` has no such constraint — it is a plain `View` and paints its
surface (`colors.cardDefault`) directly on the pill.
