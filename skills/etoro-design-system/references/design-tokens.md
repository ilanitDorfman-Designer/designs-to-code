# Design Tokens

The real token source now lives in the extracted Storybook library at [../storybook-source/etoro-ui/src/core/styles/](../storybook-source/etoro-ui/src/core/styles/) — read these files directly rather than hardcoding values, so a generated code screen and its matching Figma frame pull from the same source of truth.

## Colors

- `../storybook-source/etoro-ui/src/core/styles/colors.ts` — top-level entry point
- `../storybook-source/etoro-ui/src/core/styles/colors/primitives/v2/` — the raw palette. This is a *building block* for tokens, not something generated code should reference directly — see the rule below. Figma: [Colors - Primitives](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=55799-86269), node `55799:86269`.
- `../storybook-source/etoro-ui/src/core/styles/colors/tokens/v2/` — semantic tokens (accent, carbon, primary, risk-level, surface, verdict), each built on top of the V2 primitives. **Use only these tokens in generated code — never a primitive on its own.** A primitive (e.g. a raw green hex) carries no light/dark-mode or semantic meaning by itself; a token (e.g. a "positive" or "primary" token) wraps a primitive with that meaning. Using a bare primitive is exactly how a screen ends up looking right in one theme and wrong in the other. The unversioned `tokens/background/` and `tokens/text/` folders predate the V2 system — treat them the same as V1 primitives (don't use) unless a specific token has no V2 equivalent, in which case flag it rather than silently falling back to a primitive. Figma: [Colors - Tokens](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=55799-86392), node `55799:86392`.

## Icons

Use **`EtIconV2`** (`../storybook-source/etoro-ui/src/components/et-icon-v2/`) only. The library still contains a legacy icon component (`EtoroIcon`, listed as "Legacy icon component" in [ui-kit.ui.md](../storybook-source/etoro-ui/ui-kit.ui.md)) — never use it in generated code, even if you find it referenced internally by other components (e.g. as an underlying dependency of older subcomponents). The same V1→V2 rule applies to icons as it does to colors: the old version still exists in the source, but that's not permission to use it.

Figma: [Icons - Line icons](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=54290-67827), node `54290:67827`; [Icons - Fill icons](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=55478-305066), node `55478:305066`.

## Spacing

A single 4px-based scale, used for both mobile and desktop — confirmed identical between the real code (`../storybook-source/etoro-ui/src/core/styles/spacing.ts`) and the real Figma variables (screenshotted directly from Figma's variable panel), so there's no code/design drift here. Always build spacing from these tokens (`X1`, `X2`, etc.) — never a raw pixel number. Figma: [Spacing](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=65377-253455), node `65377:253455`.

| Token | Value | Token | Value | Token | Value | Token | Value |
|---|---|---|---|---|---|---|---|
| `HALF` | 2px | `X8` | 32px | `X15` | 60px | `X22` | 88px |
| `X1` | 4px | `X9` | 36px | `X16` | 64px | `X23` | 92px |
| `X2` | 8px | `X10` | 40px | `X17` | 68px | `X24` | 96px |
| `X3` | 12px | `X11` | 44px | `X18` | 72px | `X25` | 100px |
| `X4` | 16px | `X12` | 48px | `X19` | 76px | `X26` | 104px |
| `X5` | 20px | `X13` | 52px | `X20` | 80px | `X27` | 108px |
| `X6` | 24px | `X14` | 56px | `X21` | 84px | `X28` | 112px |
| `X7` | 28px | | | | | | |

`HALF` (2px) is for fine-tuned alignment only, not general layout spacing. Two more constants exist for specific one-off UI elements, not general spacing — `HANDLE_WIDTH` (15px, a drag-handle bar) and `HALO_HEIGHT` (200px, a halo image) — don't reuse these for unrelated layout gaps.

## Typography

See [typography.md](typography.md) for the full type scale, real font family names, and known inconsistencies in Figma's own documentation — transcribed and cross-checked against the actual font files, not just Figma's (outdated) labels. Build text in generated screens through `EtText` variants (`../storybook-source/etoro-ui/src/foundations/text/et-text.tsx`, config at `.../utils/variant-config.ts`) rather than raw font styles.

## Breakpoints (mobile vs desktop)

`../storybook-source/etoro-ui/src/core/styles/breakpoints.ts`

## Effects (shadows, elevation) — not yet documented

The source spreadsheet lists an "Effects" section alongside Colors/Icons/Spacing/Typography, but its Figma link hasn't been filled in yet — so there's no shadow/elevation token reference here or in the real code source. If a screen needs a shadow/elevation value, say so rather than guessing a box-shadow, and flag it as a gap; add the Figma link here once it's available.

## Cross-checking against Figma

This code is the source of truth for *values*, but it hasn't been cross-checked against the live Figma variables yet. Now that the node IDs above are known, use `get_variable_defs` against each one to confirm these token files actually match what's published in Figma — if they've drifted, flag the mismatch rather than silently picking one side.
