# Content Governance

Transcribed from the etoro Voice & Style Guide, section 10. Context on ownership and process — useful for knowing who this content would go to next / who owns a decision, not a writing rule in itself.

## Ownership

- **UX Writing** — owns product copy standards, voice, tone, and clarity. Approves user-facing UX copy before localization. Maintains this style guide and AI guardrails.
- **Product and Design** — responsible for creating and implementing copy within flows. Ensure copy is ready for review before entering localization.
- **Compliance and Legal** — own regulated content and risk-related language. Approve disclosures and sensitive financial messaging.
- **Localization (AI-driven)** — fully automated via AI pipeline. PMs are responsible for submitting clean, approved English copy.
- **Terminology ownership** — UX Writing maintains the source of truth for terminology (see [terminology.md](terminology.md)). AI systems must align with approved terminology.

## Review Process

Because localization is automated, quality control must happen before content enters the pipeline.

**Standard flow**: Product and Design draft the experience (crucial screens/flows should consult the UX writer already at the draft stage) → UX Writing reviews and refines the copy → Compliance reviews where required → PM submits final English strings (keys and values) via Google Sheet → Monday board → AI vetting tool validates spelling, grammar, and style → if passed, AI localization process begins.

- Do not send unreviewed or draft copy to localization.
- AI vetting is a safeguard, not a replacement for UX writing review.
- Poor English input will scale into poor localization output.

**When to escalate**: new financial concepts or features; changes to regulated or risk-related content; any ambiguity that could break in translation.

## Versioning and Documentation

The system must remain traceable despite automation.

- **Source of truth**: this style guide is the single reference for writing standards; English source copy is the foundation for all localized versions.
- **All updates must include**: what changed, why it changed, when it takes effect.
- **The localization pipeline depends on**: clean, structured source strings; consistent terminology; stable key naming.
- **Communication**: changes to terminology or structure must be communicated before localization runs; breaking changes to keys or phrasing should be avoided post-localization.
- **Maintenance** — regularly audit: AI localization output quality; terminology consistency across languages; update guidelines based on recurring issues or failure patterns.
