import { cloneElement, isValidElement, ReactNode } from 'react';

/**
 * Shared helpers for the shell families' slot classifiers (`EtAppLayout`,
 * `EtSideMenu`, `EtTopPanel`). Internal to `components/shell` — deliberately
 * NOT exported from the shell entry point.
 */

/**
 * Reads the `__SLOT_TYPE` static from a React element's component type.
 * Static properties survive minification, unlike displayName.
 */
export const getSlotType = <T extends string>(child: ReactNode): T | undefined =>
  isValidElement(child) ? (child.type as { __SLOT_TYPE?: T }).__SLOT_TYPE : undefined;

/**
 * Pins a stable key on an UNKEYED slot child; an author key is preserved
 * verbatim — it carries the author's identity semantics (reorder stability,
 * intentional remounts) and must never be overwritten.
 *
 * Why pin at all: without a key, React falls back to positional identity.
 * Inline conditionals (`{cond && <Slot/>}`) are safe — a null/false child
 * still occupies its source position — but a consumer that renders
 * structurally different JSX (the slot expression itself absent) shifts every
 * later sibling's position, and a shifted identity remounts the element (on
 * `EtAppLayout.Main`, the whole navigator). Pinned keys make slot identity
 * independent of the consumer's JSX shape.
 *
 * Callers must iterate with `Children.forEach`, which hands back the ORIGINAL
 * elements — `Children.toArray` would rewrite every key (author keys become
 * `.$key`, unkeyed children get positional `.0`/`.1`…), making the
 * author-key check here impossible.
 */
export const keyed = (child: ReactNode, key: string): ReactNode =>
  isValidElement(child) && child.key == null ? cloneElement(child, { key }) : child;
