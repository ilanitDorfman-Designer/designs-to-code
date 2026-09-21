import { useState } from 'react';

import type { LayoutDirection } from './use-layout-direction';

// Minimal DOM typing: this lib does not include the TS "dom" lib.
interface DocumentLike {
  documentElement?: { dir?: string };
}

const readDocumentDirection = (): LayoutDirection => {
  const doc = (globalThis as unknown as { document?: DocumentLike }).document;
  return doc?.documentElement?.dir === 'rtl' ? 'rtl' : 'ltr';
};

/**
 * Web variant: layout direction from the document `dir` attribute — the
 * source react-native-web resolves logical `start`/`end` props from
 * (`I18nManager` is a dead stub on web).
 *
 * Read once at mount, no MutationObserver: the app never changes `dir`
 * mid-session today (a language switch reloads the page).
 */
export const useLayoutDirection = (): LayoutDirection => {
  const [direction] = useState(readDocumentDirection);
  return direction;
};
