---
name: etoro-design-system
description: Build mobile or desktop UI/UX screens, flows, and prototypes for eToro strictly from eToro's actual design system — the Storybook component library, Figma design files, and Figma Code Connect mappings. Use this whenever someone asks to design, mock up, or prototype an eToro screen or flow, mentions "eToro design system", "eToro UI", or wants a screen built with eToro's Storybook components and/or matched to Figma — even if they don't name the skill directly. This skill exists because eToro's component coverage is uneven (not every Figma component is built in Storybook, and not every Storybook component is mapped to Figma via Code Connect), so it enforces which components are actually safe to use before generating anything.
---

# eToro Design System

Design and build eToro screens (code, Figma, or both) using only components that genuinely exist and are safe to use — never a fabricated or half-finished one. eToro's design system is currently split across three sources of different completeness:

- **Figma** — the full, canonical component library (source of truth for visual design).
- **Storybook** — a growing but incomplete subset of that library exists as real code; some of what's there is itself unfinished.
- **Figma Code Connect** — an even smaller subset is formally mapped Figma ↔ code, guaranteeing the two stay in sync.

Because of that gap, the core discipline of this skill is classifying every component you're about to use into a tier *before* you use it, and being upfront in the output about what tier it came from. This keeps designers from unknowingly shipping a screen that references a component that isn't actually production-ready.

## Step 0: Auto-resync storybook-source before relying on it

Do this **at the start of every session that uses this skill, automatically — don't wait to be asked.** `storybook-source/` is a copy, not a live view, and the user wants it kept current rather than manually refreshed on request.

