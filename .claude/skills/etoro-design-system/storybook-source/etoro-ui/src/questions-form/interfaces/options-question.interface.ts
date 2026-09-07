import type { QuestionBase, QuestionOptionStyle, QuestionSelectType } from './question-base.interface';
import type { QuestionOption } from './question-option.interface';

/**
 * Select/multiple-choice question.
 * Renders a list of options (chips, radio, checkbox, etc.).
 */
export interface OptionsQuestion extends QuestionBase {
  type: 'select';
  /** Available options */
  options: QuestionOption[];
  /** Whether multiple options can be selected */
  isMultipleSelection?: boolean;
  /** Select component variant (default or autoComplete) */
  selectType?: QuestionSelectType;
  /** Default visual style for options */
  optionsDefaultStyle?: QuestionOptionStyle;
  /** Whether selecting an option prevents unselecting it */
  disableUnselect?: boolean;
  /** Placeholder for search/autocomplete when applicable */
  placeholderText?: string;
}
