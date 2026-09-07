# Writing in UI Components

Transcribed from the etoro Voice & Style Guide, section 4 — concrete, operational rules per component type. This is the file to check whenever writing copy for a specific piece of UI. Cross-check the component's tier/type in the `etoro-design-system` skill's [component-tiers.md](../../etoro-design-system/references/component-tiers.md) so the copy rule matches the real component being filled in.

## Headlines

A headline is the highest-level piece of text within a screen or section. It anchors the content hierarchy and signals what the user can expect from the content that follows. Headlines are **structural navigation tools, not promotional copy.**

- **Role**: define the purpose of the screen/section, establish hierarchy, help users scan and orient quickly, reduce ambiguity in complex flows, support accessibility/screen-reader navigation.
- **Definition**: one H1 per screen; H1 defines the primary purpose of the screen; subheadings organize content within the screen.
- **Punctuation**: rarely any. No period, ever. Avoid exclamation marks and ellipses.
- **Capitalization**: H1 must be Title Case. All other headings must be sentence case.
- **Guidelines**: prioritize clarity over marketing; state the purpose of the screen; keep concise and scannable; do not stack multiple ideas in one headline.
- **Length**: aim for 3-8 words. Never longer than two lines; avoid multi-line headlines where possible. If a headline requires a full sentence, restructure the screen.

## Body Text

Body text supports headlines and UI components by providing necessary context, explanation, or instruction. Headlines signal what the section is about; body text explains what the user needs to know or do; UI components enable action.

- **Style**: sentence case; punctuate with a period after each sentence; use active voice.
- **Avoid filler language such as**: "Please note that", "Kindly be advised", "It is important to mention", "In order to", "Simply", "Just", "Basically".

| Rule | Do | Don't |
|---|---|---|
| Keep sentences short (8-20 words; avoid multi-clause) | — | — |
| One idea per sentence | We could not verify your document because the image was unclear. Please upload a new photo to continue. | Your account could not be verified because the document was unclear and you need to upload a new one to continue using all features. |
| Use active voice | We'll review your documents | Your documents will be reviewed |
| Remove filler words | Add funds to start trading. | You can add funds in order to begin trading on the platform. |
| Avoid redundancy with the headline | Add new information | Do not restate the headline in different words |

## Buttons

Buttons are interactive UI controls that trigger an action or confirm a decision. Their label must tell the user what will happen when they tap or click.

- **Style**: Title Case; start with a verb; 1-3 words preferred, max 5; no punctuation; no exclamation marks; use the same term users see elsewhere in the UI (approved terminology — see [terminology.md](terminology.md)).
- **Label the outcome, not the UI interaction** — do: "Add funds" (over "Continue"), "Close trade" (over "Confirm").
- **Avoid generic CTAs** — avoid "Submit" or "Continue" when context allows specificity.
- **Match the product's terminology exactly** — if the UI says "funds", don't switch to "money"; if it says "trade", don't switch to "position" unless that's the canonical term for that surface.
- **Do not use first-person CTAs** — do: "Add funds", "Close trade", "Upload document"; don't: "Add my funds", "Close my trade", "Upload my document".

## Field Labels

Field labels identify what information a user needs to provide in a form or input field. In a financial context, unclear labels can lead to mistakes, hesitation, or loss of trust — labels must remove ambiguity completely.

- **Style**: sentence case; 1-3 words preferred, max 4; no punctuation; no exclamation marks; consistent terminology across all flows/surfaces.

| Rule | Do | Don't |
|---|---|---|
| Name the data, don't instruct | Email address | Enter your email address |
| Be specific, not generic | Investment amount / Country of residence | Amount / Country |
| Use familiar, user-facing language | Card number | PAN |
| Keep labels short and scannable | Phone number | Your mobile phone number |
| Include units and context when needed | Amount (USD) / Stop loss (%) | Value |
| Don't rely on placeholders as labels | Labels always visible; labels = structure, placeholders = examples/hints | — |
| Add support only when necessary | Label: "Tax ID" / Helper: "Required for verification in your country" | — |
| Mark optional fields clearly, only when needed | "Middle name (optional)" | Marking all required fields |
| Keep terminology consistent across flows | Portfolio value | Switching between Account value / Balance / Equity |

