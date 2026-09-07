# Designs based on the DS & Storybook

This is a recurring workspace for designing eToro screens and flows strictly from the real
design system — eToro's Storybook component library, Figma design files, and Figma Code
Connect mappings. Come back to this same project every time a new screen needs to be
designed, or an existing mobile Figma design needs a desktop version.

## The skill that does the real work

The `etoro-design-system` skill lives at [.claude/skills/etoro-design-system/](.claude/skills/etoro-design-system/SKILL.md)
and auto-triggers whenever you ask to design, mock up, or prototype an eToro screen. It:

1. Clarifies platform (mobile/desktop/both) and output (code, Figma frame, both, or a prototype).
2. Classifies every component into **Tier A** (Code Connect-mapped, safe everywhere), **Tier B**
   (real in Storybook, not yet Code Connect-mapped — usable but flagged), or **Tier C**
   (Figma-only or unfinished — reference only, never fabricated into code).
3. Builds the code screen from the real `etoro-ui` Storybook source, and/or the Figma frame
   by placing real, linked component instances (not flattened images or hand-drawn stand-ins).
4. Closes with a coverage report: what was Tier C, what fell back to Material Design guidance,
   and what blocks the screen from being production-ready.

It also has a real image asset pack at [.claude/skills/etoro-design-system/assets/images/](.claude/skills/etoro-design-system/assets/images/)
(catalogued in [references/assets.md](.claude/skills/etoro-design-system/references/assets.md)) — instrument/crypto
logos, onboarding illustrations, splash/logo assets, decorative shapes, avatars. Any screen that
needs a raster image should pull from there, never a fabricated placeholder.

You don't need to invoke it by name — just describe the screen you want. See the skill's own
[SKILL.md](.claude/skills/etoro-design-system/SKILL.md) for full detail (component tiers, desktop
breakpoint rules, the code+Figma workflow) rather than duplicating it here.

**Housekeeping:** `etoro-design-system skill.zip` at the project root is the original archive
the skill was extracted from — it's a redundant backup, safe to delete once you've confirmed
the extracted skill works.

## Folder structure

```
designs/
├── _template/              copy this to start any new design
│   ├── README.md
│   ├── code/
│   ├── figma/figma-links.md
│   └── coverage-report.md
└── <design-name>/
    ├── README.md            status, platform, source material, notes
    ├── code/                Storybook-based prototype code for this design
    ├── figma/figma-links.md links + notes for the live, editable Figma frame(s)
    ├── desktop/             only if this design has a desktop conversion
    │   ├── code/
    │   └── figma/figma-links.md
    └── coverage-report.md   Tier A/B/C gaps for this design
```

The actual editable Figma file always lives in Figma itself — the skill places real component
instances there via `use_figma`, so it's natively editable with no separate export step.
`figma-links.md` just records the frame URL/node ID and which components are Tier A/B, so a
future session doesn't have to re-search Figma to find the frame again.

## Starting a new design

1. Copy `designs/_template/` to `designs/<design-name>/`.
2. Ask Claude to design the screen (e.g. "design the deposit flow for mobile, code + Figma").
   The `etoro-design-system` skill takes it from there.
3. Save the resulting code into `code/`, the Figma frame link/node ID into `figma/figma-links.md`,
   and the skill's coverage report into `coverage-report.md`.
4. Fill in `README.md` with status and any decisions worth remembering next time.

## Writing real UX copy

For any headline, button, error message, empty state, tooltip, or other UI string a screen needs, use the **`etoro-content-writer`** skill (`.claude/skills/etoro-content-writer/SKILL.md`) — transcribed from eToro's real Voice & Style Guide (controlled terminology, risk/high-emotion writing rules, compliance risk tiers, localization-safety rules). Delegate to the **`content-writer`** subagent (`.claude/agents/content-writer.md`) rather than writing placeholder or generic SaaS-style copy — it will also refuse and flag anything that's actually a Compliance matter (legal disclaimers, risk warnings, T&Cs) instead of drafting it.

## Pattern-matching against real shipped screens

For "build the desktop version of X mobile screen" or "build a new mobile screen like Y," this workspace has real, shipped mobile↔desktop Figma pairs (Login, Home, Portfolio, Watchlist) catalogued in [references/screen-patterns.md](.claude/skills/etoro-design-system/references/screen-patterns.md), plus a dedicated subagent — **`etoro-screen-pattern-agent`** (`.claude/agents/etoro-screen-pattern-agent.md`) — built to compare the closest real pair (via `get_screenshot`/`get_design_context` on both nodes) and apply the same layout/component-swap pattern to the new screen, before falling back to a from-scratch build. Delegate to it with the Agent tool rather than doing the comparison inline.

## Converting an existing mobile design to desktop

1. In the design's own folder (or a new one, if this is the first time this screen is
   touched), give Claude the existing mobile Figma frame's link or node ID.
2. Ask for a desktop version. The skill already has eToro's real desktop breakpoint/grid spec
   (nav rail behavior, header height, content padding) and knows which components swap content
   at desktop width vs. get wholesale-replaced by a different Figma component — no need to
   re-explain that here, it's in [references/desktop-layout.md](.claude/skills/etoro-design-system/references/desktop-layout.md)
   and [references/figma-component-index.md](.claude/skills/etoro-design-system/references/figma-component-index.md)'s
   "Desktop replacements" table.
3. Save the output into `designs/<design-name>/desktop/` (code + figma-links.md), same pattern
   as any other design.

## A note on component tiers

Every screen built here should only ship Tier A or Tier B components in code — Tier C
components (Figma-only, or unfinished in Storybook) are reference-only until engineering
builds them. If a design needs a Tier C component, that's not a blocker to the Figma side
(Tier C still means a real, placeable Figma component) — just a blocker to the *code* side,
and it'll show up in that design's `coverage-report.md`.
