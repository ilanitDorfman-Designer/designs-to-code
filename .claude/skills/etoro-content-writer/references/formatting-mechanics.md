# Formatting and Mechanics

Transcribed from the etoro Voice & Style Guide, section 5 — capitalization, numbers, dates/time, and punctuation rules.

## Capitalization

Consistent capitalization improves readability, creates a cohesive experience, and reinforces trust in a financial environment.

- Use **sentence case by default** — only the first word and proper nouns are capitalized.
- Use **Title Case** selectively and intentionally — H1 page titles (web), nav bar titles (mobile), buttons.
- **Avoid ALL CAPS** — only in rare, exceptional cases, and must be approved by a UX writer.

| Rule | Do | Don't |
|---|---|---|
| Default to sentence case (body, labels, helper text, errors, tooltips, notifications) | Add funds to start trading / Enter your email / We couldn't process your payment | Add Funds To Start Trading / Enter Your Email |
| Title Case only in H1 (web) / nav bar titles (mobile) / buttons | Portfolio Overview (H1) / Add Funds (button) | Portfolio overview (H1) / Add funds (button) |
| Keep capitalization consistent within a component type | — | Button: "Add Funds" next to Button: "Withdraw funds" |
| Never all caps for emphasis | Verify your account to continue | VERIFY YOUR ACCOUNT / TRADE NOW |

**Exceptions for all caps require approval** — only for legal/regulatory reasons, or standardized financial abbreviations (USD, CFD). All other uses need explicit UX writer sign-off.

**Proper nouns**: brand name (etoro), assets (Bitcoin, Tesla), legal/financial terms when required.

## Numbers

Clear, consistent formatting is essential for accuracy and fast decision-making.

| Rule | Do | Don't |
|---|---|---|
| **Percent**: `%` symbol, not the word; no space; `+` for positive change; avoid excessive precision | +5% / -2.3% | 5 percent / +5 % |
| **Currency**: always include symbol/code; consistent placement; don't mix symbols and codes in the same context; decimals only when relevant | $1,250.00 / €500 / 1,250 USD (when symbol is unclear or multi-currency) | 1250 / $ 1,250 |
| **Large numbers**: comma separators; abbreviate only when space is limited and meaning is clear | 1,250,000 / 1.2M (compact UI) | 1250000 / 1,2M |
| **Timeframes**: clear standard abbreviations; spell out in explanatory text, abbreviate in data-heavy UI | 1D, 1W, 1M, 1Y (charts/trading) / Last 30 days / Jan 5 to Feb 5 | 1 day (in a chart selector) / 30d |
| **Rounding/precision**: match precision to context and need | $1,250.50 (exact value matters) / $1.2K (summaries/dashboards) | $1,250.503829 |
| **Consistency across related data** | — | $1,200, €950.00, 1200 USD in the same table |
| **Use numerals, not spelled-out numbers** (exception: full-sentence long-form/educational content) | 3 days / 2 attempts remaining / 5 positions open | three days / two attempts remaining |

## Dates and Time

Clarity is essential to prevent misinterpretation of time-sensitive data in a global trading environment.

| Rule | Do | Don't |
|---|---|---|
| Locale-based formatting for everyday UI | US: 04/12/2026, 2:30 PM. EU: 12/04/2026, 14:30 | — |
| Clear fallback when locale unavailable — Day Month Year, 24-hour time | 12 Apr 2026, 14:30 | 04/12/2026 (ambiguous) |
| Market time clarity — relevant market timezone, explicit abbreviation (open/close times, execution timestamps, instrument-specific events) | Market closes at 16:00 EST / Executed at 09:30 GMT | Market closes at 16:00 / Market closes at 16:00 (NYSE) |
| Full explicit timestamps in high-risk/permanent contexts (transactions, confirmations, statements, legal/compliance) | 12 Apr 2026 at 14:30 | Today at 14:30 |
| Relative time only for recent, low-risk contexts (notifications, activity feeds, status updates) | 2 minutes ago / Yesterday | Relative time as the only reference in financial records |
| Consistent within the same context | — | "12/04/2026" and "Apr 12, 2026" in the same table |
| Avoid ambiguity in numeric dates — prefer month names when clarity is critical | — | — |

## Punctuation

Punctuation must feel deliberate and restrained — clean and controlled, not expressive or conversational.

| Rule | Do | Don't |
|---|---|---|
| Punctuation to clarify, not decorate | Your verification is in progress / Funds will arrive within 2-3 business days | Your verification is in progress... / Funds will arrive within 2-3 business days!!! |
| Avoid exclamation marks | Your account is ready | Your account is ready! |
| No emojis in product UI | — | (reduces professionalism, inconsistent across markets) |
| Avoid ellipses | Processing your request | Processing your request... |
| Periods only where they help readability (UI elements like titles/labels/buttons don't need them; full sentences do) | Button: "Deposit Funds" / Label: "Email address" / Body: "Enter a valid email address." | Button: "Deposit Funds." / Label: "Email address." |
| Colons only when introducing structured info | "Required documents:" / "Next steps:" | "Next steps :" |
| Keep sentence structure simple | Review your details before continuing. | Before continuing, review your details, and make sure everything is correct. |
| Hyphens/dashes used correctly | Hyphens for compound terms ("real-time data"); en dashes for ranges ("1-3 days") | — |
