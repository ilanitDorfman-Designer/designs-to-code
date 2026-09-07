 **Purpose**

 Toggle switches control a single binary setting. They immediately turn a feature or preference on or off. Toggle groups allow users to select one option from a set of related choices — used to switch views, modes, or representations without leaving the current context.

 **When to use**

 

-  Enabling or disabling a setting (Toggle Switch)

-  Controlling system or account preferences (Toggle Switch)

-  Applying an immediate, reversible state change (Toggle Switch)

-  Switching between views (e.g. Chart / Table) (Toggle Group)

-  Changing display formats (e.g. % / $) (Toggle Group)

-  Selecting one mode from a small, fixed set (Toggle Group)

-  Toggling between two opposite states (e.g. On / Off representations) (Toggle Group)

-  Choosing between semantic opposites (e.g. Positive / Negative) (Toggle Group)


 **Variants**

 **Toggle Switch — Off**

 Binary toggle, off state. With or without accompanying label.

 **Toggle Switch — On**

 Binary toggle, on state. With or without accompanying label.

 **Toggle Switch — Disabled**

 Non-interactive state. With or without accompanying label.

 **Standard Toggle Group**

 Neutral mode or view selection. Options may be text-only, icon-only, or icon + text. Selected state uses neutral emphasis styling.

 **Verdict Toggle**

 Semantic two-option toggle for positive/negative states (e.g. Buy/Sell, Gain/Loss). Selected state uses Verdict color (Positive or Negative). Unselected remains neutral.

 **Usage Guidelines**

 

 Do

-  Use toggle switches only for binary states (on / off)

-  Apply the change immediately on interaction

-  Use clear, persistent labels that describe the state

-  Place toggles in settings or preference contexts

-  Use Toggle Group for mutually exclusive selections

-  Keep number of Toggle Group options small (2–4 recommended)

-  Use Standard Toggle for view or format changes

-  Use Verdict Toggle only when the choice represents semantic polarity

-  Keep labels short and scannable

-  Use icons only when meaning is universally understood

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)


 Avoid

-  Using toggles for navigation or filtering

-  Using toggles when confirmation is required — use Button + Dialog instead

-  Using toggles for multi-option selection

-  Requiring a separate "Save" action after toggling

-  Using Toggle Groups for actions (use Button)

-  Using Toggle Groups for long or dynamic lists (use Dropdown)

-  Using Verdict Toggle for neutral comparisons

-  Using Primary color for selected state (unless system defines it explicitly)

-  Applying Verdict colors to both options simultaneously

-  Using more than two options in a Verdict Toggle

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

 Toggle Switch: Resting (On / Off), Disabled. State changes immediately on interaction. Supports keyboard and screen-reader interaction. Toggle Group: One option is always selected. Selection updates immediately on interaction. No confirmation or "Apply" action required. Each option supports Resting, Hover, Active (pressed), Focus, and optional Disabled state. In Standard Toggle Groups, the selected option uses neutral emphasis styling. In Verdict Toggles, only the selected option uses its corresponding Verdict color. Arrow keys move selection between options. Selection is announced to screen readers. Meaning must not rely solely on color.