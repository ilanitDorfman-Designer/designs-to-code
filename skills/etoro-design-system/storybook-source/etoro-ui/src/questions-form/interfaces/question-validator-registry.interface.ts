import type { Question } from './question.interface';

/**
 * Custom validator function signature.
 * Returns error message string on failure, null on success.
 */
export type CustomValidatorFn = (value: unknown, question: Question) => string | null;

/**
 * Registry of custom validators by name.
 * Used to resolve validators referenced in CustomValidation.
 */
export interface QuestionValidatorRegistry {
  /**
   * Get a validator by name.
   * @param name - Validator name (e.g. from CustomValidation.custom[].name)
   * @returns The validator function or undefined if not found
   */
  get(name: string): CustomValidatorFn | undefined;
}
