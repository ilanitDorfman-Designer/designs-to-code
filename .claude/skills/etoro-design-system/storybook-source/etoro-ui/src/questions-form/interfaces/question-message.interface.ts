/**
 * Question message type.
 * Determines the visual style of the message.
 */
export type QuestionMessageType = 'default' | 'info' | 'warning' | 'error';

/**
 * Controls when a `QuestionMessage` is shown.
 * - static: Always shown (when CCM/other filters allow)
 * - selected: Shown only when the owning option is selected (option-level rendering)
 * - omitted: On options, treated as selected-only (legacy KYCx); question-level messages are still shown when present
 */
export type QuestionMessageBehavior = 'static' | 'selected';

/**
 * Dependency function configuration.
 * Used for conditional message display based on CCM or risk country.
 */
export interface DependOnFn {
  /** Type of dependency check */
  type: 'ccm' | 'riskCountry';
  /** Optional key for the dependency */
  key?: string;
}

/**
 * Message displayed alongside a question or option.
 */
export interface QuestionMessage {
  /** Message text */
  message: string;
  /** Visual style of the message */
  type?: QuestionMessageType;
  /** When the message is displayed */
  behavior?: QuestionMessageBehavior;
  /** Optional icon identifier */
  icon?: string;
  /** Whether to show a border around the message */
  border?: boolean;
  /** Conditional display based on external factors */
  dependOnFn?: DependOnFn[];
}
