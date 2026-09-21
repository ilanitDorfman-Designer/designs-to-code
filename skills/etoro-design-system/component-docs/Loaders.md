 **Purpose**

 Loaders communicate that the system is processing or fetching data. They reassure users that the interface is responsive and progress is being made.


 **When to use**

-  While content is being fetched from an API

-  During form submission or data processing

-  When navigating between views that require loading

-  As placeholder content before real data is available (skeleton)


 **Usage Guidelines**

 Do

-  Use spinners for indeterminate loading with no known duration

-  Use skeleton screens when the layout structure is known in advance

-  Place loaders in the context where content will appear

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Blocking the entire screen when only a section is loading

-  Using loaders for actions that complete instantly

-  Stacking multiple loaders in the same view

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette