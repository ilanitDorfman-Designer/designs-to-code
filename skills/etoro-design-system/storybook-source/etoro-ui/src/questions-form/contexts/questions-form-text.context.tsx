import { createContext, type ReactNode, useContext } from 'react';

/**
 * Contract for providing text resolution to QuestionsForm components.
 * Implement this interface to supply i18n / translation logic.
 */
export interface QuestionsFormTextResolver {
  resolveText(text: string | undefined): string;
  /**
   * Optional rich-text resolver for secondary content (e.g. option subtitles).
   * Lets the consumer return colored / styled inline nodes instead of a plain
   * string. When omitted, components fall back to `resolveText`.
   */
  resolveNode?(text: string | undefined): ReactNode;
}

const QuestionsFormTextContext = createContext<QuestionsFormTextResolver | null>(null);

/**
 * Provides a text resolver to all QuestionsForm child components via context.
 *
 * Wrap `<QuestionsForm>` with this provider to supply translation / i18n logic
 * without prop-drilling `resolveText` through every component.
 *
 * @example
 * ```tsx
 * const resolver: QuestionsFormTextResolver = {
 *   resolveText: (key) => i18n.t(key ?? ''),
 * };
 *
 * <QuestionsFormTextProvider resolver={resolver}>
 *   <QuestionsForm config={config}>
 *     <QuestionsForm.Submit onSubmit={onSubmit} />
 *   </QuestionsForm>
 * </QuestionsFormTextProvider>
 * ```
 */
export function QuestionsFormTextProvider({ resolver, children }: { resolver: QuestionsFormTextResolver; children: ReactNode }) {
  return <QuestionsFormTextContext.Provider value={resolver}>{children}</QuestionsFormTextContext.Provider>;
}

const defaultResolveText = (text: string | undefined): string => text ?? '';

/**
 * Hook consumed by QuestionsForm child components to resolve display text.
 * Returns the `resolveText` function from the nearest `QuestionsFormTextProvider`.
 * Falls back to a passthrough (identity) when no provider is present.
 */
export function useResolveText(): (text: string | undefined) => string {
  const ctx = useContext(QuestionsFormTextContext);
  return ctx?.resolveText ?? defaultResolveText;
}

/**
 * Hook consumed by QuestionsForm child components to resolve rich secondary
 * content (e.g. option subtitles). Uses the provider's `resolveNode` when
 * supplied, otherwise falls back to `resolveText` (plain string).
 */
export function useResolveNode(): (text: string | undefined) => ReactNode {
  const ctx = useContext(QuestionsFormTextContext);
  return ctx?.resolveNode ?? ctx?.resolveText ?? defaultResolveText;
}

/**
 * Returns the raw context value (null when no external provider wraps the tree).
 * Used internally by QuestionsFormBase to detect an external provider.
 */
export function useExternalTextResolver(): QuestionsFormTextResolver | null {
  return useContext(QuestionsFormTextContext);
}
