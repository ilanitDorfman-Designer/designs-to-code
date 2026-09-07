 **Purpose**

 Buttons trigger actions that change state, submit data, or advance a user flow.


 **When to use**·

-  Submitting, confirming, saving, or creating·

-  Advancing through a flow (e.g. Next, Continue)

-  Triggering immediate system actions


 **Variants**

 **Primary**

 Used for the main action in a view. Highest visual emphasis.

 **Secondary**

 Used for supporting or alternative actions.

 **Ghost**

 Used for low-emphasis or contextual actions, such as in tables or toolbars.

 **Usage Guidelines**

 

 Do

-  Use Primary for the single most important action per view

-  Use Secondary for supporting or alternative actions

-  Use Ghost for low-emphasis or contextual actions (e.g. tables, toolbars)

-  Use clear, verb-based labels

-  Icons inside buttons must always match the button text color — use currentColor so the icon inherits the text color automatically

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Using buttons for navigation — use Link instead

-  Showing multiple primary buttons in the same context

-  Using buttons for binary on/off states — use Toggle instead

-  Hiding critical actions behind ghost buttons

-  Using a different color for icons than the button text — icons and text must always share the same color

-  Hardcoding icon colors — always use currentColor so icons adapt to button type, color, and state

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

 Resting, Hover, Active, Disabled, Loading. Buttons are keyboard accessible and meet minimum touch targets.

 

 **FAB**

 **Purpose**

 The primary Floating Action Button (FAB) is a high-emphasis circular button that triggers the most important or frequent action on a screen. It can open a FAB Menu or execute a direct action.


 **When to use**·

-  For the single most important action in a view

-  When the action is primary and should always be visible

-  As the trigger for a FAB Menu to reveal secondary actions



 **Variants**

 **Icon — L (44×44)**

 Compact circular FAB. Default icon is plus, switches to close (×) in active state.

 **Icon — XL (56×56)**

 Larger circular FAB for more prominent placement.

 **Label — L (94×44)**

 Pill-shaped FAB with icon + text label. Active state shows close icon + "Close" label.

 **Label — XL (110×56)**

 Larger pill FAB for more prominent placement.

 **Usage Guidelines**

 

 Do

-  Use only one FAB per screen

-  Use for the primary, most-used action

-  Change icon to close (×) when FAB Menu is open

-  Maintain consistent placement (bottom-right)

 Avoid

-  Using multiple FABs on the same screen

-  Using for destructive or infrequent actions

-  Hiding behind content or overlapping key UI

-  Using for navigation — use Tab Bar instead



 **States & Behavior**

-  Default — bg #0EB12E, white icon/text

-  Hover — bg #10A12C (darker green)

-  Active — bg #0EB12E, icon changes to × (close), label shows "Close"

-  Shadow — 0 10px 20px rgba(27,30,33,0.06) on all states

 

 **FAB Action Items**

 **Purpose**

 FAB Action Items represent secondary actions revealed from a FAB Menu. They support the primary action without competing with it visually.



 **When to use**

-  Only inside a FAB Menu

-  For actions directly related to the primary FAB action

-  When grouping contextual actions



 **Variants**

 **Icon-only**

 A circular FAB showing only an icon. Used when space is limited or the action is self-evident.

 **Icon + Label**

 A pill-shaped FAB with an icon and text label. Use when clarity is needed.

 **Disabled**

 Greyed out — background #F2F2F2, icon/text #CCCCCC. Action is unavailable.

 **Usage Guidelines**

 

 Do

-  Keep actions short and action-based (e.g., "Document", "Message")

-  Maintain consistent spacing and alignment

-  Ensure sufficient contrast

-  Preserve visual hierarchy beneath the main FAB


 Avoid

-  Using outside FAB Menu context

-  Making them visually stronger than the main FAB

-  Including destructive or unrelated actions


 **States & Behavior**

-  Resting

-  Hover

-  Active (pressed)

-  Focus (keyboard)

-  Disabled

-  Selecting an action triggers the action and closes the menu

-  Do not include loading states



 **Composition**

 A FAB Menu is composed of:

-  Primary FAB (Trigger)

-  FAB Action Items (Sub-actions)

 

 **FAB Menu**

 **Purpose**

 A FAB Menu expands from a Floating Action Button to reveal multiple related actions. It groups secondary actions under a single primary trigger.


 **When to use**

-  When multiple closely related actions exist

-  When screen space is limited

-  When actions are contextual to the current view



 **Variants**

 **Vertical expansion**

 Action items stack upward from the primary FAB.

 **With labels**

 Action items show icon + label for clarity.

 **Icon only**

 Action items show icon only when space is limited.


 **Usage Guidelines**

 Do

-  Keep actions limited (3–5 max recommended)

-  Ensure all actions are closely related

-  Use clear iconography

-  Close menu after selection


 Avoid

-  Using as a replacement for navigation menus

-  Including unrelated actions

-  Overloading with too many options



 **States & Behavior**

-  Default state: Collapsed·

-  On activation: Expands to reveal actions

-  Main FAB icon changes to Close icon

-  Selecting an action collapses the menu

-  Clicking outside collapses the menu

-  ESC closes the menu

-  Fully keyboard accessible



 **Composition**

 A FAB Menu is composed of:

-  Primary FAB (Trigger)

-  FAB Action Items (Sub-actions)





