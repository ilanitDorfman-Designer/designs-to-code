import { PollProvider } from './context';
import {
  PollFooterContent,
  PollFooterDivider,
  PollFrame,
  PollOptionsList,
  PollQuestion,
  PollResultOption,
  PollUndoButton,
  PollVotableOption,
  PollVoteCount,
  PollVoterAvatars,
} from './subcomponents';

/**
 * EtPoll - Compound component for building interactive polls
 *
 * @example
 * ```tsx
 * <EtPoll answers={answers} voteCount={0} onVote={handleVote}>
 *   <EtPoll.Frame>
 *     <EtPoll.Question>What's your investing style?</EtPoll.Question>
 *     <EtPoll.OptionsList>
 *       {answers.map((a) => (
 *         <EtPoll.VotableOption key={a.id} answerId={a.id} />
 *       ))}
 *     </EtPoll.OptionsList>
 *     <EtPoll.FooterContent>
 *       <EtPoll.VoteCount />
 *     </EtPoll.FooterContent>
 *   </EtPoll.Frame>
 * </EtPoll>
 * ```
 */
export const EtPoll = Object.assign(PollProvider, {
  Frame: PollFrame,
  Question: PollQuestion,
  VotableOption: PollVotableOption,
  ResultOption: PollResultOption,
  OptionsList: PollOptionsList,
  VoteCount: PollVoteCount,
  VoterAvatars: PollVoterAvatars,
  UndoButton: PollUndoButton,
  FooterDivider: PollFooterDivider,
  FooterContent: PollFooterContent,
  displayName: 'EtPoll',
});
