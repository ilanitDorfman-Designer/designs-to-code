# Screen Patterns

This file is for reusable eToro flow/layout patterns that show up across many screens, so they don't need to be reinvented (or built inconsistently) each time.

**Desktop grid/breakpoint system and the side-by-side split-screen pattern are documented separately in [desktop-layout.md](desktop-layout.md)** — real values transcribed from Figma's own dev-spec annotations, not placeholders. Consult that file directly for any desktop screen. What follows here is for other recurring patterns (mobile nav, forms, onboarding, etc.) — still placeholder until documented.

Expected pattern types once populated: navigation (e.g., mobile tab bar vs. desktop side nav), form layout and validation conventions, onboarding flow structure, empty/error/loading states, and any other layout convention that recurs across eToro screens.

## Real screen examples: mobile ↔ desktop (ground truth for pattern-matching)

These are real, shipped eToro screens — not the "DS - React" component library file, but actual product screens built from it — captured as mobile/desktop pairs so a new screen can be built by pattern-matching against a real precedent instead of designing from a blank slate. Use these whenever asked to build a **desktop version of a mobile screen**, or **a new mobile screen** for a domain that already has an example here.

| Domain | Mobile screen (Figma) | Desktop screen (Figma) | Note |
|---|---|---|---|
| Login | [node 10282:19020](https://www.figma.com/design/cx9dfLAKx34pYhLN7DcQV3/Login-2026---Base-file?node-id=10282-19020&t=LxYhubs88d2k0aFx-1) (file `cx9dfLAKx34pYhLN7DcQV3`) | [node 136:49111](https://www.figma.com/design/m1wFSZEJXySmcXVMLlGOpv/Desktop-2026?node-id=136-49111&t=HMvvz2NP3D5NxyRp-1) (file `m1wFSZEJXySmcXVMLlGOpv`) | |
| Home | [node 8008:10693](https://www.figma.com/design/R8KcQ3xEYb6BTZqPcS3wPw/Home-2026---Base-file?node-id=8008-10693&t=AnpCvXBasOaMKLHy-1) (file `R8KcQ3xEYb6BTZqPcS3wPw`) | [node 21:6731](https://www.figma.com/design/m1wFSZEJXySmcXVMLlGOpv/Desktop-2026?node-id=21-6731&t=HMvvz2NP3D5NxyRp-1) (file `m1wFSZEJXySmcXVMLlGOpv`) | **The feed posts are missing in the desktop version — intentional, to be added later.** Don't "fix" this gap by inventing feed content when using Home as a precedent; carry the gap forward and flag it, the same as the source does. |
| Portfolio | [node 11690:17563](https://www.figma.com/design/YXeAcFz1zgdFzCZVhiBqsq/Portfolio-2026---Base-file?node-id=11690-17563&t=KqYXsxWT492gDnnZ-1) (file `YXeAcFz1zgdFzCZVhiBqsq`) | [node 21:4147](https://www.figma.com/design/m1wFSZEJXySmcXVMLlGOpv/Desktop-2026?node-id=21-4147&t=HMvvz2NP3D5NxyRp-1) (file `m1wFSZEJXySmcXVMLlGOpv`) | |
| Watchlist | [node 10687:23412](https://www.figma.com/design/bCEqWBZLcKyGODXshfdRqn/Watchlist-2026---Base-file?node-id=10687-23412&t=tFAHrQ1TGq914IU5-1) (file `bCEqWBZLcKyGODXshfdRqn`) | [Desktop-2026 file](https://www.figma.com/design/m1wFSZEJXySmcXVMLlGOpv/Desktop-2026?node-id=0-1) (file `m1wFSZEJXySmcXVMLlGOpv`) | Desktop link is to the file root, not a specific node yet — confirm the exact frame before using this pair. |

Note each mobile screen lives in its own per-domain "Base file," while all four desktop screens live together in one shared `Desktop-2026` file (`m1wFSZEJXySmcXVMLlGOpv`) — that's a real eToro file-organization convention, not an error, and it's a different Figma file from the "DS - React" component library (`cMyPhFndkPeXR6UkIuZujT`) used everywhere else in this skill.

**How to use these pairs:**
1. Pick the domain closest to the screen being built (or the one named in the request).
2. Fetch `get_screenshot` and `get_design_context` for **both** the mobile and desktop nodes of that pair — don't reason from the link/node ID alone.
3. Compare them structurally: which layout regions move where (cross-check against [desktop-layout.md](desktop-layout.md)'s breakpoint spec), which components are reused as-is, which get swapped for a desktop-specific replacement (cross-check [figma-component-index.md](figma-component-index.md)'s "Desktop replacements" table), and what content is added or intentionally dropped (like the Home gap above).
4. Apply that same transformation to the new screen — tiering every component per [component-tiers.md](component-tiers.md) and placing only real instances, per the usual rules in [workflow-code-and-figma.md](workflow-code-and-figma.md).
5. For a **new mobile screen** (not a desktop conversion): study the mobile side of the closest pair for structural/content conventions (section order, header/card patterns) as precedent — not a template to copy verbatim.

**Staleness caveat:** same as the rest of this skill — these are point-in-time links, not a live view. If a linked frame has since changed in Figma, re-fetch it rather than trusting this table blindly, and update the note column if the gap it describes (e.g. Home's missing feed posts) has since been resolved.

The `etoro-screen-pattern-agent` subagent (see the project's `agents/`) is built specifically to do this comparison-and-apply workflow — hand it a "build the desktop version of X" or "build a new mobile screen like Y" request rather than doing the comparison inline, so the pattern-matching step doesn't get skipped under time pressure.

## How to add a pattern

For each pattern, document:
1. **Name and when to use it** (e.g., "Onboarding stepper — multi-step flows with linear progress").
2. **Which components it's built from** (referencing [component-tiers.md](component-tiers.md) by name, not re-describing the components here).
3. **Platform differences**, if the pattern changes between mobile and desktop.
4. **A real example** — a link to a Figma frame or Storybook story that shows the pattern in use, so it's verifiable rather than just described.

Keep entries short and point back to `component-tiers.md` / `design-tokens.md` for anything that's already documented there — this file should describe *composition*, not restate component or token details.
