import { createContext, useContext } from 'react';

/**
 * Context value for sharing component state with subcomponents
 */
export interface TextCopyButtonContextValue {
  /** Whether the copy action was successful */
  isCopied: boolean;
  /** Icon color */
  iconColor: string;
  /** Text color */
  textColor: string;
}

/**
 * Context for sharing component state with subcomponents
 */
export const TextCopyButtonContext = createContext<TextCopyButtonContextValue | null>(null);

/**
 * Hook to access component context from subcomponents
 * @throws Error if used outside of EtTextCopyButton
 */
export function useTextCopyButtonContext(): TextCopyButtonContextValue {
  const context = useContext(TextCopyButtonContext);
  if (!context) {
    throw new Error('EtTextCopyButton compound components must be used within an EtTextCopyButton component');
  }
  return context;
}
