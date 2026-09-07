# Desktop Layout Guidelines

Transcribed directly from eToro's own Figma documentation — the "Desktop - Grid" page (`cMyPhFndkPeXR6UkIuZujT`, node `58181:9913`), which includes a designer-authored "Dev Specs / Responsive Summary (1920→760)" annotation. These are real, specified values, not inferred — use them as-is rather than approximating.

## The two breakpoints that matter in code

From `../storybook-source/etoro-ui/src/core/styles/breakpoints.ts`:

- `BREAKPOINT_TABLET = 768` — content columns stop stretching and become fixed-width & centered; the flip point for desktop chrome (shell, route modals, dialogs).
- `BREAKPOINT_DESKTOP = 1024` — split layouts (`EtSplitLayout`, `components/layout/split-layout`) activate: aside panes mount and the screen divides into columns.

Figma's grid documentation goes further and defines fine-grained behavior *within* the desktop range (1024px–1920px) — that detail lives below and should inform layout decisions even though the code only hard-branches at these two widths.

## Standard desktop shell anatomy

A standard eToro desktop screen is built from these zones, left to right:

1. **Left Menu (nav rail)** — icon-only rail at narrower desktop widths, wider at large widths. Can either **push** the content over (reserves its own space) or **overlay** on top of content (floats above, doesn't reserve space), depending on width — see table below. **Every desktop page must include this Left Side Menu, in its Collapsed state by default** — see the dedicated section below.
2. **Header** — spans the remaining width, fixed height per breakpoint.
3. **Main Content** — the one flexible/fill zone. This is true at every breakpoint: Main Content is what absorbs width changes; everything else is fixed or steps between fixed values.
4. **Right Panel (optional contextual aside)** — from 1920px down to 1440px it **pushes** Main Content (reserves space, defaults to **open**); from 1366px and below it **overlays** instead (floats above content, defaults to **closed**). Same push↔overlay threshold as the Left Menu.

## Global requirement: Left Side Menu on every page

[Figma: Left side menu](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59867-98373) (node `59867:98373`) has three real, confirmed states:

- **Collapsed** — 80px wide (icon rail only). **This is the default state — every desktop page must include the Left Side Menu collapsed, unless the user has explicitly expanded it.**
- **Hover** — 80px wide (collapsed rail with a hover treatment).
- **Expanded** — 280px wide (icons + labels).

**This component is Figma-only right now — it has no implementation in the Storybook library** (confirmed: no `side-menu`/`left-menu` folder anywhere in `storybook-source/etoro-ui/src/`, and it's listed as Tier C in [component-tiers.md](component-tiers.md)). That means:
- **On the Figma side**: always place the Left Side Menu (collapsed state) on every desktop frame you build — this is a hard requirement regardless of tier. **Place the real component, not a hand-drawn stand-in**: `search_design_system` for "Left side menu" (it's a connected component in the "DS - React" library), `importComponentSetByKeyAsync` the result, and instance the Collapsed variant. "No Storybook implementation" describes the *code* gap only — the real Figma component still exists and is one search call away. See [workflow-code-and-figma.md](workflow-code-and-figma.md)'s Tier C rule — this exact mistake (building a fake rail out of shapes/emoji instead of searching first) already happened once with this component.
- **On the code side**: don't fabricate a component for it. Build the rest of the screen normally and call out in the coverage report (SKILL.md Step 7) that the Left Side Menu is a required piece of this screen that doesn't exist in Storybook yet — that's exactly the kind of gap this skill exists to surface rather than paper over.

### The menu's list items (Expanded state)

The Left Side Menu's Expanded state is built from two distinct row lists, each with its own `Default` / `Hover` / `Selected` states:

- **[Side menu L list](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63603-183368)** (node `63603:183368`) — the main nav items: **Home, Watchlist, Portfolio, Discover, Social**. Code Connect found only generic `EtText` for these rows (no icon mapping) — worth confirming with design whether these rows are meant to be text-only or should also carry an icon that just isn't Code Connect-mapped yet.
- **[Side menu S list](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63603-157563)** (node `63603:157563`) — the other/secondary items (below the main nav). Code Connect found both `EtIconV2` and `EtText`, so these rows do carry an icon + label.

Neither list state maps to a dedicated Storybook row component — same Tier C status as the Left Side Menu itself. If you need to represent these rows in code before the real component exists, don't invent a "SideMenuItem" component; note the gap the same way as the menu itself, and mention which list (L or S) and which state (Default/Hover/Selected) the screen needs.

## The Right Panel has the same gap as the Left Side Menu

A full-file Code Connect sweep confirmed the **Right Panel** (the optional contextual aside described in the shell anatomy above — the "Right side menu," "Side menu Close," and "Dropdown list" components in Figma's "Desktop Components" page) has **no dedicated Storybook implementation either** — same Tier C status as the Left Side Menu. Its push/overlay and open/closed behavior per breakpoint is fully documented below, but nothing implements it yet. Treat it the same way: place the **real** Figma component (search for it, import it, instance it — same rule as the Left Side Menu above) in Figma frames as needed, and flag it as a gap in the coverage report rather than fabricating a component for it in code.

## Breakpoint-by-breakpoint reference

| Width | Left Menu | Header | Gap (Right Panel↔Content) | Right Panel | Content padding |
|---|---|---|---|---|---|
| 1920px | push (see note below on width) | 84px | 12px | OPEN (360px) · push | 44px |
| 1720px | push | 84px | 12px | OPEN (360px) · push | 44px |
| 1440px | 80px · push | 84px | 12px | OPEN (360px) · push | 40px |
| 1366px | 80px · push | 84px | 8px | CLOSED (60→360px) · overlay | 40px |
| 1280px | 72px · overlay | 84px | 8px | CLOSED (60→400px) · overlay | 36px |
| 1060px | 72px · overlay | 76px | 8px | CLOSED (60px) · overlay | 36px |
| 1024px | 72px · overlay | 76px | 8px | CLOSED (60px) · overlay | 36px |
| 760px | HIDDEN · overlay | 76px | 8px | (not shown at this width) | 24px |

Scroll happens inside the main card at every breakpoint from 1920px down to 1366px (confirmed explicitly in the source doc); behavior below that isn't specified in the transcribed section.

**Discrepancies in eToro's own Figma doc, flagged rather than silently resolved:**
- The quick-reference "Key Thresholds" summary text states Header height is "80px" for 1366px–1280px, but the detailed per-breakpoint breakdown lists 84px for both 1366px and 1280px (and for every width down to 1440px). The per-breakpoint breakdown is used above since it's the more granular, repeated source — **confirm with design which is correct** before treating either as final.
- The Left Menu width at 1920px/1720px is listed as "84px" in the summary table. Now that the Left Side Menu component's real states are confirmed (Collapsed/Hover = 80px, Expanded = 280px — see above), neither matches "84px" exactly. 80px (the real Collapsed width) is almost certainly the intended value and 84 is likely a documentation typo, but **confirm with design** before hard-coding 80px for widths ≥1720px.

## Pattern: side-by-side split screens (e.g. login/signup)

A second concrete pattern documented on the same Figma page, for auth-style screens with a form on one side and an image on the other:

- **Hard constraint**: the form content itself is a fixed ~375px wide block, centered in its side — it does not scale down. Left-side padding is a fixed 40px on every side; this is a hard minimum, not a scalable value.
- **1024px–1920px**: the screen splits exactly 50/50 — left (form) and right (image) are equal width. Verified to fit comfortably (375px content + padding within the half-width, with margin to spare) at every size in this range.
- **Below 1024px, down to 760px**: the split is no longer 50/50 — the form side becomes fixed at 455px (375px content + 40px padding × 2) and the image side takes the remainder. At exactly 760px: left = 455px, right = 305px (455 + 305 = 760).

Concrete widths at each breakpoint (left/right):

| Width | Left (form) | Right (image) |
|---|---|---|
| 1920px | 960px | 960px |
| 1720px | 860px | 860px |
| 1440px | 720px | 720px |
| 1366px | 683px | 683px |
| 1280px | 640px | 640px |
| 1060px | 530px | 530px |
| 1024px | 512px | 512px |
| 760px | 455px (fixed) | 305px |

## General padding & spacing (from real shipped screens)

Unlike everything above (transcribed from an abstract "Desktop Grid" reference page), this section comes from measuring eToro's actual initial desktop screens — **Home, Portfolio, and Watchlist** in the "Desktop 2026" file (`m1wFSZEJXySmcXVMLlGOpv`, nodes `21:6731`, `21:4147`, `21:33489`). These are real, intended production designs, not a theoretical spec — **treat them as the primary reference for how new desktop screens should look**, and treat the abstract grid page above as secondary when the two disagree (see discrepancies below).

This is page-level/layout spacing — gaps between the major zones of a screen (nav, content, panel) — not the padding *inside* a component, which belongs to that component's own definition.

### The real spacing scale

eToro's spacing is a 4px-based scale (`X1`=4px, `X2`=8px, `X3`=12px, `X4`=16px, `X6`=24px, and so on) — this is a **mobile-and-desktop-wide token system**, not desktop-specific, so the full scale now lives in [design-tokens.md](design-tokens.md)'s Spacing section rather than being duplicated here. Use those tokens for every layout gap and padding value below — every measurement in this file is a multiple of that scale.

### Structural measurements (all three screens, at 1920px)

- **Left nav**: 280px — matches the Left Side Menu's documented Expanded state exactly.
- **Top bar**: 84px tall — matches the breakpoint table above.
- **Content ↔ Right Panel gap**: 12px (`--x3`) — matches the breakpoint table's documented 1920px gap exactly.
- **No page-level wrapper padding around Main Content.** Components (e.g. the "Context area" header block) sit edge-to-edge inside the content column and bring their **own** internal padding (typically `--x4`/16px or `--x6`/24px) rather than the page wrapping content in a padding frame. Build new screens the same way — don't add an extra outer padding wrapper around a content block; let the component handle it.
- **The Right Panel is optional per screen, not universal.** It's present (open, pushing content) on Home and Portfolio — both dashboard-style screens with a persistent summary/detail panel. It's completely absent on Watchlist, a dense data-table screen that uses the full content width instead. When designing a new screen, decide whether it's "dashboard-style" (→ include the Right Panel) or "dense data" (→ drop it), rather than including it by default.

**Discrepancies versus the abstract Desktop Grid page, flagged rather than silently resolved:**
- The grid page documents "Content padding" as 44px at 1920px (implying a padding wrapper around Main Content). The real shipped screens have **no such wrapper** — components handle their own padding internally instead. Since the real screens are the intended production design, **follow the real-screens pattern (no wrapper) for new work**, and treat the abstract page's 44px figure as describing an approach that wasn't actually adopted.
- The grid page documents the Right Panel's open width as 360px at 1920px. The real screens measure **384px**. **Confirm with design which is current** — use 384px if in doubt, since it comes from shipped screens rather than a reference diagram.

## How to use this

- When building a desktop screen with a standard shell (nav + header + main content, optionally a right panel), use the breakpoint table's exact values rather than picking round numbers — except where the "General padding & spacing" section above documents a real-screen discrepancy, in which case follow the real screens.
- For general layout spacing (gaps between nav/content/panel, whether to add a wrapper padding), follow the "General padding & spacing" section — it reflects what was actually shipped, not just the reference grid.
- When building a split-screen auth/onboarding flow, use the side-by-side pattern's fixed-375px-form rule rather than making the form responsive.
- For anything at these widths not covered by either pattern, don't guess a bespoke breakpoint scheme — ask, or point back to `EtSplitLayout` and `BREAKPOINT_DESKTOP` as the only two behavior-changing constants confirmed in code.
