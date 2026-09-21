import type { ComponentType, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { Control, RegisterOptions } from 'react-hook-form';

import type { Question, QuestionsFormValues } from '../interfaces';

/**
 * Props accepted by the question renderer component.
 * Defined here (not in the component file) to avoid circular imports:
 * SelectQuestion and AutocompleteQuestion consume the renderer via context
 * instead of importing the component directly.
 */
export interface QuestionRendererProps {
  /** The question to render */
  question: Question;
  /** React Hook Form control instance */
  control: Control<QuestionsFormValues>;
  /** Full set of questions (for inner questions resolution in SelectQuestion) */
  allQuestions?: Question[];
  /** Outer questions to render below options (passed through to SelectQuestion) */
  visibleOuterQuestions?: Question[];
  /** Returns the form field name for the question */
  getFieldName: (q: Question) => string;
  /** Returns react-hook-form rules for the question */
  getFieldRules: (q: Question) => RegisterOptions | undefined;
}

const QuestionRendererContext = createContext<ComponentType<QuestionRendererProps> | null>(null);

/**
 * Provides the QuestionRenderer component to descendant question components.
 * This breaks the circular dependency between QuestionRenderer ↔ SelectQuestion / AutocompleteQuestion.
 */
export function QuestionRendererProvider({ renderer, children }: { renderer: ComponentType<QuestionRendererProps>; children: ReactNode }) {
  return <QuestionRendererContext.Provider value={renderer}>{children}</QuestionRendererContext.Provider>;
}

/** Fallback that renders nothing — used when no provider wraps the tree (e.g. unit tests). */
function NoopRenderer(): null {
  return null;
}

/**
 * Returns the QuestionRenderer component from context.
 * Used by SelectQuestion and AutocompleteQuestion to render nested questions
 * without a direct import (avoiding circular dependency).
 * Falls back to a no-op renderer when no provider is present (e.g. unit tests).
 */
export function useQuestionRenderer(): ComponentType<QuestionRendererProps> {
  return useContext(QuestionRendererContext) ?? NoopRenderer;
}
