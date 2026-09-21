import { createContext, ReactNode, useContext, useMemo } from 'react';

import { useColorExtraction } from '../hooks';
import { CryptoCardContextValue } from './types';

/**
 * Internal context for EtCryptoCard compound component.
 */
export const CryptoCardContext = createContext<CryptoCardContextValue | null>(null);

/**
 * Hook to access CryptoCard context.
 * Must be used within an EtCryptoCard component.
 *
 * @throws Error if used outside of EtCryptoCard
 */
export function useCryptoCardContext(): CryptoCardContextValue {
  const context = useContext(CryptoCardContext);
  if (!context) {
    throw new Error(
      'useCryptoCardContext must be used within an EtCryptoCard component. ' +
        'Make sure EtCryptoCard.Logo, EtCryptoCard.Info, etc. ' +
        'are children of EtCryptoCard.',
    );
  }
  return context;
}

// ============================================================================
// Context Provider
// ============================================================================

interface CryptoCardProviderProps {
  logoUrl: string;
  backgroundColor?: string;
  testID?: string;
  children: ReactNode;
}

/**
 * Provider component that shares data with subcomponents.
 * Minimal - only provides logoUrl and color.
 */
export function CryptoCardProvider({ logoUrl, backgroundColor, testID, children }: CryptoCardProviderProps) {
  const { color: extractedColor } = useColorExtraction(logoUrl);
  const color = backgroundColor ?? extractedColor;
  const surfaceTestID = testID ? `${testID}-surface` : undefined;

  const contextValue: CryptoCardContextValue = useMemo(
    () => ({
      logoUrl,
      color,
      surfaceTestID,
    }),
    [logoUrl, color, surfaceTestID],
  );

  return <CryptoCardContext.Provider value={contextValue}>{children}</CryptoCardContext.Provider>;
}
