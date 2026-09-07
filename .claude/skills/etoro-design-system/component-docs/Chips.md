 **Purpose**

 Chips are interactive, compact elements used to filter, select, or trigger lightweight actions. They help users refine content or make quick choices without navigating away.


 **When to use**

-  Filtering content (e.g. Asset type, Time range, Risk level)

-  Representing selectable options in a compact format

-  Displaying applied filters that can be removed

-  Quick, low-friction actions inside dense layouts

-  Multi-select inputs when space is limited


 **Variants**

 **Action Chip (Assist)**

 Triggers a lightweight action inline. Supports leading icon, trailing icon, or both.

 **Filter Chip**

 Toggles a filter on/off. Leading icon + label + chevron (↓ default, ↑ selected). Selected state: neutral-900 bg, white text.

 **Choice Chip (Suggestion)**

 Text-only chip for single selection from a predefined set. Behaves like radio buttons. No icons.

 **Input Chip**

 Represents a removable selection (e.g. a person or asset). Avatar + label + × remove button.

 **Usage Guidelines**

 

 Do

-  Use chips when users need to filter or refine content quickly

-  Use Filter Chips for on/off filtering and multi-select filters

-  Use Input Chips to represent selected items that can be removed

-  Keep labels short (1–2 words)

-  Use icons only when they improve recognition

-  Provide clear selected and unselected states

-  Place chips near the content they affect (filters above lists, etc.)

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Using chips for non-interactive labels — use Tag/Badge instead

-  Using chips to communicate system status or validation feedback — use Verdict messaging

-  Overloading chips with long text or complex content

-  Using chips as primary navigation or main CTAs

-  Mixing chips and tags in the same pattern without clear intent

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

 Resting (unselected), Hover, Active (pressed), Selected (Filter + Choice Chips), Focus (keyboard), Disabled. Filter Chips show chevron-up when selected. Input Chip × is always visible and removes the chip on click. Chips are keyboard accessible and announce state changes to screen readers.

 

 **Overflow Behavior (Non-Negotiable)**

 **Purpose**

 When chips exceed the horizontal viewport, the container must become scrollable horizontally. A gradient mask must be applied at the edge of the container to indicate additional off-screen content. Failure to include a gradient mask in overflow states is considered a violation of the component behavior rules.


 **Usage Guidelines**

 Do

-  

-  The chip container must be scrollable horizontally when chips exceed the available width

-  A gradient mask must be applied at the edge of the container to indicate additional off-screen content

-  The gradient mask must remain visible as long as there is hidden content beyond the scroll edge

-  The gradient mask must clearly signal to the user that horizontal scrolling is available

 Avoid

-  

-  Wrapping chips to a new line when they exceed the viewport — use horizontal scroll instead

-  Omitting the gradient mask in overflow states — this is a component behavior violation

-  Hiding overflow content without any visual indicator

-  Using truncation or ellipsis on the chip container instead of horizontal scrolling