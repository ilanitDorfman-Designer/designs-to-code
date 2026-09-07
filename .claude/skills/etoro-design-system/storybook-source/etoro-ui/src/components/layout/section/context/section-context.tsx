import { createContext, useContext } from 'react';

/**
 * Context value for sharing section state with subcomponents
 * Currently minimal as EtSection is a simple layout component
 */
export interface SectionContextValue {
  /** Theme text color for title */
  textColor: string;
}

/**
 * Context for sharing section state with subcomponents
 */
export const SectionContext = createContext<SectionContextValue | null>(null);

/**
 * Hook to access section context from subcomponents
 * @throws Error if used outside of EtSection
 */
export function useSectionContext(): SectionContextValue {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('EtSection compound components must be used within an EtSection component');
  }
  return context;
}
