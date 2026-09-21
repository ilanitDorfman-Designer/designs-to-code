import type { OptionsQuestion, Question } from '../interfaces';

/**
 * Collects outer question IDs from selected options (sharedOuterQuestionsId or sharedOuterQuestionsIds).
 * Deduplicates and preserves order.
 *
 * @param question - The options question
 * @param selectedValue - Current selected value (string or string[])
 * @returns Array of unique outer question IDs
 */
export function collectOuterQuestionIds(question: OptionsQuestion, selectedValue: string | string[] | null): string[] {
  if (!selectedValue || !question.options?.length) return [];
  const ids: string[] = [];
  const selected = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
  const seen = new Set<string>();
  for (const opt of question.options) {
    if (!selected.includes(opt.value)) continue;
    if (opt.sharedOuterQuestionsId && !seen.has(opt.sharedOuterQuestionsId)) {
      seen.add(opt.sharedOuterQuestionsId);
      ids.push(opt.sharedOuterQuestionsId);
    }
    if (opt.sharedOuterQuestionsIds?.length) {
      for (const id of opt.sharedOuterQuestionsIds) {
        if (!seen.has(id)) {
          seen.add(id);
          ids.push(id);
        }
      }
    }
  }
  return ids;
}

/**
 * Finds inner questions by their IDs from the full questions bank.
 * Returns empty array if ids is empty/undefined or allQuestions is empty/undefined.
 * Preserves the order of ids in the result.
 *
 * @param innerQuestionsIds - Array of question IDs to find
 * @param allQuestions - Full questions bank
 * @returns Array of matching Question configs
 */
export function getInnerQuestions(innerQuestionsIds: string[], allQuestions: Question[]): Question[] {
  if (!innerQuestionsIds?.length || !allQuestions?.length) {
    return [];
  }
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]));
  return innerQuestionsIds.map((id) => questionMap.get(id)).filter((q): q is Question => q !== undefined);
}

/**
 * Finds outer questions by their IDs from the full questions bank.
 * Same logic as getInnerQuestions.
 * Returns empty array if ids is empty/undefined or allQuestions is empty/undefined.
 * Preserves the order of ids in the result.
 *
 * @param outerQuestionsIds - Array of question IDs to find
 * @param allQuestions - Full questions bank
 * @returns Array of matching Question configs
 */
export function getOuterQuestions(outerQuestionsIds: string[], allQuestions: Question[]): Question[] {
  if (!outerQuestionsIds?.length || !allQuestions?.length) {
    return [];
  }
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]));
  return outerQuestionsIds.map((id) => questionMap.get(id)).filter((q): q is Question => q !== undefined);
}

/**
 * Checks if a question has a required validation rule.
 * Returns true if any validation in the array has { required: true }.
 *
 * @param question - The question to check
 * @returns True if the question has a required validation
 */
export function isQuestionRequired(question: Question): boolean {
  const validations = question?.validations;
  if (!validations?.length) {
    return false;
  }
  return validations.some((v) => 'required' in v && (v as { required: boolean }).required === true);
}
