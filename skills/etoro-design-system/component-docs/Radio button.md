 **Purpose**

 A Radio Button is a single-selection input control that allows users to choose exactly one option from a predefined set. Radio buttons enforce mutual exclusivity — selecting one option must automatically deselect all others in the same group.


 **When to use**·

-  Exactly one option must be selected from a set → use Radio Button

-  Multiple selection is allowed → use Checkbox instead

-  Immediate toggle action is required → use Switch instead


 **Usage Guidelines**

 Do

-  Must be used only as part of a group of options — never standalone

-  Must allow one and only one selected option at a time

-  Must have a clear group label or question

-  All options must be presented visibly — no hidden states

-  Selecting a radio option must select the chosen option and deselect all others in the group

-  One option should be selected by default when appropriate

-  Each option must have a clear, descriptive label

-  The entire row — radio circle and its label text — must be a single tap target. Tapping the label must select the option, not just tapping the circle itself

-  The group must have a descriptive label

-  Must support keyboard navigation: Tab to focus group, Arrow keys to move between options, Space to select

-  Must expose correct semantic roles (radiogroup, radio)

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Allowing multiple selections — radio buttons are single-selection only

-  Using as a standalone control without other options in a group

-  Using for independent on/off states — use Switch or Checkbox instead

-  Using in lists for item selection — lists imply multi-selection or independent actions

-  Using alongside content lists (e.g., files, tasks, messages)

-  Using for bulk or row-based selection

-  Using vague labels like "Option 1" or "Select this" — labels must describe the outcome

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

-  Unselected — the default resting state with no selection

-  Selected — the active chosen option; only one per group

-  Disabled — must prevent all interaction and appear visually muted

 

 **Radio Button Group Rules**

 **Purpose**

 Radio buttons must always exist within a group. The group enforces mutual exclusivity — only one option can be selected at any time. If no default is selected, the user must select one before proceeding (if required by the form).

 **Usage Guidelines**

 

 Do

-  Always present radio buttons as a group of 2 or more options

-  Provide a clear group label or question above the options

-  Pre-select a sensible default option when one exists

-  Ensure all options are visible and not hidden behind interactions


 Avoid

-  Using a single radio button in isolation — it has no meaning without alternatives

-  Hiding options behind dropdowns or progressive disclosure within a radio group

-  Allowing the group to have zero or multiple selected options

 

 **List Usage Restriction (Non-Negotiable)**

 **Purpose**

 Radio buttons must never be used in list contexts. Lists imply multi-selection or independent actions, while radio buttons enforce single selection within a defined set. This restriction is non-negotiable.

 **Usage Guidelines**

 

 Avoid

-  Using radio buttons in lists for item selection

-  Placing radio buttons alongside content lists (files, tasks, messages)

-  Using radio buttons for bulk or row-based selection

-  Substituting radio buttons where checkboxes or switches are appropriate

 

 **Content & Label Rules**

 **Purpose**

 Labels must be mutually exclusive and clearly distinct. Each label must describe the outcome of selecting that option.

 **Variants**

 

 **Valid: "Monthly billing"**

 Clear, distinct option describing the billing cadence.

 **Valid: "Yearly billing"**

 Mutually exclusive with Monthly — user understands the difference.

 **Invalid: "Option 1"**

 Vague — does not describe what the user is selecting.

 **Invalid: "Select this"**

 Ambiguous — provides no information about the outcome.

 **Usage Guidelines**

 

 Do

-  Labels must be mutually exclusive and clearly distinct from one another

-  Labels must describe the outcome of selection

-  Use sentence case for label text

 Avoid

-  Using generic labels that lack context (e.g., "Option 1", "Option 2")

-  Using labels that overlap in meaning or could apply to multiple options

 

 **Valid vs Invalid Usage Examples**

 **Purpose**

 Use these examples as a reference to determine correct control selection.

 **Variants**

 

 **Selecting a payment method (Credit Card / PayPal / Bank Transfer)**

 Radio Button — exactly one payment method must be chosen.

 **Choosing a subscription plan (Basic / Pro / Enterprise)**

 Radio Button — plans are mutually exclusive.

 **Selecting delivery speed (Standard / Express)**

 Radio Button — only one speed can apply.

 **Usage Guidelines**

 

 Avoid

-  Selecting multiple files in a list → use Checkbox instead

-  "I agree to Terms" → use Checkbox instead

-  Independent settings toggles → use Switch or Checkbox instead

-  Using radio buttons inside item lists

 

 **Summary Rules (Non-Negotiable)**

 **Purpose**

 Radio Button = SINGLE SELECTION ONLY. Must be used within a defined group of options. Must never be used in lists. Must never allow multiple selections.

 **Usage Guidelines**

 

 Do

-  Radio buttons are used exclusively for single selection within a group

-  Always present as a group with a clear label

-  Ensure mutual exclusivity — selecting one deselects all others

 Avoid

-  Using radio buttons outside of a defined option group

-  Using radio buttons in list contexts

-  Allowing more than one selected option in a group

-  Substituting radio buttons for checkboxes, switches, or other controls