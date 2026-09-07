import type { Question } from './question.interface';

/**
 * Configuration for the QuestionsForm component.
 */
export interface QuestionsFormConfig {
  /** Unique identifier for this questionnaire config */
  id?: string;
  /** Questions to display (ordered) */
  questions: Question[];
  /** Full set of questions (for conditional visibility / inner questions) */
  allQuestions?: Question[];
  /** Whether to use text as keys instead of IDs for form values */
  textAsKeys?: boolean;
  /** Optional i18n/getText function for localized labels */
  getText?: (key: string) => string;
}
