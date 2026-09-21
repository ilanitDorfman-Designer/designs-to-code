import type { QuestionMessage } from './question-message.interface';
import type { QuestionValidation } from './question-validation.interface';

/**
 * Question type discriminator.
 * Determines the kind of input control to render.
 */
export type QuestionType = 'input' | 'select' | 'upload';

/**
 * Select component variant.
 * - default: Standard dropdown/select
 * - autoComplete: Searchable autocomplete
 */
export type QuestionSelectType = 'default' | 'autoComplete';

/**
 * Visual style for option display.
 * check / checkBox / checkRound share the same gray tile — only the right-side indicator differs:
 * - check: chevron (single-select)
 * - checkBox: radio circle (single-select)
 * - checkRound: toggle switch (multi-select)
 * - chip: compact pill/tag in horizontal wrap (multi-select, separate layout)
 */
export type QuestionOptionStyle = 'check' | 'checkBox' | 'checkRound' | 'chip';

/**
 * Input field type for text/number inputs.
 * `country` is a host-rendered variant: the built-in renderer treats it as a
 * plain text input, but consumers can supply a custom `renderer` to render a
 * country picker (e.g. KYC `CountrySelect`).
 */
export type QuestionInputType = 'text' | 'number' | 'textbox' | 'country';

/**
 * Base interface for all question types.
 * Shared properties across input, select, and upload questions.
 */
export interface QuestionBase {
  /** Unique identifier for the question */
  id: string;
  /** Discriminator for question type */
  type: QuestionType;
  /** Primary question text */
  text?: string;
  /** Secondary/subtitle text */
  subText?: string;
  /** Optional title override */
  title?: string;
  /** Optional image URL or identifier */
  img?: string;
  /** Current or default value */
  value?: unknown;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Whether to persist the value across form resets */
  isPersistValue?: boolean;
  /** Messages displayed with the question */
  messages?: QuestionMessage[];
  /** Validation rules for the question */
  validations?: QuestionValidation[];
}