## Placeholder Text

Placeholder text appears inside input fields to guide format — it is **not a substitute for a label.**

- **Style**: sentence case; 1-3 words preferred, max 6; no punctuation; no exclamation marks; consistent terminology.
- **Placeholders should never**: replace a field label, contain critical information users may need after typing, include full sentences unless absolutely necessary.

| Rule | Do | Don't |
|---|---|---|
| Show format, not explain concepts | "e.g. 10,000" / "DD/MM/YYYY" | Enter the amount you would like to invest in USD |
| Keep short and scannable (1-4 words) | "Minimum $10" / "Search assets" | Please type the name of the asset you are looking for |
| Never labels-by-proxy | Label: "Amount" / Placeholder: "e.g. 500" | No label / Placeholder: "Enter amount" |
| Avoid redundancy with labels | Label: "Email" / Placeholder: "name@example.com" | Label: "Email" / Placeholder: "Email" |
| Avoid instructional language | Placeholder: "Password" / Helper below: "Must include 8 characters, a number, and a symbol" | "Enter your password. Must include 8 characters, a number, and a symbol" |
| Be careful with localization | Avoid abbreviations that may not translate; region-aware formats | — |

## Errors (general)

Error messages inform users that something has gone wrong and guide them toward resolution — they should reduce confusion, not add to it.

| Rule | Do | Don't |
|---|---|---|
| Start with what happened | We couldn't place your order. | Something went wrong. |
| Add context only if it helps | Your balance is too low to complete this trade. | Error 502. Invalid execution state. |
| Always guide the next step | Add funds to continue. | Please try again. |
| Avoid blame or alarm | We couldn't verify your details. | You entered incorrect information. |
| Be specific, not generic | This card is not supported. Try a different payment method. | Payment failed. |
| Keep it concise | — | — |
| Match tone to severity | Trading is temporarily unavailable. | Trading has stopped! |
| Avoid technical language | — | — |

**Standard error structure**: what happened → why (if helpful) → what to do next. Example: "We couldn't process your payment. Your bank declined the transaction. Try a different card or contact your bank."

| Case | Good | Bad |
|---|---|---|
| Generic error | We couldn't load your portfolio. Try refreshing the page. | Something went wrong. |
| Action blocked | We couldn't place your trade. The market is currently closed. | Error placing trade. |
| Input issue | Enter a valid email address. | Invalid input. |

### Validation errors

Indicate the information entered is missing, incomplete, or formatted incorrectly and needs correcting before proceeding. **Style**: sentence case, neutral and instructional.

| Rule | Do | Don't |
|---|---|---|
| Be specific about what's wrong | Enter a valid email address. | Invalid input. |
| Focus on how to fix it | Password must include at least 8 characters. | Password is invalid. |
| Keep short and scannable, inline | — | — |
| Avoid blame | This field is required. | You forgot to fill this out. |
| Plain language, not rules jargon | Use numbers only. | Invalid format. |
| Show errors after interaction, not before (prefer inline over form-level) | — | — |
| One issue per message | "Use at least 8 characters." + "Include one number." | Password must be valid. |
| Match placement to the field (directly below/next to it) | — | — |

### System errors

Occur when something fails on the platform side — a technical issue, temporary outage, or system limitation. **Style**: calm and reassuring, transparent but not technical, ownership-driven and solution-focused.

