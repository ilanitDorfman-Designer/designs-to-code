# EtPieChart

A themeable **donut** chart for the eToro UI kit. Renders a hollow ring of gapless arcs that start at 12 o'clock and fill clockwise, with an optional decorative dashed outer ring and a muted track for the empty state. Ships with a compound `SegmentLegend` for building allocation cards.

> Not to be confused with `EtBreakdownChart` (the horizontal stacked bar). In Figma this donut is the component named **"Breakdown chart"**.

## Import

```tsx
import { EtPieChart } from 'etoro-ui';
```

## Usage

```tsx
// Donut only — colors default to the DS accent palette (A→G)
<EtPieChart data={[
  { key: 'Stocks', value: 42 },
  { key: 'Crypto', value: 23 },
  { key: 'ETFs', value: 15 },
]} />

// With a sibling legend (place it below or beside the donut)
<EtPieChart data={segments} size="large" showOuterRing />
<EtPieChart.SegmentLegend>
  {segments.map((s) => (
    <EtPieChart.SegmentLegendItem key={s.key} dotColor={s.color} label={s.key} value={`${s.value}%`} showChevron />
  ))}
</EtPieChart.SegmentLegend>
```

## Architecture

```text
pie-chart/
├── et-pie-chart.tsx              # Composition + Object.assign compound export
├── et-pie-chart.test.tsx         # RNTL tests
├── index.ts                      # Public exports
├── AGENTS.md                     # This file
├── api/
│   ├── index.ts
│   └── types.ts                  # EtPieChartProps, PieChartData, SegmentLegend* types
├── hooks/
│   ├── index.ts
│   ├── use-pie-chart-config.ts   # size → px, radius, strokeWidth, track/outer-ring colors
│   └── use-pie-chart-segments.ts # normalize + Other-fold + color resolve + dash geometry
├── utils/
│   ├── normalize-pie-data.util.ts    # clean, fold "Other", compute fractions
│   ├── resolve-segment-color.util.ts # color | [from,to] | undefined → solid string
│   ├── pie-segment-geometry.util.ts  # dash lengths / offsets (12 o'clock, clockwise)
│   └── *.util.spec.ts                # unit tests (pure)
└── subcomponents/
    ├── index.ts
    ├── segment.tsx               # single animated SVG arc (Reanimated useAnimatedProps)
    ├── segment-legend.tsx        # grid/list container
    └── segment-legend-item.tsx   # dot + EtText label/value + optional EtIcon chevron
```

## Key patterns

### Rendering (SVG)

- A full-circle **track** `Circle` (`colors.dividerTertiary`) renders the empty state. Segments always normalize to a full circle, so whenever there is data the track is set to `transparent` — otherwise it would tint translucent segment colors instead of letting them composite against the surface.
- Each segment is a `Circle` with `strokeDasharray = [arcLen, circ − arcLen]` and a `strokeDashoffset` that positions its start. A `<G rotation={-90}>` group makes arcs begin at 12 o'clock and proceed clockwise; `strokeLinecap="butt"` keeps them gapless.
- The optional dashed **outer ring** is a thin `Circle` with a dashed `strokeDasharray`, drawn just outside the donut. The donut always fills the full `size` footprint; when `showOuterRing` is true the ring extends **beyond** that footprint (matching the Figma `-5%` inset background). The container uses `overflow: 'visible'` so the ring isn't clipped.
- All geometry lives in `usePieChartConfig` / `usePieChartSegments` and the pure `utils` — the component itself is layout-free.

### Data rules

- Values are **relative shares** normalized by their sum (they need not total 100).
- Non-finite / `≤ 0` values are dropped.
- When more than `maxSegments` valid segments remain, the first `maxSegments − 1` are kept (by input order) and the rest fold into a single `"Other"` arc — matching `EtBreakdownChart`. The folded "Other" uses `colors.otherPrimary`.

### Colors

- Default palette: DS Category Accent `accentA700…accentG700` (theme-aware, light/dark).
- Per segment, consumers may pass `color` as a solid string or a `[from, to]` tuple; arcs render **solid** using the tuple's second (primary) value via `resolveSegmentColor`.

### Animation

- `enableAnimation` (default true) drives a shared `progress` value `0→1` with `withTiming`. Each `Segment` reads it in a `useAnimatedProps` worklet, growing its dash as the global sweep passes its range — a clockwise "draw-on".
- Respects accessibility: when `useReducedMotion()` is true (or `enableAnimation={false}`) the ring renders fully immediately.

### Compound components

`Object.assign` attaches the legend building blocks to the main export:

- `EtPieChart` — the donut. Sizes are semantic (`'small' | 'large'`); the DS-defined pixel diameters live inside `usePieChartConfig` and are the only place numbers live.
- `EtPieChart.SegmentLegend` — `layout="grid"` (rows centered as a block, cells hug content, incomplete last row centers its lone item) or `"list"` (full-width stack). Adding `columns` fixes how many items a row holds so the row breaks stay the same whatever the labels are; rows still hug and center.
- `EtPieChart.SegmentLegendItem` — dumb row; pressable **only** when `onPress` is provided (never navigates on its own). `size="medium"` (default) sets the body scale (14/20); `size="small"` sets the caption scale (10/14) that the compact allocation card pairs with the `small` donut.

The legend is intentionally a **sibling**, not a forced child, so consumers control placement.

## Accessibility

| Element                        | Behaviour                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `EtPieChart`                   | `accessibilityRole="image"`; label defaults to `"Pie chart with N segments"` (overridable)             |
| `EtPieChart.SegmentLegendItem` | `accessibilityRole="text"`, or `"button"` when `onPress` is set; label defaults to `"{label} {value}"` |
| `testID`                       | Propagated as `-track`, `-segment-{i}`, `-outer-ring`, and legend `-cell-{i}` / item suffixes          |

## Testing & Storybook

- **Tests** — `et-pie-chart.test.tsx` + `utils/*.util.spec.ts`. Cover rendering, `size`, `maxSegments` folding, outer ring, animation on/off, a11y, and the legend compounds. `useEtoroTheme` is mocked globally in `test-setup`; Reanimated uses the global mock.
- **Storybook** — `.rnstorybook/stories/components/data-display/pie-chart/et-pie-chart.stories.tsx` (Basic, Sizes, WithOuterRing, MaxSegments, WithSegmentLegend, Animation, APIReference).

## Dependencies

- `react-native-svg` — donut rendering (`Svg`, `Circle`, `G`)
- `react-native-reanimated` — entrance sweep (`useSharedValue`, `withTiming`, `useAnimatedProps`)
- `etoro-ui/core/hooks` — theme (`useEtoroTheme`) + `useReducedMotion`
- `etoro-ui/foundations/text` — `EtText` (legend labels/values)
- `etoro-ui` `EtIconV2` — legend chevron (`angle-right`)
