// ============================================================================
// ReactNode Tree Truncation
// ============================================================================
// Walks a ReactNode tree counting characters in string children and nested
// element text content. Truncates at a given character budget, preserving
// element wrappers (and their props like onPress, style, etc.).
// ============================================================================

import { Children, cloneElement, isValidElement, PropsWithChildren, ReactNode } from 'react';

/**
 * Truncates a ReactNode tree by character count.
 *
 * Walks the children tree depth-first:
 * - String/number children consume characters from the budget.
 * - ReactElement children are recursed into; their wrapper element
 *   (and all props like `onPress`, `style`) is preserved.
 * - Stops immediately when the budget is exhausted.
 *
 * @param children  The ReactNode tree to truncate.
 * @param maxChars  Maximum number of text characters to keep.
 * @returns         The truncated ReactNode tree.
 *
 * @example
 * ```tsx
 * // Input: "Hello " + <EtText onPress={fn}>world of code</EtText>
 * // truncateChildren(children, 9)
 * // Output: "Hello " + <EtText onPress={fn}>wor</EtText>
 * ```
 */
export function truncateChildren(children: ReactNode, maxChars: number): ReactNode {
  if (maxChars <= 0) return null;

  const result: ReactNode[] = [];
  let remaining = maxChars;

  const childArray = Children.toArray(children);

  for (const child of childArray) {
    if (remaining <= 0) break;

    // ── String / Number child ───────────────────────────────
    if (typeof child === 'string' || typeof child === 'number') {
      const str = typeof child === 'number' ? String(child) : child;
      if (str.length <= remaining) {
        result.push(child);
        remaining -= str.length;
      } else {
        result.push(str.slice(0, remaining));
        remaining = 0;
      }
      continue;
    }

    // ── ReactElement child — recurse into its children ───────
    if (isValidElement(child)) {
      const innerChildren = (child.props as PropsWithChildren).children;

      if (innerChildren == null) {
        // Element with no text children (e.g., icons) — keep as-is
        result.push(child);
        continue;
      }

      const truncatedInner = truncateChildren(innerChildren, remaining);

      // Count how many characters the truncated inner content consumed
      const consumed = countChars(truncatedInner);

      // Only include the element if it produced content
      if (consumed > 0 || truncatedInner != null) {
        result.push(cloneElement(child, undefined, truncatedInner));
        remaining -= consumed;
      }
      continue;
    }

    // ── null / undefined / boolean — skip silently ───────────
  }

  // Unwrap single-element arrays for cleaner output
  if (result.length === 0) return null;
  if (result.length === 1) return result[0];
  return result;
}

/**
 * Counts total text characters in a ReactNode tree (strings + numbers).
 * Used internally to track how many characters a truncated subtree consumed.
 */
function countChars(node: ReactNode): number {
  if (node == null || typeof node === 'boolean') return 0;
  if (typeof node === 'string') return node.length;
  if (typeof node === 'number') return String(node).length;

  if (Array.isArray(node)) {
    let total = 0;
    for (const child of node) {
      total += countChars(child);
    }
    return total;
  }

  if (isValidElement(node)) {
    return countChars((node.props as PropsWithChildren).children);
  }

  return 0;
}
