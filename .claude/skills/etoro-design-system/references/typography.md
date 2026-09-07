# Typography

Transcribed from eToro's Figma "Text styles" documentation page (`cMyPhFndkPeXR6UkIuZujT`, node `34250:770164` — [Typography - Text styles](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34250-770164)), cross-checked against the real font files in `eToro Version 1 (1).zip`.

A separate **Typography - Text num styles** page (node `49755:25893` — [link](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49755-25893)) documents the figures-tuned "Numbers" cut used for tabular/numeric display (see the `eToro Mono` and "Numbers" cut notes below) — not yet transcribed into the scale below; check that page directly if a screen's numeric display needs its exact spec rather than the proportional scale's approximation.

## Font families — use "eToro", not "eToro 0.7"

Figma's Text styles page labels every style with a font family called **"eToro 0.7"** or **"eToro Variable 0.7"**. Don't use those names — `"0.7"` is a stale version tag from an older font release. The real, current font package ("eToro Version 1") ships the same families under their proper names, with no version number in the family name itself (confirmed directly from the font files' internal name tables, not just the filenames):

| Figma's label (outdated) | Real family name to use |
|---|---|
| `eToro 0.7` | **`eToro`** |
| `eToro Variable 0.7` | **`eToro Variable`** |

Everywhere below, "eToro" / "eToro Variable" already reflects this correction — treat any further reference to "eToro 0.7" (in Figma, in old code, in older docs) as meaning today's plain "eToro".

### `eToro` (static, per-weight files)

Individual weight files — use these when you need one specific weight and variable font support isn't available:

Light, Regular, Medium, Semibold, Bold, Extrabold, Black — plus **Condensed** and **Compressed** width variants of Light/Regular/Bold/Black, and a dedicated **Numbers** cut for tabular figures. Available as `.ttf`, `.otf`, and `.woff2` (web).

### `eToro Variable`

A single variable font file covering two axes — `wght` (300–900) and `wdth` (Compressed 50 / Condensed 75 / Normal 100) — with named instances: Light, Regular, Medium, Semibold, Bold, Extrabold, Black (at Normal width), each also available at Condensed and Compressed widths, plus a special **Numbers** instance (`wght 620`, `wdth 92`) tuned for figures. Prefer this over the static family when the platform/build supports variable fonts, since it's one file instead of many.

### `eToro Mono`

A separate monospace family, weights Light through Extrabold (Regular, Medium, Semibold, Bold, Black, Extrabold). Used for tabular/numeric or code-like display contexts — not covered by the Text styles page transcribed below, which only documents the two proportional families.

## Text style scale

Every style eToro's Figma file defines, with the corrected family name, real size/line-height/letter-spacing values, and the designer's own "when to use" guidance.

| Style | Family | Weight | Size | Line height | Letter spacing | When to use |
|---|---|---|---|---|---|---|
| Display / Hero | eToro | Bold | 32 | 40 | -0.25 | Hero text or prominent page titles (onboarding, splash, marketing headers). One or two lines max. |
| Display / Main | eToro | Bold | 28 | 32 | -0.25 | Primary screen or page titles. Top-level headers or sections introducing key content. |
| Display / Compact | eToro | Bold | 24 | 30 | -0.25 | **Not documented in Figma** — the "when to use" field is literally left as `???` in the source. Flag this to design rather than guessing. |
| Heading / Large | eToro Variable | Semibold | 22 | 28 | -0.25 | Section titles and major headings within pages. Strong hierarchy under display text. |
| Heading / Base | eToro Variable | Regular | 20 | 26 | 0 | Sub-headings or component titles in cards, lists, or dialogs. |
| Heading / Compact | eToro Variable | Medium | 18 | 24 | 0 | Smaller headers in dense layouts (widgets, secondary panels). Space-efficient but legible. |
| Body / Base / Regular | eToro | Regular | 16 | 22 | 0 | Default paragraph or body text. Long blocks or general content. |
| Body / Base / Medium | eToro Variable | Medium | 16 | 22 | 0 | Slightly emphasized text within body copy — key phrases, short emphasis, no bold weight. |
| Body / Base / Semi-bold | eToro Variable | Semibold | 16 | 22 | 0 | High-emphasis body text for short sentences, key facts, or UI copy needing subtle prominence. |
| Body / Secondary / Regular | eToro Variable | Regular | 14 | 18 | 0 | Supporting/descriptive text — subtitles, helper messages, secondary content. |
| Body / Secondary / Medium | eToro Variable | Medium | 14 | 18–20* | 0 | Stronger secondary copy for sublabels, short info lines, or metadata that must stay visible but not dominant. |
| Body / Secondary / Semi-bold | eToro Variable | Semibold | 14 | 20 | 0 | Important secondary information — short labels, statuses, headings needing clear emphasis in smaller text. |
| Body / Tiny / Regular | eToro Variable | Regular | 12 | 16 | 0.25 | Micro text for timestamps, captions, small annotations. Keep short and high-contrast. |
| Body / Tiny / Medium | eToro Variable | Medium | 12 | 16 | 0.25 | Slightly stronger micro text for labels/small UI elements where extra weight improves clarity. |
| Label / Primary / Regular | eToro Variable | Regular | 16 | 20 | 0 | Form labels or inactive buttons. Functional text, neutral emphasis. |
| Label / Primary / Semi-bold | eToro Variable | Semibold | 16 | 20 | 0 | Primary action text — buttons, tabs, key CTAs. Balanced clarity and strength. |
| Label / Primary / Bold | eToro | Bold | 16 | 20 | 0 | High-emphasis action text — confirmation/submission buttons. Use sparingly. |
| Label / Secondary / Regular | eToro | Regular | 14 | 20 | 0 | Form labels or inactive buttons (secondary scale). |
| Label / Secondary / Semi-bold | eToro **(Numbers cut)** | — | 14 | 20 | 0.15 | Primary action text for buttons/tabs/CTAs (per the "when to use" copy) — **but the actual style uses the "Numbers" cut** (a figures-tuned variant, `wght 620`/`wdth 92`), not a real Semibold weight. Likely a authoring mistake in the source file — confirm with design before using this style as-is. |
| Label / Secondary / Bold | eToro | Bold | 14 | 20 | 0.15 | High-emphasis action text — confirmation/submission buttons. |
| Label / Tertiary / Regular | eToro Variable | Regular | 12 | 16 | 0.25 | Tag/chip labels, smaller UI text where readability matters more than hierarchy. |
| Label / Tertiary / Semi-bold | eToro Variable | Semibold | 12 | 16 | 0.25 | Active/selected tags and filters — visual distinction in compact UI. |
| Label / Tertiary / Bold | eToro | Bold | 12 | 16 | 0.25 | Accent tags or important indicators — short, strong labels like "NEW" or "LIVE". |
| Caption / Regular | eToro Variable | Regular | 10 | 14 | 0.25 | Legal text, timestamps, or footnotes. |
| Caption / Medium | eToro Variable | Medium | 10 | 14 | 0.25 | (Not separately documented — treat as the Medium-weight counterpart of Caption/Regular.) |
| Caption / Semi-bold | eToro Variable | Semibold | 10 | 14 | 0.25 | **The Figma frame for this style is itself mislabeled "Caption / Medium"** (a duplicate of the row above) instead of "Caption / Semi-bold" — confirmed against the page's own style-name metadata, which does list a distinct Semibold caption style. Confirm with design which content (regular Medium, or a real Semibold example) belongs here. |

\* *Body / Secondary / Medium: the visible spec label under this style reads "Line: 18", but the page's own style metadata records line-height 20 for this same style. Flagged rather than resolved — confirm which is correct with design.*

## Known issues in the Figma source (flagged, not silently fixed)

This page has a few internal inconsistencies, called out above and summarized here so they don't get lost:

1. **Display / Compact** has no "when to use" guidance at all — the field is literally `???`.
2. **Label / Secondary / Semi-bold** renders with the font's "Numbers" cut instead of an actual Semibold weight — very likely a copy-paste mistake when the style was created, not an intentional choice.
3. The last **Caption** style is named "Caption / Medium" in the frame itself, duplicating the row above it, even though the page's structured style list separately defines a "Caption / Semi-bold" style that this frame should presumably represent.
4. **Body / Secondary / Medium** has conflicting line-height values (18 in the visible spec label vs. 20 in the underlying style metadata).

None of these were resolved by guessing — they're real gaps/conflicts in eToro's own documentation and should go back to design for a decision.

## Cross-reference to code

`storybook-source/etoro-ui/src/foundations/text/utils/variant-config.ts` and `font-mapping.ts` are the code-side equivalents of this scale — read those for the actual `EtText` variant API. Note that the Storybook source currently bundles the **old** font files (`eToro0.7-*.ttf` under `foundations/text/assets/fonts/`), not the Version 1 package this document is based on — that's an engineering gap to flag if a screen depends on the corrected family name actually being loaded at runtime, not just referenced in this doc.
