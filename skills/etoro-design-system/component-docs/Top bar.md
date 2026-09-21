 **Purpose**

 The Top Bar is a header component displayed at the top of the screen. It provides contextual navigation and screen-level actions. It follows a simple, consistent structure divided into three areas: Left (Leading) for 0–1 navigation icon, Center for an optional screen title, and Right (Trailing) for 1–2 contextual actions.


 **When to use**·

-  As the fixed top navigation header on every mobile screen

-  To provide contextual actions (share, notifications, overflow menu) for the current screen

-  To display a screen title for orientation and context

-  To offer navigation actions (back, menu, close) on the left side


 **Variants**

 **Default**

 Transparent bar with title and optional action pills. Background is transparent in the enabled (non-scrolled) state.

 **Scrolled**

 Bar adapts on scroll — Liquid Glass material appears with blur, tint, shadow, and scroll edge dissolve effect.

 **With Search**

 Replaces title and actions with a search pill input and cancel button.

 **With Progress Bar**

 Adds a segmented progress indicator beneath the nav area.

 **iOS vs Android**

 iOS uses Liquid Glass pills with lensing, rim borders, and interaction glow. Android uses flat, non-glass action groups.

 **Usage Guidelines**

 

 Do

-  Keep the Top Bar minimal and focused

-  Use familiar icons (back, menu, more)

-  Limit actions to what is essential for the current screen

-  Maintain consistent placement across all screens

-  Ensure touch targets are accessible (minimum 44pt)

-  Prefer icons over text buttons when possible

-  Use either icon-only or label-only buttons — never combine an icon with a text label in the Top Bar

-  Keep spacing consistent between actions

-  Follow platform conventions for gestures and navigation

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Adding more than 2 actions on the right side

-  Placing navigation actions (back, menu, close) on the right — they belong on the left

-  Mixing back and menu icons together on the same screen

-  Overloading the bar with low-priority actions

-  Using the Top Bar for content — it is strictly for navigation and screen-level actions

-  Combining an icon with a text label in a single button — Top Bar buttons must be icon-only or label-only, never both

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

-  Default — transparent background, glass pills visible on action groups only·

-  Scrolled — Liquid Glass material appears (blur, tint, shadow, specular rim, scroll edge dissolve)

-  Icon Hover — subtle inner glow radiates from center of the icon button

-  Icon Pressed — bright inner glow + spring scale down (0.92) with cubic-bezier overshoot

-  Search Focused — glass pill active with cursor, cancel button appears

 

 **Structure & Layout**

 **Purpose**

 The Top Bar is divided into three slots: Left (Leading) holds 0–1 navigation icon, Center holds an optional screen title, and Right (Trailing) holds 1–2 contextual actions. This three-slot layout ensures consistent structure across all screens.


 **Variants**

 **Left (Leading)**

 Maximum 1 icon. Optional (can be empty). Used for navigation actions only: back, menu, or close.

 **Center**

 Optional screen title. Centered between left and right slots.

 **Right (Trailing)**

 Minimum 1 action, maximum 2 actions. Used for contextual or screen-specific actions (icons or buttons).

 

 **Icon Placement Rules**

 **Purpose**

 Specific icons have designated positions and usage rules to maintain navigation consistency across the app.


 **Variants**

 **Back Button**

 Always placed on the left side. Highest priority navigation action. Should be the only icon on the left when present.

 **Menu (Hamburger)**

 Placed on the left side. Used only on top-level screens. Should not appear together with a back button.

 **Close / Cancel**

 Placed on the left side. Used in modal or temporary flows.

 **More (3 Dots)**

 Placed on the right side. Usually the last item (far right). Used for secondary or overflow actions.

 **Usage Guidelines**

 

 Do

-  Always place the back button on the left as the sole icon when present

-  Use the menu icon only on top-level screens, never alongside a back button

-  Place the overflow menu (3 dots) as the rightmost action

 Avoid

-  Mixing back and menu icons on the same screen

-  Placing close/cancel on the right side — it belongs on the left

-  Using the more menu as the primary action — it is for overflow only

 

 **Action Priority (Right Side)**

 **Purpose**

 Actions on the right side are arranged from left to right by importance: primary action first, then secondary action. Maximum 2 actions.

 **Usage Guidelines**

 

 Do

-  Place the primary action closest to the center (leftmost in the right slot)

-  Place the secondary action after the primary action

-  Limit to a maximum of 2 actions on the right side

 Avoid

-  Placing low-priority actions before high-priority ones

-  Using more than 2 actions on the right side

-  Placing navigation actions (back, menu) on the right side

 

 **Glass Pills (Action Groups)**

 **Purpose**

 Action buttons are grouped inside transparent Liquid Glass capsules that float on the bar. Each pill has its own specular highlight, thin rim border, and depth shadow. Icons inside illuminate from within on interaction.

 **Variants**

 

 **Single Action**

 One icon button inside a glass pill (e.g. more menu). Renders as a circle.

 **Multi Action**

 Multiple icon buttons grouped inside a single glass pill (e.g. share + notifications). Renders as a rounded capsule.

 **Et-Button**

 Pill-shaped label-only action button. Supports green tinted glow on interaction. No icons — text only.

 **Usage Guidelines**

 

 Do

-  Use 0.5px solid rgba(255,255,255,0.35) border — thin and uniform

-  Apply backdrop-filter with blur + saturate + brightness + contrast for authentic lensing

-  Add inset top highlight (1px) and subtle bottom shadow rim

 Avoid

-  Making pills opaque — they should be transparent like the bar

-  Using different glass styling than the bar (keep material consistent)

 

 **Behavior**

 **Purpose**

 The Top Bar remains fixed at the top of the screen. Actions should provide immediate feedback. Navigation actions (back/menu) should behave consistently across the app.

 **States & Behavior**

 ·

-  Fixed position: The bar stays at the top regardless of scroll position

-  Hover: subtle radial glow at icon center (rgba(255,255,255,0.35))

-  Press: bright radial glow (rgba(255,255,255,0.85)) + scale(0.92) with spring curve

-  Scroll transition: transparent background transitions to Liquid Glass material on scroll

-  Glass transitions: 380ms cubic-bezier(0.25, 0.1, 0.25, 1) for material state changes