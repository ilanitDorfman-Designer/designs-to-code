 **Purpose**

 Progress bars visualize the completion status of a task or process. They provide a clear indication of how much work has been done and how much remains.


 **When to use**·

-  Multi-step flows or wizards

-  ·

-  File uploads or downloads

-  ·

-  Profile completion or onboarding progress

-  ·

-  Any task where progress can be measured as a percentage


 **Usage Guidelines**

 Do

-  Use when the completion percentage is known or can be estimated

-  Keep the bar width proportional to its container

-  Pick one variant (neutral or primary) and keep it consistent throughout the entire progress — do not change color based on the value

-  Always use the token colors that match the current mode (light-mode tokens for light-mode, dark-mode tokens for dark-mode)

 Avoid

-  Using progress bars for indeterminate loading — use Loader instead

-  Animating progress backward — progress should only move forward

-  Switching between neutral and primary variants based on the progress value — a bar is either neutral or primary all the way

-  Using custom colors outside the design token palette

-  Never use a light-mode color on dark-mode — always follow the dark-mode token palette

-  Never use a dark-mode color on light-mode — always follow the light-mode token palette