1. Check whether a local `eToro-Plus` clone exists on disk (e.g. `~/Documents/Github/eToro-Plus` — confirm the actual path if it's moved). **If it doesn't exist**, check whether `gh` is authenticated (`gh auth status`) with access to `github.com/eToro/eToro-Plus`. If so, clone it fresh (`gh repo clone eToro/eToro-Plus <path>`) and continue to step 3 below as if it had always been there. If `gh` isn't authenticated either, skip this step silently and proceed with the bundled `storybook-source/` as-is — don't block the build on it, and say plainly that the source may be stale.
2. If it exists, `cd` into it and run `git fetch` (not a blind `pull` yet) to see if `origin/main` has moved. If local `main` is already even with `origin/main` **and** the bundled `storybook-source/` was already resynced at that same commit, skip the rest — nothing to do.
3. Otherwise follow [workflow-code-and-figma.md](references/workflow-code-and-figma.md#resyncing-storybook-source-from-etoro-plus) exactly: `git status` first (never discard uncommitted local changes — if a fast-forward pull would conflict with them, stop and tell the user instead of resolving it yourself), `git pull`, then replace `storybook-source/etoro-ui/` and `storybook-source/rnstorybook-stories/` wholesale from the refreshed clone.
4. Note the new resync date and commit in [component-tiers.md](references/component-tiers.md)'s header, and diff the top-level `src/` folders against what's already tiered — flag any genuinely new category as unverified (not Tier A/B by default) rather than assuming it's safe, per that file's existing convention.
5. This refreshes *source code* only — it does not re-verify any row's Tier/Code Connect status against Figma. Say so plainly if a resync happened, so the user knows the underlying code is current but tiers weren't necessarily re-checked.

## Step 1: Clarify platform and output

Work out, from the request or by asking:
- **Platform(s)**: mobile, desktop, or both.
- **Output mode**: a code screen, a Figma frame, both in parallel, or a prototype (linked, interactive Figma frames).

If the user just says "design a screen for X," default to producing both a code screen and a matching Figma frame — that's the main value of this skill — unless they clearly only want one.

For a **desktop** screen, read [references/desktop-layout.md](references/desktop-layout.md) before building — it has eToro's real breakpoint-by-breakpoint grid spec (nav rail push/overlay behavior, header height, content padding, right-panel behavior) transcribed from Figma's own documentation, plus a separate side-by-side split pattern for auth-style screens. Use those exact values rather than picking round numbers.

If the request is a **desktop conversion of an existing mobile screen**, or **a new mobile screen for a domain that already has a shipped example** (Login, Home, Portfolio, Watchlist today), don't design from a blank slate — [references/screen-patterns.md](references/screen-patterns.md) has real mobile↔desktop screen pairs to pattern-match against first. Prefer delegating this to the `etoro-screen-pattern-agent` subagent (`.claude/agents/etoro-screen-pattern-agent.md`), which is built specifically to compare the pair and apply the derived pattern, rather than skipping straight to building.

## Step 2: Classify every component you plan to use

Look up each component the screen needs in [references/component-tiers.md](references/component-tiers.md), which is the registry of what actually exists and where. Classify each into exactly one tier:

| Tier | What it means | Use in code? | Use in Figma? |
|---|---|---|---|
| **A** | Code Connect-mapped — Figma and Storybook are guaranteed to match | Yes, freely | Yes, freely |
| **B** | Finished in Storybook, but not yet Code Connect-mapped | Yes, but flag it (see below) | Yes, via direct Figma lookup — not Code Connect |
| **C** | Figma-only, or partial/unfinished in Storybook | **No** | Reference only, flagged as not ready |

Why this matters: Tier B components are real and usable, but because they aren't Code Connect-mapped, Claude has to look them up in Figma directly rather than relying on the automatic mapping — and a human should double check the mapping is right. Tier C components don't have a trustworthy code implementation yet, so generating code against them would produce something that looks plausible but isn't real — worse than saying "not available yet."

If [references/component-tiers.md](references/component-tiers.md) doesn't yet have the Figma key / Code Connect status for a component you need, say so plainly rather than guessing at its tier — the real `etoro-ui` source tells you a component exists, but not whether it's Code Connect-mapped.

**The registry is a cache, not a live view.** It only reflects what was true as of its "Last full verification" date — nothing watches Figma or Storybook for changes. Trust a cached row for routine, exploratory work. Re-verify it live (`get_code_connect_map`, or the real Storybook source) instead of trusting the cache when: the row is already flagged **(confirm)**, the user says something changed recently in Figma/Storybook, or the screen being built is high-stakes/production-facing rather than a mockup.

**Some components are desktop-only** (e.g. the Desktop Dropdown, the Desktop Tooltip) — their Figma frames are explicitly named "... - Desktop only" or documented as such in `component-tiers.md`'s Notes column. Never place one of these on a mobile screen; check the platform flag alongside the tier before using any component on a page narrower than `BREAKPOINT_DESKTOP` (see [desktop-layout.md](references/desktop-layout.md)).

**Some components swap content at the desktop breakpoint instead of being replaced outright** — the Top Bar is the example: at desktop width the *same* `EtTopbar` slot component is used, just filled with different slot content (Search Field + Tag badge + Actions) instead of mobile's title/back-button/actions. Don't fabricate a separate "desktop top bar" component for these — build the same underlying component with desktop-appropriate children, gated on the breakpoint.

**Other components are wholesale replaced by a genuinely different Figma component at desktop width** — not a content swap on the same component, a different component entirely (e.g. Tooltip and Side menu each have a distinct desktop-specific Figma node). [figma-component-index.md](references/figma-component-index.md)'s "Desktop replacements" table is the authoritative list of which components have this split and what replaces what — check it before assuming a component looks the same on desktop as on mobile.

To find what's available, start with [storybook-source/etoro-ui/ui-kit.ui.md](storybook-source/etoro-ui/ui-kit.ui.md), the master index of every component and its import name, and [references/figma-component-index.md](references/figma-component-index.md), the master list of every component in the "DS - React" Figma file with its node ID.

**Ignore any Figma component whose name starts with `_`** (e.g. `_Tab`, `_Header content`, `_Toggle group button`). That underscore is eToro's own convention marking it as an internal atom/subcomponent used *inside* another component's build — not a standalone component a designer would place directly. For example, `_Tab` is just the individual button used inside `Tabs group`; it isn't a component in its own right, and often won't exist as its own entry in Storybook (it's part of the parent component's implementation, not a separate one). Tier and use the parent component instead; don't add a separate registry row for the underscore-prefixed atom. [references/figma-component-index.md](references/figma-component-index.md) lists these separately with their likely parent for reference.

## Step 3: Check whether each component is actually the right design choice

Tiering (Step 2) tells you whether a component is *safe to use*. It doesn't tell you whether it's the *right one for this situation* — that's a design decision, and it needs design-intent guidance, not just a prop API. Check, in this order, for each component you're about to place:

1. **[component-docs/](component-docs/)** — eToro's own design documentation, one file per component area (e.g. `component-docs/Buttons.md` covers Button, FAB, FAB Menu, FAB Action Items together). This has real "when to use," "do/avoid," and states guidance written for eToro's system specifically — always prefer this when it exists. Match loosely: a doc file may cover several related components under one page, so check filenames near the component's name/category, not just an exact match.
2. **The component's own AGENTS.md/AGENTS.mdc** — has some design-adjacent signal (e.g. "does NOT handle X, use Y instead") even though it's mainly a code contract. Useful as a secondary check, not a replacement for #1.
3. **[Material Design 3 guidelines](https://m3.material.io/components)** — only when neither of the above has anything for this component. General UX conventions (when a pattern like this is typically appropriate, common pitfalls) are better than no guidance at all, but Material Design is Google's system, not eToro's — it can inform *when* a component-shaped-thing is the right idea, never *how it should look* (colors, spacing, typography always come from eToro's own [design-tokens.md](references/design-tokens.md) and the real component, never from Material's visuals).

Whenever you fall back to Material Design for a component, say so explicitly in the coverage report (Step 7) — e.g. "no eToro design guidance found for Empty State; used general Material Design conventions for when to show one." This keeps the gap visible so eToro's own documentation can be filled in over time, rather than the fallback silently looking like real eToro guidance.

## Step 4: Build the code screen (if requested)

Use the real component source under `storybook-source/etoro-ui/src/components/<name>/` (or `src/foundations/<name>/` for primitives like `EtText`, `EtIconV2`) for each Tier A/B component — read the `.tsx` file directly for the actual prop contract, and its `AGENTS.md`/`AGENTS.mdc` file (most components have one) for purpose, usage guidance, and explicit "does NOT handle" notes. Cross-check against the matching story in `storybook-source/rnstorybook-stories/components/<name>/` (or `.../foundations/<name>/`) to see real prop combinations in use. Don't invent props or variants that aren't in the actual source — if you're unsure how a component is meant to be used, say so and ask, rather than guessing at an API.

For every Tier B component used in the code, add an inline comment or note marking it as "not yet Code Connect-mapped."

**Colors and icons: V2 only, never V1.** The library still contains older V1 color primitives and a legacy `EtoroIcon` component alongside the current V2 ones — they exist in the source but must never be used in generated code. Always use `colors/tokens/v2/` (see [design-tokens.md](references/design-tokens.md)) and always use `EtIconV2` for icons, never `EtoroIcon`. If a component you're building on top of internally still references the V1 versions, that's an existing-code detail to leave alone — it doesn't license using V1 in the *new* screen you're generating.

**Tokens only, never a bare primitive.** `colors/primitives/v2/` is the raw palette that semantic tokens (`colors/tokens/v2/`) are built from — it's not something generated code should reference on its own. A primitive is just a color with no light/dark-mode or semantic meaning attached; a token is a primitive wrapped with that meaning (e.g. "positive," "primary," "surface"). Reach for a token every time; if you can't find a token that fits what you need, say so and ask rather than dropping down to a primitive directly.

**Images: use the real asset pack, never a placeholder.** Whenever a screen needs a raster image — an instrument/crypto logo, an onboarding illustration, a splash/logo asset, a decorative background shape, or a placeholder avatar — pull it from [assets/images/](assets/images/) (catalogued in [references/assets.md](references/assets.md)). Same discipline as never hand-drawing a stand-in for a real component: don't fabricate a placeholder image, source a random stock photo, or use an emoji where a real shipped asset exists. If a screen genuinely needs an image that isn't in the pack, say so in the coverage report (Step 7) rather than inventing one.

## Step 5: Build the Figma frame (if requested)

Follow [references/workflow-code-and-figma.md](references/workflow-code-and-figma.md) for the concrete steps. In short: Tier A components can be placed via their Code Connect mapping; Tier B components need to be located directly in the Figma file (by name/key) since there's no automatic mapping to lean on.

**Only place components from the "DS - React" library** (fileKey `cMyPhFndkPeXR6UkIuZujT` — see [references/figma-component-index.md](references/figma-component-index.md) for the library key and verified componentKeys). Any Figma workspace can have other, unrelated libraries enabled with confusingly similar names (e.g. "eToros Design System (Desktop only)") — always scope `search_design_system` to this library and check `libraryName` on every result before importing. Never hand-draw a stand-in (shapes, emoji, placeholder icons) when a real DS - React component exists — see `workflow-code-and-figma.md`'s hard constraint for the full rule.

Pull colors, spacing, and typography from [references/design-tokens.md](references/design-tokens.md) rather than guessing values, so the Figma frame and the code screen actually agree. For any raster imagery the frame needs (logos, illustrations, decorative shapes, avatars), upload/place the real files from [assets/images/](assets/images/) (see [references/assets.md](references/assets.md)) rather than drawing a stand-in.

## Step 6: Prototype (if requested)

Prototyping (wiring interactions between frames) depends on what the connected Figma MCP tools actually support at the time — check `references/workflow-code-and-figma.md`'s "Known limitations" section first. Automate what you can; for anything that can't be done through the tools, give the designer clear manual steps to finish it in Figma.

## Step 7: Always close with a coverage report

Tier A/B usage is already visible in the code itself (Tier B components carry their inline `// Tier B: ...` comment from Step 4) — don't repeat that in the summary. The coverage report exists specifically to surface what the code *can't* show on its own: gaps.

End every screen you produce with a short, plain summary covering only:
- Any requested component that turned out to be Tier C — it wasn't used (or was only referenced as a placeholder) — and why.
- Any component where you fell back to Material Design guidance (Step 3) instead of eToro's own documentation.
- Anything that blocks the screen from being fully production-ready (e.g., "the Filter Chip component is Figma-only — engineering needs to build it in Storybook before this screen can ship in code").

If nothing was blocked (no Tier C components involved), a one-line "no gaps — all components used are Tier A/B" is enough; don't pad the report by re-listing components that already have their tier marked in the code.

This report is what lets a designer act on the result immediately instead of discovering gaps later, and it's the main way this skill stays honest about eToro's real, uneven component coverage instead of papering over it.

## Reference files

- [references/component-tiers.md](references/component-tiers.md) — the tiering registry (Figma key, Storybook status, Code Connect status, tier). Points to real source rather than duplicating it; still needs Figma key/Code Connect data filled in per component.
- [references/figma-component-index.md](references/figma-component-index.md) — the master list of every component in the Figma file with its node ID, split into real components vs. internal atoms (names starting with `_`).
- [references/design-tokens.md](references/design-tokens.md) — pointers to the real colors/spacing/typography/breakpoints source files.
- [references/typography.md](references/typography.md) — the full type scale with real font family names (use "eToro"/"eToro Variable", never Figma's outdated "eToro 0.7" labels) and flagged inconsistencies in Figma's own type documentation.
- [references/workflow-code-and-figma.md](references/workflow-code-and-figma.md) — the concrete tool-by-tool steps for producing matching code + Figma output, known prototyping limitations, and how to resync `storybook-source/` from a local `eToro-Plus` clone when it's available.
- [references/screen-patterns.md](references/screen-patterns.md) — reusable eToro flow/layout patterns (nav, forms, onboarding, etc.), filled in over time; now includes real mobile↔desktop screen example pairs (Login, Home, Portfolio, Watchlist) for pattern-matching new desktop conversions or new mobile screens.
- [storybook-source/etoro-ui/](storybook-source/etoro-ui/) — the real `etoro-ui` component library source, extracted from the eToro app repo. `ui-kit.ui.md` at its root is the master component index.
- [storybook-source/rnstorybook-stories/](storybook-source/rnstorybook-stories/) — the real Storybook story files, showing components with actual prop combinations.
- [component-docs/](component-docs/) — eToro's own design documentation (when to use, do/avoid, states), one file per component area. Partial coverage today — when a component has nothing here, fall back per Step 3.
- [references/desktop-layout.md](references/desktop-layout.md) — eToro's real desktop breakpoint/grid system and the side-by-side split-screen pattern, transcribed from Figma's own dev-spec annotations.
- [references/assets.md](references/assets.md) — catalogue of the real image asset pack under [assets/images/](assets/images/) (logos, onboarding illustrations, splash/logo, decorative shapes, avatars) — use these instead of fabricating placeholder imagery.
