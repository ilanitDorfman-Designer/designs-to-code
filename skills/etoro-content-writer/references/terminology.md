# Terminology and Financial Language

Transcribed from the etoro Voice & Style Guide, section 6. **This is a controlled vocabulary system, not a glossary.** Only the terms defined here should be used. Synonyms are not allowed unless explicitly approved. Check this file before shipping any copy — it's the single most likely place generated copy silently drifts from real etoro usage.

## Terminology Rules

- Always use the canonical terms defined below.
- Do not introduce synonyms or variations.
- Do not copy inconsistent terms from existing UI.
- When a term exists in both product and glossary, follow the approved term below.
- If a concept is not listed, default to plain, widely understood financial language.

## Canonical Terminology (by concept)

| Concept | Use | Do not use |
|---|---|---|
| Authentication | Log in (login as a noun, e.g. "Go back to login"), Log out, Sign up | Sign In, Sign Out |
| Verification | Verification, Verification code | OTP, MFA (user-facing) |
| Adding funds | Deposit Funds (preferred), or Add Funds (when space is limited) | Top up, Fund account |
| Withdrawing funds | Withdraw | Cash out |
| Account and portfolio | Portfolio, Account Overview, Account (for settings/banking context) | Balance page, My account (generic replacements) |
| Saved assets | Watchlist | Watch list |
| Tradable items | Asset | Market, Markets |
| Trading actions | Trade, Buy, Sell, Short | Execute, Open trade (as CTA), Long (as primary CTA) |
| Orders and execution | Order, Market Order, Limit Order, Order Type | Trade type |
| Automated trading | Recurring Orders | Auto invest, Automated trading |
| Social trading | Copy (action), Copiers, Followers, Following, Popular Investor, Pro Investor | Copy trading (as CTA), Subscribers |
| Pre-built portfolios | Smart Portfolios | Managed portfolios, Bundles |
| Performance metrics | Net Profit, P/L (in tables only), Annualized return | Earnings, Gains (as primary label), ROI (unless required) |
| Recent activity | Recently Traded | Recently Invested, Recent activity |

## Contextual Distinctions (critical)

These terms are related but **not interchangeable**. Use them precisely.

- **Trade vs Order vs Position** — Order: a request to buy or sell an asset that has not yet been executed ("Your order is pending"). Trade: a completed execution of an order; a moment in time ("Your trade was executed at 14:32"). Position: the result of one or more executed trades that is still open; ongoing exposure ("Your position is currently +5%"). Do not use interchangeably.
- **Buy vs Long** — Use "Buy" for all primary actions and CTAs (opening/increasing exposure). Use "Long" only to describe a position type in data, analytics, and advanced contexts (e.g. in a positions table). Never "Long" as an action.
- **Sell vs Short** — Use "Sell" for all primary actions/CTAs related to reducing or closing exposure. Use "Short" only to describe a position type where the user benefits from price decreases, in data/advanced contexts.
- **Asset vs Instrument** — Use "Asset" in all user-facing UI.
- **Trade vs Invest** — Use "Trade" for active buying and selling. Use "Invest" for broader, passive, or marketing contexts.
- **Copy vs Follow** — Copy: replicate another investor's trades. Follow: track an investor without copying.

## Enforced Replacements (resolve inconsistencies)

The following terms exist in the product but must not be used going forward:

| Do not use | Use instead |
|---|---|
| OTP | Verification code |
| Add funds / Top up | Deposit Funds |
| Withdraw Funds | Withdraw |
| Recently Invested | Recently Traded |
| Instrument (UI) | Asset |

**Notes for implementation**: existing inconsistencies in the product do not define the standard; this section overrides legacy strings and partial implementations; when updating UI, prioritize alignment with these terms; when generating new copy, never introduce a new synonym for an existing concept.

## Words to Avoid

Terms that must not be used because they create legal risk, mislead users, or introduce the wrong emotional tone.

**Core rules**: do not use language that implies guaranteed outcomes, gamifies trading, overpromises ease/safety, or is emotionally charged/hype-driven. Always prefer neutral, factual alternatives.

### Prohibited language (by category)

| Category | Use instead | Never use |
|---|---|---|
| Gambling and gaming language | Trade, Invest, Open a position | Gamble, Bet, Wager, Jackpot, Play (in a trading context) |
| Guaranteed or risk-free language | "Returns are not guaranteed" (when needed); neutral descriptions of outcomes | Guaranteed, Risk-free, Safe, No risk, Secure profits |
| Hype and exaggerated success language | Profit / Loss, Net Profit, Return | Win, Winning trade, Big gains, Massive returns, Get rich, Profit fast |
| Passive income claims | Returns, Performance, Earnings (only in appropriate contexts) | Passive income, Earn effortlessly, Make money automatically |
| Urgency and pressure language | Neutral time-based info; "Market is closing soon" (factual only) | Act now, Don't miss out, Limited time, Hurry |
| Over-simplification of complexity | Clear factual explanations; "Copying involves risk" (when relevant) | Easy money, Simple profits, Just copy and earn |

### Conditional language (use with caution)

- **Return / Returns** → OK in performance context, not as a promise.
- **Earn** → avoid in trading flows, acceptable in interest/dividend contexts.
- **Opportunity** → use sparingly, avoid in high-risk flows.

### AI enforcement rules

- Never generate language that implies certainty of profit.
- Never introduce gambling metaphors.
- Never amplify emotion during high-risk moments (losses, volatility, liquidation).
- Default to neutral, descriptive language.

## Product Naming and System Language

How etoro products, accounts, and financial entities are referred to in the UI.

| Rule | Do | Don't |
|---|---|---|
| Distinguish product/app vs account vs portfolio (app = the platform/experience; account = where funds are held; portfolio = the user's investments/positions) | Open the etoro app / Your USD account balance / Your portfolio performance | Your etoro balance (ambiguous) / Your app balance (incorrect) |
| Always specify account context when multiple accounts exist | Available cash in your USD account / Transfer funds to your GBP account | Available balance (if multiple accounts exist) |
| Currency-based account naming when relevant | USD account, EUR account, GBP account | — |
| Use full product names on first mention (etoro Money, etoro Options, Smart Portfolios), shorten only once context is clear | — | — |
| Avoid ambiguity in financial context — clarity over brevity for money/balances/holdings | Available cash / Total portfolio value | Balance (can mean multiple things) |
| Do not invent new product terms | Only approved product/system terminology | Creating new labels, renaming existing concepts, mixing terms across contexts |
