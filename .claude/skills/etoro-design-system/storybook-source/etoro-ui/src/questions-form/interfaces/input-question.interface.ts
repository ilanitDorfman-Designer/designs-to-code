import type { QuestionBase, QuestionInputType } from './question-base.interface';

/**
 * Text or number input question.
 * Renders a single-line or multi-line input field.
 */
export interface InputQuestion extends QuestionBase {
  type: 'input';
  /** HTML-like input type (text, number, textbox) */
  inputType: QuestionInputType;
  /** Placeholder text when empty */
  placeholderText: string;
  /** Optional answer ID for analytics or mapping */
  answerId?: string;
}
