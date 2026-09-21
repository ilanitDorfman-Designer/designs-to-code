 **Purpose**

 Cards are content containers that rely on background color and layout for visual separation. They must not use shadows, borders, or outlines.


 **Variants**

 **Neutral**

 Default card type with neutral semantic background.

 **Positive**

 Card with a positive/profit semantic.

 **Negative**

 Card with a negative/loss semantic.

 **Image Card**

 Uses an image as its full background. No additional types are allowed.

 **Usage Guidelines**

 

 Do

-  All card implementations must remain fully aligned with system-defined tokens and variants

-  Card colors must be selected exclusively from the approved color palette

-  Each card type (Neutral / Positive / Negative) must use its designated semantic color as defined in the system

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Using shadows under any circumstances

-  Including borders or outline strokes

-  Relying on elevation or outlines for visual separation — use background color and layout only

-  Mixing visual styles (e.g., adding shadows, borders, or unsupported colors)

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette

 

 **Image Card**

 **Purpose**

 The Image Card uses an image as its full background.

 **Usage Guidelines**

 

 Do

-  The image must cover the entire card area (full-bleed) with no visible gaps or framing

-  Overlay colors, gradients, or tints must follow predefined tokens only

 Avoid

-  Arbitrary image treatments or custom overlays

-  Displaying charts or graphs on top of Image Cards — chart/graph content slots are not supported on image backgrounds

 

 **Text Readability on Images**

 **Usage Guidelines**

 

 Do

-  Text placed on images must always meet accessibility contrast standards

-  A contrast-enhancing overlay (scrim) must be applied when needed to ensure readability

-  Overlay usage must follow predefined opacity and color tokens only

-  If sufficient contrast cannot be achieved, the image must be adjusted or replaced

-  Dynamic or uncontrolled images must include a default overlay to guarantee consistent readability

 Avoid

-  Placing text directly on complex or high-noise areas of the image

 

 **Color Usage**

 **Usage Guidelines**

 

 Do

-  Card colors must be selected exclusively from the approved color palette

-  Each card type (Neutral / Positive / Negative) must use its designated semantic color as defined in the system

 Avoid

-  Custom colors, opacity adjustments, or ad-hoc color variations are strictly prohibited

 

 **Glow Effect**

 

 **Usage Guidelines**

 

 Do

-  Glow is a supported visual enhancement only in Dark Mode

-  Glow must follow predefined tokens and intensity levels only

 Avoid

-  Using glow in Light Mode

-  Custom glow effects

 

 **Layout & Sizing**

 **Purpose**

 When all cards in a row fit within the available viewport width without requiring horizontal scrolling, each card must expand equally to fill the full row width. Cards share the available space evenly — no leftover gaps, no fixed widths, no ragged trailing space.

 **Usage Guidelines**

 

 Do

-  Cards in a row must distribute available width equally among themselves (e.g. flex: 1 or equal percentage widths)

-  Card rows must fill 100% of the container width when all cards fit without scrolling

-  Use a consistent gap between cards — spacing is subtracted from the total width before equal distribution

-  Ensure equal-width behavior is maintained across all breakpoints where cards fit in a single row

-  When a card row wraps to a new line, the same equal-distribution rule applies per row

 Avoid

-  Using fixed or max-width values that leave unused space at the end of a row

-  Allowing one card to be wider or narrower than its siblings within the same row

-  Relying on auto-sizing or content-driven widths — cards must be equal regardless of content length

-  Adding horizontal scroll when all cards can fit within the viewport at their minimum supported size

 

 **Nested Card Background — Strict Rule**

 **Purpose**

 When a card is placed inside another card (nested card), its background must not use any solid color (e.g. black, gray, etc.). The background of a nested card must always be #FFFFFF at 4% opacity — rgba(255, 255, 255, 0.04). This background must be applied as an overlay on top of the parent card background, not as an independent layer. The nested card background must not override or replace the parent card background. It must preserve the visual context of the parent card and appear as a subtle elevation / layering effect, not as a separate surface.

 **Usage Guidelines**

 

 Do

-  Use rgba(255, 255, 255, 0.04) as the background for nested cards

-  Keep the parent card visible through the nested card

-  Maintain subtle contrast and hierarchy between parent and nested card

 Avoid

-  Using solid backgrounds for nested cards (e.g. #000000, #1A1A1A)

-  Increasing opacity beyond 4%

-  Visually detaching the nested card from its parent