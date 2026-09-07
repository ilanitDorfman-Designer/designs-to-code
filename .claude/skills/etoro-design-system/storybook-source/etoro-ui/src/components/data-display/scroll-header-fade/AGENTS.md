# EtScrollHeaderFade

A scroll-linked gradient that fades list content as it scrolls beneath a **sticky header**. As the
list scrolls up, content visibly dissolves into the page background right under the header instead
of cutting off at a hard edge.

## Import

```ts
import { EtScrollHeaderFade } from 'etoro-ui';
```

## What it does

- Renders an absolutely-positioned `LinearGradient` (start color → transparent, top → bottom).
- Anchors to the bottom edge of its parent and is pushed **down** by its own `height` (via
  `translateY`), so it overlays the top of the list rather than the header itself.
- Drives opacity from a shared `scrollY` on the UI thread (`useAnimatedStyle`) — it never
  re-renders React on scroll. Opacity ramps `0 → 1` over `fadeInDistance` px of scroll.

## Props

| Prop             | Type                   | Default                   | Notes                                                                                           |
| ---------------- | ---------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| `scrollY`        | `SharedValue<number>?` | screen context `scrollY`  | Scroll source. Defaults to the enclosing `EtScreen`/`EtScreenV2` context.                       |
| `color`          | `string?`              | `colors.bgNeutralPrimary` | Gradient solid color (fades to transparent). Should match the page background.                  |
| `fadeInDistance` | `number?`              | `12`                      | Scroll distance (px) over which opacity ramps `0 → 1`.                                          |
| `height`         | `number?`              | `32` (`X8`)               | Gradient height. For a header (`edge='bottom'`) the overlay is pushed down by this same amount. |
| `edge`           | `'top' \| 'bottom'?`   | `'bottom'`                | Which sticky-chrome edge to decorate — header bottom (default) or footer top (see below).       |

### `edge`

- **`'bottom'` (default)** — fades the list **below a sticky header**. Render it as the header's last
  child; it overflows downward (`translateY: height`) onto the top rows (solid → transparent).
- **`'top'`** — fades the list **above a sticky footer**. Render it as the last child of the
  scrollable area so it pins to that area's bottom edge (no downward push); it overlays the bottom
  rows (transparent → solid) and dissolves them into the footer. Drive it with a `scrollY` that
  represents the **remaining distance to the bottom** so it hides once the list bottoms out, e.g.
  `footerShadow.value = max(contentSize.height - layoutMeasurement.height - contentOffset.y, 0)`.
  Never render it _inside_ the sticky footer: the gradient's solid end matches the footer's own
  background, so it disappears against it. It must sit above the footer's box, over the content.
  Inside a bottom sheet, don't hand-roll this — pass `EtBottomSheet.Footer`'s `scrollFade` prop,
  which owns the offset (it depends on the footer's private padding).

## Usage requirements

The host that renders this fade must:

1. Be a **sticky header** (a sticky section header inside a list, or a sibling header rendered
   above a list).
2. Allow overflow (default RN `overflow: 'visible'`) so the down-shifted gradient is not clipped.
3. Paint **above** the list. When the header is a _sibling_ of the list (not a sticky list header),
   give the header a higher `zIndex` than the list so the overflowing fade lands on top of the
   first rows.

## Examples

Inside a screen (zero-config — reads `scrollY` from screen context):

```tsx
<View style={styles.stickyHeader}>
  {/* header content */}
  <EtScrollHeaderFade />
</View>
```

With an explicit scroll source / background color:

```tsx
<EtScrollHeaderFade scrollY={scrollY} color={colors.bgNeutralPrimary} />
```

## Consumers

- Watchlist section headers (`libs/features/watchlist/.../watchlist-list/section-header`).
- Portfolio collapsible header (`libs/features/trading/portfolio/.../collapsible-portfolio-header`).
- Bottom sheet sticky footers, via `EtBottomSheet.Footer`'s `scrollFade` prop.
