# EtView / EtScrollView — Agent Guide

## Overview

`EtView` and `EtScrollView` are neutral **region/content containers**. Each is a
plain React Native `View` / `ScrollView` until it is handed `loading` +
`skeleton`, at which point it crossfades the skeleton → content (the children).

**Location:** `/libs/etoro-ui/src/components/view/`

> **Role clarity (the deprecation trap).** The names `EtView` / `EtScrollView`
> were once _screen containers_ (with a `topBar` prop) and were replaced by
> `EtScreen`. They have been **revived for a different role** — region/content
> containers with optional loading. They are **not** screen containers and never
> take a `topBar`. The screen root is still `EtScreen` / `EtScreenV2`.

## How it works

- **No `skeleton` prop → a plain container.** `EtView` early-returns a plain
  `View` (and `EtScrollView` a plain `ScrollView`) — zero extra hooks, zero
  loading overhead. Use it anywhere you'd use a `View`/`ScrollView`.
- **With `skeleton` → loading-aware.** It delegates to the internal
  `LoadableContent` crossfade: both layers stay mounted during the handoff, the
  skeleton dissolves with a shared-value **opacity** animation (reliable on
  Fabric — no `entering`/`exiting`), and unmounts on completion. While `loading`,
  the skeleton renders in normal flow (reserves height); when `loading` flips
  `false`, `children` mount in flow and the skeleton fades out as an
  `absoluteFill` overlay over them. Honors OS reduce-motion (instant swap).

## Props

`EtView` extends `ViewProps`, `EtScrollView` extends `ScrollViewProps`. Both add:

| Prop       | Type        | Default | Description                                                                                                                             |
| ---------- | ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `loading`  | `boolean`   | `false` | While `true` the skeleton shows; flipping to `false` dissolves it to reveal content                                                     |
| `skeleton` | `ReactNode` | —       | Placeholder shown while loading. Omitting it makes the container a plain `View`/`ScrollView`                                            |
| `fill`     | `boolean`   | `false` | Make the loading-phase skeleton wrapper `flex: 1`. Set when the skeleton root relies on `flex: 1` (e.g. a full-screen list placeholder) |
| `duration` | `number`    | `250`   | Override the dissolve duration (ms)                                                                                                     |

`EtScrollView` additionally disables scrolling while the skeleton is shown.

## Integration standard

1. **Encapsulate loading inside the smart component.** A component that owns its
   UI takes a `loading` prop and renders its own `EtView` + skeleton internally,
   so parents stay clean:

   ```tsx
   // Inside BalanceGraph — it owns its skeleton:
   function BalanceGraph({ loading, equityData }: BalanceGraphProps) {
     return (
       <EtView loading={loading} skeleton={<BalanceGraphSkeleton />} style={styles.container}>
         <EtLineChart data={equityData} />
       </EtView>
     );
   }

   // Parent stays clean — no skeleton/wrapper markup:
   <BalanceGraph loading={isEquityLoading} equityData={rawData} />;
   ```

2. **Keep `EtView` at the feature level only when wrapping an unowned kit
   component** you cannot push into (e.g. `EtSection.Chips`, a `FlashList`).
3. **Plain region == a normal `View`:** `<EtView style={styles.row}>{children}</EtView>`.
4. **Skeleton definitions live in the feature's `loaders/` folder** (keep the
   `*-skeleton.tsx` filename); import from `../loaders/...`.

```tsx
// Skeleton -> content (no hard cut)
<EtView loading={isLoading} skeleton={<MySectionSkeleton />}>
  <MySection data={data} />
</EtView>

// Scrollable region that loads
<EtScrollView loading={isLoading} skeleton={<DetailSkeleton />} contentContainerStyle={styles.content}>
  <Detail data={data} />
</EtScrollView>
```

## Related files

- `libs/etoro-ui/src/components/view/et-view.tsx` — `EtView`
- `libs/etoro-ui/src/components/view/et-scroll-view.tsx` — `EtScrollView`
- `libs/etoro-ui/src/components/view/loadable-content.tsx` — shared crossfade core
- `libs/etoro-ui/src/components/view/api/types.ts` — `EtLoadableProps`, `EtViewProps`, `EtScrollViewProps`
- `libs/etoro-ui/src/components/status/skeleton/AGENTS.mdc` — the `EtSkeleton` shape/clock system
- `.cursor/rules/architecture/rn/skeleton-loaders.mdc` — skeleton rules
