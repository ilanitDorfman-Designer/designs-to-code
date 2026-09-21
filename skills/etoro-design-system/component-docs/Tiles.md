 Tiles are list-row building blocks used to display content in structured horizontal rows. Each tile is composed of a start slot (left) and an end slot (right), separated by a flexible gap. Tiles are the primary pattern for settings screens, asset lists, selection menus, and grouped preferences.


 **When to use**

-  Settings and preference screens

-  Asset or instrument lists with prices and changes

-  Selection lists (radio, checkbox)

-  Navigation rows that drill into detail views

-  Grouped toggle controls for notifications or feature flags


 **Variants**

 **Basic Tile**

 A single horizontal row with a start slot and an end slot. Radius 8px, padding 16px, gap 24px. The start and end slots are interchangeable — mix and match from the slot libraries below.

 **Switch Tile**

 A row with a title on the left and an iOS-style toggle on the right. Supports optional paragraph/subtitle below the title. Radius 12px, padding 16px, gap 8px.

 **Combo Tile**

 A container that groups multiple Switch Tiles vertically with dividers between them. Supports an optional tab-group header. Radius 12px, padding 16px. Available in amounts of 2, 3, or 4.

 **Usage Guidelines**

 

 Do

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

-  Use Basic Tiles for navigation, selection, or data display rows

-  Use Switch Tiles for binary on/off settings

-  Use Combo Tiles to group related Switch Tiles into a single visual unit

-  Keep start slot content concise — title should be scannable in one glance

-  Maintain consistent slot combinations within the same list context


 Avoid

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette

-  Mixing Basic and Switch tile types in the same visual group

-  Using a Combo Tile with only one item — use a standalone Switch Tile instead

-  Overloading start slots with too many elements (icon + title + tag + subtitle is the maximum)

-  Using tiles for primary actions — use Buttons instead


 **States & Behavior**

-  Enabled — default interactive state

-  Selected — visually highlighted row (used with checkbox or radio end slots)

-  Disabled — non-interactive, reduced opacity (0.5)

-  On / Off — for Switch Tiles, reflects the toggle state

 

 **Start Slots**

 

 **Purpose**

 The start (left) area of a tile. Start slots define the primary content and identity of the row. Choose a slot based on the type of data being displayed.


 **Variants**

 **Title**

 Single semibold title text.

 **Title + Subtitle**

 Semibold title with a secondary description line below.

 **Icon + Title**

 Leading icon with a semibold title, displayed horizontally.

 **Icon + Title + Subtitle**

 Leading icon with title and subtitle stacked beside it.

 **Label + Value**

 Uppercase label above a value description — for key-value display.

 **Small Asset + Name (horizontal)**

 Small asset icon (24px) with ticker name beside it.

 **Medium Asset + Name + Subtitle**

 Larger asset icon (36px) with ticker and subtitle stacked beside it.

 **Title + Tag + Subtitle**

 Title with an inline tag badge and subtitle below — maximum content density.

 **Avatar + User Name**

 User avatar with display name beside it.

 **Search Result**

 Highlighted search match text.

 **Price Change + Label**

 Directional arrow with percentage change and label — uses semantic verdict colors.

 

 **End Slots**

 **Purpose**

 The end (right) area of a tile. End slots define the trailing action or supplementary data. They are right-aligned and should not compete visually with the start slot.


 **Variants**

 **Chevron (angle-right)**

 Navigation indicator — signals drill-down to a detail screen.

 **Checkbox**

 Round checkbox for multi-select scenarios.

 **Radio**

 Radio button for single-select scenarios.

 **Tertiary Label**

 Small muted text label for metadata or status.

 **Price + Subtitle**

 Primary price (ML or standard size) with a subtitle below.

 **Price + Change**

 Price with directional arrow and percentage change below — uses semantic verdict colors.

 **% Change + Label**

 Directional arrow with percentage and a subtitle label below.

 **SM Price**

 Small standalone price value.

 **SM Number + Subtitle**

 Small positive/negative number with subtitle below — uses semantic verdict colors.

 

 **Switch Tile Content**

 **Purpose**

 Switch Tiles support different content layouts depending on how much context the setting requires.

 **Variants**

 

 **Title only**

 Just the setting name — use when the toggle label is self-explanatory.

 **Title + Paragraph**

 Setting name with a description paragraph below — use when the setting needs clarification.

 **Title + Subtitle**

 Setting name with a shorter subtitle — compact alternative to paragraph.

 

 **Combo Tile**

 **Purpose**

 Combo Tiles group 2–4 Switch Tiles into a single contained card. They share a common radius and background, separated by 1px dividers. An optional tab-group header (pill-shaped segmented control) can filter or categorize the tiles.


 **Variants**

 **Type = Primary**

 Standard visual weight — default for most grouped settings.

 **Type = Secondary**

 Reduced visual weight — for less prominent grouped options.

 **Toggle Button = True**

 Combo includes a tab-group header above the tiles for filtering or categorization.

 **Toggle Button = False**

 No header — tiles are shown directly.

 **Amount = 2 / 3 / 4**

 Number of Switch Tiles grouped together. Maximum of 4 recommended.