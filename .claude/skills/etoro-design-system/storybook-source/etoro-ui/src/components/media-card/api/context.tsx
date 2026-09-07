import { createContext, ReactNode, useContext, useMemo } from 'react';

import type { MediaCardContextValue } from './types';

export const MediaCardContext = createContext<MediaCardContextValue | null>(null);

/**
 * Access EtMediaCard context from compound subcomponents.
 * @throws if used outside of EtMediaCard
 */
export function useMediaCardContext(): MediaCardContextValue {
  const context = useContext(MediaCardContext);
  if (!context) {
    throw new Error(
      'EtMediaCard compound components must be used within an EtMediaCard. ' +
        'Make sure EtMediaCard.Header / Content / Footer / Logo / Title / Subtitle are children of EtMediaCard.',
    );
  }
  return context;
}

interface MediaCardProviderProps {
  value: MediaCardContextValue;
  children: ReactNode;
}

export function MediaCardProvider({ value, children }: MediaCardProviderProps) {
  const memoized = useMemo(() => value, [value]);
  return <MediaCardContext.Provider value={memoized}>{children}</MediaCardContext.Provider>;
}
