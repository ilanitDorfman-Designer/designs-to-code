---
name: etoro-content-writer
description: Write, review, or edit any user-facing eToro UI copy — headlines, body text, buttons, field labels, placeholders, error messages, empty states, tooltips, notifications, or terminology — strictly against eToro's real Voice & Style Guide. Use this whenever someone asks to write copy for an eToro screen, review/fix existing copy, check terminology, or asks "does this sound like eToro" — even if they don't name the guide directly. This skill exists because eToro operates in a regulated, high-emotion financial context where word choice carries legal and trust risk, and because the guide defines a controlled vocabulary (not suggestions) that generated copy must not silently drift from.
---

# eToro Content Writer

Write and review eToro product copy strictly from the real Voice & Style Guide — never from a generic "good UX writing" instinct. The guide (`source/style-guide-standalone.html`, transcribed into the reference files below) is eToro's actual source of truth, used to build the Figma UX Writing Agent plugin — treat it with the same discipline the `etoro-design-system` skill applies to components: nothing fabricated, every non-obvious choice traceable back to a real rule.

## Step 1: Identify what's being written

Figure out the component type first — the rule set is different for a headline than for an error message. Check [references/ui-components.md](references/ui-components.md) for the specific type: Headline, Body text, Button, Field label, Placeholder, Error (general / validation / system / transaction failure), Empty state, Tooltip / info modal, or Notification. Each has its own case rules, length limits, punctuation rules, and a do/don't table — use them, don't improvise a style that merely sounds plausible.

If the copy is for a **screen also being built with the `etoro-design-system` skill**, the string still has to fit the real component's actual constraints (character limits implied by the component's layout, whether it supports two lines, etc.) — cross-check the component in that skill's `component-tiers.md` / `component-docs/`, don't write copy in a vacuum assuming infinite space.

## Step 2: Terminology check — always, no exceptions

Before finalizing any copy, check [references/terminology.md](references/terminology.md). **This is a controlled vocabulary, not a glossary** — only the terms defined there are allowed; synonyms are not permitted unless explicitly approved, even ones that sound perfectly natural. This step is not optional or context-dependent — run it on every piece of copy, including one-word labels.

Pay special attention to the **contextual distinctions** (Trade vs Order vs Position, Buy vs Long, Sell vs Short, Asset vs Instrument, Trade vs Invest, Copy vs Follow) — these are the easiest to get subtly wrong because the words are all individually reasonable, just not interchangeable here.

Also check [references/terminology.md](references/terminology.md)'s "Words to Avoid" section on every piece of copy — gambling/gaming language, guaranteed/risk-free language, hype and exaggerated success language, passive income claims, urgency/pressure language, and over-simplification of complexity are never acceptable, regardless of how the request is phrased.

## Step 3: Check for risk / high-emotion context

If the copy touches financial risk, losses, margin, liquidation, payment failure, verification rejection, or account restriction, stop and read [references/writing-for-risk.md](references/writing-for-risk.md) in full before writing anything. High-emotion copy follows a mandatory structural pattern — **Acknowledge → State clearly → Explain next step → Offer control** — and a strict list of things to never do (no exclamation marks, no "Don't worry," no dramatic framing, no urgency beyond a real compliance/system constraint). This is not the place to apply brand personality — it's the place for precision.

## Step 4: Compliance risk check

Before finalizing, classify the copy against [references/compliance.md](references/compliance.md)'s risk tiers:
- **Low risk** (microcopy, tone/clarity fixes, plain-language rewrites with no meaning change, educational content) — no escalation needed.
- **Medium risk** (risk/fee/condition language, CFDs/leverage, onboarding/KYC/deposits/withdrawals, performance language, testimonials, jurisdiction-specific content) — draft it, but flag to the user that it needs Compliance review before shipping.
- **High risk** (legal disclaimers, risk warnings/consent language, privacy policy/T&Cs, fee disclosures) — **do not write or modify this yourself.** Say so plainly and point to Compliance, the same way the `etoro-design-system` skill refuses to fabricate a Tier C component into code.

## Step 5: Formatting and mechanics

Apply [references/formatting-mechanics.md](references/formatting-mechanics.md) — capitalization (sentence case by default; Title Case only for H1/nav titles/buttons; no ALL CAPS without UX writer approval), numbers (%, currency, large-number, timeframe, and rounding conventions), dates/time (locale-based, with an unambiguous fallback and explicit timezone for market times), and punctuation (no exclamation marks, no emoji, no ellipses, minimal and functional).

## Step 6: Localization-safety check

If the copy is source-of-truth English (which almost all product copy is, since eToro's localization pipeline runs off it), check it against [references/localization.md](references/localization.md): no idioms, wordplay, or culturally specific references; simple sentence structures; no string concatenation that depends on English grammar; design for ~30% text expansion; US English spelling only.

## Step 7: Voice and tone gate

Before calling copy final, re-read it against [references/voice-and-principles.md](references/voice-and-principles.md)'s five questions: Is it immediately clear? Can it be shorter? Does it match our terminology? Does it guide the user forward? Does it sound human but professional? **If the answer to any of these is no, revise.** Remember tone shifts by context (encouraging for onboarding, neutral/precise for risk and errors) but voice — the "Friendly Expert" — never does.

## Known gap in the source guide

The source guide's top-level sections are numbered 1, 2, 3, 4, 5, 6, 7, 9, 10 — **there is no section 8.** This is a real gap in eToro's own document (not a transcription error here); flag it rather than silently renumbering if it becomes relevant, and don't guess at what a missing section 8 might have contained.

## Reference files

- [references/voice-and-principles.md](references/voice-and-principles.md) — the 5 core principles (Clear/Concise/Consistent/Constructive/Conversational), brand voice ("Friendly Expert"), tone-by-context, and how to address the user.
- [references/writing-for-risk.md](references/writing-for-risk.md) — financial risk language, writing for complex data/metrics/tables, and the high-emotion-moment structural pattern.
- [references/ui-components.md](references/ui-components.md) — per-component rules: headlines, body text, buttons, field labels, placeholders, errors (general/validation/system/transaction), empty states, tooltips/modals, notifications.
- [references/formatting-mechanics.md](references/formatting-mechanics.md) — capitalization, numbers, dates/time, punctuation.
- [references/terminology.md](references/terminology.md) — the controlled vocabulary: canonical terms, contextual distinctions, enforced replacements, words to avoid, product naming.
- [references/localization.md](references/localization.md) — writing for translation, expansion rules, US English source standard.
- [references/compliance.md](references/compliance.md) — risk sensitivity framework (low/medium/high), compliance writing rules, when to escalate.
- [references/governance.md](references/governance.md) — ownership and review process context (who this content answers to).
- [source/style-guide-standalone.html](source/style-guide-standalone.html) — the original snapshot these reference files were transcribed from. Point-in-time, not a live view — if the real guide changes, re-derive from a fresh export rather than trusting this indefinitely.