| Rule | Do | Don't |
|---|---|---|
| Take responsibility | We couldn't load your data. | Failed to load data. |
| Avoid technical details | We're having trouble connecting right now. | Server timeout. Error 504. |
| Reassure when appropriate (if funds/positions/data safe, say so) | Your funds are safe. | (no reassurance in a high-risk moment) |
| Offer a clear next step | Try again in a few minutes. | Please try again. |
| Be honest about uncertainty | We're working to fix this. | This will be resolved shortly. |
| Match severity to tone | Minor: "We couldn't refresh this section." / Major: "Trading is temporarily unavailable." | — |
| Avoid over-apologizing (one acknowledgment is enough) | We're having trouble processing this right now. | We're really sorry, something went terribly wrong. |

**Standard structure**: what happened → reassurance (if needed) → what to do next. Example: "We're having trouble loading your portfolio. Your investments are not affected. Try refreshing the page."

| Case | Good | Bad |
|---|---|---|
| Loading issue | We couldn't load this page. Try refreshing. | Error loading page. |
| Outage | Trading is temporarily unavailable. We're working to restore it. | Service unavailable. |
| Connection issue | We're having trouble connecting. Check your connection or try again. | Network error. |

### Transaction failures

Indicate a financial action was attempted but not completed successfully. **Style**: best presented in a modal with a title, a body, and 1-2 CTAs; clear and precise; calm and reassuring; action-oriented and transparent.

| Rule | Do | Don't |
|---|---|---|
| Clearly state that the transaction failed | We couldn't complete your withdrawal. | Something went wrong. |
| Specify the transaction type | We couldn't place your trade. | Action failed. |
| Provide the reason when known | Your bank declined the payment. | Payment failed. |
| Reassure about money and status | "No funds were deducted." / "Your order was not executed." | Leave uncertainty |
| Guide the next step clearly | Try a different payment method. | Please try again. |
| Avoid ambiguity around timing | Try again in a few minutes. | Try again later. |
| No technical/banking jargon | Your card was declined. | Issuer response code 05. |
| Match tone to financial impact | Higher-value/sensitive failures need more reassurance and clarity | — |

