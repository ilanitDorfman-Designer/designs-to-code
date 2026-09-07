# Coverage report — Discover Stocks (Desktop)

_Produced per Step 7 of the `etoro-design-system` skill. Kept here so gaps stay visible over
time instead of only appearing once in chat._

**Date:** 2026-09-07

## Reference pair used for pattern-matching

Closest real, shipped precedent: **Watchlist** mobile↔desktop (mobile node `10687:23412` /
"Basic view" frame `10752:86080`, file `bCEqWBZLcKyGODXshfdRqn`; desktop node `21:33489`, file
`m1wFSZEJXySmcXVMLlGOpv`), cross-checked against **Portfolio** mobile↔desktop (mobile node
`11690:17563`, file `YXeAcFz1zgdFzCZVhiBqsq`; desktop node `21:4147`, file
`m1wFSZEJXySmcXVMLlGOpv`) to confirm the dense-data-vs-dashboard distinction documented in
`desktop-layout.md`.

**Derived pattern:** Discover Stocks mobile is a dense instrument table (Asset / Change 1D /
52w Range columns, no persistent summary panel) — structurally much closer to Watchlist than to
Portfolio/Home. Applied Watchlist's desktop transformation:
- Left Side Menu (collapsed, 80px) + Top bar - desktop (same `EtTopbar`, desktop slot content) —
  identical shell chrome to every desktop screen.
- **No Right Panel** — Watchlist omits it (dense data); only Home/Portfolio (dashboard-style,
  persistent summary) include it, per `desktop-layout.md`'s "General padding & spacing" section.
- Real Watchlist desktop **adds extra columns** (Sentiment, Market Cap, Div. Yield, P/E, Volume,
  Analyst Rating) beyond what Watchlist mobile shows, using the freed-up desktop width. This
  build deliberately did **not** mirror that specific addition — Discover Stocks mobile's real
  content is only 3 columns (Asset, Change 1D, 52w Range), and inventing new data fields with no
  mobile-source basis would be fabricating content, not carrying forward a real pattern (same
  discipline as the Home pair's documented "missing feed posts" gap — carry the real gap/scope
  forward, don't quietly resolve it either direction). **This is flagged as a genuine open
  question, not a confident decision**: it's plausible eToro's intent is for Discover Stocks
  desktop to also gain more columns, matching Watchlist's pattern exactly. A designer should
  confirm which is correct.

**What I could not confirm from a screenshot alone:** whether the eToro logo + collapse toggle
visible at the very top of the Left Side Menu's Collapsed state (confirmed via the real Figma
component instance placed in this build) belongs structurally to the Left Side Menu component
itself, or to a boundary with the Top bar. `desktop-layout.md`'s abstract "Header spans the
remaining width" description and `component-tiers.md`'s "resize to screen width minus nav width"
instruction both imply the Top bar starts *after* the nav column — which is what this build
assumes and is consistent with the real component's own layout once imported (the logo/toggle
rendered as part of the Left Side Menu instance, not the Top bar instance) — but this wasn't
independently re-verified against Figma's layer tree beyond what importing the real components
already confirmed.

## Tier A components used

`EtButton`, `EtIconV2`, `EtRange`, `EtSection` (`Title`/`SelectTitle`), `EtText` (foundation) —
all Code Connect-mapped, used freely in both code and the Figma frame.

## Tier B components used (flagged per Step 4)

- **`EtTopbar`** — same component as mobile's Top bar, not yet Code Connect-mapped at this node;
  desktop slot content (Search field + "Ask Tori" + notification bell) is documented in
  `component-tiers.md`'s Top bar row as the intended desktop composition.
- **`EtSearchInput`** — real, finished Storybook component (`components/input/search-input`), not
  yet Code Connect-confirmed at the Discover Stocks node.
