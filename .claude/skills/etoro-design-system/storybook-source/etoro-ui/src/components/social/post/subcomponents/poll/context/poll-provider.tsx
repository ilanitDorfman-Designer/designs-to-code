import { ReactNode, useMemo } from 'react';

import { PollAnswer } from '../api';
import { usePollProviderState } from '../hooks/use-poll-provider-state';
import { PollContext } from './poll-context';

export interface PollProviderProps {
  /** Poll answers data */
  answers: PollAnswer[];
  /** Callback when answer is selected (optional - provider manages internal state) */
  onVote?: (answerId: string) => void;
  /** Callback when undo is pressed (optional) */
  onUndo?: () => void;
  /** Avatar URLs (max 3) */
  avatarUrls?: string[];
  /** Additional voters count */
  additionalVotersCount?: number;
  /** Total vote count */
  voteCount?: number;
  /** Question text (optional) */
  question?: string;
  /** Controlled selected ID (optional - uses internal state if not provided) */
  selectedId?: string;
  /** Force results view even without a vote (e.g. poll creator). */
  showResults?: boolean;
  /** Children components */
  children: ReactNode;
}

/**
 * Provider component that manages poll state and makes it available to subcomponents
 * All business logic is handled by usePollProviderState hook
 */
export function PollProvider({
  answers = [],
  onVote,
  onUndo,
  avatarUrls = [],
  additionalVotersCount = 0,
  voteCount = 0,
  question,
  selectedId: controlledSelectedId,
  showResults,
  children,
}: PollProviderProps) {
  const { state, actions, meta } = usePollProviderState({
    answers,
    question,
    voteCount,
    controlledSelectedId,
    onVote,
    onUndo,
    avatarUrls,
    additionalVotersCount,
    showResults,
  });

  const contextValue = useMemo(
    () => ({
      state,
      actions,
      meta,
    }),
    [state, actions, meta],
  );

  return <PollContext.Provider value={contextValue}>{children}</PollContext.Provider>;
}
