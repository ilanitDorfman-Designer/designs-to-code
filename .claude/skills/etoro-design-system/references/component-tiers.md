# Component Tier Registry

This is the single source of truth this skill uses to decide which components are safe to use, and how.

**Last full verification: 2026-08-31.** This file is a static snapshot, not a live view of Figma/Storybook — nothing here updates automatically when someone publishes a new Code Connect mapping or finishes a component. Treat rows as a fast, usually-right cache, not a guarantee. Re-verify live (via `get_code_connect_map`, or by checking the Storybook source directly) rather than trusting a cached row as-is when: the component is already flagged **(confirm)**, the user mentions something changed recently in Figma or Storybook, or the screen being built is high-stakes/production-facing rather than an exploratory mockup. Update this date whenever a fresh full sweep is done.

**Source code resynced: 2026-09-07** (see [workflow-code-and-figma.md](workflow-code-and-figma.md#resyncing-storybook-source-from-etoro-plus) for how). This is a *different* axis from the "last full verification" date above — it means `storybook-source/` now matches the real `eToro-Plus` repo's code as of that date, **not** that every row's tier/Code Connect status below has been re-checked against it. Two new top-level categories appeared in this resync that aren't reflected in the table yet — treat anything from them as **unverified, not Tier A/B by default** until checked against Figma:
- `src/data-display/` — currently just `expandable-card/`.
- `src/questions-form/` — a whole new module (`components/input-question`, `autocomplete-question`, `select-question`, `question-renderer`, `question-header`, `question-message-box`, `questions-form`, `animated-container`, plus `contexts/`, `hooks/`, `interfaces/`, `utils/`).

## Real sources now available

The extracted `etoro-ui` library gives us two of the three inputs needed to tier a component:

1. **Master component list**: [../storybook-source/etoro-ui/ui-kit.ui.md](../storybook-source/etoro-ui/ui-kit.ui.md) — an index of every component with its import name and Figma pattern, built specifically for Figma↔code mapping. Start here to find what exists.
2. **Real source + usage guidance, per component**: `../storybook-source/etoro-ui/src/components/<name>/` and `../storybook-source/etoro-ui/src/foundations/<name>/` — the actual `.tsx` implementation plus (for most components) an `AGENTS.md`/`AGENTS.mdc` file with purpose, props, and explicit "does NOT handle" guidance. **Read the component's own source/AGENTS file for props and usage — don't copy them into this table.** That keeps this registry from going stale the moment the library changes.
3. **Real stories** (usage examples, not just docs): `../storybook-source/rnstorybook-stories/components/<name>/` and `.../foundations/<name>/` — story files show the component actually rendered with real prop combinations.

**Figma file**: `cMyPhFndkPeXR6UkIuZujT` ("DS - React"). Figma access is now live — use `get_code_connect_map` with this fileKey against a specific node ID to get real Code Connect status (returns `{componentName, source}` per node when mapped; an empty/missing result means no Code Connect mapping exists for that node — that's a Tier B/C signal, not an error).

**Important structural note**: this file organizes one Figma *page* per component area (e.g. the page named "✅ ❖ Toggle" contains Toggle Switch, Toggle Group, Text Toggle, etc. all together) — a single page can map to several distinct `etoro-ui` components. `get_metadata` with no `nodeId` only surfaces one top-level page reliably in this file (likely truncated — there are clearly more, confirmed by visiting individual page links), so **page-by-page links from the user are currently the reliable way to enumerate pages**, not a blind crawl.

## Storybook status: presence isn't the same as "done"

A component folder existing in `storybook-source/etoro-ui/src/components/` means it's *at least started*, not necessarily finished. Don't assume `done` just because source exists — check the component's own AGENTS file and stories for signs of an incomplete component (e.g., "desktop only," "mobile not yet supported," a story marked WIP) before marking it `done`. When genuinely unsure, ask rather than guess — an incorrectly-tiered component defeats the point of this registry.

## How to populate the remaining columns

1. **Figma** — the component's name, key/node ID, and a link into the design system file (needs Figma file access).
2. **Storybook status** — `done`, `partial`, or `missing`, per the caution above.
3. **Code Connect status** — whether `figma connect publish` has actually been run for this component (`yes`/`no`), via `get_code_connect_map` once Figma access exists. Don't infer this from Storybook completeness.

From those three facts, the tier is mechanical:
- Code Connect = yes → **Tier A**
- Code Connect = no, but Storybook = done → **Tier B**
- Storybook = partial or missing (regardless of Code Connect) → **Tier C**

## Important: what counts as a genuine Code Connect match

`get_code_connect_map` returns every Code-Connected node *nested inside* the queried frame, not just a mapping for the named component itself. Several Figma frames in this file contain generic foundation elements — `EtText`, `EtIconV2`, `EtButton` — as incidental content (a label, an icon, an example CTA) that have nothing to do with the frame's own identity. **Seeing `EtText`/`EtIconV2` alone in a result is NOT evidence that the named component is Code Connect-mapped** — it just means some generic text or icon happens to sit inside that frame. Only treat a match as genuine Tier A evidence when the returned component name is specific to what the Figma component actually is (e.g. `EtButton` for "Button", `EtAccordion` for "Accordion", `EtRangeSlider` for "Range slider"). This distinction drives every Tier A assignment below — don't relax it when extending this table.

## Registry

Populated from the full components spreadsheet (110 top-level components) cross-checked against `get_code_connect_map` and the real `storybook-source/etoro-ui/src/` folder structure. Rows marked **(confirm)** in Notes are genuinely ambiguous — a naming mismatch, an unexpected match, or no clear Storybook folder — and need a human look before being trusted, not a guess.

| Component (Figma) | Storybook match | Code Connect (this node) | Tier | Notes |
|---|---|---|---|---|
| Button | `components/button` | EtButton | **A** | Exact match. |
| Icon button / Label button / Badge button | `components/button` | EtButton | **A** | Re-checked: `EtButton` is a genuine specific match for these button variants (button context makes `EtButton` specific, not generic). `EtIconButton` still isn't the name Code Connect returns, so if a dedicated icon-only implementation matters, that's still worth a look — but the base button mapping itself is confirmed. |
| Link | `components/link` | EtLink | **A** | Exact match. |
| Accordion | `components/layout/accordion` | EtAccordion, EtAccordion.Item | **A** | Exact match. |
| Question | Accordion.Item usage | EtAccordion.Item | **A** | Not a separate component — it's an `EtAccordion.Item` instance, tier via Accordion. |
| Section | `components/layout/section` | EtSection.Title | **A** | Confirmed at the subcomponent level (`section-title.tsx`). |
| Context area | same node as Section | EtSection.Title | **A** | Same frame as Section — same tier. |
| Centered title & subtitle | Section.Title usage | EtSection.Title | **A** | Not a standalone component — a Section.Title usage pattern. |
| Pagination | `components/navigation/pagination` | EtPagination, EtPagination.Dot | **A** | Exact match. |
| Toggle switch | `components/controls/toggle-switch` | EtToggleSwitch | **A** | Confirmed directly (see earlier Toggle page check). |
| Toggle group | `components/controls/toggle-group` | EtToggleGroup.Option, EtTextToggle | **A** | Confirmed directly. |
| Checkbox | `components/controls/checkbox` | EtCheckbox | **A** | Exact match. |
| Radio button list | `components/controls/radio-group` | RadioIndicator | **A** | Subcomponent-level match, real and specific. |
| Keyboard range slider | `components/status/et-range-slider` | EtRangeSlider | **A** | Exact match (same node as Range slider). |
| Range slider | `components/status/et-range-slider` | EtRangeSlider | **A** | Same node as Keyboard range slider. |
| Range | `components/status/et-range` | EtRange | **A** | Exact match. |
| Date picker | `components/datepicker` | EtDatepicker | **A** | Exact match. |
| Popover | `components/overlays/popover` | EtPopover | **A** | Exact match. **Correction**: a later bulk sweep incorrectly reported "no match" for this exact node — re-verified directly and `EtPopover` genuinely appears among ~800 nested mappings on that frame. The bulk sweep's negative result was wrong, not the file — don't trust a single "no match" without spot-checking when the frame is this large. |
| Pagination dots | `components/navigation/pagination/subcomponents` | EtPagination.Dot | **A** | Exact match. |
| Display list item | `components/list/list-item-v2` | EtListItem | **A** | Exact match. |
| Switch toggle list item | `components/controls/toggle-switch` | EtToggleSwitch | **A** | Confirms this list-item variant is built by composing the real Toggle Switch component, not a separate list-specific toggle. |
| Right panel title / Popup header - desktop (both instances) | `components/layout/section` | EtSection.Title | **A** | Desktop popups/panels reuse the same `EtSection.Title` subcomponent as the main Section component — not a separate header component. |
| Filter chip | `components/controls/chips` | EtChip | **A** | Chip component confirmed. |
| Chips group | `components/controls/chips-group-v2` | EtChip | **A** | Confirmed. |
| Poll | `components/social/post/subcomponents/poll` | EtPoll, EtPoll.VotableOption, EtLink | **A** | Exact match. |
| Answers | Poll subcomponent | EtPoll.VotableOption | **A** | Part of Poll, confirmed. |
| Post | `components/social/post` | EtPoll, EtPoll.VotableOption (generic Icon/Text otherwise) | B | The Poll variant shown inside Post is confirmed; the base Post/card itself isn't independently confirmed — **(confirm)**. |
| Media card | `components/card` (not `media-card`) | EtCard | B | Confirmed twice now (specific `EtCard` match, not generic) — the actual Figma "Media card" is built from the generic `EtCard` component, not the dedicated `media-card` folder. That folder may be for something else or unused by this particular Figma component — **(confirm)** which is actually current. |
| Tiles types / Combo tile types / Switch tile types | `components/controls/selection-tile-group` | EtToggleSwitch (+ EtToggleGroup.Option, EtTextToggle for Combo) | B | Confirmed specific (not generic) — these tile variants are genuinely composed from the real Toggle Switch/Toggle Group components. Still no dedicated "Tile" Code Connect match of its own, so the Tile wrapper itself stays Tier B. |
| Tiles states / Tiles slot | `components/controls/selection-tile-group` | no match | B | — |
| Screen layout | `components/screen` | generic only (Icon/Button/Text) | B | Exists in Storybook; not confirmed Code-Connected at this node. |
| Top bar | `components/topbar` (`EtTopbar`, compound Start/Middle/End/Action/Title slots) | generic only | B | **[Top bar - desktop](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=64911-413329) replaces this at the desktop breakpoint** — same `EtTopbar` slot component, not a separate one, just composed with different content: Search Field + a Tag badge in the main area, Top Bar Actions (icon buttons) in the end slot, instead of mobile's back button + title + actions. `EtTopbar`'s own AGENTS.mdc doesn't yet document this desktop slot configuration — treat it as the same Tier B component, built with the desktop-appropriate children, not a new component to fabricate. **When placing this in Figma, `resize()` it to the screen's full available width (screen width minus nav width) — its imported default width won't match every screen and will leave a visible gap at the edge if left as-is.** |
| Header | `components/layout/headers` | EtSection.Title, EtChip + generic | B | Uses real subcomponents but Header itself unconfirmed. |
| Footer | `components/layout/footer` | EtPagination, EtPagination.Dot, EtCheckbox | B | Re-checked and corroborated (same specific components found independently twice) — this is real composition, not incidental example content. Footer itself still has no single dedicated Code Connect match, so stays Tier B, but with the doubt resolved. |
| Show more | `components/et-read-more-text` | EtSection.Title, EtLink (generic) | B | Plausible but not a distinct "ReadMoreText" match. |
| Default card | `components/card` | generic only | B | — |
| Bottom-sheet header | `overlays/bottom-sheet-v2/subcomponents/header` | EtLink, EtSection.Title | B | Confirmed specific (not generic) on re-check — genuinely built from these real components. |
| Botton-sheet | `overlays/bottom-sheet-v2` | generic only | B | — |
| Bottom sheet dialog header / Dialog bottom-sheet | `overlays/modal/subcomponents/header` | EtSection.Title | B | Confirmed specific on re-check for both nodes. "Dialog" ≈ Modal — **(confirm naming)**. |
| Tooltip | `overlays/tooltip` | EtSection.Title (generic, not Tooltip-specific) | B | Same component used for [Tooltip - Desktop](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=64875-77910) (3 variants: Title=Custom/No/Yes; Code Connect returned only generic `EtText`). **Desktop-only usage** — confirm whether `overlays/tooltip` already differentiates a desktop-triggered (hover) vs. mobile-triggered (tap) mode internally, or whether the desktop trigger behavior still needs building. |
| Dropdown (Desktop) | **no dedicated component** — compose from `list/list-item` or `list/list-item-v2` (row content) + `controls/checkbox` (multi-select rows) + `link` (actions) | EtIconV2, EtCheckbox, EtLink, EtText (generic mix, no single "Dropdown" match) | C | **Desktop-only** — the Figma frame is literally named ["Dropdown - Desktop only"](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63315-214740) (examples: Asset/Title/Icon/Multi-select list variants). Definition: [Dropdown](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=57683-41470) — a panel of "Slot" rows (44px each), i.e. the same small list-row pattern used on mobile, not a separate dropdown-specific component. Don't fabricate a standalone "Dropdown" component in code — compose it from the Tier A/B parts listed, and flag it as a composition (not a single reusable component) in the coverage report. |
| Skeleton | `status/skeleton` | no match | B | — |
| Tabs group | `controls/tabs` | EtText only (generic) | B | Surprising no specific match given the component is substantial. |
| Progress pagination | `navigation/pagination` (variant) | no match | B | — |
| Island | `instrument-island` | EtText only (generic) | B | — |
| Buy and sell buttons | `buy-sell-button` | EtText only (generic) | B | Component confirmed built (has full AGENTS.mdc); Code Connect not confirmed at this node — worth a direct re-check. |
| Input chip | `controls/chips` | EtIconV2, EtText (generic) | B | — |
| Choise chip | `controls/chips` | EtText only | B | — |
| Round checkbox | `controls/checkbox` (variant) | no match | B | — |
| Add checkbox | `controls/checkbox` (variant) | EtIconV2 only | B | — |
| Loader | `status/loader` | no match | B | — |
| Progress bar / Progress Bar with Label | `status/progress-bar`, `status/progress-v2` | EtText only (label) | B | — |
| Steps Progress | `status/step-indicator` | no match | B | — |
| Risk score | `status/risk-score` | EtText only (label) | B | Component exists and is substantial; worth a direct re-check. |
| Toast | `feedback/toast` | EtButton, EtText (generic) | B | Substantial real component (animations/gestures subfolders); not confirmed at this node. |
| Banner | `feedback/banner`, `feedback/alert-banner` | EtLink | B | Confirmed specific on re-check — the banner's action/link is genuinely built from `EtLink`. Still no dedicated "Banner" Code Connect match of its own. |
| System message | mapped to `feedback/alert-banner` | EtLink | B | Same confirmation as Banner (identical component mix). Naming difference — **(confirm)**. |
| Tag badge / Counter badge / Status badge | `status/badge` (variants) | EtText only or no match | B | — |
| Text input | `input/input`, `input/input-v2` | EtText only (label) | B | — |
| Password text input | `input/input` (variant) | EtIconV2, EtText | B | — |
| Code input button | `input/otp-input` | EtText only (label) | B | "Code input" ≈ OTP input — **(confirm naming)**. |
| Phone Input | `input/phone-input` | EtText only (label) | B | — |
| Search field / Search Input | `input/search-input` | generic only | B | — |
| Primary/Secondary amount input (with button) | `data-display/amount-input-display` | EtButton/EtText generic; one variant unexpectedly returned EtToggleSwitch | B | The toggle-switch match on "Secondary amount input" is likely incidental content, not real — **(confirm)**. |
| Stepper | `controls/stepper` | EtIconV2, EtButton (generic) | B | — |
| Select | `controls/select` | EtIconV2, EtText (generic) | B | — |
| Time picker | `timepicker` | EtText only (label) | B | — |
| List | `list/list` | no match | B | — |
| Table | `tables/table` | EtText only (label) | B | Substantial real component; not confirmed at this node. |
| Line charts components | `data-display/line-chart`, `multi-line-chart` | generic only | B | — |
| Break down chart | `data-display/breakdown-chart` | EtText only | B | — |
| Story / Story thumbnail / Intro | `data-display/story` | generic only (Story/Intro share one Figma node) | B | "Intro" may just be an example state of Story, not separate — **(confirm)**. |
| Post comments | part of `social/post/subcomponents` | EtIconV2, EtText (generic) | B | Not a standalone component. |
| Pinned post | `social/post` (variant) | generic only | B | — |
| FAB / Glass button | `glass-fab` | EtIconV2 (generic) | B | "FAB" and "Glass button" may be the same component or two distinct ones — **(confirm which is which)**. |
| Fab action items / Fab menu | `fab-menu` | EtIconV2, EtText (generic) | B | — |
| Clubs | `card` | EtCard | B | Part of the mobile "Side menu" page — built from the real `EtCard` component, not a dedicated Clubs component. |
| Cards carousel / Glass card footer | `list/list-item-v2` | EtListItem | B | Confirmed specific — these frames are genuinely built from `EtListItem` rows, not just example content. |
| Right side menu | `list/list-item-v2`, `layout/section`, `controls/chips` | EtListItem, EtSection.Title, EtChip | B | Confirms the desktop Right Panel (see [desktop-layout.md](desktop-layout.md)) is composed from real Tier A parts internally — but still has no single dedicated "Right Panel" Code Connect match of its own, same Tier C status as documented there for the panel as a whole. |
| Popup Footer (both instances) | `controls/checkbox` | EtCheckbox | B | Desktop popup footers genuinely include a real Checkbox component, not just example content. |
| Wizard (🛑 stopped page, node `64967:60564`) | `layout/section` | EtSection.Title | B | Even the explicitly-stopped Wizard page uses a real `EtSection.Title` — doesn't change Wizard's own Tier C status (no dedicated Wizard component anywhere), just confirms what's inside this particular frame. |
| Custom num keyboard | `status/et-range-slider`, `controls/chips` | EtRangeSlider, EtChip | B | Unexpected but confirmed — this custom numeric keyboard frame includes a real range slider and chip(s), plausibly preset-amount suggestions. Not a dedicated "keyboard" match itself; see the real `input/keyboard` and `input/numeric-keypad` components for the actual keyboard implementations. |
| Multi select list item (node `40535:243481`) | `controls/radio-group` | RadioIndicator | B | **(confirm)** — genuinely confirmed, but semantically odd: a "multi select" list item mapping to `RadioIndicator`, which normally implies single-select. Worth checking with design/eng whether this is a mislabeled variant or an intentional reuse. |

**Not found in Storybook (Tier C — do not use for code screens):**

| Component (Figma) | Code Connect | Notes |
|---|---|---|
| Empty state | EtText only | No matching folder. |
| Background | no match | No matching folder — may not be a standalone component. |
| Contextual action bar | no match | No matching folder. |
| Wizard (both instances) | no match / EtSection.Title only | No wizard folder anywhere in the library. |
| Progress wizard | generic only | Same — no wizard component exists. |
| Nav bar | EtIconV2 only | No dedicated folder; `topbar` is a different component (Top bar) — **(confirm)** whether Nav bar is meant to reuse Top bar or is genuinely missing. |
| Side menu | no match | No matching folder. **Required on every desktop page regardless of tier** — see [desktop-layout.md](desktop-layout.md)'s "Global requirement" section. Confirmed states: Collapsed 80px (default), Hover 80px, Expanded 280px. |
| Quick action | generic only | No matching folder. |
| Badge button | EtButton | No dedicated folder — may be a Badge+Button composition rather than a real standalone component — **(confirm)**. |
| Tool bar | generic only | No dedicated folder (distinct from Top bar) — **(confirm)**. |
| Window group | EtText only | No matching folder — possibly `controls/button-group`? **(confirm)**. |
| Slider | no match | Ambiguous target — possibly `status/et-range-slider` — **(confirm)**. |
| Collapsable card | EtText only | No dedicated folder — possibly `layout/accordion` or `layout/expandable` — **(confirm)**. |
| Countdown | EtText only (label) | No dedicated folder; may relate to `foundations/animated-digits` — **(confirm)**. |
| gauge/chrono | EtText only (label) | No matching folder. |
| Avatars badge | no match | No dedicated folder — composition of `social/avatar` + `status/badge`? **(confirm)**. |
| Bar charts components | EtText only | No bar-chart folder anywhere in the library. |
| Tree map | EtText only | No tree-map folder anywhere in the library. |
| Video thumbnail | generic only | No matching folder. |
| Comments input | generic only | No matching folder. |
| Answer background | no match | Likely poll subcomponent styling, not standalone. |
| Image / Add image | no match | No matching folder — likely just uses raw images, not a DS component. |
| Right side menu / Side menu Close / Dropdown list | generic only | Same status as the Left Side Menu — no dedicated Storybook component. This is the **Right Panel** family referenced in [desktop-layout.md](desktop-layout.md)'s breakpoint table (push/overlay, open/closed behavior) — the behavior is documented, but like the Left Side Menu, nothing implements it yet. |
| Popup Footer (both instances) | generic only (EtButton/EtCheckbox/EtText/EtIconV2, no dedicated footer match) | No matching folder for a desktop popup-specific footer. |
| Widget | generic only | No matching folder. |
| Alert [iOS] / Keyboard / iOS | no match | Page is explicitly "Native - iOS and Android" — these represent native OS-level UI, not something the cross-platform `etoro-ui` library would implement as its own component. Out of scope for tiering the same way as everything else; don't try to force a Storybook match. |

**Sub-components of already-tiered parents (not given their own rows):** the full-file sweep surfaced ~90 more entries that are internal variants/parts of components already tiered above, not separate design-system components — e.g. every "Charts" page sub-part (Tree map, Bar chart, Risk, Bars, Chart Legend, Breakdown, Ticker - Desktop/Mobile, etc.) belongs to the existing chart components (`data-display/line-chart`, `multi-line-chart`, `breakdown-chart`, `tile-chart`), every "Table" page sub-part (Columns, Cell header, State) belongs to `tables/table`, and most "List" page items (List start medium asset, Text and icon list item, Multi select/add list item, Divider) belong to `list/list-item-v2`. None of them returned a specific Code Connect match beyond generic foundation elements, which is consistent with them being internal composition, not standalone components — giving each its own row would fragment the registry without adding real signal.

**Custom keyboard page**: "Keyboard" (both instances) matches the real `input/keyboard` folder (Tier B); "Custom num keyboard" matches the real `input/numeric-keypad` folder (Tier B); "Swipe Right Button" has no clear Storybook match — possibly `list/swipeable-row` by name, but not confirmed — **(confirm)**.

## What's next

- Rows marked **(confirm)** above are the genuine judgment calls — flag these to the user rather than assuming an answer.
- Several Tier B rows (Buy and sell buttons, Risk score, Toast, Table) are substantial, clearly-finished components where Code Connect simply wasn't confirmed at the spreadsheet's given node — worth a direct re-check against the component's own dedicated Figma frame (not the overview node) before concluding Code Connect is really absent.
- 22 names starting with `_` were excluded from this table entirely — see [figma-component-index.md](figma-component-index.md) for that list and SKILL.md Step 2 for why.

## Full-file sweep (2026-08-31)

The Figma file has a page-naming convention — most pages are prefixed "✅ ❖" and a few "- ❖" or "🛑 ❖" (e.g. "✅ ❖ Toggle" vs. "- ❖ Side menu" vs. "🛑 ❖ Wizard"). **This does not mean built-in-Storybook vs. not** — it's very likely a Figma-side design-review status (is this design finalized), not a code-completion status. Evidence: "- ❖ Toast" and "- ❖ Banner" are both marked with the dash despite having substantial, real Storybook implementations already confirmed. Don't use the ✅/-/🛑 prefix as a tiering signal — use the actual Code Connect + Storybook-folder checks in this table instead.

This sweep covered all 184 real (non-`_`-prefixed) top-level components across all 64 pages of the file — the previous pass only covered 110 components from the spreadsheet and had not discovered the other 54 pages at all. The new Tier A confirmations and Tier C findings above come from this sweep.

**Follow-up rigorous re-check (same day):** after the Popover false-negative was caught, all 154 non-confirmed components from the sweep above were re-checked with a stricter rule — any large Code Connect result must be parsed programmatically (e.g. `python3 -c "...set(v['componentName'] for v in d.values())..."`) rather than visually scanned, since visual scanning is exactly what missed Popover the first time. This surfaced several real compositional confirmations that had previously been marked "generic only" or flagged as doubtful (Footer, Banner, System message, both Bottom-sheet/Dialog headers, Icon/Label/Badge buttons) — all now corroborated above — plus a few genuinely new findings (Clubs, Cards carousel, Right side menu, Popup Footer, Custom num keyboard). No component was found to have been *wrongly promoted* to Tier A in the original sweep — the corrections all ran in the direction of resolving doubt, not discovering new errors.
