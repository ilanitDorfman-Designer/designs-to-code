import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../../../core/hooks/use-etoro-theme';
import { X2, X4 } from '../../../../../../core/styles/spacing';
import { EtText } from '../../../../../../foundations/text/et-text';
import { usePollContext } from '../context';

const FADE_DURATION = 300;

/**
 * EtPoll.UndoButton - Button to undo vote
 */
function PollUndoButtonComponent() {
  const { actions } = usePollContext();
  const { colors } = useEtoroTheme();
  const { t } = useTranslation('feed');

  return (
    <Animated.View entering={FadeIn.duration(FADE_DURATION)} exiting={FadeOut.duration(FADE_DURATION)}>
      <Pressable
        style={styles.button}
        onPress={actions.undo}
        accessibilityRole="button"
        accessibilityLabel={t('poll.undoVoteAccessibility')}
        testID="poll-undo-button"
      >
        <EtText variant="label-tertiary-semibold" style={{ color: colors.verdictPositive600 }}>
          {t('poll.undo')}
        </EtText>
      </Pressable>
    </Animated.View>
  );
}

export const PollUndoButton = memo(PollUndoButtonComponent);
PollUndoButton.displayName = 'EtPoll.UndoButton';

const styles = StyleSheet.create({
  button: {
    paddingLeft: X4,
    paddingVertical: X2,
    borderRadius: 36,
  },
});
