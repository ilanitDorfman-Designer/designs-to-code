 **Purpose**

 A Checkbox is a binary input control that allows users to select one or more options, or to toggle a single independent state. The system includes three distinct checkbox types — Square, Round, and Add — each with a strict context of use. They are NOT interchangeable.


 **When to use**

-  Multiple selection is allowed → use Checkbox

-  Adding an item to a saved list (watchlist, favorites, bookmarks) → use Add Checkbox

-  Single selection is required → use Radio Button instead

-  Immediate toggle action is required → use Switch instead


 **Variants**

 **Square Checkbox**

 Used exclusively for form-related inputs, agreements, confirmations, and legal consent. Must always be paired with a text label.

 **Round Checkbox**

 Used exclusively inside list items for selecting content entities (e.g., files, tasks, messages). The selection is temporary and does not persist after the user leaves the screen.

 **Add Checkbox**

 Used exclusively inside list items for adding or removing an item from a saved collection — such as a watchlist, favorites, or bookmarks. Shows a "+" when not added, transitions to a checkmark when saved. Unlike the Round Checkbox, this represents a persistent action — the item remains saved after the user navigates away.

 **Usage Guidelines**

 

 Do

-  The entire row — checkbox and its label text — must be a single tap target. Tapping the label must toggle the checkbox, not just tapping the box itself

-  Interaction must toggle between Checked and Unchecked states

-  Each checkbox must have a clear, descriptive label

-  Labels must be explicit and unambiguous — describe the exact outcome of selection

-  Must support keyboard interaction: Tab to focus, Space to toggle

-  Must expose correct semantic role (checkbox)

-  Must meet contrast accessibility standards

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)


 Avoid

-  Using Round Checkbox inside forms — it is for list selection only

-  Using Round Checkbox for agreements or confirmations

-  Using Round Checkbox next to standalone text labels

-  Using Square Checkbox for selecting list items

-  Using Square Checkbox for bulk selection patterns

-  Mixing checkbox types within the same pattern

-  Substituting one checkbox type for the other — they are not interchangeable

-  Using vague labels like "Agree" or "Submit option" — labels must describe the exact outcome

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

-  Unchecked — the default resting state with no selection

-  Checked — the active selected state

-  Indeterminate — optional, may only be used in hierarchical selection scenarios (e.g., parent checkbox with mixed child states)

-  Disabled — must prevent all interaction and appear visually muted

 

 **Round Checkbox — List Selection**

 **Purpose**

 The Round Checkbox is reserved exclusively for selecting content entities within lists. It must appear inside list items and be visually aligned with the content row.

 **Usage Guidelines**

 

 Do

-  Use only inside list items (rows, cards, list entries)

-  Visually align with the content item it represents

-  Use for selecting content entities — files, tasks, messages, etc.

-  Tapping anywhere on the list row must toggle the checkbox — the entire row is the tap target, not just the circle

 Avoid

-  Using inside forms

-  Using for agreements or confirmations

-  Using next to standalone text labels outside of a list context

 

 **Add Checkbox — Save to Collection**

 

 **Purpose**

 The Add Checkbox is for saving or removing an item from a persistent collection like a watchlist, favorites, or bookmarks. It is visually distinct — showing a "+" icon when the item has not been added yet and switching to a checkmark once saved. The key difference from the Round Checkbox: the Add Checkbox represents a save action that persists, while the Round Checkbox represents a temporary in-screen selection.

 **Usage Guidelines**

 

 Do

-  Use only inside list items where the action is "add to saved list" or "remove from saved list"

-  The entire list row must be the tap target — tapping anywhere on the row toggles the save state

-  Use for collections that persist beyond the current screen — watchlists, favorites, bookmarks, saved searches

-  Show the "+" icon in the empty state to clearly communicate the add action

 Avoid

-  Using the Add Checkbox for temporary in-screen multi-select — use Round Checkbox instead

-  Using the Add Checkbox in forms or for agreements — use Square Checkbox instead

-  Using the Add Checkbox when the selection does not persist after leaving the screen

-  Mixing Add Checkbox and Round Checkbox in the same list

 

 **Square Checkbox — Form & Consent**

 

 **Purpose**

 The Square Checkbox is used for all form-related inputs and consent patterns. It must always be paired with a descriptive text label.

 **Usage Guidelines**

 

 Do

-  Use for all form-related inputs

-  Use for agreements, confirmations, and legal consent

-  Always pair with a text label

 Avoid

-  Using for selecting list items

-  Using for bulk selection patterns

-  Displaying without an accompanying text label

 

 **Content & Label Rules**

 **Purpose**

 Labels are a critical part of the checkbox pattern. Every checkbox must have a label that clearly describes the outcome of toggling it.

 **Variants**

 

 **Valid: "I agree to the Terms & Conditions"**

 Explicit — the user knows exactly what they are agreeing to.

 **Valid: "Subscribe to newsletter"**

 Clear outcome — the user understands the result of checking.

 **Valid: "Enable email notifications"**

 Describes the exact setting being toggled.

 **Invalid: "Agree"**

 Too vague — does not describe what the user is agreeing to.

 **Invalid: "Submit option"**

 Ambiguous — does not describe the actual outcome.

 **Usage Guidelines**

 

 Do

-  Labels must be explicit and unambiguous

-  Labels must describe the exact outcome of selection

-  Use sentence case for label text

 Avoid

-  Using single-word labels that lack context (e.g., "Agree")

-  Using labels that do not describe the specific outcome

 

 **Valid vs Invalid Usage Examples**

 

 **Purpose**

 Use these examples as a reference to determine correct checkbox type selection.


 **Variants**

 **Selecting multiple files in a file manager**

 Round Checkbox — temporary content selection within a list.

 **Selecting multiple tasks in a task list**

 Round Checkbox — temporary content selection within a list.

 **Adding a stock to a watchlist**

 Add Checkbox — persistent save action to a saved collection.

 **Bookmarking an article for later**

 Add Checkbox — persistent save action to a saved collection.

 **Adding a contact to favorites**

 Add Checkbox — persistent save action to a saved collection.

 **"I agree to the Terms & Conditions"**

 Square Checkbox — legal consent in a form context.

 **"Enable email notifications" (form setting)**

 Square Checkbox — form-related toggle.

 **Usage Guidelines**

 

 Avoid

-  Using Round Checkbox for agreements

-  Using Round Checkbox inside forms

-  Using Square Checkbox for selecting list items

-  Using Add Checkbox for temporary multi-select (e.g., selecting files to delete)

-  Using Round Checkbox for watchlist/favorites actions — use Add Checkbox instead

-  Mixing checkbox types within the same pattern

 

 **Summary Rules (Non-Negotiable)**

 **Purpose**

 Round Checkbox = TEMPORARY LIST SELECTION ONLY. Square Checkbox = FORM + CONSENT ONLY. Add Checkbox = PERSISTENT SAVE TO COLLECTION ONLY. The three types must never be mixed or substituted.

 **Usage Guidelines**

 

 Do

-  Round Checkbox is used exclusively for temporary in-screen list selection

-  Square Checkbox is used exclusively for form inputs and consent

-  Add Checkbox is used exclusively for saving items to a persistent collection (watchlist, favorites, bookmarks)

-  Always match the checkbox type to its correct context


 Avoid

-  Mixing or substituting one checkbox type for the other

-  Using Round Checkbox outside of list item contexts

-  Using Square Checkbox for list-based selection patterns

-  Using Add Checkbox when the selection is temporary or does not persist

-  Using Round Checkbox when the action is saving to a persistent collection