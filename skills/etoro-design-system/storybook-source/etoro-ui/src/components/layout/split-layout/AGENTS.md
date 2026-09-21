# EtSplitLayout Component

## Purpose & Scope

`EtSplitLayout` is the kit's responsive two-pane layout primitive. At or above
`BREAKPOINT_DESKTOP` (1024) it renders a **Main** pane and an **Aside** pane
side by side with configurable flex weights; below the breakpoint the Aside
**unmounts** and Main fills the layout. An optional **TopBar** renders as an
absolute overlay at the top of the Main pane only — it never displaces content
and never covers the Aside.

First consumers: the web login/registration split screens (50/50, brand panel
on the right). Designed ahead for multi-step flows (steps rail on the left,
`ratio={[2, 1]} asidePosition="start"`).

It is **dimension-driven and platform-agnostic** — no `Platform.OS` branches.
Adopt it per-screen (e.g. inside a `.web.tsx` layout shell) to keep other
platforms untouched; a native tablet layout can adopt it later unchanged.

## Entry Point & Contract

```tsx
<EtSplitLayout
  ratio?: [number, number]           // [main, aside] flex weights; default [1, 1]
  asidePosition?: 'start' | 'end'    // default 'end'
  style?: StyleProp<ViewStyle>
  testID?: string
>
  <EtSplitLayout.TopBar>…</EtSplitLayout.TopBar>
  <EtSplitLayout.Main>…</EtSplitLayout.Main>
  <EtSplitLayout.Aside>…</EtSplitLayout.Aside>
</EtSplitLayout>
```

| Prop            | Type                   | Default  | Notes                                                                |
| --------------- | ---------------------- | -------- | -------------------------------------------------------------------- |
| `ratio`         | `[number, number]`     | `[1, 1]` | **Semantic** `[main, aside]` order — independent of `asidePosition`. |
| `asidePosition` | `'start' \| 'end'`     | `'end'`  | Which side the aside renders on when split.                          |
| `style`         | `StyleProp<ViewStyle>` | —        | Applied to the root row container.                                   |
| `testID`        | `string`               | —        | Root container. Panes: `et-split-layout-main-pane` / `-aside-pane`.  |

Subcomponents all take `children` / `style` / `testID`. Panes are transparent
plain views — consumers paint backgrounds (e.g. the login aside card) via
`style`. Scrolling is the consumer's concern (put your own ScrollView inside
Main).

### Context

```ts
const { isSplit, ratio, asidePosition, topBarHeight } = useSplitLayoutContext();
```

Exported publicly so consumers can react to the mode without re-deriving the
breakpoint (e.g. a steps rail rendering a collapsed horizontal stepper when
`isSplit` is false). `topBarHeight` is the TopBar's measured height (0 when
absent) — the bar never pushes content, so use this to inset scroll content on
short viewports. Throws outside `<EtSplitLayout>`.

### Shared shell constants

Import from `etoro-ui` (do **not** re-hardcode in each `.web.tsx` layout):

| Constant                                      | Value / formula | Use                                             |
| --------------------------------------------- | --------------- | ----------------------------------------------- |
| `SPLIT_LAYOUT_TOP_BAR_CONTROL_HEIGHT`         | `44`            | Control hit target in the TopBar row            |
| `SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT` | `44 + 2*X4`     | Seed `paddingTop` until `topBarHeight` measures |
| `SPLIT_LAYOUT_CONTENT_COLUMN_WIDTH`           | `375`           | Fixed Main column maxWidth (auth split)         |
| `SPLIT_LAYOUT_TOP_BAR_WORDMARK_HEIGHT`        | `22`            | Wordmark in the absolute TopBar                 |
| `SPLIT_LAYOUT_COLUMN_WORDMARK_HEIGHT`         | `16`            | Wordmark inside the Main column                 |
| `SPLIT_LAYOUT_COLUMN_LOGO_SLOT_HEIGHT`        | `44`            | Vertical slot for the in-column wordmark        |

```tsx
import { EtSplitLayout, SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT, SPLIT_LAYOUT_CONTENT_COLUMN_WIDTH, useSplitLayoutContext } from 'etoro-ui';

const { topBarHeight } = useSplitLayoutContext();
// …
paddingTop: topBarHeight || SPLIT_LAYOUT_MOBILE_TOP_BAR_FALLBACK_HEIGHT;
```

### Shared shell styles

`splitLayoutShellStyles` — the visual keys that every auth/marketing split shell
reuses (`fill`, TopBar row, `scrollContentFixed` / `contentColumnFixed`,
`logoSlot`, `asideCard`). Import from `etoro-ui` and compose:

```tsx
import { splitLayoutShellStyles } from 'etoro-ui';

// Prefer arrays for overrides — don't fork the shared StyleSheet.
<EtSplitLayout.Aside style={[splitLayoutShellStyles.asideCard, { backgroundColor, borderLeftColor }]} />;
```