- **`EtAssetItem`** — real, finished, well-documented Storybook component
  (`components/list/asset-item`) whose own AGENTS.mdc explicitly recommends it for "instrument
  rows in watchlists, search results, ... table cells" — a strong design-intent fit per Step 3.
  Not Code Connect-confirmed at this node (the mobile Figma source's row returns only generic
  `EtText` matches, per `component-tiers.md`'s "generic incidental content" caveat), so Tier B.
  **Code/Figma correspondence note:** the Figma frame's table rows were cloned directly from the
  mobile source and are visually/structurally closer to the `list/list-item-v2` family (Tier A,
  confirmed via Code Connect) rather than `EtAssetItem`. Both are real, legitimate components for
  this content — the code prototype uses `EtAssetItem` for its purpose-built asset-row API
  (Logo/Symbol/Name/Change/Trailing), while the Figma frame reuses the exact real instances
  already in the mobile source. This is a deliberate choice, not an oversight, but it means the
  code and Figma outputs reference conceptually-equivalent, differently-named underlying
  components — worth a designer's confirmation on which is the intended long-term component for
  this row.
- **`EtSection.SelectTitle`** (code only) — real Tier A subcomponent, but note the code prototype
  uses it (a single pressable title+chevron) for the "All" market picker, while the real mobile
  Figma source (and the cloned Figma frame) instead composes `EtSection.Title` + a separate
  `EtIconV2` chevron icon side by side, not `SelectTitle`. Both are valid Tier A patterns; flagged
  so a designer can confirm/align which composition is intended going forward.

## Tier C components (not used in code; real Figma component only)

- **Left Side Menu** — required on every desktop page per `desktop-layout.md`'s global
  requirement, and a real, published "DS - React" component (imported via componentKey
  `8f8adc5e5ef2e846b0ae8bd1711018bc354b498d` into the Figma frame), but it has **no Storybook
  implementation** (confirmed: no `side-menu`/`left-menu` folder anywhere in
  `storybook-source/etoro-ui/src/`). The code prototype (`discover-stocks.web.tsx`) reserves its
  exact 80px collapsed width with a plain, unstyled spacer `View` — explicitly not a fabricated
  nav-rail component (no icons, no nav items, no chrome of its own). **This is the single biggest
  blocker to this screen shipping in code as-is**: engineering needs to build the Left Side Menu
  in Storybook before a real desktop nav rail can render.
- **"Empty state"** — Figma-only per `component-tiers.md`'s "Not found in Storybook" table (no
  matching folder; Code Connect returns only generic `EtText`). The code prototype's empty/error
  states are composed from real Tier A primitives (`EtText`, `EtButton`) directly, never a
  fabricated `EmptyState`/`ErrorState` component. Only the default populated state was built in
  the Figma frame — empty/error states were not modeled there.

## Material Design fallbacks used

None. `component-docs/` and each component's own `AGENTS.mdc` had sufficient design-intent
guidance for every component used here (notably `EtAssetItem`'s AGENTS.mdc, which explicitly
names this exact use case).

## Copy

All new UI copy (search placeholder, icon-button accessibility labels, empty-state title/body,
error-state title/body/button) was written by the `content-writer` subagent against eToro's real
Voice & Style Guide — see the code file's header comment and `../README.md` for the full set of
strings and the writer's terminology/formatting rationale (e.g. "Search assets" over "Search
for..." per the guide's Asset-vs-Instrument terminology rule and its no-ellipsis placeholder
rule). Nothing requested touched Compliance-restricted content (no risk/fee/leverage language),
so nothing was refused.

**Known code/Figma copy drift:** the code prototype uses the content-writer's refined "Search
assets" placeholder; the Figma frame's Top bar - desktop instance still shows that component's
own published default "Search for..." (see figma-links.md's "Known imperfections" section) —
editing text nested inside an imported instance was judged out of scope for this pass. A designer
should reconcile which placeholder is correct and update the Figma component's default
accordingly (not just this one instance).

## Blockers to production-ready

1. **Left Side Menu has no Storybook implementation** (see Tier C section above) — this blocks
   the desktop nav rail from rendering as a real component in code at all today.
2. **Column scope is an open question, not a confirmed decision** — should Discover Stocks
   desktop match Watchlist's pattern of adding extra columns (Sentiment, Market Cap, Div. Yield,
   P/E, Volume, Analyst Rating) at the wider desktop width, or stay at the mobile source's 3
   columns as built here? Needs a design decision before this is final.
3. **Left Side Menu's selected-item state** shows "Portfolio" by default in the placed Figma
   instance, not "Discover" — needs a manual fix in Figma (see figma-links.md).
4. **Instrument logos use the static local asset fallback** (`Aapl.png`, `Nvda.png`, etc. from
   `assets/images/`), not the live `etoro-cdn.etorostatic.com/market-avatars/{instrumentId}/...`
   CDN — `references/assets.md` documents a known gap (no ticker→instrumentId lookup available),
   so no ID was guessed. A real instrumentId mapping is needed before this ships against live data.
