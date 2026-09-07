import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import { EtText } from '../../../../../../foundations/text/et-text';
import { usePollContext } from '../context';

const FADE_DURATION = 300;

/**
 * EtPoll.VoteCount - Simple vote count display
 * Shows "X Votes" or "1 Vote"
 */
function PollVoteCountComponent() {
  const { state } = usePollContext();
  const { t } = useTranslation('feed');
  const voteCount = Number.isFinite(state.voteCount) ? state.voteCount : 0;

  return (
    <Animated.View entering={FadeIn.duration(FADE_DURATION)} testID="poll-vote-count">
      <EtText variant="label-tertiary-regular">{t('poll.voteCount', { count: voteCount })}</EtText>
    </Animated.View>
  );
}

export const PollVoteCount = memo(PollVoteCountComponent);
PollVoteCount.displayName = 'EtPoll.VoteCount';
