import type { QuestionsFormValues } from '../interfaces';

/**
 * React Hook Form treats `.` in a field name as a nested path (`a.b` → `values.a.b`).
 * Question ids like `32>106.text` must be encoded so each logical question maps to one flat key.
 */
export const QUESTIONS_FORM_RHF_DOT_ESCAPE = '__qfmDOT__';

export function encodeQuestionsFormRhfFieldName(raw: string): string {
  return raw.split('.').join(QUESTIONS_FORM_RHF_DOT_ESCAPE);
}

export function decodeQuestionsFormRhfFieldName(encoded: string): string {
  return encoded.split(QUESTIONS_FORM_RHF_DOT_ESCAPE).join('.');
}

/** Map RHF's internal keys back to config question ids / consumer-facing keys. */
export function decodeQuestionsFormValues(raw: Record<string, unknown>): QuestionsFormValues {
  const out: QuestionsFormValues = {};
  for (const [k, v] of Object.entries(raw)) {
    out[decodeQuestionsFormRhfFieldName(k)] = v as string | string[] | null;
  }
  return out;
}
