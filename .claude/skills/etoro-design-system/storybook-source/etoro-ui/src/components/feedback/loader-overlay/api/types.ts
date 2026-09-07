import type { ReactNode } from 'react';

export interface LoaderOverlayContextValue {
  isVisible: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

export interface LoaderOverlayProviderProps {
  children: ReactNode;
}
