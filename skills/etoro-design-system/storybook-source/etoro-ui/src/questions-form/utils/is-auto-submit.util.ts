import type { Question, QuestionsFormValues } from '../interfaces';

function selectSelectedArray(question: Question, values: QuestionsFormValues): string[] {
  const selected = values[question.id] ?? (question.text ? values[question.text] : undefined);
  return Array.isArray(selected) ? selected : selected ? [selected] : [];
}

function hasCheckStyleOption(question: Question): boolean {
  if (question.type !== 'select') return false;
  const defaultStyle = question.optionsDefaultStyle;
  return defaultStyle === 'check' || question.options.some((opt) => opt.optionDefaultStyle === 'check');
}

/**
 * True when this is a check-style select with no server-provided value and no current selection.
 * `QuestionsForm.Submit` ORs this with `isAutoSubmit` to hide the footer in the empty state without
 * treating that state as ready to fire `onSubmit`.
 */
export const isAutoSubmitIdleEmpty = (question: Question, values: QuestionsFormValues): boolean => {
  if (question.type !== 'select' || question.value != null) return false;
  if (!hasCheckStyleOption(question)) return false;
  return selectSelectedArray(question, values).length === 0;
};

/**
 * Default auto-submit predicate for `QuestionsForm.Submit`.
 *
 * Returns `true` only when there is a non-empty selection that includes a `check`-style option
 * and the form is valid and dirty. Empty selection never returns `true` (no submit on mount or
 * after clearing checkRound selections).
 *
 * Footer visibility for the empty check-style case uses {@link isAutoSubmitIdleEmpty} in
 * `QuestionsForm.Submit`.
 */
export const isAutoSubmit = (question: Question, values: QuestionsFormValues, isValid: boolean, isDirty: boolean): boolean => {
  if (question.type !== 'select') return false;
  if (question.value != null) return false;

  const selectedArr = selectSelectedArray(question, values);
  const defaultStyle = question.optionsDefaultStyle;
  if (!hasCheckStyleOption(question)) return false;

  if (selectedArr.length === 0) {
    return false;
  }

  if (!isValid || !isDirty) return false;

  const hasCheckSelected =
    defaultStyle === 'check'
      ? selectedArr.length > 0
      : question.options.some((opt) => selectedArr.includes(opt.value) && opt.optionDefaultStyle === 'check');
  return hasCheckSelected;
};
