 

 **Purpose**

 Lists display a series of related content rows in a vertical stack. Each row uses a slot-based structure with configurable left (start) and right (end) content areas, following the same slot system as Tiles.


 **When to use**

-  Displaying collections of similar items (assets, settings, contacts)

-  Navigation menus with drill-down rows

-  Data-dense screens like watchlists, portfolios, or transaction history

-  Any vertically stacked content where each item has the same structure


 **Usage Guidelines**

 Do

-  Use consistent slot combinations within the same list context

-  Use dividers between rows for visual separation

-  Keep row height consistent across items in the same list

-  When a row contains a checkbox, add checkbox, or radio button in any slot, tapping anywhere on the entire row must toggle or select it - the tap target is the full row, not just the control

-  Use the Add Checkbox slot when the row action is saving the item to a persistent collection (watchlist, favorites) - use the regular Checkbox slot when the action is temporary in-screen selection

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Mixing different row structures within the same list

-  Using lists for actions — use Buttons instead

-  Overloading rows with too many interactive elements

-  Placing more than one element in the end (right) slot — each row's end slot must contain exactly one item (e.g. a price OR a checkbox OR a label, never a combination like a price next to a checkbox)

-  Limiting the tap target to just the checkbox or radio circle when the row is meant for selection — the whole row must respond

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette