# Localization and Globalization

Transcribed from the etoro Voice & Style Guide, section 7. etoro is a global product — copy must be written so it works not just in English, but in every supported language, without breaking, confusing, or expanding unpredictably when translated.

## Writing for Translation

| Rule | Do | Don't |
|---|---|---|
| Avoid idioms and informal expressions | Start trading / Add funds to continue | Hit the ground running / Get the ball rolling |
| Avoid wordplay, humor, and puns | Track your performance | Stay on top of your game |
| Avoid culturally specific references | Market is closed | Closed for the holidays (unless localized explicitly) |
| Use simple, direct sentence structures | We couldn't process your payment. Try another method. | Unfortunately, due to an issue with your selected payment method, we were unable to process your transaction at this time. |
| Avoid ambiguous wording (words with multiple meanings) | Close trade | Close (unclear without context) |
| Avoid phrasal verbs when possible | Continue | Carry on |
| Avoid string concatenation (breaks grammar in many languages) | You copied John's portfolio | 'You copied ' + username + "'s portfolio" |
| Design for variable text length | Expect up to 30% expansion; avoid tight character limits; don't rely on fixed-width layouts | — |

**AI enforcement rules**: default to literal, clear phrasing over expressive language; do not generate idioms, humor, or culturally specific phrasing; always use approved terminology consistently; avoid restructuring sentences in ways that depend on English grammar.

## Expansion Rules

Translated text is often longer than English — can expand by up to 30% or more.

| Rule | Do | Don't |
|---|---|---|
| Keep UI text as short as possible | Add funds / Close trade | Add funds to your account to begin trading / Close your open trade position |
| Avoid writing to exact character limits | Leave room for longer translations; don't max out button/label length | — |
| Don't rely on line breaks or layout structure | Write self-contained phrases | Assuming a two-line structure will hold in other languages |
| Avoid multi-part phrases that must stay together | Close trade | 'Close' + 'trade' as separate, interdependent UI elements |
| Be careful with dynamic variables (avoid possessive/strict-grammar positions) | You copied {{username}} | {{username}}'s portfolio was copied |
| Avoid abbreviations unless universally understood (exception: USD, %) | Maximum drawdown | Max DD |
| Keep buttons/labels especially tight | Buttons: 1-3 words preferred. Labels: 1-3 words preferred. | Adding qualifiers or extra context |

**AI enforcement rules**: default to the shortest clear version of any phrase; do not expand copy unnecessarily; respect length constraints for buttons, labels, and headlines.

## Source Language Standard

All English source content must use **US English** — supports the automated localization pipeline (AI systems use US English as the base and generate other variants, e.g. UK English, during localization).

| Rule | Do | Don't |
|---|---|---|
| US English spelling/conventions by default | color, optimize, center | colour, optimise, centre |
| Do not mix English variants within the same string/flow | — | — |
| Do not localize English manually | Localization systems handle regional differences automatically | Writing separate UK English variants |
