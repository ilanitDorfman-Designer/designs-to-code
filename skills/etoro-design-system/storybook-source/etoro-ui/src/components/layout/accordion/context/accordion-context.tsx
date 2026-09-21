import { createContext, useContext } from 'react';

/**
 * Context value for the main Accordion component
 * Manages which items are expanded
 */
export interface AccordionContextValue {
  /**
   * Array of currently expanded item IDs
   */
  expandedIds: string[];

  /**
   * Toggle an item's expanded state
   */
  toggleItem: (id: string) => void;

  /**
   * Whether multiple items can be expanded at once
   */
  allowMultiple: boolean;
}

/**
 * Context for sharing accordion state with child components
 */
export const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Hook to access accordion context from subcomponents
 * @throws Error if used outside of EtAccordion
 */
export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('EtAccordion compound components must be used within an EtAccordion component');
  }
  return context;
}
