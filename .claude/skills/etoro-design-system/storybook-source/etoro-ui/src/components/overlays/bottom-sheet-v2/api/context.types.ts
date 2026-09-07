// ============================================================================
// Context Types
// ============================================================================

/**
 * Static configuration context value (rarely changes)
 */
export interface BottomSheetConfigContextValue {
  /** Show drag handle indicator */
  showHandle: boolean;
  /** Close on backdrop tap */
  closeOnBackdrop: boolean;
  /** Enable pan down to close */
  enablePanDownToClose: boolean;
  /** Theme colors */
  colors: {
    background: string;
    handle: string;
    text: string;
    textSecondary: string;
    divider: string;
  };
}

/**
 * Dynamic state context value (changes on interaction)
 */
export interface BottomSheetStateContextValue {
  /** Whether sheet is currently presented */
  isPresented: boolean;
  /** Whether sheet is in loading state */
  isLoading: boolean;
  /**
   * Raw imperative dismiss - directly calls the library's dismiss method.
   * Use this when you need direct control over the sheet.
   */
  dismiss: () => void;
  /**
   * Semantic close handler for subcomponents (e.g., close button).
   * Prefer this over dismiss for user-initiated close actions.
   */
  handleClose: () => void;
}
