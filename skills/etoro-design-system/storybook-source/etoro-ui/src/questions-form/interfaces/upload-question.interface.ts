import type { QuestionBase } from './question-base.interface';

/**
 * File upload question (deferred — P4).
 * Placeholder interface to keep the Question union consistent with QuestionType.
 * Implementation details will be added when native file picker integration is built.
 */
export interface UploadQuestion extends QuestionBase {
  type: 'upload';
}
