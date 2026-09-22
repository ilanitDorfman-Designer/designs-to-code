# designs-to-code

**Audience:** 🟣 design & product  ·  **Category:** frontend

Build eToro mobile/desktop screens strictly from eToro's **real** design system — the
`etoro-ui` Storybook component library, Figma design files and Code Connect mappings, and the
real Voice & Style Guide — instead of freehand mockups or placeholder copy. Every build ends
with a coverage report so gaps (missing components, fallback content) stay visible instead of
silently papered over.

This is a skill/agent **plugin only** — it ships no project content of its own. Design work
built with it belongs in its own repo (see [discover-stocks-design](https://github.com/ilanitDorfman-Designer/discover-stocks-design)
for an example), not inside this one.

## What's inside

**2 skills:**

| Skill | Does |
|-------|------|
| [`etoro-design-system`](skills/etoro-design-system/SKILL.md) | Builds mobile/desktop UI screens and prototypes from the real Storybook source and Figma files. Classifies every component into Tier A (Code Connect-mapped, safe everywhere), Tier B (real in Storybook, usable but flagged), or Tier C (Figma-only/unfinished — reference only, never fabricated into code). Closes every build with a Tier A/B/C coverage report. |
| [`etoro-content-writer`](skills/etoro-content-writer/SKILL.md) | Writes or reviews UI copy (headlines, buttons, errors, empty states, tooltips) against eToro's real Voice & Style Guide — controlled terminology, risk/high-emotion writing rules, compliance risk tiers, localization-safety rules. Refuses and flags anything that's actually a Compliance matter (legal disclaimers, risk warnings, T&Cs) instead of drafting it. |

**2 agents:**

| Agent | Does |
|-------|------|
| [`etoro-screen-pattern-agent`](agents/etoro-screen-pattern-agent.md) | Builds a desktop version of an existing mobile screen, or a new mobile screen for a domain that already has a shipped example, by studying real shipped mobile↔desktop Figma pairs (Login, Home, Portfolio, Watchlist) and applying the same layout/component-swap pattern — never designing a conversion from a blank slate. |
| [`content-writer`](agents/content-writer.md) | Delegate target for the `etoro-content-writer` skill's copy work, kept as a separate agent so copy review doesn't compete for context with the screen-building work. |

## Install

**Standalone (this repo directly, works today):**
```bash
claude plugin marketplace add ilanitDorfman-Designer/designs-to-code
claude plugin install designs-to-code@designs-to-code
```

**Cursor:** Settings → Plugins → Team Marketplaces → import `https://github.com/ilanitDorfman-Designer/designs-to-code`.

Not yet listed in [eToro's official plugin marketplace](https://github.com/eToro/etoro-official-plugin-marketplace) — that's a separate, later step (dual-manifest validation + quality eval + maintainer review).

## Usage

No setup step once installed — just describe the screen you want, e.g.:

- "Design the deposit flow for mobile, code + Figma"
- "Build a desktop version of the Watchlist mobile screen"
- "Write the empty-state copy for the Portfolio screen"

The `etoro-design-system` skill auto-triggers on any request to design, mock up, or prototype
an eToro screen; `etoro-content-writer` auto-triggers on real UI copy requests. See
[CLAUDE.md](CLAUDE.md) for the full workflow (folder conventions for a consuming project,
desktop-conversion rules, component-tier discipline).

## Limitations

- **Figma/Storybook source snapshots go stale.** The vendored `etoro-ui` Storybook source and
  Figma screen-pair links under `skills/etoro-design-system/` are point-in-time — re-verify
  against live Figma/Storybook rather than trusting them blindly on an older install.
- **Tier C components are Figma-only.** A screen that needs one gets a real, placeable Figma
  instance but no code implementation — this shows up as a blocker in that build's coverage
  report, not a silent gap.
- **Early stage (v0.1.0).** Two skills, two agents.
- **Requires a connected Figma Dev Mode MCP server.** Placing real component instances in
  Figma (the `use_figma` half of every build) depends on it — without it, only the code half
  of a build is possible.
- **Overlaps in part with `etoro-frontend`'s `figma-to-feature` skill.** Both build an eToro
  screen from a Figma design against a real component kit with a gap/tier-flagging step.
  `designs-to-code` differs by using a precomputed Tier A/B/C registry (vs. live per-build gap
  analysis), producing bidirectional Figma+code output from a bundled Storybook snapshot (vs.
  code-only, run inside the eToro-Plus monorepo), and bundling an unrelated content-writer
  skill and a mobile↔desktop pattern-matching agent that `etoro-frontend` doesn't have. If
  you're choosing between them: `figma-to-feature` for a one-off screen from inside the real
  monorepo, `designs-to-code` for a portable, repeatable design-review workflow (code + a live
  editable Figma frame + a coverage report) outside it.

_Internal eToro use only._
