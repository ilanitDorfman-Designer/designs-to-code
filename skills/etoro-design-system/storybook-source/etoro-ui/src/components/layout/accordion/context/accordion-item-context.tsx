import { createContext, useContext } from 'react';

/**
 * Context value for individual Accordion items
 * Provides item-specific state
 */
export interface AccordionItemContextValue {
  /**
   * Unique identifier for this item
   */
  id: string;

  /**
   * Whether this item is currently expanded
   */
  isExpanded: boolean;

  /**
   * Whether this item is disabled
   */
  disabled: boolean;

  /**
   * Toggle this item's expanded state
   */
  toggle: () => void;
}

/**
 * Context for sharing item state with Header and Content components
 */
export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

/**
 * Hook to access accordion item context from subcomponents
 * @throws Error if used outside of EtAccordion.Item
 */
export function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('EtAccordion.Header and EtAccordion.Content must be used within an EtAccordion.Item component');
  }
  return context;
}