**Keep local** (screen-specific rhythm / architecture):

| Local only                         | Examples                                                        |
| ---------------------------------- | --------------------------------------------------------------- |
| Scroll _base_ padding              | login `paddingHorizontal: 24`; registration `paddingBottom: X6` |
| Stretch justify                    | login `space-around` vs 2FA `space-between`                     |
| One-off insets / gaps              | login UAE bottom, `formActionsGap`                              |
| Non-scroll body / nested scrollers | registration `bodyFixed`; lost-phone step-owned ScrollViews     |

Do **not** put LanguageSelector / AuthScreenTopBar _components_ in etoro-ui —
chrome composition stays in feature / `@etoro/common/auth/ui-chrome`; only the
layout metrics + shell styles live here.

## Behavior Contracts

- **Aside unmounts below the breakpoint** (it does not `display:none`). Rapid
  mount/unmount of Reanimated `entering`-animated views is a known crash
  vector (see the login `display:'none'` workaround in
  `apps/…/login/components/login-actions.tsx`) — **Aside children must not
  rely on mount-coupled `entering` animations**. If a future consumer needs
  them, add hysteresis to the `isSplit` flip rather than lifting this rule.
- **TopBar never displaces content.** It is `position:'absolute'` inside the
  Main pane at `zIndex` 100 (chrome tier — under panels/modals per the
  desktop z-ladder). Content that must clear it reads `topBarHeight` from
  context.
- **Breakpoint source**: `useBreakpoint(BREAKPOINT_DESKTOP)` from
  `core/hooks` / `core/styles/breakpoints` — edge-triggered, re-renders only
  on threshold crossings.

## Usage Patterns

### 50/50 auth screen (web shell)

```tsx
<EtSplitLayout>
  <EtSplitLayout.TopBar>{/* back / actions */}</EtSplitLayout.TopBar>
  <EtSplitLayout.Main>
    <ScrollView contentContainerStyle={contentStyles}>{form}</ScrollView>
  </EtSplitLayout.Main>
  <EtSplitLayout.Aside style={asideCardStyle}>{brandPanel}</EtSplitLayout.Aside>
</EtSplitLayout>
```

### Multi-step flow — narrow steps rail on the left

```tsx
<EtSplitLayout ratio={[2, 1]} asidePosition="start">
  <EtSplitLayout.Main>{stepContent}</EtSplitLayout.Main>
  <EtSplitLayout.Aside>{stepsRail}</EtSplitLayout.Aside>
</EtSplitLayout>
```

## Anti-patterns

### Don't gate it by platform inside shared files

```tsx
// BAD — kit-erosion; the component is already dimension-driven
{
  Platform.OS === 'web' ? <EtSplitLayout>…</EtSplitLayout> : <View>…</View>;
}

// GOOD — adopt in a .web.tsx layout shell; native file keeps its own tree
```

### Don't re-derive the breakpoint in consumers

```tsx
// BAD — drifts from the layout's own mode
const isDesktop = useWindowDimensions().width >= 1024;

// GOOD
const { isSplit } = useSplitLayoutContext();
```

### Don't put entering-animated views directly in Aside

See Behavior Contracts — the pane unmounts on breakpoint crossings.

## Design Tokens

| Element         | Token                       | Notes                                   |
| --------------- | --------------------------- | --------------------------------------- |
| Split threshold | `BREAKPOINT_DESKTOP` (1024) | `core/styles/breakpoints.ts`            |
| TopBar layer    | zIndex 100                  | Chrome tier; panels 1000, modals above. |
| Pane visuals    | — (consumer-owned)          | Panes are transparent by design.        |

## Dependencies & Edges

### Internal

- `useBreakpoint` — `core/hooks/use-breakpoint.ts` (edge-triggered width flag).
- `create` — `utils/create.ts` (memo + displayName for subcomponents).

### Structure

- `hooks/use-split-layout-children.ts` separates compound children by
  displayName into render locations (TopBar must land inside the Main pane —
  as a sibling it would overlay both panes).
- `api/context.tsx` — value context (`useSplitLayoutContext`, public) +
  actions context (internal `useSplitLayoutActions`, TopBar height setter kept
  separate so the TopBar doesn't re-render on value changes).

## Related Context

- Strategy: shared dimension-driven kit primitives + two-tier breakpoint
  tokens (768 tablet / 1024 desktop, aligned with the web-adaptation fork's
  `WEB_DESKTOP_MIN_WIDTH`); web adoption via per-screen `.web.tsx` shells.
- Figma: DS - React, node `62822-82389` (login split screen, 1920×900).
- First consumer: `apps/etoro-mobile/src/components/pages/auth/login/screens/`
  login layout shell (`.web.tsx`).
