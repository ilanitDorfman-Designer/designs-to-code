/**
 * Base validation interface.
 * All validation types extend this with their specific constraint.
 */
export interface QuestionBaseValidation {
  /** Error message shown when validation fails */
  errorMessage?: string;
  /** Optional icon identifier for the error */
  icon?: string;
  /** Whether to show a border on validation failure */
  border?: boolean;
}

/**
 * Required field validation.
 * Ensures the field has a value.
 */
export interface RequiredValidation extends QuestionBaseValidation {
  required: true;
}

/**
 * Minimum length validation.
 * Ensures the value meets minimum character count.
 */
export interface MinLengthValidation extends QuestionBaseValidation {
  minlength: number;
}

/**
 * Maximum length validation.
 * Ensures the value does not exceed maximum character count.
 */
export interface MaxLengthValidation extends QuestionBaseValidation {
  maxlength: number;
}

/**
 * Pattern validation.
 * Validates value against a regex pattern.
 */
export interface PatternValidation extends QuestionBaseValidation {
  pattern: string;
}

/**
 * Custom validation.
 * Allows multiple named validators with their own error messages.
 */
export interface CustomValidation extends QuestionBaseValidation {
  custom: Array<{
    /** Validator name (used to look up the validator function) */
    name: string;
    /** Error message for this validator */
    errorMessage: string;
    /** Whether to show border on failure */
    border?: boolean;
    /** Optional icon for this validator's error */
    icon?: string;
  }>;
}

/**
 * Union of all supported validation types.
 */
export type QuestionValidation = RequiredValidation | MinLengthValidation | MaxLengthValidation | PatternValidation | CustomValidation;
