# Figma links — Discover Stocks (Desktop)

Track the live, editable Figma frame(s) here so a future session doesn't have to re-search
Figma to find them again. The actual editable design lives in Figma itself (placed as real,
linked component instances via the skill's `use_figma` workflow) — this file is just the
pointer + a record of what's Tier A/B in it.

## Frame(s)

| Frame | URL | Node ID | Notes |
|---|---|---|---|
| Mobile — source (existing, not built by this session) | https://www.figma.com/design/fiNRek0eNjI0D7VGp9bgnn/Skill---No-skill-tests?node-id=48-12146 | `48:12146` ("Stocks") | The real mobile screen this desktop version was pattern-matched from and built against. |
| **Desktop — main (new, built this session)** | https://www.figma.com/design/fiNRek0eNjI0D7VGp9bgnn/Skill---No-skill-tests?node-id=52-9187 | `52:9187` ("Discover Stocks — Desktop") | Same file as the mobile source (`fiNRek0eNjI0D7VGp9bgnn`, "Skill - No skill tests"), placed on canvas `46:10805` ("7.9 test") next to the mobile frame — **not** the shared `Desktop-2026` file (`m1wFSZEJXySmcXVMLlGOpv`) that Home/Portfolio/Watchlist desktop live in, per this task's explicit instruction. |

Frame size: 1920×1080. Built by importing/cloning **real** "DS - React" (`cMyPhFndkPeXR6UkIuZujT`) component instances only — no hand-drawn shapes, emoji, or same-named components from another library.

## How the frame was assembled

1. **Left Side Menu** (Collapsed variant) — freshly imported via `importComponentSetByKeyAsync` using the confirmed componentKey `8f8adc5e5ef2e846b0ae8bd1711018bc354b498d` (node `59867:98373`), resized to the documented 80px Collapsed width, full frame height. Required on every desktop page per `desktop-layout.md`'s global requirement.
2. **Top bar - desktop** — freshly imported via `importComponentByKeyAsync` using the confirmed componentKey `9e5ea214d1f11f0ce744703edb0242822a4bbfdb` (node `64911:413329`), resized to the available width (1920 − 80 = 1840px). This is the same `EtTopbar` component used on mobile — the desktop variant's published default already bakes in the Search field + "Ask Tori" action + notification bell, so no manual slot recomposition was needed.
3. **Context row** ("All ▾" + customize-columns/filter icon buttons) — **cloned directly from the real mobile frame** (node `48:12153`, "Context area - default") rather than re-searched, since the mobile frame already contains real, correctly-configured instances of these exact components. Resized to the desktop content width; the icon-button group was repositioned to the new right edge.
4. **Table** ("Asset" / "Change 1D" / "52w Range") — **cloned directly from the real mobile frame** (node `48:12167`, "Table types" → "Default table" → 3 Columns), then each column resized to redistribute the freed-up desktop width: Asset column widened to ~1392px (absorbs the extra space), Change 1D kept at 180px, 52w Range widened slightly to 220px. All 11 rows carried forward with their real mock content (repeated "APPL / Apple" placeholder rows, colored change values, range bars) — this matches what the mobile source itself actually contains; no new tickers/content were invented for the Figma frame (see coverage-report.md for why the code prototype uses varied real tickers instead).

## Components used (Tier A/B only — see coverage-report.md for Tier C gaps)

| Component | Tier | Placed via |
|---|---|---|
| Top bar - desktop (`EtTopbar`, desktop slot content) | B | Direct componentKey import (`9e5ea214d1f11f0ce744703edb0242822a4bbfdb`) |
| Search field (baked into Top bar - desktop's default content) | B | Came with the Top bar - desktop import, not placed separately |
| "Ask Tori" action button (baked into Top bar - desktop) | A (Button) | Came with the Top bar - desktop import |
| Notification bell action (baked into Top bar - desktop) | A (Button/Icon) | Came with the Top bar - desktop import |
| Heading L block (`EtSection.Title`, "All") | A | Cloned from mobile instance `48:12158` |
| angle-down-small icon | A (`EtIconV2`) | Cloned from mobile instance `48:12159` |
| Icon button × 2 (customize columns, filter) | A (`EtButton`/`EtIconV2`) | Cloned from mobile frames `48:12161` / `48:12164` |
| cell header × 3 (Asset / Change 1D / 52w Range labels) | A (`EtText` + `angles-up-down-fill` icon) | Cloned from mobile instances `48:12170` / `48:12188` / `48:12205` |
| Table row instances (List start asset + name + change) | A (List / `list-item-v2` family) | Cloned from mobile instances (e.g. `48:12171`, `48:12189`) |
| Range (52w Range bars) | A (`EtRange`) | Cloned from mobile instances (e.g. `48:12207`) |
| Default table / Table types wrapper | B | Cloned from mobile frame `48:12167`/`48:12168` |

**Tier C (placed, not usable in code):**

| Component | Tier | Placed via |
|---|---|---|
| Left Side Menu (Collapsed) | C | Direct componentKey import (`8f8adc5e5ef2e846b0ae8bd1711018bc354b498d`) — see coverage-report.md |

## Known imperfections in the placed frame

- The Left Side Menu instance's default published appearance shows **Portfolio** as the selected nav item, not **Discover** — no attempt was made to alter the component's internal selection state, since it's a Tier C component with no Storybook implementation to cross-check a safe way to do that. A designer should set the correct selected state manually in Figma.
- The Top bar - desktop's search field placeholder text is still the component's own published default ("Search for..."), **not** the refined "Search assets" copy the content-writer subagent recommended for this screen (see coverage-report.md) — editing text nested inside an imported instance without breaking its component link/font-loading was judged higher-risk than leaving the published default, given this is a UI-copy nuance rather than a structural gap. Flagged for a designer to update either the instance override or (better) the source component's default copy.
- Only the **default, populated** state was built in Figma. The empty-state and error-state copy (see coverage-report.md) were only demonstrated in the code prototype, not built as separate Figma frames/variants.
