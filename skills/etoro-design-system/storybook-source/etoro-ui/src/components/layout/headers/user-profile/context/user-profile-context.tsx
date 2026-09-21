import { createContext, useContext } from 'react';

import { UserProfileHeaderUser } from '../api';

export interface UserProfileContextValue {
  user: UserProfileHeaderUser;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

/**
 * Hook to access user profile data from context.
 * Must be used within EtUserProfileHeader.
 */
export function useUserProfileContext(): UserProfileContextValue {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('EtUserProfileHeader compound components must be used within EtUserProfileHeader');
  }
  return context;
}

export const UserProfileProvider = UserProfileContext.Provider;
