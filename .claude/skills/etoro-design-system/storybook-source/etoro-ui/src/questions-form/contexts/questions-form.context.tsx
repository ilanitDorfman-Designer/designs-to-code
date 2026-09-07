import { createContext, useContext } from 'react';

import type { Question, QuestionsFormValues } from '../interfaces';

export interface QuestionsFormContextValue {
  question: Question | undefined;
  isValid: boolean;
  isDirty: boolean;
  getValues: () => QuestionsFormValues;
  createSubmitHandler: (cb: (values: QuestionsFormValues) => void) => () => void;
  questionValueKey: string;
  /**
   * The auto-submit latch is owned by `QuestionsForm`, not `QuestionsForm.Submit`.
   * Hosts mount the footer conditionally, so keeping the latch in the footer's own
   * state would let a single unmount/remount replay the auto-submit — and each
   * replay re-triggers whatever gate hid the footer. Reset with the form itself,
   * which hosts remount per question via `key`.
   */
  hasAutoSubmitted: () => boolean;
  markAutoSubmitted: () => void;
}

export const QuestionsFormContext = createContext<QuestionsFormContextValue | null>(null);

export function useQuestionsFormCtx(): QuestionsFormContextValue {
  const ctx = useContext(QuestionsFormContext);
  if (!ctx) throw new Error('QuestionsForm.Submit must be used inside <QuestionsForm>');
  return ctx;
}
