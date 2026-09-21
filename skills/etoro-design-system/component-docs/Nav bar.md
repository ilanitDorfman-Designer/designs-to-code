 **Purpose**

 The Nav Bar is the only bottom navigation allowed in the app. It is a strictly predefined, locked system component — the primary bottom navigation element on mobile screens, using iOS Liquid Glass material. It must be used exactly as defined, without any modification. No alternative bottom navigation design, pattern, or layout is permitted. Do not recreate, restyle, reorder, or reinterpret the Nav Bar. Any deviation from the defined component is invalid.

 **When to use**

 

-  ·

-  As the persistent bottom navigation across all main screens

-  ·

-  To switch between top-level app destinations (Home, Watchlist, Portfolio, Discover, Social)

-  ·

-  When the app has 3–5 primary sections of equal hierarchy

 **Variants**

 

 **iOS**

 Liquid Glass bar with transparent lensing material. Active tab uses a frosted glass pill capsule with green icon tinting and backdrop blur.

 **Android**

 Flat material bar with subtle backdrop blur. Active tab uses a pill container with light background fill, no glass effect.

 **Usage Guidelines**

 

 Do

-  

-  The Nav Bar MUST always appear on all main screens: Home, Watchlist, Portfolio, Discover, Social

-  The correct tab MUST always be selected based on the current screen (e.g. Home screen → Home tab active)

-  Use exactly 5 tabs in fixed order: Home → Watchlist → Portfolio → Discover → Social

-  Each tab MUST include an icon (24×24) and a one-word label

-  STRICT COLOR RULE — Selected (active) tab: MUST use Primary/600 for BOTH icon AND label. Light mode: #0EB12E. Dark mode: #6EFF8B. CSS: var(--primary-600). No other color is allowed. Any other color is a violation.

-  STRICT COLOR RULE — Enabled (inactive) tabs: MUST use Neutral/900 for BOTH icon AND label. Light mode: #1B1E21. Dark mode: #FFFFFF. CSS: var(--color-text-primary) or var(--carbon-neutral-900). No other color is allowed. Any other color is a violation.

-  Glass pill MUST be rgba(178,178,178,0.15) with backdrop-filter: blur(10px) (iOS only), border-radius: 100, flex: 1

-  This is the ONLY bottom navigation design permitted — no alternative bottom nav pattern is allowed

-  Reserve the Nav Bar for the navigation layer only — it MUST float above content

-  Use Liquid Glass material for the active tab pill (backdrop-filter + low-alpha fill)

-  Maintain consistent tab order across all screens — reordering is forbidden

-  MUST use filled icon variants for the active tab and outline variants for inactive tabs — mixing is forbidden

-  All Nav Bar icons MUST come from the design system icon set — no exceptions

-  Icons MUST use currentColor — hardcoded color values on icons are forbidden

-  ALL colors MUST come from tokens only — hardcoded HEX values are strictly forbidden

-  Colors MUST match the current mode — light-mode tokens in light mode, dark-mode tokens in dark mode. Cross-mode usage is a violation.

-  When showing a Home, Watchlist, Portfolio, Discover, or Social (Feed) page, you MUST always display the Nav Bar with the corresponding tab selected

 Avoid

-  

-  FORBIDDEN: Creating any bottom navigation other than this exact Nav Bar component

-  FORBIDDEN: Recreating, regenerating, or reinterpreting the Nav Bar in any way

-  FORBIDDEN: Using ANY color other than Primary/600 (var(--primary-600)) for selected tab icon or label — #0EB12E light / #6EFF8B dark. No exceptions.

-  FORBIDDEN: Using ANY color other than Neutral/900 (var(--color-text-primary)) for enabled tab icon or label — #1B1E21 light / #FFFFFF dark. No exceptions.

-  FORBIDDEN: Hardcoding #0EB12E — MUST use var(--primary-600) so dark mode resolves to #6EFF8B

