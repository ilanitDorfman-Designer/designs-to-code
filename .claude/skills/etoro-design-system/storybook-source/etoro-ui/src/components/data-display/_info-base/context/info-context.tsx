import { createContext, useContext } from 'react';

/**
 * Creates a typed context and hook for an info component.
 * Used by EtAssetInfo and EtUserInfo to avoid duplicating context logic.
 */
export function createInfoContext<T>(componentName: string) {
  const Context = createContext<T | null>(null);

  function useInfoContext(): T {
    const value = useContext(Context);
    if (!value) {
      throw new Error(`[use${componentName}Context]: must be used within an ${componentName} component`);
    }
    return value;
  }

  return { Context, useInfoContext };
}
