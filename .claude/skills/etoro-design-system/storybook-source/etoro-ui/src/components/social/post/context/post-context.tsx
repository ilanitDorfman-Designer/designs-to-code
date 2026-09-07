import { createContext, useContext } from 'react';

// ============================================================================
// Context Value Interface
// ============================================================================

/**
 * Context value for sharing post state with subcomponents
 */
export interface PostContextValue {
  // -------------------------------------------------------------------------
  // User Information
  // -------------------------------------------------------------------------

  /** User display name (e.g., full name or username) */
  displayName: string;

  /** User avatar image URL */
  avatar: string;

  /** User location */
  location?: string;

  // -------------------------------------------------------------------------
  // Post Content
  // -------------------------------------------------------------------------

  /** Post text content */
  text: string;

  /** Formatted timestamp */
  timestamp: string;

  /** Whether post has been edited */
  isEdited: boolean;

  // -------------------------------------------------------------------------
  // Text Config
  // -------------------------------------------------------------------------

  /** Maximum lines before truncation (passed to EtReadMoreText) */
  maxLines: number;

  // -------------------------------------------------------------------------
  // Interaction Handlers
  // -------------------------------------------------------------------------

  /** Post press handler */
  onPress?: () => void;

  /** User zone press handler (avatar, display name, location, timestamp) */
  onUserPress?: () => void;

  /** Menu handler */
  onMenuPress?: () => void;

  /** Empty header space press handler (between user zone and menu icon) */
  onHeaderPress?: () => void;

  /** Whether haptics are enabled */
  haptics: boolean;
}

// ============================================================================
// Context
// ============================================================================

/**
 * Context for sharing post state with subcomponents
 */
export const PostContext = createContext<PostContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access post context from subcomponents
 *
 * @throws Error if used outside of EtPost
 * @returns PostContextValue
 *
 * @example
 * ```tsx
 * function PostHeader() {
 *   const { displayName, avatar } = usePostContext();
 *   return <Text>{displayName}</Text>;
 * }
 * ```
 */
export function usePostContext(): PostContextValue {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error(
      'EtPost compound components must be used within an EtPost component. ' +
        'Make sure you are rendering EtPost.Header, EtPost.Body, etc. ' +
        'inside an <EtPost> parent.',
    );
  }

  return context;
}
