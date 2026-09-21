import { InputType } from '../api/types';

/**
 * Native adapter: native keyboards already own input restrictions, so this
 * keeps emitted values byte-identical to the existing mobile behavior.
 * The web implementation lives in `sanitize-input.web.ts`.
 */
export function sanitizeInputText(_type: InputType | undefined, text: string): string {
  return text;
}