-  FORBIDDEN: Hardcoding #1B1E21 — MUST use var(--color-text-primary) or var(--carbon-neutral-900) so dark mode resolves to #FFFFFF

-  FORBIDDEN: Using any shade other than Primary/600 for the active tab (not Primary/500, not Primary/700, not any other green)

-  FORBIDDEN: Using any shade other than Neutral/900 for inactive tabs (not Neutral/700, not Neutral/800, not any gray)

-  FORBIDDEN: Having icon and label in different colors — they MUST always share the exact same token

-  FORBIDDEN: Using light-mode color values (#0EB12E, #1B1E21) when rendering in dark mode

-  FORBIDDEN: Using dark-mode color values (#6EFF8B, #FFFFFF) when rendering in light mode

-  FORBIDDEN: Changing icons, layout, spacing, or structure

-  FORBIDDEN: Using different icons than defined in the design system

-  FORBIDDEN: Using different tab labels (e.g. "Learn", "Markets", "Wallet") — only Home, Watchlist, Portfolio, Discover, Social

-  FORBIDDEN: Removing the glass pill or using solid backgrounds instead of glass

-  FORBIDDEN: Using a different number of tabs or reordering tabs

-  FORBIDDEN: Mixing icon styles (filled/outline) within the same state

-  FORBIDDEN: Generating new icons, using emojis, or using external icon styles

-  FORBIDDEN: Adding glass effects to the bar container itself — only the active tab pill gets glass

-  FORBIDDEN: Applying custom colors of any kind — all colors MUST come from the defined tokens

 **States & Behavior**

 

-  ·

-  SELECTED (active) tab — Light mode: Primary/600 = #0EB12E for BOTH icon (filled) AND label. This is the ONLY allowed color.

-  ·

-  SELECTED (active) tab — Dark mode: Primary/600 = #6EFF8B for BOTH icon (filled) AND label. This is the ONLY allowed color.

-  ·

-  SELECTED tab CSS token: var(--primary-600) — MUST be used. Hardcoding HEX is forbidden.

-  ·

-  ENABLED (inactive) tab — Light mode: Neutral/900 = #1B1E21 for BOTH icon (outline) AND label. This is the ONLY allowed color.

-  ·

-  ENABLED (inactive) tab — Dark mode: Neutral/900 = #FFFFFF for BOTH icon (outline) AND label. This is the ONLY allowed color.

-  ·

-  ENABLED tab CSS token: var(--color-text-primary) or var(--carbon-neutral-900) — MUST be used. Hardcoding HEX is forbidden.

-  ·

-  Tab transition: 200ms ease on background, color, and backdrop-filter

-  ·

-  Tab pill: rgba(178,178,178,0.15) background with 10px backdrop blur

 **Component Spec (JSON)**

 

 nav-bar-spec.json

 

 

 

 **Component Lock — Absolute Enforcement**

 

 **Purpose**

 The Nav Bar is the ONLY bottom navigation permitted in the app. It is a strictly predefined system component that MUST be used exactly as defined, without any modification. No alternative bottom navigation design is allowed. Any deviation — including color changes — renders the output invalid.

 **Usage Guidelines**

 

 Do

-  

-  MUST use the exact library component as-is on every main screen

-  MUST validate before rendering: (1) Nav Bar identical to defined component? (2) Exactly 5 tabs in correct order? (3) Correct tab active? (4) Filled icon on active, outline on inactive? (5) Selected tab color = Primary/600 only? (6) Enabled tab color = Neutral/900 only? (7) Colors match current mode (light/dark)?

-  If ANY validation check fails → output is INVALID and MUST be corrected

 Avoid

-  

-  FORBIDDEN: Recreating the Nav Bar from scratch

-  FORBIDDEN: Generating a new navigation pattern

-  FORBIDDEN: Changing icons, layout, spacing, structure, or colors

-  FORBIDDEN: Simplifying or reinterpreting the component

-  FORBIDDEN: Using any color other than Primary/600 (selected) and Neutral/900 (enabled)

 

 **Mandatory Usage — All Main Screens**

 

 **Purpose**

 The Nav Bar must always appear on all main screens. The correct tab must always be selected based on the current screen.

 **Usage Guidelines**

 

 Do

-  

-  Home screen → Home tab must be active

-  Watchlist screen → Watchlist tab must be active

-  Portfolio screen → Portfolio tab must be active

-  Discover screen → Discover tab must be active

-  Social screen → Social tab must be active

 Avoid

-  

-  Omitting the Nav Bar on any main screen

-  Showing the wrong tab as active for the current screen

 

 **Exact Structure Requirement**

 

 **Purpose**

 The Nav Bar must include exactly 5 tabs in fixed order. Each tab must include an icon (24×24) and a label (one word). No additional tabs, no missing tabs, no reordering.

 **Variants**

 

 **Tab 1 — Home**

 First position. Home icon + "Home" label.

 **Tab 2 — Watchlist**

 Second position. Watchlist icon + "Watchlist" label.

 **Tab 3 — Portfolio**

 Third position. Portfolio icon + "Portfolio" label.

 **Tab 4 — Discover**

 Fourth position. Discover icon + "Discover" label.

 **Tab 5 — Social**

 Fifth position. Social icon + "Social" label.

 

 **STRICT — Enabled Tab Color: Neutral/900 Only**

 

 **Purpose**

 ABSOLUTE RULE: The enabled (inactive) tab state for BOTH icon AND label MUST use the Neutral/900 token. No other color is permitted. This is non-negotiable. Using any other color is a violation. Light mode: Neutral/900 = #1B1E21. Dark mode: Neutral/900 = #FFFFFF. CSS: var(--color-text-primary) or var(--carbon-neutral-900).

 **Variants**

 

 **Light mode (MANDATORY)**

 Neutral/900 → #1B1E21 — MUST be used for BOTH icon AND label of every inactive tab. No exceptions.

 **Dark mode (MANDATORY)**

 Neutral/900 → #FFFFFF — MUST be used for BOTH icon AND label of every inactive tab. No exceptions.

 **Usage Guidelines**

 

 Do

-  

-  MUST use var(--color-text-primary) or var(--carbon-neutral-900) for ALL enabled tab icons and labels

-  Icons MUST use currentColor so they inherit the token automatically

-  Icon and label MUST share the exact same Neutral/900 token — different colors are a violation

-  MUST verify in both light AND dark mode: #1B1E21 (light) and #FFFFFF (dark)

 Avoid

-  

-  FORBIDDEN: Any color other than Neutral/900 for enabled tab icons or labels

-  FORBIDDEN: Hardcoding #1B1E21 — MUST use the semantic token (var(--color-text-primary) or var(--carbon-neutral-900))

-  FORBIDDEN: Using Neutral/700, Neutral/800, gray, secondary, tertiary, or any other token — ONLY Neutral/900

-  FORBIDDEN: Icon and label in different colors — they MUST be identical (both Neutral/900)

-  FORBIDDEN: Using #FFFFFF in light mode or #1B1E21 in dark mode — colors MUST match the current mode

 

 **STRICT — Selected Tab Color: Primary/600 Only**

 

 **Purpose**

 ABSOLUTE RULE: The selected (active) tab state for BOTH icon AND label MUST use the Primary/600 token. No other color is permitted. This is non-negotiable. Using any other color is a violation. Light mode: Primary/600 = #0EB12E. Dark mode: Primary/600 = #6EFF8B. CSS: var(--primary-600).

 **Variants**

 

 **Light mode (MANDATORY)**

 Primary/600 → #0EB12E — MUST be used for BOTH filled icon AND label of the selected tab. No exceptions.

 **Dark mode (MANDATORY)**

 Primary/600 → #6EFF8B — MUST be used for BOTH filled icon AND label of the selected tab. No exceptions.

 **Usage Guidelines**

 

 Do

-  

-  MUST use var(--primary-600) for the selected tab icon AND label color

-  Icons MUST use currentColor so they inherit the token automatically

-  Icon and label MUST share the exact same Primary/600 token — different colors are a violation

-  MUST verify in both light AND dark mode: #0EB12E (light) and #6EFF8B (dark)

 Avoid

-  

-  FORBIDDEN: Any color other than Primary/600 for the selected tab icon or label

-  FORBIDDEN: Hardcoding #0EB12E — MUST use var(--primary-600) so dark mode resolves to #6EFF8B

-  FORBIDDEN: Icon and label in different colors — they MUST be identical (both Primary/600)

-  FORBIDDEN: Using Primary/500, Primary/700, or any other shade — ONLY Primary/600

-  FORBIDDEN: Using #0EB12E in dark mode or #6EFF8B in light mode — colors MUST match the current mode

 

 **Active Tab Glass Pill**

 

 **Purpose**

 The active tab is visually distinguished by a Liquid Glass capsule — a rounded pill with a low-alpha fill and backdrop blur. This creates a subtle frosted lens effect that elevates the active destination above the others without competing with the content layer.

 **Usage Guidelines**

 

 Do

-  

-  Use a full-width pill (flex: 1) with border-radius: 100 for the capsule shape

-  Apply backdrop-filter: blur(10px) to the active pill only

-  Keep the fill very subtle — rgba(178,178,178,0.15) — so content shows through

-  Transition smoothly between tabs (200ms ease)

-  The pill must NOT be replaced with a solid background

-  The pill must NOT be removed

 Avoid

-  

-  Making the pill opaque — it should be transparent glass, not a solid fill

-  Applying blur to inactive tabs — only the active tab gets the glass treatment

-  Using strong shadows on the pill — keep depth minimal at the tab level

-  Replacing the glass pill with a solid background

-  Removing the glass pill entirely

 

 **STRICT — Tab Icon & Label Colors**

 

 **Purpose**

 ABSOLUTE RULE: Only two colors exist in the Nav Bar — Primary/600 for the selected tab and Neutral/900 for enabled tabs. No other color may appear anywhere. Icon and label within the same tab MUST always be the same color. Using any other color, shade, or token is a violation.

 **Variants**

 

 **Enabled (inactive) — Light**

 MUST be Neutral/900 (#1B1E21) for BOTH outline icon AND label. No other color.

 **Enabled (inactive) — Dark**

 MUST be Neutral/900 → #FFFFFF for BOTH outline icon AND label. No other color.

 **Selected (active) — Light**

 MUST be Primary/600 (#0EB12E) for BOTH filled icon AND label. No other color.

 **Selected (active) — Dark**

 MUST be Primary/600 (#6EFF8B) for BOTH filled icon AND label. No other color.

 **Usage Guidelines**

 

 Do

-  

-  MUST use var(--primary-600) for selected tab — resolves to #0EB12E (light) / #6EFF8B (dark)

-  MUST use var(--color-text-primary) for enabled tabs — resolves to #1B1E21 (light) / #FFFFFF (dark)

-  Icon and label MUST always be the exact same color — never different

-  Icons MUST use currentColor in SVGs — hardcoded fill/stroke colors are forbidden

-  Use 24×24px icon size — no exceptions

-  All icons MUST come from the design system icon set

 Avoid

-  

-  FORBIDDEN: Hardcoding #0EB12E — MUST use var(--primary-600)

-  FORBIDDEN: Hardcoding #1B1E21 — MUST use var(--color-text-primary) or var(--carbon-neutral-900)

-  FORBIDDEN: Icon in one color and label in another — they MUST match

-  FORBIDDEN: Using any color besides Primary/600 and Neutral/900 anywhere in the Nav Bar

-  FORBIDDEN: Using any shade other than the exact specified tokens (no Primary/500, no Neutral/800, etc.)

-  FORBIDDEN: Using light-mode values in dark mode or dark-mode values in light mode

-  FORBIDDEN: Generating new icons or using external icon sources

 

 **STRICT — Token Enforcement (Zero Tolerance)**

 

 **Purpose**

 ABSOLUTE RULE: The Nav Bar permits exactly TWO color tokens and NOTHING else. Selected tab = var(--primary-600) → #0EB12E light / #6EFF8B dark. Enabled tabs = var(--color-text-primary) → #1B1E21 light / #FFFFFF dark. Any hardcoded HEX, any custom color, any alternative token is a violation. There are no exceptions.

 **Usage Guidelines**

 

 Do

-  

-  Selected tab icon + label: MUST use var(--primary-600) — Light: #0EB12E, Dark: #6EFF8B

-  Enabled tab icon + label: MUST use var(--color-text-primary) or var(--carbon-neutral-900) — Light: #1B1E21, Dark: #FFFFFF

-  Icons MUST use currentColor — no inline fill or stroke colors

-  Colors MUST match the current rendering mode — light tokens in light, dark tokens in dark

 Avoid

-  

-  FORBIDDEN: Any hardcoded HEX value (#0EB12E, #1B1E21, #6EFF8B, #FFFFFF) — MUST use CSS custom properties

-  FORBIDDEN: Any color not listed above — no grays, no blues, no custom colors, no opacity variants

-  FORBIDDEN: Light-mode values in dark mode or dark-mode values in light mode

-  FORBIDDEN: Any token other than Primary/600 and Neutral/900 for Nav Bar colors

 

 **Override Rule — Highest Priority**

 

 **Purpose**

 The Nav Bar definition overrides ALL other instructions. This is the ONLY bottom navigation allowed. Even if the layout suggests a different structure, the content suggests different tabs, or the AI "thinks" a different nav or different colors would be better — the defined Nav Bar with its exact color tokens MUST still be used. Selected = Primary/600. Enabled = Neutral/900. No negotiation.

 **Usage Guidelines**

 

 Do

-  

-  MUST use the defined Nav Bar with exact colors, regardless of other context

-  Treat the Nav Bar spec — including its color rules — as the highest-priority instruction

-  Selected tab = var(--primary-600) ALWAYS. Enabled tabs = var(--color-text-primary) ALWAYS.

 Avoid

-  

-  FORBIDDEN: Allowing any context to override the Nav Bar color definitions

-  FORBIDDEN: Allowing content or layout to change the tab structure or colors

-  FORBIDDEN: Substituting "better" colors or a "better" navigation pattern — non-negotiable

 

 **iOS vs Android Differences**

 

 **Purpose**

 The Nav Bar adapts its material treatment based on platform. iOS uses a transparent Liquid Glass pill with backdrop blur for the active tab. Android uses a simpler flat pill with a subtle background fill. Both platforms use var(--color-text-primary) for enabled tab icons and labels — Neutral/900 (#1B1E21) in light, Neutral/050 (#FFFFFF) in dark.

 **Variants**

 

 **iOS active pill**

 rgba(178,178,178,0.15) background + backdrop-filter: blur(10px). Glass lensing effect.

 **Android active pill**

 rgba(178,178,178,0.15) background, no backdrop blur. Flat material fill.

 **iOS bar container**

 No backdrop blur on the bar itself. Shadow: 0 2px 8px rgba(0,0,0,0.03).

 **Android bar container**

 backdrop-filter: blur(4px) on the entire bar. No shadow.

 **Enabled color — Light (both)**

 Neutral/900 (#1B1E21) for icon and label.

 **Enabled color — Dark (both)**

 Neutral/050 (#FFFFFF) for icon and label.

 **Active color — Light (both)**

 Primary/600 (#0EB12E) for icon and label.

 **Active color — Dark (both)**

 Primary/600 (#6EFF8B) for icon and label.