import { useMemo } from 'react';

import { PollAnswer } from '../api';

export interface PollStats {
  totalVotes: number;
  answersWithPercentages: Array<PollAnswer & { percentage: number }>;
}

/**
 * Hook to calculate poll statistics and percentages
 * @param answers - Array of poll answers with optional votes
 * @returns Object with totalVotes and answersWithPercentages
 */
export function usePollStats(answers: PollAnswer[]): PollStats {
  // Calculate total votes from all answers (with null guard)
  const totalVotes = useMemo(() => (answers ?? []).reduce((sum, answer) => sum + (answer.votes ?? 0), 0), [answers]);

  // Calculate percentages for each answer (with null guard)
  const answersWithPercentages = useMemo(
    () =>
      (answers ?? []).map((answer) => ({
        ...answer,
        percentage: answer.percentage ?? (answer.votes && totalVotes > 0 ? (answer.votes / totalVotes) * 100 : 0),
      })),
    [answers, totalVotes],
  );

  return { totalVotes, answersWithPercentages };
}
