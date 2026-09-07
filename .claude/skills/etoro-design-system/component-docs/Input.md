 **Purpose** Inputs allow users to enter, edit, or review textual information. They support form interactions by capturing structured or free-form data while providing contextual guidance and validation feedback.  

**When to use**

-  Collecting user-entered information (e.g. name, email, amount)

-  Editing previously entered values

-  Displaying short, editable text fields

-  Forms requiring validation or character limits

-  Structured data entry with prefix or suffix context

 

 **Variants **

-  **Default** Standard text input with label 

-  **With Helper Text** Provides supporting guidance or instructions beneath the field 

-  **With Error** Displays validation feedback or required field messaging.

 

-  **With Character Counter** Shows current character count (e.g. 10/50). Used when input length is restricted.

 

-  **With Prefix / Suffix** Displays contextual information inside the field (e.g. currency, unit, domain). Prefix and suffix are non-editable.

 

-  **With Leading / Trailing Icon** Used to reinforce meaning (e.g. search icon) or provide secondary actions (e.g. clear, favorite)

 

-  **Disabled** Non-interactive state when input is unavailable 


 **Usage Guidelines Do**

-  Always use a persistent label above the field

-  Use helper text to clarify expected format or constraints

-  Use character counters only when limits are enforced

-  Use prefix/suffix for fixed contextual values (e.g. $, %, kg)

-  Keep labels concise and descriptive

-  Show error messages clearly below the field

-  Ensure focus state is visually distinct

-  Size inputs appropriately to the expected content

 

 **Avoid**

-  Using placeholder text instead of a label

-  Relying only on color to communicate error

-  Using inputs for selection (use Dropdown, Toggle, or Radio instead)

-  Overloading inputs with multiple decorative icons

-  Hiding validation feedback

-  Using disabled state without explaining why the field is unavailable

-  Placing critical instructions only inside helper text

 

 **States & Behavior**

-  Resting

-  Hover

-  Focus

-  Filled (contains user-entered value)

-  Error

-  Disabled

-  Focus clearly indicates active cursor placement

-  Error state overrides helper text and displays validation message

-  Character counter updates dynamically

-  Prefix and suffix remain fixed and non-editable

-  Interactive trailing icons respond to hover and press

-  Disabled inputs are non-editable and visually muted

-  Validation feedback appears on blur or submission unless real-time validation is required

-  Input content remains legible across all states