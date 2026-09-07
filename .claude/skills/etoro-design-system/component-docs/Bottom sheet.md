 **What a bottom sheet is**

 A surface that slides up from the bottom edge of the screen, sitting on top of (or partially over) the current content. It can be modal (with a scrim, blocking the underlying screen) or persistent/non-modal (rest of the UI stays interactive, e.g. a mini-player). Supports variable heights - peek, half, full - often via a drag handle, and is typically dismissed by swiping down, tapping a close control, or tapping the scrim.

 

 **Bottom sheet vs. full-page popup (full-screen modal)**

 **Use a bottom sheet when**

-  Decisions that must be made before proceeding, especially destructive/irreversible ones

       Short, single-purpose confirmations or alerts (1–2 actions)

-  The task is short/contained - a few options, a quick action, a preview

-  You want to preserve context - user can still sense/glimpse the underlying screen, feels lighter and less disruptive

-  Content length varies - expandable snap points handle short or long content gracefully

-  It's a mobile, touch-first flow - reachable near the thumb, quick in-and-out interaction

-  The action is reversible/low-stakes (filters, share options, quick edit)

 

 **Use a bottom sheet when**

-  The task requires focus and has multiple steps or substantial input (forms, onboarding, checkout, editing flows)

-  Content doesn't fit comfortably in a partial-height surface - long forms, multi-section content, embedded navigation

-  You want to fully remove distraction/context from the previous screen - signals "you're now in a separate flow"

-  The action needs more deliberate commitment (higher-stakes edits, multi-field forms) or its own internal navigation (back button, steps, tabs)

-  On larger/desktop screens, where a bottom-anchored sheet feels awkward and a centered/full-screen overlay reads more naturally

-  Quick heuristic

-  Quick, glanceable, contextual → bottom sheet

-  Deep, multi-step, or content-heavy → full-page popup

-  Want to keep a sense of the underlying screen → sheet; want full focus/isolation → full-page

 

 **Use a full-page popup when**

-  The task requires focus and has multiple steps or substantial input (forms, onboarding, checkout, editing flows)

-  Content doesn't fit comfortably in a partial-height surface - long forms, multi-section content, embedded navigation

-  You want to fully remove distraction/context from the previous screen - signals "you're now in a separate flow"

-  The action needs more deliberate commitment (higher-stakes edits, multi-field forms) or its own internal navigation (back button, steps, tabs)

-  On larger/desktop screens, where a bottom-anchored sheet feels awkward and a centered/full-screen overlay reads more naturally

-  Quick heuristic

-  Quick, glanceable, contextual → bottom sheet

-  Deep, multi-step, or content-heavy → full-page popup

-  Want to keep a sense of the underlying screen → sheet; want full focus/isolation → full-page

 

 **Use a full-page popup when**

 

 **When you need an explicit close button**

-  The sheet is full-screen or tall enough that swipe-to-dismiss isn't easily reachable/discoverable

-  Content is scrollable — a swipe-down gesture can conflict with scrolling, so don't rely on gesture alone

-  The flow involves input or multi-step actions (forms, wizards) where "Cancel"/"Done" communicates intent better than a bare X 

-  You need a reliable, discoverable dismiss path for accessibility (screen reader and keyboard users can't "swipe")

 

  **When you can skip it**

-  Non-modal/persistent sheets (e.g. a mini player, a map info sheet) that don't block the rest of the screen — these usually don't need a close action at all 

-  Short, simple modal sheets where a visible drag handle + scrim-tap-to-dismiss is enough

 

 **Placement & affordance**

-  Pair a drag handle (grabber) centered at the top with the close button — the handle signals "swipeable," the button gives a guaranteed tap target 

-  Top-right is the most common convention for an X icon (mirrors dialogs); top-left is fine if paired with a centered title

-  Support at least two dismiss paths where possible: tap the X, swipe down, and/or tap the scrim - but disable scrim-tap-to-dismiss if there's unsaved/destructive state

-  If dismissing would discard unsaved input, the X should trigger a confirmation rather than silently closing 

-  Don't duplicate the action - avoid showing both an X and a "Cancel" button that do the same thing; pick one per context (X for simple browse/info sheets, Cancel/Done for input flows)

 

 

 

 