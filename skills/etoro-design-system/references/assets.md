# Real image assets

[../assets/images/](../assets/images/) is the real, shipped app asset pack (extracted from the
`eToro-Plus` app repo's `src/assets/images/`). **Use these files whenever a screen needs a raster
image** — an instrument/crypto logo, an onboarding illustration, a splash/logo asset, a decorative
background shape, or a placeholder avatar — instead of fabricating a placeholder image, sourcing a
random stock photo, or using an emoji as a stand-in. This is the same discipline SKILL.md already
applies to components and icons (Step 5, "never use emoji or generic glyphs as stand-ins"),
extended to imagery.

If a screen needs an image that genuinely isn't in this pack, say so plainly in the coverage
report rather than inventing one — that's a real content gap, not something to silently paper over.

## What's here (by category)

- **Instrument / crypto logos — prefer the live CDN over the static files below.** eToro serves
  every instrument's real logo from `https://etoro-cdn.etorostatic.com/market-avatars/{instrumentId}/...`.
  This covers the full instrument catalog (thousands of tickers), not just the handful bundled
  locally, so **use the CDN URL for any instrument/watchlist/portfolio row**, and fall back to the
  static files (`Aapl.png`, `Tsla.png`, `Nvda.png`, `msft.png`, `Google.png` / `Goog.png`,
  `Microsoft.png`, `Apple.png`, `Spotify.png`, `adsk.png`, `pypl.png`, `snap.png`, `lyft.png`,
  `gamestop.png`, `AMD.png`, `ADBE.png`, `Oil.png`, `nio.png`, `BTC.png`, `eth.png`, `usd.png`,
  `gbp.png`, `trend-btc.png`, `spot.png`) only when a specific instrument's `instrumentId` isn't
  known and one of these happens to match.
  **Known gap:** the CDN needs an `instrumentId`, not a ticker — there's no ticker→instrumentId
  lookup in this skill yet. Until one exists, ask the user for the instrumentId (or the mapping
  source) rather than guessing one; don't fabricate an ID to force the URL to resolve.
- **Decorative background shapes** — `blue-oval.png`, `orange-oval.png`, `red-oval.png`,
  `green-halo.png`, `green-halo-light.png`, `neutral-halo.png`, `torii-halo-dark.png`,
  `Home Flow Oval.png`, `Oval from Home-Flow.png` — the soft gradient blobs/halos used behind
  icons or hero content on home/marketing-style screens.
- **Onboarding illustrations** — `etoro-onboarding1.png`, `etoro-onboarding2.png`, and the Options
  onboarding set: `options-onboarding-get-started.png`, `options-onboarding-start-trading-today.png`,
  `options-onboarding-verifying-details.png`, `options-onboarding-pending.png`,
  `options-onboarding-account-blocked.png`, `options-onboarding-full-potential.png`.
- **Splash / app icon / logo** — `splash-transparent.png`, `splash-dark-mode.png`,
  `splash-light-mode.png`, `splash-dark.gif`, `etoro-splash-screen.png`,
  `Logo Animation Dark.gif`, `etoro-logo.png`, `eToro-white.png`, `favicon.png`, `etoro-fav.png`,
  `etoro_fav.png`, `etoro_alpha_fav.png`, `etoro_alpha_fav_ios.png`, `touch-icon-ipad-144.png`.
- **Auth / login** — `login.png`, `etoro-authstack.png`.
- **Feature/category glyphs** — `top-gainers.png`, `top-losers.png`, `trending.png`,
  `technical-signals.png`, `analyst-choice.png`, `options.png`.
- **People / avatars** — `user.png`, `user2.png`, `melissa.png`, `yoni.png`, `superil.png`,
  `etoroteam.png` — placeholder/real profile imagery for testimonial or team-style content.
- **Welcome screen** — `welcome-screen/welcome-screen-poster.jpg` (poster frame for the welcome
  video/animation).

This list groups by intent, not an exhaustive per-file spec — browse [../assets/images/](../assets/images/)
directly for the current full set, since new assets can be added here over time without this file
being updated first.

## Provenance and refreshing

This is a point-in-time copy, taken from `eToro-Plus/etoro-assets.zip` on the app repo. Nothing
watches that repo for new/changed assets. If a design needs an asset that was added to the app
since this copy was taken, re-export the zip from `eToro-Plus` and replace
[../assets/images/](../assets/images/) with its contents — the same "cache, not a live view" caveat
SKILL.md already applies to `component-tiers.md`.