**Standard structure**: Title (what failed) → Body: why (if known) → Body: status of funds or order → Body: what to do next → Primary CTA (leads to next step, or closes modal if none) → Secondary CTA (closes modal if there's an action on the primary).

Example — Title: "We couldn't process your deposit". Body: "Your bank declined the payment. No funds were charged. Try a different card or contact your bank." Primary CTA: "Try Again". Secondary CTA: "Close".

## Empty States

Appear when there is no data to show yet — guide users on what to do next instead of leaving them at a dead end.

- **Style**: clear and precise (avoid over-explaining); calm and reassuring (no sense of error/failure); action-oriented and forward-looking (focus on potential, not absence). Format: title (sentence case), body (sentence case), button CTA (Title Case).

| Rule | Do | Don't |
|---|---|---|
| Frame the future, not the absence | Start building your portfolio | You don't have a portfolio yet |
| Always include a clear next step | Explore markets / Add funds / Find investors to copy | — |
| Avoid blame or negative tone | Ready to add funds? | You haven't added funds |
| Keep it short and scannable (one idea, one action) | — | — |
| Match the user's journey stage | New users → inspire/guide. Active users → re-engage. Temporary states → explain/reassure. | — |
| Avoid hype or unrealistic outcomes | Discover popular assets | Start winning now |
| Use supportive, low-pressure CTAs | Explore markets / Browse assets / Find investors | — |

**Structure**: Headline (what the user can do/achieve) → Body (short clarification or benefit) → CTA (clear next step).

| Case | Example |
|---|---|
| Watchlist (empty) | Headline: "Track assets you care about" / Body: "Add assets to follow their performance." / CTA: "Browse Assets" |
| No transactions yet | Headline: "Start your trading journey" / Body: "Your activity will appear here once you begin." / CTA: "Start Trading" |
| Copy trading (no copied investors) | Headline: "Discover investors to copy" / Body: "Automatically mirror their trades in your portfolio." / CTA: "Find Investors" |
| No search results (exception) | Headline: "Try another search" / Body: "We couldn't find matches for your query." / CTA: "Explore Popular Assets" |

**Important exception**: when the system needs to explain a result (like empty search results), clarity takes priority over inspiration — it's acceptable to state what happened.

## Tooltips and Info Modals

Provide additional context, clarification, or education without interrupting the main flow. Tooltips are lightweight/contextual (a single element or metric); info modals are more detailed. **Not a substitute for clarity in core flows** — critical information must be visible inline.

- **Style**: clear and factual; neutral and informative; concise but complete; focused on helping users understand, not persuading them; free of jargon.

**Use tooltips when**: information is supportive not essential, user can complete the task without reading it, concept is advanced/secondary, inline explanation would create visual clutter.

**Do not use tooltips when**: information impacts money or risk directly, misunderstanding could cause financial harm, concept is critical to completing the task.

| Rule | Do | Don't |
|---|---|---|
| One concept per tooltip | Spread is the difference between the buy and sell price of an asset. | Spread is the difference between buy and sell price, and it changes based on market conditions and liquidity. |
| Start with a direct explanation | Available balance is the amount you can use to open new trades. | This shows your available balance, which means the amount you currently have… |
| Plain language for complex concepts | Leverage lets you open a larger position using a smaller amount of your own funds. | Leverage is a financial mechanism that amplifies exposure through borrowed capital. |
| Avoid compliance overload (use links/modals for deeper detail) | CFDs allow you to trade on price movements without owning the asset. | CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage… |
| Use info modals for depth, not tooltips | Tooltip: "Margin is the amount required to keep your position open." Modal — Title: "What is margin?" Body: "Margin is the amount of funds required to keep your trade open. If your equity falls below the required margin, your position may be closed automatically." | — |
| Be neutral and non-persuasive | Higher leverage increases both potential gains and potential losses. | Use leverage to maximize your potential returns. |

- **Structure info modals for clarity**: title; short definition; additional context or example; optional link to learn more.
- **Avoid redundancy with UI** — add only what the user cannot infer.
- **Keep length tight** — tooltips: 1-2 sentences; info modals: short paragraphs, scannable.
- **Ensure accessibility** — avoid abbreviations unless defined; write for varying levels of financial knowledge.

## Notifications

Short, timely messages (push or in-app) about activity, status updates, or required actions.

- **Style**: lead with the outcome (result/event in the first 3-5 words); clear (no ambiguity); relevant (only notify when it matters); calm and factual, especially during market movement/risk; actionable when needed; avoid noise, urgency for its own sake, or marketing language.

| Rule | Do | Don't |
|---|---|---|
| Don't prefix with system labels — users already know the source | Your order was executed | etoro update: your order has been successfully executed |
| Match urgency to importance | High: "Margin call: add funds to avoid liquidation". Medium: "Your deposit is being processed". Low: "You received a dividend payment". | Overusing high-urgency language |
| Be precise with financial events | Your stop loss was triggered at $1,245 | Your position changed |
| Include next steps when relevant | Verification failed. Upload a new document to continue. | Verification failed |
| Keep it concise (readable in one glance) | Funds added. You can start trading. | Your funds have been successfully added to your account and are now available for trading activities. |
| Avoid promotional tone | Price alert: Tesla reached $250 | Tesla is soaring. Don't miss out |
| Use consistent capitalization (sentence case) | Your withdrawal request was approved | Your Withdrawal Request Was Approved |
| Careful with emotional moments — neutral, supportive | Your position was closed due to insufficient margin | You lost your position |

| Case | Example |
|---|---|
| Trade execution | Your order for Apple was executed at $182.30 |
| Price alert | Bitcoin reached your target price of $40,000 |
| Deposit status | Your deposit is being processed |
| Failure | Payment failed. Try another method or contact support |
| Risk event | Margin call: add funds to keep your positions open |
