 **Purpose**

 System Messages communicate **important system states or conditions** that affect user experience. They provide clear, persistent information about the environment, availability, or required actions without interrupting the user flow

 

 **When to use**

-  No internet connection

-  Feature unavailable or restricted

-  Maintenance or system downtime

-  Security or verification requirements

-  System-level constraints affecting user actions

 

 **Variants**

-  **Informational  **Used for neutral system states (e.g. offline, syncing paused) 

-  **Warning **Used when attention is required but no immediate action is mandatory. 

-  **Critical **Used when a system condition significantly impacts functionality (e.g. no connection, blocked action)

 

-  **With Action(s) **Includes CTA when the user can resolve the issue (e.g. Retry, Verify)

 

 **Usage Guidelines **

 **Do**

-  Use System Messages for environment or system-level conditions

-  Keep messaging clear, direct, and action-oriented

-  Provide a resolution path when possible (e.g. Retry)

-  Place close to the affected area or globally if needed

-  Use consistent tone and severity indication

 

 **Avoid**

-  Using System Messages for marketing or promotions (use Banner)

-  Using System Messages for transient feedback (use Toast)

-  Blocking interaction (use Dialog if action is required)

-  Overusing for minor or non-impactful states

 

 **States & Behavior**

-  Persistent while the condition exists

-  Does not auto-dismiss

-  May update dynamically as system state changes

-  Can appear inline or at page level

-  Does not block interaction unless escalation is required

-  CTA actions resolve or retry the state

-  Must be accessible and clearly announced