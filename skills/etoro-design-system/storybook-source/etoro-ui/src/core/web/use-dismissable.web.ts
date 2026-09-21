import { useEffect, useRef } from 'react';

import type { UseDismissableOptions } from './use-dismissable';

// Minimal structural DOM typing: this lib does not include the TS "dom" lib.
interface KeyboardEventLike {
  key: string;
  defaultPrevented?: boolean;
  preventDefault?: () => void;
}
interface DocumentLike {
  addEventListener: (type: 'keydown', handler: (event: KeyboardEventLike) => void) => void;
  removeEventListener: (type: 'keydown', handler: (event: KeyboardEventLike) => void) => void;
}

const getDocument = (): DocumentLike | undefined => (globalThis as unknown as { document?: DocumentLike }).document;

interface DismissEntry {
  dismiss: () => void;
}

/**
 * Activation-ordered (last activated = topmost). Module-scoped on purpose:
 * there is one document, so there is one stack refereeing it.
 */
const stack: DismissEntry[] = [];
let unlisten: (() => void) | null = null;

const handleKeyDown = (event: KeyboardEventLike): void => {
  if (event.key !== 'Escape' || event.defaultPrevented) {
    return;
  }
  const top = stack[stack.length - 1];
  if (!top) {
    return;
  }
  // Mark the event consumed for keydown listeners outside the stack.
  event.preventDefault?.();
  top.dismiss();
};

const register = (entry: DismissEntry): (() => void) => {
  if (stack.length === 0) {
    const doc = getDocument();
    if (doc) {
      doc.addEventListener('keydown', handleKeyDown);
      // The doc reference is captured here so teardown still works if the
      // global disappears first (tests swap `globalThis.document` per case).
      unlisten = () => doc.removeEventListener('keydown', handleKeyDown);
    }
  }
  stack.push(entry);
  return () => {
    const index = stack.indexOf(entry);
    if (index !== -1) {
      stack.splice(index, 1);
    }
    if (stack.length === 0) {
      unlisten?.();
      unlisten = null;
    }
  };
};

/**
 * The web dismiss stack: Escape closes exactly ONE thing — the topmost open
 * layer. Every dismissible overlay (side-menu panel, overlay aside, FAB menu)
 * registers while open; one shared document keydown listener routes Escape to
 * the last-activated entry only, so stacked layers can never double-close.
 * Registration order IS activation order — a layer joins the stack when it
 * opens (`active` flips true), not when it mounts.
 *
 * The consumed event is `preventDefault()`ed so listeners outside the stack
 * see it as handled, and events already `defaultPrevented` by outside code
 * (e.g. RN `Modal`'s own dismiss handling) are ignored — precedence replaces
 * the old convention where every layer checked `defaultPrevented` but nobody
 * ever set it.
 *
 * `onDismiss` identity is kept in a ref: callers don't have to memoise, and a
 * re-render can never re-order the stack.
 */
export function useDismissable({ active, onDismiss }: UseDismissableOptions): void {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!active) {
      return;
    }
    return register({ dismiss: () => onDismissRef.current() });
  }, [active]);
}
