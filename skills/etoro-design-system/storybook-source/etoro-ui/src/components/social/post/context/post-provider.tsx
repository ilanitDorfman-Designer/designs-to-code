import { PropsWithChildren, useMemo } from 'react';

import { EtPostProps } from '../api/types';
import { PostContext, PostContextValue } from './post-context';

// ============================================================================
// Types
// ============================================================================

export interface PostProviderProps
  extends PropsWithChildren,
    Omit<EtPostProps, 'children' | 'style' | 'testID' | 'accessibilityLabel' | 'accessibilityHint'> {
  /** Maximum lines before truncation (passed through to EtReadMoreText) */
  maxLines: number;
}

// ============================================================================
// Provider
// ============================================================================

/**
 * Provider component for EtPost context
 *
 * Handles memoization of context value internally, following the pattern
 * used by ChipProvider and RadioGroupProvider.
 *
 * Engagement counts and actions (likes, comments, shares, save) are not part of this
 * context — they are composed via `EtPost.Footer` children per `EtPostProps`. Context
 * holds shared header/body state and handlers (`onHeaderPress`, menu, haptics, etc.).
 */
export function PostProvider({
  children,
  displayName,
  avatar,
  location,
  text,
  timestamp,
  isEdited,
  onPress,
  onUserPress,
  onMenuPress,
  onHeaderPress,
  haptics,
  maxLines,
}: PostProviderProps) {
  const contextValue = useMemo<PostContextValue>(
    () => ({
      displayName,
      avatar,
      location,
      text,
      timestamp,
      isEdited: isEdited ?? false,
      maxLines,
      onPress,
      onUserPress,
      onMenuPress,
      onHeaderPress,
      haptics: haptics !== false,
    }),
    [displayName, avatar, location, text, timestamp, isEdited, maxLines, onPress, onUserPress, onMenuPress, onHeaderPress, haptics],
  );

  return <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>;
}
