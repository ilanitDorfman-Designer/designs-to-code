import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { LoaderOverlay } from '../loader-overlay';
import type { LoaderOverlayContextValue, LoaderOverlayProviderProps } from './types';

const LoaderOverlayContext = createContext<LoaderOverlayContextValue | null>(null);

export function useLoaderContext(): LoaderOverlayContextValue {
  const context = useContext(LoaderOverlayContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderOverlayProvider. Wrap your app with <LoaderOverlayProvider>.');
  }
  return context;
}

export function LoaderOverlayProvider({ children }: LoaderOverlayProviderProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showLoader = useCallback(() => setIsVisible(true), []);
  const hideLoader = useCallback(() => setIsVisible(false), []);

  const contextValue = useMemo<LoaderOverlayContextValue>(() => ({ isVisible, showLoader, hideLoader }), [isVisible, showLoader, hideLoader]);

  return (
    <LoaderOverlayContext.Provider value={contextValue}>
      {children}
      <LoaderOverlay visible={isVisible} />
    </LoaderOverlayContext.Provider>
  );
}
