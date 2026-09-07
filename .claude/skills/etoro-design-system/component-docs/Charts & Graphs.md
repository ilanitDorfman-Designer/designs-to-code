 **Purpose**

 Charts & Graphs are data visualization components for financial performance. Vertical bar charts (Asset Chart, Performance Bar Chart) share a verdict color system — Positive (green) for gains and Negative (red) for losses — and must use gradient fills. The Breakdown Chart visualizes proportional distribution using a fixed 8-color category palette across Horizontal Stacked Bar or Ring Chart formats.

 **Variants**

 

 **Positive (Green)**

 Gradient from verdict/positive/400 (#6EFF8B) to verdict/positive/600 (#0EB12E). Used for gains, profit, and upward movement.

 **Negative (Red)**

 Gradient from verdict/negative/600 (#D12515) to verdict/negative/400 (#FF665E). Used for losses, decline, and downward movement.

 **Usage Guidelines**

 

 Do

-  

-  All bars must use gradient fills — never solid colors

-  All charts must use the predefined verdict design tokens for color

-  Only two color variants are allowed: Positive (green) and Negative (red)

-  Bar corners must use 4px radius on the open end (top for positive, bottom for negative)

-  Bars must distribute equally across the available width (flex: 1)

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  

-  Using solid colors for bars — gradient fills are required in all cases

-  Using custom colors outside the predefined chart design tokens

-  Creating additional color variants beyond Positive and Negative

-  Removing corner radius from bars

-  Using different gradient directions than specified per chart type

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette

 

 **Asset Chart**

 

 **Purpose**

 The Asset Chart displays relative performance across market instruments. It shows up to 6 items in a single row with gradient bars, a glow reflection beneath, and asset icons with ticker labels below. Each bar is a split-column pair (two halves) with 8px top corner radius.

 **Variants**

 

 **Positive**

 All bars use the green gradient. Represents overall positive performance across all displayed assets.

 **Negative**

 All bars use the red gradient. Represents overall negative performance across all displayed assets.

 **Usage Guidelines**

 

 Do

-  

-  Display a maximum of 6 items per row — never exceed this limit

-  Always include a label below each bar — either a market asset icon or text

-  Asset icons must use the catalog asset icons (from the Assets page), not custom icons

-  Maintain 24px (6x spacing) between the bar area and the asset labels below

-  Include a glow reflection beneath the bars using the verdict color at 60% opacity with 28px blur

-  Bars must decrease in height from left to right to represent ranked performance

 Avoid

-  

-  Including more than 6 items in a single Asset Chart row

-  Omitting labels — every bar must have a label beneath it

-  Mixing positive and negative bars within the same Asset Chart instance

-  Using custom or placeholder icons — always use the catalog asset icons

-  Placing asset labels without consistent spacing from the chart bars

 

 **Performance Bar Chart**

 

 **Purpose**

 The Performance Bar Chart displays time-based performance with positive bars rising above a 0% center line and negative bars descending below it. It supports three time-range types and interactive bar selection. Axis labels (10%, 0%, -10%) float as glass pills on the right side.

 **Variants**

 

 **Months (full)**

 All 12 monthly slots display data. Each bar shows either a positive or negative value for that month.

 **Months (partial)**

 Only some monthly slots have data. Remaining slots display empty placeholder bars at 65% opacity with neutral fill.

 **Years**

 Fewer, wider bars representing annual data. Typically 3–5 bars.

 **Usage Guidelines**

 

 Do

-  

-  Positive bars must grow upward from the center line, negative bars must grow downward

-  Use glass pill axis labels (backdrop-filter blur) positioned on the right side for 10%, 0%, -10%

-  Empty time slots must show a neutral placeholder bar at 65% opacity — never leave gaps

-  When a bar is selected (pressed), apply a glow overlay at 50% opacity in the bar direction

-  When a bar is selected, all other bars must dim to 20% opacity (low emphasis)

-  Clicking a selected bar must deselect it and restore all bars to default state

-  Maintain 2px gap between adjacent bars

 Avoid

-  

-  Mixing positive and negative colors within a single bar — each bar is one direction only

-  Omitting empty placeholder bars for time slots without data

-  Using more than one selected bar at a time

-  Removing axis labels — they provide essential context for reading the chart values

-  Making the glow overlay opaque — it must remain at 50% opacity

 

 **Bar States**

 

 **Purpose**

 Individual bars in the Performance Bar Chart support four visual states that control interactive behavior. Only one bar can be in the Pressed state at a time.

 **Variants**

 

 **Default**

 Normal bar with full gradient fill at 100% opacity. This is the resting state when no bar is selected.

 **Pressed (Selected)**

 The active selected bar. Displays at full opacity with an additional glow overlay at 50% opacity. The glow gradient runs from the verdict color to transparent in the direction away from the center line.

 **Empty**

 A time slot with no data. Renders as a neutral fill (tertiary-neutral-text / #f2f2f2) at 65% opacity. Empty bars are not selectable.

 **Low Emphasis**

 All non-selected bars when one bar is in the Pressed state. Renders at 20% opacity to visually recede and highlight the selected bar.

 **Usage Guidelines**

 

 Do

-  

-  Transition between states must use 150ms ease timing

-  Pressed state glow must use the same verdict gradient tokens as the bar fill

-  Empty state must use the neutral fill token, never a verdict color

-  Low emphasis must apply to all bars including empty bars when another bar is selected

 Avoid

-  

-  Applying the Pressed glow to more than one bar simultaneously

-  Using different opacity values than specified (65% empty, 20% low emphasis, 50% glow)

-  Animating the glow overlay independently from the bar selection

-  Making empty bars selectable — they should not respond to interaction

 

 **Breakdown Chart**

 

 **Purpose**

 The Breakdown Chart visualizes proportional data distribution across categories. It supports two chart types — Horizontal Stacked Bar and Ring Chart (donut) — each paired with a legend showing color-coded category labels and percentage values. Supports 1 to 8 categories using a fixed multi-color palette.

 **Variants**

 

 **Horizontal Stacked Bar**

 A single 12px-tall horizontal bar with colored segments filling proportionally. Uses a full pill shape (16px border-radius). Segments sit flush against each other with no gaps.

 **Ring Chart (Donut)**

 A 100×100px circular ring with 14px stroke width. Category segments fill the ring proportionally using conic-gradient. The center remains hollow (matches surface background).

 **Usage Guidelines**

 

 Do

-  

-  Use the predefined 8-color category palette — Accent A through F, Positive, and Negative

-  Always pair the chart with a legend showing a color dot, label, and percentage for each category

-  Segments must fill proportionally — their visual size must reflect the data value

-  The horizontal bar must use 16px border-radius (full pill shape)

-  Ring chart must use a 14px stroke width with no gap between arc segments

-  Legend dots must be 8×8px circles using the exact category color

-  Legend text uses 10px font size with 0.25px letter spacing

-  Label text uses Regular weight, value text uses Medium weight (500)

-  Values must use tabular-nums (font-variant-numeric) for alignment

-  Legend items wrap with 4px inline gap and 20px row gap

 Avoid

-  

-  Using colors outside the predefined 8-color category palette

-  Omitting the legend — every chart must include one

-  Using more than 8 categories in a single breakdown chart

-  Adding gaps or spacing between segments in the stacked bar

-  Mixing chart types (bar and ring) within the same breakdown instance

-  Using solid dots larger or smaller than 8×8px in the legend

-  Placing the legend anywhere other than below the chart

 

 **Segment States**

 

 **Purpose**

 Individual segments in the Horizontal Stacked Bar have three visual states that control corner rounding at the bar edges.

 **Variants**

 

 **Start**

 The first (leftmost) segment. Has 4px border-radius on the left corners (top-left, bottom-left) and flat right edges.

 **Middle**

 Any interior segment. Has no border-radius — all four corners are flat to sit flush between neighbors.

 **End**

 The last (rightmost) segment. Has 4px border-radius on the right corners (top-right, bottom-right) and flat left edges.

 **Usage Guidelines**

 

 Do

-  

-  The first segment must always use the Start state (left rounding)

-  The last segment must always use the End state (right rounding)

-  All segments between first and last must use the Middle state (no rounding)

-  If only one segment exists, apply rounding on both sides (Start + End combined)

 Avoid

-  

-  Applying rounding to middle segments

-  Omitting rounding from the first or last segment

-  Using different radius values than 4px for segment corners

 

 **Category Color Palette**

 

 **Purpose**

 The Breakdown Chart uses a fixed palette of 8 named category colors. These tokens are shared across both chart types and the legend. Colors must not be modified or extended.

 **Variants**

 

 **Accent A**

 #59AEFF — Blue. Primary category color, typically the largest segment.

 **Accent B**

 #FF8300 — Orange. Token: orange-primary-gradient-70.

 **Accent C**

 #B172FF — Purple. Token: orange-tertiary-bg.

 **Accent D**

 #EDC500 — Yellow. Token: yellow-primary-gradient-70.

 **Accent E**

 #D06BFF — Pink. Token: orange-tertiary-bg.

 **Accent F**

 #36D1D1 — Mint/Teal. Token: mint-secondary-opaque-bg.

 **Positive**

 #6EFF8B — Green. Token: verdict/positive/400-static.

 **Negative**

 #FF665E — Red. Token: verdict/negative/400-static.

 **Usage Guidelines**

 

 Do

-  

-  Use these exact hex values and their corresponding design tokens

-  Assign categories in order (Accent A first, then B, C, etc.)

-  The ring chart and stacked bar must use the same color mapping for the same data

 Avoid

-  

-  Creating custom colors or extending the palette beyond 8

-  Re-ordering the default palette assignment

-  Using different shades or opacity variants of these colors for category fills