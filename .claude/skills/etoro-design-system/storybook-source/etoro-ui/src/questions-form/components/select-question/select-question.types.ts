import type { Control, RegisterOptions } from 'react-hook-form';

import type { OptionsQuestion, Question, QuestionsFormValues } from '../../interfaces';

/**
 * Props for the SelectQuestion component and its variant sub-components
 * (chip / toggle / tile groups).
 *
 * Text resolution is provided via QuestionsFormTextProvider context.
 */
export interface SelectQuestionProps {
  /** The options question to render */
  question: OptionsQuestion;
  /** React Hook Form control instance */
  control: Control<QuestionsFormValues>;
  /** Full set of questions (for conditional visibility) */
  allQuestions?: Question[];
  /** Outer questions to render below options (shared across options) */
  visibleOuterQuestions?: Question[];
  /** Returns the form field name for the question */
  getFieldName: (q: Question) => string;
  /** Returns react-hook-form rules for the question */
  getFieldRules: (q: Question) => RegisterOptions | undefined;
}
