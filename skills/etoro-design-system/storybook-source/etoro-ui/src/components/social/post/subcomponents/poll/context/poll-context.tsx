import { createContext, useContext } from 'react';

import { PollAnswer } from '../api';

/**
 * Poll state
 */
export interface PollState {
  question?: string;
  answers: Array<PollAnswer & { percentage: number }>;
  voteCount: number;
  selectedId?: string;
  hasVoted: boolean;
  /** When true, show results view even if the user hasn't voted (e.g. poll creator). */
  showResults: boolean;
}

/**
 * Poll actions
 */
export interface PollActions {
  vote: (answerId: string) => void;
  undo: () => void;
}

/**
 * Poll metadata
 */
export interface PollMeta {
  avatarUrls: string[];
  additionalVotersCount: number;
}

/**
 * Context value for sharing poll state with all subcomponents
 */
export interface PollContextValue {
  state: PollState;
  actions: PollActions;
  meta: PollMeta;
}

/**
 * Context for sharing poll state with subcomponents
 */
export const PollContext = createContext<PollContextValue | null>(null);

/**
 * Hook to access poll context from subcomponents
 * @throws Error if used outside of PollProvider
 */
export function usePollContext(): PollContextValue {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('EtPoll subcomponents must be used within a PollProvider');
  }
  return context;
}
