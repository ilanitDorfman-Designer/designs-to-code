import { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../../../core/hooks/use-etoro-theme';
import { X2, X5, X9 } from '../../../../../../core/styles/spacing';
import { EtText } from '../../../../../../foundations/text/et-text';
import { PollVotableOptionProps } from '../api';
import { usePollContext } from '../context';

const FADE_DURATION = 300;

/**
 * EtPoll.VotableOption - Answer option before voting
 * Simple pill button for voting
 */
function PollVotableOptionComponent({ answerId, testID }: PollVotableOptionProps) {
  const { state, actions } = usePollContext();
  const { colors } = useEtoroTheme();

  const handlePress = useCallback(() => {
    actions.vote(answerId);
  }, [actions, answerId]);

  const answer = state.answers.find((a) => a.id === answerId);
  if (!answer) return null;

  return (
    <Animated.View entering={FadeIn.duration(FADE_DURATION)} exiting={FadeOut.duration(FADE_DURATION)}>
      <Pressable
        style={[styles.option, { backgroundColor: `${colors.carbon900}14` }]}
        onPress={handlePress}
        testID={testID}
        accessibilityLabel={answer.value}
        accessibilityRole="button"
      >
        <EtText variant="body-secondary-medium" style={{ color: colors.carbon900 }}>
          {answer.value}
        </EtText>
      </Pressable>
    </Animated.View>
  );
}

export const PollVotableOption = memo(PollVotableOptionComponent);
PollVotableOption.displayName = 'EtPoll.VotableOption';

const styles = StyleSheet.create({
  option: {
    justifyContent: 'center',
    paddingVertical: X2,
    paddingHorizontal: X5,
    borderRadius: X9,
    minWidth: 72,
    width: '100%',
  },
});
