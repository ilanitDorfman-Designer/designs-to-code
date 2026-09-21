import { createContext, useContext } from 'react';

import { OtpContextValue } from '../api/types';

/**
 * Context for sharing OTP input state with subcomponents (Toggle, Cell).
 * Single context is sufficient — OTP updates are bounded (max 16 chars).
 */
export const OtpContext = createContext<OtpContextValue | null>(null);

/**
 * Hook to access OTP context from subcomponents.
 * @throws Error if used outside of EtOtpInput
 */
export function useOtpContext(): OtpContextValue {
  const context = useContext(OtpContext);
  if (!context) {
    throw new Error('EtOtpInput compound components must be used within an EtOtpInput component');
  }
  return context;
}
