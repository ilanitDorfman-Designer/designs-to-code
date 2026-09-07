 **Purpose** Toasts provide temporary, **non-blocking feedback** about system events or user actions. They confirm what just happened or inform about background processes without interrupting the user’s flow.

 

 Toasts may be **passive** (auto-dismiss only)  **or actionable** (include an action or dismiss control).

 

 **When to use**

-  Confirming successful actions (e.g. order received, settings updated)

-  Informing about background or async processes

-  Communicating transient system states (e.g. offline, syncing)

-  Providing lightweight feedback that does not require immediate user decision

-  Offering a reversible action (e.g. Undo) without interrupting workflow

 

 **Variants**

-  **Neutral** Informational updates or system messages.

 

-  **Success** Confirms successful completion 

-  **Error** Indicates a failure or problem that occurred

 

 **Behavioral Variants ** **Passive Toast**

-  No action button

-  Auto-dismiss only

 

 Used for confirmation and lightweight feedback.

  

 **Actionable Toast (Snackbar behavior)**

-  Includes action button (e.g. Undo, Retry) and/or close control

-  Auto-dismiss pauses while user interacts

 

 Used when a reversible or contextual action is available.

 

 **Usage Guidelines  Do - **Use toasts for temporary, contextual feedback

-  Keep messages concise and action-oriented

-  Use Success to confirm actions users expect feedback for

-  Use Error only when awareness is sufficient (not decision-making)

-  Use actionable toasts when an optional reversible action exists

-  Allow optional visuals (icon, avatar, logo) when they add clarity

-  Place toasts consistently and stack them minimally

-  Ensure actionable toasts include a clear primary action label  **Avoid**

-  Using toasts for critical errors that require user decision — use Dialog

-  Displaying long explanations or instructions

-  Showing multiple unrelated toasts simultaneously

-  Using toasts as the only feedback for destructive or irreversible actions

-  Creating both a toast and a snackbar as separate components 

-  **States & Behavior**

-  Appear automatically and do not steal focus

-  Auto-dismiss after a predefined duration

-  Actionable toasts pause auto-dismiss while hovered or focused

-  Close control immediately dismisses the toast

-  Not persistent across navigation

-  Only one toast visible at a time (or stacked in a controlled queue)

-  Content announced to screen readers

-  Error toasts may remain visible slightly longer than neutral/success

-  Toasts do not block interaction with background content