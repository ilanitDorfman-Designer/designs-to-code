import { createContext, useContext } from 'react';

/** Resolved component state shared via context */
export interface SelectState {
  /** Which type is rendering */
  type: 'text' | 'field';
  /** Whether the component is effectively disabled */
  disabled: boolean;
  /** Whether the component is in readonly state (field type only) */
  readonly: boolean;
}

/** Derived styling metadata shared via context */
export interface SelectMeta {
  /** Color for value/content text */
  textColor: string;
  /** Color for label text (field type's filled state) */
  labelColor: string;
  /** Color for trailing icon */
  iconColor: string;
  /** Icon size in pixels */
  iconSize: number;
}

/**
 * Context value following the { state, meta } composition pattern.
 * Subcomponents consume this to auto-style based on parent type.
 */
export interface SelectContextValue {
  state: SelectState;
  meta: SelectMeta;
}

/**
 * Context for sharing EtSelect state with subcomponents.
 */
export const SelectContext = createContext<SelectContextValue | null>(null);

/**
 * Hook to access EtSelect context from subcomponents.
 * @throws Error if used outside of EtSelect
 */
export function useSelectContext(): SelectContextValue {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('EtSelect compound components must be used within an EtSelect');
  }
  return context;
}
