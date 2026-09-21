 **Purpose**

 Links enable navigation. They move users to another page, view, or external destination without triggering a system action.


 **When to use**

-  Navigating between pages or sections

-  Linking to external destinations

-  Providing inline navigation within text or supporting content


 **Variants**

 

 **Text link**

 Standard inline or standalone navigational text. No icon.

 **Link with icon — trailing**

 Icon appears after the label. Use for navigation direction, external links, or downloads.

 **Link with icon — leading**

 Icon appears before the label. Adds visual context to the action.

 **Link with both icons**

 Leading and trailing icons together. Use sparingly.

 **Usage Guidelines**

 

 Do

-  

-  Use links strictly for navigation

-  Use concise, descriptive link text that indicates the destination

-  Use an icon only when it adds meaning (e.g. external, download, expand)

-  Use links for secondary or contextual navigation

-  Icons inside links must always match the link text color — use currentColor so the icon inherits the text color in every state (enabled, hover, disabled)

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  

-  Using links to trigger actions — use Button instead

-  Using icons without text

-  Overusing links in action-heavy interfaces

-  Hardcoding icon colors in links — always use currentColor so icons adapt to the link state automatically

-  Using a different color for the icon than the link text — icons and text must always share the same color

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette


 **States & Behavior**

 Resting, Hover (underline + primary-500), Active, Visited (if applicable), Disabled. Hover provides clear visual feedback. Links are keyboard focusable and screen-reader accessible. External destinations should be clearly indicated visually and via aria-label.