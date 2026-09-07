import type { QuestionOptionStyle } from './question-base.interface';
import type { QuestionMessage } from './question-message.interface';

/**
 * Single option in a select/multiple-choice question.
 */
export interface QuestionOption {
  /** Option value (stored in form state) */
  value: string;
  /** Display text for the option */
  text?: string;
  /** Secondary description text below the main text */
  subText?: string;
  /** Optional icon identifier */
  icon?: string;
  /** Optional image URL or identifier */
  img?: string;
  /** Optional numeric amount (e.g. for investment amounts) */
  amount?: number;
  /** Whether the option is pre-selected */
  selected?: boolean;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Special behavior: unselect all other options when this is selected */
  behavior?: 'unselectAll';
  /** Override visual style for this option */
  optionDefaultStyle?: QuestionOptionStyle;
  /** IDs of questions to show when this option is selected */
  innerQuestionsIds?: string[];
  /** ID of shared outer question (legacy) */
  sharedOuterQuestionsId?: string;
  /** IDs of shared outer questions */
  sharedOuterQuestionsIds?: string[];
  /** Messages displayed with this option */
  messages?: QuestionMessage[];
}
