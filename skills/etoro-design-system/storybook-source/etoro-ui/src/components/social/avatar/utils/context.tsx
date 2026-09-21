import { createContext, useContext } from 'react';

import type { AvatarContextValue, AvatarSize } from './types';

/**
 * Context for sharing avatar state with subcomponents
 */
export const AvatarContext = createContext<AvatarContextValue | null>(null);

/**
 * Hook to access avatar context from subcomponents
 * @throws Error if used outside of EtAvatar
 */
export function useAvatarContext(): AvatarContextValue {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('EtAvatar compound components must be used within an EtAvatar component');
  }
  return context;
}

/**
 * Value published by `EtAvatar.Group` to cascade a size to its children.
 */
export interface AvatarGroupContextValue {
  size: AvatarSize;
}

/**
 * Context for cascading the group's size to avatars nested inside `EtAvatar.Group`.
 * `null` when not inside a group.
 */
export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

/**
 * Hook to read the enclosing `EtAvatar.Group` context, if any.
 * Returns `null` when the avatar is not rendered inside a group.
 */
export function useAvatarGroupContext(): AvatarGroupContextValue | null {
  return useContext(AvatarGroupContext);
}
