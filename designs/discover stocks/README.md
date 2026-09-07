# Discover Stocks

**Status:** desktop conversion complete (code prototype + Figma frame); mobile source is a
pre-existing screen, not built by this workspace.
**Platform(s):** mobile (pre-existing source) + desktop (new, this session)
**Started:** 2026-09-07
**Last updated:** 2026-09-07

## What this is

eToro's "Discover Stocks" screen: a browsable, dense list of tradable stocks (logo, ticker,
company name, 1-day change, 52-week range) with a market-scope dropdown ("All ▾") and
customize-columns / filter utility actions. This design's `desktop/` folder holds a new desktop
version of that screen, built by pattern-matching against eToro's real, shipped Watchlist
mobile↔desktop pair (the closest precedent for a dense instrument-table screen) rather than
designed from a blank slate.

## Source material

- Existing mobile Figma frame: https://www.figma.com/design/fiNRek0eNjI0D7VGp9bgnn/Skill---No-skill-tests?node-id=48-12146
  (file `fiNRek0eNjI0D7VGp9bgnn`, node `48:12146`, "Stocks") — pre-existing, not built by this
  workspace; this session only *read* it (via `get_screenshot`/`get_design_context`) to pattern
  match and to clone real component instances into the new desktop frame.
- Pattern-matching precedent: Watchlist mobile↔desktop (mobile node `10687:23412` / "Basic view"
  frame `10752:86080`, file `bCEqWBZLcKyGODXshfdRqn`; desktop node `21:33489`, file
  `m1wFSZEJXySmcXVMLlGOpv`), cross-checked against Portfolio mobile↔desktop (mobile node
  `11690:17563`, file `YXeAcFz1zgdFzCZVhiBqsq`; desktop node `21:4147`, same `Desktop-2026` file)
  — see `desktop/coverage-report.md` for the full structural comparison and derived pattern.

## Where things live

- `code/` — mobile code prototype (not built by this session; empty/unused so far)
- `figma/figma-links.md` — links/notes for the mobile Figma frame (template only — the mobile
  screen already exists in Figma and wasn't (re)built here)
- `desktop/` — the desktop conversion built this session:
  - `desktop/code/discover-stocks.web.tsx` — React Native (`.web.tsx`) prototype built from real
    `etoro-ui` Storybook components only (Tier A/B); Tier C gaps (Left Side Menu) are called out
    inline and in the coverage report rather than fabricated.
  - `desktop/figma/figma-links.md` — the new desktop Figma frame (node `52:9187`, same file as
    the mobile source) and its component inventory.
  - `desktop/coverage-report.md` — full Tier A/B/C breakdown, the Watchlist/Portfolio pattern
    comparison, and open questions/blockers.
- `coverage-report.md` — template placeholder (mobile side coverage; not filled in, since the
  mobile screen predates this workspace's involvement).

## Real UI copy (written by the `content-writer` subagent against eToro's Voice & Style Guide)

Used in `desktop/code/discover-stocks.web.tsx`:

1. **Search placeholder:** "Search assets" — a deliberate *refinement* of the currently-shipped
   "Search for..." placeholder seen on the real Watchlist/Portfolio desktop screens. The writer
   flagged that "Search for..." actually breaks two of the guide's own rules (ellipsis use is
   banned; "for..." is an incomplete sentence) and that eToro's terminology guide mandates "Asset"
   over "stocks"/"instrument" in shared UI — plus explicitly notes existing product
   inconsistencies "do not define the standard," so this shouldn't be waved through as precedent.
2. **Customize-columns icon button (accessibility label):** "Customize Columns"
3. **Filter icon button (accessibility label):** "Filter Stocks"
4. **Notification bell (accessibility label):** "Notifications" — the writer flagged this as a
   judgment call: strict verb-first consistency with the other two labels would give "Open
   Notifications" instead; "Notifications" was chosen to match eToro's real convention on other
   icon-only utility buttons (e.g. "Search," not "Open search").
5. **Empty state (zero search/filter results):** Title "No matches found" / body "Try a different
   search term or adjust your filters."
6. **Error state (list fails to load):** Title "We couldn't load stocks" / body "Try refreshing
   the page." / button "Try Again."

The writer confirmed none of the above touches Compliance-restricted territory (no risk, fee, or
leverage language) — all six are low-risk UI microcopy per the guide's own risk tiers, so nothing
was refused or needed a Compliance handoff.

**Known code/Figma copy drift:** the Figma frame's Top bar - desktop instance still shows that
component's own published default placeholder ("Search for...") rather than the refined "Search
assets" above — see `desktop/figma/figma-links.md`'s "Known imperfections" section for why, and
what a designer should reconcile.

## Notes

- The desktop Figma frame was built primarily by **cloning real component instances already
  placed in the mobile source frame** (context row, table columns/rows, range bars) rather than
  re-searching the "DS - React" library from scratch for each one — this was faster and
  guaranteed exact fidelity to the real shipped mobile content (same repeated "APPL / Apple"
  mock-data rows, same column labels). The Left Side Menu and Top bar - desktop were freshly
  imported via their confirmed componentKeys instead, since those don't exist on the mobile frame.
- **Open design question, not yet resolved:** should Discover Stocks desktop follow Watchlist
  desktop's pattern of adding extra columns (Sentiment, Market Cap, Div. Yield, P/E, Volume,
  Analyst Rating) at the wider desktop width? This build deliberately kept the mobile source's
  real 3 columns (Asset, Change 1D, 52w Range) rather than inventing new data fields with no
  mobile-source basis — see `desktop/coverage-report.md` for the full reasoning. Flag to design
  before treating either direction as final.
- **Biggest production blocker:** the Left Side Menu (nav rail), required on every desktop page,
  has no Storybook implementation yet (Tier C) — the code prototype reserves its layout space but
  cannot render a real one until engineering builds it.
