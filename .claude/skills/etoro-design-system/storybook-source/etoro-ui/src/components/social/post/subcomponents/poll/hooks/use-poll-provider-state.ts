import { useCallback, useEffect, useState } from 'react';

import { PollAnswer } from '../api';
import { PollActions, PollMeta, PollState } from '../context/poll-context';
import { usePollStats } from './use-poll-stats';

export interface UsePollProviderStateParams {
  answers: PollAnswer[];
  question?: string;
  voteCount?: number;
  controlledSelectedId?: string;
  onVote?: (answerId: string) => void;
  onUndo?: () => void;
  avatarUrls?: string[];
  additionalVotersCount?: number;
  /** Force results view even without a vote (e.g. poll creator). */
  showResults?: boolean;
}

export interface PollProviderState {
  state: PollState;
  actions: PollActions;
  meta: PollMeta;
}

/**
 * Hook that manages poll provider state and configuration
 * Extracts all business logic from PollProvider component
 */
export function usePollProviderState({
  answers,
  question,
  voteCount = 0,
  controlledSelectedId,
  onVote,
  onUndo,
  avatarUrls = [],
  additionalVotersCount = 0,
  showResults = false,
}: UsePollProviderStateParams): PollProviderState {
  // Ensure answers is always an array
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const { answersWithPercentages } = usePollStats(safeAnswers);

  // Internal state (used when not controlled)
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>();

  useEffect(() => {
    setInternalSelectedId(controlledSelectedId);
  }, [controlledSelectedId]);

  // Use controlled or internal state
  const selectedId = controlledSelectedId ?? internalSelectedId;
  const hasVoted = selectedId != null;

  // Actions
  const vote = useCallback(
    (answerId: string) => {
      if (controlledSelectedId === undefined) {
        setInternalSelectedId(answerId);
      }
      onVote?.(answerId);
    },
    [controlledSelectedId, onVote],
  );

  const undo = useCallback(() => {
    if (controlledSelectedId === undefined) {
      setInternalSelectedId(undefined);
    }
    onUndo?.();
  }, [controlledSelectedId, onUndo]);

  const state: PollState = {
    question,
    answers: answersWithPercentages,
    voteCount,
    selectedId,
    hasVoted,
    showResults: showResults || hasVoted,
  };

  const actions: PollActions = {
    vote,
    undo,
  };

  const meta: PollMeta = {
    avatarUrls,
    additionalVotersCount,
  };

  return {
    state,
    actions,
    meta,
  };
}
