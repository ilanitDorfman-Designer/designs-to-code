import type { InputQuestion } from './input-question.interface';
import type { OptionsQuestion } from './options-question.interface';
import type { UploadQuestion } from './upload-question.interface';

/**
 * Discriminated union of all question types.
 * Use `question.type` to narrow the type.
 */
export type Question = InputQuestion | OptionsQuestion | UploadQuestion;
