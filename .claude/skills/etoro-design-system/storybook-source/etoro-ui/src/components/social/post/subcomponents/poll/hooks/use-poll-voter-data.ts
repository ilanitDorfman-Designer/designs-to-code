import { useMemo } from 'react';

import { usePollContext } from '../context';

const MAX_VISIBLE_AVATARS = 3;

export interface PollVoterData {
  visibleAvatars: string[];
  additionalVotersCount: number;
  shouldRender: boolean;
}

/**
 * Hook to get voter avatar data from context
 * Handles slicing, empty state check, and data preparation
 */
export function usePollVoterData(): PollVoterData {
  const { state, meta } = usePollContext();

  return useMemo(() => {
    const visibleAvatars = meta.avatarUrls.slice(0, MAX_VISIBLE_AVATARS);
    // Guard the fallback against a non-finite `voteCount` (NaN/±Infinity) so a bad
    // upstream value does not propagate as `NaN` into the UI/derived flags below.
    const fallbackCount = Number.isFinite(state.voteCount) ? Math.max(0, state.voteCount - visibleAvatars.length) : 0;
    const additionalVotersCount = meta.additionalVotersCount > 0 ? meta.additionalVotersCount : fallbackCount;
    const shouldRender = visibleAvatars.length > 0 || additionalVotersCount > 0;

    return {
      visibleAvatars,
      additionalVotersCount,
      shouldRender,
    };
  }, [meta.avatarUrls, meta.additionalVotersCount, state.voteCount]);
}
