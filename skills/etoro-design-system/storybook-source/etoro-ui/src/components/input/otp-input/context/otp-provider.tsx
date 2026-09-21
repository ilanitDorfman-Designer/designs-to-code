import { PropsWithChildren, useMemo } from 'react';

import { OtpContextValue, OtpInputSize } from '../api/types';
import { OtpContext } from './otp-context';

export interface OtpProviderProps extends PropsWithChildren {
  value: string;
  isFocused: boolean;
  isSecure: boolean;
  error: boolean;
  disabled: boolean;
  size: OtpInputSize;
  length: number;
  toggleSecure: () => void;
  iconColor: string;
  pasteFromClipboard: () => Promise<void>;
}

export function OtpProvider({
  children,
  value,
  isFocused,
  isSecure,
  error,
  disabled,
  size,
  length,
  toggleSecure,
  iconColor,
  pasteFromClipboard,
}: OtpProviderProps) {
  const contextValue = useMemo<OtpContextValue>(
    () => ({
      value,
      isFocused,
      isSecure,
      error,
      disabled,
      size,
      length,
      toggleSecure,
      iconColor,
      pasteFromClipboard,
    }),
    [value, isFocused, isSecure, error, disabled, size, length, toggleSecure, iconColor, pasteFromClipboard],
  );

  return <OtpContext.Provider value={contextValue}>{children}</OtpContext.Provider>;
}
